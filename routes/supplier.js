const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const { register, signin, update } = require('../controllers/supplier');

ROUTE.post('/register', register);
ROUTE.post('/signin', signin);
ROUTE.put('/update', authorize(ROLES.Supplier), update);



module.exports = ROUTE;
