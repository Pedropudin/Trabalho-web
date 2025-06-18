const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const auth = require('../middleware/authMiddleware');

// CREATE user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error creating user.' });
  }
});

// READ all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

// READ one user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user.' });
  }
});

// UPDATE user (partial update)
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    // For addresses, selectedAddress, messages, purchaseHistory, privacy, address, card, update correctly
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Deep update for arrays/objects
    if (updates.addresses) user.addresses = updates.addresses;
    if (updates.selectedAddress) user.selectedAddress = updates.selectedAddress;
    if (updates.messages) user.messages = updates.messages;
    if (updates.purchaseHistory) user.purchaseHistory = updates.purchaseHistory;
    if (updates.privacy) user.privacy = { ...user.privacy, ...updates.privacy };
    if (updates.address) user.address = { ...user.address, ...updates.address };
    if (updates.card) user.card = { ...user.card, ...updates.card };
    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.email) user.email = updates.email;
    if (updates.phone) user.phone = updates.phone;
    if (updates.cpf) user.cpf = updates.cpf;
    if (updates.birthDate) user.birthDate = updates.birthDate;
    if (updates.password) user.password = updates.password;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error updating user.' });
  }
});

// Endpoint para adicionar mensagem ao usuário (exemplo de integração futura)
router.post('/:id/messages', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.messages.push(req.body);
    await user.save();
    res.json(user.messages);
  } catch (err) {
    res.status(400).json({ error: 'Error adding message.' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting user.' });
  }
});

// CREATE admin (protected, only admin can create)
router.post('/create-admin', auth, async (req, res) => {
  console.log('POST /create-admin - req.user:', req.user);
  try {
    if (req.user.type !== 'admin') {
      console.log('POST /create-admin - Acesso negado para:', req.user);
      return res.status(403).json({ error: 'Access denied.' });
    }
    const { name, email, password, token } = req.body;
    if (!name || !email || !password || !token) {
      console.log('POST /create-admin - Campos obrigatórios faltando:', req.body);
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('POST /create-admin - Admin já existe:', email);
      return res.status(409).json({ error: 'Admin with this email already exists.' });
    }
    await Admin.create({ name, email, password, token });
    console.log('POST /create-admin - Admin criado:', email);
    res.status(201).json({ message: 'Admin created successfully.' });
  } catch (err) {
    console.log('POST /create-admin - Erro:', err.message);
    res.status(400).json({ error: 'Error creating admin.', details: err.message });
  }
});

// DELETE admin (protected, only admin can delete)
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    res.json({ message: 'Admin deleted.' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting admin.' });
  }
});

// PATCH admin (protected, only admin can update)
router.patch('/admin/:id', auth, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const updates = req.body;
    if (updates.password) {
      const bcrypt = require('bcrypt');
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    res.json(admin);
  } catch (err) {
    res.status(400).json({ error: 'Error updating admin.' });
  }
});

module.exports = router;