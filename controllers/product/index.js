const { saveProduct, getAllProducts, getProduct, updateProduct, updateReview, saveReview } = require('../../models').productModule;
const { errorResponse, succesResponse } = require('../../services/response');

module.exports = {
    /** function for save one product */
    async addProduct(req, res){
        const CATEGORY_ID = req.params.category_id;
        const {Product_Name, Product_Short_Desc, Product_Long_Desc, Price} = req.body;
        if(!CATEGORY_ID) return errorResponse(res, 422, 'Category_Id is Required!');
        if(!Product_Name) return errorResponse(res, 422, 'Product_Name is Required!');
        if(!Product_Short_Desc) return errorResponse(res, 422, 'Product_Short_Desc is Required!');
        if(!Product_Long_Desc) return errorResponse(res, 422, 'Product_Long_Desc is Required!');
        if(!Price) return errorResponse(res, 422, 'Price is Required!');
        if(!req.body.Inventory.Total_Quantity) return errorResponse(res, 422, 'Inventory data is Required!')
        try{
            const PRODUCT = await getProduct({ $and: [{ Product_Name: Product_Name },{ Supplier_Id: req.user._id }] });
            if(!PRODUCT){
                req.body.Inventory.Created_At = new Date();
                req.body.Supplier_Id = req.user._id;
                if(!req.body.Discount){
                    const SAVE_PRODUCT = await saveProduct(req.body);
                    return succesResponse(res, 200, { message:'Add product successfully.',Prodct: SAVE_PRODUCT });
                }else{
                    let days = req.body.Discount.Discount_Available ? req.body.Discount.Discount_Available : 7;
                    req.body.Discount.Created_At = new Date();
                    req.body.Discount.Discount_Available = new Date(Date.now() + 1000 * 60 * 60 * 24 * days);
                    const SAVE_PRODUCT = await saveProduct(req.body);
                    return succesResponse(res, 200, { message:'Add product successfully.',Product: SAVE_PRODUCT });
                }   
            }
            return errorResponse(res, 422, `${Product_Name} is already exist!`);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for update product */
    async updateProduct(req, res){
        const PRODUCT_ID = req.params.product_id;
        if(!PRODUCT_ID) return errorResponse(res, 422, 'Product_Id is Required!');
        try{
            const PRODUCT = await getProduct({ $and: [{ _id: PRODUCT_ID },{ Supplier_Id: req.user._id } ] });
            if(!PRODUCT) return errorResponse(res, 422, 'invalid given project id');
            req.body.Updated_At = Date.now();
            await updateProduct(PRODUCT_ID, req.body);
            return succesResponse(res, 200, 'update product successfully!');
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for get all product */
    async getAllProduct(req, res){
        try{
            const PRODUCT = await getAllProducts();
            if(!PRODUCT) return errorResponse(res, 422, 'product not abliable!')
            return succesResponse(res, 200, PRODUCT);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for add and update review */
    async addUpdateReview(req, res){
        const PRODUCT_ID = req.params.product_id;
        if(!PRODUCT_ID) return errorResponse(res, 422, 'product_id is Required!')
        if(!req.body.Review) return errorResponse(res, 422, 'Review is Required!');
        if(req.body.Review > 5) return errorResponse(res, 422, 'Review is less the 5!');
        if(!req.body.Description) return errorResponse(res, 422, 'Description is Required!')
        try{
            const PRODUCT = await getProduct({_id: PRODUCT_ID, "Reviews.User_Id": req.user._id });
            if(!PRODUCT){
                const DATA ={
                    Review: req.body.Review,
                    Description: req.body.Description,
                    User_Id: req.user._id,
                    Created_At: Date.now()
                }
                await saveReview(PRODUCT_ID, DATA)
                return succesResponse(res, 200, 'Add review successfully!');
            }else{
                const DATA ={
                    Review: req.body.Review,
                    Description: req.body.Description,
                    User_Id: req.user._id,
                    Updated_At: Date.now()
                }
                await updateReview(PRODUCT_ID, DATA);
                return succesResponse(res, 200, 'Your review update successfully!')
            }
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for update inventory review */
    async increaseProductQuantity(req, res){
        const PRODUCT_ID = req.params.product_id;
        if(!PRODUCT_ID) return errorResponse(res, 422, 'PRODUCT_ID is Required!')
        if(!req.body.Total_Quantity) return errorResponse(res, 422, 'Total_Quantity is Required!');
        try{
            let PRODUCT = await getProduct({_id: PRODUCT_ID});
            if(!PRODUCT) return errorResponse(res, 422, 'invalid product id');
            if(!PRODUCT.Inventory){
                const DATA = {
                    Total_Quantity : req.body.Total_Quantity,
                    Sales_Quantity : 0,
                    Created_At : new Date()
                }
                PRODUCT.Inventory = DATA
                await updateProduct(PRODUCT_ID, PRODUCT);
            }else{
                PRODUCT.Inventory.Total_Quantity = PRODUCT.Inventory.Total_Quantity + req.body.Total_Quantity;
                PRODUCT.Inventory.Updated_At = new Date();
                await updateProduct(PRODUCT_ID, PRODUCT);
            }
            return succesResponse(res, 200, 'increase product quantity successfully!');
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for add and update discount */
    async addUpdateDiscount(req, res){
        const PRODUCT_ID = req.params.product_id;
        const { Discount_name, Discount_Desc, Discount_percent, Active } = req.body;
        if(!PRODUCT_ID) return errorResponse(res, 422, 'PRODUCT_ID is Required!')
        if(!Discount_name) return errorResponse(res, 422, 'Discount_name is Required!')
        if(!Discount_percent) return errorResponse(res, 422, 'Discount_percent is Required!');
        if(!Discount_Desc) return errorResponse(res, 422, 'Discount_Desc is Required!');
        if(!Active) return errorResponse(res, 422, 'Active is Required!');
        try{
            let days = req.body.Discount_Available ? req.body.Discount_Available : 7;
            let PRODUCT = await getProduct({_id: PRODUCT_ID});
            if(!PRODUCT) return errorResponse(res, 422, 'invalid product id');
            req.body.Discount_Available = new Date(Date.now() + 1000 * 60 * 60 * 24 * days);
            if(!PRODUCT.Discount){
                req.body.Created_At = new Date();
                PRODUCT.Discount = req.body;
                await updateProduct(PRODUCT_ID, PRODUCT);
            }else{
                req.body.Updated_At = new Date();
                req.body.Created_At = PRODUCT.Discount.Created_At;
                PRODUCT.Discount = req.body;
                await updateProduct(PRODUCT_ID, PRODUCT);
            }
            return succesResponse(res, 200, 'Add Discount successfully!');
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    }
}