// authController.js
const mongoose = require('mongoose');
const { generateToken } = require('../utils/jwtUtils'); // Import the utility function
const User = require('../models/User');
const Admin = require('../models/Admin'); 
const bcrypt = require('bcrypt');
const ScratchCard = require('../models/ScratchCard');
//const { generateScratchCards } = require('../controllers/scratchCardController');

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
    //await generateScratchCards(user._id);

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

const userLogin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find user by _id
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, 'user');
    user.token = token;
    await user.save();

    res.json({ userId: user._id, token });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body; // Use username instead of email

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(admin._id, 'admin'); // Role is hardcoded as 'admin'

    // Optionally, store the token in the admin's document (if needed)
    admin.token = token;
    await admin.save();

    // Send response
    res.json({ userId: admin._id, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createAdmin = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, username, password: hashedPassword });

    await newAdmin.save();
    const token = generateToken(newAdmin._id, 'admin'); // Generate the token

    newAdmin.token = token;
    await newAdmin.save();

    res.status(201).json({ adminId: newAdmin._id, token });
  } catch (error) {
    console.error('Error during admin creation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register, userLogin, adminLogin, createAdmin };
 