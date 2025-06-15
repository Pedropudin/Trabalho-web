const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// List all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Create new order (finalizar compra)
router.post('/finalizar', async (req, res) => {
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
    res.status(400).json({ error: 'Erro ao criar pedido', details: err.message });
  }
});

module.exports = router;
