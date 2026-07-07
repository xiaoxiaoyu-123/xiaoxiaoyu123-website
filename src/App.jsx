import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX, Globe, Play, Pause, Music, X as CloseIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Loader from './components/Loader';
import AnimatedCharacters from './components/AnimatedCharacters';
import LoginForm from './components/LoginForm';
import MainPage from './MainPage';
import SchoolArchive from './components/SchoolArchive';
import ExpertiseArchive from './components/ExpertiseArchive';
import ContactArchive from './components/ContactArchive';
import MemoryArchive from './components/MemoryArchive';
import HobbiesSection from './components/HobbiesSection';
import CommentAdmin from './components/CommentAdmin';
import LyricsPanel from './components/LyricsPanel';

// BGM 歌词：結束バンド - ギターと孤独と蒼い惑星
const bgmLyrics = [
  { time: 15.14, text: "突然降る夕立 あぁ傘もないや嫌" },
  { time: 21.03, text: "空のご機嫌なんか知らない" },
  { time: 25.03, text: "季節の変わり目の服は 何着りゃいいんだろ" },
  { time: 30.99, text: "春と秋 どこいっちゃったんだよ" },
  { time: 34.97, text: "息も出来ない 情報の圧力" },
  { time: 39.83, text: "めまいの螺旋だ わたしはどこにいる" },
  { time: 44.66, text: "こんなに こんなに 息の音がするのに" },
  { time: 50.79, text: "変だね 世界の音がしない" },
  { time: 56.12, text: "足りない 足りない 誰にも気づかれない" },
  { time: 60.36, text: "殴り書きみたいな音 出せない状態で叫んだよ" },
  { time: 64.72, text: "「ありのまま」なんて 誰に見せるんだ" },
  { time: 68.26, text: "馬鹿なわたしは歌うだけ" },
  { time: 72.04, text: "ぶちまけちゃおうか 星に" },
  { time: 76.48, text: "エリクサーに張り替える作業もなんとなくなんだ" },
  { time: 80.92, text: "欠けた爪を少し触る" },
  { time: 85.02, text: "半径300mmの体で 必死に嗚いてる" },
  { time: 89.45, text: "音楽にとっちゃ ココが地球だな" },
  { time: 93.21, text: "空気を握って 空を殴るよ" },
  { time: 97.72, text: "なんにも起きない わたしは無力さ" },
  { time: 102.18, text: "だけどさ その手で この鉄を弾いたら" },
  { time: 106.75, text: "何かが変わって見えた…ような。" },
  { time: 110.67, text: "眩しい 眩しい そんなに光るなよ" },
  { time: 115.13, text: "わたしのダサい影が より色濃くなってしまうだろ" },
  { time: 119.58, text: "なんでこんな熱くなっちゃってんだ 止まんない" },
  { time: 123.11, text: "馬鹿なわたしは歌うだけ" },
  { time: 126.89, text: "うるさいんだって 心臓" },
  { time: 130.74, text: "蒼い惑星 ひとりぼっち" },
  { time: 134.32, text: "いっぱいの音を聞いてきた" },
  { time: 137.90, text: "回り続けて 幾億年" },
  { time: 141.48, text: "一瞬でもいいから…ああ" },
  { time: 144.06, text: "聞いて" },
  { time: 145.38, text: "聴けよ" },
  { time: 147.76, text: "わたし わたし わたしはここにいる" },
  { time: 151.23, text: "殴り書きみたいな音 出せない状態で叫んだよ" },
  { time: 155.69, text: "なんかになりたい なりたい 何者かでいい" },
  { time: 159.33, text: "馬鹿なわたしは歌うだけ" },
  { time: 163.11, text: "ぶちまけちゃおうか 星に" },
];

const VISITOR_STORAGE_KEY = 'bob_visitor_data';

// Helper to compress base64 image (specifically for avatars)
const compressAvatar = (base64Str, maxWidth = 200) => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str); // SVG or simple URL
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // Compress to JPEG with 0.6 quality for minimal size
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(base64Str);
  });
};

