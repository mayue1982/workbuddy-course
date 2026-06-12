const db = require("./src/db");

db.prepare("DELETE FROM teachers").run();
db.prepare("DELETE FROM courses").run();
db.prepare("DELETE FROM lessons").run();

db.prepare("INSERT INTO teachers (name, title, description) VALUES ('张一鸣', '高级架构师 / 10年大厂经验', '曾在阿里巴巴、字节跳动担任技术负责人，擅长微服务架构与高并发系统设计。授课风格深入浅出，注重实战。')").run();
db.prepare("INSERT INTO teachers (name, title, description) VALUES ('李雪琴', '前端技术专家 / Vue团队成员', 'Vue.js 核心贡献者之一，开源项目累计 Star 5万+。对前端工程化有深刻理解。')").run();
db.prepare("INSERT INTO teachers (name, title, description) VALUES ('王浩然', 'AI算法工程师 / 中科院博士', '中科院计算所博士，曾获Kaggle金牌。专注大模型应用与AI产品落地。')").run();

db.prepare("INSERT INTO courses (teacher_id, title, description, price, original_price, status) VALUES (1, 'Spring Boot 从零到项目实战', '从零搭建Spring Boot项目，涵盖REST API、数据库、缓存、消息队列等核心内容。附带一个完整的电商后台项目。', 19900, 39900, 'published')").run();
db.prepare("INSERT INTO courses (teacher_id, title, description, price, original_price, status) VALUES (1, '微服务架构设计原理', '深入剖析微服务架构的核心模式，包括服务拆分、服务治理、分布式事务、链路追踪等。', 29900, 49900, 'published')").run();
db.prepare("INSERT INTO courses (teacher_id, title, description, price, original_price, status) VALUES (2, 'Vue3 完全指南', '覆盖Vue3全部核心概念：Composition API、响应式原理、状态管理、路由、SSR等。', 14900, 29900, 'published')").run();
db.prepare("INSERT INTO courses (teacher_id, title, description, price, original_price, status) VALUES (2, 'TypeScript 高级编程', '从类型系统到底层原理，带你彻底掌握TypeScript。包括泛型、类型体操、声明文件编写等进阶内容。', 12900, 25900, 'published')").run();
db.prepare("INSERT INTO courses (teacher_id, title, description, price, original_price, status) VALUES (3, 'ChatGPT API 应用开发', '学会用OpenAI API构建自己的AI应用。涵盖Prompt工程、Function Calling、Embedding、RAG等核心主题。', 24900, 44900, 'published')").run();
db.prepare("INSERT INTO courses (teacher_id, title, description, price, original_price, status) VALUES (3, '机器学习入门与实战', '用Python从零实现机器学习算法，涵盖分类、回归、聚类、神经网络等经典模型。', 9900, 19900, 'published')").run();

db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (1, '课程介绍与环境搭建', 780, 1, 1)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (1, 'Spring Boot 核心注解详解', 1200, 1, 2)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (1, 'RESTful API 设计与实现', 1500, 0, 3)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (1, '数据库整合与JPA实战', 1800, 0, 4)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (1, '缓存与消息队列', 2100, 0, 5)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (1, '项目实战：电商后台（上）', 2400, 0, 6)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (1, '项目实战：电商后台（下）', 2000, 0, 7)").run();

db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (3, 'Vue3 与 Vue2 的区别', 900, 1, 1)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (3, 'Composition API 入门', 1500, 1, 2)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (3, '响应式原理深入', 2200, 0, 3)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (3, 'Pinia 状态管理', 1300, 0, 4)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (3, 'Vue Router 4 详解', 1100, 0, 5)").run();

db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (5, 'AI 时代的机会', 600, 1, 1)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (5, 'OpenAI API 快速上手', 1200, 1, 2)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (5, 'Prompt Engineering 进阶', 1800, 0, 3)").run();
db.prepare("INSERT INTO lessons (course_id, title, duration, free_preview, sort_order) VALUES (5, 'Function Calling 实战', 1600, 0, 4)").run();

console.log("Seed data inserted!");
process.exit(0);
