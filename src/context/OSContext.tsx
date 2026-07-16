import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type ThemeType = 'cyber' | 'obsidian' | 'matrix';

export interface Notification {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'info';
}

interface OSContextProps {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  notifications: Notification[];
  addNotification: (text: string, type?: 'success' | 'warning' | 'info') => void;
  removeNotification: (id: string) => void;
  activeWindow: string | null;
  setActiveWindow: (w: string | null) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  playAudioCue: (type: string, pan?: number) => void;
  sysUptime: string;
  isRecruiterMode: boolean;
  setIsRecruiterMode: (r: boolean) => void;
  currentChapter: string;
  volume: number;
  setVolume: (v: number) => void;
}

const OSContext = createContext<OSContextProps | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('cyber');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>('hero');
  const [isMuted, setIsMutedState] = useState(() => {
    const saved = localStorage.getItem('sanjai_os_muted');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('sanjai_os_volume');
    return saved !== null ? JSON.parse(saved) : 0.5;
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [sysUptime, setSysUptime] = useState('00:00:00');
  const [isRecruiterMode, setIsRecruiterModeState] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('Chapter 1: Boot Sequence');

  // Web Audio Context Reference
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Global keyboard shortcut 'M' listener to toggle mute state
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isMuted]);

  // Uptime Counter
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const diff = Date.now() - startTime;
      const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      const mins = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      setSysUptime(`${hours}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Audio Context on demand
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Procedural Sound Effects Synthesizer with spatial panning support
  const playAudioCue = (type: string, pan = 0) => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Spatial stereo panner integration
      let panner: StereoPannerNode | null = null;
      if (ctx.createStereoPanner) {
        panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(pan, now);
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }

      gain.connect(ctx.destination);
      const volScale = volume; // global volume scale

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
        gain.gain.setValueAtTime(0.06 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.03);
        gain.gain.setValueAtTime(0.04 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'shutdown') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.07);
        gain.gain.setValueAtTime(0.04 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.035 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'nav') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);
        gain.gain.setValueAtTime(0.025 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.start(now);
        osc.stop(now + 0.025);
      } else if (type === 'dockHover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.01 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'sparkle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.setValueAtTime(1700, now + 0.03);
        osc.frequency.setValueAtTime(2000, now + 0.06);
        gain.gain.setValueAtTime(0.012 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'expand') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
        gain.gain.setValueAtTime(0.03 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'transform') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.35); // C3 to C4
        gain.gain.setValueAtTime(0.05 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.21); // C6
        gain.gain.setValueAtTime(0.035 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'error') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.2);
        gain.gain.setValueAtTime(0.05 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'transition') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.22);
        gain.gain.setValueAtTime(0.025 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'glitch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(Math.random() * 400 + 80, now);
        gain.gain.setValueAtTime(0.015 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'type') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);
        gain.gain.setValueAtTime(0.01 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        osc.start(now);
        osc.stop(now + 0.015);
      } else if (type === 'return') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);
        gain.gain.setValueAtTime(0.02 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'wake') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.07); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.14); // D6
        gain.gain.setValueAtTime(0.03 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'stream') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.006 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
      } else if (type === 'thinking') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.01 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.06);
        gain.gain.setValueAtTime(0.018 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'systemOnline') {
        const notes = [261.63, 329.63, 392.0];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          if (panner) oscNode.connect(panner);
          else oscNode.connect(gainNode);
          if (panner) panner.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, now + idx * 0.06);
          oscNode.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.25 + idx * 0.06);
          
          gainNode.gain.setValueAtTime(0.012 * volScale, now + idx * 0.06);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + idx * 0.06);
          
          oscNode.start(now + idx * 0.06);
          oscNode.stop(now + 0.35 + idx * 0.06);
        });
      } else if (type === 'achievement') {
        const notes = [261.63, 329.63, 392.00, 493.88];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          if (panner) oscNode.connect(panner);
          else oscNode.connect(gainNode);
          if (panner) panner.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, now + idx * 0.08);
          oscNode.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35 + idx * 0.08);
          
          gainNode.gain.setValueAtTime(0.012 * volScale, now + idx * 0.08);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.08);
          
          oscNode.start(now + idx * 0.08);
          oscNode.stop(now + 0.5 + idx * 0.08);
        });
      } else if (type === 'boot') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.7);
        gain.gain.setValueAtTime(0.1 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.start(now);
        osc.stop(now + 0.9);

        const notes = [440.00, 554.37, 659.25, 880.00];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, now + 0.25 + idx * 0.06);
          gainNode.gain.setValueAtTime(0.012 * volScale, now + 0.25 + idx * 0.06);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55 + idx * 0.06);
          oscNode.start(now + 0.25 + idx * 0.06);
          oscNode.stop(now + 0.6 + idx * 0.06);
        });
      }
    } catch (e) {
      console.warn('Audio Context error: ', e);
    }
  };

  // Ambient procedural background audio
  useEffect(() => {
    if (isMuted) {
      if (ambientOscRef.current) {
        try {
          ambientOscRef.current.stop();
        } catch (e) {}
        ambientOscRef.current = null;
      }
      return;
    }

    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65.41, now); // C2 relaxing tone

      // Subtle LFO modulation to create breathing hum
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.25; // 0.25 Hz
      lfoGain.gain.value = 1.0;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      gain.gain.setValueAtTime(0.025 * volume, now);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);

      ambientOscRef.current = osc;
      ambientGainRef.current = gain;

    } catch (e) {
      console.warn('Ambient Audio failed to start: ', e);
    }

    return () => {
      if (ambientOscRef.current) {
        try {
          ambientOscRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isMuted]);

  // Dynamically update ambient volume level
  useEffect(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      ambientGainRef.current.gain.setValueAtTime(isMuted ? 0 : 0.025 * volume, now);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!activeWindow) return;
    const chapters: Record<string, string> = {
      hero: 'Chapter 2 // System Initialization',
      about: 'Chapter 3 // Biographical Identity',
      skills: 'Chapter 4 // Technology Galaxy',
      projects: 'Chapter 5 // Engineering Projects',
      timeline: 'Chapter 6 // Professional Journey',
      contact: 'Chapter 9 // Recruitment Transmit',
    };
    setCurrentChapter(chapters[activeWindow] || 'Chapter 2 // System Initialization');
  }, [activeWindow]);

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
    if (t === 'matrix') {
      playAudioCue('glitch');
    } else {
      playAudioCue('open');
    }
    addNotification(`Theme switched to ${t.toUpperCase()}_OS`, 'info');
  };

  const setIsMuted = (m: boolean) => {
    setIsMutedState(m);
    localStorage.setItem('sanjai_os_muted', JSON.stringify(m));
    if (!m) {
      playAudioCue('success');
      addNotification('Audio enabled: Procedural sound system online', 'success');
    } else {
      addNotification('Audio disabled: Quiet mode active', 'info');
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    localStorage.setItem('sanjai_os_volume', JSON.stringify(v));
  };

  const setIsRecruiterMode = (r: boolean) => {
    setIsRecruiterModeState(r);
    playAudioCue('transform');
    addNotification(r ? 'Recruiter Mode engaged: Simpler layout active' : 'Recruiter Mode disengaged: OS layout restored', 'info');
  };

  const addNotification = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, text, type }]);
    
    if (type === 'success') {
      playAudioCue('success');
    } else if (type === 'warning') {
      playAudioCue('error');
    } else {
      playAudioCue('ping');
    }

    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <OSContext.Provider
      value={{
        theme,
        setTheme,
        notifications,
        addNotification,
        removeNotification,
        activeWindow,
        setActiveWindow,
        isMuted,
        setIsMuted,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        playAudioCue,
        sysUptime,
        isRecruiterMode,
        setIsRecruiterMode,
        currentChapter,
        volume,
        setVolume
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
