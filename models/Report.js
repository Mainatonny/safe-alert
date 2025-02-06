const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reportType: {
    type: String,
    required: true,
    enum: ['accident', 'theft', 'medical', 'other']
  },
  evidence: [{
    url: String,
    mediaType: String,
    uploadedAt: Date,
    verificationStatus: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rewardAmount: Number,
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  verification: {
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verificationDate: Date,
    notes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
