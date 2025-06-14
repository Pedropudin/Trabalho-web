const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

// GET /api/products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST /api/products (protected)
router.post('/', auth, async (req, res) => {
  // Only admin can create product
  if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
  res.status(201).json(newProduct);q.body);
});wait newProduct.save();
  res.status(201).json(newProduct);
// GET /api/products/export (admin only)
router.get('/export', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });port (admin only)











module.exports = router;// other endpoints (PUT, DELETE) as needed});  }    res.status(500).json({ error: 'Failed to export products.' });  } catch (err) {    res.json(products);    const products = await Product.find();  try {router.post('/import', auth, async (req, res) => {
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

// other endpoints (PUT, DELETE) as needed

module.exports = router;