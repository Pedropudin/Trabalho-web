const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String },
  fullDescription: { type: String },
  price: { type: Number, required: true },
  inStock: { type: Number, default: 0 },
  image: { type: String },
  thumbs: [String],
  brand: { type: String },
  category: { type: String },
  generalSector: { type: String },
  specificSector: { type: String },
  specifications: [String],
  evaluation: { type: Number },
});

module.exports = mongoose.model('Product', productSchema);