function App() {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // URL 探测：最高权限后门
  const [stage, setStage] = useState(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === 'xiaoxiaoyu123QWabc') {
      return 'admin-panel';
    }
    return 'welcome'; // welcome | loading | login | main | school-detail | expertise-detail
  });
  
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmCurrentTime, setBgmCurrentTime] = useState(0);
  const [bgmDuration, setBgmDuration] = useState(0);
  const [showBgmPlayer, setShowBgmPlayer] = useState(false);

  // Visitor data (persisted)
  const [visitorData, setVisitorData] = useState(() => {
    const saved = localStorage.getItem(VISITOR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { name: '', avatar: null };
  });
  
  // LoginForm related states
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isNodding, setIsNodding] = useState(false);
  const [loginState, setLoginState] = useState('idle');

  // Background Audio Ref
  const audioRef = useRef(null);
  const mainScrollPos = useRef(0);

  // 访客统计探针 (静默运行，异步非阻塞)
  useEffect(() => {
    const trackVisitor = () => {
      const tracker = new Image();
      // 使用图片对象请求方式绕过跨域限制
      tracker.src = `/api/track?t=${new Date().getTime()}`;
    };
    
    // 确保在主线程之后执行，完全不阻塞首屏渲染
    if (window.requestIdleCallback) {
      window.requestIdleCallback(trackVisitor);
    } else {
      setTimeout(trackVisitor, 1000);
    }
  }, []);

  // Initialize audio on component mount
  useEffect(() => {
    const audio = new Audio('/結束バンド - ギターと孤独と蒼い惑星.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audio.ontimeupdate = () => setBgmCurrentTime(audio.currentTime);
    audio.onloadedmetadata = () => setBgmDuration(audio.duration);
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEnterClick = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.error("Auto-play blocked:", e));
    }
    setStage('loading');
  };

  const handleLoadingFinish = useCallback(() => {
    setStage('login');
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <>
      <div 
        className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-cover bg-center bg-no-repeat transition-colors duration-1000"
        style={{ backgroundImage: `url('${stage === 'main' ? '/main-bg.png' : '/bg02.jpg'}')` }}
      >
        {/* 全局设置 - 遮光罩减弱至10% */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0 pointer-events-none"></div>

        {/* 全局控制组件区 (右上角) */}
        {stage !== 'welcome' && (
          <div className="absolute top-6 right-6 z-50 flex flex-col items-center gap-4">
            
            {/* 1. BGM 播放器 */}
            <div className="relative">
              <button
                onClick={() => setShowBgmPlayer(!showBgmPlayer)}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>

              <AnimatePresence>
                {showBgmPlayer && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-full top-0 mr-4 p-4 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] w-72"
                  >
                    {/* 顶部标题 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-white/30'}`} />
                        <span className="text-white font-bold text-xs tracking-wide">結束バンド - ギターと孤独と蒼い惑星</span>
                      </div>
                      <button onClick={() => setShowBgmPlayer(false)} className="p-1 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all">
                        <CloseIcon size={12} />
                      </button>
                    </div>

                    {/* 进度条 */}
                    <div className="mb-2">
                      <input
                        type="range"
                        min={0}
                        max={bgmDuration || 100}
                        value={bgmCurrentTime}
                        onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value); }}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                          [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                        style={{
                          background: `linear-gradient(to right, rgb(34,211,238) ${bgmDuration ? (bgmCurrentTime / bgmDuration) * 100 : 0}%, rgba(255,255,255,0.1) 0%)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] font-mono text-white/40">{formatTime(bgmCurrentTime)}</span>
                        <span className="text-[10px] font-mono text-white/40">{formatTime(bgmDuration)}</span>
                      </div>
                    </div>

                    {/* 控制栏 */}
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={toggleMusic}
                        className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <span className="text-[10px] font-mono text-white/30">結束バンド</span>
                      <Music size={14} className="text-white/30" />
                    </div>

                    {/* 歌词面板 */}
                    <div className="max-h-[120px] overflow-hidden rounded-xl">
                      <LyricsPanel
                        lyricsSource={bgmLyrics}
                        currentTime={bgmCurrentTime}
                        songTitle="ギターと孤独と蒼い惑星"
                        songArtist="結束バンド"
                        height={120}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. 多语言下拉选择器 (在下方) */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <Globe size={24} className={showLangMenu ? "text-blue-400" : "text-white"} />
              </button>
              
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-full top-0 mr-4 p-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] w-44 flex flex-col gap-1 overflow-hidden"
                  >
                    {[
                      { code: 'zh', name: '简体中文', flag: '🇨🇳' },
                      { code: 'zh-TW', name: '繁體中文', flag: '🇭🇰' },
                      { code: 'en', name: 'English', flag: '🇺🇸' },
                      { code: 'pt', name: 'Português', flag: '🇧🇷' },
                      { code: 'es', name: 'Español', flag: '🇪🇸' },
                      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
                      { code: 'fr', name: 'Français', flag: '🇫🇷' }
                    ].map(lng => (
                      <button 
                        key={lng.code} 
                        onClick={() => { i18n.changeLanguage(lng.code); setShowLangMenu(false); }}
                        className={`flex items-center gap-3 px-3 py-2 text-sm text-left rounded-xl transition-all hover:bg-white/10 text-white/80 hover:text-white pointer-events-auto cursor-pointer ${i18n.language === lng.code ? 'bg-blue-500/20 text-blue-400' : ''}`}
                      >
                         <span className="text-lg">{lng.flag}</span>
                         <span className="font-bold tracking-wide">{lng.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 阶段切换逻辑 */}
        <AnimatePresence mode="wait">
          {stage === 'admin-panel' && (
             <CommentAdmin 
               key="admin-stage"
               onBack={() => setStage('main')}
             />
          )}

          {stage === 'welcome' && (
              /* ================= 第一阶段：欢迎引导页 ================= */
              <motion.div
                key="welcome-stage"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative z-10 flex flex-col items-center justify-center text-center px-4"
              >
                {/* 滚动科幻渐变发光文字包裹层 */}
                <div className="relative mb-16">
                  {/* 外层发光模糊效果 */}
                  <motion.div
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="absolute inset-0 blur-2xl opacity-70 bg-[length:300%_auto] bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-yellow-400 rounded-full"
                  />
                  
                  {/* 里层真实滚动渐变文字 - 增加 pb-6 防止字母 g 被裁剪 */}
                  <motion.h1 
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="relative text-5xl md:text-7xl font-black tracking-widest pointer-events-none bg-[length:300%_auto] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 via-purple-400 to-yellow-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] pb-4"
                  >
                    {t('main.welcome.title')}
                  </motion.h1>
                </div>

                {/* 炫酷的确认进入按钮 */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
                    borderColor: "rgba(255,255,255,0.8)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnterClick}
                  className="px-10 py-5 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white rounded-[2rem] text-xl font-bold tracking-[0.2em] transition-all uppercase cursor-pointer"
                >
                  {t('main.welcome.enter')}
                </motion.button>
              </motion.div>

            )}

            {stage === 'loading' && (
              <motion.div
                key="loading-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-20"
              >
                <Loader onFinish={handleLoadingFinish} style={{ position: 'relative' }} />
              </motion.div>
            )}

            {stage === 'login' && (
              /* ================= 第三阶段：小怪兽登录界面 ================= */
              <motion.div 
                key="login-stage"
                className="relative z-10 w-full max-w-[1000px] h-[600px] bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-[0_30px_60px_rgba(0,0,0,0.5)] m-4"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              >
                {/* 左侧：吉祥物区域 (隐藏在移动端) */}
                <div className="hidden md:block md:w-1/2 h-full bg-[#f3f4f6]">
                  <AnimatedCharacters 
                    isPasswordFocused={isPasswordFocused} 
                    isEmailFocused={isEmailFocused}
                    showPassword={showPassword} 
                    isTyping={isTyping}
                    isNodding={isNodding}
                    loginState={loginState}
                  />
                </div>
                
                {/* 右侧：登录表单区域 */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center bg-white relative">
                  <LoginForm
                    initialData={visitorData}
                    onPasswordFocusChange={setIsPasswordFocused}
                    onEmailFocusChange={setIsEmailFocused}
                    onShowPasswordChange={setShowPassword}
                    onTypingChange={setIsTyping}
                    onNoddingChange={setIsNodding}
                    onLoginStateChange={setLoginState}
                    onLoginSuccess={(data) => {
                      // 1. [用户体验第一] 即刻进入主界面
                      setStage('main');

                      // 2. [本地存储兜底] 保证昵称和头像存入缓存，并处理空间溢出
                      const newVisitorData = { name: data.name, avatar: data.avatar };
                      try {
                        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(newVisitorData));
                      } catch (e) {
                        console.warn("Storage Full: saving minimal data");
                        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify({ name: data.name, avatar: null }));
                      }
                      setVisitorData(newVisitorData);
                      
                      // 3. [静默异步上报] 使用 POST 通道上报压缩后的身份，解决 URL 溢出并修复构建崩溃
                      if (data.avatar) {
                        compressAvatar(data.avatar).then((compressedAvatar) => {
                          fetch("/api/track_identity", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              nickname: data.name || "未同步",
                              avatar: compressedAvatar || ""
                            })
                          }).catch(err => console.error("Sync Error:", err));
                        });
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}

            {stage === 'main' && (
              <MainPage 
                key="main-stage" 
                visitorData={visitorData} 
                initialScroll={mainScrollPos.current}
                onSaveScroll={(pos) => { mainScrollPos.current = pos; }}
                onExploreSchool={(school) => {
                  setSelectedSchool(school);
                  setStage('school-detail');
                }}
                onExploreExpertise={(expertise) => {
                  setSelectedExpertise(expertise);
                  setStage('expertise-detail');
                }}
                onContactClick={() => setStage('contact-detail')}
                onMemoryExplore={() => setStage('memory-archive')}
                onExploreHobbies={() => {
                  if (audioRef && audioRef.current && isPlaying) {
                    audioRef.current.pause();
                    audioRef.current.src = "/西罕-我看过(女声版).mp3";
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) playPromise.catch(e => console.warn(e));
                  } else if (audioRef && audioRef.current) {
                    audioRef.current.src = "/西罕-我看过(女声版).mp3";
                  }
                  setStage('hobbies-detail');
                }}
              />
            )}

            {stage === 'hobbies-detail' && (
              <HobbiesSection 
                key="hobbies-stage"
                onBack={() => {
                  if (audioRef && audioRef.current && isPlaying) {
                    audioRef.current.pause();
                    audioRef.current.src = "/結束バンド - ギターと孤独と蒼い惑星.mp3";
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) playPromise.catch(e => console.warn(e));
                  } else if (audioRef && audioRef.current) {
                    audioRef.current.src = "/結束バンド - ギターと孤独と蒼い惑星.mp3";
                  }
                  setStage('main')
                }}
                bgmAudioRef={audioRef}
                isBgmPlaying={isPlaying}
                setIsBgmPlaying={setIsPlaying}
              />
            )}

            {stage === 'memory-archive' && (
              <MemoryArchive 
                key="memory-stage"
                onBack={() => setStage('main')}
                bgmAudioRef={audioRef}
                isBgmPlaying={isPlaying}
                setIsBgmPlaying={setIsPlaying}
              />
            )}

            {stage === 'school-detail' && (
              <SchoolArchive 
                key="school-stage"
                school={selectedSchool} 
                onBack={() => setStage('main')} 
                bgmAudioRef={audioRef}
                isBgmPlaying={isPlaying}
                setIsBgmPlaying={setIsPlaying}
              />
            )}

            {stage === 'expertise-detail' && (
              <ExpertiseArchive 
                key="expertise-stage"
                expertise={selectedExpertise}
                onBack={() => setStage('main')}
              />
            )}

            {stage === 'contact-detail' && (
              <ContactArchive 
                key="contact-stage"
                onBack={() => setStage('main')}
                bgmAudioRef={audioRef}
                isBgmPlaying={isPlaying}
                setIsBgmPlaying={setIsPlaying}
              />
            )}
          </AnimatePresence>
        </div>
    </>
  );
}

export default App;
