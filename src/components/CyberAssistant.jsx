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
                     <img src="data:image/jpeg;base64,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rgxK9uhyOoApLI6heKJSrBV7HivU/wDhHrHGDEoz6CrUenW0KBI4wv4UucfsI9jx68vr2SZbdIX64zVyPwpc3P7x5GG7tmvU49JthJuKA9+lXoo0QEIoAo5w9hHseRjwVdfwN/49TJvBd9vVg4/OvYQDj/61G09/5UuYfsI9jzF/BlzLp/llzuI5rNHw6la2aPzWFewMppu00cwexieI3vg6TS4z5gkkwM5HSu1+HemrawswXk5IrtZbRJkKyAEH2pLWyjtxiJdv6UN3NFBInUfNmpBQo4pyikUIRmmNHmTNSgUtIZEYUY5ZVJ9xSiMDoKkooAZto2U+igBmyjZin0GgCleQJcQOkiA59RXjfinRrvRdW+1oQbdjnA7V7Yy5rlPHWkyalp7LEcYHNaQZz16akjlrC5W7tUkU8kc1YBrj/DNw9neyWU+QQcDNdeOtbrU8OpFxlqY3iWw+12jEDLCua0nW5tJmEFwCYwcDJr0AqGXDDisu50W1uJMyRj64rGpT5jswWOeGZXPiqApuC4445opzeHrcfdUFfcUVh9WZ7SzzzOhUUp4FIDTWau9s+SjC70Ejbc9Z+ozxSuIYfmboaffXqWce9gTnoBT/AAvob3d79udW2MeARxWE5HqYXDO92bnhrw3EqJdTjMmQcEV2SDgU2JBGiovQVMo71lc9dKw4LSFacKDSGJto207FGKBDdlNMYPYVJRSGRiPB4p4FLmimISiiigBaKKKBhRRRQA0rSFafQaAIylG2n0UAN20bafRQBHt4xRt4x2p9FAhm32pCmeoqSigBu2jbT6KBjcUYp2KQigTExRj2pcUuKBIbigjPWnYoxQUJiilooAKKKKACiiigAooooAKKKKAGsPSq06bkcHoVxVuoXGcimnYmSujwjxfB9h8TKYRgls109m5eCMnqQKp/EyD7JdpMybsn73pRod19os0bGAK3pu542Mp8rua+3ijZTVfNSqa15TzriY4xRS0U+UnmImB31k+Iria2hHkfeOcd/StOZnVN1cvtvNT1Dy493HA/xrOR2YWF5I6Hw9odzqltFJcc/wAq9E062W0tliUY21U8M2j2WlxJIPmx0I5FayjPJrnkz3qcbIeoqSmqKcKk0FooooAKKKKACiiigAooooAKKKKACiiigAooooAOaSgnFG4UAGKMUZozQAtFFFABRRRQAUUU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" alt="AI Avatar" className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#030712] shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white tracking-wider">{t('cyber.name')}</span>
                  <span className="text-[10px] text-fuchsia-400 font-mono tracking-widest uppercase">Bob Zhang's AI</span>
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
