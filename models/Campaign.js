// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'completed', 'closed'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
