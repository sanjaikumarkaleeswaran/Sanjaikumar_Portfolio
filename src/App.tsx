import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Cpu, AlertCircle, CheckCircle, Info, FileText } from 'lucide-react';

// Context (always needed)
import { OSProvider, useOS } from './context/OSContext';

// Lightweight UI shells — load immediately
import { Header } from './components/ui/Header';
import { OSDock } from './components/ui/OSDock';
import { OSWindow } from './components/ui/OSWindow';
import { CustomCursor } from './components/ui/CustomCursor';
const CommandPalette = lazy(() => import('./components/ui/CommandPalette').then(m => ({ default: m.CommandPalette })));
const RecruiterTour = lazy(() => import('./components/ui/RecruiterTour').then(m => ({ default: m.RecruiterTour })));
const ResponsiveRecruiterHub = lazy(() => import('./components/ui/ResponsiveRecruiterHub').then(m => ({ default: m.ResponsiveRecruiterHub })));

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
    setHasBooted,
    hasBooted,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isTourActive
  } = useOS();

  // OS Window Toggles
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isDevOverlayOpen, setIsDevOverlayOpen] = useState(false);
  
  // Tab alignment inside Dock
  const [activeTab, setActiveTab] = useState<string>('hero');

  // Staged loading: 0=booting, 3=everything
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
  const [renderBootScreen, setRenderBootScreen] = useState(() => {
    const sessionBooted = sessionStorage.getItem('sanjai_os_booted');
    return !sessionBooted;
  });
  const [isBootFading, setIsBootFading] = useState(false);
  const [isBooting, setIsBooting] = useState(() => {
    const sessionBooted = sessionStorage.getItem('sanjai_os_booted');
    return !sessionBooted;
  });
  const [showBootContainer, setShowBootContainer] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Preload Image helper (parallel asset loader)
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  };

  // Skip boot function
  const skipBoot = useCallback(async () => {
    setIsBootFading(true);
    setTimeout(async () => {
      setIsBooting(false);
      setRenderBootScreen(false);
      setHasBooted(true);
      setLoadStage(3);
      sessionStorage.setItem('sanjai_os_booted', 'true');
      try {
        const confetti = await loadConfetti();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        console.warn('Confetti load failed', e);
      }
    }, 300);
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

  // Global command palette Ctrl+K listener (code splitting trigger)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        playAudioCue('click');
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playAudioCue, isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Background module preloader to warm up lazy chunks on idle time
  useEffect(() => {
    if (!hasBooted) return;
    const prefetchModules = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          import('./components/ui/AIAssistant');
          import('./components/ui/TerminalWindow');
          import('./components/canvas/Background3D');
          import('./components/sections/ResumeOptimizer');
          import('./components/sections/MetricsDashboard');
          import('./components/ui/RecruiterTour');
          import('./components/ui/ResponsiveRecruiterHub');
        });
      } else {
        setTimeout(() => {
          import('./components/ui/AIAssistant');
          import('./components/ui/TerminalWindow');
          import('./components/canvas/Background3D');
          import('./components/sections/ResumeOptimizer');
          import('./components/sections/MetricsDashboard');
          import('./components/ui/RecruiterTour');
          import('./components/ui/ResponsiveRecruiterHub');
        }, 2000);
      }
    };
    prefetchModules();
  }, [hasBooted]);

  // Parallelized Actual Boot Sequence Loader
  useEffect(() => {
    if (!isBooting) return;

    let active = true;

    // Responsive Boot Duration Limits (Requirement 4)
    const width = window.innerWidth;
    const maxBootTime = width < 768 ? 1000 : width <= 1024 ? 1200 : 1500;

    // 1. Instantly display boot container
    const tContainer = setTimeout(() => {
      if (active) setShowBootContainer(true);
    }, 50);

    // 2. Play power on procedural audio cue
    playAudioCue('boot-poweron');

    const steps = [
      { progress: 5, log: 'SYSTEM POWER: ONLINE [100%]', time: 0 },
      { progress: 20, log: 'BOOT INITIALIZATION: VERIFYING INTEGRITY...', time: 100 },
      { progress: 40, log: 'CORE SYSTEM COMPONENTS INSTANTIATED...', time: 200 },
      { progress: 60, log: 'PORTFOLIO REGISTRY INSTANTIATED: 6 projects loaded.', time: 300 }
    ];

    // Trigger progressive loader updates
    const timers = steps.map(step => {
      return setTimeout(() => {
        if (!active) return;
        setBootProgress(step.progress);
        setBootLogs(prev => [...prev, step.log]);
        if (step.progress === 20) playAudioCue('boot-init');
      }, step.time);
    });

    // 3. Parallel resource loader promise
    const loadPromise = Promise.all([
      document.fonts.ready,
      preloadImage('/sanjai_hologram.png')
    ]);

    // Safety guard to transition immediately when max boot duration is met
    const tSafety = setTimeout(() => {
      finishBootSequence();
    }, maxBootTime);

    const finishBootSequence = async () => {
      if (!active) return;
      active = false;
      
      setBootProgress(100);
      setBootLogs(prev => [...prev, 'SYSTEM READY. INTERFACE BOOT SUCCESS.']);
      playAudioCue('boot-success');

      setTimeout(() => {
        setIsBootFading(true);
        setTimeout(async () => {
          setIsBooting(false);
          setRenderBootScreen(false);
          setHasBooted(true);
          setLoadStage(3);
          sessionStorage.setItem('sanjai_os_booted', 'true');
          try {
            const confetti = await loadConfetti();
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          } catch (e) {
            console.warn('Confetti load failed', e);
          }
        }, 300); // 300ms smooth fade out
      }, 100);
    };

    // When actual fonts and critical images resolve
    loadPromise.then(() => {
      if (!active) return;
      clearTimeout(tSafety);
      setBootProgress(80);
      setBootLogs(prev => [...prev, 'ASSET PRELOAD: /sanjai_hologram.png and fonts cached.']);
      playAudioCue('boot-online');
      
      setTimeout(() => {
        finishBootSequence();
      }, 80);
    });

    return () => {
      active = false;
      clearTimeout(tContainer);
      clearTimeout(tSafety);
      timers.forEach(clearTimeout);
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
    <div className={`theme-${theme} min-h-screen text-slate-100 font-sans relative overflow-x-hidden ${
      theme === 'matrix' || theme === 'terminal' ? 'selection:bg-cyber-green selection:text-black' : 'selection:bg-cyber-cyan selection:text-black'
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

      {/* BIOS System Boot Loader Overlay — GPU-optimized CSS */}
      {renderBootScreen && (
        <div className={`fixed inset-0 bg-[#02000a] z-[99999] flex items-center justify-center p-4 font-mono select-none transition-all duration-300 ease-out will-change-[transform,opacity] ${
          isBootFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}>
          {/* Ambient radial glow that pulses during boot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-[600px] h-[600px] rounded-full transition-all duration-1000 will-change-transform ${showBootContainer ? 'opacity-30 scale-100 animate-[bootGlow_3s_ease-in-out_infinite]' : 'opacity-0 scale-50'}`}
              style={{ background: 'radial-gradient(ellipse, rgba(0,240,255,0.06) 0%, transparent 70%)' }}
            />
          </div>

          {showBootContainer && (
            <div className="w-full max-w-[580px] border border-cyber-cyan/30 rounded-2xl p-6 bg-black/90 shadow-[0_0_40px_rgba(0,240,255,0.08),0_0_0_1px_rgba(0,240,255,0.05)] flex flex-col justify-between h-[400px] relative overflow-hidden will-change-transform animate-[bootContainerIn_0.45s_cubic-bezier(0.16,1,0.3,1)_both]">
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
                    className="text-cyber-green font-bold flex items-center gap-2 will-change-transform animate-[bootLogIn_0.25s_ease_both]"
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
                    className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta shadow-[0_0_12px_rgba(0,240,255,0.7)] transition-all duration-300 ease-out will-change-[width]"
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
      {isCommandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette 
            setIsTerminalOpen={setIsTerminalOpen}
            setIsAICopilotOpen={setIsAICopilotOpen}
            setActiveTab={setActiveTab}
          />
        </Suspense>
      )}

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
          <div className="fixed inset-0 md:inset-auto md:top-24 md:left-6 z-50 md:z-40 w-full md:max-w-[360px] pointer-events-auto animate-[windowOpen_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">
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
          <div className="fixed inset-0 md:inset-auto md:top-24 md:right-6 z-50 md:z-40 w-full md:max-w-[360px] pointer-events-auto animate-[windowOpen_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">
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

        {/* RECRUIT_HUD Responsive Floating Action Hub */}
        <Suspense fallback={null}>
          <ResponsiveRecruiterHub setIsAICopilotOpen={setIsAICopilotOpen} />
        </Suspense>

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

      {/* Recruiter Guided Tour HUD */}
      {isTourActive && (
        <Suspense fallback={null}>
          <RecruiterTour />
        </Suspense>
      )}
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
