const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const { signup, verifyEmail, login, forgotPassword, resetPassword, createOrder, getAllOrder } = require('../controllers/user');

ROUTE.post('/signup',signup);
ROUTE.put('/verify-email/:Email',verifyEmail);
ROUTE.post('/login',login);
ROUTE.post('/forgot-password',forgotPassword);
ROUTE.put('/reset-password/:accessToken', resetPassword);
ROUTE.post('/create-order/:id',authorize(ROLES.User), createOrder);
ROUTE.get('/get-all-orders', authorize(ROLES.User), getAllOrder);

module.exports = ROUTE;
