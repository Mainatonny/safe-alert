const User = require('../models/User');
const Campaign = require('../models/Campaign');

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

const getAllPartners = async (req, res) => {
  try {
    const partners = await User.find({ isPartner: true }).select('name email referralCode partnerSince').lean();
    res.status(200).json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "Failed to fetch partners" });
  }
};

// Get ad revenue for a partner (simulate ad revenue stats)
const getAdRevenue = async (req, res) => {
  try {
    // For demonstration, fetch the authenticated user (assumes authentication middleware sets req.user)
    const user = await User.findById(req.user.id).lean();
    if (!user || !user.isPartner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    // Simulate ad revenue stats (replace with real data as needed)
    const adRevenue = {
      totalRevenue: user.adRevenue || 0,
      monthlyRevenue: user.adRevenue ? (user.adRevenue / 12) : 0
    };
    res.status(200).json(adRevenue);
  } catch (error) {
    console.error("Error fetching ad revenue:", error);
    res.status(500).json({ error: "Failed to fetch ad revenue" });
  }
};

// Get partner campaigns (simulate campaign data)
const getCampaigns = async (req, res) => {
  try {
    // In a real application, you would query your Campaign collection with a filter such as { partnerId: req.user.id }
    const campaigns = [
      { name: "Campaign A", status: "active", description: "Promo campaign A" },
      { name: "Campaign B", status: "completed", description: "Promo campaign B" },
    ];
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// Update Partner Tier and Reward Policy
const updateTierAndReward = async (req, res) => {
  try {
    const { tier, rewardPolicy } = req.body;
    // Use req.user.id from the authentication middleware
    const user = await User.findById(req.user.id);
    if (!user || !user.isPartner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    
    // Update the partner's tier and reward policy
    user.partnerTier = tier; // For example, store "premium", "vip", etc.
    user.rewardPolicy = rewardPolicy;
    
    await user.save();
    res.status(200).json({ message: 'Partner tier and reward policy updated successfully.' });
  } catch (error) {
    console.error('Tier update error:', error);
    res.status(500).json({ error: 'Failed to update tier settings', details: error.message });
  }
};

// Create a new campaign for a partner
const createCampaign = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Create a new campaign. We assume that a campaign has:
    // - name, description, partnerId, and a default status (e.g., "open").
    const newCampaign = new Campaign({
      name,
      description,
      partnerId: req.user.id, // Authenticated partner
      status: 'open'
    });
    
    await newCampaign.save();
    res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
  } catch (error) {
    console.error('Campaign creation error:', error);
    res.status(500).json({ error: 'Failed to create campaign', details: error.message });
  }
};

const markCampaignComplete = async (req, res) => {
  try {
      const { campaignId } = req.body;
      const userId = req.user.id; // Assuming authentication middleware sets req.user

      // Find the campaign
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
          return res.status(404).json({ error: 'Campaign not found' });
      }

      // Check if the user has already completed the campaign
      if (campaign.completedUsers.includes(userId)) {
          return res.status(400).json({ error: 'Campaign already completed by user' });
      }

      // Mark campaign as completed for the user
      campaign.completedUsers.push(userId);
      await campaign.save();

      // Grant reward based on campaign type
      let rewardType = '';
      let rewardValue = 0;

      if (campaign.type === 'share') {
          rewardType = 'points';
          rewardValue = 10; // Reward 10 points for sharing
      } else if (campaign.type === 'invite') {
          rewardType = 'subscription';
          rewardValue = 1; // 1-month subscription extension
      }

      // Save reward to scratch card collection
      const scratchCard = new ScratchCard({
          userId,
          rewardType,
          rewardValue,
      });

      await scratchCard.save();

      res.status(200).json({ 
          message: 'Campaign marked as completed!', 
          reward: { type: rewardType, value: rewardValue } 
      });
  } catch (error) {
      console.error('Error marking campaign as complete:', error);
      res.status(500).json({ error: 'Failed to mark campaign as complete' });
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
  markCampaignComplete,
  getAllPartners,
  getAdRevenue,
  getCampaigns,
  getPartnerStatus,
  signUpAsPartner,
  getReferralRevenue,
  getPartnerDashboard,
  requestPayout,
  trackPromotion,
  signUp,
  updateTierAndReward,
  createCampaign,
};
