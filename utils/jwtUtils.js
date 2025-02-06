// utils/jwtUtils.js

const jwt = require('jsonwebtoken');

// Function to generate a token
const generateToken = (userId, role) => {
  // Sign the token with a user ID and set an expiration time
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Function to verify a token
const verifyToken = (token) => {
  try {
    // Verify the token and return the decoded payload
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // If the token is invalid or expired, return null
    return null;
  }
};

module.exports = { generateToken, verifyToken };
