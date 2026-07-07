import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, ArrowLeft, ChevronRight, ChevronLeft, Play, Pause, Volume2, VolumeX, Maximize2, MapPin, FileText } from 'lucide-react';
import AMapLoader from '@amap/amap-jsapi-loader';
import LyricsPanel from './LyricsPanel';

// 地图全屏背景音乐歌词（SawanoHiroyuki[nZk],Rei - INERTIA）
const mapBgmLyrics = [
  { time: 6.000, text: "I always knew where I stood" },
  { time: 10.000, text: "I tried to be so good" },
  { time: 14.000, text: "Look at me now, I dunno know how but" },
  { time: 17.800, text: "I'm a real hero" },
  { time: 22.500, text: "No hiding in the shadows, time to strut" },
  { time: 26.300, text: "I'm gonna make a splash to make this cut" },
  { time: 30.000, text: "You've got to believe that I am free" },
  { time: 33.800, text: "So no hesitation" },
  { time: 37.500, text: "Picture your planet in disharmony" },
  { time: 43.500, text: "Jump into the night, cuz I can smell the trouble" },
  { time: 47.300, text: "Don't you miss the fight, just get there at the double" },
  { time: 51.000, text: "I gotta make a difference, I'm moving with a purpose" },
  { time: 54.800, text: "I'm feeling my inertia, inertia, inertia" },
  { time: 59.000, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 62.800, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 66.700, text: "Is it my turn to be the hero?" },
  { time: 69.000, text: "Yeah! Cuz I gotta be the hero" },
  { time: 70.800, text: "Yeah! Cuz I gotta be the hero" },
  { time: 72.700, text: "Yeah! Cuz I gotta be the hero" },
  { time: 77.000, text: "Didn't you know it's enough just to deserve that love?" },
  { time: 80.800, text: "Without a crowd, without a stage" },
  { time: 84.500, text: "You're still a real hero" },
  { time: 88.000, text: "I'm gonna be the last line of defense" },
  { time: 91.500, text: "I'll blow it if I lack the confidence" },
  { time: 95.000, text: "I've got to believe that there's a need for my whole existence" },
  { time: 99.500, text: "Picture your planet in disharmony" },
  { time: 105.000, text: "Jump into the night, cuz I can smell the trouble" },
  { time: 108.500, text: "Don't you miss the fight, just get there at the double" },
  { time: 112.000, text: "I gotta make a difference, I'm moving with a purpose" },
  { time: 115.800, text: "I'm feeling my inertia, inertia, inertia" },
  { time: 120.000, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 123.800, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 127.700, text: "Is it my turn to be the hero?" },
  { time: 130.000, text: "Yeah! Cuz I gotta be the hero" },
  { time: 131.800, text: "Yeah! Cuz I gotta be the hero" },
  { time: 133.700, text: "Yeah! Cuz I gotta be the hero" },
  { time: 138.000, text: "All my life they said that I was strange" },
  { time: 141.800, text: "But I knew that I could be the change" },
  { time: 145.000, text: "I still ain't done enough" },
  { time: 148.500, text: "Not even close" },
  { time: 154.500, text: "Jump into the night, cuz I can smell the trouble" },
  { time: 158.000, text: "Don't you miss the fight, just get there at the double" },
  { time: 161.500, text: "I gotta make a difference, I'm moving with a purpose" },
  { time: 165.500, text: "I'm feeling my inertia, inertia, inertia" },
  { time: 169.800, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 173.000, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 176.000, text: "Is it my turn to be the hero?" },
  { time: 178.500, text: "Yeah! Cuz I gotta be the hero" },
  { time: 180.500, text: "Yeah! Cuz I gotta be the hero" },
  { time: 182.500, text: "Yeah! Cuz I gotta be the hero" },
  { time: 186.000, text: "Jump into the night, cuz I can smell the trouble" },
  { time: 187.500, text: "Don't you miss the fight, just get there at the double" },
  { time: 189.000, text: "I gotta make a difference, I'm moving with a purpose" },
  { time: 190.000, text: "I'm feeling my inertia, inertia, inertia" },
  { time: 190.500, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 191.000, text: "Stubbornly, I will believe, I will believe, keep dreaming" },
  { time: 191.500, text: "Is it my turn to be the hero?" },
  { time: 192.000, text: "Yeah! Cuz I gotta be the hero" },
  { time: 192.800, text: "Yeah! Cuz I gotta be the hero" },
  { time: 193.600, text: "Yeah! Cuz I gotta be the hero" },
];

// 兴趣页背景音乐歌词（西罕 - 我看过 女声版）
const hobbiesBgmLyrics = [
  { time: 3.75, text: "我看过你说好一辈子" },
  { time: 7.27, text: "我看过你的无微不至" },
  { time: 11.22, text: "我看过你说想要时间停止" },
  { time: 15.27, text: "拉着我的手喊我名字" },
  { time: 35.11, text: "你的回答都犹豫了一下" },
  { time: 42.94, text: "在我面前怎么开始害怕说错话" },
  { time: 50.63, text: "你在眺望窗外无关的景象" },
  { time: 58.02, text: "保持沉默和你的优雅" },
  { time: 65.95, text: "想陪你假装没事" },
  { time: 69.42, text: "天真把分开延迟" },
  { time: 73.61, text: "现实却比我们诚实" },
  { time: 80.91, text: "我看过你说好一辈子" },
  { time: 84.75, text: "我看过你的无微不至" },
  { time: 88.68, text: "我看过你说想要时间停止" },
  { time: 92.60, text: "拉着我的手喊我名字" },
  { time: 96.35, text: "我看过你说谎的方式" },
  { time: 100.37, text: "我看过爱情自然变质" },
  { time: 104.30, text: "就算错过这样到此为止" },
  { time: 111.84, text: "至少我看过你爱我的样子" },
  { time: 117.63, text: "沉默空气戳破你的心事" },
  { time: 121.55, text: "你难过伤心又有几次" },
  { time: 125.22, text: "你脸上的陌生表情" },
  { time: 127.39, text: "是你给的诠释" },
  { time: 131.24, text: "我看着你飘忽的心思" },
  { time: 135.01, text: "也看见我无谓的坚持" },
  { time: 138.91, text: "亲爱的不要再说你还爱我" },
  { time: 142.80, text: "因为看过你爱我的样子" },
  { time: 147.01, text: "我看过的最美的落日" },
  { time: 150.55, text: "是你陪我看海的样子" },
  { time: 154.87, text: "就算错过这样到此为止" },
  { time: 162.39, text: "至少我看过你爱我的样子" },
];

// 高德安全密钥配置（从环境变量读取，不在代码中硬编码）
window._AMapSecurityConfig = {
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
};

// ----------------------------------------------------
// WGS84 转 GCJ02 (火星坐标系) 转换算法
// ----------------------------------------------------
const a = 6378245.0;
const ee = 0.00669342162296594323;

function outOfChina(lng, lat) {
  return (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271);
}

function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLng(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
  return ret;
}

function wgs84ToGcj02(lng, lat) {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  }
  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  let radlat = lat / 180.0 * Math.PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  let sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * Math.PI);
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * Math.PI);
  let mglat = lat + dlat;
  let mglng = lng + dlng;
  return [mglng, mglat];
}

