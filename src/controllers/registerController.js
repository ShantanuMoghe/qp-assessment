const bcrypt = require('bcrypt');
const sql = require('mssql');  // Ensure you have this import
const sqlConfig = require('../../sqlConfig');
const tokenService = require('../../tokenService');
require('dotenv').config();

async function register(req, res) {
    const { username, password, firstName, lastName, userRole } = req.body;

    try {
        // Open SQL Server connection
        await sql.connect(sqlConfig);

        // Check if the username is already taken
        const existingUser = await sql.query(`SELECT * FROM User_Details 
        WHERE user_name = '${username.trim()}' and active_status=1`);

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        //Create new User Id
        const newUserId = await getNewUserId();

        const isUserAdmin = userRole && userRole.trim() === 'admin' ? 1 : 0;

        // Insert the new user into the database
        const result = await sql.query(`
        INSERT INTO User_Details (user_id, user_name, password, first_name, last_name, user_role, date_of_creation, active_status)
        VALUES (${newUserId}, '${username.trim()}', '${hashedPassword}', '${firstName.trim()}', '${lastName.trim()}', 
        ${isUserAdmin}, GETDATE(), 1)`);

        // Generate JWT token for the newly registered user
        const token = tokenService.generateToken(newUserId, userRole);
        res.json({ token });

    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Internal Server Error during registration' });
    } finally {
        // Close SQL Server connection
        await sql.close();
    }
}

async function getNewUserId() {
    try {
        const queryResult = await sql.query(`select (isnull(MAX(user_id), 0)+1) from User_Details`);
        return Object.values(queryResult.recordset[0])[0];
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Internal Server Error during registration' });
    }
}

module.exports = register;