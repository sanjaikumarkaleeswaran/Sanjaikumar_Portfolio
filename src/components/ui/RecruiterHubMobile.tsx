import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileText, Calendar, MessageSquare, X, User } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface RecruiterHubMobileProps {
  setIsAICopilotOpen: (open: boolean) => void;
}

export const RecruiterHubMobile: React.FC<RecruiterHubMobileProps> = ({ setIsAICopilotOpen }) => {
  const { playAudioCue, addNotification, activeWindow } = useOS();
  const [isHudExpanded, setIsHudExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside tap
  useEffect(() => {
    const handleOutsideClick = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsHudExpanded(false);
      }
    };
    if (isHudExpanded) {
      document.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isHudExpanded]);

  // Close on navigation
  useEffect(() => {
    setIsHudExpanded(false);
  }, [activeWindow]);

  // Close on screen orientation or width changes
  useEffect(() => {
    const handleReset = () => {
      setIsHudExpanded(false);
    };
    window.addEventListener('orientationchange', handleReset);
    window.addEventListener('resize', handleReset);
    return () => {
      window.removeEventListener('orientationchange', handleReset);
      window.removeEventListener('resize', handleReset);
    };
  }, []);

  const handleAction = (action: () => void) => {
    playAudioCue('click');
    action();
    setIsHudExpanded(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.75, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 260, 
        damping: 20,
        duration: 0.35 
      } 
    },
    exit: {
      opacity: 0,
      scale: 0.75,
      y: 15,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div ref={containerRef} className="fixed right-5 bottom-[110px] z-[9999] flex flex-col items-center">
      
      {/* Expanded upward menu */}
      <AnimatePresence>
        {isHudExpanded && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-3.5 mb-4 items-center"
          >
            {/* Email */}
            <motion.a 
              variants={itemVariants}
              whileTap={{ scale: 0.9 }}
              href="mailto:sanjaikumarkaleeswarann@gmail.com?subject=Opportunity%20Inquiry"
              onClick={() => handleAction(() => {})}
              className="w-[54px] h-[54px] rounded-full border border-cyber-cyan/40 bg-slate-950/90 text-cyber-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-md cursor-pointer outline-none"
              aria-label="Email recruitment opportunity"
            >
              <Mail size={20} />
            </motion.a>

            {/* Resume */}
            <motion.a 
              variants={itemVariants}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/sanjaikumarkaleeswaran"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleAction(() => addNotification('Downloading Resume from records', 'success'))}
              className="w-[54px] h-[54px] rounded-full border border-cyber-green/40 bg-slate-950/90 text-cyber-green flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.3)] backdrop-blur-md cursor-pointer outline-none"
              aria-label="Download professional resume"
            >
              <FileText size={20} />
            </motion.a>

            {/* Interview */}
            <motion.a 
              variants={itemVariants}
              whileTap={{ scale: 0.9 }}
              href="mailto:sanjaikumarkaleeswarann@gmail.com?subject=Interview%20Scheduling&body=Hi%20Sanjai,%20We%20would%20like%20to%20schedule%20an%20interview..."
              onClick={() => handleAction(() => {})}
              className="w-[54px] h-[54px] rounded-full border border-cyber-magenta/40 bg-slate-950/90 text-cyber-magenta flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.3)] backdrop-blur-md cursor-pointer outline-none"
              aria-label="Schedule interview appointment"
            >
              <Calendar size={20} />
            </motion.a>

            {/* LinkedIn */}
            <motion.a 
              variants={itemVariants}
              whileTap={{ scale: 0.9 }}
              href="https://www.linkedin.com/in/sanjaikumar-kaleeswaran/"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleAction(() => {})}
              className="w-[54px] h-[54px] rounded-full border border-blue-500/40 bg-slate-950/90 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md cursor-pointer outline-none"
              aria-label="Visit LinkedIn profile"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </motion.a>

            {/* GitHub */}
            <motion.a 
              variants={itemVariants}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/sanjaikumarkaleeswaran"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleAction(() => {})}
              className="w-[54px] h-[54px] rounded-full border border-white/20 bg-slate-950/90 text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] backdrop-blur-md cursor-pointer outline-none"
              aria-label="View source code on GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </motion.a>

            {/* AI Assistant Chat */}
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAction(() => setIsAICopilotOpen(true))}
              className="w-[54px] h-[54px] rounded-full border border-cyber-purple/40 bg-slate-950/90 text-cyber-purple flex items-center justify-center shadow-[0_0_15px_rgba(157,78,221,0.3)] backdrop-blur-md cursor-pointer outline-none"
              aria-label="Open AI Copilot Chat"
            >
              <MessageSquare size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular floating main trigger button */}
      <button
        onClick={() => {
          playAudioCue('click');
          setIsHudExpanded(!isHudExpanded);
        }}
        className={`w-14 h-14 rounded-full border border-cyber-purple bg-slate-950/90 text-cyber-purple flex items-center justify-center shadow-[0_0_20px_rgba(157,78,221,0.5)] backdrop-blur-md cursor-pointer active:scale-95 transition-transform duration-300 z-50 outline-none ${
          !isHudExpanded ? 'animate-pulse' : ''
        }`}
        aria-label={isHudExpanded ? "Close recruitment menu" : "Open recruitment options"}
      >
        {isHudExpanded ? <X size={20} /> : <User size={20} />}
      </button>
    </div>
  );
};
