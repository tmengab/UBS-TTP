const Question = require('../models/Question');
const Concept = require('../models/Concept');
const UserProgress = require('../models/UserProgress');

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
    const query = { concept: conceptId };
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
    
    // 1. 获取或初始化用户进度
    let progress = await UserProgress.findOne({ userId, concept: conceptId });
    if (!progress) {
      progress = await UserProgress.create({
        userId,
        concept: conceptId,
        currentLevel: 1,
        attemptedQuestions: []
      });
    }

    // 2. 获取当前难度未尝试的问题
    let questions = await Question.find({
      concept: conceptId,
      level: progress.currentLevel,
      _id: { $nin: progress.attemptedQuestions }
    });

    // 3. 如果当前难度没有问题，升级难度
    if (questions.length === 0 && progress.currentLevel < 3) {
      progress.currentLevel += 1;
      progress.attemptedQuestions = [];
      await progress.save();
      
      questions = await Question.find({
        concept: conceptId,
        level: progress.currentLevel
      });
    }

    // 4. 如果仍然没有问题，返回完成状态
    if (questions.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No more questions available for this concept'
      });
    }

    // 5. 随机选择一个问题
    const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    res.json({
      success: true,
      data: {
        question: nextQuestion,
        currentLevel: progress.currentLevel,
        progress: {
          level: progress.currentLevel,
          attemptedCount: progress.attemptedQuestions.length
        }
      }
    });
  } catch (err) {
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
    
    // 1. 验证问题是否存在
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    // 2. 检查答案
    const isCorrect = question.correctAnswer === userAnswer;
    
    // 3. 更新用户进度
    const progress = await UserProgress.findOneAndUpdate(
      { userId, concept: question.concept },
      {
        $push: { attemptedQuestions: questionId },
        $inc: { correctAnswers: isCorrect ? 1 : 0 },
        lastUpdated: new Date()
      },
      { new: true, upsert: true }
    );

    // 4. 获取相关学习材料 (仅在答错时)
    let materials = [];
    if (!isCorrect) {
      materials = await Material.find({
        concept: question.concept,
        level: question.level
      }).select('-__v');
    }

    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        materials,
        progress: {
          currentLevel: progress.currentLevel,
          correctAnswers: progress.correctAnswers,
          attemptedCount: progress.attemptedQuestions.length
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};
