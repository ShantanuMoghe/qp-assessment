const sqlConfig = require('../../sqlConfig');
const sql = require('mssql');

/**
 * Remove grocery items from the system
 * Only admin could remove.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteGroceryItems(req, res) {
    await sql.connect(sqlConfig);
    const transaction = new sql.Transaction();
    await transaction.begin();
    try {
        const itemToDeleteUid = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to perform this operation.' })
        }

        const deleteGroceryQuery =
            `UPDATE Grocery_Items 
                SET active_status = 0,
                is_grocery_available = 0,
                deleted_by_user_id = @userId,
                date_deleted = GETDATE()
                WHERE uid = @uid
                AND active_status = 1`

        await transaction.begin()
            .input('userId', sql.Int, req.user.userId)
            .input('uid', sql.UniqueIdentifier, itemToDeleteUid)
            .query(deleteGroceryQuery);

        transaction.commit();

    } catch (error) {
        transaction.rollback();
        throw error;
    } finally {
        sql.close();
    }
}

module.exports = deleteGroceryItems;