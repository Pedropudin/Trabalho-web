const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  cpf: { type: String, unique: true, sparse: true },
  birthDate: { type: Date, required: true }

  address: {
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    district: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },

  wallet: {
    money: { type: Number, default: 0 },
    card: {
      number: { type: String, required: true },
      printedName: { type: String, required: true },
      expiry: { type: Date, required: true },
      cvv: { type: String, required: true }
    }
  },

  privacy: {
    notification: { type: Boolean, default: false },
    sharedData: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false }
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);