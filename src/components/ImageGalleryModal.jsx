import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, ExternalLink, Send, MessageSquare } from 'lucide-react';

export default function ImageGalleryModal({ isOpen, photo, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当弹窗打开且切换了相片/视频时，拉取该内容的评论
  useEffect(() => {
      if (isOpen && photo) {
          fetch(`/api/comments/${photo.id}`)
              .then(res => res.json())
              .then(data => {
                  if(data.status === 'success') {
                      setComments(data.data || []);
                  }
              })
              .catch(err => console.error("Failed to load comments:", err));
      }
  }, [isOpen, photo]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      
      setIsSubmitting(true);
      try {
          const res = await fetch(`/api/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ photo_id: String(photo.id), content: newComment })
          });
          const data = await res.json();
          alert(data.message); // 触发审核提示
          setNewComment("");
      } catch (err) {
          alert("提交失败，请检查网络连接");
      } finally {
          setIsSubmitting(false);
      }
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 pointer-events-auto"
        >
          {/* 玻璃模糊背板 */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-5xl bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row group"
          >
            {/* 关闭按钮 */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
            >
              <X size={20} />
            </button>

            {/* 图片/视频展示区 */}
            <div className="w-full md:w-2/3 h-[300px] md:h-[600px] bg-slate-900/50 relative overflow-hidden flex flex-col justify-center border-r border-white/5">
                {photo.type === 'video' ? (
                    <video 
                        src={photo.url} 
                        className="w-full h-full object-contain md:object-cover"
                        controls
                        autoPlay
                    />
                ) : (
                    <img 
                        src={photo.url} 
                        alt={photo.title}
                        className="w-full h-full object-contain md:object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                {/* 装饰边框 */}
                <div className="absolute inset-0 border-[8px] border-black/20 pointer-events-none z-10"></div>
            </div>

            {/* 详情及抖音式独立评论区 */}
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col h-[450px] md:h-[600px] bg-black/40">
               {/* 顶部：标题和基础信息 */}
               <div className="shrink-0 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-px bg-cyan-500/50"></div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold">Interactive_Archive</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter uppercase leading-none">
                    {photo.title}
                  </h2>
                  <div className="flex items-center gap-2 text-white/50">
                      <MapPin size={14} className="text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-widest">{photo.location || "Deep Space Node"}</span>
                  </div>
               </div>

               {/* 中间：独立评论列表区 (Scrollable) */}
               <div className="flex-1 min-h-0 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                  {comments.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-white/20 gap-3">
                          <MessageSquare size={32} className="opacity-20" />
                          <span className="text-xs font-mono uppercase tracking-widest text-center">系统检测到此处为真空地带<br/><br/>抢占跨维度首评</span>
                      </div>
                  ) : (
                      <div className="flex flex-col gap-5">
                          {comments.map(c => (
                              <div key={c.id} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                                      <span className="text-[10px] font-bold text-white/80">{c.location ? c.location.charAt(0) : "访"}</span>
                                  </div>
                                  <div className="flex flex-col flex-1 pb-4 border-b border-white/5">
                                      <div className="flex items-center justify-between">
                                          <span className="text-xs font-bold text-white/50">来自 {c.location || "星空深处"}</span>
                                          <span className="text-[9px] text-white/30">{new Date(c.created_at).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-sm text-white/90 mt-1.5 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                                      <div className="text-[9px] text-white/20 mt-2 font-mono uppercase tracking-wider">{c.device_info}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
               </div>

               {/* 底部：评论提交终端 */}
               <div className="shrink-0 pt-4 border-t border-white/10">
                   <form onSubmit={handleSubmit} className="flex gap-3">
                       <input 
                           type="text" 
                           value={newComment}
                           onChange={e => setNewComment(e.target.value)}
                           placeholder="留下你的精神印记..."
                           className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
                       />
                       <button 
                           type="submit"
                           disabled={isSubmitting || !newComment.trim()}
                           className="w-11 h-11 shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-cyan-500/20 disabled:hover:text-cyan-400 shadow-lg group/sendbtn"
                       >
                           <Send size={16} className={`transition-transform ${isSubmitting ? "animate-pulse" : "group-hover/sendbtn:translate-x-0.5 group-hover/sendbtn:-translate-y-0.5"}`} />
                       </button>
                   </form>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
