const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress');

// 获取用户所有进度
router.get('/:userId', progressController.getUserProgress);

// 重置某知识点进度
router.delete('/:userId/:conceptId', progressController.resetProgress);

// 更新用户等级
router.put('/:userId/:conceptId', progressController.updateUserLevel);

module.exports = router;
