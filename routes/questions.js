const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions');

// 获取某知识点下的下一个问题
router.get('/next/:userId/:conceptId', questionsController.getNextQuestion);

// 提交答案
router.post('/answer', questionsController.submitAnswer);

module.exports = router;
