const express = require('express');
const {
  createSubscription,
  getSubscription,
  handleTierUpgrade,
  earnPoints,
  extendSubscription
} = require('../controllers/subscriptionController');
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all subscription routes
router.use(authMiddleware); // Ensure the user is authenticated before proceeding with any of the following routes

// Get user's subscription details
router.get('/', getSubscription);

// Create a new subscription (requires subscriptionType and endDate)
router.post(
  '/create',
  [
    check('subscriptionType', 'Subscription type is required').not().isEmpty(),
    check('endDate', 'End date is required').isISO8601(),
    validateRequest,
  ],
  createSubscription
);

// Handle subscription tier upgrade
router.post(
  '/upgrade',
  [
    check('tier', 'Subscription tier is required').not().isEmpty(),
    validateRequest,  // Validates the request before passing it to the controller
  ],
  handleTierUpgrade
);

// Earn points from activities
router.post(
  '/points',
  [
    check('pointsEarned', 'Points earned must be a number').isNumeric(),
    validateRequest,  // Validates the request before passing it to the controller
  ],
  earnPoints
);

// Extend subscription using points
router.post(
  '/extend',
  [
    check('pointsToUse', 'Points to use must be a number').isNumeric(),
    validateRequest,  // Validates the request before passing it to the controller
  ],
  extendSubscription
);

module.exports = router;
