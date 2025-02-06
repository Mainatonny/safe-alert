const express = require('express');
const {
  getPartnerStatus,
  signUpAsPartner,
  getReferralRevenue,
  getPartnerDashboard,
  requestPayout,
  trackPromotion
} = require('../controllers/partnerController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/status', authMiddleware, getPartnerStatus);
// User signs up as a partner and gets a unique referral code
router.post('/signup', authMiddleware, signUpAsPartner);

// Get partner's revenue generated from referrals
router.get('/revenue', authMiddleware,  getReferralRevenue);

// Get partner dashboard information
router.get('/dashboard/:userId', authMiddleware,  getPartnerDashboard);

// Request a payout
router.post('/payout', authMiddleware, requestPayout);

// Track promotion events (e.g., copying referral codes)
router.post('/track', authMiddleware,  trackPromotion);

module.exports = router;
