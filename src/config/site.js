// src/config/site.js

// 核心系统配置
// 即使后端宕机或者网络极差，系统也会默认使用这里的保底数据
export const SITE_CONFIG = {
  defaultArticleCount: 170, 
  backendUrl: import.meta.env.VITE_BACKEND_URL || "https://xiaoxiaoyu123.xyz", // 优先读取环境变量，未配置时回退到默认值
};
