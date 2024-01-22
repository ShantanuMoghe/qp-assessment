const express = require('express');
const { verifyToken } = require('../tokenService');
const {login, register, addNewGroceries, updateGroceries}= require('./controllers/controllers');

const router = express.Router();

// Apply the token verification middleware to all routes under '/api'
router.use('/api', verifyToken);

// Login route
router.post('/register', async (req, res) => {
    try {
        await register(req, res);
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).json({ message: 'Internal Server Error during registration' });
    }
});

// Register route
router.post('/login', async (req, res) => {
    try {
        await login(req, res);
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ message: 'Internal Server Error during login' });
    }
});

router.post('/api/add-new-groceries', async(req, res)=>{
    try{
        await addNewGroceries(req, res);
    } catch(error){
        console.error('Error in add-new-groceries route:', error);
        res.status(500).json({message: 'internal server Error during add new groceries'});
    }
})

router.post('/api/update-existing-groceries', async(req, res)=>{
    try{
        await updateGroceries(req, res);
    } catch(error){
        console.error('Error in update-existing-groceries route:', error);
        res.status(500).json({message: 'internal server Error during add new groceries'});
    }
})

module.exports = { router };
