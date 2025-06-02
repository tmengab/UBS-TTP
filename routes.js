const express = require('express');
const router = express.Router();
const {
  Concept,
  Question,
  Material,
  UserProgress
} = require('../models');

// 获取所有知识点
router.get('/concepts', async (req, res) => {
  try {
    const concepts = await Concept.find({ track: 'basic' });
    res.json(concepts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 开始/继续学习某个知识点
router.get('/start/:userId/:conceptId', async (req, res) => {
  try {
    const { userId, conceptId } = req.params;
    
    // 获取或创建进度记录
    let progress = await UserProgress.findOne({ userId, conceptId }) || 
      new UserProgress({ userId, conceptId });
    
    // 获取当前级别的问题(过滤已尝试的)
    const questions = await Question.find({ 
      conceptId,
      level: progress.currentLevel
    });
    
    const nextQuestion = questions.find(q => 
      !progress.attemptedQuestions.includes(q._id));
    
    if (!nextQuestion) {
      // 检查是否可以升级
      if (progress.correctInRow >= 2 && progress.currentLevel < 5) {
        progress.currentLevel++;
        progress.correctInRow = 0;
        progress.attemptedQuestions = [];
        await progress.save();
        
        // 获取新级别的问题
        const newLevelQuestions = await Question.find({
          conceptId,
          level: progress.currentLevel
        });
        
        if (newLevelQuestions.length > 0) {
          return res.json({
            action: 'next',
            question: newLevelQuestions[0],
            progress
          });
        }
      }
      
      return res.json({ 
        action: 'complete',
        message: '已完成当前级别所有问题'
      });
    }
    
    res.json({
      action: 'next',
      question: nextQuestion,
      progress
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 提交答案
router.post('/answer', async (req, res) => {
  try {
    const { userId, questionId, answer } = req.body;
    
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: '问题不存在' });
    
    const isCorrect = question.correctAnswer === answer;
    
    // 更新进度
    const update = {
      $addToSet: { attemptedQuestions: questionId },
      lastUpdated: new Date()
    };
    
    if (isCorrect) {
      update.$inc = { correctInRow: 1 };
    } else {
      update.$set = { correctInRow: 0 };
    }
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId, conceptId: question.conceptId },
      update,
      { new: true, upsert: true }
    );
    
    // 获取学习材料(仅在答错时)
    const materials = isCorrect ? [] : await Material.find({
      conceptId: question.conceptId,
      level: progress.currentLevel
    });
    
    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      materials,
      progress
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取用户进度
router.get('/progress/:userId', async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.params.userId })
      .populate('conceptId');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
