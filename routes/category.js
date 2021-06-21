const express = require('express');
const ROUTE = express.Router();
const ROLES = require('../services/roles');
const authorize = require('../services/authorization');
const { addProductCategory, getAllCategories } = require('../controllers/category');


ROUTE.post('/add-category/:parent_id?', authorize(ROLES.Admin), addProductCategory);
ROUTE.get('/get-categories/:parent_id?', authorize([ROLES.Admin,ROLES.User]), getAllCategories);

module.exports = ROUTE;

