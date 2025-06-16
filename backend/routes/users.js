const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    // Se for addresses, selectedAddress, messages, purchaseHistory, privacy, address, card, atualize corretamente
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Atualização profunda para arrays/objetos
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

module.exports = router;