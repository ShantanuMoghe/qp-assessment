const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');
/**
 * View the list of available grocery items
 */
async function getGroceries(req, res) {
    try {
        await sql.connect(sqlConfig);

        // Fetch groceries from the database with checks for active_status and is_grocery_available
        const result = await sql.query`
            SELECT * FROM Grocery_Items
            WHERE active_status = 1 AND is_grocery_available = 1;
        `;

        res.status(200).json({ success: true, groceries: result.recordset });
    } catch (error) {
        console.error('Error during getGroceries:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error while fetching groceries.' });
    } finally {
        await sql.close();
    }
}

module.exports = getGroceries;