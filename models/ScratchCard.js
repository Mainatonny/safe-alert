const mongoose = require('mongoose');

const scratchCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // The user this card belongs to
  rewardType: { type: String, enum: ['points', 'subscription', 'goods'], required: true },  // Type of reward
  rewardValue: { type: Number, required: true },  // The value of the reward (e.g., 100 points, 1 month subscription)
  isScratched: { type: Boolean, default: false },  // Whether the card has been scratched or not
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScratchCard', scratchCardSchema);
