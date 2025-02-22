const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notificationType: { // renamed from "type" to avoid conflicts
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  metadata: {
    rewardId: {
      type: mongoose.Schema.Types.ObjectId, // For reward notifications
      required: function() {
        return this.type === 'reward';
      }
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId, // For report notifications
      required: function() {
        return this.type === 'report';
      }
    },
    subscriptionTier: {
      type: String, // For subscription notifications
      required: function() {
        return this.type === 'subscription';
      }
    },
    amount: {
      type: Number, // For payment notifications
      required: function() {
        return this.type === 'payment';
      }
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
