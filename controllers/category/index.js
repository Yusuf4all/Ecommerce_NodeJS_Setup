const { saveCategory, getCategories, getCategory } = require('../../models').categoryModule;
const { errorResponse, succesResponse } = require('../../services/response');

module.exports = {
    /** function for add category */
    async addProductCategory(req, res){
        if(!req.body.Category_Name) return errorResponse(res, 422, 'Category_Name is Required!');
        try{
            const CETEGORY = await getCategory({Category_Name: req.body.Category_Name});
            if(CETEGORY) return errorResponse(res, 422, 'Category_Name is already exist!');
            if(!req.params.parent_id || req.params.parent_id === '{parent_id}'){
                const SAVE_CATEGORY = await saveCategory(req.body);
                return succesResponse(res, 200, SAVE_CATEGORY);
            }else{
                const CETEGORY = await getCategory({_id: req.params.parent_id});
                if(!CETEGORY) return errorResponse(res,422, 'given category id in invalid!');
                req.body.Parent_Id = req.params.parent_id;
                req.body.Category_Type = 'Child';
                const SAVE_CATEGORY = await saveCategory(req.body)
                return succesResponse(res, 200, SAVE_CATEGORY);
            } 
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for get all category */
    async getAllCategories(req, res){
        try{
            console.log("req.params.parent_id: ",req.params.parent_id)
            if(!req.params.parent_id || req.params.parent_id === '{parent_id}'){
               const PARENT_CATEGORIES = await getCategories({Category_Type: 'Parent'});
                if(!PARENT_CATEGORIES) return errorResponse(res, 422, 'Categories not available!');
                return succesResponse(res, 200, PARENT_CATEGORIES);
            }else{
               const CATEGORIES = await getCategories({Parent_Id: req.params.parent_id});
               if(CATEGORIES.length == 0) return errorResponse(res, 422, 'Given category parent id is invalid!');
               return succesResponse(res, 200, CATEGORIES);
            }
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    }
}