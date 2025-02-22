// models/Lottery.js
const mongoose = require('mongoose');

// Lottery Product Schema
const lotteryProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  imageUrl: String,
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Lottery Statistics Schema
const lotteryStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalTicketsSold: {
    type: Number,
    default: 0,
  },
  totalWinners: {
    type: Number,
    default: 0,
  },
  totalPrizesAwarded: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const LotteryProduct = mongoose.model('LotteryProduct', lotteryProductSchema);
const LotteryStats = mongoose.model('LotteryStats', lotteryStatsSchema);

module.exports = { LotteryProduct, LotteryStats };
