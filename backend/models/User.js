const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // first name
  lastName: { type: String }, // last name
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // password
  phone: { type: String, required: true }, // phone number
  cpf: { type: String, unique: true, sparse: true, required: true },
  birthDate: { type: Date, required: true }, // birth date

  address: {
    street: { type: String, required: true }, // street address
    number: { type: String, required: true },
    complement: { type: String },
    district: { type: String, required: true }, // district/neighborhood
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true } // postal code
  },

  card: {
    cardHolder: { type: String }, // card holder name
    cardNumber: { type: String }, // card number
    expiry: { type: String }, // expiration date
    cvv: { type: String },
    cpf: { type: String },
    installments: { type: Number } // number of installments
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