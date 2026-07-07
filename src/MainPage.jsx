import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Target, Zap, Cpu, Code2, Sparkles, TerminalSquare, Box, BookOpen, Terminal, History, BarChart3, Fingerprint, ArrowRight } from 'lucide-react';
import SpotlightCard from './components/SpotlightCard';
import SpectralCard from './components/SpectralCard';
import { useSyncStats } from './hooks/useSyncStats';
import CyberAssistant from './components/CyberAssistant';
import HobbiesSection from './components/HobbiesSection';
import ImageGalleryModal from './components/ImageGalleryModal';

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

const DouyinIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export default function MainPage({ 
  visitorData, 
  onExploreSchool, 
  onExploreExpertise, 
  onContactClick, 
  onMemoryExplore, 
  onExploreHobbies,
  initialScroll,
  onSaveScroll 
}) {
  const scrollContainerRef = useRef(null);
  const { t } = useTranslation();
  const { articleCount } = useSyncStats(); // 从后端无声获取当前统计基数

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);
  const [msgForm, setMsgForm] = useState({ name: '', email: '', content: '', is_anonymous: false });
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null); // { success: bool, text: string }
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Determine welcome message based on whether visitor has data
  const hasVisitor = visitorData?.name && visitorData?.avatar;
  const welcomeMessage = hasVisitor
    ? t('main.welcome_back').replace('Bob Zhang', visitorData.name)
    : t('main.welcome_back');

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize x, y to range [-1, 1]
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // --- [NEW] 滚动记忆恢复逻辑 ---
  useEffect(() => {
    if (initialScroll && scrollContainerRef.current) {
        // 使用 requestAnimationFrame 确保在 DOM 彻底渲染并完成分层后再跳转
        const timer = setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = initialScroll;
            }
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [initialScroll]);

  // 辅助函数：在执行任何跳转动作前保存当前滚动条位置
  const handleNav = (navAction) => {
      if (scrollContainerRef.current) {
          onSaveScroll(scrollContainerRef.current.scrollTop || window.scrollY);
      }
      navAction();
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!msgForm.content.trim()) return;
    
    setIsSending(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgForm)
      });
      
      if (response.ok) {
        setSendResult({ success: true, text: t('main.contact.success') });
        setMsgForm({ name: '', email: '', content: '', is_anonymous: false });
      } else {
        throw new Error('Transmission failed');
      }
    } catch (error) {
      setSendResult({ success: false, text: t('main.contact.error') });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative min-h-screen w-full flex items-center justify-center font-sans tracking-tight text-white/90 overflow-hidden"
    >
      {/* 
        ===== 任务一：全局空间背景 ===== 
        底层仍是全局配置的背景图，这里叠加轻微的暗色遮罩以保证文字可读性，移除模糊效果使背景完全清晰 
      */}
      <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>
      
      {/* 极光视差容器 */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{ x: -mousePos.x * 40, y: -mousePos.y * 40 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        {/* CSS 极光渐变网格动画 - 加入了高能量视觉破局色 (Fuchsia/Cyan) */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute -inset-[100px] opacity-20 bg-[length:200%_200%] bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/30 to-cyan-500/40 mix-blend-screen"
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:h-[calc(100vh-4rem)]">
        
        {/* 
          ===== 任务二：左侧悬浮控制台 (移动端折叠为名片条) ===== 
        */}
        <div className="w-full lg:w-1/4 h-auto lg:h-full lg:sticky lg:top-6 bg-white/5 border border-white/10 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 flex flex-col md:flex-row lg:flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-500">

          <div className="flex flex-col md:flex-row lg:flex-col items-center gap-4 lg:gap-0">
            {/* 呼吸效果头像 */}
            <motion.div
              animate={{
                boxShadow: ["0px 0px 20px rgba(139,92,246,0.3)", "0px 0px 40px rgba(139,92,246,0.6)", "0px 0px 20px rgba(139,92,246,0.3)"]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-white/20 mb-0 lg:mb-6 relative group flex-shrink-0"
            >
              <img src="/avatar.jpg" alt="xiao xiao yu Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </motion.div>

            <div className="flex flex-col items-center md:items-start lg:items-center text-center md:text-left lg:text-center w-full">
              {/* 访客欢迎区域 - 移动端微调 */}
              {hasVisitor && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 md:p-4 mb-4 lg:mb-6 flex items-center gap-3"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-cyan-400/50 flex-shrink-0 relative">
                    <motion.img
                      src={visitorData.avatar}
                      alt="Visitor Avatar"
                      className="w-full h-full object-cover"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs lg:text-sm font-bold text-white/90 truncate">
                      {welcomeMessage}
                    </div>
                    <div className="text-[10px] text-white/50 font-mono mt-0.5">
                      👋 {t('main.guest_synced')}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <h1 className="text-3xl lg:text-4xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                xiao xiao yu
              </h1>
              
              {/* 打字机解码风格签名 */}
              <div className="font-mono text-[10px] lg:text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border border-indigo-500/20 mb-4 lg:mb-8 flex items-center gap-2">
                <TerminalSquare size={12} className="lg:size-[14px]" />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {t('main.bento_intro_bold', { count: articleCount }).split('|').slice(0,2).join('|').replace('。','')}
                </motion.span>
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1.5 h-3 lg:w-2 lg:h-4 bg-indigo-400 inline-block"
                />
              </div>

              <p className="text-white/60 text-center md:text-left lg:text-center leading-relaxed flex flex-col gap-1 w-full overflow-hidden">
                <span className="text-[10px] font-bold text-blue-400/80 tracking-[0.2em]">{t('main.system_arch')}</span>
                <span className="text-[13px] lg:text-[15px] font-bold tracking-tight text-indigo-200/90 italic truncate lg:whitespace-normal">{t('main.create_future')}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6 lg:mt-8 gap-6 md:gap-0 lg:gap-8 w-full md:w-auto lg:w-full">
            {/* Connection Link */}
            <div className="flex justify-center w-full">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNav(onContactClick)}
                className="group relative flex items-center justify-center gap-3 px-6 py-2.5 lg:px-8 lg:py-3.5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden w-full md:w-auto lg:w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                <span className="font-bold tracking-[0.2em] text-[11px] lg:text-[13px] text-white/90 group-hover:text-white transition-colors">
                  {t('main.contact.title')}
                </span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.button>
            </div>

            {/* Geek Character Profile - 使用隐藏类来优化移动端 */}
            <div className="hidden md:flex lg:flex md:mt-0 lg:mt-10 md:pt-0 lg:pt-8 md:border-0 lg:border-t lg:border-white/5 flex-col gap-6 w-full max-w-[200px] lg:max-w-none ml-4 lg:ml-0">
               <div className="hidden lg:flex items-center gap-3">
                  <div className="w-8 h-px bg-blue-500/50"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">{t('main.geek_profile_title')}</span>
               </div>
               <div className="flex flex-wrap gap-2 justify-center lg:justify-center">
                  {[
                    { label: t('main.traits.t1'), hint: t('main.traits.h1') },
                    { label: t('main.traits.t2'), hint: t('main.traits.h2') },
                    { label: t('main.traits.t3'), hint: t('main.traits.h3') },
                    { label: t('main.traits.t4'), hint: t('main.traits.h4') }
                  ].map((trait, i) => (
                    <div key={i} className="group/trait relative">
                      <div className="px-2 py-1 lg:px-3 lg:py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] lg:text-[10px] text-white/60 font-mono hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all cursor-crosshair">
                        [{trait.label}]
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* 
          ===== 任务三：右侧便当盒矩阵 (Bento Grid) 等内容容器 ===== 
        */}
        <div 
          ref={scrollContainerRef}
          className="w-full lg:w-3/4 h-auto lg:h-full lg:overflow-y-auto pr-0 lg:pr-2 pb-6 scrollbar-hide flex flex-col gap-10 lg:gap-16 pt-2"
        >
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 lg:min-h-[calc(100vh-7rem)] shrink-0">
          
          {/* 主卡片 (移动端全宽，桌面跨列) */}
          <SpotlightCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2 flex flex-col justify-end p-6 lg:p-10 group min-h-[300px] lg:min-h-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-20">
              <div className="px-2 py-0.5 lg:px-3 lg:py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] lg:text-xs font-bold border border-white/20 text-white/80 flex items-center gap-2">
                <Sparkles size={10} className="text-yellow-400 lg:size-[12px]" /> {t('main.building_future')}
              </div>
            </div>
            <div className="relative z-20">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 lg:mb-6 tracking-tighter"
              >
                <span className="block mb-1 lg:mb-2 text-2xl md:text-3xl lg:text-5xl">{t('main.hello_im')}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 pb-2 lg:pb-4">xiao xiao yu</span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-base lg:text-xl text-white/60 max-w-2xl leading-relaxed mb-6 lg:mb-10 font-light"
              >
                <span className="text-white font-bold">{t('main.bento_intro_bold', { count: articleCount })}</span> <br className="hidden md:block" />
                <span className="text-xs md:text-sm lg:text-lg mt-10 block text-white/70 font-light">
                  {t('main.bento_intro_desc')}
                </span>
              </motion.p>
            </div>
          </SpotlightCard>

          {/* 真实数据指标 (移动端居中展示) */}
          <SpotlightCard className="col-span-1 row-span-1 bg-white/5 flex flex-row lg:flex-col items-center justify-around lg:justify-center p-6 lg:p-8 gap-4">
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl lg:text-3xl font-black text-white">{t('main.stats_count', { count: articleCount })}</span>
                <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">{t('main.stats_deep')}</span>
              </div>
              <div className="h-10 w-px lg:w-px lg:h-12 bg-white/10 lg:bg-white/5"></div>
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl lg:text-3xl font-black text-white">{t('main.stats_8')}</span>
                <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">{t('main.stats_geek_records')}</span>
              </div>
          </SpotlightCard>

          {/* 技能雷达卡 (1x2 跨度，竖向使用) */}
          <SpotlightCard className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 lg:row-span-2 bg-gradient-to-b from-white/5 to-white/0 p-6 lg:p-8 flex flex-col justify-between border border-white/10">
            <div>
              <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="w-8 lg:w-12 h-px bg-blue-500/50"></div>
                <span className="text-[10px] lg:text-[10px] uppercase tracking-[0.3em] lg:tracking-[0.4em] text-blue-400 font-bold">{t('main.core_tech')}</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-6 lg:mb-12">{t('main.tech_stack')}</h3>
              
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Vue / React', tag: t('main.tags.t1') },
                  { label: 'Nuxt.js / Next.js', tag: t('main.tags.t2') },
                  { label: 'VibeCoding / Agent', tag: t('main.tags.t3') },
                  { label: 'Python / FastAPI', tag: t('main.tags.t4') },
                  { label: 'Linux / Shell', tag: t('main.tags.t5') }
                ].map((skill, i) => (
                  <div key={i} className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between font-medium hover:bg-white/10 transition-colors cursor-default group/skill">
                    <div className="flex items-center gap-3">
                      <Code2 size={14} className="text-white/40 group-hover/skill:text-blue-400 transition-colors" />
                      <span className="text-xs text-white/80">{skill.label}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 opacity-0 group-hover/skill:opacity-100 transition-opacity whitespace-nowrap">{skill.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* 选项一：赛博记忆树入口 (静态大气封面) */}
          <SpotlightCard 
            onClick={() => handleNav(onMemoryExplore)}
            className="col-span-1 row-span-1 p-0 overflow-hidden group min-h-[180px] lg:min-h-0 cursor-pointer"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500 z-10"></div>
            <img src="/mc.jpg " alt="Memory Tree Entrance" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-4 left-4 z-20">
               <div className="px-3 py-1 bg-cyan-500/20 backdrop-blur-md rounded-full text-[10px] font-bold border border-cyan-500/30 text-cyan-400">
                  CORE MEMORY // LINK
               </div>
            </div>
            <div className="absolute bottom-6 left-6 z-20">
               <h3 className="font-black text-xl lg:text-2xl text-white mb-1 uppercase tracking-tighter">{t('main.bento.gallery')}</h3>
               <p className="text-[10px] text-white/50 font-mono tracking-widest uppercase">My Tree of Memories</p>
            </div>
          </SpotlightCard>

          {/* 选项二：个人爱好模块入口 */}
          <SpotlightCard 
            className="col-span-1 row-span-1 p-0 overflow-hidden group min-h-[180px] lg:min-h-0 cursor-pointer"
            onClick={() => handleNav(onExploreHobbies)}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500 z-10"></div>
            <img src="/2026011401.jpg" alt="Hobbies Entrance" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-4 left-4 z-20">
               <div className="px-3 py-1 bg-purple-500/20 backdrop-blur-md rounded-full text-[10px] font-bold border border-purple-500/30 text-purple-400">
                  LIFE MATRIX // SYNC
               </div>
            </div>
            <div className="absolute bottom-6 left-6 z-20">
               <h3 className="font-black text-xl lg:text-2xl text-white mb-1 tracking-tighter leading-tight whitespace-pre-line">
                  {t('main.bento.hobbies')}
               </h3>
               <p className="text-[10px] text-white/50 font-mono tracking-widest uppercase">Personal Interests Grid</p>
            </div>
          </SpotlightCard>

          </div>

          {/* ================= 模块一：赛博时间线 (The Journey Timeline) ================= */}
          <div className="w-full flex flex-col pt-4">
            <h2 className="text-2xl lg:text-3xl font-black mb-10 flex flex-wrap items-center gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {t('main.edu.title')}
              </span>
              <span className="text-white/20 text-[10px] lg:text-sm font-mono tracking-widest uppercase">{t('main.edu.subtitle')}</span>
            </h2>
            
            <div className="relative pl-8 lg:pl-12 flex flex-col gap-10 lg:gap-12">
              {/* Glowing vertical line */}
              <div className="absolute left-[13px] lg:left-[19px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 via-cyan-500 to-transparent shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
              
              {/* Nodes */}
              {[
                {
                  year: t('main.edu.ujs_year'),
                  title: t('main.edu.ujs_title'),
                  desc: t('main.edu.ujs_desc'),
                  bgImage: "/guet.jpg",
                  fullDesc: t('main.edu.ujs_full'),
                  borderColor: "border-purple-400",
                  textColor: "text-purple-400"
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing Node */}
                  <div className={`absolute -left-[22px] lg:-left-[36px] top-1.5 w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-slate-900 border-2 ${item.borderColor} group-hover:scale-125 transition-transform duration-300`}></div>
                  
                  {/* Content Card */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 lg:p-6 hover:bg-white/10 transition-colors duration-500 group-hover:border-white/20 shadow-lg flex flex-col h-full">
                    <div className="flex-1">
                      <div className={`${item.textColor} font-mono text-sm mb-2 font-bold tracking-wider`}>{item.year}</div>
                      <h3 className="text-lg lg:text-xl font-black text-white/90 mb-3">{item.title}</h3>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <p className="text-white/60 text-[13px] lg:text-sm leading-relaxed max-w-2xl">{item.desc}</p>
                        
                        {/* Subtle Explore Button */}
                        <button 
                          onClick={() => handleNav(() => onExploreSchool(item))}
                          className="shrink-0 flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/20 group-hover:text-cyan-400 transition-all duration-300 group/btn pb-0.5"
                        >
                          <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 italic hidden sm:inline">Explore_</span>
                          <span className="group-hover:tracking-[0.2em] transition-all duration-300">{t('main.edu.explore_archive')}</span>
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= 模块二：极客全景展示 (Spectral Matrix) ================= */}
          <div className="w-full flex flex-col pt-6 lg:pt-10">
            <h2 className="text-2xl lg:text-4xl font-black mb-10 lg:mb-14 flex items-center gap-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                {t('main.geek_matrix')}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent hidden sm:block"></div>
              <span className="text-white/10 text-[10px] lg:text-xs font-mono tracking-[0.3em] lg:tracking-[0.5em] uppercase">SPECTRAL MATRIX</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
              {/* 1. 前端技术栈 领域 */}
              <SpectralCard 
                title={t('main.expertise.ai.title')}
                subtitle="Artificial Intelligence"
                icon={<Sparkles size={28} />}
                gradient="from-purple-600/30 via-indigo-600/10 to-transparent"
                borderColor="border-purple-500/20"
                spotlightColor="rgba(168, 85, 247, 0.2)"
                onClick={() => handleNav(() => onExploreExpertise({
                  title: "前端技术栈",
                  subtitle: "Artificial Intelligence",
                  icon: <Sparkles size={28} />,
                  children: t('main.expertise.ai.desc')
                }))}
              >
                {t('main.expertise.ai.desc')}
              </SpectralCard>

              {/* 2. AI辅助编程 领域 */}
              <SpectralCard 
                title={t('main.expertise.rpa.title')}
                subtitle="Automation Logic"
                icon={<Cpu size={28} />}
                gradient="from-orange-600/30 via-red-600/10 to-transparent"
                borderColor="border-orange-500/20"
                spotlightColor="rgba(249, 115, 22, 0.2)"
                onClick={() => handleNav(() => onExploreExpertise({
                  title: "AI辅助编程",
                  subtitle: "Automation Logic",
                  icon: <Cpu size={28} />,
                  children: t('main.expertise.rpa.desc')
                }))}
              >
                {t('main.expertise.rpa.desc')}
              </SpectralCard>

              {/* 3. DEV 领域 */}
              <SpectralCard 
                title={t('main.expertise.py.title')}
                subtitle="Geek Development"
                icon={<Terminal size={28} />}
                gradient="from-emerald-600/30 via-teal-600/10 to-transparent"
                borderColor="border-emerald-500/20"
                spotlightColor="rgba(16, 185, 129, 0.2)"
                onClick={() => handleNav(() => onExploreExpertise({
                  title: "Python后端开发",
                  subtitle: "Geek Development",
                  icon: <Terminal size={28} />,
                  children: t('main.expertise.py.desc')
                }))}
              >
                {t('main.expertise.py.desc')}
              </SpectralCard>

              {/* 4. LOG 领域 */}
              <SpectralCard 
                title={t('main.expertise.chr.title')}
                subtitle="Digital Chronicles"
                icon={<History size={28} />}
                gradient="from-cyan-600/30 via-blue-600/10 to-transparent"
                borderColor="border-cyan-500/20"
                spotlightColor="rgba(34, 211, 238, 0.2)"
                onClick={() => handleNav(() => onExploreExpertise({
                  title: "Agent智能体开发",
                  subtitle: "Digital Chronicles",
                  icon: <History size={28} />,
                  children: t('main.expertise.chr.desc')
                }))}
              >
                {t('main.expertise.chr.desc')}
              </SpectralCard>
            </div>
          </div>

          {/* ================= 模块三：极客通讯终端 (Contact Terminal) ================= */}
          <div className="w-full flex flex-col pt-4 pb-10">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-cyan-500/50"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold">{t('main.contact.title')}</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-8 lg:mb-12">{t('main.contact.hotline')} <span className="text-[9px] lg:text-[10px] text-white/20 ml-2 font-mono tracking-widest block lg:inline-block">{t('main.contact.encrypted')}</span></h3>

              <SpotlightCard className="w-full bg-slate-950/40 border border-white/10 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 relative overflow-hidden group">
              {/* Corner tech accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/10 group-hover:border-blue-500/50 transition-colors m-4 lg:m-8"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 group-hover:border-blue-500/50 transition-colors m-4 lg:m-8"></div>

              {/* Scanline Effect Overlay (Visible on focus) */}
            <AnimatePresence>
                {isTerminalFocused && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="scanline-effect"
                  />
                )}
              </AnimatePresence>

              <form 
                className="relative flex flex-col gap-6" 
                onSubmit={handleMessageSubmit}
                onFocus={() => setIsTerminalFocused(true)}
                onBlur={() => setIsTerminalFocused(false)}
              >
                {/* Real-name / Anonymous Toggle */}
                <div className="flex items-center gap-4 mb-2">
                  <span className={`text-[10px] font-bold tracking-widest ${!msgForm.is_anonymous ? 'text-cyan-400' : 'text-white/20'}`}>{t('main.contact.realname_v2')}</span>
                  <button 
                    type="button"
                    onClick={() => setMsgForm(prev => ({ ...prev, is_anonymous: !prev.is_anonymous }))}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${msgForm.is_anonymous ? 'bg-fuchsia-500/50' : 'bg-cyan-500/50'}`}
                  >
                    <motion.div 
                      animate={{ x: msgForm.is_anonymous ? 20 : 0 }}
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </button>
                  <span className={`text-[10px] font-bold tracking-widest ${msgForm.is_anonymous ? 'text-fuchsia-400' : 'text-white/20'}`}>{t('main.contact.anonymous_v2')}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <AnimatePresence mode="wait">
                    {!msgForm.is_anonymous && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        key="real-name-fields"
                        className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
                      >
                        <div className="flex flex-col gap-2 relative z-10">
                          <label className="text-[10px] lg:text-xs font-mono text-white/40 uppercase tracking-wider pl-1">{t('main.contact.label_name')}</label>
                          <input 
                            type="text" 
                            value={msgForm.name}
                            onChange={(e) => setMsgForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder={t('main.contact.placeholder_name')}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 lg:px-5 lg:py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all font-mono text-sm shadow-inner input-focus-pulse"
                          />
                        </div>
                        <div className="flex flex-col gap-2 relative z-10">
                          <label className="text-[10px] lg:text-xs font-mono text-white/40 uppercase tracking-wider pl-1">{t('main.contact.label_email')}</label>
                          <input 
                            type="email" 
                            value={msgForm.email}
                            onChange={(e) => setMsgForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder={t('main.contact.placeholder_email')}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 lg:px-5 lg:py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all font-mono text-sm shadow-inner input-focus-pulse"
                          />
                        </div>
                      </motion.div>
                    )}
                    {msgForm.is_anonymous && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key="anon-warning"
                        className="col-span-1 md:col-span-2 p-4 lg:p-5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl flex items-center gap-4"
                      >
                        <div className="p-3 bg-fuchsia-500/20 rounded-lg">
                          <Fingerprint size={24} className="text-fuchsia-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] lg:text-xs font-bold text-fuchsia-400 tracking-[0.2em] uppercase">Stealth Mode Active</span>
                          <span className="text-[9px] lg:text-[10px] text-white/40 font-mono">所有身份特征已被抹除，此连接将在传输后销毁。</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                  <label className="text-[10px] lg:text-xs font-mono text-white/40 uppercase tracking-wider pl-1">{t('main.contact.label_msg')}</label>
                  <textarea 
                    rows="4"
                    value={msgForm.content}
                    onChange={(e) => setMsgForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder={t('main.contact.placeholder_msg')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-[1.5rem] px-4 py-3 lg:px-5 lg:py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all font-mono text-sm shadow-inner resize-none input-focus-pulse"
                  ></textarea>
                </div>

                {sendResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 border ${sendResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
                  >
                    {sendResult.success ? <Zap size={18} /> : <Target size={18} />}
                    <span className="text-[10px] font-bold tracking-widest uppercase">{sendResult.text}</span>
                  </motion.div>
                )}

                <div className="flex justify-end mt-4 lg:mt-6 relative z-10">
                  <button 
                    type="submit"
                    disabled={isSending || !msgForm.content.trim()}
                    className={`group/submit relative overflow-hidden px-6 py-4 lg:px-10 lg:py-5 rounded-full font-black text-[10px] lg:text-xs tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-3 shadow-xl w-full md:w-auto justify-center ${isSending || !msgForm.content.trim() ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                    <span className="relative z-10">{isSending ? t('main.contact.sending') : t('main.contact.btn_send')}</span>
                    <ArrowRight size={16} className={`relative z-10 transition-transform duration-500 ${isSending ? 'animate-pulse' : 'group-hover/submit:translate-x-2'}`} />
                  </button>
                </div>
              </form>
            </SpotlightCard>
          </div>
          
          {/* ================= 备案信息 (ICP License) ================= */}
          <footer className="w-full py-12 flex justify-center items-center border-t border-white/5 mt-10">
            <a 
              href="https://beian.miit.gov.cn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 text-sm hover:text-slate-400 transition-colors duration-300 font-mono tracking-wide"
            >
              桂ICP备2026006241号
            </a>
          </footer>

        </div>
      </div>
      
      {/* ================= 档案详情弹窗已移除，迁移至 SchoolArchive 组件 ================= */}

      {/* ================= 赛博 AI 分身助理 ================= */}
      <CyberAssistant />

      {/* ================= 图片详情弹窗 ================= */}
      <ImageGalleryModal 
        isOpen={!!selectedPhoto} 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
      />

      {/* 隐藏滚动条样式注入 */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </motion.div>
  );
}
