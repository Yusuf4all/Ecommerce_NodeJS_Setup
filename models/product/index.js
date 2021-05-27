const PRODUCT_MODEL = require('./product');

const PRODUCT_MODULE = {}

PRODUCT_MODULE.saveProduct = async function(data){
   return await PRODUCT_MODEL(data).save(); 
}

PRODUCT_MODULE.getAllProducts = async function(){
    return await PRODUCT_MODEL.find();
}

PRODUCT_MODULE.getProduct = async function(data){
    return await PRODUCT_MODEL.findOne(data);
}

module.exports = PRODUCT_MODULE;

