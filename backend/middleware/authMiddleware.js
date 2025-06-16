const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('authMiddleware - Authorization header:', authHeader);

  if (!authHeader) {
    console.log('authMiddleware - Token não fornecido.');
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('authMiddleware - Formato do header inválido:', authHeader);
    return res.status(401).json({ error: 'Formato do token inválido.' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('authMiddleware - JWT decodificado:', decoded);
    next();
  } catch (err) {
    console.log('authMiddleware - Token inválido:', err.message);
    res.status(401).json({ error: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
