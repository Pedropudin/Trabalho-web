const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clientSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  CPF: { type: String, unique: true },
});

const adminSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  token: { type: Number, unique: true },
});

// Hash da senha antes de salvar
clientSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para comparar senha
clientSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('Client', clientSchema);
