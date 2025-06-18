const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  itens: [
    {
      id: String,
      quantity: Number
    }
  ],
  personal: Object,
  card: Object,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);