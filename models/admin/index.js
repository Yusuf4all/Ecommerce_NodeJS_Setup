const  ADMIN_MODEL = require('./Admin');

const ADMIN_MODULE = {};

/** function for find admin */
ADMIN_MODULE.getAdmin = async function(data){
    return await ADMIN_MODEL.findOne(data);
}

/** function for find admin */
ADMIN_MODULE.saveAdmin = async function(data){
    return await new ADMIN_MODEL(data).save();
}

// /** function for find admin */
ADMIN_MODULE.saveAdmin = async function(data){
    return await new ADMIN_MODEL(data).save();
}


module.exports = ADMIN_MODULE;