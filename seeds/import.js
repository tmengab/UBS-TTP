const mongoose = require('mongoose');
const path = require('path');

// 1. import models
const Concept = require('../models/Concept');
const Question = require('../models/Question');
const Material = require('../models/Material');

// 2. import all seeds files
const basic = require('./basicProgramming');
const ds = require('./dataStructures');
const fs = require('./fullStack');
const dsc = require('./dataScience');
const ai = require('./aiLearning');

// 3. format all seeds
const allSeeds = [
  { ...basic, track: 'basic' },
  { ...ds, track: 'data-structures' },
  { ...fs, track: 'full-stack' },
  { ...dsc, track: 'data-science' },
  { ...ai, track: 'ai-learning' }
];

async function importData() {
  await mongoose.connect('mongodb://localhost:27017/code_learning', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // delete old data
  await Concept.deleteMany();
  await Question.deleteMany();
  await Material.deleteMany();

  for (const seed of allSeeds) {
    // 1. insert concepts
    const conceptDocs = await Concept.insertMany(
      seed.concepts.map(c => ({
        ...c,
        track: seed.track
      }))
    );

    // 2. create name -> _id mapping
    const conceptMap = {};
    conceptDocs.forEach(doc => {
      conceptMap[doc.name] = doc._id;
    });

    // 3. insert questions
    if (seed.questions) {
      await Question.insertMany(
        seed.questions.map(q => ({
          ...q,
          conceptId: conceptMap[q.conceptName]
        }))
      );
    }

    // 4. insert materials
    if (seed.materials) {
      await Material.insertMany(
        seed.materials.map(m => ({
          ...m,
          conceptId: conceptMap[m.conceptName]
        }))
      );
    }
  }

  console.log('Seed data imported!');
  process.exit();
}

importData().catch(err => {
  console.error(err);
  process.exit(1);
});
