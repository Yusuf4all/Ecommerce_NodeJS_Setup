const { errorResponse, succesResponse } = require('../../services/response');
const { getSupplier, saveSupplier, updateSupplier } = require('../../models').supplierModule;
const { getPassword } = require('../../services/random');
const { bcryptHash, bcryptVerify } = require('../../services/crypto');
const { jwtSign, jwtVerify } = require('../../services/jwt')
const sendMail = require('../../services/send_mail');

module.exports = {
    /** function for register supplier */
    async register(req, res){
        if(!req.body.Email) return errorResponse(res, 422, 'email is required!')
        try{
            const SUPPLIER = await getSupplier({Email: req.body.Email});
            if(!SUPPLIER){
                req.body.Password = await getPassword();
                await sendMail(req.body, process.env.SEND_PASSWORD, 'Signup Verification Code');
                req.body.Password = await bcryptHash(req.body.Password, 10);
                const SAVE_SUPPLIER = await saveSupplier(req.body);
                return succesResponse(res, 200, SAVE_SUPPLIER);
            }else{
                return errorResponse(res, 422, `${req.body.Email} is already registerd please try another!`)
            }
        }catch(err){
            console.log(err)
            return errorResponse(res, 200, err);
        }
    },

    /** function for login supplier */
    async signin(req, res){
        if(!req.body.Email) return errorResponse(res, 422, 'Email is required!');
        if(!req.body.Password) return errorResponse(res, 422, 'Password is required!');
        try{
            const SUPPLIER = await getSupplier({ Email: req.body.Email });
            if(!SUPPLIER) return errorResponse(res, 422, 'Please enter a valid email');
            const RESULT = bcryptVerify(req.body.Password, SUPPLIER.Password);
            if(!RESULT) return errorResponse(res, 422, 'Entered password is not matched');
            const payload = {
                Email: SUPPLIER.Email,
                _id: SUPPLIER._id,
                Stripe_Account: SUPPLIER.Stripe_Account,
                roles: 'Supplier'
            }
            const TOKEN = await jwtSign(payload);
            return succesResponse(res, 200, TOKEN);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for update supplier */
    async update(req, res){
        try{
            if(req.body.Email) return errorResponse(res, 422, 'Here you can not update your email!')
            if(req.body.Stripe_Account) return errorResponse(res, 422, 'Here you can not update Stripe_Account!')
            if(req.body.Password){
                req.body.Password = await bcryptHash(req.body.Password, 10);
            }
            await updateSupplier(req.user._id, req.body);
            return succesResponse(res, 200, 'Update Supplier successfully!');
        }catch(err){
            return errorResponse(res, 422, err);
        }
    }

}