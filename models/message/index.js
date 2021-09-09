const messageModel = require('./message')

const messageModule = {};

/** function for find admin */
messageModule.getMessage = async function(data){
    return await messageModel.findOne(data);
}

/** function for find admin */
messageModule.saveMessage = async function(data){
    return await new messageModel(data).save();
}

// /** function for find admin */
messageModule.getAllMessage = async function(data){
    return await messageModel.find(data);
}


module.exports = messageModule;