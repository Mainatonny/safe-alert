const express = require('express');
const { trackReferralDownload, trackReferralRevenue } = require('../controllers/promotionsController');
const router = express.Router();

// Track a new referral download (when a user downloads the app using a referral code)
router.post('/track-download', async (req, res) => {
  const { referralCode, userId } = req.body;

  try {
    await trackReferralDownload(referralCode, userId);
    res.status(200).json({ message: 'Referral download tracked successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error tracking referral download.' });
  }
});

// Track a referral revenue (when a user makes a purchase)
router.post('/track-revenue', async (req, res) => {
  const { userId, amount } = req.body;

  try {
    await trackReferralRevenue(userId, amount);
    res.status(200).json({ message: 'Referral revenue tracked successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error tracking referral revenue.' });
  }
});

module.exports = router;
