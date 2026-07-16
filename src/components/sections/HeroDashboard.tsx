import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Cpu } from 'lucide-react';
import { HologramCore } from '../canvas/HologramCore';
import { useOS } from '../../context/OSContext';

export const HeroDashboard: React.FC<{
  setIsTerminalOpen: (open: boolean) => void;
  setActiveTab: (tab: any) => void;
}> = ({
  setIsTerminalOpen,
  setActiveTab
}) => {
  const { playAudioCue, setActiveWindow } = useOS();
  const [headlineText, setHeadlineText] = useState('');
  const fullHeadline = 'FULL STACK & AI WEB ARCHITECT';

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setHeadlineText(fullHeadline.substring(0, index));
      index++;
      if (index > fullHeadline.length) {
        clearInterval(timer);
      }
    }, 85);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
      
      {/* Left side: HUD text profile info */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Connection status tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan font-mono text-[9px] uppercase tracking-widest"
        >
          <Cpu className="animate-spin text-cyber-cyan" size={10} />
          <span>SYS_CONNECTION_SECURE // ACC_GRNTD</span>
        </motion.div>

        {/* Big cinematic headlines */}
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white font-mono uppercase"
          >
            SANJAIKUMAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta">P K</span>
          </motion.h1>

          <div className="h-6 font-mono text-xs md:text-sm font-semibold tracking-wider text-cyber-cyan flex items-center">
            <span>{headlineText}</span>
            <span className="h-4 w-1.5 bg-cyber-cyan ml-1 animate-pulse" />
          </div>
        </div>

        {/* Profile summary bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs md:text-sm text-slate-400 max-w-[550px] leading-relaxed"
        >
          B.Sc. Software Systems graduate (2025, CGPA 8.05/10) from Kongu Engineering College. 
          Specialized in building context-aware UI/UX flows and robust full-stack software applications (React, TS, Python). 
          Passionate about deep-tech innovation, agentic AI, and scaling intelligent products from concept to containerized deployment.
        </motion.p>

        {/* Grid of quick OS stats cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'GPA RATING', val: '8.05 / 10' },
            { label: 'CORE DEPLOYS', val: '4+ Projects' },
            { label: 'WORKFLOW', val: 'Agile SDLC' },
            { label: 'CONTAINERS', val: 'Dockerized' }
          ].map((stat, i) => (
            <div key={i} className="p-3 border border-white/5 rounded-xl bg-slate-950/40 backdrop-blur-md">
              <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</div>
              <div className="text-xs font-mono text-slate-200 mt-1 font-bold">{stat.val}</div>
            </div>
          ))}
        </motion.div>

        {/* Interactive action launchers */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 pt-2"
        >
          {/* Main CTA: specs dashboard */}
          <button
            onClick={() => {
              playAudioCue('click');
              setActiveWindow('about');
              setActiveTab('about');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-cyan hover:to-cyber-magenta text-slate-950 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyber-cyan/20 transition-all hover:scale-102"
          >
            <span>DECRYPT SYSTEM SPECS</span>
            <ArrowRight size={14} />
          </button>

          {/* Sub CTA: terminal launcher */}
          <button
            onClick={() => {
              playAudioCue('click');
              setIsTerminalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-cyber-cyan/50 bg-white/5 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-all hover:bg-slate-900/60"
          >
            <Terminal size={14} className="text-cyber-cyan" />
            <span>INITIALIZE BASH SHELL</span>
          </button>
        </motion.div>

      </div>

      {/* Right side: 3D Hologram core */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="lg:col-span-5 h-[350px] lg:h-[450px]"
      >
        <HologramCore />
      </motion.div>

    </div>
  );
};
