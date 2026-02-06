const mongoose = require('mongoose');
const { type } = require('os');

const ItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  sports_name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  brand: { type: String, required: true },
  barcode:{ type:Number, required:true},
  cost:{ type:Number, required:true},
  vendor_name:{ type:String, required:true},
  quantity:{ type:Number, required:true},
  purchase_date:{ type:String , required:true},
});

module.exports = mongoose.model('sports_items', ItemSchema);
