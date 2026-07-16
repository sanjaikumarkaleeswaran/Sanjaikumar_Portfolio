import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Shield, Clock, Volume2, VolumeX, Search, Layers } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const Header: React.FC = () => {
  const { 
    isMuted, 
    setIsMuted, 
    setIsCommandPaletteOpen, 
    playAudioCue,
    sysUptime,
    currentChapter,
    volume,
    setVolume
  } = useOS();
  
  const [time, setTime] = useState('');
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memoryUsage, setMemoryUsage] = useState(48);

  // Digital clock refresh
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate shifting telemetry resources
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(12 + Math.random() * 8));
      setMemoryUsage(Math.floor(45 + Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between select-none"
      onMouseEnter={() => playAudioCue('dockHover')}
    >
      {/* OS Branding logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className={`h-2.5 w-2.5 rounded-full bg-cyber-green animate-pulse`} />
          <div className="absolute h-4 w-4 rounded-full border border-cyber-green/30 animate-ping duration-1000" />
        </div>
        <span className="font-mono text-xs font-bold tracking-widest text-slate-200">
          SANJAI_OS <span className="text-[10px] text-cyber-cyan opacity-80">v1.1.0</span>
        </span>
      </div>

      {/* Chapter Indicator Status bar */}
      <div className="hidden lg:flex items-center gap-2 border-l border-r border-white/10 px-4 py-0.5 font-mono text-[9px] text-cyber-cyan uppercase tracking-widest select-none">
        <span>{currentChapter}</span>
      </div>

      {/* Global telemetry resources & clock */}
      <div className="flex items-center gap-6 text-[10px] font-mono text-slate-400">
        
        {/* Search Spotlight Shortcut */}
        <button 
          onClick={(e) => {
            const pan = (e.clientX / window.innerWidth) * 2 - 1;
            playAudioCue('click', pan);
            setIsCommandPaletteOpen(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 hover:border-cyber-cyan/50 bg-white/5 text-slate-300 hover:text-cyber-cyan transition-all cursor-pointer"
        >
          <Search size={10} />
          <span>Spotlight</span>
          <kbd className="hidden sm:inline-block px-1 bg-slate-800 rounded text-[9px] border border-white/10">Ctrl+K</kbd>
        </button>

        {/* CPU resources */}
        <div className="hidden sm:flex items-center gap-2">
          <Cpu className="text-cyber-purple animate-pulse" size={12} />
          <span>CPU: <span className="text-slate-200">{cpuUsage}%</span></span>
        </div>

        {/* RAM memory usage */}
        <div className="hidden sm:flex items-center gap-2">
          <Layers className="text-cyber-magenta animate-pulse" size={12} />
          <span>RAM: <span className="text-slate-200">{memoryUsage}%</span></span>
        </div>

        {/* System Uptime */}
        <div className="hidden md:flex items-center gap-2">
          <Shield className="text-cyber-cyan" size={12} />
          <span>UPTIME: <span className="text-slate-200">{sysUptime}</span></span>
        </div>

        {/* Network status */}
        <div className="hidden lg:flex items-center gap-2">
          <Wifi className="text-cyber-green" size={12} />
          <span>ONLINE</span>
        </div>

        {/* Procedural sound toggle & volume */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-2">
          <button
            onClick={(e) => {
              const pan = (e.clientX / window.innerWidth) * 2 - 1;
              setIsMuted(!isMuted);
              playAudioCue('click', pan);
            }}
            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
              !isMuted 
                ? 'border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/5' 
                : 'border-white/10 text-slate-500 hover:text-slate-300'
            }`}
            title={isMuted ? 'Unmute procedural audio (Shortcut: M)' : 'Mute audio (Shortcut: M)'}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
          
          {!isMuted && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
              }}
              onMouseUp={() => playAudioCue('tap')}
              className="w-12 sm:w-16 h-1 rounded bg-white/10 accent-cyber-cyan cursor-pointer transition-all hover:bg-white/20"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          )}
        </div>

        {/* System Clock */}
        <div className="flex items-center gap-2 text-slate-200 font-bold border-l border-white/10 pl-4">
          <Clock size={12} className="text-cyber-cyan animate-pulse" />
          <span>{time}</span>
        </div>

      </div>
    </header>
  );
};
