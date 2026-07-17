import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Cpu, User, Code, Folder, BookOpen, Mail, Volume2, X, FileCode, Activity, Globe } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { PROJECTS } from '../../data/projects';

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
    setTheme,
    setIsTourActive,
    setTourStep,
    setIsTourPaused,
    setSelectedProjectId
  } = useOS();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keybindings for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

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
      id: 'go-explorer',
      title: 'Navigate to: VS Code Project Explorer',
      category: 'Navigation',
      icon: <FileCode size={14} className="text-cyber-purple" />,
      action: () => {
        setActiveWindow('explorer');
        setActiveTab('explorer');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'go-metrics',
      title: 'Navigate to: Engineering Performance Metrics',
      category: 'Navigation',
      icon: <Activity size={14} className="text-cyber-magenta" />,
      action: () => {
        setActiveWindow('metrics');
        setActiveTab('metrics');
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
      id: 'guided-tour',
      title: 'Start Recruiter Guided Tour Overview',
      category: 'OS Utilities',
      icon: <Globe size={14} className="text-cyber-cyan animate-pulse" />,
      action: () => {
        setTourStep(0);
        setIsTourPaused(false);
        setIsTourActive(true);
        setIsCommandPaletteOpen(false);
        addNotification('Recruiter guided tour launched!', 'success');
      }
    },
    {
      id: 'theme-cyber',
      title: 'Set Theme: Cyberpunk Neon OS',
      category: 'System Theme',
      icon: <Cpu size={14} className="text-cyber-magenta" />,
      action: () => {
        setTheme('cyber');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'theme-obsidian',
      title: 'Set Theme: Obsidian Minimal Slate',
      category: 'System Theme',
      icon: <Cpu size={14} className="text-slate-400" />,
      action: () => {
        setTheme('obsidian');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'theme-matrix',
      title: 'Set Theme: Digital Matrix Terminal',
      category: 'System Theme',
      icon: <Terminal size={14} className="text-cyber-green" />,
      action: () => {
        setTheme('matrix');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'theme-glass',
      title: 'Set Theme: Translucent Glassmorphism',
      category: 'System Theme',
      icon: <Cpu size={14} className="text-cyber-cyan" />,
      action: () => {
        setTheme('glass');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'theme-blueprint',
      title: 'Set Theme: Developer Blueprint Grid',
      category: 'System Theme',
      icon: <Code size={14} className="text-blue-400" />,
      action: () => {
        setTheme('blueprint');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'theme-recruiter',
      title: 'Set Theme: Recruiter Executive Navy',
      category: 'System Theme',
      icon: <User size={14} className="text-indigo-400" />,
      action: () => {
        setTheme('recruiter');
        setIsCommandPaletteOpen(false);
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
        window.open('https://www.linkedin.com/in/sanjaikumar-kaleeswaran/', '_blank');
        setIsCommandPaletteOpen(false);
      }
    },
    ...PROJECTS.map((proj) => ({
      id: `project-${proj.id}`,
      title: `Open Project: ${proj.title} (${proj.shortDescription})`,
      category: 'Projects',
      icon: <Folder size={14} className="text-cyber-cyan" />,
      action: () => {
        setActiveWindow('projects');
        setActiveTab('projects');
        setSelectedProjectId(proj.id);
        setIsCommandPaletteOpen(false);
      }
    }))
  ];

  // Filter commands
  const filtered = commands.filter((cmd) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    if (cmd.id.startsWith('project-')) {
      const projId = cmd.id.replace('project-', '');
      const proj = PROJECTS.find((p) => p.id === projId);
      if (proj) {
        return (
          proj.title.toLowerCase().includes(query) ||
          proj.shortDescription.toLowerCase().includes(query) ||
          proj.description.toLowerCase().includes(query) ||
          proj.tech.some((t) => t.toLowerCase().includes(query)) ||
          proj.tags.some((t) => t.toLowerCase().includes(query)) ||
          proj.category.toLowerCase().includes(query) ||
          proj.categories.some((c) => c.toLowerCase().includes(query))
        );
      }
    }

    return (
      cmd.title.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query)
    );
  });

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease_both]">
      {/* Backdrop */}
      <div
        onClick={() => setIsCommandPaletteOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Palette Container */}
      <div
        className="relative w-full max-w-[500px] border border-white/10 rounded-2xl bg-slate-950/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col font-mono animate-[paletteSlideIn_0.2s_cubic-bezier(0.34,1.56,0.64,1)_both]"
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
      </div>
    </div>
  );
};
