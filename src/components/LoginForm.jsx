import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Plus, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Default avatars defined outside component
const DEFAULT_AVATARS = [
  { id: 0, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', type: 'preset' },
  { id: 1, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka', type: 'preset' },
  { id: 2, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sasha', type: 'preset' },
  { id: 3, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nala', type: 'preset' },
];

export default function LoginForm({
  initialData,
  onPasswordFocusChange,
  onShowPasswordChange,
  onEmailFocusChange,
  onTypingChange,
  onNoddingChange,
  onLoginStateChange,
  onLoginSuccess
}) {
  const { t } = useTranslation();
  const [username, setUsername] = useState(initialData?.name || '');
  const [avatars, setAvatars] = useState(DEFAULT_AVATARS);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize selectedAvatar after avatars is set
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    if (initialData?.avatar) {
      const foundIndex = DEFAULT_AVATARS.findIndex(a => a.url === initialData.avatar);
      return foundIndex !== -1 ? foundIndex : 0;
    }
    return 0;
  });

  const handleAvatarClick = (id) => {
    setSelectedAvatar(id);
    if (onNoddingChange) {
      onNoddingChange(true);
      setTimeout(() => onNoddingChange(false), 400); // 400ms nod
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const confirmCustomAvatar = () => {
    if (previewImage) {
      const newId = avatars.length;
      const newAvatar = { id: newId, url: previewImage, type: 'custom' };
      setAvatars([...avatars, newAvatar]);
      setSelectedAvatar(newId);
      setPreviewImage(null);
      if (onNoddingChange) {
        onNoddingChange(true);
        setTimeout(() => onNoddingChange(false), 400);
      }
    }
  };

  const cancelCustomAvatar = () => {
    setPreviewImage(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) return;
    if (onLoginStateChange) onLoginStateChange('loading');
    setTimeout(() => {
      // 模拟登录成功，传递访客数据
      if (onLoginStateChange) onLoginStateChange('idle');
      if (onLoginSuccess) {
        const selectedAvatarUrl = avatars.find(a => a.id === selectedAvatar)?.url;
        onLoginSuccess({ name: username, avatar: selectedAvatarUrl });
      }
    }, 1200);
  };

  const handleTyping = (e) => {
    setUsername(e.target.value);
    if (onTypingChange) onTypingChange(true);
  };

  React.useEffect(() => {
    if (!username) return;
    const timeout = setTimeout(() => {
      if (onTypingChange) onTypingChange(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [username, onTypingChange]);

  return (
    <div className="w-full max-w-md mx-auto py-10 px-8 flex flex-col justify-center">
      {/* Avatar Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="flex flex-col items-center bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 w-[320px]"
            >
              <h3 className="text-xl font-black text-slate-800 mb-6">{t('login.preview_avatar')}</h3>
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden shadow-xl mb-8 relative">
                <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-4 w-full">
                <button 
                  type="button"
                  onClick={cancelCustomAvatar}
                  className="flex-1 py-3 px-4 rounded-full border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  {t('login.btn_cancel')}
                </button>
                <button 
                  type="button"
                  onClick={confirmCustomAvatar}
                  className="flex-1 py-3 px-4 rounded-full bg-slate-900 text-white font-bold shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all"
                >
                  {t('login.btn_confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部 Logo */}
      <div className="flex justify-center mb-6 min-h-[32px]">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2.2, duration: 0.3 }}
           className="relative flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-[32px] h-[32px] fill-slate-900">
             <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" />
          </svg>
        </motion.div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">{t('login.welcome')}</h1>
        <p className="text-slate-500 text-sm">{t('login.welcome_sub')}</p>
      </div>

      {/* Avatar Picker Array (4+1 Mode) */}
      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {avatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            whileHover={{ scale: 1.1, translateY: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAvatarClick(avatar.id)}
            className={`relative w-16 h-16 rounded-full flex-shrink-0 transition-all overflow-hidden border-4 ${
              selectedAvatar === avatar.id 
                ? 'border-slate-900 scale-110 shadow-xl' 
                : 'border-slate-100 opacity-70 grayscale-[30%] hover:grayscale-0'
            }`}
          >
            <img src={avatar.url} alt="avatar" className="w-full h-full object-cover" />
            {selectedAvatar === avatar.id && (
              <motion.div 
                layoutId="active-dot"
                className="absolute inset-0 border-2 border-white rounded-full"
              />
            )}
          </motion.button>
        ))}
        
        {/* Custom Upload Button (+) */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current.click()}
          className="w-16 h-16 rounded-full flex-shrink-0 border-4 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:border-slate-400 transition-all bg-slate-50"
        >
          <Plus size={24} />
        </motion.button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileUpload}
        />
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700 ml-1 tracking-wide flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              {t('login.label_username')}
            </label>
          </div>
          <input 
            type="text" 
            value={username}
            placeholder={t('login.placeholder_username')}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[20px] text-slate-900 caret-indigo-600 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold text-lg"
            style={{ 
              cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect x='17' y='6' width='6' height='28' rx='3' fill='%234f46e5' stroke='white' stroke-width='2' filter='drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'/></svg>") 20 20, text`
            }}
            onFocus={() => {
              if (onEmailFocusChange) onEmailFocusChange(true);
              if (onLoginStateChange) onLoginStateChange('idle');
            }}
            onBlur={() => {
              if (onEmailFocusChange) onEmailFocusChange(false);
            }}
            onChange={handleTyping}
          />
        </div>

        <button 
          type="submit"
          disabled={!username}
          className={`w-full font-black py-4 rounded-[20px] transition-all flex items-center justify-center space-x-2 text-lg active:scale-[0.98] active:translate-y-0 ${
            username 
              ? 'bg-slate-900 hover:bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] cursor-pointer' 
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          <span>{t('login.btn_login')}</span>
          <motion.div
            animate={{ x: username ? [0, 5, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.div>
        </button>
      </form>

      <div className="text-center mt-12 text-xs text-slate-400 font-bold uppercase tracking-[2px]">
        {t('login.exclusive')}
      </div>
    </div>
  );
}
