const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// GET /api/products
router.get('/', async (req, res) => {
  const produtos = await Product.find();
  res.json(produtos);
});

// POST /api/products (protected)
router.post('/', auth, async (req, res) => {
  // Only admin can create product
  if (req.user.tipo !== 'admin') return res.status(403).json({ error: 'Access denied.' });
  const novoProduto = new Product(req.body);
  await novoProduto.save();
  res.status(201).json(novoProduto);
});

// other endpoints (PUT, DELETE) as needed

module.exports = router;