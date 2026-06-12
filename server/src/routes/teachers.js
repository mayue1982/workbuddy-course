const express = require('express');
const db = require('../db');
const router = express.Router();

// 获取所有导师列表
router.get('/', (req, res) => {
  try {
    const teachers = db.prepare('SELECT id, name, title, avatar, description FROM teachers WHERE status = ? ORDER BY sort_order ASC, id ASC').all('active');
    res.json({ teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 获取单个导师详情
router.get('/:id', (req, res) => {
  try {
    const teacher = db.prepare('SELECT id, name, title, avatar, description FROM teachers WHERE id = ? AND status = ?').get(req.params.id, 'active');
    if (!teacher) return res.status(404).json({ error: 'teacher not found' });
    res.json({ teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
