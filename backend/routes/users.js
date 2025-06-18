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
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if ('address' in updates) {
      if (Array.isArray(updates.address)) {
        user.address = updates.address
          .filter(a => !!a && typeof a === 'object')
          .map(a => ({
            ...a,
            id: a.id || `address${Date.now()}_${Math.floor(Math.random()*10000)}`
          }));
      } else if (typeof updates.address === 'object' && updates.address !== null) {
        const addr = {
          ...updates.address,
          id: updates.address.id || `address${Date.now()}_${Math.floor(Math.random()*10000)}`
        };
        const idx = user.address.findIndex(a => a.id === addr.id);
        if (idx >= 0) user.address[idx] = addr;
        else user.address.push(addr);
      }
    }
    if ('selectedAddress' in updates) {
      user.selectedAddress = updates.selectedAddress;
    }

    if (updates.messages) user.messages = updates.messages;
    if (updates.purchaseHistory) user.purchaseHistory = updates.purchaseHistory;
    if (updates.privacy) user.privacy = { ...user.privacy, ...updates.privacy };
    if (updates.card) {
      if (Array.isArray(updates.card)) {
        user.card = updates.card;
      } else if (typeof updates.card === 'object') {
        const idx = user.card.findIndex(c => c.last4 === updates.card.last4);
        if (idx >= 0) user.card[idx] = updates.card;
        else user.card.push(updates.card);
      }
    }
    if (updates.selectedCard) user.selectedCard = updates.selectedCard;
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

// Add a new card for user
router.post('/:id/cards', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const card = req.body;
    if (!card.last4) return res.status(400).json({ error: 'Missing last4.' });
    // Garante todos os campos obrigatórios do schema
    const cardObj = {
      cardHolder: card.nameOnCard || card.cardHolder || "",
      cardNumber: card.number || card.cardNumber || "",
      expiry: card.expiry || "",
      cvv: card.CVV || card.cvv || "",
      cpf: card.cpf || user.cpf || "",
      installments: card.installments || 1,
      last4: card.last4,
      brand: card.brand || "",
      nameOnCard: card.nameOnCard || "",
      balance: typeof card.balance === "number" ? card.balance : 0
    };
    if (user.card.some(c => c.last4 === cardObj.last4)) {
      return res.status(409).json({ error: 'Card already exists.' });
    }
    user.card.push(cardObj);
    await user.save();
    res.json(user.card);
  } catch (err) {
    res.status(400).json({ error: 'Error adding card.' });
  }
});

// Subtract card balance after purchase
router.post('/:id/cards/:last4/debit', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }
    const card = user.card.find(c => c.last4 === req.params.last4);
    if (!card) return res.status(404).json({ error: 'Card not found.' });
    if ((card.balance ?? 0) < amount) {
      return res.status(400).json({ error: 'Insufficient card balance. Please recharge your card.' });
    }
    card.balance -= amount;
    await user.save();
    res.json({ balance: card.balance });
  } catch (err) {
    res.status(400).json({ error: 'Error debiting card.' });
  }
});

// PATCH privacy settings (partial update)
router.patch('/:id/privacy', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.privacy = { ...user.privacy, ...req.body };
    await user.save();
    res.json(user.privacy);
  } catch (err) {
    res.status(400).json({ error: 'Error updating privacy.' });
  }
});

// GET user messages
router.get('/:id/messages', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user.messages || []);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching messages.' });
  }
});

// PATCH message as read/important
router.patch('/:id/messages/:msgIdx', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const idx = Number(req.params.msgIdx);
    if (!user.messages[idx]) return res.status(404).json({ error: 'Message not found.' });
    user.messages[idx] = { ...user.messages[idx], ...req.body };
    await user.save();
    res.json(user.messages[idx]);
  } catch (err) {
    res.status(400).json({ error: 'Error updating message.' });
  }
});

// GET user orders (purchase history)
router.get('/:id/orders', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user.purchaseHistory || []);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching orders.' });
  }
});

// POST add order to purchase history
router.post('/:id/orders', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.purchaseHistory.push(req.body);
    await user.save();
    res.json(user.purchaseHistory);
  } catch (err) {
    res.status(400).json({ error: 'Error adding order.' });
  }
});

// GET /api/users/:id/viewed-products - get user's viewed products history
router.get('/:id/viewed-products', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json([]);
    res.json(user.viewedProducts || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;