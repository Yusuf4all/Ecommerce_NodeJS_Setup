const { getAdmin, saveAdmin } = require('../../models/index').adminModule;
const { errorResponse, succesResponse } = require('../../services/response');
const { bcryptHash, bcryptVerify } = require('../../services/crypto');
const { jwtSign } = require('../../services/jwt');
const sendMail = require('../../services/send_mail');
const getVerificationCode = require('../../services/random');

module.exports= {
    /** function for signup admin */
    async signup(req, res){
        const { First_Name, Last_Name, Email, Password } = req.body;
        if(!First_Name) return errorResponse(res, 422, 'First_Name is required');
        if(!Last_Name) return errorResponse(res, 422, 'Last_Name is required');
        if(!Email) return errorResponse(res, 422, 'Email is required');
        if(!Password) return errorResponse(res, 422, 'Password is required');
        try{
            const  ADMIN_DATA = await getAdmin({Email: Email});
            if(!ADMIN_DATA){
                const HASH_VALUE = bcryptHash(Password, 10);
                req.body.Password = HASH_VALUE;
                await saveAdmin(req.body);
                return succesResponse(res, 200, 'Admin have signup successfully!')
            }else{
                return errorResponse(res, 402, 'Email already exist!');
            }
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for login user */
    async login(req, res){
        if(!req.body.Email) return errorResponse(res, 422, 'Email is required!');
        if(!req.body.Password) return errorResponse(res, 422, 'Password is required!');
        try{
            const ADMIN_DATA = await getAdmin({Email: req.body.Email });
            if(!ADMIN_DATA) return errorResponse(res, 422, 'Please enter a valid email');
            const RESULT = bcryptVerify(req.body.Password, ADMIN_DATA.Password);
            if(!RESULT) return errorResponse(res, 422, 'Entered password is not matched');
            const PAYLOAD = {
                Email: ADMIN_DATA.Email,
                _id: ADMIN_DATA._id,
                roles: 'Admin'
            }
            const TOKEN = await jwtSign(PAYLOAD);
            return succesResponse(res, 200, TOKEN);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    }
}