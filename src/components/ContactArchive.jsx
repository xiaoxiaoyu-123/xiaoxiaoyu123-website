import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Mail,
  Twitter,
  Instagram,
  MessageCircle,
  AtSign,
  Terminal,
  ScanLine,
  Phone,
  Radio,
  ChevronRight,
  Copy,
  ExternalLink,
  Plus,
  Github,
  X,
  Music,
  Play,
  Pause,
  SkipForward,
  FileText
} from 'lucide-react';
import LyricsPanel from './LyricsPanel';

// 🚀 模块化导入二维码，确保打包后路径百分百正确，永不丢失
import wechatQR from '../assets/qr/wechat.jpg';
import qqQR from '../assets/qr/qq.jpg';
import whatsappQR from '../assets/qr/whatsapp.jpg';

const WeChatIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
  </svg>
);

const QQIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673" />
  </svg>
);

const WhatsAppIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.984c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const GmailIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const XIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const NavButton = ({ id, icon: Icon, label, active, onClick, colorClass = "text-white", activeBgClass = "bg-cyan-500", borderColorClass = "border-white" }) => {
  return (
    <motion.button 
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
      className="group relative flex flex-col items-center justify-center p-2 w-16"
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${active 
        ? `${activeBgClass} border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]` 
        : 'bg-white/80 border-transparent text-slate-900 group-hover:bg-white group-hover:text-black group-hover:shadow-xl'}`}>
        <Icon size={28} strokeWidth={active ? 3 : 2} />
      </div>
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 pointer-events-none z-[60]">
        <span className={`font-black text-[9px] tracking-[0.1em] uppercase transition-all px-2 py-0.5 rounded-md whitespace-nowrap ${active ? 'bg-white text-black opacity-100 shadow-xl' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'}`}>
          {label}
        </span>
      </div>
    </motion.button>
  );
};

// ===== 音乐跳动条组件 (赛博主题) =====
function MusicVisualizer({ isPlaying }) {
  const bars = [
    { id: 1, duration: 0.6 },
    { id: 2, duration: 0.8 },
    { id: 3, duration: 0.5 },
    { id: 4, duration: 0.7 },
  ];

  return (
    <div className="flex items-center gap-[3px] h-3 w-6 justify-center">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          initial="stopped"
          animate={isPlaying ? "playing" : "stopped"}
          variants={{
            playing: {
              height: ["20%", "100%", "20%"],
              backgroundColor: ["#22d3ee", "#818cf8", "#2dd4bf", "#22d3ee"],
              transition: {
                height: { repeat: Infinity, duration: bar.duration, ease: "easeInOut" },
                backgroundColor: { repeat: Infinity, duration: 2.5, ease: "linear" }
              }
            },
            stopped: {
              height: "20%",
              backgroundColor: "rgba(34, 211, 238, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }
          }}
          className="w-[3px] rounded-full"
        />
      ))}
    </div>
  );
}

