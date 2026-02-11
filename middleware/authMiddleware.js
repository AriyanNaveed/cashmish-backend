import jwt from 'jsonwebtoken';
import keys from '../config/keys.js';

// Required authentication (already existing)
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ✅ ADD THIS: Optional authentication (for guest/logged-in support)
auth.optional = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    // No token - continue as guest
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    // Invalid token - continue as guest
    req.user = null;
    next();
  }
};

export default auth;