import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, X as CloseIcon } from 'lucide-react';

// 歌词数据（带时间轴，单位：秒）
// 锚点：第一句20s，"博学奠基石"57s
// 如需微调：改 time 值即可
const lyricsData = [
  { time: 0, text: '♫ 前奏 ♫' },
  // === 第一段 ===
  { time: 20, text: '百年风雨，我们一同起航，' },
  { time: 28, text: '三山如画，我们阅尽沧桑。' },
  { time: 36, text: '悠悠长江在这里奔涌，' },
  { time: 44, text: '绵绵文脉在这里激扬。' },
  { time: 57, text: '博学奠基石，求是谱华章，' },
  { time: 65, text: '明德镌心灵，教学共相长。' },
  { time: 73, text: '江苏大学，我们为你骄傲，' },
  { time: 81, text: '继往开来创造新的辉煌！' },
  // === 间奏 ===
  { time: 90, text: '♫ 间奏 ♫' },
  // === 第二段 ===
  { time: 108, text: '百川融汇，我们一起飞翔，' },
  { time: 116, text: '薪火相传，我们超越梦想。' },
  { time: 124, text: '棵棵栋梁在这里成长，' },
  { time: 132, text: '灿灿桃李在这里绽放。' },
  { time: 145, text: '博学奠基石，求是谱华章，' },
  { time: 153, text: '明德镌心灵，教学共相长。' },
  { time: 161, text: '江苏大学，我们为你骄傲，' },
  { time: 169, text: '继往开来创造新的辉煌！' },
  { time: 178, text: '新的辉煌！' },
  { time: 185, text: '♫ ♫ ♫' },
];

export default function CyberMusicPlayer({ logoSrc, onBgmPause, onBgmResume }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);

  // 初始化音频
  useEffect(() => {
    const audio = new Audio('/群星 - 百年辉煌向未来.mp3');
    audio.volume = 1.0;
    audio.loop = true;
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', () => { });
      audio.removeEventListener('timeupdate', () => { });
      audio.removeEventListener('ended', () => { });
      audio.src = '';
      // 退出江大页面时，恢复主页BGM
      onBgmResume?.();
    };
  }, []);

  // 组件挂载后自动播放校歌
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const autoPlay = () => {
      onBgmPause?.();
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => { });
    };
    // 稍微延迟一下，让页面动画先走完
    const timer = setTimeout(autoPlay, 800);
    return () => clearTimeout(timer);
  }, []);

  // 同步歌词索引
  useEffect(() => {
    let idx = 0;
    for (let i = lyricsData.length - 1; i >= 0; i--) {
      if (currentTime >= lyricsData[i].time) {
        idx = i;
        break;
      }
    }
    setCurrentLyricIndex(idx);
  }, [currentTime]);

  // 自动滚动歌词到当前行
  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeLine = lyricsContainerRef.current.querySelector('[data-active="true"]');
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLyricIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      // 校歌暂停 = 安静，不恢复主页BGM
    } else {
      audio.play().catch(() => { });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
    if (v === 0) setIsMuted(true);
    else setIsMuted(false);
  }, []);

  const handleSeek = useCallback((e) => {
    const v = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = v;
    }
    setCurrentTime(v);
  }, []);

  const handleDiscClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      if (!isPlaying) togglePlay();
    } else {
      setIsExpanded(false);
    }
  }, [isExpanded, isPlaying, togglePlay]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-[200] flex flex-col items-start gap-3">
      {/* 展开的歌词面板 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-[320px] bg-black/70 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.15)] overflow-hidden"
          >
            {/* 顶部标题栏 */}
            <div className="relative px-5 pt-5 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide">百年辉煌向未来</h4>
                    <p className="text-cyan-400/60 font-mono text-[10px] tracking-[0.2em]">JSDU_ANTHEM // ACTIVE</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            </div>

            {/* 歌词区域 */}
            <div
              ref={lyricsContainerRef}
              className="h-[200px] overflow-y-auto scrollbar-hide px-5 py-4 space-y-2"
            >
              {lyricsData.map((line, i) => (
                <motion.div
                  key={i}
                  data-active={i === currentLyricIndex}
                  animate={{
                    scale: i === currentLyricIndex ? 1.05 : 1,
                    opacity: i === currentLyricIndex ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`text-center font-medium transition-all duration-300 ${i === currentLyricIndex
                      ? 'text-cyan-300 text-base drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]'
                      : i < currentLyricIndex
                        ? 'text-white/30 text-sm'
                        : 'text-white/50 text-sm'
                    }`}
                >
                  {line.text}
                </motion.div>
              ))}
            </div>

            {/* 进度条 */}
            <div className="px-5 py-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                  [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                style={{
                  background: `linear-gradient(to right, rgb(34,211,238) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) 0%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] font-mono text-white/40">{formatTime(currentTime)}</span>
                <span className="text-[10px] font-mono text-white/40">{formatTime(duration)}</span>
              </div>
            </div>

            {/* 控制栏 */}
            <div className="px-5 pb-4 flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 hover:text-white transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <button
                onClick={toggleMute}
                className="p-1.5 text-white/40 hover:text-white transition-all"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮唱片球 */}
      <motion.button
        onClick={handleDiscClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-16 h-16 rounded-full cursor-pointer group"
      >
        {/* 外层发光圈 */}
        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${isPlaying
            ? 'border-cyan-400/80 shadow-[0_0_25px_rgba(0,255,255,0.4),inset_0_0_15px_rgba(0,255,255,0.1)]'
            : 'border-white/20 shadow-lg'
          }`} />

        {/* 唱片纹理 + 旋转 */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={isPlaying ? { duration: 4, ease: 'linear', repeat: Infinity } : { duration: 0 }}
          className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden"
        >
          {/* 唱片纹路 */}
          <div className="absolute inset-0 rounded-full"
            style={{
              background: `repeating-radial-gradient(circle at center, transparent 0px, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)`,
            }}
          />

          {/* 中心圆（logo 或音符） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${isPlaying
                ? 'bg-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                : 'bg-white/10'
              }`}>
              {logoSrc ? (
                <img src={logoSrc} alt="logo" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <Music size={14} className={`transition-colors ${isPlaying ? 'text-cyan-300' : 'text-white/50'}`} />
              )}
            </div>
          </div>
        </motion.div>

        {/* 播放状态指示灯 */}
        <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black transition-all ${isPlaying ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'bg-white/30'
          }`} />
      </motion.button>
    </div>
  );
}