const PLAYLIST = [
  { title: "瞬", artist: "郑润泽 ", url: "/郑润泽-瞬.mp3", lyrics: [
    { time: 21, text: "我想 说不清哪天" },
    { time: 24, text: "你就会回来" },
    { time: 26, text: "可太多的思念" },
    { time: 29, text: "却压着时钟转" },
    { time: 33, text: "喜欢 在夜深人静" },
    { time: 37, text: "零碎的不堪" },
    { time: 40, text: "能孤单的 大胆" },
    { time: 46, text: "太多挂念" },
    { time: 49, text: "光好刺眼" },
    { time: 53, text: "殆尽之前" },
    { time: 55, text: "你出现在我眼前" },
    { time: 59, text: "就当是我的幻觉 慢一点" },
    { time: 64, text: "如果倒转思念" },
    { time: 68, text: "在这之前" },
    { time: 71, text: "能够将我换为你来选" },
    { time: 74, text: "你要让时间怎么转" },
    { time: 80, text: "刚错过的怎么换" },
    { time: 87, text: "不想到醒来缺一块" },
    { time: 93, text: "我想过忘记" },
    { time: 96, text: "是最后最坏的打算" },
    { time: 100, text: "一尘不染" },
    { time: 104, text: "如此简单" },
    { time: 136, text: "你羞涩的拍下的相片纸" },
    { time: 138, text: "第一次的画面" },
    { time: 140, text: "你让我触动了这按键" },
    { time: 142, text: "是放松的那面" },
    { time: 144, text: "再到后来慢慢的瓦解" },
    { time: 146, text: "在暂时分别那天" },
    { time: 148, text: "谁能够想到那是我们" },
    { time: 151, text: "两人之间最后的一面" },
    { time: 154, text: "明明在这之前" },
    { time: 157, text: "相拥的如此坚定" },
    { time: 160, text: "说着一直在身边" },
    { time: 164, text: "说过要一起看的海" },
    { time: 168, text: "现在我独自等待" },
    { time: 171, text: "你要让时间怎么转" },
    { time: 177, text: "刚错过的怎么换" },
    { time: 183, text: "不想到醒来缺一块" },
    { time: 189, text: "我想过忘记" },
    { time: 192, text: "是最后最坏的打算" },
    { time: 196, text: "我的无力成为了我的败笔" },
    { time: 200, text: "我是无法做到真的毫不在意" },
    { time: 205, text: "我只能做的只是每天" },
    { time: 209, text: "默念 默念" },
    { time: 214, text: "忘记是最后最后的最坏打算" },
    { time: 218, text: "一尘不染" },
    { time: 222, text: "如此简单" },
    { time: 228, text: "不断的失重" },
    { time: 232, text: "直到我失控" },
    { time: 236, text: "没有任何理由" },
    { time: 240, text: "你已经看见" },
    { time: 244, text: "怎会相信我说的我不痛" },
    { time: 249, text: "你要让时间怎么转" },
    { time: 255, text: "刚错过的怎么换" },
    { time: 261, text: "不想到醒来缺一块" },
    { time: 267, text: "我想过忘记" },
    { time: 270, text: "是最后最坏的打算" },
    { time: 274, text: "一尘不染" },
    { time: 278, text: "如此简单" },
  ] },
  { title: "如果呢", artist: "郑润泽", url: "/郑润泽-如果呢.mp3", lyrics: [
    { time: 34.10, text: "看" },
    { time: 35.74, text: "幻想中的行星" },
    { time: 38.06, text: "平行与天际" },
    { time: 41.83, text: "听" },
    { time: 43.44, text: "你说过的话语" },
    { time: 45.61, text: "是那么平静" },
    { time: 49.43, text: "能记得我的好" },
    { time: 52.83, text: "也能够忘掉我" },
    { time: 55.61, text: "迟早" },
    { time: 56.70, text: "我的心里仍屹立着座城堡" },
    { time: 64.07, text: "不知为何" },
    { time: 66.33, text: "无法感受得到" },
    { time: 68.86, text: "你的不舍" },
    { time: 71.42, text: "你是如何能够" },
    { time: 73.95, text: "轻易做得到" },
    { time: 80.28, text: "如果说是真的爱我" },
    { time: 83.65, text: "那为何都说不出口" },
    { time: 86.02, text: "一大堆的所以然呢" },
    { time: 90.38, text: "我脑海只剩为什么" },
    { time: 93.75, text: "就让我" },
    { time: 95.91, text: "放下所有回忆" },
    { time: 99.27, text: "所有事情不那么清晰" },
    { time: 102.64, text: "也许" },
    { time: 104.10, text: "会好" },
    { time: 105.56, text: "比较" },
    { time: 115.30, text: "看" },
    { time: 116.87, text: "幻想中的行星" },
    { time: 119.21, text: "平行与天际" },
    { time: 122.95, text: "听" },
    { time: 124.53, text: "你说过的话语" },
    { time: 126.71, text: "是那么平静" },
    { time: 130.50, text: "说记得我的好" },
    { time: 133.85, text: "也能够忘掉我" },
    { time: 136.62, text: "迟早" },
    { time: 138.94, text: "数不清这是第几次" },
    { time: 141.47, text: "我也不知道" },
    { time: 144.80, text: "如果说是真的爱我" },
    { time: 148.16, text: "那为何都说不出口" },
    { time: 151.53, text: "一大堆的所以然呢" },
    { time: 154.89, text: "我脑海只剩为什么" },
    { time: 158.26, text: "就让我" },
    { time: 160.42, text: "放下所有回忆" },
    { time: 163.78, text: "所有事情不那么清晰" },
    { time: 167.15, text: "也许" },
    { time: 168.60, text: "会好" },
    { time: 170.07, text: "比较" },
    { time: 173.40, text: "如果说是真的爱我" },
    { time: 176.77, text: "那为何都说不出口" },
    { time: 180.13, text: "一大堆的所以然呢" },
    { time: 183.50, text: "我脑海只剩为什么" },
    { time: 186.86, text: "就让我" },
    { time: 189.02, text: "放下所有回忆" },
    { time: 192.39, text: "所有事情不那么清晰" },
    { time: 195.75, text: "也许" },
    { time: 197.21, text: "会好" },
    { time: 198.67, text: "比较" },
    { time: 201.04, text: "也许" },
    { time: 202.48, text: "会好" },
    { time: 203.95, text: "比较" },
  ] },
];

