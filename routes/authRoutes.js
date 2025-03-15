const express = require('express');
const { login, register, userLogin, adminLogin, createAdmin, userRegister} = require('../controllers/authController'); // Make sure functions are correctly imported
const router = express.Router();

router.post('/login', login);  // login should be a function in your authController
router.post('/register', register);  // register should also be defined in your authController
router.post('/user/login', userLogin);

// Admin login route
router.post('/admin/login', adminLogin);
router.post('/admin/register', createAdmin);
router.post('/user/register', userRegister);
module.exports = router;
