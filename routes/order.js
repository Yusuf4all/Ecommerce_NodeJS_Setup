const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const {  createOrder, cancelOrder, getAllOrder } = require('../controllers/order');

ROUTE.post('/create-order/:id',authorize(ROLES.User), createOrder);
ROUTE.get('/get-all-orders', authorize(ROLES.User), getAllOrder);
ROUTE.put('/cancel-order/:Order_Id', authorize(ROLES.User), cancelOrder);


module.exports = ROUTE;
