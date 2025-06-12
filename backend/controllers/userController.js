const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  const usuarios = await User.find();
  res.json(usuarios);
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.senha) {
      updates.senha = await bcrypt.hash(updates.senha, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar usuário.' });
  }
};