require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/** Require all routes */
const USER_ROUTES = require('./routes/user');
const ADMIN_ROUTES = require('./routes/admin');
const PRODUCT_ROUTES = require('./routes/product');
const ORDER_ROUTES = require('./routes/order');
const CART_ROUTES = require('./routes/cart');
const CATEGORY_ROUTES = require('./routes/category');
const TRANSACTION_ROUTES = require('./routes/transaction');
const SUPPLIER_ROUTES = require('./routes/supplier');
const AVAILABILITY_ROUTES = require('./routes/availability');




mongoose.connect(process.env.MONGOURL,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(()=>console.log('Mongodb Connect Successflly!'))
.catch((err)=>console.log("Something Went Wrong. Exiting now... ",err));

/** Routes */
app.use('/user', USER_ROUTES);
app.use('/admin', ADMIN_ROUTES);
app.use('/product', PRODUCT_ROUTES);
app.use('/order', ORDER_ROUTES);
app.use('/cart', CART_ROUTES);
app.use('/category', CATEGORY_ROUTES);
app.use('/transection', TRANSACTION_ROUTES);
app.use('/supplier', SUPPLIER_ROUTES);
app.use('/availability', AVAILABILITY_ROUTES);

app.listen(process.env.PORT,()=>console.log('server running on port: ',process.env.PORT));