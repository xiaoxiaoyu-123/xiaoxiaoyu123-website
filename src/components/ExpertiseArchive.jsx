import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Terminal, Cpu, Database, Network, Activity, Shield, Box, Zap, Sparkles, Code2, History, FileCode, Layers, Search, Play, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { useSyncStats } from '../hooks/useSyncStats';

// Professional Summaries & Local PDF Links - Dynamic Generator
const generateExpertiseConfig = (articleCount) => ({
  "AI 进化与知识工程": {
    id: "AI",
    theme: { color: "text-purple-400", border: "border-purple-500/30", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]", bgImage: "/ai_bg.png" },
    stats: [
      { label: "Knowledge_Nodes", value: "NotebookLM / LLM", icon: <Network size={14}/> },
      { label: "Intelligence_Level", value: "Claude Opus 4.6", icon: <Zap size={14}/> }
    ],
    records: [
      { 
        title: "NotebookLM 个人知识库", 
        summary: `深度复盘如何利用 NotebookLM 的多源对齐能力，将公众号数年沉淀的 ${articleCount}+ 篇文章构建为“可对话”的第二大脑，实现知识的碎片化重组与深度对齐。`,
        date: "2024.11", 
        pdfPath: "https://mp.weixin.qq.com/s/mgldJhWay66dqkvR_9yxZg",
        category: "KNOWLEDGE_OPS" 
      },
      { 
        title: "Kimi 测评实录：高冷背后的技术底座", 
        summary: "从逻辑推理、长文本处理及视觉识别等维度，深度复盘 Kimi 大模型的实战边界与优化策略，探索其在中文语境下的极致性能表现。",
        date: "2024.10", 
        pdfPath: "https://mp.weixin.qq.com/s/GbrMsMtAFtc_KmNJ2Rp1PQ",
        category: "LLM_TEST" 
      },
      { 
        title: "Claude Opus 接入与 Agent 编排", 
        summary: "在 Antigravity 环境下丝滑接入 Claude Opus，分享高效 Agent 的任务编排逻辑、Prompt 链设计心得以及在复杂编码任务中的表现评估。",
        date: "2024.04", 
        pdfPath: "https://mp.weixin.qq.com/s/je0usLWhdPCUDFuVjc4PFg",
        category: "AGENT_BUILD" 
      },
      { 
        title: "AI 辅助内在驱动力建模", 
        summary: "运用特定的 Prompt 引导 LLM 进行深度心理建模，协助人类探索内在动机与职业驱动力，分享一套实验性的提示词逻辑与反馈闭环。",
        date: "2024.03", 
        pdfPath: "https://mp.weixin.qq.com/s/OoXWTVbHBKu_dNNqrfXqDw",
        category: "PROMPT_ENG" 
      }
    ],
    layout: "neural"
  },
  "RPA 流程自动化": {
    id: "RPA",
    theme: { color: "text-orange-400", border: "border-orange-500/30", glow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]", bgImage: "/rpa_bg.png" },
    stats: [
      { label: "Core_Engine", value: "ShadowBot / Octopus", icon: <Box size={14}/> },
      { label: "Sync_Safety", value: "Feishu Verified", icon: <Shield size={14}/> }
    ],
    records: [
      { 
        title: "小红书全自动作品信息采集", 
        summary: "详细拆解基于影刀 RPA 的自媒体数据采集工具，破解滑动验证、动态 DOM 识别及大规模并发下的频率控制等核心实战难点。",
        date: "2024.12", 
        pdfPath: "https://mp.weixin.qq.com/s/hclMlNh3r0eSWzpzG0zJXA",
        status: "SUCCESS" 
      },
      { 
        title: "影刀 RPA 结缘与效率重塑", 
        summary: "从小工具到效率支柱。记录 RPA 如何深度进入生产力流程，反思“机器替代重复劳动”对技术人思维的解放与二次赋能。",
        date: "2024.09", 
        pdfPath: "https://mp.weixin.qq.com/s/L5H2-4rB34hWBb47AGAyUw",
        status: "LEGACY" 
      },
      { 
        title: "RPA 选型：影刀 vs 八爪鱼", 
        summary: "多维度对比本地控制流与云端爬虫的适用边界，涵盖成本、稳定性、开发难度及复杂交互处理能力的深度实测分析。",
        date: "2024.08", 
        pdfPath: "https://mp.weixin.qq.com/s/7BmfvGxrSJx4qkYWj6G5tg",
        status: "ANALYSIS" 
      },
      { 
        title: "RPA 实战案例落地选集", 
        summary: "将 RPA 真正应用到复杂业务流。分享从流程逻辑建模到实操脚本落地的全生命周期管理，助力企业实现跨系统的全链路自动化。",
        date: "2024.03", 
        pdfPath: "https://mp.weixin.qq.com/s/zTdkrgKr-XD_O8oWCyQPOQ",
        status: "INTEGRATED" 
      }
    ],
    layout: "dashboard"
  },
  "Python 极客实验室": {
    id: "PY",
    theme: { color: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]", bgImage: "/python_bg.png" },
    stats: [
      { label: "Logic_Engine", value: "Manim / Scrapy", icon: <Layers size={14}/> },
      { label: "System_Guard", value: "Terminal Safety", icon: <Shield size={14}/> }
    ],
    records: [
      { 
        title: "Manim 数学动效编程实战", 
        summary: "探索 Manim 引擎在几何演化、矢量场动画中的极致应用，分享三维空间逻辑构建、函数曲线动态渲染的 Python 源码级心得。",
        pdfPath: "https://mp.weixin.qq.com/s/cgK6vK1GTLfO6ZYOmaUDqw",
        type: "VISUAL", complexity: "HIGH" 
      },
      { 
        title: "终端输错误删事故告诫录", 
        summary: "诚恳记录一次 Linux 环境下的“rm 误删惊魂”，深度复盘权限分级、alias 灾备配置及在事故中保持冷静处理的技术人修养。",
        pdfPath: "https://mp.weixin.qq.com/s/mv_yYcpKBlNVAmHVM4kxSg",
        type: "SAFETY", complexity: "CRITICAL" 
      },
      { 
        title: "Python 环境冲突填坑指南", 
        summary: "针对版本不连贯导致的依赖地狱，复盘 pyenv 与 poetry 的实战部署方案，解决由于编译器环境导致的“Python 版本过高”报错陷阱。",
        pdfPath: "https://mp.weixin.qq.com/s/g16TYoXiWDarww2-qdqzMw",
        type: "CONFIG", complexity: "MID" 
      }
    ],
    layout: "ide"
  },
  "数字成长编年史": {
    id: "CHR",
    theme: { color: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-[0_0_30px_rgba(34,211,238,0.3)]", bgImage: "/chronicle_bg.png" },
    stats: [
      { label: "Time_Span", value: "8 Years Archive", icon: <History size={14}/> },
      { label: "Article_Count", value: `${articleCount}+ Deep Docs`, icon: <Search size={14}/> }
    ],
    records: [
      { 
        title: "2025 年度总结：在于未知中寻找方向", 
        summary: "这是思维进化的最新里程碑。在文章中，我全面复盘了在 AI Agent 大爆发时代的自我认知重构。分享了如何通过 NotebookLM 与大语言模型（如 Claude Opus、Kimi），将过去几十篇分散的技术随笔整合成具有驱动力的极客‘第二大脑’与数字分身。",
        year: "2025", era: "AI_ERA",
        pdfPath: "https://mp.weixin.qq.com/s/AthqzUcE6kNg3ZsF7SXPjQ"
      },
      { 
        title: "大学生活日纪：江大计算机随笔", 
        summary: "凝固了在江苏大学计算机工程系攻坚克难的真实影像。从初探 Python 高级爬虫、Manim 引擎开发，到将 RPA 自动化融入影刀与飞书，每一篇随笔不仅记录了代码流，更是从纯粹开发向架构思维跃迁的硬核证据链。",
        year: "2022", era: "UNIVERSITY_ERA",
        pdfPath: "/archives/大学生活日纪.pdf"
      },
      { 
        title: "万宁中学往事：极客基因的萌芽", 
        summary: `一切探索的源点（Genesis Node）。生动回溯了早在万宁中学的那段求学岁月，记载着在有限的信息空间里，由少年锐气与对计算机二进制逻辑的初次触电所锻造出的原始驱动力。这是 ${articleCount} 篇连载中最纯粹的起点档案。`,
        year: "2018", era: "GENESIS_ERA",
        pdfPath: "/archives/海南万宁中学档案.pdf"
      }
    ],
    layout: "timeline"
  }
});

export default function ExpertiseArchive({ expertise, onBack }) {
  const [showContent, setShowContent] = useState(false);
  const { articleCount } = useSyncStats();
  const expertiseConfig = generateExpertiseConfig(articleCount);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const config = expertiseConfig[expertise.title] || { 
    theme: { color: "text-white", border: "border-white/10", glow: "", bgImage: "" },
    stats: [], records: [], layout: "neural" 
  };

  const openPDF = (path) => {
    if (path) window.open(path, '_blank');
  };

  const renderSubLayout = () => {
    switch (config.layout) {
      case "neural":
        return (
          <div className="grid grid-cols-1 gap-6">
            {config.records.map((record, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={showContent ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[2rem] border ${config.theme.border} bg-black/40 backdrop-blur-xl flex flex-col gap-5 group cursor-pointer relative overflow-hidden`}
                onClick={() => openPDF(record.pdfPath)}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Network size={120} className={config.theme.color} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className={`px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono ${config.theme.color}`}>
                    THEME://{record.category}
                  </div>
                  <div className="flex items-center gap-2 text-white/20 group-hover:text-purple-400 transition-colors">
                    <span className="text-[10px] font-mono">阅读原文</span>
                    <ExternalLink size={14} />
                  </div>
                </div>
                <h4 className="text-2xl font-black text-white relative z-10 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{record.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed relative z-10 max-w-3xl">
                  {record.summary}
                </p>
                <div className="mt-2 pt-6 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-white/20 relative z-10">
                  <div className="flex items-center gap-4">
                    <span>INDEX: {i + 1}</span>
                    <span>TIMESTAMP: {record.date}</span>
                  </div>
                  <span className="group-hover:text-white transition-colors">SOURCE_AUTHENTICATED ✓</span>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case "dashboard":
        return (
          <div className="flex flex-col gap-4">
            {config.records.map((record, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={showContent ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 10, backgroundColor: "rgba(249,115,22,0.08)" }}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer transition-all"
                onClick={() => openPDF(record.pdfPath)}
              >
                <div className="flex gap-6 items-start">
                   <div className="mt-2 w-2 h-2 rounded-full bg-orange-500 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-all" />
                   <div className="max-w-2xl">
                      <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors mb-2 uppercase tracking-tight">{record.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{record.summary}</p>
                      <div className="flex items-center gap-4 mt-4 font-mono text-[10px] text-orange-500/50">
                        <span>STATUS: {record.status}</span>
                        <span>DATE: {record.date}</span>
                      </div>
                   </div>
                </div>
                <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap">
                   <span className="text-xs font-bold uppercase tracking-widest">查看报告</span>
                   <FileText size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        );
      case "ide":
        return (
          <div className="flex flex-col md:flex-row gap-6 h-[700px] bg-[#0d1117]/80 rounded-[2.5rem] border border-white/5 overflow-hidden">
             <div className="w-full md:w-80 border-r border-white/5 p-6 flex flex-col gap-3 font-mono text-xs text-white/40">
                <div className="flex items-center gap-2 mb-6 text-white/60">
                   <Search size={16} className="text-emerald-400" />
                   <span className="tracking-widest">SRC // GEEK_LOGS</span>
                </div>
                {config.records.map((record, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-all group"
                    onClick={() => openPDF(record.pdfPath)}
                  >
                     <FileCode size={16} className="text-white/20 group-hover:text-emerald-400" />
                     <span className="truncate">{record.title}</span>
                  </motion.div>
                ))}
             </div>
             <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-8">
                   {config.records.map((record, i) => (
                     <motion.div 
                        key={i}
                        className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer"
                        onClick={() => openPDF(record.pdfPath)}
                     >
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                              <span className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">Complexity: {record.complexity}</span>
                           </div>
                           <div className="flex items-center gap-2 text-white/20 group-hover:text-emerald-400 transition-colors">
                              <span className="text-[10px] font-mono">READ_SOURCE</span>
                              <ExternalLink size={12} />
                           </div>
                        </div>
                        <h4 className="text-lg font-black text-white mb-3 group-hover:text-emerald-400 transition-colors">{record.title}</h4>
                        <p className="text-white/40 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4">
                          " {record.summary} "
                        </p>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>
        );
      case "timeline":
        return (
          <div className="relative pl-12 border-l border-white/10 flex flex-col gap-16 py-8">
             {config.records.map((record, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -30 }}
                 animate={showContent ? { opacity: 1, x: 0 } : {}}
                 transition={{ delay: i * 0.2 }}
                 className="relative group cursor-pointer"
                 onClick={() => openPDF(record.pdfPath)}
               >
                  <div className={`absolute -left-[54px] top-2 w-6 h-6 rounded-full border-4 border-slate-950 bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_20px_rgba(34,211,238,0.6)] group-hover:shadow-[0_0_30px_rgba(34,211,238,1)]`} />
                  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
                     <span className="text-4xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tighter">{record.year}</span>
                     <div className="px-4 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase">{record.era}</div>
                     <div className="flex items-center gap-2 text-white/20 group-hover:text-cyan-400 transition-colors ml-auto md:ml-0">
                        <span className="text-[10px] font-mono">阅读编年史</span>
                        <ExternalLink size={14} />
                     </div>
                  </div>
                  <div className="max-w-4xl p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all">
                    <h4 className="text-2xl font-black text-white mb-4 leading-tight">{record.title}</h4>
                    <p className="text-white/50 text-base leading-relaxed font-light">{record.summary}</p>
                  </div>
               </motion.div>
             ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020617] overflow-hidden flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 1.15 }}
        animate={showContent ? { opacity: 0.12, scale: 1 } : { opacity: 0, scale: 1.15 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${config.theme.bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
      <div className="relative z-20 w-full max-w-7xl h-full flex flex-col px-6 py-10 md:py-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={showContent ? { opacity: 1, y: 0 } : {}} className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-8">
            <button onClick={onBack} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all group active:scale-95 shadow-xl">
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-white/20 tracking-[0.5em] uppercase">Status: Evidence_Verified</span>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config.theme.color.replace('text', 'bg')} animate-pulse`}></div>
                <span className="text-xs font-mono text-white/60 tracking-widest uppercase">Data_Source: WeChat_Cloud</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10 font-mono text-[11px] text-white/20 tracking-widest uppercase">
             <div className="flex items-center gap-2"><Shield size={14} className={config.theme.color} /><span>Integrity_High</span></div>
             <div className="flex items-center gap-2"><CheckCircle2 size={14} className={config.theme.color} /><span>Records_Live</span></div>
          </div>
        </motion.div>
        <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-12 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            animate={showContent ? { opacity: 1, x: 0 } : {}} 
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[400px] flex flex-col gap-6 lg:gap-8 shrink-0"
          >
            <div className={`p-6 md:p-8 lg:p-10 rounded-3xl lg:rounded-[3.5rem] bg-black/40 border ${config.theme.border} backdrop-blur-3xl relative group overflow-hidden ${config.theme.glow}`}>
              <div className={`p-4 md:p-6 w-fit rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 ${config.theme.color} shadow-2xl`}>
                {expertise.icon}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mt-6 lg:mt-10 mb-4 lg:mb-6 tracking-tighter leading-[0.9]">{expertise.title}</h1>
              <p className="text-white/40 text-sm md:text-base leading-relaxed mb-6 lg:mb-10 font-light">{expertise.children}</p>
              <div className="flex flex-col gap-3 lg:gap-4">
                 {config.stats.map((stat, i) => (
                   <div key={i} className="flex items-center justify-between p-4 lg:p-5 rounded-2xl bg-white/5 border border-white/5 font-mono">
                      <div className="flex items-center gap-3 lg:gap-4 text-white/20 text-[10px] lg:text-[11px] uppercase tracking-[0.2em]">{stat.icon}<span>{stat.label}</span></div>
                      <span className={`text-[11px] lg:text-[12px] font-black ${config.theme.color} tracking-widest`}>{stat.value}</span>
                   </div>
                 ))}
              </div>
              <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-white/30 text-[10px] uppercase tracking-widest font-bold grayscale hover:grayscale-0 transition-all cursor-crosshair">
                <Sparkles size={14} />
                <span>Deep_Analysis_Active</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={showContent ? { opacity: 1, y: 0 } : {}} 
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }} 
            className="flex-1 flex flex-col gap-6 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 mb-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-px bg-white/20"></div>
                  <span className="text-xs font-black text-white/60 tracking-[0.4em] uppercase">Insight_Archive</span>
               </div>
               <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">ACCESS_ONLINE_ARTICLE</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
               {renderSubLayout()}
            </div>
          </motion.div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.15); }
      `}} />
    </div>
  );
}
