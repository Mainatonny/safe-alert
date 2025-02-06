const express = require('express');
const { addFunds, deductFunds, getWalletBalance, processPayment } = require('../controllers/paymentController');
const router = express.Router();

// Add funds to the wallet (e.g., top-up)
router.post('/add-funds', addFunds);

// Deduct funds (e.g., for subscription or exclusive features)
router.post('/deduct-funds', deductFunds);

// Get wallet balance
router.get('/balance', getWalletBalance);

// Process payments using third-party services like PayPal or in-app payments
router.post('/process-payment', processPayment);

module.exports = router;
