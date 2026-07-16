import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface OSWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
  heightClass?: string;
}

export const OSWindow: React.FC<OSWindowProps> = ({
  id,
  title,
  isOpen,
  onClose,
  children,
  widthClass = 'max-w-[800px]',
  heightClass = 'min-h-[400px] max-h-[650px]'
}) => {
  const { playAudioCue } = useOS();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, y: 15, filter: 'blur(8px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`w-full ${widthClass} ${heightClass} border border-white/10 rounded-2xl bg-black/75 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-30`}
    >
      {/* OS Window Title Bar */}
      <div 
        className="bg-slate-900/50 px-4 py-3 border-b border-white/5 flex items-center justify-between select-none cursor-default"
        onMouseEnter={() => playAudioCue('hover')}
      >
        <div className="flex items-center gap-2">
          {/* OS-style dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <button 
              onClick={() => {
                playAudioCue('click');
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40 hover:bg-red-500 flex items-center justify-center transition-all group"
              title="Close"
            >
              <X size={8} className="text-transparent group-hover:text-black font-bold" />
            </button>
            <button 
              onClick={() => {
                playAudioCue('click');
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40 hover:bg-yellow-500 flex items-center justify-center transition-all group"
              title="Minimize"
            >
              <Minus size={8} className="text-transparent group-hover:text-black font-bold" />
            </button>
            <div className="w-3 h-3 rounded-full bg-green-500/10 border border-green-500/20" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-wider text-slate-300">{title}</span>
        </div>

        {/* Decorative corner lines / telemetry */}
        <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest hidden sm:block">
          SYS_WINDOW::{id.toUpperCase()} // DECRYPTED_ACCESS
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scroll">
        {children}
      </div>
    </motion.div>
  );
};
