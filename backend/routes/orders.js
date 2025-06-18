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

    // Simula atualização automática do status
    setTimeout(async () => {
      const o = await Order.findById(order._id);
      if (o && o.status === 'pending') {
        o.status = 'in transit';
        await o.save();
      }
    }, 10000); // 10s depois, vai para "in transit"

    setTimeout(async () => {
      const o = await Order.findById(order._id);
      if (o && o.status === 'in transit') {
        o.status = 'delivered';
        await o.save();
      }
    }, 20000); // 20s depois, vai para "delivered"

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error creating order', details: err.message });
  }
});

// Admin can manually update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    // Aceita qualquer status válido do enum
    const allowed = ['pending', 'in transit', 'delivered'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error updating order status.' });
  }
});

module.exports = router;