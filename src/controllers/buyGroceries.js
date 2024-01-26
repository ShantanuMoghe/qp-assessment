const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');
const { v4: uuidv4 } = require('uuid');

async function buyGroceries(req, res) {
    try {
        //This will be array of order details.
        //orderDetails:[{itemUid, orderQuantity}]
        const orderDetails = req.body;
        const userId = req.user.userId;
        await sql.connect(sqlConfig);

        for await (let itemDetails of orderDetails) {
            const currentOrderDetails = await getGroceryItemDetailsByUid(itemDetails.uid);
            if (itemDetails.orderQuantity <= currentOrderDetails.inventory_quantity) {
                await bookGroceryItem(currentOrderDetails, itemDetails.orderQuantity, userId);
            }
        }

        res.status(200).json({ success: true, message: 'Operation successful' });

    } catch (error) {
        throw error;
    } finally {
        sql.close();
    }
}

/**
 * get grocery item details by its uid.
 * @param {*} uid
 * @return {*} 
 */
async function getGroceryItemDetailsByUid(uid) {
    try {
        const result = await sql.query(`select * from Grocery_Items 
        where uid = '${uid}'
        and active_status = 1 
        and is_grocery_available = 1`);

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}

async function bookGroceryItem(itemDetails, requestedQuantity, userId) {
    const transaction = new sql.Transaction();
    await transaction.begin();
    try {

        const isAvailable = itemDetails.inventory_quantity === 1 || itemDetails.inventory_quantity === requestedQuantity;

        const updateInventoryQuery = `Update Grocery_Items
        set inventory_quantity = inventory_quantity - @requestedQuantity,
        is_grocery_available = @isAvailable,
        updated_by_user_id = @userId,
        date_updated = getDate()
        where uid = @uid and active_status = 1`;

        await transaction.request()
            .input('requestedQuantity', sql.Int, requestedQuantity)
            .input('isAvailable', sql.Bit, !isAvailable)
            .input('uid', sql.UniqueIdentifier, itemDetails.uid)
            .input('userId', sql.Int, userId)
            .query(updateInventoryQuery);

        const insertTransactionDetails = `Insert into Order_Details
        (uid, grocery_item_uid, user_id, item_quantity, total_amount, rate_per_item, order_date, active_status)
        values(@transactionUid, @itemUid, @userId, @quantity, @totalAmount, @rate, getDate(), 1)`

        await transaction.request()
            .input('transactionUid', sql.UniqueIdentifier, uuidv4())
            .input('itemUid', sql.UniqueIdentifier, itemDetails.uid)
            .input('userId', sql.Int, userId)
            .input('quantity', sql.Int, requestedQuantity)
            .input('totalAmount', sql.Money, (requestedQuantity * itemDetails.price))
            .input('rate', sql.Money, itemDetails.price)
            .query(insertTransactionDetails);

        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = buyGroceries;