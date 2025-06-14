const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({ // Schema to be defined, as per the final JSON of the products
  id: Number,
  name: String,
  specificSector: String,
  generalSector: String,
  brand: String,
  price: Number,
  inStock: Number,
  evaluation: String,
  image: String, // was img
  thumbs: [String],
  description: String,
  fullDescription: String,
  specifications: {
    warranty: String,
    model: String,
    color: String,
    voltage: String
  }
});

module.exports = mongoose.model('Product', productSchema);