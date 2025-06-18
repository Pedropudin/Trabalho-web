require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const name = await ask('Admin name: ');
  const email = await ask('Admin email: ');
  const password = await ask('Admin password: ');
  const tokenStr = await ask('Admin numeric token: ');
  const token = Number(tokenStr);

  if (!name || !email || !password || !tokenStr || isNaN(token)) {
    console.log('All fields are required and the token must be numeric.');
    rl.close();
    process.exit(1);
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log('An admin with this email already exists.');
    rl.close();
    process.exit(1);
  }

  try {
    await Admin.create({ name, email, password, token });
    console.log('Admin created successfully!');
  } catch (err) {
    console.error('Error creating admin:', err.message);
  }
  rl.close();
  process.exit();
}

main();