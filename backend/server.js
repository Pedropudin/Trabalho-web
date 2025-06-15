require('dotenv').config();
const app = require('./expressApp');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Garante admin padrão
    await Admin.ensureDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Servidor backend rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
