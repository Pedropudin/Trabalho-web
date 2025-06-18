const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
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
    // Garante que address é array
    const addressArr = Array.isArray(address) ? address : address ? [address] : [];
    const user = new User({ firstName, lastName, email, password, phone, cpf, birthDate, address: addressArr, card, privacy });
    await user.save();
    res.status(201).json({ user: { id: user._id, firstName: user.firstName, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Error registering user.' });
  }
});

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  const { email, password, token } = req.body;
  console.log('Tentativa de login admin:', { email, password, token });
  const admin = await Admin.findOne({ email, token });
  if (!admin) {
    console.log('Admin não encontrado com email e token fornecidos');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    console.log('Senha incorreta para admin:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token with type: 'admin'
  const jwtToken = require('jsonwebtoken').sign(
    { id: admin._id, name: admin.name, email: admin.email, type: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token: jwtToken, admin: { id: admin._id, name: admin.name, email: admin.email } });
});

module.exports = router;