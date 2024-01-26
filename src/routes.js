const express = require('express');
const { verifyToken } = require('../tokenService');
const {
    login,
    register,
    addNewGroceries,
    updateGroceries,
    getGroceries,
    buyGroceries,
    deleteGroceryItems
} = require('./controllers/controllers');

const router = express.Router();

// Apply the token verification middleware to all routes under '/api'
router.use('/api', verifyToken);

/**
 * Register route
 * Body:
    {
        "username": "user1",
        "password": "123456",
        "firstName": "user",
        "lastName": "one",
        "userRole": "admin" or "user"
    }
 */
router.post('/register', async (req, res) => {
    try {
        await register(req, res);
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).json({ message: 'Internal Server Error during registration' });
    }
});

/**
 * Login route
 * Body:
    {
        "username": "user1",
        "password": "123456"
    }
 */
router.post('/login', async (req, res) => {
    try {
        await login(req, res);
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ message: 'Internal Server Error during login' });
    }
});

/**
 * Add new groceries route
 * Will require admin token.
 * Body:
    [
        {
            "name": "mobile",
            "price": 20000,
            "quantity": 1
        },
        {
            "name": "pin",
            "price": 19.88,
            "quantity": 10
        }
    ]
 */
router.post('/api/add-new-groceries', async (req, res) => {
    try {
        await addNewGroceries(req, res);
    } catch (error) {
        console.error('Error in add-new-groceries route:', error);
        res.status(500).json({ message: 'internal server Error during add new groceries' });
    }
});

/**
 * Update groceries route.
 * Will require admin token.
 * Body:
    [
        {
            "name": "mobile",
            "price": 29000,
            "quantity": 1,
            "uid": "A00327B2-6990-42BA-BAE7-BBD3708BE9AB",
            "number": 1
        }
    ]
 */
router.post('/api/update-existing-groceries', async (req, res) => {
    try {
        await updateGroceries(req, res);
    } catch (error) {
        console.error('Error in update-existing-groceries route:', error);
        res.status(500).json({ message: 'internal server Error during add new groceries' });
    }
});

/**
 * Get available groceries route.
 * Will need valid token.
 */
router.get('/api/get-available-groceries', async (req, res) => {
    try {
        await getGroceries(req, res);
    } catch (error) {
        console.error('Error in get-available-groceries route:', error);
        res.status(500).json({ message: 'internal server Error during get available groceries' });
    }
});

/**
 * Grocery items booking route.
 * Will require a valid token.
 * Body:
    [
        {
            "uid": "8637C7EB-7EF4-4717-B98F-1396EAB6CB34",
            "orderQuantity": 1
        }
    ]
 */
router.post('/api/grocery-items-booking', async (req, res) => {
    try {
        await buyGroceries(req, res);
    } catch (error) {
        console.error('Error in grocery-items-booking route:', error);
        res.status(500).json({ message: 'internal server Error' });
    }
});

/**
 * Delete item route.
 * Only admin could remove.
 * Body:
    {"8637C7EB-7EF4-4717-B98F-1396EAB6CB34"}
 */
router.post('/api/delete-grocery-item', async (req, res) => {
    try {
        await deleteGroceryItems(req, res);
    } catch (error) {
        console.error('Error in delete-grocery-item route:', error);
        res.status(500).json({ message: 'internal server Error' });
    }
});

module.exports = { router };
