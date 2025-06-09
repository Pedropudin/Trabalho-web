const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({ // Schema a ser definido, conforme JSON final dos produtos
  nome: String,
  marca: String,
  preco: Number,
  descricao: String,
  img: String,
  estoque: Number,
  id: Number,
  setorGeral: String,
  setorEspecifico: String,
  thumbs: [String],
  descricao: String,
  descricaoCompleta: String,
  specifications: [String],
  avaliacao: String,
  cor: String,
  garantia: String,
  // outros campos conforme necessário
});

module.exports = mongoose.model('Product', productSchema);