import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Check, X as XIcon, RefreshCw, Smartphone, MapPin, AlertTriangle, Lock, Users, Clock, Eye } from 'lucide-react';

const CommentAdmin = ({ onBack }) => {
    const [verified, setVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [verifyError, setVerifyError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [comments, setComments] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    // 页面加载时检查 sessionStorage
    useEffect(() => {
        if (sessionStorage.getItem('admin_verified') === 'true') {
            setVerified(true);
        }
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setVerifyError('');
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (data.status === 'success') {
                sessionStorage.setItem('admin_verified', 'true');
                setVerified(true);
            } else {
                setVerifyError('密码错误，请重试');
            }
        } catch {
            setVerifyError('网络错误，请稍后再试');
        } finally {
            setVerifying(false);
        }
    };

    const fetchComments = async (tab = activeTab) => {
        if (tab === 'visitors') return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/comments?tab=${tab}`);
            const data = await res.json();
            if (data.status === 'success') {
                setComments(data.data || []);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/visitors');
            const data = await res.json();
            if (data.status === 'success') {
                setVisitors(data.data || []);
            }
        } catch (err) {
            console.error("Fetch visitors error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!verified) return;
        if (activeTab === 'visitors') {
            fetchVisitors();
        } else {
            fetchComments();
        }
    }, [verified, activeTab]);

    const handleReview = async (id, status) => {
        try {
            const res = await fetch(`/api/admin/comments/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setComments(prev => prev.filter(c => c.id !== id));
            }
        } catch (err) {
            alert("操作失败，请检查网络");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("确定要永久删除这条评论吗？删了就找不回来了哦")) return;
        try {
            const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.status === 'success') {
                setComments(prev => prev.filter(c => c.id !== id));
            }
        } catch (err) {
            alert("删除失败，请检查网络");
        }
    };

    const handleRefresh = () => {
        if (activeTab === 'visitors') {
            fetchVisitors();
        } else {
            fetchComments();
        }
    };

    // 未验证 → 显示密码输入界面
    if (!verified) {
        return (
            <div className="w-full h-screen bg-black text-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 w-full max-w-sm backdrop-blur-2xl"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
                            <Lock size={32} className="text-blue-400" />
                        </div>
                        <h1 className="text-xl font-black tracking-widest uppercase">管理员验证</h1>
                        <p className="text-white/40 text-sm text-center tracking-wide">请输入管理密码以访问控制台</p>

                        <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="输入密码"
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:border-blue-500/50 transition-all text-center tracking-widest"
                            />
                            {verifyError && (
                                <p className="text-red-400 text-xs text-center tracking-wide">{verifyError}</p>
                            )}
                            <button
                                type="submit"
                                disabled={verifying || !password.trim()}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-widest hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-40 cursor-pointer"
                            >
                                {verifying ? '验证中...' : '验证身份'}
                            </button>
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-white/30 text-sm hover:text-white/60 transition-colors cursor-pointer"
                            >
                                返回主页
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 已验证 → 显示审核后台
    return (
        <div className="w-full h-screen bg-black text-white p-4 md:p-10 flex flex-col items-center custom-scrollbar" style={{ overflowY: 'auto' }}>
            <div className="w-full max-w-4xl relative">
                {/* 顶部导航 */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <Shield size={32} className="text-blue-500" />
                        <div>
                            <h1 className="text-2xl font-black tracking-widest uppercase">时空留言最高统帅部</h1>
                            <p className="text-white/40 text-sm tracking-widest mt-1">管理员专属机密控制台</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            <span className="text-sm font-bold tracking-widest">刷新情报</span>
                        </button>
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
                        >
                            <span className="text-sm font-bold tracking-widest">退出系统</span>
                        </button>
                    </div>
                </div>

                {/* 选项卡 */}
                <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-8 py-2.5 rounded-lg text-sm font-bold tracking-[0.2em] transition-all cursor-pointer ${activeTab === 'pending' ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-white/30 hover:text-white/60'}`}
                    >
                        待审中
                    </button>
                    <button
                        onClick={() => setActiveTab('published')}
                        className={`px-8 py-2.5 rounded-lg text-sm font-bold tracking-[0.2em] transition-all cursor-pointer ${activeTab === 'published' ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-white/30 hover:text-white/60'}`}
                    >
                        已发布
                    </button>
                    <button
                        onClick={() => setActiveTab('visitors')}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold tracking-[0.2em] transition-all cursor-pointer ${activeTab === 'visitors' ? 'bg-gradient-to-r from-cyan-600 to-emerald-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-white/30 hover:text-white/60'}`}
                    >
                        <Users size={16} />
                        访客列表
                    </button>
                </div>

                {/* ====== 访客列表视图 ====== */}
                {activeTab === 'visitors' ? (
                    loading ? (
                        <div className="text-center text-white/40 py-20 flex flex-col items-center gap-4">
                            <RefreshCw size={30} className="animate-spin" />
                            <span className="tracking-widest">正在扫描访客身份...</span>
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4 opacity-40">
                            <Users size={40} />
                            <span className="tracking-widest text-lg font-bold">暂无访客记录</span>
                            <p className="text-sm">还没有访客上报过身份信息</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {visitors.map((visitor) => (
                                    <motion.div
                                        key={visitor.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm p-5 hover:border-cyan-500/30 transition-all"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* 头像 */}
                                            <div className="shrink-0">
                                                {visitor.avatar ? (
                                                    <img
                                                        src={visitor.avatar}
                                                        alt={visitor.nickname}
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/30"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600/30 to-emerald-600/30 border-2 border-cyan-500/30 flex items-center justify-center">
                                                        <Users size={22} className="text-cyan-400/60" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* 信息 */}
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-white/90 truncate">{visitor.nickname}</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                                                        x{visitor.visit_count}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1 text-[11px] text-white/30 font-mono">
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye size={11} />
                                                        <span className="truncate">ID: {visitor.visitor_id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={11} />
                                                        <span>首次: {visitor.first_seen}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={11} />
                                                        <span>最近: {visitor.last_seen}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                ) : (
                    /* ====== 评论列表视图 ====== */
                    loading ? (
                        <div className="text-center text-white/40 py-20 flex flex-col items-center gap-4">
                            <RefreshCw size={30} className="animate-spin" />
                            <span className="tracking-widest">扫描时空截获...</span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4 opacity-40">
                            <Sparkles size={40} />
                            <span className="tracking-widest text-lg font-bold">当前位面极其纯净</span>
                            <p className="text-sm">{activeTab === 'pending' ? '暂无待处理情报' : '暂无通过审核的发布记录'}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <AnimatePresence>
                                {comments.map((comment) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`relative rounded-2xl overflow-hidden bg-white/[0.03] border backdrop-blur-sm ${comment.status === -1 ? 'border-red-500/40' : 'border-white/10'}`}
                                    >
                                        {comment.status === -1 && (
                                            <div className="absolute top-0 left-0 right-0 bg-red-500/10 text-red-400 text-[10px] py-1 px-4 font-bold flex items-center justify-center gap-2 tracking-[0.3em] uppercase">
                                                <AlertTriangle size={12} /> 机密拦截：检测到违禁词汇
                                            </div>
                                        )}

                                        <div className={`p-6 flex flex-col md:flex-row gap-6 ${comment.status === -1 ? 'mt-6' : ''}`}>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-white/5 text-[11px] text-white/40 tracking-widest overflow-hidden">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white/20">坐标:</span>
                                                        <span className="text-cyan-500 font-mono">{comment.photo_id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-2 py-0.5 bg-white/5 rounded border border-white/10">
                                                        {comment.avatar ? (
                                                            <img src={comment.avatar} className="w-4 h-4 rounded-full object-cover" alt="av" />
                                                        ) : (
                                                            <Shield size={10} />
                                                        )}
                                                        <span className="text-white/80 font-bold lowercase">{comment.nickname || "unknown"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={10} />
                                                        <span>{comment.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 hidden md:flex">
                                                        <Smartphone size={10} />
                                                        <span className="truncate max-w-[150px]">{comment.device_info}</span>
                                                    </div>
                                                    <div className="ml-auto font-mono">{comment.created_at}</div>
                                                </div>

                                                <div className="text-base md:text-lg text-white/90 leading-relaxed whitespace-pre-wrap">
                                                    {comment.content}
                                                </div>

                                                {comment.media_url && (
                                                    <div className="mt-2 rounded-xl border border-white/10 overflow-hidden w-fit max-w-full shadow-lg">
                                                        {comment.media_type === 'video' ? (
                                                            <video src={comment.media_url} controls className="max-h-60" />
                                                        ) : (
                                                            <img src={comment.media_url} className="max-h-60" alt="attached" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-2 min-w-[140px] justify-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <button onClick={() => handleReview(comment.id, 1)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500 hover:text-white transition-all text-xs font-bold tracking-widest cursor-pointer">
                                                            <Check size={16} /> 准许
                                                        </button>
                                                        <button onClick={() => handleReview(comment.id, -1)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/40 border border-white/10 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all text-xs font-bold tracking-widest cursor-pointer">
                                                            <XIcon size={16} /> 屏蔽
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleReview(comment.id, -1)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-xl hover:bg-orange-500 hover:text-white transition-all text-xs font-bold tracking-widest cursor-pointer">
                                                        <RefreshCw size={16} /> 撤回至此
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(comment.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] text-white/20 border border-white/5 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs font-bold tracking-widest cursor-pointer">
                                                    <XIcon size={16} /> 毁灭
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                )}
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}} />
        </div>
    );
};

export default CommentAdmin;
