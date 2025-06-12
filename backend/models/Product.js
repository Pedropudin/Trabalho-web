const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({ // Schema a ser definido, conforme JSON final dos produtos
  id: Number,
  name: String,
  specificSector: String,
  generalSector: String,
  brand: String,
  price: Number,
  inStock: Number,
  evaluation: String,
  img: String,
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