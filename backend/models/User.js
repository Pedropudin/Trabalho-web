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

  card: [
    {
      cardHolder: { type: String, required: true }, // card holder name
      cardNumber: { type: String, required: true }, // card number
      expiry: { type: String, required: true }, // expiry date in MM/YY format
      cvv: { type: String, required: true },
      cpf: { type: String, required: true },
      installments: { type: Number, required: true }, // number of installments
      // Additional card details
      last4: { type: String, required: true },
      brand: { type: String },
      nameOnCard: { type: String },
      balance: { type: Number, default: 0 } // saldo em dólar
    }
  ],
  selectedCard: { type: String }, // last4 of cards

  privacy: {
    notification: { type: Boolean, default: false },
    sharedData: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false }
  },

  purchaseHistory: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String, // <-- Adicionado: nome do produto associado
      name: String,
      price: Number,
      quantity: Number,
      date: Date,
      evaluation: Number,
      comment: String
    }
  ],

  messages: [
    {
      text: String,
      date: Date,
      important: { type: Boolean, default: false },
      read: { type: Boolean, default: false }
    }
  ],

  // Multiple addresses (now only address array)
  address: [
    {
      street: { type: String, required: true },
      number: { type: String, required: true },
      complement: { type: String },
      district: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      id: { type: String, required: true }
    }
  ],

  // Selected address (optional)
  selectedAddress: { type: String }
}, { timestamps: true });

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