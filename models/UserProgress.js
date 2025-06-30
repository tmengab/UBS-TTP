const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  conceptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concept', required: true },
  currentLevel: { type: Number, default: 1, min: 1, max: 3 },
  attemptedQuestions: { type: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    isCorrect: Boolean,
    userAnswer: Number,
    level: Number
  }], default: [] },
  score: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// 确保每个用户每个知识点只有一个进度记录
userProgressSchema.index({ userId: 1, conceptId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
