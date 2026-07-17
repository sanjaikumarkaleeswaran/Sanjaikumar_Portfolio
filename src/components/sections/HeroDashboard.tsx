import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Globe, Clock, FileText, UserCheck, MapPin, Award, BookOpen, MessageSquare, ArrowDown } from 'lucide-react';
import { useOS } from '../../context/OSContext';

// Lazy-load the heavy 3D hologram only when hero is visible
const HologramCore = lazy(() => import('../canvas/HologramCore').then(m => ({ default: m.HologramCore })));

export const HeroDashboard: React.FC<{
  setIsTerminalOpen: (open: boolean) => void;
  setActiveTab: (tab: any) => void;
  setIsAICopilotOpen: (open: boolean) => void;
}> = (props) => {
  const { setIsTerminalOpen, setActiveTab } = props;
  const { 
    playAudioCue, 
    isRecruiterMode, 
    setIsRecruiterMode,
    addNotification,
    isTourActive,
    setIsTourActive,
    setTourStep,
    setIsTourPaused
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 font-mono">
      
      {/* Left side: Mission Control Grid & Info (60% width) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Connection status HUD */}
        <div className="flex flex-wrap gap-2.5">
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

        {/* Big cinematic headlines */}
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase font-sans"
          >
            SANJAIKUMAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta">P K</span>
          </motion.h1>

          <div className="h-6 text-xs md:text-sm font-semibold tracking-wider text-cyber-cyan flex items-center">
            <span>{headlineText}</span>
            <span className="h-4 w-1.5 bg-cyber-cyan ml-1 animate-pulse" />
          </div>
        </div>

        {/* Quick Biographical Specs Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] text-slate-400"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-slate-950/40">
            <MapPin size={12} className="text-cyber-cyan shrink-0" />
            <span><strong>Location:</strong> Coimbatore, TN, India</span>
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
          className="p-4.5 border border-white/5 rounded-xl bg-slate-950/50 backdrop-blur-md space-y-3"
        >
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            B.Sc. Software Systems graduate (5-Year integrated track) from Kongu Engineering College. I specialize in building end-to-end full-stack architectures, context-aware AI tools (RAG pipelines, vector semantic matching), and Docker-orchestrated cloud systems.
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

        {/* Dynamic Engineering Stats Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 border border-white/5 rounded-xl bg-slate-950/40 backdrop-blur-md space-y-3"
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
              <div className="text-cyber-magenta font-bold text-xs">5 Yrs</div>
              <div className="text-[7.5px] text-slate-500 uppercase tracking-tight">Learning Track</div>
            </div>
          </div>
        </motion.div>

        {/* Command Controls CTAs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 pt-1"
        >
          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-3">
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
              className="px-4 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-cyan hover:to-cyber-magenta text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102 shadow-lg shadow-cyber-cyan/10"
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
              className="px-4 py-2 border border-white/10 hover:border-cyber-green/50 bg-white/5 text-slate-300 hover:text-white text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <FileText size={13} className="text-cyber-green" />
              <span>DOWNLOAD RESUME</span>
            </button>

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
              className="px-4 py-2 border border-white/10 hover:border-cyber-magenta/50 bg-white/5 text-slate-300 hover:text-white text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <MessageSquare size={13} className="text-cyber-magenta" />
              <span>CONTACT ME</span>
            </button>

            <button
              onClick={() => {
                playAudioCue('click');
                window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
              }}
              className="px-4 py-2 border border-white/10 hover:border-slate-400 bg-white/5 text-slate-300 hover:text-white text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GITHUB</span>
            </button>
          </div>

          {/* Secondary Action HUD Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1 text-[10px]">
            <button
              onClick={() => {
                playAudioCue('click');
                setIsRecruiterMode(!isRecruiterMode);
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isRecruiterMode 
                  ? 'border-cyber-purple bg-cyber-purple/20 text-white' 
                  : 'border-white/10 hover:border-cyber-purple/50 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck size={12} className={isRecruiterMode ? 'animate-pulse text-cyber-purple' : ''} />
              <span>RECRUITER MODE</span>
            </button>

            <button
              onClick={() => {
                playAudioCue('click');
                setIsTerminalOpen(true);
              }}
              className="px-3 py-1.5 border border-white/10 hover:border-cyber-cyan bg-white/5 text-slate-400 hover:text-white rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Terminal size={12} className="text-cyber-cyan" />
              <span>OPEN TERMINAL</span>
            </button>

            <button
              onClick={() => {
                playAudioCue('click');
                setTourStep(0);
                setIsTourPaused(false);
                setIsTourActive(true);
                addNotification('Guided tour initiated. Welcome!', 'success');
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
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

      </div>

      {/* Right side: 3D Quantum Hologram Core (40% width) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="lg:col-span-5 relative flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-slate-950/20 p-4 h-[350px] lg:h-[420px] overflow-hidden"
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

    </div>
  );
};
