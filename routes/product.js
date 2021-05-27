const express = require('express');
const ROUTE = express.Router();
const ROLES = require('../services/roles');
const authorize = require('../services/authorization');
const { addProduct, getAllProduct } = require('../controllers/product');

ROUTE.post('/add-product', authorize(ROLES.Admin), addProduct);
ROUTE.get('/get-all-products',getAllProduct);

module.exports = ROUTE;
