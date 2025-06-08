const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  conceptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concept', required: true },
  currentLevel: { type: Number, default: 1, min: 1, max: 5 },
  correctInRow: { type: Number, default: 0 },
  attemptedQuestions: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// 确保每个用户每个知识点只有一个进度记录
userProgressSchema.index({ userId: 1, conceptId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
