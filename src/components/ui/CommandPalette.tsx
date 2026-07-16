import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    addNotification
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
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[550px] border border-white/10 rounded-xl bg-slate-950/90 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-mono"
            onKeyDown={handleListKeyDown}
          >
            {/* Input Wrapper */}
            <div className="flex items-center px-4 border-b border-white/5 py-3">
              <Search size={14} className="text-slate-500 mr-2.5" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type command mandate..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-600 focus:ring-0 font-mono"
              />
              <button 
                onClick={() => setIsCommandPaletteOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* List Buffer */}
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5 custom-scroll">
              {filtered.length > 0 ? (
                filtered.map((cmd, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        playAudioCue('click');
                        cmd.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                        isSelected 
                          ? 'bg-white/10 text-cyber-cyan shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] font-bold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cmd.icon}
                        <span className="text-[11px]">{cmd.title}</span>
                      </div>
                      <span className="text-[9px] text-slate-600 uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/5 bg-black/40">
                        {cmd.category}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-slate-600">
                  No matching mandates decoded.
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="px-4 py-2 border-t border-white/5 bg-slate-900/20 text-[9px] text-slate-500 flex items-center justify-between">
              <span>Use ↑↓ keys to navigate, Enter to launch</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
