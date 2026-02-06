const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchase_date: { type: String, required: true },
  expiry_date: { type: String, required: true },
  purchase_price: { type: Number, required: true }
});

module.exports = mongoose.model('school_items', ItemSchema);
