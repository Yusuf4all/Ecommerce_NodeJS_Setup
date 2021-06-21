const express = require('express');
const ROUTE = express.Router();
const ROLES = require('../services/roles');
const authorize = require('../services/authorization');
const { addProduct, getAllProduct, addUpdateReview, increaseProductQuantity, addUpdateDiscount, updateProduct } = require('../controllers/product');

ROUTE.post('/add-product/:category_id', authorize(ROLES.Admin), addProduct);
ROUTE.get('/get-all-products',getAllProduct);
ROUTE.put('/add-update-review/:product_id',authorize(ROLES.User), addUpdateReview);
ROUTE.put('/incress-product-quantity/:product_id',authorize(ROLES.Admin), increaseProductQuantity);
ROUTE.put('/add-update-discount/:product_id',authorize(ROLES.Admin), addUpdateDiscount);
ROUTE.put('/update-product/:product_id',authorize(ROLES.Admin), updateProduct);



module.exports = ROUTE;

