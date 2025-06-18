const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('authMiddleware - Authorization header:', authHeader);

  if (!authHeader) {
    console.log('authMiddleware - Token not provided.');
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('authMiddleware - Invalid header format:', authHeader);
    return res.status(401).json({ error: 'Invalid token format.' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('authMiddleware - Decoded JWT:', decoded);
    next();
  } catch (err) {
    console.log('authMiddleware - Invalid token:', err.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = authMiddleware;