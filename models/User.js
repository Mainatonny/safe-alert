const mongoose = require('mongoose');

const generateReferralCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  token: { type: String },
  
  userId: { type: String,  unique: true },
  referralCode: { type: String, unique: true, sparse: true },
  points: { type: Number, default: 0 },
  subscriptionTier: { type: String, enum: ['free', 'premium', 'vip'], default: 'free' },
  subscriptionExpiry: { type: Date },
  contacts: [{ name: String, phone: String }],
  isPartner: { type: Boolean, default: false },
  partnerSince: { type: Date },
  referredBy: { type: String },
  revenue: { type: Number, default: 0 },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  subscriptionHistory: [{
    tier: String,
    startDate: Date,
    endDate: Date
  }],
  referralStats: {
    totalReferrals: Number,
    activeReferrals: Number,
    conversionRate: Number
  }
});

// Automatically generate referralCode before saving if missing
userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

