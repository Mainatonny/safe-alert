const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  paymentMethod: String,
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
