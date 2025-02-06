// authController.js

const { generateToken } = require('../utils/jwtUtils'); // Import the utility function
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Handle user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role); // Generate the token using the utility function

    // Optionally, store the token in the user's document (if needed)
    user.token = token;
    await user.save();

    res.json({ userId: user._id, token }); // Send the token and user ID in the response
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle user registration
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    const token = generateToken(newUser._id, newUser.role); // Generate the token using the utility function

    // Optionally, store the token in the user's document (if needed)
    newUser.token = token;
    await newUser.save();

    res.status(201).json({ userId: newUser._id, token }); // Send the token and user ID in the response
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register };
