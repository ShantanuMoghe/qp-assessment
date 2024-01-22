const sqlConfig = require('../../sqlConfig');
const sql = require('mssql');

/**
 * Update groceries.
 * Allowed only for 'admin' user.
 * @param {*} req
 * @param {*} res
 * @return {*} 
 */
async function updateGroceries(req, res) {
    try {
        const groceryList = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to perform this operation.' })
        }

        // Grocery list is empty
        if (!(groceryList.length > 0)) {
            return res.status(400).json({ message: 'Grocery list is empty' });
        }

        await sql.connect(sqlConfig);

        const userId = req.user.userId;

        const nonExistingItems = [];

        for await (let groceryItem of groceryList) {
            const existingItem = await sql.query(`select * from Grocery_Items 
            where uid='${groceryItem.uid.trim()}' and active_status = 1`);

            if (!(existingItem.recordset.length > 0)) {
                nonExistingItems.push(groceryItem);
            } else {
                await sql.query(`
                UPDATE Grocery_Items 
                SET grocery_name = '${groceryItem.name.trim()}',
                price = ${+groceryItem.price},
                inventory_quantity = ${+groceryItem.quantity},
                updated_by_user_id = ${userId},
                date_updated = GETDATE()
                WHERE uid = '${groceryItem.uid.trim()}'
                AND active_status = 1
                AND grocery_number = ${groceryItem.number}
                `);
            }
        }

        if (nonExistingItems.length > 0) {
            res.status(200).json({ success: true, message: 'Some non-existing groceries found', nonExistingGroceries: [...nonExistingItems] });
        } else {
            res.status(200).json({ success: true, message: 'Operation successful' });
        }

    } catch (error) {
        console.error('Error during updateGroceries:', error.message);
        res.status(500).json({ message: 'Internal Server Error while updating groceries.' });
    } finally {
        sql.close();
    }
}

module.exports = updateGroceries;