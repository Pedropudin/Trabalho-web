const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) return res.status(401).json({ error: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, firstName: user.firstName, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, user: { id: user._id, firstName: user.firstName, email: user.email } });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered.' });
  }
  // Receives data from frontend
  const { firstName, lastName, password, phone, cpf, birthDate, address, card, privacy } = req.body;
  try {
    // Creates user with schema fields
    const user = new User({ firstName, lastName, email, password, phone, cpf, birthDate, address, card, privacy });
    await user.save();
    res.status(201).json({ user: { id: user._id, firstName: user.firstName, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Error registering user.' });
  }
});

module.exports = router;
