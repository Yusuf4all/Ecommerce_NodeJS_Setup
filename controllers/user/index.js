const { saveUser, getUser, updateUser } = require('../../models/index').userModule;
const { createCutomer } = require('../../models/index').transactionModule;
const { errorResponse, succesResponse } = require('../../services/response');
const { bcryptHash, bcryptVerify } = require('../../services/crypto');
const { jwtSign, jwtVerify } = require('../../services/jwt');
const sendMail = require('../../services/send_mail');
const { getVerificationCode } = require('../../services/random');

module.exports={

    /** function for signup user */
    async signup(req, res){
        const { First_Name, Last_Name, Email, Password, City, State, Zip_code, Phone_Number, Country, Address1, Address2 } = req.body;
        if(!First_Name) return errorResponse(res, 422, 'First_Name is required');
        if(!Last_Name) return errorResponse(res, 422, 'Last_Name is required');
        if(!Email) return errorResponse(res, 422, 'Email is required');
        if(!Password) return errorResponse(res, 422, 'Password is required');
        if(!City) return errorResponse(res, 422, 'City is required');
        if(!State) return errorResponse(res, 422, 'State is required');
        if(!Zip_code) return errorResponse(res, 422, 'Zip_code is required');
        if(!Phone_Number) return errorResponse(res, 422, 'Phone_Number is required');
        if(!Country) return errorResponse(res, 422, 'Country is required');
        if(!Address1) return errorResponse(res, 422, 'Address1 is required');
        if(!Address2) return errorResponse(res, 422, 'Address2 is required');
        try{
            const USER_DATA = await getUser({Email: Email});
            if(!USER_DATA){
                const HASH_VALUE = bcryptHash(Password, 10);
                const STRIPE_DATA = await createCutomer(Email);
                req.body.Stripe_Customer_Id = STRIPE_DATA.id
                req.body.Password = HASH_VALUE;
                const VERIFICATION_CODE = await getVerificationCode();
                req.body.Verification_Code = VERIFICATION_CODE;
                await saveUser(req.body);
                const data = {
                    Name: First_Name +' '+Last_Name,
                    Otp: VERIFICATION_CODE,
                    Email: Email
                }
                sendMail(data, process.env.LOGIN_OTP_TEMPLATE, 'Signup Verification Code');
                return succesResponse(res, 200, 'you have signup successfully! now you can verify your email.')
            }else{
                return errorResponse(res, 402, 'Email already exist!');
            }
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err.message);
        }
    },
    
    /** function for verify user email */
    async verifyEmail(req, res){
        if(!req.body.Verification_Code) return errorResponse(res, 422, 'Verification_Code is require!');
        if(!req.params.Email) return errorResponse(res, 422, 'Email is require!');
        try{
            const USER_DATA = await getUser({Email: req.params.Email});
            if(!USER_DATA) return errorResponse(res, 422, 'Provided Email is not exist!');
            if(req.body.Verification_Code == USER_DATA.Verification_Code){
                await updateUser(USER_DATA._id, {Verification_Code: null, Email_verified: true });
                return succesResponse(res, 200, 'Vearif Email successfully!');
            }else{
                return errorResponse(res, 422, 'Verification_Code is not mached' );
            }
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for login user */
    async login(req, res){
        if(!req.body.Email) return errorResponse(res, 422, 'Email is required!');
        if(!req.body.Password) return errorResponse(res, 422, 'Password is required!');
        try{
            const USER_DATA = await getUser({Email: req.body.Email, Email_verified: true });
            if(!USER_DATA) return errorResponse(res, 422, 'Please enter a valid email');
            const RESULT = bcryptVerify(req.body.Password, USER_DATA.Password);
            if(!RESULT) return errorResponse(res, 422, 'Entered password is not matched');
            const payload = {
                Email: USER_DATA.Email,
                _id: USER_DATA._id,
                Stripe_Customer_Id: USER_DATA.Stripe_Customer_Id,
                roles: 'User'
            }
            const TOKEN = await jwtSign(payload);
            return succesResponse(res, 200, TOKEN);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for send email for forgot password user */
    async forgotPassword(req, res){
        if(!req.body.Email) return errorResponse(res, 422, 'Email is required!');
        try{
            const USER_DATA = await getUser({Email: req.body.Email });
            if(!USER_DATA) return errorResponse(res, 422, 'Please enter a valid email');
            const PAYLOAD = {
                _id: USER_DATA._id,
            }
            const TOKEN = await jwtSign(PAYLOAD);
            const DATA = {
                url: `${process.env.LOCALHOST_URL}/reset-password/${TOKEN}`,
                Name: USER_DATA.First_Name + ' ' + USER_DATA.Last_Name,
                Email: req.body.Email
            }
            sendMail(DATA , process.env.FORGOT_PASSWORD_TEMPLATE, 'Reset Password');
            return succesResponse(res, 200, 'Password verification mail send to your given email!');
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    /** function for reset forgot password */
    async resetPassword(req, res){
        const ACCESS_TOKEN = req.params.accessToken;
        if(!ACCESS_TOKEN) return errorResponse(res, 422, 'accessToken is required!');
        if(!req.body.Password) return errorResponse(res, 422, 'Please provide a Password for reset your password.');
        const DECODED = await jwtVerify(ACCESS_TOKEN);
        const USER_DATA = await getUser({_id: DECODED._id });
        if(!USER_DATA) return errorResponse(res, 422, 'user not exist!');
        req.body.Password = bcryptHash(req.body.Password, 10);
        await updateUser(USER_DATA._id, req.body)
        return succesResponse(res, 200, 'Reset user password successfully!');
    },
}