const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  token: { type: Number, unique: true, sparse: true }
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Create default admin if not exists
adminSchema.statics.ensureDefaultAdmin = async function () {
  const Admin = this;
  const exists = await Admin.findOne({ email: 'admin@eletrocurte-se.com' });
  if (!exists) {
    // Senha forte: pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
    const strongPassword = 'Admin@1234';
    const passwordHash = await bcrypt.hash(strongPassword, 10);
    await Admin.create({
      name: 'admin01',
      email: 'admin@eletrocurte-se.com',
      password: passwordHash,
      token: 123456
    });
  }
};

module.exports = mongoose.model('Admin', adminSchema);