const conversationModel = require('./conversation')

const conversationModule = {};

/** function for find admin */
conversationModule.getConversation = async function(data){
    return await conversationModel.findOne(data);
}

/** function for find admin */
conversationModule.saveConversation = async function(data){
    return await new conversationModel(data).save();
}

// /** function for find admin */
conversationModule.getAllConversation = async function(data){
    return await conversationModel.find(data);
    // return conversationModel.aggregate([
    //     {
    //         $match: { $or: [ { User1: id }, { User2 : id } ] }
    //     },
    //     {
    //         $lookup: {
    //             from: 'conversations',
    //             localField: "User1",
    //             foreignField: '_id',
    //             as: 'users'
    //         }
    //     },
    //     { $unwind: '$users' },
    //     {
    //         $project: {
    //             _id: 1,
    //             PRO_UID: 1,
    //             Chanel_Id: 1,
    //             User2: 1,
    //             User1: 1,
    //             Created_At: 1,
    //             firstName: '$users.firstName',
    //             Last_Name: '$users.Last_Name',
    //             Email: '$users.Email',
    //         }
    //     }
    // ])
}


module.exports = conversationModule;