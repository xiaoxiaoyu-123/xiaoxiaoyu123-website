<div align="center">

# ⚡ Personal Homepage — 沉浸式个人主页

**一个沉浸式、电影感的个人主页，不只是简历，更是你的数字空间。**

🌐 **在线预览**: [bobzhang.top](https://bobzhang.top)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r183-000000?logo=three.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ 这个项目是什么

Personal Homepage 不是一个普通的个人主页——它是一个 **全沉浸式数字空间**，融合了 3D 视觉、动态交互、AI 对话和电影级动效，让访客仿佛走进了一个属于你的赛博世界。

> 🎮 **设计灵感**：极致精致的视觉设计 × 赛博朋克风格的沉浸感 × 社交平台的互动性

---

## 🔥 核心功能

### 🎬 沉浸式开场体验
- 流光渐变动画欢迎页
- 加载进度可视化动效
- 可爱的小怪兽互动登录（眼睛会跟着你的鼠标动！👀）

### 🏠 高端风格主页面
- Bento Grid（网格布局）展示个人信息
- 多语言切换（简中 / 繁中 / 英 / 法 / 德 / 西 / 葡 — 7 种语言）
- 全局背景音乐系统 + 音量控制
- 实时数据仪表盘

### 🎨 我的热爱 — 兴趣展示
- 精致的横向滚动卡片
- 视频画廊 + 自定义海南主题帆船进度条 ⛵
- 影院级画面增强（对比度、饱和度、锐度、2.5x 音频增益）

### 🗺️ 星空足迹地图
- 基于高德地图 SDK 的暗色主题地图
- 访客可"点亮星星"打卡，留下专属足迹
- 星星 + 地名标注的赛博视觉效果
- 独立背景音乐通道

### 🌲 3D 记忆档案
- Three.js + React Three Fiber 打造的 3D 记忆树
- 电影级加载过渡（艺术文字提示 → 场景渐入）
- 照片+视频的沉浸式图库 + 先审后发评论系统

### 🤖 AI 赛博助手
- 可接入主流 AI 大模型的智能对话
- 赛博风格的聊天界面
- 流式响应 + 打字机效果

### 📇 社交档案
- 全平台联系方式（微信 / QQ / 抖音 / Gmail / Twitter / WhatsApp）
- 扫码加好友的 QR 码展示
- 实名留言板 + 邮件通知

### 🛡️ 后台管理
- 评论先审后发机制（敏感词自动过滤）
- IP 定位 + 设备指纹识别
- 访客统计监控仪表盘

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
| **后端** | FastAPI + SQLite |
| **AI** | 兼容主流大模型 API |
| **图标** | Lucide React + Simple Icons |

---

## 🚀 快速开始

### 前置要求

- **Node.js** 18+ 
- **npm** 或 **pnpm**
- **Python** 3.9+（如果需要评论后端）

### 1. 克隆项目

```bash
git clone https://github.com/BobZhang0216/personal-homepage.git
cd personal-homepage
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

打开 `.env`，填入你自己的密钥：

```env
# 高德地图 API（前往 https://lbs.amap.com 注册获取）
VITE_AMAP_KEY=your_amap_js_api_key_here
VITE_AMAP_SECURITY_CODE=your_amap_security_code_here

# 后端 API 地址
VITE_BACKEND_URL=https://your-domain.com
```

### 4. 添加媒体文件

由于视频和音乐文件体积较大，未包含在 Git 仓库中。请将你的媒体资源放入 `public/` 目录：

```
public/
├── bgm.mp3          # 背景音乐
├── bg.jpg           # 欢迎页背景
├── main-bg.jpg      # 主页背景
├── avatar.png       # 头像
├── *.mp4            # 视频素材
└── *.jpg            # 图片素材
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 即可看到效果 🎉

### 6.（可选）启动评论后端

```bash
cd comment_backend
pip install fastapi uvicorn python-multipart user-agents requests
uvicorn main:app --host 0.0.0.0 --port 8080
```

---

## 📁 项目结构

```
personal-homepage/
├── src/
│   ├── App.jsx                    # 应用入口 + 阶段路由
│   ├── MainPage.jsx               # Bento Grid 主页面
│   ├── components/
│   │   ├── AnimatedCharacters.jsx  # 小怪兽登录动画
│   │   ├── LoginForm.jsx          # 登录表单
│   │   ├── Loader.jsx             # 加载动画
│   │   ├── HobbiesSection.jsx     # 兴趣展示 + 地图
│   │   ├── MemoryArchive.jsx      # 3D 记忆档案
│   │   ├── MemoryTree.jsx         # Three.js 记忆树
│   │   ├── SchoolArchive.jsx      # 学校详情
│   │   ├── ExpertiseArchive.jsx   # 技能详情
│   │   ├── ContactArchive.jsx     # 社交联系
│   │   ├── CyberAssistant.jsx     # AI 对话助手
│   │   ├── CyberMusicPlayer.jsx   # 音乐播放器
│   │   ├── CommentAdmin.jsx       # 评论管理后台
│   │   └── ImageGalleryModal.jsx  # 图库弹窗
│   ├── config/
│   │   └── site.js                # 站点配置
│   └── locales/                   # i18n 多语言文件
├── comment_backend/
│   └── main.py                    # FastAPI 评论后端
├── public/                        # 静态资源（图片/视频/音乐）
├── .env.example                   # 环境变量模板
├── .gitignore
├── LICENSE
├── package.json
└── vite.config.js
```

---

## 🌍 国际化支持

内置 **7 种语言** 的完整翻译：

| 语言 | 代码 | 状态 |
|------|------|------|
| 🇨🇳 简体中文 | `zh` | ✅ 完整 |
| 🇭🇰 繁體中文 | `zh-TW` | ✅ 完整 |
| 🇺🇸 English | `en` | ✅ 完整 |
| 🇧🇷 Português | `pt` | ✅ 完整 |
| 🇪🇸 Español | `es` | ✅ 完整 |
| 🇩🇪 Deutsch | `de` | ✅ 完整 |
| 🇫🇷 Français | `fr` | ✅ 完整 |

---

## 🎨 自定义指南

想把这个项目改成你自己的个人主页？以下是你需要修改的地方：

| 需要改的东西 | 文件位置 | 说明 |
|-------------|---------|------|
| 个人信息 | `src/MainPage.jsx` | 姓名、简介、技能标签 |
| 联系方式 | `src/components/ContactArchive.jsx` | 微信/QQ/邮箱/社交账号 |
| 二维码图片 | `src/assets/qr/` | 替换为你的二维码 |
| 学校信息 | `src/components/SchoolArchive.jsx` | 学校名称、描述 |
| 兴趣内容 | `src/components/HobbiesSection.jsx` | 视频、图片、文案 |
| 记忆照片 | `src/components/MemoryArchive.jsx` | 照片列表和描述 |
| 多语言文案 | `src/locales/` | 各语言的翻译文本 |
| 后端地址 | `.env` | `VITE_BACKEND_URL` |
| 地图密钥 | `.env` | `VITE_AMAP_KEY` |
| ICP 备案号 | `src/MainPage.jsx` | 底部备案信息 |

---

## 📄 开源许可

本项目基于 [MIT License](./LICENSE) 开源 — 你可以自由使用、修改和分发。

---

## 🙏 致谢

- [React](https://react.dev/) — 用户界面库
- [Three.js](https://threejs.org/) — 3D 渲染引擎
- [Framer Motion](https://www.framer.com/motion/) — 动画库
- [高德地图](https://lbs.amap.com/) — 地图服务

- [Lucide](https://lucide.dev/) — 图标库
- [TailwindCSS](https://tailwindcss.com/) — CSS 框架

---

<div align="center">

**如果觉得这个项目不错，欢迎给一个 ⭐ Star！**

Made with ❤️ by Bob Zhang

</div>
