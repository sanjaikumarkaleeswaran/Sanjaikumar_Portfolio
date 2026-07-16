import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Terminal, Cpu, User, Code, Folder, BookOpen, Mail, Volume2, X } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<{
  setIsTerminalOpen: (open: boolean) => void;
  setIsAICopilotOpen: (open: boolean) => void;
  setActiveTab: (tab: any) => void;
}> = ({
  setIsTerminalOpen,
  setIsAICopilotOpen,
  setActiveTab
}) => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    playAudioCue, 
    setActiveWindow,
    isMuted,
    setIsMuted,
    addNotification,
    theme,
    setTheme
  } = useOS();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keybindings for Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        playAudioCue('click');
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  // Audio ticks when moving select index
  useEffect(() => {
    if (isCommandPaletteOpen && selectedIndex >= 0) {
      playAudioCue('dockHover');
    }
  }, [selectedIndex, isCommandPaletteOpen]);

  const commands: CommandItem[] = [
    {
      id: 'go-about',
      title: 'Navigate to: About Bio & Specs',
      category: 'Navigation',
      icon: <User size={14} className="text-cyber-cyan" />,
      action: () => {
        setActiveWindow('about');
        setActiveTab('about');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'go-skills',
      title: 'Navigate to: Skill Matrix & 3D Planetarium',
      category: 'Navigation',
      icon: <Code size={14} className="text-cyber-purple" />,
      action: () => {
        setActiveWindow('skills');
        setActiveTab('skills');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'go-projects',
      title: 'Navigate to: Projects Grid Registry',
      category: 'Navigation',
      icon: <Folder size={14} className="text-cyber-magenta" />,
      action: () => {
        setActiveWindow('projects');
        setActiveTab('projects');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'go-timeline',
      title: 'Navigate to: Experience Timeline',
      category: 'Navigation',
      icon: <BookOpen size={14} className="text-cyber-green" />,
      action: () => {
        setActiveWindow('timeline');
        setActiveTab('timeline');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'go-contact',
      title: 'Navigate to: Contact Hub Transmit',
      category: 'Navigation',
      icon: <Mail size={14} className="text-slate-400" />,
      action: () => {
        setActiveWindow('contact');
        setActiveTab('contact');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'toggle-terminal',
      title: 'Launch Terminal Console Shell',
      category: 'OS Utilities',
      icon: <Terminal size={14} className="text-cyber-cyan" />,
      action: () => {
        setIsTerminalOpen(true);
        setIsCommandPaletteOpen(false);
        addNotification('System Terminal shell launched', 'info');
      }
    },
    {
      id: 'toggle-copilot',
      title: 'Launch Neural AI Assistant Dialog',
      category: 'OS Utilities',
      icon: <Cpu size={14} className="text-cyber-purple" />,
      action: () => {
        setIsAICopilotOpen(true);
        setIsCommandPaletteOpen(false);
        addNotification('AI Copilot connection initialized', 'info');
      }
    },
    {
      id: 'toggle-audio',
      title: isMuted ? 'Unmute Ambient Sound System' : 'Mute Ambient Sound System',
      category: 'System Config',
      icon: <Volume2 size={14} className="text-cyber-green" />,
      action: () => {
        setIsMuted(!isMuted);
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'toggle-theme',
      title: `Cycle System Theme (Current: ${theme.toUpperCase()})`,
      category: 'System Config',
      icon: <Cpu size={14} className="text-yellow-500" />,
      action: () => {
        const nextTheme = theme === 'cyber' ? 'obsidian' : theme === 'obsidian' ? 'matrix' : 'cyber';
        setTheme(nextTheme);
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'trigger-matrix',
      title: 'Initialize Digital Code Rain Matrix',
      category: 'OS Utilities',
      icon: <Terminal size={14} className="text-cyber-green" />,
      action: () => {
        setTheme('matrix');
        setIsCommandPaletteOpen(false);
        addNotification('Matrix theme cascade activated', 'success');
      }
    },
    {
      id: 'download-resume',
      title: 'Transmit & Open CV Resume File',
      category: 'Direct Download',
      icon: <BookOpen size={14} className="text-cyber-green" />,
      action: () => {
        window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
        setIsCommandPaletteOpen(false);
        addNotification('CV Resume download stream initiated', 'success');
      }
    },
    {
      id: 'hire-me',
      title: 'Initiate Secure Recruitment Dispatch (Hire)',
      category: 'Action',
      icon: <Mail size={14} className="text-cyber-magenta" />,
      action: () => {
        setActiveWindow('contact');
        setActiveTab('contact');
        setIsCommandPaletteOpen(false);
        addNotification('Contact node loaded for dispatch', 'info');
      }
    },
    {
      id: 'open-github',
      title: 'Open Developer Github Repository',
      category: 'Social Routing',
      icon: <Code size={14} className="text-cyber-cyan" />,
      action: () => {
        window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'open-linkedin',
      title: 'Open Developer LinkedIn Network',
      category: 'Social Routing',
      icon: <User size={14} className="text-cyber-purple" />,
      action: () => {
        window.open('https://linkedin.com/in/sanjaikumarkaleeswaran', '_blank');
        setIsCommandPaletteOpen(false);
      }
    }
  ];

  // Filter commands
  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation inside list
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        playAudioCue('click');
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCommandPaletteOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Palette Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -10 }}
        className="relative w-full max-w-[500px] border border-white/10 rounded-2xl bg-slate-950/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col font-mono"
        onKeyDown={handleListKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-slate-900/30">
          <Search size={15} className="text-cyber-cyan animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
              playAudioCue('type');
            }}
            placeholder="Type search queries or commands..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 focus:ring-0 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>

        {/* Commands List Area */}
        <div className="max-h-[280px] overflow-y-auto p-2 space-y-1 custom-scroll bg-black/20">
          {filtered.length > 0 ? (
            filtered.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => {
                  playAudioCue('click');
                  cmd.action();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  selectedIndex === index
                    ? 'bg-cyber-cyan/10 border border-cyber-cyan/35 text-white shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                    : 'border border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {cmd.icon}
                  <span className="text-[11px] font-semibold">{cmd.title}</span>
                </div>
                <span className="text-[8px] uppercase tracking-widest font-bold opacity-60 text-slate-500">
                  {cmd.category}
                </span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-slate-600 text-[10px]">
              No database records match current query.
            </div>
          )}
        </div>

        {/* Command instructions bar */}
        <div className="px-4 py-2 border-t border-white/5 bg-slate-950/80 flex justify-between text-[8px] text-slate-600 uppercase select-none">
          <span>↑↓ to navigate</span>
          <span>⏎ to confirm</span>
          <span>esc to close</span>
        </div>
      </motion.div>
    </div>
  );
};
