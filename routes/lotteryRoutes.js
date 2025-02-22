const express = require('express');
const router = express.Router();
const { getLotteryProducts, getLotteryStatistics } = require('../controllers/lotteryController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch all lottery products for the logged-in user
router.get('/products', authMiddleware, getLotteryProducts);

// Fetch lottery statistics for the logged-in user
router.get('/statistics', authMiddleware, getLotteryStatistics);

module.exports = router;
