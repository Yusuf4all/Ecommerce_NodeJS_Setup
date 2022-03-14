const SUPPLIER_MODEL = require('./supplier');

SUPPLIER_MODULE = {};

SUPPLIER_MODULE.getSupplier = async function(data){
    return await SUPPLIER_MODEL.findOne(data);
}

SUPPLIER_MODULE.saveSupplier = async function(data){
    return await new SUPPLIER_MODEL(data).save();
}

SUPPLIER_MODULE.updateSupplier = async function(id,data){
    return await SUPPLIER_MODEL.updateOne( { _id: id }, data );
}

module.exports = SUPPLIER_MODULE;