import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, AlertCircle, CheckCircle, Info } from 'lucide-react';
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

// Content screens
import { HeroDashboard } from './components/sections/HeroDashboard';
import { AboutSpecs } from './components/sections/AboutSpecs';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsExplorer } from './components/sections/ProjectsExplorer';
import { CareerChronology } from './components/sections/CareerChronology';
import { ContactHub } from './components/sections/ContactHub';

function AppContent() {
  const { 
    theme, 
    notifications, 
    removeNotification, 
    activeWindow, 
    setActiveWindow, 
    playAudioCue 
  } = useOS();

  // OS Window Toggles
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  
  // Tab alignment inside Dock
  const [activeTab, setActiveTab] = useState<string>('hero');

  // Boot sequence loader states
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  const bootSequence = [
    'INITIALIZING SANJAI_OS SYSTEM KERNEL...',
    'LOADING VIRTUAL FILESYSTEM MODULES...',
    'CONNECTING TO COIMBATORE_GEOLOCATION_NODE...',
    'RETRIEVING KONGU_ENGINEERING_COLLEGE RECORDS...',
    'DECRYPTING PORTFOLIO REGISTRY CREDENTIALS...',
    'MOUNTING CORE THREE.JS WEBGL RENDER PANELS...',
    'LOADING NEURAL CHATBOT LLM DIALOG MODELS...',
    'STARTING WEB AUDIO procedurAL SYNTH ENGINE...',
    'INTEGRITY VERIFICATION SUCCEEDED.'
  ];

  // Boot Loader progress simulator
  useEffect(() => {
    if (!isBooting) return;
    
    let logIdx = 0;
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        const jump = Math.floor(Math.random() * 12) + 6;
        const next = prev + jump;
        
        if (next >= 100) {
          clearInterval(interval);
          setBootLogs(prevLogs => [...prevLogs, 'SYSTEM READY. INTERFACE BOOT SUCCESS.']);
          
          setTimeout(() => {
            setIsBooting(false);
            // Delight the recruiter on entrance
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          }, 800);
          return 100;
        }

        const calculatedIndex = Math.floor((next / 100) * bootSequence.length);
        if (calculatedIndex > logIdx && calculatedIndex < bootSequence.length) {
          setBootLogs(prevLogs => [...prevLogs, bootSequence[logIdx]]);
          logIdx = calculatedIndex;
        }

        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isBooting]);

  // Synchronize ActiveTab with ActiveWindow
  useEffect(() => {
    if (activeWindow) {
      setActiveTab(activeWindow);
    }
  }, [activeWindow]);

  // Play boot sound immediately after booting overlay vanishes
  useEffect(() => {
    if (!isBooting) {
      // Small timeout to bypass initial browser gesture constraint
      setTimeout(() => {
        playAudioCue('boot');
      }, 200);
    }
  }, [isBooting]);

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
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#02000a] z-[99999] flex items-center justify-center p-4 font-mono select-none"
          >
            <div className="w-full max-w-[550px] border border-cyber-cyan/25 rounded-2xl p-6 bg-black/85 backdrop-blur-xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col justify-between h-[360px]">
              
              <div className="flex items-center gap-2 text-cyber-cyan border-b border-white/10 pb-2">
                <Cpu className="animate-spin text-cyber-cyan" size={15} />
                <span className="text-[11px] font-bold uppercase tracking-widest">BIOS_NEURAL_BOOTLOADER_v1.1</span>
              </div>
              
              <div className="flex-1 overflow-y-auto my-4 text-[9px] text-slate-400 space-y-1.5 custom-scroll">
                <div>[SYSTEM] Initiating bootstrap logs...</div>
                {bootLogs.map((log, index) => (
                  <div key={index} className="text-cyber-green select-text font-bold">✓ {log}</div>
                ))}
              </div>

              {/* Loader progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-cyber-cyan">
                  <span>BOOTING DATA PROTOCOLS</span>
                  <span className="font-bold">{bootProgress}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    style={{ width: `${bootProgress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                  />
                </div>
              </div>

            </div>
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
