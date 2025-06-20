const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');

// List all orders (admin only)
router.get('/', auth, async (req, res) => {

  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Create new order (finish payment)
router.post('/finish', async (req, res) => {
  try {
    const { itens, personal, card } = req.body;
    const Product = require('../models/Product');

    const itensWithDetails = await Promise.all((itens || []).map(async (item) => {
      const prod = await Product.findOne({ id: Number(item.id) });
      return {
        id: item.id,
        quantity: item.quantity,
        name: prod?.name || item.name || "",
        price: prod?.price ?? item.price ?? 0,
        image: prod?.image || item.image || "",
        brand: prod?.brand || "",
        category: prod?.category || "",
      };
    }));

    const userId = personal?.userId || "";
    const personalWithUserId = { ...personal, userId };

    const order = await Order.create({
      itens: itensWithDetails,
      personal: personalWithUserId,
      card,
      status: 'pending'
    });

    // Adds the order to the user's purchase history
    if (userId) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user) {
        user.purchaseHistory = user.purchaseHistory || [];
        itensWithDetails.forEach(item => {
          user.purchaseHistory.push({
            productId: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            date: order.createdAt
          });
        });
        await user.save();
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error creating order', details: err.message });
  }
});

// Admin can manually update status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const { status } = req.body;
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

// GET /api/orders/user/:userId - return all orders from authenticated user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ 'personal.userId': req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user orders.' });
  }
});

module.exports = router;