const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  usage: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  sellerName: { type: String },
  sellerId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);
