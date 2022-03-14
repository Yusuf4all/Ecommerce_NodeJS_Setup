const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const { addCard, makePayment } = require('../controllers/transection');

ROUTE.post('/add-card', authorize(ROLES.User), addCard);
ROUTE.put('/make-payment/:order_id', authorize(ROLES.User), makePayment)

module.exports = ROUTE;
