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

PRODUCT_MODULE.updateProduct = async function(id, data){
    return await PRODUCT_MODEL.updateOne({_id: id}, data);
}

PRODUCT_MODULE.saveReview = async function(id, data){
    return await PRODUCT_MODEL.updateOne({ _id: id }, { $push: { Reviews: data } });
}

PRODUCT_MODULE.updateReview = async function(id, data){
    return await PRODUCT_MODEL.updateOne({ _id: id, "Reviews.User_Id": data.User_Id },  { $set: { Reviews : data } });
}

module.exports = PRODUCT_MODULE;

