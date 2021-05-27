const { saveProduct, getAllProducts, getProduct } = require('../../models').productModule;
const { errorResponse, succesResponse } = require('../../services/response');
const { jwtSign, jwtVerify } = require('../../services/jwt');

module.exports = {
    /** function for save one product */
    async addProduct(req, res){
        const {Product_Name, Product_Short_Desc, Product_Long_Desc, Price} = req.body;
        if(!Product_Name) return errorResponse(res, 422, 'Product_Name is Required!');
        if(!Product_Short_Desc) return errorResponse(res, 422, 'Product_Short_Desc is Required!');
        if(!Product_Long_Desc) return errorResponse(res, 422, 'Product_Long_Desc is Required!');
        if(!Price) return errorResponse(res, 422, 'Price is Required!');
        try{
            const PRODUCT = await getProduct({Product_Name: Product_Name});
            if(!PRODUCT){
                const SAVE_PRODUCT = await saveProduct(req.body);
                return succesResponse(res, 200, { message:'Add product successfully.',Prodct: SAVE_PRODUCT });
            }
            return errorResponse(res, 422, `${Product_Name} is already exist!`);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for get all product */
    async getAllProduct(req, res){
        try{
            const PRODUCT = await getAllProducts();
            return succesResponse(res, 200, PRODUCT);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

}