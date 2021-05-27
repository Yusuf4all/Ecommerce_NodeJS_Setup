const CART_MODEL = require('./cart');

const CART_MODULE = {};

CART_MODULE.createCart = async function(data){
    return await new CART_MODEL(data).save();
}

CART_MODULE.getCart = async function(data){
    return await CART_MODEL.findOne(data);
}

module.exports = CART_MODULE;