// ===== 数据配置 (Apple Pro 高端设计版本) =====

const SLIDER_ITEMS = [
  {
    id: 'idol-1',
    category: '',
    title: '全州骑旅\n首个HC级！！！',
    subtitle: '',
    description: '第一次长途骑行，和初中的朋友一起，雾雨天气，爬坡38km，九个小时，海拔约1.7km。时至今日，仍历历在目，我想难以忘怀的回忆也是骑行的意义之一',
    img: '/bg.jpg',
    // video: '/2026063001.mp4',
    gallery:[
      '/2025060101.jpg',
      '/2025060102.jpg',
      '/2025060103.jpg',
      '/2025060104.jpg',
    ],
    accentColor: '#0071eb', 
  },
  {
    id: 'idol-2',
    category: '',
    title: '桂电车协\n校园休闲骑',
    subtitle: '休闲骑行',
    description: '每一次团骑，都是对校园的探索。桂林电子科技大学的校园骑行，带来的是轻松与愉悦的体验。无论是晨光中的操场，还是傍晚的林荫道，每一段路都充满了青春的气息。',
    img: '/project2.jpg',
    gallery:[
      '/2025092601.jpg',
      '/2025092602.jpg',
    ],
    accentColor: '#af52de', 
  },
  {
    id: 'hobby-1',
    category: '',
    title: '桂电X师大X桂理\n三校共骑大圩古镇',
    subtitle: '',
    description: '三校共骑，跨校交流，骑行大圩古镇，感受历史与现代的交融。每一次骑行都是对友谊的加深，也是对自我挑战的超越。',
    // img: '/fzhp.jpg',
    gallery:[
      '/2025100101.jpg',
      '/2025100102.jpg',
      '/2025100103.jpg',
    ],
    accentColor: '#34c759',
  },
  {
    id: 'hobby-2',
    category: '',
    title: '五校联骑\n海洋乡百公里!',
    subtitle: '',
    description: '五校联骑，共赴海洋乡，挑战百公里骑行。在自然的怀抱中，感受团队的力量与坚持的意义。',
    // img: '/wzhp.jpg',
    gallery:[
      '/2025112201.jpg',
      '/2025112202.jpg',
      '/2025112203.jpg',
      '/2025112204.jpg',
      '/2025112205.jpg',
    ],
    accentColor: '#ff9500', 
  },
  {
    id: 'hobby-school',
    category: '',
    title: '这次和你一起\n看那落日与晚霞',
    subtitle: '单飞',
    description: '尧山，海拔约1.3km，单飞骑行，挑战自我。每一次独自骑行，都是对意志的磨炼，也是对自由的追求。',
    img: '/0d5e4ae8f2352d09ca65cc0e6ba419a2.jpg',
    gallery: [
      '/2026011401.jpg',
      '/2026011402.jpg',
      '/2026011403.jpg',
    ],
    accentColor: '#ff3b30', 
  },
  {
    id: 'slider-hobby-4',
    category: '',
    title: '猫宁小院，\n撸猫小能手上线！',
    subtitle: '撸猫',
    description: '享受与猫咪的亲密时光，感受它们的温暖与陪伴。每一次撸猫，都是心灵的治愈，也是生活的小确幸。',
    video: '/2026063001.mp4',
    accentColor: '#5856d6', 
  },
];

const DETAIL_ITEMS = [
  { 
    id: 'detail-0', 
    category: '', 
    title: '桂林全州天湖骑旅',
    description: '全州天湖骑旅，挑战自我，感受自然的壮丽。骑行在湖光山色之间，每一次踏板都是对身体与心灵的洗礼。', 
    img: null, 
    video: null, 
    gallery: ['/2025060101.mp4'],
    accentColor: '#0071eb'
  },
  { 
    id: 'detail-1', 
    category: '', 
    title: '欢迎报考桂林电子科技大学', 
    description: '欢迎报考桂林电子科技大学，校园景色优美，学术氛围浓厚，是追求知识与梦想的理想之地。',
    img: null, 
    video: null, 
    gallery: ['/小孩姐要考桂电_x264.mp4'],
    accentColor: '#af52de'
  },
  { 
    id: 'detail-values', 
    category: '', 
    title: '个人价值观', 
    description: '信奉实用主义，渴望以技术为杠杆放大产能；深耕长期主义，凭极强自律积累寻求复利；拥抱前瞻科技，致力于解决真实痛点，创造社会价值！', 
    img: '/6301366b8767838a135df8fc9650a728.jpg', 
    imgPosition: 'top',
    video: '/028aa2b1e3b869b1a9beb7f7d30b7da6.mp4', 
    gallery: [
      '/6301366b8767838a135df8fc9650a728.jpg',
      '/a669805bcf4e271b74a9e7657c3cf154.jpg',
      '/1831b7c3eb5185a0090699b39fec6f62.jpg'
    ],
    accentColor: '#34c759'
  },
  {
    id: 'detail-personality',
    category: '',
    title: '偏输出型平衡人格',
    description: '爱表达分享，有想法就想说，关键时也能沉心吸收、默默思考，能说能写、能动能静，越输出越清醒，越分享越有动力！',
    img: '/fdcc1a1d1e6a97d72d48f28fb0992d87.jpg',
    imgPosition: 'top',
    video: null,
    gallery: [
      '/fdcc1a1d1e6a97d72d48f28fb0992d87.jpg',
      '/519b4c4de78850b92ecc087c6c9cd140.jpg',
      '/aaccd79db9940d4a667d39c1d5211fb8.jpg',
      '/a38352c8e15631d04901157946a382b9.jpg'
    ],
    accentColor: '#af52de',
  },
  { 
    id: 'detail-mvp', 
    category: '', 
    title: '关于我的个人爱好', 
    description: '喜欢骑行、撸猫、羽毛球、网球等运动，享受运动带来的快乐与健康，也喜欢探索新鲜事物，保持好奇心和学习的热情。', 
    img: '/ed4d9515a907d5076ddc3b016d2306c7.jpg', 
    video: null,
    accentColor: '#ff9500'
  },
  { 
    id: 'hobby-4', 
    category: '', 
    title: '留下您的足迹', 
    description: '点亮每一颗星星，纪念来过的足迹', 
    img: null, 
    gallery: [
      '/5f2e641966aa7030f4d799dce7932126.jpg',
      '/42580f20d62e39c3460b7411f1a19829.jpg'
    ],
    accentColor: '#5856d6'
  }
];

// ===== 音乐跳动条组件 (优化版：支持变色与精准停顿) =====
function MusicVisualizer({ isPlaying }) {
  const bars = [
    { id: 1, duration: 0.6 },
    { id: 2, duration: 0.8 },
    { id: 3, duration: 0.5 },
    { id: 4, duration: 0.7 },
  ];

  return (
    <div className="flex items-center gap-[2.5px] h-3 w-5 justify-center">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          initial="stopped"
          animate={isPlaying ? "playing" : "stopped"}
          variants={{
            playing: {
              height: ["20%", "100%", "20%"],
              backgroundColor: ["#0071eb", "#af52de", "#ff2d55", "#0071eb"],
              transition: {
                height: {
                  repeat: Infinity,
                  duration: bar.duration,
                  ease: "easeInOut",
                },
                backgroundColor: {
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "linear",
                }
              }
            },
            stopped: {
              height: "20%",
              backgroundColor: "#b4b4b8",
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            }
          }}
          className="w-[2.5px] rounded-full"
        />
      ))}
    </div>
  );
}

