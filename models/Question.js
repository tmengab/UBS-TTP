const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  conceptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concept', required: true },
  level: { type: Number, required: true, min: 1, max: 5 },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: String,
  conceptName: String // 冗余字段便于查询
});

module.exports = mongoose.model('Question', questionSchema);
