const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  senha: { type: String, required: true },
  token: { type: Number, unique: true, sparse: true }
});

// Hash da senha antes de salvar
adminSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para comparar senha
adminSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

// Cria admin padrão se não existir
adminSchema.statics.ensureDefaultAdmin = async function () {
  const Admin = this;
  const exists = await Admin.findOne({ email: 'admin@eletrocurte-se.com' });
  if (!exists) {
    const senhaHash = await bcrypt.hash('admin123', 10);
    await Admin.create({
      nome: '#admin',
      email: 'admin@eletrocurte-se.com',
      senha: senhaHash,
      token: 123456
    });
  }
};

module.exports = mongoose.model('Admin', adminSchema);