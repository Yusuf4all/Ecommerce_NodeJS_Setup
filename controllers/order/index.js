const { getProduct } = require('../../models').productModule;
const { createOrder, getAllOrder, getOrder, updateOrder } = require('../../models').orderModule;
const { getCart, updateCart } = require('../../models').cartModule;
const { errorResponse, succesResponse } = require('../../services/response');

module.exports={

    /** function for create order */
    async createOrder(req, res){
        const ID = req.params.id;
        const { Order_Ship_Name, Order_Ship_Address, City, State, Zip, Country, Phone, Email, Order_Type, Payment_Type } = req.body;
        if(!ID) return errorResponse(res, 422, 'id is Required!');
        if(!Order_Ship_Name) return errorResponse(res, 422, 'Order_Ship_Name is Required!');
        if(!Order_Ship_Address) return errorResponse(res, 422, 'Order_Ship_Address is Required!');
        if(!City) return errorResponse(res, 422, 'City is Required!');
        if(!State) return errorResponse(res, 422, 'State is Required!');
        if(!Zip) return errorResponse(res, 422, 'Zip is Required!');
        if(!Country) return errorResponse(res, 422, 'Country is Required!');
        if(!Phone) return errorResponse(res, 422, 'Phone is Required!');
        if(!Email) return errorResponse(res, 422, 'Email is Required!');
        if(!Order_Type) return errorResponse(res, 422, 'Order_Type is Required!');
        if(!Payment_Type) return errorResponse(res, 422, 'Payment_Type is Required!');
        try{
            if(Payment_Type === 'COD'){
                //COD cash on delevery
                req.body.is_Active = true;
                req.body.Order_Status = 'Active';
            }
            req.body.User_Id = req.user._id;
            if(Order_Type == 'Product'){
                const PRODUCT_DATA = await getProduct({_id: ID});
                if(!PRODUCT_DATA) return errorResponse(res, 422, 'Product id is invalid!');
                req.body.Order_Amount = PRODUCT_DATA.Price;
                req.body.Products = [PRODUCT_DATA._id];
                const ORDER_DATA = await createOrder(req.body);
                return succesResponse(res, 200, ORDER_DATA);
            }
            if(Order_Type == 'Cart'){
                const CART_DATA = await getCart({_id: ID});
                if(!CART_DATA) return errorResponse(res, 422, 'Cart id is invalid');
                if( CART_DATA.Products.length == 0 ) return errorResponse(res, 422, 'Products not available in cart');
                req.body.Products = CART_DATA.Products;
                req.body.Order_Amount = await getOrderAmount(CART_DATA.Products);
                const ORDER_DATA = await createOrder(req.body);
                CART_DATA.Products = [];
                await updateCart( CART_DATA._id, CART_DATA );
                return succesResponse(res, 200, ORDER_DATA);
            }
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },
    
    /** function for get all user order */
    async getAllOrder(req, res){
        try{
            const ORDERS_DATA = await getAllOrder({ User_Id: req.user._id });
            if(!ORDERS_DATA) return errorResponse(res, 422, 'you have no order!');
            return succesResponse(res, 200, ORDERS_DATA);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for cancel order */
    async cancelOrder(req, res){
        if(!req.params.Order_Id) return errorResponse(res, 422, 'Order_Id is Required!');
        try{
            let ORDER_DATA = await getOrder({_id: req.params.Order_Id});
            if(!ORDER_DATA) return errorResponse(res, 422, 'invalid Order_Id!');
            ORDER_DATA = JSON.parse(JSON.stringify(ORDER_DATA));
            ORDER_DATA.Order_Status = 'cancelled';
            await updateOrder(req.params.Order_Id, ORDER_DATA);
            return succesResponse(res, 200, 'cancel order successfully!');
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    }
}

// /** function for check product exist or not */
// async function isProductIdExist(id, productIds){
//     for(let i = 0; i < productIds.length; i++){
//         if(productIds[i] === id){
//             return true;
//         }
//     }
//     return false
// }

/** function for get total amount of orders */
async function getOrderAmount(productIds){
    let TOTAL_AMOUNT = 0;
    for(let i = 0; i < productIds.length; i++){
        const PRODUCT_DATA = await getProduct({_id: productIds[i]});
        TOTAL_AMOUNT += PRODUCT_DATA.Price;
        if(i === productIds.length -1){
            return TOTAL_AMOUNT;
        }
    }
}

/** function for get all product list for getCart method */
// async function getProductList(productIds){
//     let PRODUCT_lIST = [];
//     let i = 0
//     for(i ; i < productIds.length; ++i){
//         let PRODUCT_DATA = await getProduct({_id: productIds[i]});
//         PRODUCT_DATA = JSON.parse(JSON.stringify(PRODUCT_DATA));
//         PRODUCT_lIST.push(PRODUCT_DATA);
//         if(i === productIds.length -1){
//             return PRODUCT_lIST;
//         }
//     }
// }