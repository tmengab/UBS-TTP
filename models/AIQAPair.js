const mongoose = require('mongoose');

const aiQAPairSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  aiProvider: { type: String, default: 'DeepSeek' },
  createdAt: { type: Date, default: Date.now }
});

// 创建索引以便快速搜索
aiQAPairSchema.index({ question: 'text' });
aiQAPairSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AIQAPair', aiQAPairSchema); 