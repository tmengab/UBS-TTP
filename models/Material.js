const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  conceptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concept', required: true },
  level: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  content: String,
  url: { type: String, required: true },
  mediaType: { type: String, enum: ['video', 'article', 'interactive'], required: true }
});

// 添加这行来创建文本索引
materialSchema.index({ title: 'text' });

module.exports = mongoose.model('Material', materialSchema);
