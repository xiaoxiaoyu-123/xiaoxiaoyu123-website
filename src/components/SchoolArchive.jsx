import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Terminal, Cpu, Database, Network, ChevronRight } from 'lucide-react';
import CyberMusicPlayer from './CyberMusicPlayer';

export default function SchoolArchive({ school, onBack, bgmAudioRef, isBgmPlaying, setIsBgmPlaying }) {
  const [videoFinished, setVideoFinished] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Video mapping for different schools
  const videoMapping = {
    "桂林电子科技大学": "/jsdx.mp4"
  };

  const matchedVideoKey = Object.keys(videoMapping).find(key => school.title.includes(key));
  const videoSrc = matchedVideoKey ? videoMapping[matchedVideoKey] : null;

  // Logo mapping for the command center return button
  const logoMapping = {
    "桂林电子科技大学": "/gldz-logo.jpg"
  };
  const matchedLogoKey = Object.keys(logoMapping).find(key => school.title.includes(key));
  const logoSrc = matchedLogoKey ? logoMapping[matchedLogoKey] : null;

  // Official Link mapping
  const linkMapping = {
    "桂林电子科技大学": "https://www.guet.edu.cn/"
  };
  const matchedLinkKey = Object.keys(linkMapping).find(key => school.title.includes(key));
  const schoolLink = matchedLinkKey ? linkMapping[matchedLinkKey] : "#";

  // Auto-reveal content if no video is available for the school
  useEffect(() => {
    if (!videoSrc) {
      setVideoFinished(true);
    } else {
      setVideoFinished(false);
      setShowContent(false);
    }
  }, [school, videoSrc]);

  useEffect(() => {
    if (videoFinished) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [videoFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-hidden flex flex-col items-start justify-center font-sans">
      
      {/* 0. Background Image Layer (Cyber-Clear Logic) - Fixed */}
      <AnimatePresence mode="wait">
        {showContent && school?.bgImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${school.bgImage})` }}
            ></div>
            
            {/* 
               Strategic Masking: 
               1. Global dimming (very light)
               2. Sophisticated side-masking for text contrast
            */}
            {/* 
               Strategic Masking: 
               1. Global dimming (very light)
               2. Sophisticated side-masking for text contrast
            */}
            <div className="absolute inset-0 bg-slate-950/25"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/40 lg:to-transparent w-full lg:w-[65%]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Intro Video Layer - Fixed */}
      <AnimatePresence>
        {!videoFinished && videoSrc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center pointer-events-none"
          >
            <video 
              autoPlay 
              muted 
              playsInline
              onEnded={() => setVideoFinished(true)}
              className="w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Sidebar Content Layer (Cyber-Glass Aesthetic) */}
      <AnimatePresence>
        {showContent && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 w-full max-w-7xl px-6 md:px-20 flex flex-col justify-center h-full pt-10 md:pt-0"
          >
            {/* Header: Access Protocol Label */}
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
               <div className="flex flex-col">
                <span className="font-mono text-[7px] md:text-[8px] text-cyan-400/80 tracking-[0.4em] md:tracking-[0.6em] uppercase flex items-center gap-2">
                   <div className="w-1 h-1 bg-cyan-400 animate-pulse rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                   Archive_Protocol_Active
                </span>
                <div className="h-[1px] w-24 md:w-32 bg-gradient-to-r from-cyan-500/80 to-transparent mt-1.5"></div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-[60%] lg:w-[45%] flex flex-col gap-4">
              
              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tighter leading-tight drop-shadow-2xl whitespace-pre-line">
                  {school.title.replace(" (本科)", "")}
                </h1>
                <div className="inline-flex items-center gap-2 md:gap-3 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl font-mono text-cyan-400 text-[8px] md:text-[10px] tracking-[0.2em] uppercase">
                  <Terminal size={10} className="animate-pulse" />
                  Timeline: {school.year} // Node_ID: JSDU_01
                </div>
              </motion.div>

              {/* Glass Module 01: 核心进化档案 - Compressed Padding */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative overflow-hidden bg-white/[0.03] border-l-4 border-cyan-500/80 p-6 md:p-8 rounded-tr-2xl rounded-br-2xl backdrop-blur-[50px] shadow-[inset_0_0_30px_rgba(255,255,255,0.01)] hover:bg-white/[0.05] transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-[40px] group-hover:bg-cyan-500/10 transition-all"></div>
                
                <div className="text-cyan-400 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                     <Cpu size={22} />
                  </div>
                  <span className="font-black text-xs tracking-[0.3em] uppercase">核心进化档案</span>
                </div>
                <p className="text-white/90 leading-relaxed text-base md:text-lg font-medium tracking-wide drop-shadow-sm">
                  {school.fullDesc || school.desc}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
                
                {/* Glass Module 02: 思维基石 */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="group relative bg-white/[0.02] border border-white/10 p-5 rounded-2xl backdrop-blur-[50px] hover:bg-white/[0.05] transition-all duration-500 shadow-xl overflow-hidden md:col-span-2"
                >
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 blur-[35px] group-hover:bg-purple-500/20"></div>
                  
                  <div className="text-purple-400 mb-2 flex items-center gap-3">
                     <div className="p-1.5 bg-purple-500/10 rounded-lg">
                        <Database size={16} />
                     </div>
                     <span className="font-bold text-[11px] tracking-[0.2em] uppercase">思维基石</span>
                  </div>
                  <p className="text-white/60 italic text-xs leading-relaxed group-hover:text-white/80 transition-colors">
                    "在这里，我重塑了观察世界的维度。每一层逻辑都是通往未来的基石。"
                  </p>
                </motion.div>
                
                {/* Glass Module 03: 访问学校官网 */}
                <motion.a 
                  href={schoolLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="group relative bg-white/[0.02] border border-cyan-500/15 p-5 rounded-2xl flex items-center justify-between gap-3 backdrop-blur-[50px] hover:bg-cyan-500/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-500 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-3 relative z-10 w-full">
                    <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-all shrink-0">
                      <Network size={18} className="group-hover:animate-pulse" />
                    </div>
                    <div className="min-w-0 pr-2">
                      <div className="text-white/90 font-black text-[11px] uppercase tracking-widest mb-1 group-hover:text-cyan-300 transition-colors truncate">学校官网</div>
                      <div className="text-cyan-500/70 font-mono text-[8px] tracking-[0.1em] flex items-center gap-1 truncate">
                        {"//"} EXPLORE
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300 shrink-0">
                    <span className="text-[9px] font-bold tracking-widest hidden 2xl:block">前往</span>
                    <ChevronRight size={12} className="group-hover:-rotate-45 transition-transform duration-300" />
                  </div>
                </motion.a>

                {/* Glass Module 04: 访问学院官网 */}
                <motion.a 
                    href="https://www.guet.edu.cn/dept7/main.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="group relative bg-white/[0.02] border border-blue-500/15 p-5 rounded-2xl flex items-center justify-between gap-3 backdrop-blur-[50px] hover:bg-blue-500/[0.08] hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-3 relative z-10 w-full">
                      <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-all shrink-0">
                        <Cpu size={18} className="group-hover:animate-pulse" />
                      </div>
                      <div className="min-w-0 pr-2">
                        <div className="text-white/90 font-black text-[11px] uppercase tracking-widest mb-1 group-hover:text-blue-300 transition-colors truncate">学院官网</div>
                        <div className="text-blue-500/70 font-mono text-[8px] tracking-[0.1em] flex items-center gap-1 truncate">
                          {"//"} DEPT_SITE
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 group-hover:bg-blue-400 group-hover:text-slate-950 transition-all duration-300 shrink-0">
                      <span className="text-[9px] font-bold tracking-widest hidden 2xl:block">前往</span>
                      <ChevronRight size={12} className="group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                  </motion.a>
              </div>
            </div>
            
            {/* Fine Cyber Detail: Middle Scan-line */}
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Action Button (Command Center Entry) - Fixed */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-10 right-10 z-50 pointer-events-auto"
          >
            <button
              onClick={onBack}
              className="group relative flex items-center gap-4 pl-6 pr-10 py-5 bg-slate-950/40 border border-cyan-500/30 rounded-full backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:border-cyan-400 hover:scale-105 active:scale-95 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(34,211,238,0.1)]"
            >
              {/* Animated Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.07] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className={`relative z-10 flex items-center justify-center shrink-0 ${logoSrc ? 'p-0 border-[1.5px] border-cyan-500/60' : 'p-3 bg-cyan-500'} text-slate-950 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:rotate-[360deg] transition-transform duration-700 w-[44px] h-[44px] overflow-hidden`}>
                 {logoSrc ? (
                   <img src={logoSrc} alt="School Logo" className="w-full h-full object-cover rounded-full bg-white scale-[1.05]" />
                 ) : (
                   <X size={18} />
                 )}
              </div>
              
              <div className="relative z-10 flex flex-col items-start text-left">
                 <span className="text-white/40 font-mono text-[8px] tracking-[0.4em] uppercase mb-0.5">System_Return</span>
                 <span className="text-white font-black text-sm tracking-[0.1em] uppercase flex items-center gap-2">
                    返回指挥中心
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                 </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎵 江大校歌播放器 */}
      <CyberMusicPlayer
        logoSrc={logoSrc}
        onBgmPause={() => {
          if (bgmAudioRef?.current) {
            bgmAudioRef.current.pause();
            setIsBgmPlaying?.(false);
          }
        }}
        onBgmResume={() => {
          if (bgmAudioRef?.current) {
            bgmAudioRef.current.play().catch(() => {});
            setIsBgmPlaying?.(true);
          }
        }}
      />
    </div>
  );
}
