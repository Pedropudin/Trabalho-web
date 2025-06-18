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
  status: {
    type: String,
    enum: ['pending', 'in transit', 'delivered'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);