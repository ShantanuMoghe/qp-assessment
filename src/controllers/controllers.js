const login = require('./loginController');
const register = require('./registerController');
const addNewGroceries = require('./addGroceries');
const updateGroceries = require('./updateGroceries');
const getGroceries = require('./getGroceries');
const buyGroceries = require('./buyGroceries');
const deleteGroceryItems = require('./deleteGroceryItems');

module.exports = {
    login,
    register,
    addNewGroceries,
    updateGroceries,
    getGroceries,
    buyGroceries,
    deleteGroceryItems
};