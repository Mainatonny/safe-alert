const express = require('express');
const { withdrawRevenue } = require('../controllers/withdrawController');
const router = express.Router();

// Partner can withdraw their revenue
router.post('/withdraw', withdrawRevenue);

module.exports = router;
