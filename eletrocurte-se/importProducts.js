const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

// Use valores consistentes com o backend Express do projeto
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'COLOQUE_AQUI_SEU_JWT_ADMIN';
const API_URL = process.env.API_URL || 'http://localhost:5000/api/products/import';

if (!API_URL.startsWith('http')) {
  throw new Error('API_URL must be an absolute URL (e.g., http://localhost:5000/api/products/import)');
}

async function importProducts() {
  const filePath = path.join(__dirname, 'public', 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(products)) {
    console.error('products.json must contain an array of products.');
    process.exit(1);
  }
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    },
    body: JSON.stringify(products)
  });
  const result = await response.json();
  console.log(result);
}

importProducts().catch(console.error);