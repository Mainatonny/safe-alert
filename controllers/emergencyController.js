const { sendNotifications } = require('../services/notificationService');

// Handle incoming emergency requests
const handleEmergency = (req, res) => {
  const { userId, emergencyDetails, contacts } = req.body;

  if (!userId || !emergencyDetails || !contacts || contacts.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log the request for debugging
  console.log(`Emergency triggered by user: ${userId}`);
  console.log(`Details: ${emergencyDetails}`);
  console.log(`Notifying contacts: ${contacts.join(', ')}`);

  // Send notifications to contacts
  sendNotifications(contacts, emergencyDetails)
    .then(() => {
      res.status(200).json({ message: 'Emergency notifications sent successfully.' });
    })
    .catch(error => {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Failed to send emergency notifications' });
    });
};

module.exports = { handleEmergency };
