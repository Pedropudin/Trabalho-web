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
    // Strong password: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPassword = 'Admin@1234';
    
    await Admin.create({
      name: 'admin01',
      email: 'admin@eletrocurte-se.com',
      password: strongPassword,
      token: 123456
    });
  }
};

module.exports = mongoose.model('Admin', adminSchema);