const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/produtos', require('./routes/products'));
app.use('/api/usuarios', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pedidos', require('./routes/orders'));

module.exports = app;