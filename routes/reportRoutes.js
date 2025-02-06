// In routes/reportRoutes.js
// In routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { submitReport, uploadEvidence } = require('../controllers/reportController');

// File upload endpoint
//router.post('/upload', upload.single('file'), uploadEvidence);
//router.post('/upload', upload.single('file'), uploadEvidence);
const authMiddleware = require('../middleware/authMiddleware');
router.post('/submit', authMiddleware, submitReport);
router.post('/upload', authMiddleware, uploadEvidence);

module.exports = router;