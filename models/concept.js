const mongoose = require('mongoose');

const conceptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  track: { type: String, default: 'basic' },
  description: String,
  maxLevel: { type: Number, default: 3 }
});

module.exports = mongoose.model('Concept', conceptSchema);
