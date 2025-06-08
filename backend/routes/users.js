const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/usuarios
router.get('/', async (req, res) => {
  const usuarios = await User.find();
  res.json(usuarios);
});

// outros endpoints conforme necessário

module.exports = router;
