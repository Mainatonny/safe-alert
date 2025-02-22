const Wallet = require('../models/Wallet');
const paypalClient = require('../config/paypalClient');
const paypal = require('@paypal/checkout-server-sdk');

/**
 * Utility function to create a PayPal order
 * @param {number} amount - Amount to be charged
 */

// Fetch wallet balance
const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from auth middleware
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getWallet = async (req, res) => {
  try {
    // Use req.user.id provided by the auth middleware
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json({
      balance: wallet.balance,
      transactions: wallet.transactionHistory, // Assumes this field stores an array of transactions
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({
      message: "Error fetching wallet data",
      error: error.message || error.toString(),
    });
  }
};

const addFundsWithPayPal = async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation'); // ← Add this line
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2)
        }
      }]
    });

    const order = await paypalClient.execute(request);
    
    // Handle missing approval link
    const approvalLink = order.result.links.find(link => link.rel === 'approve');
    if (!approvalLink) {
      throw new Error('No approval link found in PayPal response');
    }

    res.status(200).json({ 
      approvalLink: approvalLink.href, 
      orderId: order.result.id 
    });

  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to create PayPal order',
      details: error.message 
    });
  }
};


/**
 * Capture PayPal payment and update wallet balance
 */
const capturePayPalPayment = async (req, res) => {
  const { orderID } = req.body;

  if (!orderID || typeof orderID !== 'string') {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    if (capture.result.status === 'COMPLETED') {
      // Find user's wallet
      const wallet = await Wallet.findOne({ userId: req.user.id });

      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      const amount = parseFloat(capture.result.purchase_units[0].amount.value);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid payment amount captured' });
      }
      // Update wallet balance and transaction history
      wallet.balance += amount;
      wallet.transactionHistory.push({
        type: 'credit',
        amount,
        method: 'PayPal',
        description: 'PayPal deposit',
        date: new Date()
      });

      await wallet.save();

      res.status(200).json({
        message: 'Payment captured successfully',
        balance: wallet.balance
      });
    } else {
      res.status(400).json({ message: 'Payment capture failed' });
    }
  } catch (error) {
    console.error('PayPal payment capture failed:', error);
    res.status(500).json({ message: 'PayPal payment capture failed.' });
  }
};

module.exports = {
  getWallet,
  addFundsWithPayPal,
  capturePayPalPayment,
  getWalletBalance,
};


