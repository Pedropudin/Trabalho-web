const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// POST /api/products (protected, admin only)
router.post('/', auth, async (req, res) => {
  try {
    //Only allow admin users to create products
    if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
    if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product.' });
  }
});

// GET /api/products/export (admin only)
router.get('/export', auth, async (req, res) => {
  try {
    if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export products.' });
  }
});

// POST /api/products/import (admin only)
router.post('/import', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
  try {
    const filePath = path.join(__dirname, '..', '..', 'eletrocurte-se', 'public', 'data', 'products.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(data)) return res.status(400).json({ error: 'Invalid JSON format.' });
    await Product.deleteMany({});
    await Product.insertMany(data);
    res.json({ message: 'Products imported successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import products.' });
  }
});

// PUT /api/products/:id (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;