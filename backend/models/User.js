const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true },
  CPF: { type: String, unique: true, sparse: true },
  dataNascimento: { type: Date, required: true },

  endereco: {
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    CEP: { type: String, required: true }
  },

  carteira: {
    dinheiro: { type: Number, default: 0 },
    cartao: {
      numero: { type: String, required: true },
      nomeImpresso: { type: String, required: true },
      validade: { type: Date, required: true },
      CVV: { type: String, required: true }
    }
  },

  privacidade: {
    notificacao: { type: Boolean, default: false },
    dadosCompartilhados: { type: Boolean, default: false },
    termosUso: { type: Boolean, default: false } // Becomes true if user visits the terms and conditions page
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Method to compare password
userSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('User', userSchema);