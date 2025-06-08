const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// GET /api/produtos
router.get('/', async (req, res) => {
  const produtos = await Product.find();
  res.json(produtos);
});

// POST /api/produtos (protegido)
router.post('/', auth, async (req, res) => {
  // Apenas admin pode criar produto
  if (req.user.tipo !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });
  const novoProduto = new Product(req.body);
  await novoProduto.save();
  res.status(201).json(novoProduto);
});

// outros endpoints (PUT, DELETE) conforme necessário

module.exports = router;
