import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../config/site';

export function useSyncStats() {
  const [articleCount, setArticleCount] = useState(SITE_CONFIG.defaultArticleCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 异步无声拉取最新统计数据
    const fetchStats = async () => {
      try {
        // 判断环境：生产环境用绝对路径，本地开发如果配置了 Proxy 可以用相对路径
        const url = '/api/public_stats';
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        
        const json = await res.json();
        if (json.status === 'success' && json.data?.article_count) {
          setArticleCount(json.data.article_count);
        }
      } catch (error) {
        console.warn('Failed to sync dynamic stats, falling back to local config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    articleCount,
    isLoading
  };
}
