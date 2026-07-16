import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, AlertCircle, CheckCircle, Info, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

// Context & Canvas
import { OSProvider, useOS } from './context/OSContext';
import { Background3D } from './components/canvas/Background3D';

// UI shells
import { Header } from './components/ui/Header';
import { OSDock } from './components/ui/OSDock';
import { OSWindow } from './components/ui/OSWindow';
import { AIAssistant } from './components/ui/AIAssistant';
import { TerminalWindow } from './components/ui/TerminalWindow';
import { CustomCursor } from './components/ui/CustomCursor';
import { CommandPalette } from './components/ui/CommandPalette';
import { DeveloperOverlay } from './components/ui/DeveloperOverlay';

// Content screens
import { HeroDashboard } from './components/sections/HeroDashboard';
import { AboutSpecs } from './components/sections/AboutSpecs';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsExplorer } from './components/sections/ProjectsExplorer';
import { CareerChronology } from './components/sections/CareerChronology';
import { ContactHub } from './components/sections/ContactHub';
import { MetricsDashboard } from './components/sections/MetricsDashboard';

function AppContent() {
  const { 
    theme, 
    notifications, 
    removeNotification, 
    activeWindow, 
    setActiveWindow, 
    playAudioCue,
    addNotification,
    isRecruiterMode,
    setIsRecruiterMode,
    setHasBooted
  } = useOS();

  // OS Window Toggles
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isDevOverlayOpen, setIsDevOverlayOpen] = useState(false);
  
  // Tab alignment inside Dock
  const [activeTab, setActiveTab] = useState<string>('hero');

  // Capture Developer Mode Shortcut (Ctrl + Shift + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDevOverlayOpen(prev => !prev);
        playAudioCue('transform');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playAudioCue]);

  // Boot sequence loader states
  const [isBooting, setIsBooting] = useState(true);
  const [showBootContainer, setShowBootContainer] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Timed Choreographed Boot Sequence
  useEffect(() => {
    if (!isBooting) return;

    // 0ms: solid black screen
    // 600ms: fade in the glow & borders of the boot window
    const t1 = setTimeout(() => {
      setShowBootContainer(true);
    }, 600);

    // 1200ms: Power On sound + log. Progress = 15%
    const t2 = setTimeout(() => {
      playAudioCue('boot-poweron');
      setBootProgress(15);
      setBootLogs(prev => [...prev, 'SYSTEM POWER: ONLINE [100%]']);
    }, 1200);

    // 2000ms: System Initializing + log. Progress = 35%
    const t3 = setTimeout(() => {
      playAudioCue('boot-init');
      setBootProgress(35);
      setBootLogs(prev => [...prev, 'BOOT INITIALIZATION: VERIFYING INTEGRITY...']);
    }, 2000);

    // 2800ms: AI Core Loading + log. Progress = 55%
    const t4 = setTimeout(() => {
      playAudioCue('boot-loading');
      setBootProgress(55);
      setBootLogs(prev => [...prev, 'AI CORE ONLINE: LOADING DEEPMIND DIALOG MODELS...']);
    }, 2800);

    // 3600ms: Satellite orbit connection + log. Progress = 75%
    const t5 = setTimeout(() => {
      playAudioCue('boot-init');
      setBootProgress(75);
      setBootLogs(prev => [...prev, 'NEURAL NETWORK CONNECTED: TECH GALAXY ORBITS STABLE...']);
    }, 3600);

    // 4400ms: Mission Control Online + log. Progress = 90%
    const t6 = setTimeout(() => {
      playAudioCue('boot-online');
      setBootProgress(90);
      setBootLogs(prev => [...prev, 'MISSION CONTROL READY: DISPATCHING CENTRAL HUD STREAMS...']);
    }, 4400);

    // 5200ms: Success chime + completion log. Progress = 100%
    const t7 = setTimeout(() => {
      playAudioCue('boot-success');
      setBootProgress(100);
      setBootLogs(prev => [...prev, 'SYSTEM READY. INTERFACE BOOT SUCCESS.']);
    }, 5200);

    // 6000ms: Transition to workspace
    const t8 = setTimeout(() => {
      setIsBooting(false);
      setHasBooted(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
    };
  }, [isBooting, playAudioCue, setHasBooted]);

  // Synchronize ActiveTab with ActiveWindow
  useEffect(() => {
    if (activeWindow) {
      setActiveTab(activeWindow);
    }
  }, [activeWindow]);

  // Play tab change window sounds
  useEffect(() => {
    if (isBooting) return;
    if (activeTab && activeTab !== 'hero') {
      playAudioCue('open');
    } else if (activeTab === 'hero') {
      playAudioCue('shutdown');
    }
  }, [activeTab, isBooting]);

  // Play terminal window sounds
  useEffect(() => {
    if (isBooting) return;
    if (isTerminalOpen) {
      playAudioCue('open');
    } else {
      playAudioCue('shutdown');
    }
  }, [isTerminalOpen, isBooting]);

  // Play copilot window sounds
  useEffect(() => {
    if (isBooting) return;
    if (isAICopilotOpen) {
      playAudioCue('open');
    } else {
      playAudioCue('shutdown');
    }
  }, [isAICopilotOpen, isBooting]);

  // Konami Code Event Listener Easter Egg
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          playAudioCue('boot-success');
          confetti({
            particleCount: 220,
            spread: 120,
            colors: ['#00f0ff', '#ff007f', '#39ff14', '#9d4edd']
          });
          addNotification('🔓 DEVELOPER_MODE OVERRIDE: Guest node upgraded to ROOT ACCESS!', 'success');
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNotification, playAudioCue]);

  return (
    <div className={`min-h-screen text-slate-100 font-sans relative overflow-x-hidden ${
      theme === 'matrix' ? 'selection:bg-cyber-green selection:text-black' : 'selection:bg-cyber-cyan selection:text-black'
    }`}>
      {/* 3D Space grids background */}
      <Background3D />

      {/* CRT scanline filters */}
      <div className="fixed inset-0 crt-overlay z-[99999] pointer-events-none opacity-20" />

      {/* Custom Cursor Pointer */}
      <CustomCursor />

      {/* BIOS System Boot Loader Overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#02000a] z-[99999] flex items-center justify-center p-4 font-mono select-none"
          >
            {/* Ambient radial glow that pulses during boot */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: showBootContainer ? [0.3, 0.6, 0.3] : 0, scale: showBootContainer ? 1 : 0.5 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(0,240,255,0.08) 0%, transparent 70%)' }}
              />
            </div>

            <AnimatePresence>
              {showBootContainer && (
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[580px] border border-cyber-cyan/30 rounded-2xl p-6 bg-black/90 backdrop-blur-xl shadow-[0_0_80px_rgba(0,240,255,0.12),0_0_0_1px_rgba(0,240,255,0.05)] flex flex-col justify-between h-[400px] relative overflow-hidden"
                >
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyber-cyan/40 rounded-tl-2xl pointer-events-none" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-cyan/40 rounded-tr-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyber-purple/30 rounded-bl-2xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-purple/30 rounded-br-2xl pointer-events-none" />

                  <div className="flex items-center gap-3 text-cyber-cyan border-b border-white/10 pb-3">
                    <Cpu className="animate-spin text-cyber-cyan" size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">BIOS_NEURAL_BOOTLOADER_v2.0</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                      <span className="text-[8px] text-cyber-green uppercase tracking-widest">LIVE</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto my-4 text-[9px] text-slate-500 space-y-2 custom-scroll pr-1">
                    <div className="text-slate-600">[SYSTEM] Initiating neural bootstrap sequence...</div>
                    {bootLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-cyber-green font-bold flex items-center gap-2"
                      >
                        <span className="text-cyber-cyan opacity-60">›</span> {log}
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[9px] text-cyber-cyan/70 uppercase tracking-widest">
                      <span>QUANTUM CORE INITIALIZATION</span>
                      <span className="font-bold text-cyber-cyan tabular-nums">{bootProgress}%</span>
                    </div>
                    <div className="h-1 bg-slate-900/80 border border-white/5 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${bootProgress}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta shadow-[0_0_12px_rgba(0,240,255,0.7)]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Header status bar */}
      <Header />

      {/* Global Command palette search (Ctrl+K) */}
      <CommandPalette 
        setIsTerminalOpen={setIsTerminalOpen}
        setIsAICopilotOpen={setIsAICopilotOpen}
        setActiveTab={setActiveTab}
      />

      {/* Interactive Floating Notifications Drawer */}
      <div className="fixed top-18 right-6 z-[9999] flex flex-col gap-3 max-w-[320px] pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              onClick={() => removeNotification(n.id)}
              className="p-3.5 border rounded-xl bg-black/90 backdrop-blur-md flex items-start gap-3 shadow-lg pointer-events-auto cursor-pointer"
              style={{
                borderColor: n.type === 'success' ? 'rgba(57,255,20,0.3)' : n.type === 'warning' ? 'rgba(234,179,8,0.3)' : 'rgba(0,240,255,0.3)'
              }}
            >
              {n.type === 'success' && <CheckCircle size={14} className="text-cyber-green shrink-0 mt-0.5" />}
              {n.type === 'warning' && <AlertCircle size={14} className="text-yellow-500 shrink-0 mt-0.5" />}
              {n.type === 'info' && <Info size={14} className="text-cyber-cyan shrink-0 mt-0.5" />}
              
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">OS SYSTEM NOTIFY</span>
                <span className="font-mono text-[10px] text-slate-200 leading-normal">{n.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CENTRAL CLIENT WORKSPACE */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
        
        {/* Floating Core Application windows stack */}
        <AnimatePresence mode="wait">
          {isRecruiterMode ? (
            <motion.div
              key="recruiter-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full space-y-16 pb-20 font-mono"
            >
              {/* Recruiter Header profile brief */}
              <div className="p-8 border border-cyber-purple/20 rounded-2xl bg-slate-950/75 backdrop-blur-xl relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 p-4 text-[8px] text-cyber-purple uppercase tracking-widest font-bold">
                  [RECRUITER_MODE_ACTIVE]
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    SANJAIKUMAR P K
                  </h1>
                  <p className="text-cyber-cyan text-xs tracking-wider font-semibold">
                    FULL STACK & AI WEB ARCHITECT // COIMBATORE, TN
                  </p>
                </div>
                <p className="text-slate-300 text-xs md:text-sm max-w-[750px] leading-relaxed font-sans">
                  B.Sc. Software Systems graduate (2025) from Kongu Engineering College with 8.05 CGPA. Specialized in full-stack architecture, building immersive, context-aware web tools, and containerized scale. Experienced with React, TypeScript, Python, Docker, and WebGL visualizations.
                </p>
                <div className="flex flex-wrap gap-4 pt-1">
                  <button
                    onClick={() => {
                      playAudioCue('click');
                      window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
                      addNotification('Initiating CV Resume download stream', 'success');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyber-green text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                  >
                    <FileText size={14} />
                    <span>DOWNLOAD RESUME CV</span>
                  </button>
                  <button
                    onClick={() => {
                      playAudioCue('click');
                      setIsRecruiterMode(false);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-cyber-cyan/50 text-slate-300 hover:text-white text-xs cursor-pointer transition-all"
                  >
                    <span>RETURN TO SYSTEM OS</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-cyber-cyan">#</span> 01 // SELECTED ENGINEERING PROJECTS
                </h2>
                <ProjectsExplorer />
              </div>

              {/* Technical Capabilities Matrix */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-cyber-purple">#</span> 02 // TECHNICAL CAPABILITIES MATRIX
                </h2>
                <div className="p-6 border border-white/5 rounded-2xl bg-slate-950/40 backdrop-blur-md">
                  <SkillsSection />
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-cyber-magenta">#</span> 03 // PROFESSIONAL CHRONOLOGY
                </h2>
                <CareerChronology />
              </div>

              {/* Contact Hub */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-cyber-green">#</span> 04 // RECRUITMENT TRANSMIT NODE
                </h2>
                <ContactHub />
              </div>
            </motion.div>
          ) : (
            <>
              {activeTab === 'hero' && (
                <motion.div
                  key="hero-dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full"
                >
                  <HeroDashboard 
                    setIsTerminalOpen={setIsTerminalOpen}
                    setActiveTab={setActiveTab}
                  />
                </motion.div>
              )}

              {activeTab === 'about' && (
                <OSWindow
                  key="window-about"
                  id="about"
                  title="bio_specs_registry.txt"
                  isOpen={true}
                  onClose={() => setActiveWindow('hero')}
                >
                  <AboutSpecs />
                </OSWindow>
              )}

              {activeTab === 'skills' && (
                <OSWindow
                  key="window-skills"
                  id="skills"
                  title="technical_capabilities_planetarium.exe"
                  isOpen={true}
                  widthClass="max-w-[1000px]"
                  onClose={() => setActiveWindow('hero')}
                >
                  <SkillsSection />
                </OSWindow>
              )}

              {activeTab === 'projects' && (
                <OSWindow
                  key="window-projects"
                  id="projects"
                  title="software_artistry_registry.db"
                  isOpen={true}
                  onClose={() => setActiveWindow('hero')}
                >
                  <ProjectsExplorer />
                </OSWindow>
              )}


              {activeTab === 'metrics' && (
                <OSWindow
                  key="window-metrics"
                  id="metrics"
                  title="engineering_performance_metrics.sh"
                  isOpen={true}
                  widthClass="max-w-[700px]"
                  onClose={() => setActiveWindow('hero')}
                >
                  <MetricsDashboard />
                </OSWindow>
              )}

              {activeTab === 'timeline' && (
                <OSWindow
                  key="window-timeline"
                  id="timeline"
                  title="academic_chronology_timeline.sys"
                  isOpen={true}
                  onClose={() => setActiveWindow('hero')}
                >
                  <CareerChronology />
                </OSWindow>
              )}

              {activeTab === 'contact' && (
                <OSWindow
                  key="window-contact"
                  id="contact"
                  title="contact_directive_transmit.cfg"
                  isOpen={true}
                  onClose={() => setActiveWindow('hero')}
                >
                  <ContactHub />
                </OSWindow>
              )}
            </>
          )}
        </AnimatePresence>

        {/* SIDE UTILITIES: FLOATING SHELLS */}
        
        {/* Terminal Window widget */}
        <AnimatePresence>
          {isTerminalOpen && (
            <div className="fixed top-24 left-6 z-40 w-full max-w-[360px] hidden xl:block pointer-events-auto">
              <OSWindow
                id="terminal"
                title="terminal_shell.sh"
                isOpen={isTerminalOpen}
                onClose={() => setIsTerminalOpen(false)}
                widthClass="max-w-[360px]"
                heightClass="h-[380px]"
              >
                <TerminalWindow />
              </OSWindow>
            </div>
          )}
        </AnimatePresence>

        {/* AI Copilot Window widget */}
        <AnimatePresence>
          {isAICopilotOpen && (
            <div className="fixed top-24 right-6 z-40 w-full max-w-[360px] hidden xl:block pointer-events-auto">
              <OSWindow
                id="copilot"
                title="neural_copilot.ai"
                isOpen={isAICopilotOpen}
                onClose={() => setIsAICopilotOpen(false)}
                widthClass="max-w-[360px]"
                heightClass="h-[380px]"
              >
                <AIAssistant />
              </OSWindow>
            </div>
          )}
        </AnimatePresence>

        {/* Developer Diagnostics Overlay */}
        <AnimatePresence>
          {isDevOverlayOpen && <DeveloperOverlay />}
        </AnimatePresence>

      </main>

      {/* Bottom magnetic OS navigation dock */}
      <OSDock 
        isTerminalOpen={isTerminalOpen}
        setIsTerminalOpen={setIsTerminalOpen}
        isAICopilotOpen={isAICopilotOpen}
        setIsAICopilotOpen={setIsAICopilotOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <AppContent />
    </OSProvider>
  );
}
