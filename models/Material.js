const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  conceptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concept', required: true },
  level: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  content: String,
  url: String,
  mediaType: { type: String, enum: ['video', 'article', 'interactive'] }
});

module.exports = mongoose.model('Material', materialSchema);
