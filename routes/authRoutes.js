const express = require('express');
const { login, register } = require('../controllers/authController'); // Make sure functions are correctly imported
const router = express.Router();

router.post('/login', login);  // login should be a function in your authController
router.post('/register', register);  // register should also be defined in your authController

module.exports = router;
