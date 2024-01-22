const bcrypt = require('bcrypt');
const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');
const tokenService = require('../../tokenService');
require('dotenv').config();

/**
 * THis will create a JWT token for user.
 * @param {*} req
 * @param {*} res
 * @return {*} 
 */
async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Open SQL Server connection
        await sql.connect(sqlConfig);

        // Find user in the database
        const result = await sql.query(`SELECT * FROM User_Details 
        WHERE user_name = '${username.trim()}' and active_status=1`);

        const user = result.recordset[0];

        if (!user || !(await bcrypt.compare(password.trim(), user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = tokenService.generateToken(user.user_id, user.user_role=== 1 ? 'admin':'user');
        res.json({ token });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error during login' });
    } finally {
        // Close SQL Server connection
        await sql.close();
    }
}

module.exports = login;