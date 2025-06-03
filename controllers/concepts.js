const Concept = require('../models/Concept');


exports.getAllConcepts = async (req, res) => {
  try {
    const concepts = await Concept.find().select('-__v');
    res.json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

exports.getConceptById = async (req, res) => {
  try {
    const concept = await Concept.findById(req.params.id);
    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }
    res.json({
      success: true,
      data: concept
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// 创建知识点 (管理员用)
exports.createConcept = async (req, res) => {
  try {
    const { name, track, description } = req.body;
    
    
    const validTracks = ['basic', 'ds', 'data-science'];
    if (!validTracks.includes(track)) {
      return res.status(400).json({
        success: false,
        error: `Invalid track. Must be one of: ${validTracks.join(', ')}`
      });
    }

    const concept = await Concept.create({ name, track, description });
    res.status(201).json({
      success: true,
      data: concept
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};
