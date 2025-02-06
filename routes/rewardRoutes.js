const express = require('express');
const router = express.Router();
const { getPendingRewards, approveReward, rejectReward, getUserRewards, submitReward } = require('../controllers/rewardController');
const authMiddleware = require('../middleware/authMiddleware');
//const authorize = require('../middleware/authorize'); // Assuming you have a separate authorize middleware for roles

// Get all pending rewards (admin only)
router.get(
  '/pending',
  authMiddleware,  // Authenticate
   // Authorize only for admin
  getPendingRewards
);

// Approve a reward (admin only)
router.post(
  '/approve',
  authMiddleware,  // Authenticate
  //   // Authorize only for admin
  approveReward
);

// Reject a reward (admin only)
router.post(
  '/reject',
  authMiddleware,  // Authenticate
  // Authorize only for admin
  rejectReward
);

// Get rewards for the authenticated user
router.get(
  '/my-rewards',
  // Authenticate
  getUserRewards
);

// Submit a new reward request without validation middleware
router.post(
  '/submit',
  authMiddleware,  // Authenticate
  submitReward
);

module.exports = router;


