import React, { useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Play, Pause, X, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface TourStepConfig {
  title: string;
  selector: string;
  desc: string;
}

const TOUR_STEPS: TourStepConfig[] = [
  {
    title: 'Neural Core & System HUD',
    selector: '#hero-section',
    desc: 'Welcome to the Neural Command Center. This is the main dashboard of the Operating System. Toggle Recruiter Mode for a linear review, activate Developer Mode (Ctrl+Shift+D), or interact with the R3F Neural Sphere.',
  },
  {
    title: 'Data-Driven Projects Workspace',
    selector: '#projects-explorer',
    desc: 'Centralized Project registry. Each module is loaded dynamically from decoupled JSON schemas. Click a project card to inspect structural problems, development solutions, and live source code trees.',
  },
  {
    title: 'Interactive Architecture Playground',
    selector: '#architecture-playground',
    desc: 'Evolved architecture inspector. Select microservice nodes to examine architectural decisions, performance ratios, and trade-offs. Click "Run Transaction Simulation" to trace live transaction log streams.',
  },
  {
    title: 'Technical Skills Matrix',
    selector: '#skills-matrix',
    desc: 'Dynamic skill grid mapping core capabilities. Hover over specific blocks to examine frameworks, system tools, and detailed proficiency ratings.',
  },
  {
    title: 'Career Chronology & Resume Tailoring',
    selector: '#career-timeline',
    desc: 'Interactive education and work experience timeline. Directly tailor-make a custom resume by matching skill keywords from any target Job Description!',
  },
  {
    title: 'Live GitHub & Codebase Telemetry',
    selector: '#metrics-telemetry',
    desc: 'Real-time engineering metrics dashboard. Fetches active GitHub statistics, contribution logs, and displays automated codebase health stats compiled at build-time.',
  },
  {
    title: 'Neural Communication Bridge',
    selector: '#contact-hub',
    desc: 'Connect with Sanjaikumar. Access direct communication links, email integrations, and professional profiles.',
  },
];

export const RecruiterTour: React.FC = () => {
  const {
    isTourActive,
    setIsTourActive,
    tourStep,
    setTourStep,
    isTourPaused,
    setIsTourPaused,
    playAudioCue,
    addNotification,
  } = useOS();

  // Handle auto-scrolling when tour step changes
  useEffect(() => {
    if (!isTourActive || isTourPaused) return;

    const step = TOUR_STEPS[tourStep];
    const element = document.querySelector(step.selector);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Briefly add temporary pulsing outline to target element
      element.classList.add('ring-2', 'ring-cyber-cyan', 'ring-offset-2', 'ring-offset-black', 'transition-all', 'duration-1000');
      
      const timer = setTimeout(() => {
        element.classList.remove('ring-2', 'ring-cyber-cyan', 'ring-offset-2', 'ring-offset-black');
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [tourStep, isTourActive, isTourPaused]);

  if (!isTourActive) return null;

  const currentStep = TOUR_STEPS[tourStep];

  const handleNext = () => {
    playAudioCue('click');
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setIsTourActive(false);
      addNotification('Guided tour completed successfully!', 'success');
      playAudioCue('success');
    }
  };

  const handlePrev = () => {
    playAudioCue('click');
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleSkip = () => {
    playAudioCue('click');
    setIsTourActive(false);
    addNotification('Guided tour skipped.', 'info');
  };

  const togglePause = () => {
    playAudioCue('click');
    setIsTourPaused(!isTourPaused);
    addNotification(isTourPaused ? 'Tour resumed' : 'Tour paused', 'info');
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 p-5 border border-cyber-cyan/30 bg-slate-950/90 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-md animate-[slideUp_0.3s_ease-out]">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          <span className="font-mono text-[9px] text-cyber-cyan font-bold tracking-widest uppercase">// SYSTEM_GUIDED_TOUR</span>
        </div>
        <button 
          onClick={handleSkip}
          className="text-slate-400 hover:text-cyber-magenta transition-colors"
          title="Exit Tour"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tour Step Card Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wide">
            {currentStep.title}
          </h4>
          <span className="font-mono text-[9px] text-slate-500 font-bold">
            STEP {tourStep + 1} / {TOUR_STEPS.length}
          </span>
        </div>
        <p className="font-mono text-[10px] md:text-xs text-slate-400 leading-relaxed min-h-[50px]">
          {currentStep.desc}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
        <button
          onClick={togglePause}
          className="p-1.5 border border-white/10 hover:border-cyber-cyan/40 bg-slate-900/60 rounded text-slate-400 hover:text-cyber-cyan transition-colors"
          title={isTourPaused ? 'Resume Auto-Scroll' : 'Pause Tour'}
        >
          {isTourPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={tourStep === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-white/10 hover:border-cyber-cyan/30 bg-slate-900/40 hover:bg-slate-900/80 rounded text-[9px] font-mono text-slate-400 hover:text-slate-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft size={10} />
            <span>BACK</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 border border-cyber-cyan/40 hover:border-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan/20 rounded text-[9px] font-mono text-cyber-cyan hover:text-white transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)]"
          >
            <span>{tourStep === TOUR_STEPS.length - 1 ? 'FINISH' : 'NEXT'}</span>
            {tourStep === TOUR_STEPS.length - 1 ? <Check size={10} /> : <ArrowRight size={10} />}
          </button>
        </div>
      </div>

    </div>
  );
};
