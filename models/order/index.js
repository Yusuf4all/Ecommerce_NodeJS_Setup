const ORDER_MODEL = require('./order');

const ORDER_MODULE = {}

ORDER_MODULE.createOrder = async function(data){
    return await new ORDER_MODEL(data).save();
}

ORDER_MODULE.getAllOrder = async function(data){
    return await ORDER_MODEL.find(data);
}


module.exports = ORDER_MODULE;