const express = require('express');
const ROUTE = express.Router();

const { signup, login } = require('../controllers/admin');

ROUTE.post('/signup',signup);
ROUTE.post('/login',login);


module.exports = ROUTE;
