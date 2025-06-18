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

    // Simulates automatic status update after defined times
    setTimeout(async () => {
      const o = await Order.findById(order._id);
      if (o && o.status === 'pending') {
        o.status = 'in transit';
        await o.save();
      }
    }, 10000); // 10s later, goes to "in transit"

    setTimeout(async () => {
      const o = await Order.findById(order._id);
      if (o && o.status === 'in transit') {
        o.status = 'delivered';
        await o.save();
      }
    }, 20000); // 20s later, goes to "delivered"

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error creating order', details: err.message });
  }
});

// Admin can manually update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error updating order status.' });
  }
});

module.exports = router;