const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const { addToCart, getCart, removeCartItem } = require('../controllers/cart');


ROUTE.put('/add-to-cart/:product_id', authorize(ROLES.User), addToCart);
ROUTE.get('/get-cart', authorize(ROLES.User), getCart);
ROUTE.put('/remove-item/:product_id', authorize(ROLES.User), removeCartItem);

module.exports = ROUTE;
