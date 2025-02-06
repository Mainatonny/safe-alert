const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['report', 'referral', 'activity', 'promotion'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  evidence: {
    type: [String], // URLs to evidence files (e.g., images, videos)
    required: function () {
      return this.type === 'report'; // Evidence required only for report rewards
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
  rejectedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Indexes for faster queries
rewardSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Reward', rewardSchema);