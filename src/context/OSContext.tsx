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
  playAudioCue: (type: 'click' | 'hover' | 'success' | 'error' | 'boot') => void;
  sysUptime: string;
}

const OSContext = createContext<OSContextProps | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('cyber');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>('hero');
  const [isMuted, setIsMuted] = useState(true); // Default muted to respect browser autoplay policies
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [sysUptime, setSysUptime] = useState('00:00:00');

  // Web Audio Context Reference
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

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

  // Procedural Sound Effects Synthesizer
  const playAudioCue = (type: 'click' | 'hover' | 'success' | 'error' | 'boot') => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(1500, now + 0.02);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'boot') {
        // Deep sub bass sweep + rising arpeggio
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        osc.start(now);
        osc.stop(now + 1.0);

        // Rising chord overlay
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(220, now + 0.2);
        osc2.frequency.exponentialRampToValueAtTime(880, now + 1.0);
        gain2.gain.setValueAtTime(0.05, now + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        osc2.start(now + 0.2);
        osc2.stop(now + 1.0);
      }
    } catch (e) {
      console.warn('Audio Context error: ', e);
    }
  };

  // Ambient procedural background audio
  useEffect(() => {
    if (isMuted) {
      // Stop ambient track
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
      // Low relaxing frequency (C2 chord note)
      osc.frequency.setValueAtTime(65.41, now); // C2

      // Subtle LFO modulation to create breathing synth effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.2; // 0.2 Hz
      lfoGain.gain.value = 1.5; // modulate frequency slightly
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      gain.gain.setValueAtTime(0.04, now); // Very quiet

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

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
    playAudioCue('click');
    addNotification(`Theme switched to ${t.toUpperCase()}_OS`, 'info');
  };

  const addNotification = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, text, type }]);
    
    // Automatically play success audio cue for success notifications
    if (type === 'success') {
      playAudioCue('success');
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
        sysUptime
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
