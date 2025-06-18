const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (res) => {
  const users = await User.find();
  res.json(users);
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

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
};