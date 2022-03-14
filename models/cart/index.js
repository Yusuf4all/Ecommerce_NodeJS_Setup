const CART_MODEL = require('./cart');

const CART_MODULE = {};

CART_MODULE.createCart = async function(data){
    return await new CART_MODEL(data).save();
}

CART_MODULE.getCart = async function(data){
    return await CART_MODEL.findOne(data);
}

CART_MODULE.updateCart = async function(id, data){
    return await CART_MODEL.updateOne({_id: id}, data);
}

CART_MODULE.removeItem = async function(User_Id, Product_Id){
    return await CART_MODEL.updateOne({User_Id: User_Id}, { $pull: { Products: Product_Id } });
}

module.exports = CART_MODULE;