const { getProduct } = require('../../models').productModule;
const { createCart, getCart, updateCart, removeItem } = require('../../models').cartModule;
const { errorResponse, succesResponse } = require('../../services/response');

module.exports={

    /** function for create cart */
    async addToCart(req, res){
        try{
            const PRODUCT_ID = req.params.product_id;
            let CREATED_CART;
            if(!PRODUCT_ID) return errorResponse(res, 422, 'product_id is Required!');
            const CART_DATA = await getCart({User_Id: req.user._id});
            if(!CART_DATA){
                const DATA ={
                    Products: [PRODUCT_ID],
                    User_Id: req.user._id
                }
                CREATED_CART = await createCart(DATA);
                return succesResponse(res, 200, CREATED_CART);
            }else{
                const isEXIST = await isProductIdExist(PRODUCT_ID, CART_DATA.Products);
                if(!isEXIST){
                    CART_DATA.Products.push(PRODUCT_ID);
                    await updateCart(CART_DATA._id, CART_DATA);
                    return succesResponse(res, 200, 'add item in cart successfully!');
                }else{
                    return errorResponse(res, 422, 'product already exist!');
                }  
            }
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    }, 
    
    /** function for get all cart product */
    async getCart(req, res){
        try{
            let CART_DATA = await getCart({ User_Id: req.user._id});
            CART_DATA = JSON.parse(JSON.stringify(CART_DATA));
            CART_DATA.Products = await getProductList(CART_DATA.Products);
            return succesResponse(res, 200, CART_DATA);
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for remove item from cart */
    async removeCartItem(req, res){
        try{
            if(!req.params.product_id) return errorResponse(res, 422, 'Product_Id is Require!');
            await removeItem(req.user._id, req.params.product_id);
            let CART_DATA = await getCart({ User_Id: req.user._id});
            CART_DATA = JSON.parse(JSON.stringify(CART_DATA));
            CART_DATA.Products = await getProductList(CART_DATA.Products);
            return succesResponse(res, 200, CART_DATA);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },
}

/** function for check product exist or not */
async function isProductIdExist(id, productIds){
    for(let i = 0; i < productIds.length; i++){
        if(productIds[i] === id){
            return true;
        }
    }
    return false
}


/** function for get all product list for getCart method */
async function getProductList(productIds){
    let PRODUCT_lIST = [];
    let i = 0
    for(i ; i < productIds.length; ++i){
        let PRODUCT_DATA = await getProduct({_id: productIds[i]});
        PRODUCT_DATA = JSON.parse(JSON.stringify(PRODUCT_DATA));
        PRODUCT_lIST.push(PRODUCT_DATA);
        if(i === productIds.length -1){
            return PRODUCT_lIST;
        }
    }
}