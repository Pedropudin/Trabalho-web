const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nome: String,
  marca: String,
  preco: Number,
  descricao: String,
  img: String,
  inStock: Number,
  // outros campos conforme necessário
});

module.exports = mongoose.model('Product', productSchema);
