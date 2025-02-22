const express = require('express');
const router = express.Router();
const { 
  getLogs, 
  changePassword, 
  getServerStatus, 
  runBackup, 
  runRestore 
} = require('../controllers/systemController');
const authMiddleware = require('../middleware/authMiddleware');

// Logs endpoint (secured)
router.get('/logs', authMiddleware, getLogs);

// Security: Change Password (secured)
router.put('/security/changePassword', authMiddleware, changePassword);

// Server Monitoring: Get Server Status (can be public or secured)
router.get('/server/status', getServerStatus);

// Backup endpoint (secured)
router.post('/backup',authMiddleware,  runBackup);

// Restore endpoint (secured)
router.post('/restore', authMiddleware, runRestore);

module.exports = router;
