const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Wallet = require('../models/Wallet');
const mongoose = require('mongoose');
const { validationResult, body } = require('express-validator');

// Middleware for input validation
const validateSubscriptionRequest = [
  body('userId').notEmpty().withMessage('User ID is required.'),
  body('subscriptionType').isIn(['Free', 'Premium', 'VIP']).withMessage('Invalid subscription type.'),
  body('endDate').isISO8601().withMessage('Invalid date format for endDate.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { userId, subscriptionType, endDate } = req.body;

    const newSubscription = new Subscription({ userId, subscriptionType, endDate });
    await newSubscription.save();

    res.status(201).json({ success: true, data: newSubscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};

// Fetch subscription details
const getSubscription = async (req, res) => {
  try {
    // Use req.user and check that it has an id
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user information available.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription) {
      subscription = { userId: user._id, subscriptionType: 'Free', endDate: 'N/A', points: 0 };
    }

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error('Error fetching subscription info:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Handle subscription tier upgrade with transactions
const handleTierUpgrade = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.user.id).session(session);
    const { tier } = req.body;

    const tierDetails = {
      premium: { price: 20, features: ['priority-support', 'analytics'] },
      vip: { price: 50, features: ['dedicated-support', 'custom-reports'] }
    };

    const wallet = await Wallet.findOne({ userId: user._id }).session(session);

    if (wallet.balance < tierDetails[tier].price) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    wallet.balance -= tierDetails[tier].price;
    user.subscriptionTier = tier;
    user.subscriptionExpiry = new Date().setFullYear(new Date().getFullYear() + 1);

    wallet.transactionHistory.push({
      type: 'debit',
      amount: tierDetails[tier].price,
      method: 'wallet',
      description: `Subscription upgrade to ${tier}`
    });

    await wallet.save();
    await user.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ tier: user.subscriptionTier, expiry: user.subscriptionExpiry });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Subscription upgrade failed:', error);
    res.status(500).json({ error: 'Subscription upgrade failed', details: error.message });
  }
};

// Extend subscription using points
const extendSubscription = async (req, res) => {
  const { pointsToUse } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.points < pointsToUse) {
      return res.status(400).json({ success: false, message: 'Insufficient points to extend subscription.' });
    }

    user.points -= pointsToUse;
    const currentExpiry = new Date(user.subscriptionExpiry || Date.now());
    user.subscriptionExpiry = new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1));
    await user.save();

    res.status(200).json({ success: true, message: 'Subscription extended successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error extending subscription.', error: error.message });
  }
};

// Earn points from specific activities
const earnPoints = async (req, res) => {
  const { pointsEarned } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.points += pointsEarned;
    await user.save();

    res.status(200).json({ success: true, message: `${pointsEarned} points earned.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error earning points.', error: error.message });
  }
};

module.exports = {
  validateSubscriptionRequest,
  createSubscription,
  getSubscription,
  handleTierUpgrade,
  extendSubscription,
  earnPoints,
};

