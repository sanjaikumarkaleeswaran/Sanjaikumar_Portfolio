import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Cpu, AlertCircle, CheckCircle, Info, FileText, Mail, Calendar, MessageSquare } from 'lucide-react';

// Context (always needed)
import { OSProvider, useOS } from './context/OSContext';

// Lightweight UI shells — load immediately
import { Header } from './components/ui/Header';
import { OSDock } from './components/ui/OSDock';
import { OSWindow } from './components/ui/OSWindow';
import { CustomCursor } from './components/ui/CustomCursor';
import { CommandPalette } from './components/ui/CommandPalette';

// Heavy components — lazy loaded to split into async chunks
const Background3D     = lazy(() => import('./components/canvas/Background3D').then(m => ({ default: m.Background3D })));
const AIAssistant      = lazy(() => import('./components/ui/AIAssistant').then(m => ({ default: m.AIAssistant })));
const TerminalWindow   = lazy(() => import('./components/ui/TerminalWindow').then(m => ({ default: m.TerminalWindow })));
const DeveloperOverlay = lazy(() => import('./components/ui/DeveloperOverlay').then(m => ({ default: m.DeveloperOverlay })));
const HeroDashboard    = lazy(() => import('./components/sections/HeroDashboard').then(m => ({ default: m.HeroDashboard })));
const AboutSpecs       = lazy(() => import('./components/sections/AboutSpecs').then(m => ({ default: m.AboutSpecs })));
const SkillsSection    = lazy(() => import('./components/sections/SkillsSection').then(m => ({ default: m.SkillsSection })));
const ProjectsExplorer = lazy(() => import('./components/sections/ProjectsExplorer').then(m => ({ default: m.ProjectsExplorer })));
const CareerChronology = lazy(() => import('./components/sections/CareerChronology').then(m => ({ default: m.CareerChronology })));
const ContactHub       = lazy(() => import('./components/sections/ContactHub').then(m => ({ default: m.ContactHub })));
const MetricsDashboard = lazy(() => import('./components/sections/MetricsDashboard').then(m => ({ default: m.MetricsDashboard })));
const ResumeOptimizer  = lazy(() => import('./components/sections/ResumeOptimizer').then(m => ({ default: m.ResumeOptimizer })));

// Lazy-load confetti only when needed (boot success / konami)
const loadConfetti = () => import('canvas-confetti').then(m => m.default);

