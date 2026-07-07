import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, X as CloseIcon } from 'lucide-react';

// 歌词数据（带时间轴，单位：秒）
const lyricsData = [
  { time: 0.35, text: '刘冠希：离别的眼泪我还不懂' },
  { time: 4.03, text: '孔舒航：回忆淡淡的就像风' },
  { time: 7.38, text: '刘冠希：期待一道彩虹' },
  { time: 9.84, text: '合：连接我们的天空' },
  { time: 30.01, text: '田翌臣：儿时的脚踏车在回忆里褪了色' },
  { time: 33.54, text: '还记得你曾经最喜欢的那首歌' },
  { time: 37.18, text: '记得那种快乐的颜色' },
  { time: 44.10, text: '毛若懿：黄昏的夕阳勾勒出来的景象' },
  { time: 47.82, text: '你微笑看远方' },
  { time: 50.47, text: '一颗星能许多少愿望' },
  { time: 52.78, text: '拥有多少梦想' },
  { time: 58.34, text: '金成焕：你低声说不想离开' },
  { time: 61.57, text: '而我还不明白' },
  { time: 64.81, text: '时间拉着我们跑向不同的天空' },
  { time: 68.14, text: '实现不同的梦' },
  { time: 71.14, text: '刘冠希：在夕阳下最后的拥抱' },
  { time: 74.82, text: '孔舒航：记得你甜美的心跳' },
  { time: 78.29, text: '刘冠希：写下约定的墙角' },
  { time: 81.32, text: '是最美丽的记号' },
  { time: 85.31, text: '孔舒航：离别的眼泪我还不懂' },
  { time: 89.21, text: '刘冠希：回忆淡淡的就像风' },
  { time: 92.63, text: '孔舒航：期待一道彩虹' },
  { time: 95.09, text: '连接我们的天空' },
  { time: 117.04, text: '金成焕：你低声说不想离开' },
  { time: 120.15, text: '而我还不明白' },
  { time: 123.71, text: '时间拉着我们跑向不同的天空' },
  { time: 127.03, text: '实现不同的梦' },
  { time: 129.91, text: '刘冠希：在夕阳下最后的拥抱' },
  { time: 133.66, text: '孔舒航：记得你甜美的心跳' },
  { time: 136.90, text: '刘冠希：写下约定的墙角' },
  { time: 139.91, text: '是最美丽的记号' },
  { time: 143.90, text: '孔舒航：离别的眼泪我还不懂' },
  { time: 147.84, text: '刘冠希：回忆淡淡的就像风' },
  { time: 151.20, text: '孔舒航：期待一道彩虹' },
  { time: 153.74, text: '连接我们的天空' },
  { time: 158.94, text: '李炯柱：如果爱变成剪不断的思念' },
  { time: 162.46, text: '止不住停不下的时间' },
  { time: 166.12, text: '等到雨停之后' },
  { time: 168.31, text: '那一道彩虹' },
  { time: 169.88, text: '把回忆带到永远 Yeah' },
  { time: 175.72, text: '刘冠希：在夕阳下最后的拥抱' },
  { time: 179.74, text: '孔舒航：记得你甜美的心跳' },
  { time: 183.06, text: '刘冠希：写下约定的墙角' },
  { time: 185.99, text: '是最美丽的记号' },
  { time: 190.24, text: '孔舒航：离别的眼泪我还不懂' },
  { time: 193.87, text: '刘冠希：回忆淡淡的就像风' },
  { time: 197.52, text: '孔舒航：期待一道彩虹' },
  { time: 199.94, text: '连接我们的天空' },
  { time: 204.65, text: '刘冠希：在夕阳下最后的拥抱' },
  { time: 208.15, text: '孔舒航：记得你甜美的心跳' },
  { time: 211.47, text: '刘冠希：写下约定的墙角' },
  { time: 214.53, text: '是最美丽的记号' },
  { time: 218.68, text: '孔舒航：离别的眼泪我还不懂' },
  { time: 222.27, text: '刘冠希：回忆淡淡的就像风' },
  { time: 225.75, text: '孔舒航：期待一道彩虹' },
  { time: 228.40, text: '连接我们的天空' },
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
    const audio = new Audio('/TimeZ-彩虹.mp3');
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
                    <h4 className="text-white font-bold text-sm tracking-wide">彩虹</h4>
                    <p className="text-cyan-400/60 font-mono text-[10px] tracking-[0.2em]">TimeZ // ANTHEM</p>
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
