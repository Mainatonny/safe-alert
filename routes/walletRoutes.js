const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have middleware for user authentication

// Route to initiate PayPal payment and capture the transaction
router.post('/add-funds/paypal', authMiddleware, walletController.addFundsWithPayPal);

// Route to capture PayPal payment and update wallet balance
router.post('/capture-payment', authMiddleware, walletController.capturePayPalPayment);

module.exports = router;
