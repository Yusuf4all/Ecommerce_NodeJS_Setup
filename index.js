require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();

/** Require all routes */
const USER_ROUTES = require('./routes/user');
const ADMIN_ROUTES = require('./routes/admin');
const PRODUCT_ROUTES = require('./routes/product');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGOURL,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(()=>console.log('Mongodb Connect Successflly!'))
.catch((err)=>console.log("Something Went Wrong. Exiting now... ",err));

/** Routes */
app.use('/user', USER_ROUTES);
app.use('/admin', ADMIN_ROUTES);
app.use('/product', PRODUCT_ROUTES);


app.listen(process.env.PORT,()=>console.log('server running on port: ',process.env.PORT));