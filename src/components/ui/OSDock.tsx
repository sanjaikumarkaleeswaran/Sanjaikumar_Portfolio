import React from 'react';
import { 
  Home, User, Code, Folder, BookOpen, Mail, Terminal, Sparkles, BarChart2
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  isActive?: boolean;
}

export const OSDock: React.FC<{
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  isAICopilotOpen: boolean;
  setIsAICopilotOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}> = ({
  isTerminalOpen,
  setIsTerminalOpen,
  isAICopilotOpen,
  setIsAICopilotOpen,
  activeTab,
  setActiveTab
}) => {
  const { playAudioCue, setActiveWindow } = useOS();

  // Desktop full dock items
  const desktopDockItems: DockItem[] = [
    {
      id: 'hero',
      label: 'Home',
      icon: <Home size={16} />,
      action: () => {
        setActiveWindow('hero');
        setActiveTab('about');
      },
      isActive: activeTab === 'hero'
    },
    {
      id: 'about',
      label: 'About Specs',
      icon: <User size={16} />,
      action: () => {
        setActiveWindow('about');
        setActiveTab('about');
      },
      isActive: activeTab === 'about'
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Code size={16} />,
      action: () => {
        setActiveWindow('skills');
        setActiveTab('skills');
      },
      isActive: activeTab === 'skills'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Folder size={16} />,
      action: () => {
        setActiveWindow('projects');
        setActiveTab('projects');
      },
      isActive: activeTab === 'projects'
    },
    {
      id: 'metrics',
      label: 'Metrics',
      icon: <BarChart2 size={16} />,
      action: () => {
        setActiveWindow('metrics');
        setActiveTab('metrics');
      },
      isActive: activeTab === 'metrics'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <BookOpen size={16} />,
      action: () => {
        setActiveWindow('timeline');
        setActiveTab('timeline');
      },
      isActive: activeTab === 'timeline'
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mail size={16} />,
      action: () => {
        setActiveWindow('contact');
        setActiveTab('contact');
      },
      isActive: activeTab === 'contact'
    },
    {
      id: 'terminal',
      label: 'Terminal Shell',
      icon: <Terminal size={16} />,
      action: () => {
        setIsTerminalOpen(!isTerminalOpen);
      },
      isActive: isTerminalOpen
    },
    {
      id: 'copilot',
      label: 'Neural Copilot',
      icon: <Sparkles size={16} />,
      action: () => {
        setIsAICopilotOpen(!isAICopilotOpen);
      },
      isActive: isAICopilotOpen
    }
  ];

  // Mobile navigation bottom bar items
  const mobileDockItems: DockItem[] = [
    {
      id: 'hero',
      label: 'Home',
      icon: <Home size={18} />,
      action: () => {
        setActiveWindow('hero');
        setActiveTab('about');
      },
      isActive: activeTab === 'hero'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Folder size={18} />,
      action: () => {
        setActiveWindow('projects');
        setActiveTab('projects');
      },
      isActive: activeTab === 'projects'
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Code size={18} />,
      action: () => {
        setActiveWindow('skills');
        setActiveTab('skills');
      },
      isActive: activeTab === 'skills'
    },
    {
      id: 'copilot',
      label: 'AI Chat',
      icon: <Sparkles size={18} />,
      action: () => {
        setIsAICopilotOpen(!isAICopilotOpen);
      },
      isActive: isAICopilotOpen
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mail size={18} />,
      action: () => {
        setActiveWindow('contact');
        setActiveTab('contact');
      },
      isActive: activeTab === 'contact'
    }
  ];

  return (
    <>
      {/* Desktop / Tablet Floating Dock (Hidden on mobile < 768px) */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-[dockSlideIn_0.6s_cubic-bezier(0.34,1.56,0.64,1)_0.5s_both]">
        <div 
          className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 border border-white/10 rounded-full bg-black/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]"
          onMouseEnter={() => playAudioCue('hover')}
        >
          {desktopDockItems.map((item) => {
            return (
              <React.Fragment key={item.id}>
                {/* Add a divider before the terminal and AI assistant icons */}
                {(item.id === 'terminal') && (
                  <div className="w-[1px] h-6 bg-white/10 mx-1" />
                )}
                
                <button
                  onClick={(e) => {
                    const pan = (e.clientX / window.innerWidth) * 2 - 1;
                    playAudioCue('click', pan);
                    item.action();
                  }}
                  onMouseEnter={() => playAudioCue('dockHover')}
                  className={`relative p-2 lg:p-3 rounded-full border transition-all duration-200 ease-out cursor-pointer group flex items-center justify-center hover:-translate-y-2 hover:scale-110 active:scale-95 ${
                    item.isActive 
                      ? 'bg-cyber-cyan/20 border-cyber-cyan/50 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-100 hover:border-white/20'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  
                  {/* Tooltip Label */}
                  <div className="absolute bottom-14 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-black/90 border border-white/10 font-mono text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>

                  {/* Subtle indicator dot below active applications */}
                  {item.isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyber-cyan shadow-[0_0_4px_#00f0ff]" />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible on mobile only < 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 px-4 py-2 pb-safe flex items-center justify-around select-none">
        {mobileDockItems.map((item) => {
          const isActive = item.isActive;
          return (
            <button
              key={item.id}
              onClick={(e) => {
                const pan = (e.clientX / window.innerWidth) * 2 - 1;
                playAudioCue('click', pan);
                item.action();
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer active:scale-95 ${
                isActive ? 'text-cyber-cyan' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-cyber-cyan/15' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
