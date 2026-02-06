const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
    inventory_name:{type:String , required: true},
    item_name:{type:String, required:true },
    previous_quantity:{type:Number, required:true},
    new_quantity:{type:Number,required:true},
    reason:{type:String, required:true},
    timestamp:Date,
})

module.exports = mongoose.model('logs',LogsSchema)