// [抽离组件] 全屏大图/视频展示模态框 (Lightbox)
function ImageLightbox({ item, onClose, isLocalPlaying, setIsLocalPlaying, hobbyAudioRef }) {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const videoRef = useRef(null);
  const audioCtxRef = useRef(null);

  // --- 自定义播放器状态 ---
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // [新增] 音量状态，默认50%
  const [showControls, setShowControls] = useState(false); // 默认隐藏控制器
  const controlsTimeoutRef = useRef(null);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const currentMedia = item.gallery ? item.gallery[galleryIdx] : (item.video || item.img);
    const isSpecial21s = currentMedia?.includes('e70a1fcc');
    const maxTime = isSpecial21s ? 21 : duration;
    
    const newTime = (e.target.value / 100) * maxTime;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    
    // 如果之前是静音状态但用户现在拖动了音量条，则自动取消静音
    if (newVolume > 0 && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  // 1. [接管背景音乐] 建立持久化的静音逻辑，防止切片时音乐“闪跳”
  const initiallyPlayingRef = useRef(isLocalPlaying);

  useEffect(() => {
    // 弹窗完全关闭时，根据初始状态恢复 BGM
    return () => {
      if (initiallyPlayingRef.current) {
        setIsLocalPlaying(true);
        hobbyAudioRef?.current?.play().catch(()=>{});
      }
    };
  }, []);

  useEffect(() => {
    const currentMedia = item.gallery ? item.gallery[galleryIdx] : (item.video || item.img);
    const isVideo = currentMedia?.toLowerCase().endsWith('.mp4');

    if (isVideo) {
      if (hobbyAudioRef?.current) hobbyAudioRef.current.pause(); // 强制在 DOM 层级暂停
      setIsLocalPlaying(false);
    }
  }, [item.video, item.gallery, galleryIdx, hobbyAudioRef]);

  // 2. [音频放大器] 提升至 2.0 倍音量增益
  // - [x] multimedia Sensory Upgrades
  // - [x] Sync BGM logic with gallery videos (Pause/Resume correctly)
  // - [x] Boost Audio Gain to 2.0x (Web Audio API)
  // - [x] Apply Cinematic Visual Filters (High Contrast/Sharpness)
  // - [x] Verify functionality:
  //     - [x] Test BGM pause/resume on gallery switch and close
  //     - [x] Verify 2x volume boost on both new videos
  //     - [x] Visual inspection of color/sharpness
  useEffect(() => {
    const currentMedia = item.gallery ? item.gallery[galleryIdx] : (item.video || item.img);
    const isVideo = currentMedia?.toLowerCase().endsWith('.mp4');

    if (isVideo && videoRef.current) {
      const video = videoRef.current;
      
      const setupAudio = () => {
          try {
              if (audioCtxRef.current) return;
              const AudioContext = window.AudioContext || window.webkitAudioContext;
              const ctx = new AudioContext();
              audioCtxRef.current = ctx;

              const source = ctx.createMediaElementSource(video);
              const gainNode = ctx.createGain();
              
              // 针对两个海岛视频，将其声音放大至当前系统增强(2.0)的1.25倍，即 2.5 倍
              const isSpecific = currentMedia?.includes('e70a1fcc') || currentMedia?.includes('2926be56218');
              gainNode.gain.value = isSpecific ? 2.5 : 2.0; 

              source.connect(gainNode);
              gainNode.connect(ctx.destination);
          } catch (e) {
              console.warn("Audio amplification failed:", e);
          }
      };

      video.addEventListener('play', setupAudio, { once: true });
      return () => {
          if (audioCtxRef.current) {
              audioCtxRef.current.close();
              audioCtxRef.current = null;
          }
      };
    }
  }, [item.video, item.gallery, galleryIdx]);

  // [新增] 60FPS 丝滑进度同步引擎
  useEffect(() => {
    let rafId;
    const currentMedia = item.gallery ? item.gallery[galleryIdx] : (item.video || item.img);
    const isSpecial21s = currentMedia?.includes('e70a1fcc');

    const smoothSync = () => {
      if (videoRef.current && !videoRef.current.paused) {
        setCurrentTime(videoRef.current.currentTime);
        // 精准循环拦截，比 onTimeUpdate 更快，防止越界闪烁
        if (isSpecial21s && videoRef.current.currentTime >= 21) {
          videoRef.current.currentTime = 0;
        }
      }
      rafId = requestAnimationFrame(smoothSync);
    };

    if (!isPaused) {
      rafId = requestAnimationFrame(smoothSync);
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPaused, item.video, item.gallery, galleryIdx]);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (item.gallery) {
      setGalleryIdx((prev) => (prev - 1 + item.gallery.length) % item.gallery.length);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (item.gallery) {
      setGalleryIdx((prev) => (prev + 1) % item.gallery.length);
    }
  };

  const currentMedia = item.gallery ? item.gallery[galleryIdx] : (item.video || item.img);
  const isHainanSpecial = currentMedia?.includes('2926be56218') || currentMedia?.includes('e70a1fcc');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 lg:p-12 select-none"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 right-0 z-[110] flex items-center justify-between px-6 lg:px-12 py-8">
        <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer shadow-lg active:scale-90"
        >
            <X size={24} />
        </button>
      </div>

      {/* [新增] 独立悬浮于右下角的引流按钮 */}
      {isHainanSpecial && (
          <a 
              href="https://lwt.hainan.gov.cn/" 
              target="_blank" 
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-8 right-6 lg:bottom-12 lg:right-12 z-[150] flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#0284c7] backdrop-blur-md border border-white/20 hover:border-[#0284c7]/50 text-[13px] md:text-[14px] font-semibold tracking-wide transition-all shadow-2xl text-white no-underline active:scale-95 ease-in-out duration-300"
          >
              点击进入海南省旅文厅了解更多 <span className="font-sans text-[16px] leading-none mb-[1px] ml-0.5 opacity-80">↗</span>
          </a>
      )}

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative max-w-6xl w-full flex-1 flex items-center justify-center my-12"
        onClick={(e) => e.stopPropagation()}
      >
        {item.gallery && item.gallery.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-[-20px] lg:left-[-80px] z-[120] w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer shadow-2xl active:scale-90"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-[-20px] lg:right-[-80px] z-[120] w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer shadow-2xl active:scale-90"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        <AnimatePresence mode="wait">
          {(() => {
            const isVideo = currentMedia?.toLowerCase().endsWith('.mp4');
            const isSpecial21s = currentMedia?.includes('e70a1fcc');

            if (isVideo) {
              if (!isHainanSpecial) {
                  // 普通视频使用原生控制条
                  return (
                    <motion.div 
                      key={currentMedia}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-black group/player flex items-center justify-center"
                    >
                      <video 
                        ref={videoRef}
                        src={currentMedia} 
                        className="w-full h-full object-contain shadow-2xl" 
                        style={{ 
                          filter: 'contrast(1.2) brightness(1.1) saturate(1.25) drop-shadow(0 0 10px rgba(0,0,0,0.3))',
                          imageRendering: '-webkit-optimize-contrast',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'translateZ(0)'
                        }}
                        controls
                        autoPlay
                        playsInline
                        onPlay={() => {
                            if (hobbyAudioRef?.current) hobbyAudioRef.current.pause();
                            setIsLocalPlaying(false);
                            setIsPaused(false);
                        }}
                        onPause={() => setIsPaused(true)}
                      />
                    </motion.div>
                  );
              }

              // 海南特殊视频使用自定义"帆船海浪"主题控制条
              const displayTime = isSpecial21s ? Math.min(currentTime, 21) : currentTime;
              const displayDuration = isSpecial21s ? 21 : duration;
              const progress = (displayTime / (displayDuration || 1)) * 100;

              return (
                <motion.div 
                  key={currentMedia}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onMouseMove={handleMouseMove}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-black group/player"
                >
                  <video 
                    ref={videoRef}
                    src={currentMedia} 
                    draggable={false}
                    className="w-full h-full object-contain select-none" 
                    style={{ 
                      filter: 'contrast(1.25) brightness(1.12) saturate(1.3) drop-shadow(0 0 15px rgba(0,0,0,0.4))',
                      imageRendering: '-webkit-optimize-contrast',
                      WebkitBackfaceVisibility: 'hidden',
                      WebkitUserDrag: 'none',
                      transform: 'translateZ(0)'
                    }}
                    autoPlay
                    playsInline
                    disablePictureInPicture
                    disableRemotePlayback
                    onContextMenu={(e) => e.preventDefault()}
                    onPlay={() => setIsPaused(false)}
                    onPause={() => setIsPaused(true)}
                    onLoadedMetadata={(e) => {
                      setDuration(e.target.duration);
                      e.target.volume = volume; // 初始化视频由于 HTML5 限制默认为 1，我们这里强制设为 50%
                    }}
                    onTimeUpdate={(e) => {
                      // 仅在暂停状态下跟随点击/拖拽进度条的更新
                      if (videoRef.current?.paused) {
                          setCurrentTime(e.target.currentTime);
                      }
                    }}
                  />

                  {/* 自定义控制条 - Apple Pro Style */}
                  <motion.div 
                    animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
                    className="absolute inset-x-0 bottom-0 z-[130] p-6 lg:p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  >
                    {/* 进度条 (海南专属海浪主题) */}
                    <div className="relative w-full h-2 bg-white/20 rounded-full mb-8 group cursor-pointer overflow-visible border border-white/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
                        {/* 播放过的轨道 (海浪) */}
                        <div 
                            className="absolute top-0 left-0 h-full rounded-full wave-bg shadow-sm"
                            style={{ width: `${progress}%` }}
                        />
                        
                        {/* 透明滑块 */}
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                        />
                        
                        {/* 帆船图标作为进度指示点 */}
                        <div 
                          className="absolute pointer-events-none z-20"
                          style={{ left: `${progress}%`, top: '1px', transform: 'translate(-50%, -100%)' }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">
                            <path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" fill="#fff" stroke="none"/>
                            <path d="M21 14 10 2 3 14h18Z" fill="#fff" stroke="none"/>
                            <path d="M10 2v16" stroke="none"/>
                          </svg>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-6 z-30 relative">
                            <button onClick={togglePlay} className="hover:scale-110 transition-transform active:scale-95 drop-shadow-md">
                                {isPaused ? <Play fill="currentColor" size={24} /> : <Pause fill="currentColor" size={24} /> }
                            </button>
                            
                            <div className="text-[14px] font-medium tracking-tight font-mono opacity-90">
                                {formatTime(displayTime)} <span className="mx-1 opacity-40">/</span> {formatTime(displayDuration)}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 z-30 relative group/volume" onClick={(e) => e.stopPropagation()}>
                            <button onClick={toggleMute} className="hover:scale-110 transition-transform active:scale-95 opacity-80 hover:opacity-100 flex-shrink-0">
                                {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} /> }
                            </button>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.01" 
                                value={isMuted ? 0 : volume} 
                                onChange={handleVolumeChange} 
                                className="w-20 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer transition-all hover:h-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full shadow-sm"
                                style={{ background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)` }}
                            />
                        </div>
                    </div>
                  </motion.div>

                  {/* 全屏透明点击层，用于点击视频本体切换播放状态和显示控制器 */}
                  <div 
                    className="absolute inset-0 z-10" 
                    onClick={(e) => {
                       togglePlay();
                       handleMouseMove(); // 点击时顺便唤醒控制条
                    }}
                  />

                  {/* 中心播放/暂停状态指示（可选） */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                     <AnimatePresence>
                        {isPaused && (
                             <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="p-8 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                                <Play fill="currentColor" size={48} />
                             </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
                </motion.div>
              );
            } else {
              return (
                <motion.img 
                    key={currentMedia}
                    src={currentMedia} 
                    alt={item.title} 
                    draggable={false}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] select-none" 
                    style={{ WebkitUserDrag: 'none' }}
                />
              );
            }
          })()}
        </AnimatePresence>
      </motion.div>

      {/* 标题说明区：从 absolute 移出，放入 flex 流中确保不被遮挡 */}
      <div className="w-full text-center pb-8 lg:pb-12 z-[110]" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-white text-[24px] md:text-[32px] font-bold tracking-tight mb-2 whitespace-pre-line">{item.title}</h3>
          {item.subtitle && <p className="text-white/50 text-[14px] md:text-[16px] font-medium uppercase tracking-widest">{item.subtitle}</p>}
          {item.gallery && (
            <div className="flex justify-center gap-1.5 mt-4">
              {item.gallery.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === galleryIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`} />
              ))}
            </div>
          )}
      </div>
    </motion.div>
  );
}

// ===== Apple 风格横向滚动卡片 =====
function HorizontalCards({ items, onSelect }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, lastX: 0, lastTime: 0, velocity: 0 });
  const hasDragged = useRef(false);
  const momentumRef = useRef(null);

  const loopItems = [...items, ...items, ...items];

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const oneSetWidth = el.scrollWidth / 3;
    el.scrollLeft = oneSetWidth;
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const oneSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft <= 0) {
      el.scrollLeft += oneSetWidth;
    } else if (el.scrollLeft >= oneSetWidth * 2) {
      el.scrollLeft -= oneSetWidth;
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.children[0]?.offsetWidth || 400;
    scrollRef.current.scrollBy({ left: dir * (cardWidth + 24), behavior: 'smooth' });
  };

  const startMomentum = (velocity) => {
    if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
    let v = velocity;
    const friction = 0.95;
    const tick = () => {
      if (!scrollRef.current || Math.abs(v) < 0.5) return;
      scrollRef.current.scrollLeft -= v;
      v *= friction;
      momentumRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
    setIsDragging(true);
    hasDragged.current = false;
    dragState.current = {
      startX: e.clientX,
      scrollLeft: scrollRef.current.scrollLeft,
      lastX: e.clientX,
      lastTime: Date.now(),
      velocity: 0
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging || !scrollRef.current) return;
      const dx = e.clientX - dragState.current.startX;
      if (Math.abs(dx) > 5) hasDragged.current = true;
      scrollRef.current.scrollLeft = dragState.current.scrollLeft - dx;
      const now = Date.now();
      const dt = now - dragState.current.lastTime;
      if (dt > 0) dragState.current.velocity = (e.clientX - dragState.current.lastX) / dt * 16;
      dragState.current.lastX = e.clientX;
      dragState.current.lastTime = now;
    };
    const onUp = () => {
      setIsDragging(false);
      if (Math.abs(dragState.current.velocity) > 1) startMomentum(dragState.current.velocity);
    };
    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-4 px-6 lg:px-12 apple-scroll"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        <style dangerouslySetInnerHTML={{ __html: `.apple-scroll::-webkit-scrollbar { display: none; }` }} />
        {loopItems.map((item, idx) => (
          <CardItem 
            key={`${item.id}-${idx}`} 
            item={item} 
            onClick={() => !hasDragged.current && onSelect(idx % items.length)} 
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-5 px-6 lg:px-12 mt-8">
        <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"><ArrowLeft size={20} /></button>
        <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 hover:border-blue-200"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
}

function CardItem({ item, onClick }) {
  const [internalIdx, setInternalIdx] = useState(0);

  // [新增] 自动播放逻辑：每 3 秒自动切换下一张图
  useEffect(() => {
    if (!item.gallery || item.gallery.length <= 1) return;

    const timer = setInterval(() => {
      setInternalIdx((prev) => (prev + 1) % item.gallery.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [item.gallery]);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (item.gallery) {
      setInternalIdx((prev) => (prev - 1 + item.gallery.length) % item.gallery.length);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (item.gallery) {
      setInternalIdx((prev) => (prev + 1) % item.gallery.length);
    }
  };

  const currentDisplayImg = item.gallery ? item.gallery[internalIdx] : item.img;

  return (
    <div
      onClick={onClick}
      className="shrink-0 w-[350px] md:w-[400px] aspect-[3/4.2] rounded-[32px] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col cursor-pointer group transition-transform duration-500 hover:scale-[1.02]"
    >
      <div className="flex-[1.4] overflow-hidden relative">
        {item.video ? (
          <video 
            src={item.video} 
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none ${item.imgPosition === "top" ? "object-top" : ""}`} 
            style={{ 
                WebkitUserDrag: 'none',
                filter: 'contrast(1.08) saturate(1.12) brightness(1.02)',
                imageRendering: '-webkit-optimize-contrast'
            }}
            autoPlay 
            muted 
            loop 
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            onContextMenu={(e) => e.preventDefault()}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentDisplayImg}
              src={currentDisplayImg} 
              alt={item.title} 
              draggable={false}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none ${item.imgPosition === "top" ? "object-top" : ""}`} 
              style={{ WebkitUserDrag: 'none' }}
            />
          </AnimatePresence>
        )}

        {/* 卡片内切换按钮 (仅在有图库时显示) */}
        {item.gallery && item.gallery.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-white/50 transition-all active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-white/50 transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* 指示点 */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 translate-y-2 group-hover:translate-y-0 transition-transform">
              {item.gallery.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === internalIdx ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} />
              ))}
            </div>
          </div>
        )}

        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none"></div>
      </div>
      <div className="flex-1 p-8 flex flex-col justify-between bg-white relative z-10 transition-colors group-hover:bg-[#fbfbfd]">
        <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#86868b] tracking-widest uppercase">{item.category}</span>
            <h3 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight group-hover:text-[#0071eb] transition-colors whitespace-pre-line">{item.title}</h3>
            <p className="text-[15px] text-[#6e6e73] font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-2">{item.subtitle}</p>
        </div>
        <div className="flex justify-end">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#0071eb] group-hover:text-white transition-all">
                <ArrowLeft size={18} className="rotate-[135deg]" />
            </div>
        </div>
      </div>
    </div>
  );
}

// [新增] 用于标题闪烁光泽的全局样式
const shimmerStyle = `
  @keyframes shimmer-glint {
    0% { background-position: 250% center; }
    100% { background-position: -250% center; }
  }
  .liquid-shimmer {
    background: linear-gradient(
      90deg, 
      #1d1d1f 0%, 
      #1d1d1f 48%, 
      #ffffff 50%, 
      #1d1d1f 52%, 
      #1d1d1f 100%
    );
    background-size: 500% auto;
    background-attachment: fixed;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer-glint 10s linear infinite;
  }
  
  @keyframes wave-flow {
    0% { background-position: 0 0, 0 0; }
    100% { background-position: -20px 0, 0 0; }
  }
  .wave-bg {
    background-color: #0284c7;
    background-image: 
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='0 0 20 10'%3E%3Cpath d='M0,5 Q5,10 10,5 T20,5' fill='none' stroke='white' stroke-opacity='0.4' stroke-width='2'/%3E%3C/svg%3E"),
      linear-gradient(90deg, #0284c7, #38bdf8);
    background-size: 20px 10px, 100% 100%;
    animation: wave-flow 1s linear infinite;
  }
`;

// ===== 动态碎片重组标题组件 =====
function AssembleTitle() {
  const characters = ["纯", "粹", "的", "热", "爱"];
  const containerRef = useRef(null);
  
  // 鼠标追踪物理逻辑 (3D 倾斜)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setRotateY((e.clientX - centerX) / (rect.width / 2) * 15);
    setRotateX((centerY - e.clientY) / (rect.height / 2) * 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // 为每个字定制独一无二的入场物理轨迹
  const getInitialState = (i) => {
    const trajectory = [
      { x: 450, y: 100, rotateY: 270, scale: 0.1 },   
      { x: -300, y: 300, rotateZ: 360, rotateX: 90 }, 
      { x: -100, y: 400, rotate: 180, scale: 0.3 },   
      { x: -400, y: -150, rotate: -60, scale: 0.5 },  
      { x: 150, y: -400, rotateX: 120, scale: 2 },    
    ];
    return trajectory[i];
  };

  return (
    <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="perspective-1000 mb-12"
        style={{ perspective: '1200px' }}
    >
      <style dangerouslySetInnerHTML={{ __html: shimmerStyle }} />
      <motion.h1 
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="text-[64px] md:text-[100px] lg:text-[120px] font-bold tracking-tight leading-none flex justify-center select-none pointer-events-auto"
      >
        {characters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, ...getInitialState(i), filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, filter: 'blur(0px)' }}
            whileHover={{ 
                scale: 1.15, 
                z: 50,
                rotate: (Math.random() - 0.5) * 10,
                transition: { type: 'spring', stiffness: 300, damping: 10 }
            }}
            transition={{
              duration: 1.8,
              delay: 0.1 * i,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block transition-shadow duration-300 hover:drop-shadow-[0_10px_20px_rgba(0,113,235,0.2)] liquid-shimmer"
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}

export default function HobbiesSection({ onBack, bgmAudioRef, isBgmPlaying, setIsBgmPlaying }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const sectionRef = useRef(null);
  const amapRef = useRef(null);
  const mapContainerRef = useRef(null); // [新增] 直连地图 DOM 的 Ref
  const clusterRef = useRef(null);
  
  // 地图交互相关状态
  const [mapData, setMapData] = useState([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [lastCheckinPos, setLastCheckinPos] = useState(null);
  
  // [新增] 访客唯一标识
  const [visitorId, setVisitorId] = useState("");
  
  useEffect(() => {
    let vid = localStorage.getItem('starry_visitor_id');
    if (!vid) {
        vid = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem('starry_visitor_id', vid);
    }
    setVisitorId(vid);
  }, []);
  
  // [新增] 全屏地图专属背景音乐 Ref & 状态
  const localMapAudioRef = useRef(null);
  const [isMapMusicPlaying, setIsMapMusicPlaying] = useState(false);
  const wasGlobalBgmPlaying = useRef(false);

  // 当前播放时间 & 歌词显示
  const [currentTime, setCurrentTime] = useState(0);
  const [mapCurrentTime, setMapCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  // 初始化地图专属 BGM
  useEffect(() => {
    const audio = new Audio('/SawanoHiroyuki[nZk],Rei - INERTIA.mp3');
    audio.loop = true;
    audio.volume = 0.6;
    audio.ontimeupdate = () => setMapCurrentTime(audio.currentTime);
    localMapAudioRef.current = audio;

    return () => {
        if (localMapAudioRef.current) {
            localMapAudioRef.current.pause();
            localMapAudioRef.current = null;
        }
    };
  }, []);

  // 音乐接管逻辑
  useEffect(() => {
    if (isMapExpanded) {
        // 1. 进入全屏地图：记录全局 BGM 状态并暂停它
        if (isBgmPlaying && bgmAudioRef?.current) {
            wasGlobalBgmPlaying.current = true;
            bgmAudioRef.current.pause();
            setIsBgmPlaying(false);
        }
        // 2. 播放全屏地图专属音乐
        localMapAudioRef.current?.play()
            .then(() => setIsMapMusicPlaying(true))
            .catch(e => console.warn("Map BGM play blocked:", e));
    } else {
        // 3. 退出全屏地图：停止专属音乐
        if (localMapAudioRef.current) {
            localMapAudioRef.current.pause();
            localMapAudioRef.current.currentTime = 0; // 重置进度
            setIsMapMusicPlaying(false);
        }
        // 4. 如果之前全局在播，则恢复它
        if (wasGlobalBgmPlaying.current && bgmAudioRef?.current) {
            bgmAudioRef.current.play().catch(e => console.warn("Global BGM resume failed:", e));
            setIsBgmPlaying(true);
            wasGlobalBgmPlaying.current = false;
        }
    }
  }, [isMapExpanded]);

  const fetchFootprints = async () => {
    try {
      const res = await fetch('/api/footprints');
      if (res.ok) {
         const data = await res.json();
         // 假设返回的数据是数组结构 [{lat: 1.2, lng: 3.4}, ...]
         console.log("Fetched footprints:", data.length);
         setMapData(data);
      }
    } catch (e) {
      console.error("Failed to fetch map data", e);
    }
  };

  // 初始化地图的函数 (加强版：增加控制台追踪)
  const initMap = () => {
    const container = mapContainerRef.current;
    if (!container || amapRef.current) return;

    console.log("正在尝试初始化地图...");
    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale'],
    })
    .then((AMap) => {
        if (!mapContainerRef.current || amapRef.current) return;
        
        console.log("AMap SDK 加载成功，开始创建实例...");
        const map = new AMap.Map(mapContainerRef.current, {
            mapStyle: 'amap://styles/darkblue',
            zoom: 4,
            zooms: [3, 15],
            center: [105.0, 35.0],
            viewMode: '3D' // 强制开启 3D 模式提升渲染稳定性
        });
        map.addControl(new AMap.Scale());
        
        map.on('complete', () => {
            console.log("地图完全加载并绘制成功！");
            amapRef.current = map;
            fetchFootprints();
        });
    })
    .catch((e) => {
        console.error("地图加载引擎故障:", e);
    });
  };

  // 核心：监听容器变动，自动初始化
  useEffect(() => {
    let retryCount = 0;
    const checkTimer = setInterval(() => {
        if (mapContainerRef.current && !amapRef.current) {
            initMap();
            retryCount++;
            if (retryCount > 10) clearInterval(checkTimer); // 最多重试 10 次
        }
    }, 500);

    return () => {
        clearInterval(checkTimer);
        if (amapRef.current) {
            amapRef.current.destroy();
            amapRef.current = null;
        }
    };
  }, []);

  useEffect(() => {
    if (!amapRef.current || !window.AMap || !mapData.length) return;
    
    // 如果已有单独的点，先清空 (使用 clearMap)
    amapRef.current.clearMap();

    const elements = [];
    mapData.forEach((d) => {
      const lng = parseFloat(d.lng);
      const lat = parseFloat(d.lat);
      const title = d.title || '星空足迹';

      // 1. 星星本体 (所有缩放级别可见)
      const starMarker = new window.AMap.Marker({
        position: [lng, lat],
        content: `<div style="font-size: 24px; color: #ffcc00; filter: drop-shadow(0 0 6px rgba(255, 204, 0, 0.7)); display:flex; justify-content:center; align-items:center; cursor:pointer;" title="${title}">⭐</div>`,
        offset: new window.AMap.Pixel(-12, -12),
        extData: { title, description: d.description }
      });
      elements.push(starMarker);

      // 2. ID 标签 (仅在地图放大到很细的级别 >=14 时才显示)
      if (title && title !== '星空足迹' && title !== '匿名访客') {
          const textLabel = new window.AMap.Text({
              position: [lng, lat],
              text: title,
              anchor: 'top-center',
              offset: new window.AMap.Pixel(0, 25), // 增加间距，彻底避开星星光晕
              zooms: [14, 20], // 限制仅在 14~20 级缩放时可见
              style: {
                  'background-color': 'rgba(25, 25, 28, 0.3)', // 极高透明度，极致纯净
                  'border': '1px solid rgba(255, 255, 255, 0.1)',
                  'border-radius': '6px',
                  'color': '#eeeeee',
                  'font-size': '12px',
                  'padding': '3px 8px',
                  'box-shadow': '0 2px 8px rgba(0,0,0,0.5)',
                  'backdrop-filter': 'blur(4px)'
              }
          });
          elements.push(textLabel);
      }
    });

    // 直接将星星和标签一起加到地图上
    amapRef.current.add(elements);
  }, [mapData]);

  // [新增] 撤销点亮的逻辑
  const handleCancelCheckin = async (id) => {
    if (!window.confirm("确定要取消这颗星星吗？")) return;
    
    try {
        const res = await fetch(`/api/footprints/${id}?visitor_id=${visitorId}`, {
            method: 'DELETE'
        });
        const result = await res.json();
        if (result.status === 'success') {
            await fetchFootprints();
            alert("✨ 撤销成功，那一颗星星已经归还给夜空。");
        } else {
            alert(result.message || "撤销失败");
        }
    } catch (e) {
        console.error(e);
        alert("网络请求失败，请稍后再试。");
    }
  };
    


  const handleCheckin = () => {
    if (!navigator.geolocation) {
      alert("您的浏览器不支持地理位置功能。");
      return;
    }

    // 在获取定位之前，弹窗询问用户的署名 ID
    const userInput = window.prompt("✨ 发现新星！\n请为您将要点亮的这颗星星留下一个专属署名 (ID) 吧：", "");
    if (userInput === null) {
      // 用户点击了取消
      return;
    }
    const finalId = userInput.trim() || "匿名点亮者";

    setIsCheckingIn(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // WGS84 国标转 GCJ02 火星坐标
        const [gcj02Lng, gcj02Lat] = wgs84ToGcj02(longitude, latitude);

        const res = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lat: gcj02Lat, 
            lng: gcj02Lng, 
            title: finalId, 
            description: "前端打卡点亮", 
            visitor_id: visitorId, // [新增]
            timestamp: new Date().toISOString() 
          })
        });
        if (res.ok) {
           await fetchFootprints();
           setLastCheckinPos([gcj02Lng, gcj02Lat]);
           setIsCheckingIn(false); 
           
           // 只弹窗提示，不自动放大和飞屏
           setTimeout(() => {
               alert("✨ 恭喜！这一刻，您已在星空地图点亮了一颗属于您的星星。");
           }, 100);
           return;
        } else {
           alert("点亮失败，请检查网络或服务端状态。");
        }
      } catch (e) {
        console.error(e);
        alert("请求错误，导致点亮星星失败。");
      } finally {
        setIsCheckingIn(false);
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      // 更加详细的错误揭示
      let errorMsg = "无法获取位置。";
      if (error.code === 1) errorMsg = "您拒绝了定位请求，请在浏览器地址栏左侧重新开启权限。";
      else if (error.code === 2) errorMsg = "暂时无法获取您的地理位置，请稍后再试。";
      else if (error.code === 3) errorMsg = "定位超时，请检查网络或到空旷地方重试。";
      
      alert(errorMsg);
      setIsCheckingIn(false);
    }, {
      enableHighAccuracy: true, // 开启高精度模式，获取更精确的坐标
      timeout: 10000,
      maximumAge: 0 // 不使用缓存的位置
    });
  };

  const toggleLocalMusic = (e) => {
    e.stopPropagation();
    if (isMapExpanded) {
        // 全屏地图下控制专属音乐
        if (localMapAudioRef.current) {
            if (isMapMusicPlaying) {
                localMapAudioRef.current.pause();
            } else {
                localMapAudioRef.current.play().catch(err => console.error(err));
            }
            setIsMapMusicPlaying(!isMapMusicPlaying);
        }
    } else {
        // 非全屏下控制全局音乐
        if (bgmAudioRef && bgmAudioRef.current) {
            if (isBgmPlaying) {
                bgmAudioRef.current.pause();
            } else {
                bgmAudioRef.current.play().catch(err => console.error(err));
            }
            setIsBgmPlaying(!isBgmPlaying);
        }
    }
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 追踪全局 BGM 的播放进度
  useEffect(() => {
    const audio = bgmAudioRef?.current;
    if (!audio) return;
    const handler = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', handler);
    return () => audio.removeEventListener('timeupdate', handler);
  }, [bgmAudioRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={sectionRef}
      className="fixed inset-0 z-[50] overflow-y-auto bg-[#fbfbfd] select-none selection:bg-transparent"
      style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', 
        scrollbarWidth: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <div className="sticky top-0 z-[60] flex items-center justify-between px-6 lg:px-12 py-6 bg-white/70 backdrop-blur-xl border-b border-gray-100">
         <button onClick={onBack} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100/50 hover:bg-gray-100 text-[#0071eb] text-[15px] font-semibold transition-all border border-gray-200/30 cursor-pointer shadow-sm hover:scale-105 active:scale-95"><ArrowLeft size={16} /> 返回主页</button>
         
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-gray-200">
                <span className="text-[11px] font-bold text-[#86868b] tracking-widest uppercase">Now Playing</span>
            </div>
            
            {/* 专属音乐控制器 */}
            <button 
                onClick={toggleLocalMusic}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:border-blue-200 transition-all active:scale-95 cursor-pointer group"
            >
                <MusicVisualizer isPlaying={isMapExpanded ? isMapMusicPlaying : isBgmPlaying} />
                <span className="text-[13px] font-bold text-[#1d1d1f] group-hover:text-[#0071eb] transition-colors">
                    {(isMapExpanded ? isMapMusicPlaying : isBgmPlaying) ? '暂停' : '点击播放'}
                </span>
            </button>

            <div className="pl-2 border-l border-gray-200 hidden md:block">
                <div className="text-[14px] font-bold text-[#1d1d1f]">
                    {isMapExpanded ? "INERTIA" : "我看过"} / <span className="text-[#86868b]">{isMapExpanded ? "SawanoHiroyuki" : "西罕"}</span>
                </div>
            </div>

            {/* 播放时间 + 歌词按钮 */}
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <span className="text-[11px] font-mono text-[#86868b] tabular-nums w-10 text-center">
                {formatTime(isMapExpanded ? mapCurrentTime : currentTime)}
              </span>
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`p-2 rounded-full transition-all cursor-pointer active:scale-90 ${
                  showLyrics
                    ? 'bg-[#0071eb]/10 text-[#0071eb]'
                    : 'text-[#86868b] hover:text-[#0071eb] hover:bg-[#0071eb]/5'
                }`}
                title="歌词"
              >
                <FileText size={16} />
              </button>
            </div>
          </div>
      </div>

      {/* 歌词面板 */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-20 z-[60] w-full max-w-md mx-auto px-6"
          >
            <LyricsPanel
              lyricsSource={isMapExpanded ? mapBgmLyrics : hobbiesBgmLyrics}
              currentTime={isMapExpanded ? mapCurrentTime : currentTime}
              songTitle={isMapExpanded ? "INERTIA" : "我看过"}
              songArtist={isMapExpanded ? "SawanoHiroyuki[nZk],Rei" : "西罕"}
              height={160}
              accentColor={isMapExpanded ? "cyan" : "purple"}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative pt-20 lg:pt-32 pb-20 px-6 lg:px-12 text-center overflow-hidden">
        <AssembleTitle />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} className="text-[20px] lg:text-[24px] text-[#86868b] max-w-2xl mx-auto leading-relaxed font-semibold tracking-[0.2em] uppercase">
            骑行 & 撸猫 & 桂电 & 羽毛球 & 网球
        </motion.p>
      </div>

      <div className="pb-32 mt-12">
        <HorizontalCards items={SLIDER_ITEMS} onSelect={(idx) => setSelectedItem(SLIDER_ITEMS[idx])} />
      </div>

      {/* ===== 下方 feature 区块 (Apple 大段图文排版) ===== */}
      <div className="bg-white">
        {DETAIL_ITEMS.map((item, idx) => (
            <motion.section
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-150px' }}
            transition={{ duration: 0.9, cubicBezier: [0.22, 1, 0.36, 1] }}
            className={`w-full py-28 lg:py-48 ${idx % 2 === 1 ? 'bg-[#fbfbfd]' : 'bg-white'}`}
            >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* 文字侧 */}
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-[17px] font-bold text-[#6e6e73] tracking-widest uppercase mb-5 block"
                    >
                        {item.category}
                    </motion.span>
                    
                    <h2 className="text-[48px] md:text-[60px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1d1d1f] mb-8">
                        {item.title}
                    </h2>
                    
                    <p className="text-[20px] md:text-[23px] text-[#6e6e73] leading-[1.45] max-w-xl mb-6 font-medium tracking-tight">
                        {item.description}
                    </p>

                    {item.id === 'hobby-4' && (
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCheckin}
                                disabled={isCheckingIn}
                                className={`px-6 py-3.5 rounded-full font-bold text-[15px] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${isCheckingIn ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#1d1d1f] text-white hover:bg-black hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]'}`}
                            >
                                <MapPin size={18} className={isCheckingIn ? "animate-bounce" : ""} />
                                {isCheckingIn ? "定位并传送中..." : "📍 在我的坐标点亮星星"}
                            </motion.button>

                            {/* [新增] 只有当该访客有点亮记录时，才显示取消按钮 */}
                            {mapData.some(d => d.visitor_id === visitorId) && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        // 找到该访客点亮的最后一张星（通常是 ID 最大的）
                                        const myPoints = mapData.filter(d => d.visitor_id === visitorId);
                                        const lastPoint = myPoints[myPoints.length - 1];
                                        if (lastPoint) handleCancelCheckin(lastPoint.id);
                                    }}
                                    className="px-6 py-3.5 rounded-full font-bold text-[15px] border-2 border-red-500/20 text-red-500 hover:bg-red-50 hover:border-red-500/40 transition-all cursor-pointer flex items-center gap-2"
                                >
                                    <X size={18} />
                                    取消点亮
                                </motion.button>
                            )}
                        </div>
                    )}
                </div>

                {/* 图片/视频侧 - Apple 极净预览 */}
                <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                    {item.id === 'hobby-4' ? (
                         <div 
                             className={isMapExpanded 
                                ? "fixed inset-0 z-[100] bg-[#1a1a1c] transition-all duration-500 ease-in-out" 
                                : "relative overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-[#1a1a1c] w-full aspect-[4/3.5] z-10 transition-all duration-500 ease-in-out"
                             }
                         >
                             <button
                                 key="map-toggle-trigger"
                                 onClick={() => setIsMapExpanded(!isMapExpanded)}
                                 className={`absolute top-4 ${isMapExpanded ? 'left-4' : 'right-4'} z-[400] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg cursor-pointer`}
                                 title={isMapExpanded ? "缩小地图" : "放大地图"}
                             >
                                 {isMapExpanded ? <ArrowLeft size={20} /> : <Maximize2 size={20} />}
                             </button>

                             {/* [新增] 全屏地图下的音乐控制小胶囊 (右上角) */}
                             {isMapExpanded && (
                                <div key="map-music-control" className="absolute top-4 right-4 z-[400] flex items-center gap-3 px-4 py-2 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md rounded-full transition-all shadow-xl">
                                    <button
                                         onClick={toggleLocalMusic}
                                         className="flex items-center gap-4 cursor-pointer group"
                                     >
                                         <MusicVisualizer isPlaying={isMapMusicPlaying} />
                                         <div className="flex flex-col text-left">
                                             <span className="text-[12px] font-bold text-white/90 leading-none mb-1">INERTIA</span>
                                             <span className="text-[10px] text-white/40 leading-none">
                                                 {isMapMusicPlaying ? '正在播放' : '已暂停'}
                                             </span>
                                         </div>
                                         <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all border border-white/5 shadow-sm">
                                            {isMapMusicPlaying ? (
                                                <Pause size={14} className="text-white fill-current" />
                                            ) : (
                                                <Play size={14} className="text-white fill-current ml-0.5" />
                                            )}
                                         </div>
                                     </button>

                                     {/* 播放时间 */}
                                     <span className="text-[10px] font-mono text-white/40 tabular-nums w-10 text-center">
                                       {formatTime(mapCurrentTime)}
                                     </span>

                                     {/* 歌词按钮 */}
                                     <button
                                       onClick={() => setShowLyrics(!showLyrics)}
                                       className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                         showLyrics
                                           ? 'bg-cyan-500/20 text-cyan-400'
                                           : 'text-white/40 hover:text-cyan-400 hover:bg-white/5'
                                       }`}
                                       title="歌词"
                                     >
                                       <FileText size={14} />
                                     </button>
                                </div>
                             )}

                             {/* 地图模式歌词面板 */}
                             {isMapExpanded && showLyrics && (
                               <div className="absolute top-20 right-4 z-[400] w-72">
                                 <LyricsPanel
                                   lyricsSource={mapBgmLyrics}
                                   currentTime={mapCurrentTime}
                                   songTitle="INERTIA"
                                   songArtist="SawanoHiroyuki[nZk],Rei"
                                   height={200}
                                   accentColor="cyan"
                                 />
                               </div>
                             )}

                             <div 
                                 ref={mapContainerRef}
                                 key="amap-container-core"
                                 id="amap-container"
                                 style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1c', zIndex: 10, borderRadius: 'inherit' }}
                             ></div>
                         </div>
                    ) : (
                        <>
                            <motion.div
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                onClick={() => setSelectedItem(item)}
                                className="relative overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-gray-50 cursor-zoom-in group"
                            >
                                {item.img ? (
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        draggable={false}
                                        className={`w-full aspect-[4/3.5] object-cover transition-transform duration-700 group-hover:scale-105 select-none ${item.imgPosition === "top" ? "object-top" : ""}`}
                                        style={{ WebkitUserDrag: 'none' }}
                                    />
                                ) : (
                                    <div className="w-full aspect-[4/3.5] bg-black relative">
                                        <video
                                            src={item.gallery && item.gallery[0]}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                            style={{ 
                                                filter: 'contrast(1.05) brightness(1.05) saturate(1.1)',
                                                imageRendering: '-webkit-optimize-contrast'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                )}
                            </motion.div>

                            {/* 操作引导：移动至图片下方 */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center justify-center gap-2 mt-6 text-[13px] font-bold text-[#0071eb] opacity-80"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0071eb] animate-pulse"></div>
                                {item.img ? '点击图片观看内容' : '点击视频观看内容'}
                            </motion.div>
                        </>
                    )}
                </div>
                </div>
            </div>
            </motion.section>
        ))}
      </div>

      <div className="relative bg-white py-32 lg:py-48 px-6 lg:px-12 text-center border-t border-gray-100">
        <h2 className="text-[48px] md:text-[64px] font-bold text-[#1d1d1f] tracking-tight mb-10">探索永无止境</h2>
        <button onClick={onBack} className="px-10 py-4 bg-[#1d1d1f] text-white text-[17px] font-bold rounded-full hover:bg-black transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95">返回主座舱</button>
        
        {/* [新增] 右下角版权/侵权声明 */}
        <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-12 text-[12px] text-[#6e6e73] opacity-90 font-medium italic">
            * 以上内容有部分来源于网络，如有侵权请联系本人进行删除
        </div>
      </div>

      {/* 沉浸式大图查看器 */}
      <AnimatePresence>
        {selectedItem && (
          <ImageLightbox
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            isLocalPlaying={isBgmPlaying}
            setIsLocalPlaying={setIsBgmPlaying}
            hobbyAudioRef={bgmAudioRef}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
