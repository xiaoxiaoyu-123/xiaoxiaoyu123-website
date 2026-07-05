import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Network, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';


export default function CyberAssistant() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: t('cyber.greeting') }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const apiMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "大脑好像断片了，没给我回话..." }]);
      } else {
        const errorText = data.reply || data.detail || "未知系统异常";
        setMessages(prev => [...prev, { role: 'assistant', content: `[${t('cyber.systemError')}] ${errorText}` }]);
      }
    } catch (error) {
      console.error("AI API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `${t('cyber.networkError')} (请检查后端是否开启)` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 悬浮球 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* 呼吸光晕 */}
            <div className="absolute inset-0 bg-fuchsia-500 rounded-full blur-[20px] opacity-40 group-hover:opacity-70 animate-pulse"></div>
            
            <div className="relative w-14 h-14 bg-black/60 border border-fuchsia-500/30 backdrop-blur-xl rounded-full flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(217,70,239,0.5)]">
               <Bot size={24} className="text-fuchsia-400 group-hover:animate-bounce" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-fuchsia-500/20 to-transparent"></div>
            </div>
            {/* 未读提示小点 */}
            {messages.length === 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 rounded-full border border-black shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 对话窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] z-50 flex flex-col bg-[#030712]/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-fuchsia-500/20 flex items-center justify-between bg-fuchsia-900/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/40 flex items-center justify-center overflow-hidden">
                     <img src="/AI-xianyu.jpg" alt="AI Avatar" className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#030712] shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white tracking-wider">{t('cyber.name')}</span>
                  <span className="text-[10px] text-fuchsia-400 font-mono tracking-widest uppercase">Xiao xiao yu's AI</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 pb-2 custom-scrollbar">
               <div className="flex flex-col gap-6">
                 {messages.map((msg, idx) => (
                   <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] rounded-[1.2rem] px-4 py-3 ${
                       msg.role === 'user' 
                         ? 'bg-fuchsia-600 border border-fuchsia-400/50 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(192,38,211,0.3)]' 
                         : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-md shadow-lg shadow-black/20'
                     }`}>
                       <p className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'font-medium' : 'font-light'}`}>
                           {msg.content}
                       </p>
                     </div>
                   </div>
                 ))}
                 
                 {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-10 w-16">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full" />
                      </div>
                    </div>
                 )}
                 <div ref={messagesEndRef} />
               </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 relative">
              <div className="relative flex items-end bg-black/40 border border-white/10 rounded-[1.2rem] overflow-hidden focus-within:border-fuchsia-500/50 transition-colors shadow-inner">
                 <textarea
                   rows="1"
                   placeholder={t('cyber.placeholder')}
                   value={inputValue}
                   onChange={(e) => {
                     setInputValue(e.target.value);
                     e.target.style.height = 'inherit';
                     e.target.style.height = `${e.target.scrollHeight}px`;
                   }}
                   onKeyDown={handleKeyDown}
                   className="w-full bg-transparent text-white placeholder-white/30 text-sm px-4 py-3.5 focus:outline-none resize-none max-h-[100px] custom-scrollbar"
                   style={{ height: '48px' }}
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!inputValue.trim() || isTyping}
                   className="mb-2 mr-2 p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white disabled:opacity-50 disabled:hover:bg-fuchsia-500/20 disabled:hover:text-fuchsia-400 transition-colors flex-shrink-0 shadow-sm"
                 >
                    <Send size={16} />
                 </button>
              </div>
              <div className="text-center mt-3">
                 <span className="text-[9px] text-white/20 font-mono tracking-widest uppercase">
                   {t('cyber.dailyLimit')}
                 </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
