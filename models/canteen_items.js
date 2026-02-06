const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  unit: { type: String, required: true },
  quantity:{ type:Number , required : true},
  category: { type: String, required: true },
  refrigirator: { type: String, required: true },
  manufactur_date :{ type:String , required:true},
  expiry_date :{ type:String , required:true},
  purchase_date :{ type:String , required:true},
  purchase_price :{ type:Number , required:true},
  selling_price : { type:Number , required:true}
});

module.exports = mongoose.model('canteen_items', ItemSchema);
