const AVAILABILITY_MODEL = require('./availability');

AVAILABILITY_MODULE = {};

AVAILABILITY_MODULE.saveAvailability = async function(data){
    return new AVAILABILITY_MODEL(data).save();
}

AVAILABILITY_MODULE.getAvailability = async function(data){
    return AVAILABILITY_MODEL.findOne(data);
}

AVAILABILITY_MODULE.updateAvailability = async function(query, data){
    return await AVAILABILITY_MODEL.updateOne(query,data)
}

AVAILABILITY_MODULE.getAvailableSlot = async function(admin_id, date, id){
    return await AVAILABILITY_MODEL.find(
        {
            Admin_Id: admin_id, 
            Date: date 
        },
        {
            Slots: {
                $elemMatch: { _id: id, Is_Booked: {$ne: true}, Is_Available: { $ne: false} }
            }
        }
    );
}

AVAILABILITY_MODULE.updateAvailableSlot = async function(id, data){
    return await AVAILABILITY_MODEL.updateOne({_id: id, "Slots._id": data._id}, { $set: {"Slots.$.Is_Booked": true} })
}


AVAILABILITY_MODULE.findBookedSlot = async function(availability_id, slot_id ){
    return await AVAILABILITY_MODEL.find(
        {
            _id:availability_id
        },
        {
            "Slots": {$elemMatch: {_id: slot_id}}
        }
    )
}

module.exports = AVAILABILITY_MODULE;