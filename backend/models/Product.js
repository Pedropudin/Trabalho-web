const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 }, // always starts as 0, only updated after user review
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

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
  visualized: { type: Boolean, default: false },
  payed: { type: Boolean, default: false },
  visualizedDate: { type: Date, default: null },
  payedDate: { type: Date, default: null },
  reviews: [reviewSchema] // Array of user reviews
});

module.exports = mongoose.model('Product', productSchema);