// 🛡️ 审查模式开关：设为 true 隐藏境外敏感平台（WhatsApp/Gmail/X），审核通过后改为 false 即可一键恢复
const REVIEW_MODE = true;

export default function ContactArchive({ onBack, bgmAudioRef, isBgmPlaying, setIsBgmPlaying }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const localAudioRef = useRef(null);
  const initiallyPlaying = useRef(false);

  // 1. [接管逻辑] 挂载时强制接管全局 BGM，卸载时恢复
  useEffect(() => {
    if (isBgmPlaying && bgmAudioRef?.current) {
        initiallyPlaying.current = true;
        bgmAudioRef.current.pause();
        setIsBgmPlaying?.(false);
    }
    
    return () => {
        if (initiallyPlaying.current && bgmAudioRef?.current) {
            bgmAudioRef.current.play().catch(e => console.warn("BGM Resume blocked:", e));
            setIsBgmPlaying?.(true);
        }
    };
  }, []);

  // 2. [本地歌单逻辑] 处理多曲目切换
  useEffect(() => {
    if (localAudioRef.current) {
        localAudioRef.current.pause();
        localAudioRef.current = null;
    }

    const audio = new Audio(PLAYLIST[currentTrackIndex].url);
    audio.volume = 1.0; // 设定基准音量
    localAudioRef.current = audio;

    let audioCtx = null;
    const setupContactBoost = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(audio);
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.5; // 设置为 1.5 倍音量 (150%)
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
      } catch (e) {
        console.warn("Contact BGM Boost failed:", e);
      }
    };

    audio.onended = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.play()
      .then(() => {
        setIsLocalPlaying(true);
        setupContactBoost();
      })
      .catch(e => {
        console.warn("Autoplay blocked:", e);
        setIsLocalPlaying(false);
      });

    return () => {
        if (localAudioRef.current) {
            localAudioRef.current.pause();
            localAudioRef.current = null;
        }
    };
  }, [currentTrackIndex]);

  const toggleLocalMusic = (e) => {
    e.stopPropagation();
    if (!localAudioRef.current) return;
    
    if (isLocalPlaying) {
      localAudioRef.current.pause();
    } else {
      localAudioRef.current.play().catch(err => console.error(err));
    }
    setIsLocalPlaying(!isLocalPlaying);
  };

  const skipTrack = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const contactData = [
    { id: 'wechat', icon: WeChatIcon, label: t('social.wechat'), value: 'Xiao xiao yu', color: 'text-emerald-400', activeBg: 'bg-emerald-500', border: 'border-emerald-500/50', hasQR: true, qrLabel: t('social.qr_wechat'), qrImage: wechatQR },
    { id: 'qq', icon: QQIcon, label: 'QQ', value: ' 2933652936', color: 'text-sky-400', activeBg: 'bg-sky-500', border: 'border-sky-500/50', hasQR: true, qrLabel: t('social.qr_qq'), qrImage: qqQR },
    { id: 'whatsapp', icon: WhatsAppIcon, label: t('social.whatsapp'), value: '', color: 'text-green-500', activeBg: 'bg-green-500', border: 'border-green-500/50', hasQR: true, qrLabel: t('social.qr_whatsapp'), qrImage: whatsappQR, sensitive: true },
    { id: '163', icon: Mail, label: 'QQ邮箱', value: ' 2933652936@qq.com', color: 'text-orange-400', activeBg: 'bg-orange-500', border: 'border-orange-500/50' },
    { id: 'gmail', icon: GmailIcon, label: 'Gmail邮箱', value: '空@gmail.com', color: 'text-red-500', activeBg: 'bg-red-500', border: 'border-red-500/50', sensitive: true },
    { id: 'twitter', icon: XIcon, label: 'X', value: '空', color: 'text-black', activeBg: 'bg-black', border: 'border-black/50', sensitive: true },
    { id: 'github', icon: Github, label: 'GitHub', value: 'https://github.com/xiaoxiaoyu-123', color: 'text-slate-900', activeBg: 'bg-slate-900', border: 'border-slate-900/50' },
  ];

  // 审查模式下过滤掉敏感平台，但保留完整数据（用于恢复）
  const displayData = REVIEW_MODE ? contactData.filter(c => !c.sensitive) : contactData;
  const activeContact = contactData.find(c => c.id === selectedId);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-start overflow-hidden font-sans"
    >
      {/* 动态壁纸层 (完全透明清爽) */}
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/contact-bg.png')" }}
      />

      {/* 顶部导航条 (去模糊，全亮清爽) */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-4 md:py-6 bg-transparent gap-4 md:gap-0"
      >
        {/* 高识别度“返回主页”按钮 */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-full bg-white text-black hover:bg-cyan-400 hover:text-black transition-all font-bold text-[10px] md:text-xs tracking-[0.1em] uppercase group shadow-[0_10px_30px_rgba(255,255,255,0.3)] border-2 border-white"
        >
          <ArrowLeft size={16} md:size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('social.return')}</span>
        </button>

        {/* 顶部联系方式图标 */}
        <div className="flex items-center gap-4 md:gap-10 overflow-x-auto scrollbar-hide px-4 py-6 md:py-8 -my-6 md:-my-8 w-full md:w-auto justify-start md:justify-center">
          {displayData.map(contact => (
            <NavButton 
              key={contact.id}
              id={contact.id}
              icon={contact.icon}
              label={contact.label}
              active={selectedId === contact.id}
              colorClass={contact.color}
              activeBgClass={contact.activeBg}
              borderColorClass={contact.border}
              onClick={(id) => setSelectedId(selectedId === id ? null : id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-5 bg-black/20 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 shadow-lg h-14">
           {/* 歌曲信息 (加大字号并优化宽度) */}
           <div className="hidden md:flex flex-col items-end gap-0.5 border-r border-white/10 pr-5 w-40 shrink-0 overflow-hidden">
              <span className="text-[14px] font-black text-white tracking-tight truncate w-full text-right">{PLAYLIST[currentTrackIndex].title}</span>
              <span className="text-[11px] font-bold text-cyan-400 capitalize underline decoration-cyan-400/30 underline-offset-2 truncate w-full text-right">{PLAYLIST[currentTrackIndex].artist}</span>
           </div>

           <div className="flex items-center gap-1">
              <button 
                onClick={toggleLocalMusic}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all cursor-pointer active:scale-90"
              >
                {isLocalPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
              </button>

              <div className="px-2">
                <MusicVisualizer isPlaying={isLocalPlaying} />
              </div>

              <button
                onClick={skipTrack}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all cursor-pointer active:scale-90"
              >
                <SkipForward size={14} fill="currentColor" />
              </button>

              {/* 当前播放时间 */}
              <span className="text-[10px] font-mono text-white/40 w-10 text-center tabular-nums">
                {formatTime(currentTime)}
              </span>

              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
                  showLyrics
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'bg-white/5 text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10'
                }`}
                title="歌词"
              >
                <FileText size={14} />
              </button>
           </div>
        </div>
      </motion.header>

      {/* 歌词面板 */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-40 w-full max-w-md mx-auto px-4"
          >
            <LyricsPanel
              lyricsSource={PLAYLIST[currentTrackIndex].lyrics}
              currentTime={currentTime}
              songTitle={PLAYLIST[currentTrackIndex].title}
              songArtist={PLAYLIST[currentTrackIndex].artist}
              height={160}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. 详情视窗 (居中显示) */}
      <div className="relative z-40 flex-1 w-full flex items-center justify-center p-4 md:p-6">
        <AnimatePresence mode="wait">
          {selectedId ? (
            <motion.div 
              key={selectedId}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="w-full max-w-md bg-black/40 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col gap-6 overflow-hidden relative"
            >
              {/* 关闭按钮 */}
              <div className="absolute top-0 right-0 p-4 md:p-8 flex items-center gap-4">
                 <Radio size={20} className={`${activeContact.color} opacity-40 animate-pulse hidden md:block`} />
                 <button 
                  onClick={() => setSelectedId(null)}
                  className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
                 >
                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                 </button>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/10 ${activeContact.bg} ${activeContact.color}`}>
                  <activeContact.icon size={30} md:size={40} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-4xl font-black text-white tracking-widest uppercase">{activeContact.label}</h3>
                  <p className="text-white/70 font-mono text-[10px] md:text-sm tracking-[0.2em]">{selectedId.toUpperCase()}_CHANNEL_ACTIVE</p>
                </div>
              </div>

              {activeContact.value && (
                <div className="group relative bg-white/10 border border-white/20 rounded-2xl p-6 flex items-center justify-between gap-4 hover:bg-white/15 transition-all">
                  <div className="flex flex-col flex-1 min-w-0">
                     <div className="text-xs font-mono font-bold text-white/60 uppercase tracking-[0.2em] mb-1">Access_Identifier</div>
                     <div className="text-xl font-bold text-white break-all">{activeContact.value}</div>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(activeContact.value);
                      alert(t('social.copied'));
                    }}
                    className="flex-shrink-0 p-4 bg-white/10 rounded-xl text-white/60 hover:text-white hover:bg-cyan-500/40 hover:border-cyan-500/80 border border-white/20 transition-all active:scale-95 shadow-lg"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              )}

              {/* 二维码占位符 (如果该项目有二维码) */}
              {activeContact.hasQR && (
                <div className="flex flex-col gap-4 mt-2">
                   <div className="flex items-center gap-3">
                      <ScanLine size={18} className="text-cyan-400" />
                      <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-[0.2em]">{activeContact.qrLabel}</div>
                   </div>
                   {activeContact.qrImage ? (
                      <div className="relative w-full max-w-[260px] mx-auto mt-2 group/qr">
                          {/* 装饰性背景漫反射光晕 */}
                          <div className="absolute -inset-4 bg-gradient-to-b from-white/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover/qr:opacity-100 transition-all duration-700"></div>
                          
                          {/* 高级质感纯白展示卡片 */}
                          <div className="relative bg-white rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transform transition-transform duration-500 group-hover/qr:-translate-y-2 group-hover/qr:shadow-[0_30px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
                              <img 
                                src={activeContact.qrImage} 
                                alt="QR Code" 
                                className="w-full h-auto object-contain rounded-xl contrast-[1.02]" 
                              />
                          </div>
                      </div>
                   ) : (
                      <div className="aspect-square w-full sm:w-64 bg-slate-900/60 border border-white/20 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 group/qr relative overflow-hidden">
                          <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
                          />
                          <Plus size={32} className="text-white/20 group-hover/qr:scale-125 transition-transform duration-500" />
                          <div className="text-xs font-mono font-bold text-white/40 uppercase tracking-[0.3em]">{t('social.waiting_data')}</div>
                      </div>
                   )}
                </div>
              )}

              <div className="mt-4 pb-2">
                 <p className="text-xs font-mono text-white/60 tracking-widest leading-relaxed font-medium">
                   {t('social.sys_warning')}
                 </p>
              </div>
            </motion.div>
          ) : (
            /* 没有任何选中的状态 */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-1px bg-cyan-400/30"></div>
                <span className="text-xs font-mono text-cyan-400/60 tracking-[0.5em] uppercase animate-pulse">Select_Handshake_Channel</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