// Minimal fallback for Suspense boundaries
const SuspenseFallback = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[200px]">
    <div className="w-4 h-4 border-2 border-cyber-cyan/40 border-t-cyber-cyan rounded-full animate-spin" />
  </div>
);

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

  // Staged loading: 0=booting, 1=post-boot UI, 2=background3D, 3=everything
  const [loadStage, setLoadStage] = useState(() => {
    const sessionBooted = sessionStorage.getItem('sanjai_os_booted');
    return sessionBooted ? 3 : 0;
  });

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
  const [isBooting, setIsBooting] = useState(() => {
    const sessionBooted = sessionStorage.getItem('sanjai_os_booted');
    return !sessionBooted;
  });
  const [showBootContainer, setShowBootContainer] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  const bootTimeoutsRef = useRef<number[]>([]);

  // Skip boot function
  const skipBoot = useCallback(async () => {
    bootTimeoutsRef.current.forEach(clearTimeout);
    bootTimeoutsRef.current = [];
    setIsBooting(false);
    setHasBooted(true);
    setLoadStage(3); // direct to stage 3
    sessionStorage.setItem('sanjai_os_booted', 'true');
    try {
      const confetti = await loadConfetti();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      console.warn('Confetti load failed', e);
    }
  }, [setHasBooted]);

  // If session already booted, mark in context immediately
  useEffect(() => {
    const sessionBooted = sessionStorage.getItem('sanjai_os_booted');
    if (sessionBooted) {
      setHasBooted(true);
    }
  }, [setHasBooted]);

  // Keyboard listener for Escape during booting
  useEffect(() => {
    if (!isBooting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        skipBoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBooting, skipBoot]);

  // Timed Choreographed Boot Sequence
  useEffect(() => {
    if (!isBooting) return;

    // 0ms: solid black screen
    // 200ms: fade in the glow & borders of the boot window
    const t1 = window.setTimeout(() => {
      setShowBootContainer(true);
    }, 200);

    // 500ms: Power On sound + log. Progress = 15%
    const t2 = window.setTimeout(() => {
      playAudioCue('boot-poweron');
      setBootProgress(15);
      setBootLogs(prev => [...prev, 'SYSTEM POWER: ONLINE [100%]']);
    }, 500);

    // 800ms: System Initializing + log. Progress = 35%
    const t3 = window.setTimeout(() => {
      playAudioCue('boot-init');
      setBootProgress(35);
      setBootLogs(prev => [...prev, 'BOOT INITIALIZATION: VERIFYING INTEGRITY...']);
    }, 800);

    // 1100ms: AI Core Loading + log. Progress = 55%
    const t4 = window.setTimeout(() => {
      playAudioCue('boot-loading');
      setBootProgress(55);
      setBootLogs(prev => [...prev, 'AI CORE ONLINE: LOADING DEEPMIND DIALOG MODELS...']);
    }, 1100);

    // 1400ms: Satellite orbit connection + log. Progress = 75%
    const t5 = window.setTimeout(() => {
      playAudioCue('boot-init');
      setBootProgress(75);
      setBootLogs(prev => [...prev, 'NEURAL NETWORK CONNECTED: TECH GALAXY ORBITS STABLE...']);
    }, 1400);

    // 1700ms: Mission Control Online + log. Progress = 90%
    const t6 = window.setTimeout(() => {
      playAudioCue('boot-online');
      setBootProgress(90);
      setBootLogs(prev => [...prev, 'MISSION CONTROL READY: DISPATCHING CENTRAL HUD STREAMS...']);
    }, 1700);

    // 2000ms: Success chime + completion log. Progress = 100%
    const t7 = window.setTimeout(() => {
      playAudioCue('boot-success');
      setBootProgress(100);
      setBootLogs(prev => [...prev, 'SYSTEM READY. INTERFACE BOOT SUCCESS.']);
    }, 2000);

    // 2300ms: Transition to workspace + Stage 1 (Hero UI)
    const t8 = window.setTimeout(async () => {
      setIsBooting(false);
      setHasBooted(true);
      setLoadStage(1);
      sessionStorage.setItem('sanjai_os_booted', 'true');
      const confetti = await loadConfetti();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }, 2300);

    bootTimeoutsRef.current = [t1, t2, t3, t4, t5, t6, t7, t8];

    return () => {
      bootTimeoutsRef.current.forEach(clearTimeout);
    };
  }, [isBooting, playAudioCue, setHasBooted]);

  // Staged Loading Sequence
  useEffect(() => {
    if (loadStage === 1) {
      const t = setTimeout(() => setLoadStage(2), 300);
      return () => clearTimeout(t);
    }
    if (loadStage === 2) {
      const t = setTimeout(() => setLoadStage(3), 600);
      return () => clearTimeout(t);
    }
  }, [loadStage]);

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
          loadConfetti().then(confetti => {
            confetti({
              particleCount: 220,
              spread: 120,
              colors: ['#00f0ff', '#ff007f', '#39ff14', '#9d4edd']
            });
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
      {/* 3D Space grids background — lazy loaded, only after boot + stage 2 */}
      {loadStage >= 2 && (
        <Suspense fallback={null}>
          <Background3D />
        </Suspense>
      )}

      {/* CRT scanline filters */}
      <div className="fixed inset-0 crt-overlay z-[99999] pointer-events-none opacity-20" />

      {/* Custom Cursor Pointer */}
      <CustomCursor />

      {/* BIOS System Boot Loader Overlay — Pure CSS, no framer-motion */}
      {isBooting && (
        <div className={`fixed inset-0 bg-[#02000a] z-[99999] flex items-center justify-center p-4 font-mono select-none transition-all duration-700 ease-in-out ${!isBooting ? 'opacity-0 scale-105 blur-xl pointer-events-none' : ''}`}>
          {/* Ambient radial glow that pulses during boot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-[600px] h-[600px] rounded-full transition-all duration-1000 ${showBootContainer ? 'opacity-40 scale-100 animate-[bootGlow_3s_ease-in-out_infinite]' : 'opacity-0 scale-50'}`}
              style={{ background: 'radial-gradient(ellipse, rgba(0,240,255,0.08) 0%, transparent 70%)' }}
            />
          </div>

          {showBootContainer && (
            <div className="w-full max-w-[580px] border border-cyber-cyan/30 rounded-2xl p-6 bg-black/90 backdrop-blur-xl shadow-[0_0_80px_rgba(0,240,255,0.12),0_0_0_1px_rgba(0,240,255,0.05)] flex flex-col justify-between h-[400px] relative overflow-hidden animate-[bootContainerIn_0.55s_cubic-bezier(0.16,1,0.3,1)_both]">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyber-cyan/40 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-cyan/40 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyber-purple/30 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-purple/30 rounded-br-2xl pointer-events-none" />

              <div className="flex items-center gap-3 text-cyber-cyan border-b border-white/10 pb-3">
                <Cpu className="animate-spin text-cyber-cyan" size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">BIOS_NEURAL_BOOTLOADER_v2.0</span>
                <div className="ml-auto flex items-center gap-3">
                  <button 
                    onClick={skipBoot}
                    className="px-2 py-0.5 rounded border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 hover:border-cyber-cyan/60 text-[8px] font-bold uppercase tracking-widest transition-all cursor-pointer pointer-events-auto"
                  >
                    Skip [ESC]
                  </button>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                    <span className="text-[8px] text-cyber-green uppercase tracking-widest">LIVE</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto my-4 text-[9px] text-slate-500 space-y-2 custom-scroll pr-1">
                <div className="text-slate-600">[SYSTEM] Initiating neural bootstrap sequence...</div>
                {bootLogs.map((log, index) => (
                  <div
                    key={index}
                    className="text-cyber-green font-bold flex items-center gap-2 animate-[bootLogIn_0.3s_ease_both]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-cyber-cyan opacity-60">›</span> {log}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[9px] text-cyber-cyan/70 uppercase tracking-widest">
                  <span>QUANTUM CORE INITIALIZATION</span>
                  <span className="font-bold text-cyber-cyan tabular-nums">{bootProgress}%</span>
                </div>
                <div className="h-1 bg-slate-900/80 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta shadow-[0_0_12px_rgba(0,240,255,0.7)] transition-all duration-600 ease-out"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Top Header status bar */}
      <Header />

      {/* Global Command palette search (Ctrl+K) */}
      <CommandPalette 
        setIsTerminalOpen={setIsTerminalOpen}
        setIsAICopilotOpen={setIsAICopilotOpen}
        setActiveTab={setActiveTab}
      />

      {/* Interactive Floating Notifications Drawer — Pure CSS */}
      <div className="fixed top-18 right-6 z-[9999] flex flex-col gap-3 max-w-[320px] pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            className="p-3.5 border rounded-xl bg-black/90 backdrop-blur-md flex items-start gap-3 shadow-lg pointer-events-auto cursor-pointer animate-[notificationSlideIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]"
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
          </div>
        ))}
      </div>

      {/* CENTRAL CLIENT WORKSPACE */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 pb-32 md:pb-36 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
        
        {/* Floating Core Application windows stack — CSS transitions, no framer-motion */}
        {isRecruiterMode ? (
          <div
            key="recruiter-mode"
            className="w-full space-y-16 pb-20 font-mono animate-[workspaceFadeIn_0.4s_ease_both]"
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

            {/* Resume Optimizer Panel */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyber-purple">#</span> 00 // RESUME & CAPABILITY MATCH OPTIMIZER
              </h2>
              <Suspense fallback={<SuspenseFallback />}>
                <ResumeOptimizer />
              </Suspense>
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
              <Suspense fallback={<SuspenseFallback />}>
                <ContactHub />
              </Suspense>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'hero' && loadStage >= 1 && (
              <div
                key="hero-dashboard"
                className="w-full animate-[workspaceFadeIn_0.4s_ease_both]"
              >
              <Suspense fallback={<SuspenseFallback />}>
                <HeroDashboard 
                  setIsTerminalOpen={setIsTerminalOpen}
                  setActiveTab={setActiveTab}
                  setIsAICopilotOpen={setIsAICopilotOpen}
                />
              </Suspense>
              </div>
            )}

            {activeTab === 'about' && (
              <OSWindow
                key="window-about"
                id="about"
                title="bio_specs_registry.txt"
                isOpen={true}
                onClose={() => setActiveWindow('hero')}
              >
              <Suspense fallback={<SuspenseFallback />}>
                <AboutSpecs />
              </Suspense>
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
              <Suspense fallback={<SuspenseFallback />}>
                <SkillsSection />
              </Suspense>
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
              <Suspense fallback={<SuspenseFallback />}>
                <ProjectsExplorer />
              </Suspense>
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
              <Suspense fallback={<SuspenseFallback />}>
                <MetricsDashboard />
              </Suspense>
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
              <Suspense fallback={<SuspenseFallback />}>
                <CareerChronology />
              </Suspense>
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
              <Suspense fallback={<SuspenseFallback />}>
                <ContactHub />
              </Suspense>
              </OSWindow>
            )}
          </>
        )}

        {/* SIDE UTILITIES: FLOATING SHELLS — CSS transitions */}
        
        {/* Terminal Window widget */}
        {isTerminalOpen && (
          <div className="fixed top-24 left-6 z-40 w-full max-w-[360px] hidden xl:block pointer-events-auto animate-[windowOpen_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <OSWindow
              id="terminal"
              title="terminal_shell.sh"
              isOpen={isTerminalOpen}
              onClose={() => setIsTerminalOpen(false)}
              widthClass="max-w-[360px]"
              heightClass="h-[380px]"
            >
              <Suspense fallback={<SuspenseFallback />}>
                <TerminalWindow />
              </Suspense>
            </OSWindow>
          </div>
        )}

        {/* AI Copilot Window widget */}
        {isAICopilotOpen && (
          <div className="fixed top-24 right-6 z-40 w-full max-w-[360px] hidden xl:block pointer-events-auto animate-[windowOpen_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <OSWindow
              id="copilot"
              title="neural_copilot.ai"
              isOpen={isAICopilotOpen}
              onClose={() => setIsAICopilotOpen(false)}
              widthClass="max-w-[360px]"
              heightClass="h-[380px]"
            >
              <Suspense fallback={<SuspenseFallback />}>
                <AIAssistant />
              </Suspense>
            </OSWindow>
          </div>
        )}

        {/* Developer Diagnostics Overlay */}
        {isDevOverlayOpen && (
          <Suspense fallback={null}>
            <DeveloperOverlay />
          </Suspense>
        )}

        {/* ALWAYS VISIBLE FLOATING RECRUITER CTA DOCK */}
        <div className="fixed right-4 bottom-24 md:bottom-28 z-[9999] flex flex-col gap-2.5 p-2 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md shadow-2xl">
          {/* Title Tag */}
          <div className="text-[7.5px] text-cyber-purple font-mono uppercase text-center font-bold tracking-widest border-b border-white/5 pb-1 select-none">
            RECRUIT_HUD
          </div>
          
          {/* Email Mailto */}
          <a 
            href="mailto:sanjaikumarkaleeswarann@gmail.com?subject=Opportunity%20Inquiry" 
            onClick={() => playAudioCue('click')}
            className="p-2 rounded-xl border border-white/5 hover:border-cyber-cyan bg-white/5 text-slate-400 hover:text-cyber-cyan flex items-center justify-center transition-all group relative"
            title="Hire Me / Email"
          >
            <Mail size={15} />
            <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-cyan border border-cyber-cyan/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Hire Me / Email</span>
          </a>

          {/* Download Resume */}
          <a 
            href="https://github.com/sanjaikumarkaleeswaran" 
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              playAudioCue('click');
              addNotification('Downloading Resume from records', 'success');
            }}
            className="p-2 rounded-xl border border-white/5 hover:border-cyber-green bg-white/5 text-slate-400 hover:text-cyber-green flex items-center justify-center transition-all group relative"
            title="Download Resume"
          >
            <FileText size={15} />
            <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-green border border-cyber-green/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Download Resume</span>
          </a>

          {/* Book Interview */}
          <a 
            href="mailto:sanjaikumarkaleeswarann@gmail.com?subject=Interview%20Scheduling&body=Hi%20Sanjai,%20We%20would%20like%20to%20schedule%20an%20interview..."
            onClick={() => playAudioCue('click')}
            className="p-2 rounded-xl border border-white/5 hover:border-cyber-magenta bg-white/5 text-slate-400 hover:text-cyber-magenta flex items-center justify-center transition-all group relative"
            title="Book Interview"
          >
            <Calendar size={15} />
            <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-magenta border border-cyber-magenta/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Book Interview</span>
          </a>

          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/sanjaikumar-kaleeswaran/" 
            target="_blank"
            rel="noreferrer"
            onClick={() => playAudioCue('click')}
            className="p-2 rounded-xl border border-white/5 hover:border-blue-400 bg-white/5 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all group relative"
            title="LinkedIn Profile"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">LinkedIn</span>
          </a>

          {/* GitHub */}
          <a 
            href="https://github.com/sanjaikumarkaleeswaran" 
            target="_blank"
            rel="noreferrer"
            onClick={() => playAudioCue('click')}
            className="p-2 rounded-xl border border-white/5 hover:border-slate-300 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all group relative"
            title="GitHub Profile"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-slate-300 border border-white/20 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">GitHub</span>
          </a>

          {/* Contact Scroll trigger */}
          <button 
            onClick={() => {
              playAudioCue('click');
              const contactNode = document.getElementById('contact-section');
              if (contactNode) {
                contactNode.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveWindow('contact');
              }
            }}
            className="p-2 rounded-xl border border-white/5 hover:border-cyber-purple bg-white/5 text-slate-400 hover:text-cyber-purple flex items-center justify-center transition-all group relative cursor-pointer"
            title="Contact Form"
          >
            <MessageSquare size={15} />
            <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-purple border border-cyber-purple/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Contact Form</span>
          </button>
        </div>

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
