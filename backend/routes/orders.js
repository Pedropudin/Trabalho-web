const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// List all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Create new order (finish payment)
router.post('/finish', async (req, res) => {
  try {
    const { itens, personal, card } = req.body;
    const order = await Order.create({
      itens,
      personal,
      card,
      status: 'pending'
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error creating order', details: err.message });
  }
});

module.exports = router;