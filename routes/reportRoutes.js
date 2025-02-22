const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer storage (or import your pre-configured instance if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Customize destination or import from your config file
    cb(null, 'uploads/evidence/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
  },
});
const upload = multer({ storage });

// Import controllers and middleware
const { submitReport, uploadEvidence, getReports } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint to submit a report (requires authentication)
router.post('/submit', authMiddleware, submitReport);

// Endpoint to upload evidence with file upload handling (requires authentication)
router.post('/upload', authMiddleware, upload.single('file'), uploadEvidence);

router.get('/', authMiddleware, getReports);
module.exports = router;
