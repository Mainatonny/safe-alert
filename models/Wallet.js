const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  balance: { type: Number, default: 0 },  // The balance in the wallet
  transactionHistory: [
    {
      type: { type: String, enum: ['top-up', 'deduction', 'credit', 'debit', 'withdrawal'], required: true },  // Transaction type: top-up or deduction
      amount: { type: Number, required: true },  // Amount involved in the transaction
      date: { type: Date, default: Date.now },  // Transaction date
      description: { type: String },  // Optional description for the transaction
    },
  ],
});

module.exports = mongoose.model('Wallet', walletSchema);
