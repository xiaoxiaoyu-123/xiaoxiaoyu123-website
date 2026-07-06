import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Terminal, Cpu, Database, Network, Activity, Shield, Box, Zap, Sparkles, Code2, History, FileCode, Layers, Search, Play, CheckCircle2, FileText, ExternalLink,Send, SendHorizonalIcon } from 'lucide-react';
import { useSyncStats } from '../hooks/useSyncStats';

// Professional Summaries & Local PDF Links - Dynamic Generator
const generateExpertiseConfig = (articleCount) => ({
  "前端技术栈": {
    id: "AI",
    theme: { color: "text-purple-400", border: "border-purple-500/30", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]", bgImage: "/ai_bg.png" },
    stats: [
      { label: "Vue", value: "ElementPlus Nuxt.js", icon: <Network size={14}/> },
      { label: "React", value: "AntDesign Next.js", icon: <Zap size={14}/> }
    ],
    records: [
      { 
        title: "Vue3框架学习", 
        summary: `Vue3框架学习笔记，涵盖Composition API、响应式系统、路由与状态管理等核心概念，旨在帮助开发者快速掌握现代前端开发技术。`,
        date: "2024.11", 
        pdfPath: "null",
        category: "Vue3" 
      },
      { 
        title: "React 18新特性探索", 
        summary: "深入探索React 18的新特性，包括Concurrent Mode、Suspense、自动批处理等，分享在实际项目中的应用经验和性能优化技巧。",
        date: "2024.10", 
        pdfPath: "null",
        category: "React" 
      },
      { 
        title: "Typescript类型系统深度解析", 
        summary: "全面解析Typescript的类型系统，包括高级类型、泛型、条件类型等，帮助开发者在大型项目中实现更安全和可维护的代码结构。",
        date: "2024.04", 
        pdfPath: "null",
        category: "TypeScript" 
      },
      { 
        title: "Tailwind CSS实战指南", 
        summary: "Tailwind CSS实战指南，介绍如何在现代前端项目中高效使用Tailwind进行样式设计，涵盖响应式布局、组件化设计及性能优化策略。",
        date: "2024.03", 
        pdfPath: "null",
        category: "Tailwind CSS" 
      },
      {
        title: "Element Plus组件库深度使用",
        summary: "Element Plus组件库深度使用指南，介绍如何在实际项目中高效使用该UI框架，涵盖组件特性、使用技巧及性能优化策略。",
        date: "2024.02",
        pdfPath: "null",
        category: "Element Plus"
      },
      {
        title: "Ant Design组件库实战",
        summary: "Ant Design组件库实战指南，介绍如何在实际项目中高效使用该UI框架，涵盖组件特性、使用技巧及性能优化策略。",
        date: "2024.01",
        pdfPath: "null",
        category: "Ant Design"
      }
    ],
    layout: "neural"
  },
  "AI辅助编程": {
    id: "RPA",
    theme: { color: "text-orange-400", border: "border-orange-500/30", glow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]", bgImage: "/rpa_bg.png" },
    stats: [
      { label: "OpenAI", value: "Codex", icon: <Box size={14}/> },
      { label: "ClaudeAI", value: "Claude Code", icon: <Shield size={14}/> }
    ],
    records: [
      { 
        title: "Claude Code", 
        summary: "Claude Code 是一款基于 Claude AI 的代码生成与优化工具，旨在帮助开发者快速生成高质量代码，并提供智能化的代码审查和优化建议。",
        date: "2026.4", 
        pdfPath: "null",
        status: "Claude Code" 
      },
      { 
        title: "Codex", 
        summary: "Codex 是 OpenAI 推出的强大代码生成模型，能够理解自然语言描述并生成相应的代码，支持多种编程语言，广泛应用于自动化脚本、代码补全和开发辅助工具。",
        date: "2026.5", 
        pdfPath: "null",
        status: "Codex" 
      },
      { 
        title: "CurSor", 
        summary: "CurSor 是一款智能化的代码导航与编辑工具，利用 AI 技术帮助开发者快速定位代码片段、理解代码逻辑，并提供智能化的编辑建议和自动补全功能。",
        date: "2026.01", 
        pdfPath: "null",
        status: "CurSor" 
      },
      { 
        title: "Trae", 
        summary: "Trae 是一款基于 AI 的代码追踪与分析工具，能够实时监控代码执行路径，帮助开发者快速定位问题、优化性能，并提供可视化的代码分析报告。",
        date: "2025.11", 
        pdfPath: "null",
        status: "Trae" 
      }
    ],
    layout: "dashboard"
  },
  "Python后端开发": {
    id: "PY",
    theme: { color: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]", bgImage: "/python_bg.png" },
    stats: [
      { label: "Python", value: "FastAPI", icon: <Layers size={14}/> },
      { label: "Java", value: "Spring Boot", icon: <Shield size={14}/> }
    ],
    records: [
      { 
        title: "Python", 
        summary: "Python 是一种高级编程语言，具有简洁的语法和强大的库支持，广泛应用于数据分析、人工智能、Web开发等领域。",
        pdfPath: "null",
        type: "Programming", complexity: "Python" 
      },
      { 
        title: "MySQL", 
        summary: "MySQL 是一种开源关系型数据库管理系统，广泛应用于Web应用和数据存储，支持高性能查询和事务处理。",
        pdfPath: "null",
        type: "Database", complexity: "MySQL" 
      },
      { 
        title: "Redis", 
        summary: "Redis 是一个开源的内存数据结构存储系统，常用于缓存、消息队列和实时分析等场景。",
        pdfPath: "null",
        type: "Database", complexity: "Redis" 
      },
      {
        title: "FastAPI",
        summary: "FastAPI 是一个现代、快速（高性能）的 Web 框架，基于 Python 3.7+ 类型提示构建，支持自动生成 API 文档和数据验证。",
        pdfPath: "null",
        type: "Framework", complexity: "FastAPI"
      }
    ],
    layout: "ide"
  },
  "Agent智能体开发": {
    id: "CHR",
    theme: { color: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-[0_0_30px_rgba(34,211,238,0.3)]", bgImage: "/chronicle_bg.png" },
    stats: [
      { label: "Agent", value: "LLM  Prompt Engineering", icon: <History size={14}/> },
      { label: "Progressive", value: 'Tool  RAG', icon: <Search size={14}/> }
    ],
    records: [
      { 
        title: "LLM API基础", 
        summary: "基础的 LLM API 使用指南，涵盖模型调用、参数配置、响应处理等核心概念，帮助开发者快速上手大语言模型的集成与应用。",
        year: "2026.8", 
        era: "AI_ERA",
        pdfPath: "null"
      },
      { 
        title: "Prompt Engineering", 
        summary: "深入的 Prompt Engineering 技术解析，介绍如何设计高效的提示语以优化大语言模型的输出质量和准确性，提升 AI 应用的智能化水平。",
        year: "2026.9",
        era: "AI_ERA",
        pdfPath: "null"
      },
      { 
        title: "Tool Use and Function Calling", 
        summary: `详细的工具使用与函数调用指南，涵盖如何在大语言模型中集成外部工具和服务，实现复杂任务的自动化处理和智能化决策。`,
        year: "2026.10",
        era: "AI_ERA",
        pdfPath: "null"
      },
      {
        title: "RAG知识库检索",
        summary: "RAG（Retrieval-Augmented Generation）知识库检索技术解析，介绍如何结合检索机制与生成模型，实现高效的信息获取和智能化内容生成。",
        year: "2026.11",
        era: "AI_ERA",
        pdfPath: "null"
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
                  <span className="group-hover:text-white transition-colors"> Source Authenticated ✓</span>
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
                   <span className="text-xs font-bold uppercase tracking-widest">开始探索</span>
                   <SendHorizonalIcon size={16} className="-rotate-45" />
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
                   <span className="tracking-widest">Src//Geek_Logs</span>
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
                        <span className="text-[10px] font-mono">深入Agent智能体开发</span>
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
                <span className="text-xs font-mono text-white/60 tracking-widest uppercase">Data_Source: AI WEBSITE</span>
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
                <span>Deep_Use_AI</span>
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
                  <span className="text-xs font-black text-white/60 tracking-[0.4em] uppercase">VibeCoding Agent </span>
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
