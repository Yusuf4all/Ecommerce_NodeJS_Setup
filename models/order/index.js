const ORDER_MODEL = require('./order');

const ORDER_MODULE = {}

ORDER_MODULE.createOrder = async function(data){
    return await new ORDER_MODEL(data).save();
}

ORDER_MODULE.getAllOrder = async function(data){
    return await ORDER_MODEL.find(data);
}

ORDER_MODULE.getOrder = async function(data){
    return await ORDER_MODEL.findOne(data);
}

ORDER_MODULE.updateOrder = async function(id, data){
    return await ORDER_MODEL.updateOne({_id: id}, data);
}




module.exports = ORDER_MODULE;