const mongoose = require('mongoose');

// Define the schema for the Subscription model
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Assuming one subscription per user
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'premium', 'vip'], // Adjust these values based on your use case
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now, // Automatically set the start date to the current date
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true, // Assuming the subscription is active by default
  },
});

// Create the Subscription model based on the schema
module.exports = mongoose.model('Subscription', subscriptionSchema);

