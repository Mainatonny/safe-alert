const express = require('express');
const { getScratchCard, redeemScratchCard } = require('../controllers/scratchCardController');
const router = express.Router();

// Get a scratch card (assigned automatically based on activities like login)
router.post('/get-card', getScratchCard);

// Redeem the scratch card (reveal the reward)
router.post('/redeem', redeemScratchCard);

module.exports = router;