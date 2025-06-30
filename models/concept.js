const mongoose = require('mongoose');

const conceptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  track: { type: String, default: 'basic' },
  description: String,
  maxLevel: { type: Number, default: 3 }
});

// 添加这行来创建文本索引
conceptSchema.index({ name: 'text', description: 'text', track: 'text' });

module.exports = mongoose.model('Concept', conceptSchema);
