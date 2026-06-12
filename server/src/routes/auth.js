const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// 微信网页授权回调
// 前端传 code -> 后端换 openid -> 登录/注册 -> 返回 JWT
router.post('/wx-login', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'code required' });

    // 实际场景：用 code 调微信接口换取 openid
    // const wxRes = await axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=${code}&grant_type=authorization_code`);
    // const openid = wxRes.data.openid;

    // 开发阶段模拟 openid
    const openid = 'mock_openid_' + Date.now();

    let user = db.prepare('SELECT * FROM users WHERE openid = ?').get(openid);
    if (!user) {
      const info = db.prepare('INSERT INTO users (openid) VALUES (?)').run(openid);
      user = { id: info.lastInsertRowid, openid, nickname: '', avatar: '' };
    }

    const token = jwt.sign({ userId: user.id, openid: user.openid }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nickname: user.nickname, avatar: user.avatar } });
  } catch (err) {
    console.error('wx-login error:', err);
    res.status(500).json({ error: 'login failed' });
  }
});

// 获取当前用户信息
router.get('/me', require('../middlewares/auth'), (req, res) => {
  const user = db.prepare('SELECT id, openid, nickname, avatar FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ user });
});

module.exports = router;
