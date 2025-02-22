const express = require('express');
const router = express.Router();
const { getCompensationDetails, updateCompensationDetails } = require('../controllers/compensationController');
const authMiddleware = require('../middleware/authMiddleware');
// GET /api/compensation - Get compensation details
router.get('/compensation',authMiddleware, getCompensationDetails);

// PUT /api/compensation - Update compensation details
router.put('/compensation',authMiddleware, updateCompensationDetails);

module.exports = router;
