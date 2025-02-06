const express = require('express');
const { getAllUsers, createUser } = require('../controllers/userController');
const router = express.Router();

// Route for fetching all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();  // Assuming getAllUsers handles fetching the users
    res.status(200).json(users);         // Send response with status code 200
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
});

// Route for creating a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await createUser(req.body);  // Assuming createUser creates a user from the body
    res.status(201).json(newUser);               // Return created user with status code 201
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

module.exports = router;
// Compare this snippet from backend/routes/reportRoutes.js: