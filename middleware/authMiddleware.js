/// authMiddleware.js
const { verifyToken } = require('../utils/jwtUtils');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }

  req.user = {
    id: decoded.userId,
    role: decoded.role
  }; // Add the user's role to the request (if present)
  next();
};

// The 'authorize' function to check user role
const authorize = (role) => {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

module.exports =  authenticate , authorize ;

