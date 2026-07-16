import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, User, Code, Folder, BookOpen, Mail, Terminal, Sparkles, FileCode 
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

  const dockItems: DockItem[] = [
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
      id: 'explorer',
      label: 'Code Explorer',
      icon: <FileCode size={16} />,
      action: () => {
        setActiveWindow('explorer');
        setActiveTab('explorer');
      },
      isActive: activeTab === 'explorer'
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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260, delay: 0.5 }}
        className="flex items-center gap-3 px-6 py-3 border border-white/10 rounded-full bg-black/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]"
        onMouseEnter={() => playAudioCue('hover')}
      >
        {dockItems.map((item) => {
          return (
            <React.Fragment key={item.id}>
              {/* Add a divider before the terminal and AI assistant icons */}
              {(item.id === 'terminal') && (
                <div className="w-[1px] h-6 bg-white/10 mx-1" />
              )}
              
              <motion.button
                onClick={(e) => {
                  const pan = (e.clientX / window.innerWidth) * 2 - 1;
                  playAudioCue('click', pan);
                  item.action();
                }}
                onMouseEnter={() => playAudioCue('dockHover')}
                whileHover={{ y: -8, scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-full border transition-all cursor-pointer group flex items-center justify-center ${
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
              </motion.button>
            </React.Fragment>
          );
        })}
      </motion.div>
    </div>
  );
};
