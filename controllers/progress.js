const UserProgress = require('../models/UserProgress');
const Concept = require('../models/Concept');
const Question = require('../models/Question');
const { calculateUserSummary } = require('../utils/progressCalculator');
const User = require('../models/User');


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
    const concept = await Concept.findById(conceptId);
    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }
    if (newLevel < 1 || newLevel > concept.maxLevel) {
      return res.status(400).json({
        success: false,
        error: `Level must be between 1 and ${concept.maxLevel}`
      });
    }
    const progress = await UserProgress.findOneAndUpdate(
      { userId, conceptId },
      { currentLevel: newLevel },
      { new: true, upsert: true }
    );
    res.json({
      success: true,
      data: progress
    });
  } catch (err) {
    console.error('updateUserLevel error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// exports.getNextQuestion = async (req, res) => { ... } // 注释或删除

// 清空当前 level 的答题记录
exports.resetLevel = async (req, res) => {
  const { userId, conceptId, level } = req.params;
  try {
    const progress = await UserProgress.findOne({ userId, conceptId });
    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress not found' });
    }
    // 只保留非本 level 的答题记录
    const questions = await Question.find({ conceptId, level });
    const questionIds = questions.map(q => q._id.toString());
    progress.attemptedQuestions = progress.attemptedQuestions.filter(
      a => !questionIds.includes(a.questionId.toString())
    );
    await progress.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserProgressSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const summaryData = await calculateUserSummary(userId);
        
        // 修复图片URL - 使用正确的文件名
        if (summaryData.medal) {
            if (summaryData.medal.name === "Gold Learner") summaryData.medal.imageUrl = "/gold.png";
            if (summaryData.medal.name === "Silver Learner") summaryData.medal.imageUrl = "/silver.png";
            if (summaryData.medal.name === "Bronze Learner") summaryData.medal.imageUrl = "/bronze.png";
        }

        res.json({ success: true, data: summaryData });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server Error: " + err.message });
    }
};

exports.getUserRanking = async (req, res) => {
  try {
    // 聚合每个用户的总分
    const ranking = await UserProgress.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          userId: '$_id',
          totalScore: 1,
          username: { $arrayElemAt: ['$userInfo.username', 0] }
        }
      }
    ]);
    
    // 如果 lookup 失败，手动获取用户名
    const rankingWithUsernames = await Promise.all(
      ranking.map(async (user) => {
        if (!user.username) {
          const userDoc = await User.findById(user.userId);
          user.username = userDoc ? userDoc.username : user.userId;
        }
        return user;
      })
    );
    
    res.json({ success: true, data: rankingWithUsernames });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
