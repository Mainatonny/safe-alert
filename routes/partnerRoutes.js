const express = require('express');
const {
  
  updateTierAndReward,
  createCampaign,
  getAllPartners,
  getAdRevenue,
  getCampaigns,
  getPartnerStatus,
  signUpAsPartner,
  getReferralRevenue,
  getPartnerDashboard,
  requestPayout,
  trackPromotion
} = require('../controllers/partnerController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllPartners);
router.get('/ad-revenue', authMiddleware, getAdRevenue);

router.get('/campaigns', authMiddleware, getCampaigns);


router.get('/status', authMiddleware, getPartnerStatus);
// User signs up as a partner and gets a unique referral code
router.post('/signup', authMiddleware, signUpAsPartner);

//router.post('/campaigns/complete', authMiddleware, markCampaignComplete);

// Get partner's revenue generated from referrals
router.get('/revenue', authMiddleware,  getReferralRevenue);

// Get partner dashboard information
router.get('/dashboard/:userId', authMiddleware,  getPartnerDashboard);

// Request a payout
router.post('/payout', authMiddleware, requestPayout);

// Track promotion events (e.g., copying referral codes)
router.post('/track', authMiddleware,  trackPromotion);
router.put('/tier', authMiddleware, updateTierAndReward);
router.post('/campaigns', authMiddleware, createCampaign);

module.exports = router;
