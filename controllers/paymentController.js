const Wallet = require('../models/Wallet');
const User = require('../models/User');

const addFunds = async (req, res) => {
  const { userId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero.' });
  }

  try {
    // Find or create the user's wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0, transactionHistory: [] });
    }

    // Add the funds to the wallet
    wallet.balance += amount;
    wallet.transactionHistory.push({
      type: 'top-up',
      amount,
      description: `Funds added to wallet. Payment method: ${req.body.paymentMethod}`,
    });

    await wallet.save();
    res.status(200).json({ message: 'Funds added successfully!', balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ error: 'Error adding funds.' });
  }
};

const deductFunds = async (req, res) => {
    const { userId, amount, description } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' });
    }

    try {
      // Find the user's wallet
      const wallet = await Wallet.findOne({ userId });

      if (!wallet || wallet.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance.' });
      }

      // Deduct the funds
      wallet.balance -= amount;
      wallet.transactionHistory.push({
        type: 'deduction',
        amount,
        description,
      });

      await wallet.save();
      res.status(200).json({ message: 'Funds deducted successfully!', balance: wallet.balance });
    } catch (error) {
      res.status(500).json({ error: 'Error processing payment.' });
    }
};

const getWalletBalance = async (req, res) => {
    const { userId } = req.query;

    try {
      const wallet = await Wallet.findOne({ userId });

      if (!wallet) {
        return res.status(400).json({ error: 'Wallet not found.' });
      }

      res.status(200).json({ balance: wallet.balance });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching wallet balance.' });
    }
};

const processPayment = async (req, res) => {
    const { userId, amount, paymentMethod } = req.body;

    // Example logic: If paymentMethod is PayPal, process via PayPal API
    if (paymentMethod === 'paypal') {
      // Call PayPal API to process the payment (mocked here)
      const success = await mockPayPalPayment(amount);
      if (success) {
        // If PayPal payment is successful, add funds to the wallet
        await addFunds({ body: { userId, amount, paymentMethod } }, res);
      } else {
        res.status(400).json({ error: 'PayPal payment failed.' });
      }
    } else if (paymentMethod === 'googlePay' || paymentMethod === 'applePay') {
      // Call respective SDK to process payment
      const success = await mockInAppPayment(amount);
      if (success) {
        await addFunds({ body: { userId, amount, paymentMethod } }, res);
      } else {
        res.status(400).json({ error: 'In-app payment failed.' });
      }
    } else {
      res.status(400).json({ error: 'Unsupported payment method.' });
    }
  };

  // Mock function for PayPal payment
  const mockPayPalPayment = (amount) => {
    // Mock logic for PayPal payment (replace with actual API call)
    return true;
  };

  // Mock function for in-app payments
  const mockInAppPayment = (amount) => {
    // Mock logic for in-app payment (replace with actual SDK call)
    return true;
};

module.exports = {
  addFunds,
  deductFunds,
  getWalletBalance,
  processPayment,
};
