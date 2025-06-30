const Question = require('../models/Question');
const Concept = require('../models/Concept');
const UserProgress = require('../models/UserProgress');
const Material = require('../models/Material');
const mongoose = require('mongoose');

const MAX_LEVEL = 3; // 你有多少 level 就写多少

// 获取特定知识点的所有题目
exports.getQuestionsByConcept = async (req, res) => {
  try {
    const { conceptId } = req.params;
    const { level } = req.query;
    
    // 验证知识点是否存在
    const conceptExists = await Concept.exists({ _id: conceptId });
    if (!conceptExists) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    // 构建查询条件
    const query = { conceptId };
    if (level) query.level = level;

    const questions = await Question.find(query)
      .select('-__v')
      .populate('concept', 'name track');
    
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (err) {
    console.error('getQuestionsByConcept error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// 获取用户的下一个问题
exports.getNextQuestion = async (req, res) => {
  try {
    const { userId, conceptId } = req.params;
    console.log('getNextQuestion called with:', { userId, conceptId });

    let progress = await UserProgress.findOne({ userId, conceptId });
    console.log('Found progress:', progress);

    if (!progress) {
      console.log('No progress found, creating new');
      progress = await UserProgress.create({
        userId,
        conceptId,
        currentLevel: 1,
        attemptedQuestions: []
      });
    }

    // 检查当前 level 是否有题
    let level = progress.currentLevel;
    let allQuestions = await Question.find({ conceptId, level });

    while (allQuestions.length === 0 && level < MAX_LEVEL) {
      // 当前 level 没题，自动进入下一个 level
      level++;
      allQuestions = await Question.find({ conceptId, level });
    }

    // 如果所有 level 都没题，说明全部完成
    if (allQuestions.length === 0) {
      // 推荐所有 materials
      const materials = await Material.find({ conceptId }).select('-__v');
      return res.json({
        success: true,
        data: {
          completed: true,
          allLevelsCompleted: true,
          score: progress.score,
          materials: materials
        }
      });
    }

    const correctIds = progress.attemptedQuestions
      .filter(a => a.isCorrect)
      .map(a => a.questionId.toString());
    console.log('Correct IDs:', correctIds);

    const attemptedIds = progress.attemptedQuestions
      .map(a => a.questionId.toString());
    console.log('Attempted IDs:', attemptedIds);

    // 检查是否所有问题都答对了
    const allCorrect = allQuestions.every(q => 
      correctIds.includes(q._id.toString())
    );

    if (allCorrect) {
      // 推荐本 level 下所有 materials
      const materials = await Material.find({
        conceptId: progress.conceptId,
        level: progress.currentLevel
      }).select('-__v');
      return res.json({
        success: true,
        data: {
          completed: true,
          currentLevel: progress.currentLevel,
          score: progress.score,
          materials: materials
        }
      });
    }

    // 获取未尝试的问题
    const questions = allQuestions.filter(
      q => !correctIds.includes(q._id.toString())
    );
    console.log('Available questions:', questions.length);

    if (questions.length === 0) {
      console.log('No available questions, returning random question');
      // 如果没有未尝试的问题，随机返回一个已尝试的问题
      const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      return res.json({
        success: true,
        data: {
          question: randomQuestion,
          currentLevel: progress.currentLevel
        }
      });
    }

    // 随机选择一个未尝试的问题
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    console.log('Returning question:', randomQuestion._id);

    res.json({
      success: true,
      data: {
        question: randomQuestion,
        currentLevel: progress.currentLevel
      }
    });
  } catch (err) {
    console.error('getNextQuestion error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// 提交答案
exports.submitAnswer = async (req, res) => {
  try {
    const { userId, questionId, userAnswer } = req.body;
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    const isCorrect = question.correctAnswer === userAnswer;
    let progress = await UserProgress.findOne({ userId, conceptId: question.conceptId });
    if (!progress) {
      progress = await UserProgress.create({
        userId,
        conceptId: question.conceptId,
        currentLevel: 1,
        attemptedQuestions: []
      });
    }
    const idx = progress.attemptedQuestions.findIndex(
      a => a.questionId.toString() === questionId
    );

    // The new record object now includes the level
    const attemptRecord = { 
      questionId, 
      isCorrect, 
      userAnswer, 
      level: question.level
    };

    if (idx !== -1) {
      // Update existing attempt
      progress.attemptedQuestions[idx] = attemptRecord;
    } else {
      // Push new attempt
      progress.attemptedQuestions.push(attemptRecord);
    }
    await progress.save();
    let materials = await Material.find({
      conceptId: question.conceptId,
      level: question.level
    }).select('-__v');

    // 统计当前 level 答对的题数
    const allQuestions = await Question.find({
      conceptId: question.conceptId,
      level: progress.currentLevel
    });
    const correctCount = progress.attemptedQuestions.filter(a => a.isCorrect).length;
    progress.score = correctCount * 25; // 或者你想要的分数算法
    await progress.save();

    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        progress: {
          currentLevel: progress.currentLevel,
          correctAnswers: progress.attemptedQuestions.filter(a => a.isCorrect).length,
          attemptedCount: progress.attemptedQuestions.length
        },

        score: progress.score,
        materials: materials
      }
    });
  } catch (err) {
    console.error('submitAnswer error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};
