import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Globe, Clock, Zap, FileText, UserCheck, Activity } from 'lucide-react';
import { HologramCore } from '../canvas/HologramCore';
import { useOS } from '../../context/OSContext';

export const HeroDashboard: React.FC<{
  setIsTerminalOpen: (open: boolean) => void;
  setActiveTab: (tab: any) => void;
}> = (props) => {
  const { setIsTerminalOpen } = props;
  const { 
    playAudioCue, 
    isRecruiterMode, 
    setIsRecruiterMode,
    addNotification 
  } = useOS();

  const [headlineText, setHeadlineText] = useState('');
  const fullHeadline = 'FULL STACK & AI WEB ARCHITECT';

  // Live telemetry fluctuating states
  const [cpuUsage, setCpuUsage] = useState(24);
  const [gpuUsage, setGpuUsage] = useState(38);
  const [ramUsage, setRamUsage] = useState(68);
  const [pingLatency, setPingLatency] = useState(24);
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
    }, 85);
    return () => clearInterval(timer);
  }, []);

  // System statistics simulator
  useEffect(() => {
    const statTimer = setInterval(() => {
      setCpuUsage((prev) => Math.min(Math.max(prev + (Math.random() * 8 - 4), 12), 48));
      setGpuUsage((prev) => Math.min(Math.max(prev + (Math.random() * 6 - 3), 25), 58));
      setRamUsage((prev) => Math.min(Math.max(prev + (Math.random() * 2 - 1), 66), 72));
      setPingLatency((prev) => Math.min(Math.max(prev + (Math.random() * 4 - 2), 16), 34));
    }, 1500);

    return () => clearInterval(statTimer);
  }, []);

  // Ticking Clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Live GitHub active activity feed logs state
  const [gitLogs, setGitLogs] = useState<string[]>([]);
  const [isLoadingGit, setIsLoadingGit] = useState(true);

  useEffect(() => {
    const fetchGithubLogs = async () => {
      const cacheKey = 'sanjai_github_logs';
      const cacheTimeKey = 'sanjai_github_timestamp';
      const cacheExpiry = 10 * 60 * 1000; // 10 minutes

      const cached = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);

      if (cached && cachedTime && (Date.now() - parseInt(cachedTime, 10) < cacheExpiry)) {
        setGitLogs(JSON.parse(cached));
        setIsLoadingGit(false);
        return;
      }

      try {
        const res = await fetch('https://api.github.com/users/sanjaikumarkaleeswaran/events');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        
        // Filter push events
        const pushEvents = data.filter((e: any) => e.type === 'PushEvent');
        
        const logs = pushEvents.slice(0, 5).map((e: any) => {
          const commitMsg = e.payload?.commits?.[0]?.message || 'Updated project directory';
          const created = new Date(e.created_at);
          const diffMs = Math.max(0, Date.now() - created.getTime());
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          let ageStr = 'now';
          if (diffMins < 60) {
            ageStr = `${diffMins || 1}m ago`;
          } else if (diffHours < 24) {
            ageStr = `${diffHours}h ago`;
          } else {
            ageStr = `${Math.floor(diffHours / 24) || 1}d ago`;
          }
          return `${commitMsg} [${ageStr}]`;
        });

        if (logs.length === 0) {
          throw new Error('No push logs available');
        }

        localStorage.setItem(cacheKey, JSON.stringify(logs));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        setGitLogs(logs);
      } catch (err) {
        // Fallback to cache if exists, or hardcoded logs
        if (cached) {
          setGitLogs(JSON.parse(cached));
        } else {
          setGitLogs([
            'feat(webgl): compile custom cosmic nebula shader [2m ago]',
            'docs(specs): update developer specs telemetry [10m ago]',
            'fix(dock): stabilize audio sound nodes [1h ago]',
            'feat(twin): render point-cloud face coordinates [4h ago]',
            'refactor(os): optimize component bundles [1d ago]'
          ]);
        }
      } finally {
        setIsLoadingGit(false);
      }
    };

    fetchGithubLogs();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 font-mono">
      
      {/* Left side: Mission Control Grid & Info */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Connection status HUD */}
        <div className="flex flex-wrap gap-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/35 bg-cyber-cyan/5 text-cyber-cyan text-[8.5px] uppercase tracking-widest"
          >
            <Cpu className="animate-spin text-cyber-cyan" size={10} />
            <span>SYS_CONNECTION_SECURE // PORT_5192</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-green/35 bg-cyber-green/5 text-cyber-green text-[8.5px] uppercase tracking-widest"
          >
            <Globe className="text-cyber-green" size={10} />
            <span>PING: {Math.floor(pingLatency)}MS // ONLINE</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-purple/35 bg-cyber-purple/5 text-cyber-purple text-[8.5px] uppercase tracking-widest"
          >
            <Clock size={10} />
            <span>LOCAL: {timeString}</span>
          </motion.div>
        </div>

        {/* Big cinematic headlines */}
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase"
          >
            SANJAIKUMAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta">P K</span>
          </motion.h1>

          <div className="h-6 text-xs md:text-sm font-semibold tracking-wider text-cyber-cyan flex items-center">
            <span>{headlineText}</span>
            <span className="h-4 w-1.5 bg-cyber-cyan ml-1 animate-pulse" />
          </div>
        </div>

        {/* Mission Briefing */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 border border-white/5 rounded-xl bg-slate-950/40 backdrop-blur-md space-y-2.5"
        >
          <div className="flex items-center gap-2 text-cyber-magenta text-[9px] uppercase tracking-widest font-semibold">
            <Zap size={10} className="animate-bounce" />
            <span>CURRENT OPERATIONAL MISSION</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed font-sans">
            B.Sc. Software Systems graduate (2025, CGPA 8.05/10) from Kongu Engineering College. 
            Actively seeking professional roles in software architecture and full-stack development, specializing in React, TS, Python, and containerized scale.
          </p>
        </motion.div>

        {/* Live Hardware Stats Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 border border-white/5 rounded-xl bg-slate-950/40 backdrop-blur-md space-y-3"
        >
          <div className="text-[9px] text-slate-500 uppercase tracking-widest flex justify-between">
            <span>Core Hardware Telemetry</span>
            <span className="text-cyber-cyan animate-pulse">Live</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-[9.5px]">
            {/* CPU Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>CPU LOAD</span>
                <span className="text-cyber-cyan">{Math.floor(cpuUsage)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyber-cyan transition-all duration-1000" 
                  style={{ width: `${cpuUsage}%` }}
                />
              </div>
            </div>

            {/* GPU Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>GPU RENDER</span>
                <span className="text-cyber-purple">{Math.floor(gpuUsage)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyber-purple transition-all duration-1000" 
                  style={{ width: `${gpuUsage}%` }}
                />
              </div>
            </div>

            {/* RAM Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>RAM UTILIZATION</span>
                <span className="text-cyber-green">{Math.floor(ramUsage)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyber-green transition-all duration-1000" 
                  style={{ width: `${ramUsage}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* GitHub active Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 border border-white/5 rounded-xl bg-slate-950/40 backdrop-blur-md space-y-2"
        >
          <div className="text-[9px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Activity size={10} className="text-cyber-green animate-pulse" />
            <span>GitHub Active Event Logs</span>
          </div>
          <div className="space-y-1 max-h-[85px] overflow-y-auto text-[9px] text-slate-400 select-none custom-scroll">
            {isLoadingGit ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex gap-2 items-center py-0.5 animate-pulse">
                  <span className="text-cyber-cyan/40">&gt;</span>
                  <div className="h-2.5 bg-white/5 border border-white/5 rounded w-[85%]" />
                </div>
              ))
            ) : (
              gitLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-center font-mono py-0.5 hover:text-white transition-colors">
                  <span className="text-cyber-cyan">&gt;</span>
                  <span className="truncate">{log}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Command Controls CTAs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 pt-1"
        >
          {/* Recruiter Mode Toggle */}
          <button
            onClick={() => {
              playAudioCue('click');
              setIsRecruiterMode(!isRecruiterMode);
            }}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all hover:scale-102 shadow-lg ${
              isRecruiterMode 
                ? 'bg-cyber-purple text-white shadow-cyber-purple/20' 
                : 'bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-cyan hover:to-cyber-magenta text-slate-950 shadow-cyber-cyan/20'
            }`}
          >
            <UserCheck size={14} className={isRecruiterMode ? 'animate-pulse' : ''} />
            <span>{isRecruiterMode ? 'DISENGAGE RECRUITER_MODE' : 'ENGAGE RECRUITER_MODE'}</span>
          </button>

          {/* Quick PDF download */}
          <button
            onClick={() => {
              playAudioCue('click');
              window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
              addNotification('Initiating resume PDF download stream', 'success');
            }}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-cyber-green/50 bg-white/5 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-all hover:bg-slate-900/60"
          >
            <FileText size={14} className="text-cyber-green" />
            <span>GET RESUME CV</span>
          </button>

          {/* Terminal button */}
          <button
            onClick={() => {
              playAudioCue('click');
              setIsTerminalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-cyber-cyan/50 bg-white/5 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-all hover:bg-slate-900/60"
          >
            <Terminal size={14} className="text-cyber-cyan" />
            <span>VIRTUAL BASH</span>
          </button>
        </motion.div>

      </div>

      {/* Right side: 3D Hologram core (AI Digital Twin Point Cloud) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="lg:col-span-5 h-[350px] lg:h-[450px]"
      >
        <HologramCore />
      </motion.div>

    </div>
  );
};
