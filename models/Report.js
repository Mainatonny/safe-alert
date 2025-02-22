// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, required: true },
  description: { type: String },
  evidence: { type: String },
  status: { type: String, default: 'pending' },
  reward: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);

