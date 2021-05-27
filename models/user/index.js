const USER_MODEL = require('./user');

const USER_MODULE = {};

/** function for save user */
USER_MODULE.saveUser = async function(data){
    return await new USER_MODEL(data).save();
}

/** function for find user */
USER_MODULE.getUser = async function(data){
    return await USER_MODEL.findOne(data);
}

/** function for update user */
USER_MODULE.updateUser = async function(id, data){
    return await USER_MODEL.updateOne({ _id: id },{ $set: data });
}

module.exports = USER_MODULE;