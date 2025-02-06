const multer = require('multer');
const fs = require('fs');
const Report = require('../models/Report');
const path = require('path');

// --------------------------
// File Upload Configuration
// --------------------------
const getUploadDir = (req) => {
  console.log('[Upload] Received userId:', req.body.userId);
  if (!req.body.userId) {
    console.error('[Upload] Error: Missing userId in request body');
    throw new Error('userId is required');
  }

  const userDir = `uploads/evidence/${req.body.userId}`;
  console.log('[Upload] Creating directory:', userDir);
  
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
    console.log('[Upload] Directory created successfully');
  }
  return userDir;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('[Upload] Starting storage configuration');
    try {
      const dir = getUploadDir(req);
      cb(null, dir);
    } catch (error) {
      console.error('[Upload] Directory creation failed:', error.message);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const finalName = `${Date.now()}-${sanitizedName}`;
    console.log('[Upload] Generated filename:', finalName);
    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('[Upload] File filter checking:', file.originalname);
    const filetypes = /jpeg|jpg|png|mp4|mov/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (!extname || !mimetype) {
      console.error('[Upload] Rejected file - Type:', file.mimetype, 'Extension:', path.extname(file.originalname));
      return cb(new Error('Only image and video files are allowed!'), false);
    }
    cb(null, true);
  },
});

// --------------------------
// Controller Functions
// --------------------------
const uploadEvidence = async (req, res) => {
  console.log('\n[Upload] New upload request received');
  console.log('[Upload] Request body content:', req.body); // 👈 Now shows actual values
  console.log('[Upload] File metadata:', req.file);

  try {
    if (!req.file) {
      console.error('[Upload] Detailed error report:');
      console.log('- Headers:', req.headers);
      console.log('- Received fields:', Object.keys(req.body));
      console.log('- Files property:', req.files); // For array uploads
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // ... rest of your code ...
  } catch (error) {
    // ... error handling ...
  }
};
const submitReport = async (req, res) => {
  const { userId, reportType, evidence } = req.body;

  try {
    if (!userId || !reportType || !evidence) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newReport = new Report({ userId, reportType, evidence });
    await newReport.save();
    res.status(200).json({ message: 'Report submitted!', report: newReport });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Error submitting report' });
  }
};

module.exports = { upload, uploadEvidence, submitReport };