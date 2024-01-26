const sqlConfig = require('../../sqlConfig');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');

/**
 * Add new grocery items to the system.
 * Allowed only for 'admin' user.
 * Takes list of grocery items.
 * @param {*} req
 * @param {*} res
 * @return {*} 
 */
async function addNewGroceries(req, res) {

    const groceryItems = req.body;

    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to perform this operation.' })
        }

        // Grocery list is empty
        if (!(groceryItems.length > 0)) {
            return res.status(400).json({ message: 'Grocery list is empty' });
        }

        await sql.connect(sqlConfig);
        const addedItems = [];
        for await(let item of groceryItems){
            const newUid = await addItem(item, req.user.userId);
            addedItems.push(newUid);
        }

        const result = await sql.query(`select * from Grocery_Items where uid in ('${addedItems.join("','")}')`)

        res.status(200).json({ success: true, message: 'Operation successful', addedGroceries: [...result.recordset]});

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error during add new groceries',  });
    } finally {
        await sql.close();
    }
}

/**
 * Add item to groceries.
 * @param {*} item
 * @param {*} userId
 */
async function addItem(item, userId) {
    try {
        const newUid = uuidv4();
        const ps = new sql.PreparedStatement();
        ps.input('itemName', sql.VarChar(255));
        ps.input('price', sql.Money);
        ps.input('quantity', sql.Int);
        ps.input('userId', sql.Int);
        ps.input('uid', sql.UniqueIdentifier);

        await ps.prepare(`
            INSERT INTO Grocery_Items (uid, grocery_name, price, inventory_quantity, added_by_user_id, date_added, active_status, is_grocery_available)
            VALUES (@uid, @itemName, @price, @quantity, @userId, GETDATE(), 1, 1)
            `);

        await ps.execute({
            itemName: item.name,
            price: item.price,
            quantity: item.quantity,
            userId: userId,
            uid: newUid
        });

        await ps.unprepare();

        return newUid;

    } catch (error) {
        console.error('Error during database operation:', error.message);
        throw error; // Propagate the error
    }
}


module.exports = addNewGroceries;