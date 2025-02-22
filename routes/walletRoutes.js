const express = require('express');
const router = express.Router();
const { addFundsWithPayPal, capturePayPalPayment, getWallet, getWalletBalance} = require('../controllers/walletController');

const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware'); 
// Assuming you have middleware for user authentication
router.get('/', authMiddleware, getWallet);

router.get('/balance', authMiddleware, getWalletBalance);
// Route to initiate PayPal payment and capture the transaction
router.post('/add-funds/paypal', authMiddleware, addFundsWithPayPal);

// Route to capture PayPal payment and update wallet balance
router.post('/capture-payment', authMiddleware, capturePayPalPayment);

module.exports = router;
