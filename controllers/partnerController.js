const User = require('../models/User');


const Partner = require('../models/Partner'); // Assuming you have a Partner schema
const Transaction = require('../models/Transaction'); // Assuming you have a Transaction schema
const crypto = require('crypto');

// Sign up as a partner and generate referral code

const getPartnerStatus = async (req, res) => {
  try {
    // Get full user document with partner status
    const user = await User.findById(req.user.id)
      .select('isPartner referralCode partnerSince')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Explicit boolean conversion for security
    const isPartner = !!user.isPartner;
    
    res.status(200).json({
      isPartner,
      referralCode: isPartner ? user.referralCode : null,
      partnerSince: isPartner ? user.partnerSince : null
    });

  } catch (error) {
    console.error('Partner status error:', error);
    res.status(500).json({ error: 'Error checking partner status' });
  }
};

const signUpAsPartner = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.isPartner) {
      return res.status(400).json({ error: 'Already a partner' });
    }

    // Generate unique referral code
    let isUnique = false;
    let referralCode;
    while (!isUnique) {
      referralCode = crypto.randomBytes(3).toString('hex');
      const existingUser = await User.findOne({ referralCode });
      if (!existingUser) isUnique = true;
    }

    // Update user
    user.isPartner = true;
    user.referralCode = referralCode;
    user.partnerSince = new Date();
    
    await user.save();

    res.status(200).json({
      message: 'Partner registration successful',
      referralCode,
      partnerSince: user.partnerSince
    });

  } catch (error) {
    console.error('Partner signup error:', error);
    res.status(500).json({ 
      error: 'Partner registration failed',
      details: error.message 
    });
  }
};
// Get partner dashboard information
const getPartnerDashboard = async (req, res) => {
  try {
    const ObjectId = require('mongoose').Types.ObjectId;
    
    const user = await User.findOne({ _id: new ObjectId(req.params.userId) }).lean();

    if (!user || !user.isPartner) {
      return res.status(404).json({ error: 'Partner data not found' });
    }

    const referralStats = user.referralStats || {}; // Ensure referralStats is defined

    const metrics = {
      conversionRate:
        referralStats.totalReferrals && referralStats.totalReferrals > 0 && user.appDownloads > 0
          ? referralStats.totalReferrals / user.appDownloads
          : 0,
      monthlyRevenue: user.revenueShare ? user.revenueShare * 30 : 0,
      activeReferrals: referralStats.activeReferrals || 0,
    };

    res.status(200).json({
      referralCode: user.referralCode,
      earnings: user.earnings,
      revenueShare: user.revenueShare,
      metrics,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching partner data.' });
  }
};



// Request a payout
const requestPayout = async (req, res) => {
  try {
    const partner = await Partner.findOne({ userId: req.user.id });

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found.' });
    }

    if (partner.revenueShare < 50) {
      return res.status(400).json({ error: 'Minimum payout amount is $50.' });
    }

    // Validate payout method
    const validMethods = ['paypal', 'bank_transfer']; // Add any other methods you support
    if (!validMethods.includes(req.body.method)) {
      return res.status(400).json({ error: 'Invalid payout method.' });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId: req.user.id,
      amount: partner.revenueShare,
      type: 'withdrawal',
      method: req.body.method,
    });

    // Reset revenueShare after payout
    partner.revenueShare = 0;

    // Use a transaction to ensure atomicity
    const session = await Partner.startSession();
    session.startTransaction();
    try {
      await partner.save({ session });
      await transaction.save({ session });

      await session.commitTransaction();
      res.status(200).json({ message: 'Payout processed successfully.' });
    } catch (err) {
      await session.abortTransaction();
      console.error('Transaction error:', err); // Log the error for debugging
      res.status(500).json({ error: 'Payout processing failed.' });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Payout processing failed.' });
  }
};


// Get partner referral revenue
const getReferralRevenue = async (req, res) => {
  try {
    const user = await user.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ revenue: user.revenue });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching referral revenue.' });
  }
};

// Track promotion actions (like copy code)
const trackPromotion = async (req, res) => {
  try {
    const { action, timestamp } = req.body;

    // Store the tracking information as needed
    // e.g., save to database, log event

    res.status(200).json({ message: 'Promotion action tracked successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error tracking promotion action.' });
  }
};

// Standard user sign-up with optional referral tracking
const signUp = async (req, res) => {
  const { email, password, referralCode } = req.body;

  try {
    let referredBy = null;
    if (referralCode) {
      const referringUser = await User.findOne({ referralCode });
      if (referringUser) {
        referredBy = referringUser.referralCode;

        // Track revenue for referring user
        referringUser.revenue += 5;
        await referringUser.save();
      }
    }

    const newUser = new user({
      email,
      password,
      referredBy,
    });

    await newUser.save();
    res.status(200).json({ message: 'User signed up successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error during sign-up process.' });
  }
};

module.exports = {
  getPartnerStatus,
  signUpAsPartner,
  getReferralRevenue,
  getPartnerDashboard,
  requestPayout,
  trackPromotion,
  signUp,
};
