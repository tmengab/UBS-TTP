const express = require('express');
const router = express.Router();
const conceptsController = require('../controllers/concepts');

router.get('/', conceptsController.getAllConcepts);         // 获取所有知识点
router.get('/:id', conceptsController.getConceptById);      // 获取单个知识点
router.post('/', conceptsController.createConcept);          // 新建知识点（管理员用）

module.exports = router;
