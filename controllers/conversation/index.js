const { errorResponse, succesResponse } = require('../../services/response');
const { saveConversation, getAllConversation, getConversation } = require('../../models').conversationModule
const { saveMessage, getAllMessage } = require('../../models').messageModule
const { getUser } = require('../../models').userModule
const unique = require('../../services/random').getPassword
module.exports={

    async createConversation(req, res){
        const email = req.params.email;
        if(!email) return errorResponse(res, 422, 'email is require in path')
        try{
            const user = await getUser({Email: email})
            if(!user) return errorResponse(res, 422, 'user not exist!')
            console.log(user)
            client_id = await getNextId();
            const data = {
                Chanel_Id: client_id,
                User2: user._id,
                User1: req.user._id
            }
            const conversationData = await getConversation({
                $or: [
                    { $and: [ { User1: req.user._id }, { User2 : user._id } ] },
                    { $and: [ { User1: user._id }, { User2 : req.user._id } ] }
                ]
            })
            if(conversationData) return errorResponse(res, 422, {message: "conversation already exist", conversation: conversationData})
            const conversationData2 = await saveConversation(data);
            return succesResponse(res, 200, {message: "conversation create successfully ", conversation: conversationData2})
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err)
        }
    },

    async getAllFriends(req,res){
        try{
            let allConversation = await getAllConversation({ $or: [ { User1: req.user._id }, { User2 : req.user._id } ] })
            allConversation = JSON.parse(JSON.stringify(allConversation))
            Promise.all(allConversation.map(async element => {
                const user_id = element.User1 == req.user._id ? element.User2 : element.User1
                const user = await getUser({ _id: user_id})
                element.firstName = user.First_Name
                element.Last_Name = user.Last_Name
                element.Email = user.Email
                return element
            })).then(data=>{
                return succesResponse(res, 200, data)
            })
        }catch(err){
            return errorResponse(res, 422, err)
        }
    },

    async saveChat(req,res){
        if(!req.body.Chanel_Id) return errorResponse(res, 422, 'Chanel_Id is require!')
        if(!req.body.text) return errorResponse(res, 422, 'text is require!')
        try{
            req.body.user_id = req.user._id
            const message = await saveMessage(req.body)
            return succesResponse(res, 422, message)
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err)
        }
    },

    async getAllChat(req, res){
        if(!req.params.chanel_id) return errorResponse(res, 422, 'client_id is require in params')
        try{
            const chatList = await getAllMessage({Chanel_Id: req.params.chanel_id})
            console.log("chatList: ",chatList)
            return succesResponse(res, 200, chatList)
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err)
        }
    }
}

async function getNextId () {
	let client_id = await unique()
	let conversationData = await getConversation({Chanel_Id: client_id})
	if (conversationData) {
		getNextId()
	} else {
		return client_id
	}
}

