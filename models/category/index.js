const CATEGORY_MODEL = require('./category');

const CATEGORY_MODULE = {};

CATEGORY_MODULE.saveCategory = async function(data){
    return await new CATEGORY_MODEL(data).save();
}

CATEGORY_MODULE.getCategories = async function(data){
    return await CATEGORY_MODEL.find(data);
}

CATEGORY_MODULE.getCategory = async function(data){
    return await CATEGORY_MODEL.findOne(data);
}


module.exports = CATEGORY_MODULE;