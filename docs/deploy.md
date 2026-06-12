# 好课 - 在线学习平台部署文档

## 项目结构

```
录播课/
├── server/          # 后端 API 服务
│   ├── src/
│   │   ├── app.js           # 入口
│   │   ├── db.js            # 数据库初始化
│   │   ├── routes/          # 路由
│   │   │   ├── auth.js      # 微信登录
│   │   │   ├── teachers.js  # 导师
│   │   │   ├── courses.js   # 课程
│   │   │   ├── lessons.js   # 课时
│   │   │   └── orders.js    # 订单
│   │   ├── middlewares/
│   │   │   └── auth.js      # JWT 鉴权
│   │   └── utils/
│   ├── .env                 # 配置文件
│   ├── data/                # SQLite 数据文件（自动生成）
│   └── package.json
├── client/          # 前端 H5（纯 HTML + Vue 3 CDN）
│   └── index.html   # 单页应用入口
└── docs/
    └── deploy.md    # 本文档
```

## 开发环境运行

### 1. 启动后端

```bash
cd server
npm install
node src/app.js
```

服务启动在 http://localhost:4567

### 2. 启动前端（Dev）

前端是纯静态 HTML，直接用浏览器打开 `client/index.html` 即可。

开发时配置代理（推荐用 Nginx 或 VSCode Live Server）：
- 将 `/api` 请求代理到 `http://localhost:4567`
- 或者用 `npx http-server client -P http://localhost:4567`

## 生产环境部署（推荐方案）

### 服务器要求
- 1 核 2G 云服务器（腾讯云轻量 ≈ 38元/月）
- Node.js >= 18
- Nginx

### 部署步骤

1. 将项目上传到服务器
2. 安装依赖
   ```bash
   cd server
   npm install --production
   ```
3. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    root /path/to/client;
    index index.html;

    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:4567;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. 使用 PM2 管理进程
   ```bash
   npm install -g pm2
   pm2 start server/src/app.js --name lubo-api
   pm2 save
   pm2 startup
   ```

## 对接微信（必须配置项）

### 1. 公众号配置
- 已认证服务号（需具备微信支付权限）
- 配置 JSAPI 支付目录：`http://your-domain.com/`
- 配置网页授权域名：`http://your-domain.com/`

### 2. 后端配置（server/.env）
```
WX_APPID=你的公众号AppId
WX_MCHID=你的商户号
WX_API_KEY=你的API密钥
WX_APPSECRET=你的应用Secret
```

### 3. 微信支付对接位置
在以下代码中填入真实的微信 API 调用：
- `server/src/routes/auth.js` → 微信网页授权获取 openid
- `server/src/routes/orders.js` → 微信统一下单 + 支付回调

目前这些位置用了 mock 数据，替换为真实 API 即可上线。

## 视频存储配置

推荐使用阿里云 OSS 或腾讯云 COS，配置在 `.env`：
```
VIDEO_ENDPOINT=
VIDEO_BUCKET=
VIDEO_ACCESS_KEY=
VIDEO_SECRET_KEY=
VIDEO_DOMAIN=
```

视频上传由运营人员在 OSS/COS 控制台直接上传，然后在后台管理系统录入视频 URL。

## 后续迁移小程序

1. 后端 API 完全复用
2. 前端用 uni-app 或 Taro 重新实现 UI 层
3. 小程序支付接口不同（wx.requestPayment），但后端订单逻辑不变
