const express = require('express');
const { getPayments, addFunds, deductFunds, getWalletBalance, processPayment } = require('../controllers/paymentController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// Add funds to the wallet (e.g., top-up)
router.post('/add-funds', authMiddleware, addFunds);

router.get('/', authMiddleware, getPayments);

// Deduct funds (e.g., for subscription or exclusive features)
router.post('/deduct-funds', authMiddleware, deductFunds);

// Get wallet balance
router.get('/balance', authMiddleware, getWalletBalance);

// Process payments using third-party services like PayPal or in-app payments
router.post('/process-payment', authMiddleware, processPayment);

module.exports = router;
