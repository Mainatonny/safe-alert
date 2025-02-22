const User = require('../models/User');

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    // Instead of error.status, use error.message or error.toString()
    throw new Error(error.message || error.toString());
  }
};

// Create a user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Could not create user' });
  }
};

const addEmergencyContact = async (req, res) => {
    const { userId, name, phone } = req.body;
  
    try {
      const user = await User.findById(userId);
      user.contacts.push({ name, phone });
      await user.save();
  
      res.status(200).json({ success: true, contacts: user.contacts });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add emergency contact.' });
    }
};

// Export all functions together
module.exports = { getAllUsers, createUser, addEmergencyContact };

