const UserProgress = require('../models/UserProgress');
const Concept = require('../models/Concept');


exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const progress = await UserProgress.find({ userId })
      .select('-__v')
      .populate('concept', 'name track');
    
    res.json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// 重置特定知识点的进度
exports.resetProgress = async (req, res) => {
  try {
    const { userId, conceptId } = req.params;
    
    
    const conceptExists = await Concept.exists({ _id: conceptId });
    if (!conceptExists) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    await UserProgress.deleteOne({ userId, concept: conceptId });
    
    res.json({
      success: true,
      data: null,
      message: 'Progress reset successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// 更新用户等级 
exports.updateUserLevel = async (req, res) => {
  try {
    const { userId, conceptId } = req.params;
    const { newLevel } = req.body;
    
    // 验证等级范围
    if (newLevel < 1 || newLevel > 3) {
      return res.status(400).json({
        success: false,
        error: 'Level must be between 1 and 3'
      });
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId, concept: conceptId },
      { currentLevel: newLevel },
      { new: true, upsert: true }
    ).populate('concept', 'name');
    
    res.json({
      success: true,
      data: progress
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};
