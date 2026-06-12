const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || require('path').resolve(__dirname, '../data/app.db');
fs.mkdirSync(path.dirname(path.resolve(DB_PATH)), { recursive: true });

const db = new Database(path.resolve(DB_PATH));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active','hidden')),
    created_at DATETIME DEFAULT (datetime('now','localtime')),
    updated_at DATETIME DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id),
    title TEXT NOT NULL,
    cover TEXT DEFAULT '',
    description TEXT DEFAULT '',
    price INTEGER NOT NULL DEFAULT 0,
    original_price INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now','localtime')),
    updated_at DATETIME DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL REFERENCES courses(id),
    title TEXT NOT NULL,
    duration INTEGER DEFAULT 0,
    video_url TEXT DEFAULT '',
    free_preview INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now','localtime')),
    updated_at DATETIME DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openid TEXT UNIQUE NOT NULL,
    nickname TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    created_at DATETIME DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','paid','refunded','closed')),
    wx_prepay_id TEXT DEFAULT '',
    wx_order_no TEXT DEFAULT '',
    wx_transaction_id TEXT DEFAULT '',
    paid_at DATETIME,
    created_at DATETIME DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    watched_seconds INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT (datetime('now','localtime')),
    UNIQUE(user_id, lesson_id)
  );

  CREATE INDEX IF NOT EXISTS idx_orders_user_course ON orders(user_id, course_id);
  CREATE INDEX IF NOT EXISTS idx_orders_wx_order ON orders(wx_order_no);
  CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
  CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
`);

module.exports = db;
