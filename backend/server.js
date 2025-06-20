require('dotenv').config();
const app = require('./expressApp');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Ensure default admin
    await Admin.ensureDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
