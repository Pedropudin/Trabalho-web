const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/usuarios
router.get('/', userController.getAllUsers);

// PATCH /api/usuarios/:id
router.patch('/:id', userController.updateUser);

module.exports = router;