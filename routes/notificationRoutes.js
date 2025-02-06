const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware'); // Directly the function

// Get all notifications for the authenticated user
router.get(
  '/',
  authMiddleware,  // Use the function directly
  getUserNotifications
);

// Mark a notification as read
router.patch(
  '/read',
  authMiddleware,  // Use the function directly
  markAsRead
);

// Delete a notification
router.delete(
  '/:notificationId',
  authMiddleware,  // Use the function directly
  deleteNotification
);

module.exports = router;


