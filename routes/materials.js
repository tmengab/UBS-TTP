const express = require('express');
const router = express.Router();
const materialsController = require('../controllers/materials');

// 获取某知识点某等级的学习材料
router.get('/:conceptId/:level', materialsController.getMaterialsByConceptAndLevel);

module.exports = router;
