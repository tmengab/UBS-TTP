const mongoose = require('mongoose');

const dynamicLearningSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Number },
    explanation: { type: String },
    userAnswer: { type: Number },
    isCorrect: { type: Boolean },
    answered: { type: Boolean, default: false }
  }],
  materials: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['video', 'article', 'tutorial', 'documentation'], default: 'article' }
  }],
  status: { 
    type: String, 
    enum: ['created', 'in_progress', 'completed'], 
    default: 'created' 
  },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// 创建索引以便快速搜索
dynamicLearningSchema.index({ userId: 1, createdAt: -1 });
dynamicLearningSchema.index({ topic: 'text' });

module.exports = mongoose.model('DynamicLearning', dynamicLearningSchema); 