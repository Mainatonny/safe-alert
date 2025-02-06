const mongoose = require('mongoose'); 
const transactionSchema = new mongoose.Schema({   userId: {     type: mongoose.Schema.Types.ObjectId,     ref: 'User',     required: true, 
 },   amount: {     type: Number,     required: true, 
   min: 0, // Ensure the amount is non-negative 
 },   type: {     type: String,     enum: ['withdrawal', 'deposit'], // Only allow these types     required: true, 
 },   date: {     type: Date,     default: Date.now, // Automatically set the date to now 
   }, 
status: { 
   type: String,     enum: ['pending', 'completed', 'failed'], // Track transaction status     default: 'completed', 
 }, 
});  module.exports = mongoose.model('Transaction', transactionSchema);  
