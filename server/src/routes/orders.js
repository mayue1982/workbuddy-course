const express = require('express');
const db = require('../db');
const auth = require('../middlewares/auth');
const router = express.Router();

// 创建订单
router.post('/create', auth, (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) return res.status(400).json({ error: 'course_id required' });

    const course = db.prepare('SELECT id, price, title FROM courses WHERE id = ? AND status = ?').get(course_id, 'published');
    if (!course) return res.status(404).json({ error: 'course not found' });

    // 检查是否已购买
    const exist = db.prepare('SELECT id FROM orders WHERE user_id = ? AND course_id = ? AND status = ?').get(req.userId, course_id, 'paid');
    if (exist) return res.status(400).json({ error: 'already purchased' });

    // 生成订单号
    const orderNo = 'wx' + Date.now() + Math.random().toString(36).slice(2, 8);

    const result = db.prepare('INSERT INTO orders (user_id, course_id, amount, wx_order_no) VALUES (?, ?, ?, ?)').run(req.userId, course_id, course.price, orderNo);

    // 实际场景：这里调用微信统一下单 API，获取 prepay_id
    // const prepayRes = await wechat.unifiedOrder({ ... });
    // db.prepare('UPDATE orders SET wx_prepay_id = ? WHERE id = ?').run(prepayRes.prepay_id, result.lastInsertRowid);

    res.json({
      order_id: result.lastInsertRowid,
      wx_order_no: orderNo,
      amount: course.price,
      // prepay_id: prepayRes.prepay_id  // 实际返回给前端调起支付
      prepay_id: 'mock_prepay_' + orderNo
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 支付回调（微信服务器回调 -> 更新订单状态）
router.post('/wx-notify', (req, res) => {
  try {
    // 实际场景：验证微信签名，解析回调 XML
    // 这里模拟成功回调
    const { out_trade_no, transaction_id } = req.body;
    db.prepare('UPDATE orders SET status = ?, wx_transaction_id = ?, paid_at = datetime(\'now\',\'localtime\') WHERE wx_order_no = ? AND status = ?').run('paid', transaction_id || '', out_trade_no, 'pending');
    // 微信要求返回 XML 成功标识
    res.set('Content-Type', 'application/xml');
    res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>');
  } catch (err) {
    console.error('wx-notify error:', err);
    res.status(500).send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
  }
});

// 查询订单状态
router.get('/:order_no/status', auth, (req, res) => {
  try {
    const order = db.prepare('SELECT id, amount, status, wx_order_no FROM orders WHERE wx_order_no = ? AND user_id = ?').get(req.params.order_no, req.userId);
    if (!order) return res.status(404).json({ error: 'order not found' });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 查询用户已购课程
router.get('/my', auth, (req, res) => {
  try {
    const courses = db.prepare(`
      SELECT c.id, c.title, c.cover, c.description, c.teacher_id, o.paid_at
      FROM orders o
      JOIN courses c ON c.id = o.course_id
      WHERE o.user_id = ? AND o.status = ?
      ORDER BY o.paid_at DESC
    `).all(req.userId, 'paid');
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
