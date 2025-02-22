const express = require('express');
const { redeemScratchCard, getUserScratchCards, generateScratchCards } = require('../controllers/scratchCardController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


// Get a scratch card (assigned automatically based on activities like login)
router.post('/generate', authMiddleware, generateScratchCards);

// Redeem the scratch card (reveal the reward)
router.post('/redeem',authMiddleware, redeemScratchCard);

router.get('/',authMiddleware , getUserScratchCards);



module.exports = router;