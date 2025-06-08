const Material = require('../models/Material');
const Concept = require('../models/Concept');

exports.getMaterials = async (req, res) => {
  try {
    const { concept, level } = req.query;
    const query = {};
    
    if (concept) {
    
      const conceptExists = await Concept.exists({ _id: concept });
      if (!conceptExists) {
        return res.status(404).json({
          success: false,
          error: 'Concept not found'
        });
      }
      query.concept = concept;
    }
    
    if (level) query.level = level;

    const materials = await Material.find(query)
      .select('-__v')
      .populate('concept', 'name track');

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};


exports.getRecommendMaterials = async (req, res) => {
  try {
    const { conceptId, level } = req.params;
    

    const conceptExists = await Concept.exists({ _id: conceptId });
    if (!conceptExists) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    const materials = await Material.find({
      concept: conceptId,
      level: level || { $exists: true }
    })
    .select('-__v')
    .populate('concept', 'name');

    res.json({
      success: true,
      data: materials
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

exports.getMaterialsByConceptAndLevel = async (req, res) => {
  try {
    const { conceptId, level } = req.params;
    const materials = await Material.find({ conceptId, level });
    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
