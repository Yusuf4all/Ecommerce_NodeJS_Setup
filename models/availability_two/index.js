const AVAILABILITY_TWO_MODEL = require('./availability_two');
// var ObjectId = require('mongodb').ObjectID

AVAILABILITY_TWO_MODULE = {};

AVAILABILITY_TWO_MODULE.saveAvailability = async function(data){
    return new AVAILABILITY_TWO_MODEL(data).save();
}

AVAILABILITY_TWO_MODULE.getAvailability = async function(data){
    return AVAILABILITY_TWO_MODEL.findOne(data);
}

AVAILABILITY_TWO_MODULE.updateAvailability = async function(query, data){
    return await AVAILABILITY_TWO_MODEL.updateOne(query,{ $set: { Slots: data } });
}

AVAILABILITY_TWO_MODULE.getAvailableSlotTwo = async function(admin_id, date, id){
    return await AVAILABILITY_TWO_MODEL.find(
        {
            Admin_Id: admin_id, 
            Date: date 
        },
        {
            Slots:{
                $elemMatch: { _id: id, Is_Booked: {$ne: true}, Is_Home_Available: { $ne: false}, Is_Office_Available: { $ne: false} }
            }
        }
    );
}

AVAILABILITY_TWO_MODULE.updateAvailableSlot = async function(id, data){
    return await AVAILABILITY_TWO_MODEL.updateOne({_id: id }, { $set: { Slots: data } })
}

AVAILABILITY_TWO_MODULE.findBookedSlot = async function(availability_id, slot_id ){
    return await AVAILABILITY_TWO_MODEL.find(
        {
            _id:availability_id
        },
        {
            "Slots": {$elemMatch: {_id: slot_id}}
        }
    )
}

// AVAILABILITY_TWO_MODULE.getAllBookedSlots = async function (data){
//     return await AVAILABILITY_TWO_MODEL.findAll();
// }

module.exports = AVAILABILITY_TWO_MODULE;