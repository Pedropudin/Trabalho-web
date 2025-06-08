const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const senhaCorreta = await user.compararSenha(senha);
  if (!senhaCorreta) return res.status(401).json({ error: 'Credenciais inválidas' });

  // Gera token JWT
  const token = jwt.sign(
    { id: user._id, tipo: user.tipo, nome: user.nome },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, user: { id: user._id, nome: user.nome, email: user.email, tipo: user.tipo } });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const user = new User({ nome, email, senha, tipo });
    await user.save();
    res.status(201).json({ user: { id: user._id, nome: user.nome, email: user.email, tipo: user.tipo } });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao registrar usuário.' });
  }
});

module.exports = router;
