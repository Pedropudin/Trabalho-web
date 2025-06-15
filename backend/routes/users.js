const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
  const users = await User.find();
  res.json(users);
});

// READ one user
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await require('bcrypt').hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error updating user.' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ message: 'User deleted.' });
});

module.exports = router;