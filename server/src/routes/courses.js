const express = require('express');
const db = require('../db');
const router = express.Router();

// 获取课程列表（可按导师筛选）
router.get('/', (req, res) => {
  try {
    const { teacher_id } = req.query;
    let sql = 'SELECT id, teacher_id, title, cover, description, price, original_price FROM courses WHERE status = ?';
    const params = ['published'];
    if (teacher_id) {
      sql += ' AND teacher_id = ?';
      params.push(teacher_id);
    }
    sql += ' ORDER BY sort_order ASC, id DESC';
    const courses = db.prepare(sql).all(...params);
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 获取单个课程详情（含购买状态）
router.get('/:id', (req, res) => {
  try {
    const course = db.prepare('SELECT id, teacher_id, title, cover, description, price, original_price, created_at FROM courses WHERE id = ?').get(req.params.id);
    if (!course) return res.status(404).json({ error: 'course not found' });

    const teacher = db.prepare('SELECT id, name, title, avatar FROM teachers WHERE id = ?').get(course.teacher_id);
    course.teacher = teacher || null;

    // 如果用户已登录，查询是否已购买
    let purchased = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'dev-secret');
        const order = db.prepare('SELECT id FROM orders WHERE user_id = ? AND course_id = ? AND status = ?').get(payload.userId, course.id, 'paid');
        if (order) purchased = true;
      } catch {}
    }

    res.json({ course, purchased });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
