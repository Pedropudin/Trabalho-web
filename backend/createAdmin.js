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

  const name = await ask('Nome do admin: ');
  const email = await ask('Email do admin: ');
  const password = await ask('Senha do admin: ');
  const tokenStr = await ask('Token numérico do admin: ');
  const token = Number(tokenStr);

  if (!name || !email || !password || !tokenStr || isNaN(token)) {
    console.log('Todos os campos são obrigatórios e o token deve ser numérico.');
    rl.close();
    process.exit(1);
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log('Já existe um admin com esse email.');
    rl.close();
    process.exit(1);
  }

  try {
    await Admin.create({ name, email, password, token });
    console.log('Admin criado com sucesso!');
  } catch (err) {
    console.error('Erro ao criar admin:', err.message);
  }
  rl.close();
  process.exit();
}

main();