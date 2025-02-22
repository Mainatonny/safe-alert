const Notification = require('../models/Notification');
const NotificationTemplate = require('../models/NotificationTemplate');

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const createNotification = async (req, res) => {
  try {
    console.log("Notification request body:", req.body);

    if (!req.body.userId || !req.body.notificationType || !req.body.message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const notification = new Notification({
      userId: req.body.userId,
      notificationType: req.body.notificationType,
      message: req.body.message,
      read: false,
    });
    await notification.save();
    res.status(200).json({ message: 'Notification sent successfully!', notification });
  } catch (error) {
    console.error('Notification creation failed:', error);
    res.status(500).json({ error: 'Error creating notification.', details: error.message });
  }
};

// Fetch notification statistics for the authenticated user
const getNotificationStatistics = async (req, res) => {
  try {
    // Use req.user.id from authentication middleware
    const totalSent = await Notification.countDocuments({ userId: req.user.id });
    const totalRead = await Notification.countDocuments({ userId: req.user.id, read: true });
    const clickRate = totalSent > 0 ? ((totalRead / totalSent) * 100).toFixed(2) : 0;

    console.log(`User ${req.user.id} - totalSent: ${totalSent}, totalRead: ${totalRead}, clickRate: ${clickRate}`);

    const stats = {
      totalSent,
      totalRead,
      clickRate,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching notification statistics:", error);
    res.status(500).json({ error: "Failed to fetch notification statistics", details: error.message });
  }
};

// Add a new notification template
const addNotificationTemplate = async (req, res) => {
  try {
    const { template } = req.body;
    if (!template) {
      return res.status(400).json({ error: 'Template content is required' });
    }

    const newTemplate = new NotificationTemplate({ template });
    await newTemplate.save();
    res.status(201).json({ message: 'Template added successfully', template: newTemplate });
  } catch (error) {
    console.error("Error adding notification template:", error);
    res.status(500).json({ error: 'Failed to add notification template', details: error.message });
  }
};


const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Add the missing deleteNotification function
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.remove();
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};


module.exports = {
  getUserNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  getNotificationStatistics,
  addNotificationTemplate,
};

