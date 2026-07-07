import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLyrics } from '../hooks/useLyrics';

/**
 * 可复用的歌词面板组件
 *
 * Props:
 *   lyricsSource  - 歌词数据数组 [{time, text}] 或 LRC 文本字符串
 *   currentTime   - 音频当前秒数
 *   songTitle     - 当前歌曲标题（显示在顶部）
 *   songArtist    - 当前歌手
 *   className     - 额外的容器样式
 *   height        - 歌词区域高度（默认 200）
 *   accentColor   - 高亮颜色（默认 cyan-400）
 */
export default function LyricsPanel({
  lyricsSource,
  currentTime,
  songTitle,
  songArtist,
  className = '',
  height = 200,
  accentColor = 'cyan',
}) {
  const { currentLineIndex, lyricsData } = useLyrics(lyricsSource, currentTime);
  const containerRef = useRef(null);

  // 自动滚动到当前行
  useEffect(() => {
    if (containerRef.current) {
      const activeLine = containerRef.current.querySelector('[data-active="true"]');
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLineIndex]);

  // 颜色映射
  const colorMap = {
    cyan: {
      text: 'text-cyan-300',
      border: 'border-cyan-500/30',
      shadow: 'rgba(0,255,255,0.6)',
      dot: 'bg-cyan-400',
      dotShadow: 'rgba(0,255,255,0.8)',
    },
    emerald: {
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      shadow: 'rgba(52,211,153,0.6)',
      dot: 'bg-emerald-400',
      dotShadow: 'rgba(52,211,153,0.8)',
    },
    purple: {
      text: 'text-purple-300',
      border: 'border-purple-500/30',
      shadow: 'rgba(168,85,247,0.6)',
      dot: 'bg-purple-400',
      dotShadow: 'rgba(168,85,247,0.8)',
    },
  };
  const colors = colorMap[accentColor] || colorMap.cyan;

  // 没有歌词数据时显示占位
  if (!lyricsData || lyricsData.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-white/20 text-sm font-mono tracking-widest">等待歌词加载...</p>
      </div>
    );
  }

  return (
    <div className={`bg-black/70 backdrop-blur-2xl border ${colors.border} rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.15)] overflow-hidden ${className}`}>
      {/* 顶部标题栏 */}
      <div className="relative px-5 pt-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`}
            style={{ boxShadow: `0 0 8px ${colors.dotShadow}` }}
          />
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide">{songTitle || '未知歌曲'}</h4>
            {songArtist && (
              <p className="text-white/40 font-mono text-[10px] tracking-[0.2em]">{songArtist}</p>
            )}
          </div>
        </div>
      </div>

      {/* 歌词滚动区域 */}
      <div
        ref={containerRef}
        className="overflow-y-auto scrollbar-hide px-5 py-4 space-y-2"
        style={{ height: `${height}px` }}
      >
        {lyricsData.map((line, i) => (
          <motion.div
            key={i}
            data-active={i === currentLineIndex}
            animate={{
              scale: i === currentLineIndex ? 1.05 : 1,
              opacity: i === currentLineIndex ? 1 : 0.35,
            }}
            transition={{ duration: 0.3 }}
            className={`text-center font-medium transition-all duration-300 ${
              i === currentLineIndex
                ? `${colors.text} text-base drop-shadow-[0_0_12px_${colors.shadow}]`
                : i < currentLineIndex
                  ? 'text-white/30 text-sm'
                  : 'text-white/50 text-sm'
            }`}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
