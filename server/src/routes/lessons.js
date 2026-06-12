const express = require('express');
const db = require('../db');
const auth = require('../middlewares/auth');
const router = express.Router();

// 获取某个课程下的课时列表
// 未登录/未购买：只返回 free_preview=1 的课时视频地址
// 已购买：返回全部课时视频地址
router.get('/', (req, res) => {
  try {
    const { course_id } = req.query;
    if (!course_id) return res.status(400).json({ error: 'course_id required' });

    const lessons = db.prepare('SELECT id, course_id, title, duration, free_preview, sort_order FROM lessons WHERE course_id = ? ORDER BY sort_order ASC, id ASC').all(course_id);

    // 是否已购买
    let purchased = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'dev-secret');
        const order = db.prepare('SELECT id FROM orders WHERE user_id = ? AND course_id = ? AND status = ?').get(payload.userId, course_id, 'paid');
        if (order) purchased = true;
      } catch {}
    }

    const result = lessons.map(l => ({
      ...l,
      can_play: purchased || l.free_preview === 1,
      // 未购买且不可试看的，不返回视频地址
      video_url: (purchased || l.free_preview === 1)
        ? db.prepare('SELECT video_url FROM lessons WHERE id = ?').get(l.id).video_url
        : ''
    }));

    res.json({ lessons: result, purchased });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 单个课时详情
router.get('/:id', (req, res) => {
  try {
    const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'lesson not found' });
    res.json({ lesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 提交课时观看进度（需登录）
router.post('/:id/progress', auth, (req, res) => {
  try {
    const { watched_seconds, completed } = req.body;
    const lessonId = req.params.id;
    db.prepare(`
      INSERT INTO user_lesson_progress (user_id, lesson_id, watched_seconds, completed)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        watched_seconds = MAX(watched_seconds, excluded.watched_seconds),
        completed = MAX(completed, excluded.completed),
        updated_at = datetime('now','localtime')
    `).run(req.userId, lessonId, watched_seconds || 0, completed ? 1 : 0);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
