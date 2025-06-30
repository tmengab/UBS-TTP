const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress');

// GET user ranking (must be before /:userId route)
router.get('/ranking', progressController.getUserRanking);

// GET user's overall progress summary
router.get('/summary/:userId', progressController.getUserProgressSummary);

// 获取用户所有进度
router.get('/:userId', progressController.getUserProgress);

// 重置某知识点进度
router.delete('/:userId/:conceptId', progressController.resetProgress);

// 更新用户等级
router.put('/:userId/:conceptId', progressController.updateUserLevel);

// 清空当前 level 的答题记录
router.delete('/:userId/:conceptId/:level', progressController.resetLevel);

module.exports = router;
