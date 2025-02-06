const express = require('express');
const router = express.Router();
const { handleEmergency } = require('../controllers/emergencyController');

// Route to handle emergency alerts
router.post('/', handleEmergency);

module.exports = router;
