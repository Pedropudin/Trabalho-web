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
    if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });

    // Generate unique id
    const maxProduct = await Product.findOne().sort({ id: -1 }).select('id');
    const nextId = maxProduct && typeof maxProduct.id === 'number' ? maxProduct.id + 1 : 1;

    const productData = { ...req.body, id: nextId };
    const newProduct = new Product(productData);
    console.log(newProduct);
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

// Import products from JSON file (admin only)
router.post('/import-json', auth, async (req, res) => {
  try {
    if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
    const filePath = path.join(__dirname, '..', '..', 'eletrocurte-se', 'public', 'data', 'products.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(data)) return res.status(400).json({ error: 'Invalid JSON format.' });
    await Product.deleteMany({});
    await Product.insertMany(data);
    res.json({ message: 'Products imported from JSON file successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import products from JSON file.', details: err.message });
  }
});

// Import products via request body (admin only)
router.post('/import', auth, async (req, res) => {
  try {
    if (req.user.type !== 'admin') return res.status(403).json({ error: 'Access denied.' });
    const data = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ error: 'Invalid JSON format.' });
    await Product.deleteMany({});
    await Product.insertMany(data);
    res.json({ message: 'Products imported from request body successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import products from request body.', details: err.message });
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

router.patch('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: req.body },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found.' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product.' });
  }
});

// PATCH /api/products/:id/visualize - update visualized and visualizedDate (public, for history)
router.patch('/:id/visualize', async (req, res) => {
  try {
    const { visualized, visualizedDate, userId } = req.body;
    const updated = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: { visualized: !!visualized, visualizedDate: visualizedDate || new Date() } },
      { new: true }
    );
    // Add to user's viewedProducts history if userId provided
    if (userId) {
      const user = await require('../models/User').findById(userId);
      if (user) {
        // Remove duplicates (by productId or id)
        user.viewedProducts = user.viewedProducts.filter(
          vp => String(vp.id) !== String(updated.id)
        );
        // Add new viewed product at the start (now with price and more fields)
        user.viewedProducts.unshift({
          productId: updated._id,
          id: updated.id,
          name: updated.name,
          image: updated.image,
          price: updated.price,
          brand: updated.brand,
          category: updated.category,
          inStock: updated.inStock,
          visualizedDate: visualizedDate || new Date()
        });
        // Limit history to last 50
        user.viewedProducts = user.viewedProducts.slice(0, 50);
        await user.save();
      }
    }
    if (!updated) return res.status(404).json({ error: 'Product not found.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product visualization.' });
  }
});

// PATCH /api/products/:id/pay - update payed and payedDate (public, for purchase)
router.patch('/:id/pay', async (req, res) => {
  try {
    const { payed, payedDate } = req.body;
    const updated = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: { payed: !!payed, payedDate: payedDate || new Date() } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Product not found.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product payment.' });
  }
});

// GET /api/products/:id/reviews - get all reviews for a product
router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json([]);
    res.json(product.reviews || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// POST /api/products/:id/reviews - add a review to a product
router.post('/:id/reviews', async (req, res) => {
  try {
    // If authenticated, use the user's first name from the token
    let userField;
    if (req.user && req.user.firstName) {
      userField = req.user.firstName;
    } else {
      // fallback for legacy compatibility
      const { username, usuario } = req.body;
      userField = username || usuario;
    }
    const { rating, comment, nota, comentario } = req.body;
    const ratingField = typeof rating === 'number' ? rating : typeof nota === 'number' ? nota : undefined;
    const commentField = comment || comentario;
    if (!userField || typeof ratingField !== 'number' || !commentField) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    if (!Array.isArray(product.reviews)) product.reviews = [];

    // Prevent duplicate reviews by the same user
    if (product.reviews.some(r => (r.username || r.usuario) === userField)) {
      return res.status(409).json({ error: 'User has already reviewed this product.' });
    }

    // Add new review
    product.reviews.push({
      username: userField,
      rating: ratingField,
      comment: commentField,
      date: new Date()
    });

    await product.save();

    res.json(product.reviews);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add review.' });
  }
});

module.exports = router;