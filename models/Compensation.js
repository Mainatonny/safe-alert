// models/Compensation.js
const mongoose = require('mongoose');

const compensationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policy: {
    type: String,
    required: true
  },
  paidService: {
    type: String,
    default: 'None'
  }
  // Add additional fields if needed
}, { timestamps: true });

module.exports = mongoose.model('Compensation', compensationSchema);
