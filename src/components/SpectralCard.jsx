import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SpectralCard = ({ children, title, subtitle, icon, gradient, borderColor, spotlightColor, onClick, className = "" }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position relative to card for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-[2.5rem] border ${borderColor} bg-slate-950/40 backdrop-blur-xl transition-all duration-500 group cursor-pointer ${className}`}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* ... existing layers ... */}
      <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-to-br ${gradient}`}></div>
      
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`
          ),
        }}
      />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10 p-10 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              {icon}
            </div>
            <div className="text-[10px] font-mono font-black text-white/20 tracking-[0.4em] uppercase">{subtitle}</div>
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">
            {title}
          </h3>
          
          <div className="w-12 h-1 bg-gradient-to-r from-white/20 to-transparent rounded-full mb-6 group-hover:w-24 transition-all duration-700"></div>
          
          <div className="text-white/50 text-sm leading-relaxed mb-8">
            {children}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Evidence Verified</div>
          <button 
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
            className="flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer group/btn"
          >
            点击探索档案 <motion.span animate={isHovered ? { x: 5 } : { x: 0 }}>→</motion.span>
          </button>
        </div>
      </div>
      
      {/* 5. Edge Highlight (Conic) */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/0 group-hover:border-white/10 transition-colors pointer-events-none"></div>
    </motion.div>
  );
};

export default SpectralCard;
