const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  console.log('🔒 requireAuth called for:', req.originalUrl);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('🔒 No valid auth header');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔒 Token received, verifying...');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔒 Token valid for user:', decoded.id, 'role:', decoded.role);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('🔒 Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = requireAuth;