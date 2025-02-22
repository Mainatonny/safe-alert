// models/NotificationTemplate.js
const mongoose = require('mongoose');

const notificationTemplateSchema = new mongoose.Schema({
  template: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema);
