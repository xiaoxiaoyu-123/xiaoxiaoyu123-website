<div align="center">

# ⚡ xiaoxiaoyu123 — 沉浸式个人主页

**一个沉浸式、电影感的个人主页，不只是简历，更是我的数字空间。**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r183-000000?logo=three.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ 这个项目是什么

一个**全沉浸式数字空间**，融合了 3D 视觉、动态交互、AI 对话和电影级动效，让访客仿佛走进了一个赛博世界。

---

## 🔥 核心功能

### 🎬 沉浸式开场体验
- 流光渐变动画欢迎页 → 加载动画 → 小怪兽互动登录（眼睛会跟着鼠标动）

### 🏠 高端风格主页面
- Bento Grid 展示个人信息
- 7 种语言切换（简中/繁中/英/葡/西/德/法）
- 全局背景音乐 + 歌词同步面板
- 实时文章数据仪表盘

### 🎨 我的热爱 — 兴趣展示
- 横向滚动卡片 + 视频画廊
- 高德地图 + 访客足迹点亮星星功能

### 🌲 3D 记忆星海
- Three.js + React Three Fiber 打造的 3D 星海粒子效果
- 照片/视频悬浮节点，点击查看详情
- 先审后发评论系统 + 后台管理

### 🏫 教育背景档案
- 全屏视频开场过渡
- 赛博风格信息展示面板

### 🤖 AI 赛博助手
- 接入 DeepSeek 大模型的智能对话
- 赛博风格聊天界面，每日 10 次对话限制

### 📇 社交联系
- 全平台联系方式（微信/QQ/WhatsApp/邮箱/GitHub）
- 扫码加好友
- 实名留言板

### 🎵 歌词同步系统
- 覆盖 4 个页面 7 首歌曲
- LRC 解析器 + 实时滚动高亮

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端框架** | React 19 + Vite 6 |
| **3D 渲染** | Three.js r183 + React Three Fiber + Drei |
| **动效引擎** | Framer Motion |
| **样式** | TailwindCSS 3.4 |
| **国际化** | i18next（7 种语言） |
| **地图** | 高德地图 JS API 2.0 |
| **后端** | FastAPI + MySQL 8.0 |
| **AI** | DeepSeek API |
| **图标** | Lucide React |
| **部署** | Nginx + 1Panel |

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.9+
- MySQL 8.0

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/你的仓库.git
cd xiaoxiaoyu123
```

### 2. 安装前端依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

填入你的密钥：

```env
# 高德地图 API（前往 https://lbs.amap.com 注册获取）
VITE_AMAP_KEY=your_amap_key_here
VITE_AMAP_SECURITY_CODE=your_amap_security_code_here

# 后端 API 地址
VITE_BACKEND_URL=https://your-domain.com
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 🎉

### 5. 启动后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

### 6. 配置数据库

确保 MySQL 中有 `xiaoxiaoyu123` 数据库，启动后端时会自动创建表。

---

## 🌍 国际化支持

| 语言 | 代码 | 状态 |
|------|------|:----:|
| 🇨🇳 简体中文 | `zh` | ✅ |
| 🇭🇰 繁體中文 | `zh-TW` | ✅ |
| 🇺🇸 English | `en` | ✅ |
| 🇧🇷 Português | `pt` | ✅ |
| 🇪🇸 Español | `es` | ✅ |
| 🇩🇪 Deutsch | `de` | ✅ |
| 🇫🇷 Français | `fr` | ✅ |

---

## 📦 生产部署

### 1. 构建前端

```bash
npm run build
```

`dist/` 目录即为构建产物。

### 2. 配置 Nginx 反向代理

将 `dist/` 上传到服务器，在 Nginx 中添加：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    # API 反向代理到后端
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 前端路由（SPA）
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. 后台管理

浏览器访问 `https://your-domain.com/?admin=xiaoxiaoyu123QWabc` 进入评论审核后台。

---

## 📁 项目结构

```
xiaoxiaoyu123/
├── src/
│   ├── App.jsx                    # 应用入口 + 阶段路由
│   ├── MainPage.jsx               # Bento Grid 主页面
│   ├── components/
│   │   ├── AnimatedCharacters.jsx  # 小怪兽登录动画
│   │   ├── LoginForm.jsx          # 登录表单
│   │   ├── Loader.jsx             # 加载动画
│   │   ├── HobbiesSection.jsx     # 兴趣展示 + 地图足迹
│   │   ├── MemoryArchive.jsx      # 3D 记忆星海
│   │   ├── SchoolArchive.jsx      # 教育背景详情
│   │   ├── ExpertiseArchive.jsx   # 技能详情
│   │   ├── ContactArchive.jsx     # 社交联系 + 音乐播放器
│   │   ├── CyberAssistant.jsx     # AI 对话助手
│   │   ├── CyberMusicPlayer.jsx   # 音乐播放器（歌词版）
│   │   ├── LyricsPanel.jsx        # 歌词面板组件
│   │   └── CommentAdmin.jsx       # 评论管理后台
│   ├── hooks/
│   │   ├── useSyncStats.js        # 文章数据同步
│   │   └── useLyrics.js           # 歌词同步 hook
│   ├── utils/
│   │   └── lrcParser.js           # LRC 歌词解析器
│   ├── config/
│   │   └── photos.js              # 记忆树照片数据
│   └── locales/                   # i18n 多语言翻译
├── backend/
│   └── main.py                    # FastAPI + MySQL 后端
├── public/                        # 静态资源（图片/视频/音乐）
├── docs/
│   └── 数据库连接问题排查记录.md    # 部署排错文档
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🎨 自定义指南

| 需要改的东西 | 文件位置 |
|-------------|---------|
| 个人信息 | `src/MainPage.jsx` + `src/locales/main.js` |
| 联系方式 | `src/components/ContactArchive.jsx` |
| 二维码图片 | `src/assets/qr/` |
| 学校信息 | `src/locales/main.js` edu 字段 |
| 兴趣内容 | `src/components/HobbiesSection.jsx` |
| 记忆照片 | `src/config/photos.js` + `public/` |
| 音乐播放列表 | 各组件内的 `PLAYLIST` 常量 |
| 歌词数据 | 各组件内的 `lyricsData` / `bgmLyrics` 常量 |
| 多语言文案 | `src/locales/` |
| 地图密钥 | `.env` |

---

## 📝 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
```

---

## 📄 开源许可

本项目基于 [MIT License](./LICENSE) 开源。

---

<div align="center">

Made with ❤️ by xiaoxiaoyu

</div>
