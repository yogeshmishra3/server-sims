const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  unit: { type: String, required: true },
  dimension:{ type: String, required: true },
  weight: { type: Number, required: true },
  barcode: { type: Number, required: true },
  subject: { type: String, required: true },
  refrigirator: { type: String, required: true },
  hazardious: { type: String, required: true },
  cost: { type: Number, required: true },
  purchase_date:{ type :String , required:true},
  quantity:{type:Number, required:true},
  expiry_date:{ type :String , required:true}
});

module.exports = mongoose.model('labs_items', ItemSchema);
