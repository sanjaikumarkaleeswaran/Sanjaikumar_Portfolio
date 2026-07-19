import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Clock, FileText, MapPin, Award, BookOpen, Mail, ArrowDown } from 'lucide-react';
import { useOS } from '../../context/OSContext';

// Lazy-load the heavy 3D hologram only when hero is visible
const HologramCore = lazy(() => import('../canvas/HologramCore').then(m => ({ default: m.HologramCore })));

export const HeroDashboard: React.FC<{
  setIsTerminalOpen: (open: boolean) => void;
  setActiveTab: (tab: any) => void;
  setIsAICopilotOpen: (open: boolean) => void;
}> = (props) => {
  const { setActiveTab } = props;
  const { 
    playAudioCue, 
    addNotification,
    isTourActive,
    setIsTourActive
  } = useOS();

  const [headlineText, setHeadlineText] = useState('');
  const fullHeadline = 'AI ENGINEER & FULL STACK DEVELOPER';

  // Live telemetry fluctuating states
  const [timeString, setTimeString] = useState('00:00:00');

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setHeadlineText(fullHeadline.substring(0, index));
      index++;
      if (index > fullHeadline.length) {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  // Ticking Clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center py-6 font-mono">
      
      {/* 1. AI Avatar (Hologram Core) - order-1 on mobile/tablet, order-2/col-span-5 on desktop */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="order-1 lg:order-2 lg:col-span-5 relative flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-slate-950/20 p-4 h-[300px] sm:h-[350px] lg:h-[420px] overflow-hidden w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none mx-auto"
      >
        {/* Decorative corner brackets */}
        <div className="absolute top-3 left-3 text-[8px] text-cyber-cyan font-bold select-none">[NEURAL_CORE_V5]</div>
        <div className="absolute top-3 right-3 text-[8px] text-slate-500 font-bold select-none">SYNC_60FPS</div>
        <div className="absolute bottom-3 left-3 text-[8px] text-slate-500 font-bold select-none">MODEL: TF-IDF_RAG</div>
        <div className="absolute bottom-3 right-3 text-[8px] text-cyber-magenta font-bold select-none">WEBGL_ACTIVE</div>

        {/* 3D Hologram core */}
        <div className="w-full h-full">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
            </div>
          }>
            <HologramCore />
          </Suspense>
        </div>
      </motion.div>

      {/* 2. Main Content Wrapper - order-2 on mobile/tablet, order-1/col-span-7 on desktop */}
      <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left space-y-6 w-full">
        
        {/* Name and Role block (order-1 inside wrapper) */}
        <div className="space-y-1 order-1 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-[52px] lg:text-[72px] leading-tight font-bold tracking-tight text-white uppercase font-sans break-keep select-none whitespace-nowrap sm:whitespace-normal"
          >
            SANJAIKUMAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta">P K</span>
          </motion.h1>

          <div className="h-6 text-xs md:text-sm font-semibold tracking-wider text-cyber-cyan flex items-center justify-center lg:justify-start">
            <span>{headlineText}</span>
            <span className="h-4 w-1.5 bg-cyber-cyan ml-1 animate-pulse" />
          </div>
        </div>

        {/* Connection/Current Status HUD (order-2 inside wrapper) */}
        <div className="flex flex-wrap gap-2.5 order-2 w-full justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyber-cyan/35 bg-cyber-cyan/5 text-cyber-cyan text-[8.5px] uppercase tracking-widest"
          >
            <Cpu className="animate-spin text-cyber-cyan" size={10} />
            <span>SYS_CONNECTION_SECURE // PORT_5185</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyber-green/35 bg-cyber-green/5 text-cyber-green text-[8.5px] uppercase tracking-widest"
          >
            <Globe className="text-cyber-green" size={10} />
            <span>ONLINE // LIVE_RETRIEVAL</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyber-purple/35 bg-cyber-purple/5 text-cyber-purple text-[8.5px] uppercase tracking-widest"
          >
            <Clock size={10} />
            <span>LOCAL: {timeString}</span>
          </motion.div>
        </div>

        {/* Quick Biographical Specs & About Intro (order-3 inside wrapper) */}
        <div className="order-3 w-full space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] text-slate-400 text-left"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-slate-950/40">
              <MapPin size={12} className="text-cyber-cyan shrink-0" />
              <span><strong>Location:</strong> Tiruppur, TN, India</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-slate-950/40">
              <Award size={12} className="text-cyber-purple shrink-0" />
              <span><strong>Experience:</strong> Graduate Software Engineer</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-slate-950/40 sm:col-span-2">
              <BookOpen size={12} className="text-cyber-green shrink-0" />
              <span><strong>Education:</strong> B.Sc. Software Systems, Kongu Engineering College</span>
            </div>
          </motion.div>

          {/* Short introduction & specs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="p-4.5 border border-white/5 rounded-xl bg-slate-950/50 backdrop-blur-md space-y-3 text-left"
          >
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              B.Sc. Software Systems graduate (3-Year course) from Kongu Engineering College. I specialize in building end-to-end full-stack architectures, context-aware AI tools (RAG pipelines, vector semantic matching), and Docker-orchestrated cloud systems.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-[9.5px]">
              <div>
                <span className="text-cyber-cyan font-bold block uppercase tracking-widest">// CURRENT MISSION</span>
                <span className="text-slate-300 font-sans">Building AI-powered software systems</span>
              </div>
              <div>
                <span className="text-cyber-purple font-bold block uppercase tracking-widest">// SPECIALIZATION</span>
                <span className="text-slate-300 font-sans">React, TypeScript, Python, Node.js, Docker, MongoDB, RAG, Cloud</span>
              </div>
              <div>
                <span className="text-cyber-magenta font-bold block uppercase tracking-widest">// CURRENT LEARNING</span>
                <span className="text-slate-300 font-sans">AWS, Data Engineering</span>
              </div>
              <div>
                <span className="text-cyber-green font-bold block uppercase tracking-widest">// TARGET ROLE</span>
                <span className="text-slate-300">Open for Full-Time Roles (Available Immediately)</span>
              </div>
              <div className="col-span-2 border-t border-white/5 pt-1.5 flex justify-between items-center text-[9.5px]">
                <span className="text-slate-400 font-bold uppercase tracking-widest">// LATEST ACTIVE DEPLOYMENT</span>
                <span className="text-cyber-cyan font-bold font-mono">MindWave AI Hub &rarr; Active</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Command Controls CTAs (order-4 inside wrapper) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 pt-1 order-4 w-full"
        >
          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center lg:justify-start">
            <button
              onClick={() => {
                playAudioCue('click');
                const projectsNode = document.getElementById('featured-projects-section');
                if (projectsNode) {
                  projectsNode.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('projects');
                }
              }}
              className="h-12 w-full sm:w-auto px-6 bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-cyan hover:to-cyber-magenta text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102 shadow-lg shadow-cyber-cyan/10"
            >
              <ArrowDown size={13} className="animate-bounce" />
              <span>VIEW PROJECTS</span>
            </button>

            <button
              onClick={() => {
                playAudioCue('click');
                window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
                addNotification('Initiating resume download stream', 'success');
              }}
              className="h-12 w-full sm:w-auto px-6 border border-white/10 hover:border-cyber-green/50 bg-white/5 text-slate-300 hover:text-white text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <FileText size={13} className="text-cyber-green" />
              <span>DOWNLOAD RESUME</span>
            </button>
          </div>

          {/* Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1 text-[10px] w-full justify-center lg:justify-start">
            <button
              onClick={() => {
                playAudioCue('click');
                const contactNode = document.getElementById('contact-section');
                if (contactNode) {
                  contactNode.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('contact');
                }
              }}
              className="h-11 w-full sm:w-auto px-4 border border-white/10 hover:border-cyber-purple/50 bg-white/5 text-slate-400 hover:text-white rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Mail size={12} className="text-cyber-purple" />
              <span>CONTACT ME</span>
            </button>

            <button
              onClick={() => {
                playAudioCue('click');
                setIsTourActive(true);
                addNotification('Guided tour initiated. Welcome!', 'success');
              }}
              className={`h-11 w-full sm:w-auto px-4 rounded-lg border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                isTourActive 
                  ? 'border-cyber-cyan bg-cyber-cyan/20 text-white animate-pulse' 
                  : 'border-white/10 hover:border-cyber-cyan/50 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Globe size={12} className={isTourActive ? 'animate-spin text-cyber-cyan' : 'text-cyber-cyan'} />
              <span>START TOUR</span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic Engineering Stats Panel / Metrics (order-5 inside wrapper) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 border border-white/5 rounded-xl bg-slate-950/40 backdrop-blur-md space-y-3 order-5 w-full text-left"
        >
          <div className="text-[8.5px] text-slate-500 uppercase tracking-widest flex justify-between">
            <span>Engineering Performance Specifications</span>
            <span className="text-cyber-cyan animate-pulse">Lighthouse: 98/100</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-2 border border-white/5 bg-black/40 rounded-lg">
              <div className="text-white font-bold text-xs">4</div>
              <div className="text-[7.5px] text-slate-500 uppercase tracking-tight">Prod Builds</div>
            </div>
            <div className="p-2 border border-white/5 bg-black/40 rounded-lg">
              <div className="text-cyber-cyan font-bold text-xs">20+</div>
              <div className="text-[7.5px] text-slate-500 uppercase tracking-tight">Tech Stacks</div>
            </div>
            <div className="p-2 border border-white/5 bg-black/40 rounded-lg">
              <div className="text-cyber-purple font-bold text-xs">150+</div>
              <div className="text-[7.5px] text-slate-500 uppercase tracking-tight">GitHub Commits</div>
            </div>
            <div className="p-2 border border-white/5 bg-black/40 rounded-lg">
              <div className="text-cyber-green font-bold text-xs">8.05</div>
              <div className="text-[7.5px] text-slate-500 uppercase tracking-tight">College CGPA</div>
            </div>
            <div className="p-2 border border-white/5 bg-black/40 rounded-lg col-span-2 sm:col-span-1">
              <div className="text-cyber-magenta font-bold text-xs">3 Yrs</div>
              <div className="text-[7.5px] text-slate-500 uppercase tracking-tight">Degree Course</div>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
};
