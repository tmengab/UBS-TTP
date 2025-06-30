const mongoose = require('mongoose');

const chatbotLogSchema = new mongoose.Schema({
  message: { type: String, required: true },
  reply: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatbotLog', chatbotLogSchema);
