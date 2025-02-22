const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead, deleteNotification, createNotification, getNotificationStatistics, addNotificationTemplate  } = require('../controllers/notificationController');
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
  '/:id',
  authMiddleware,  // Use the function directly
  deleteNotification
);

router.post(
  '/create',
  authMiddleware,  // Use the function directly
  createNotification
);

// Endpoint to fetch notification statistics
router.get('/statistics',authMiddleware , getNotificationStatistics);

// Endpoint to add a new notification template
router.post('/templates', authMiddleware, addNotificationTemplate);

module.exports = router;


