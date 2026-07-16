import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import confetti from 'canvas-confetti';

interface TerminalLine {
  text: string;
  type: 'input' | 'system' | 'success' | 'error' | 'info';
}

export const TerminalWindow: React.FC = () => {
  const { playAudioCue, theme, setTheme, sysUptime, addNotification } = useOS();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'SANJAI_OS [Version 2.0.0]', type: 'system' },
    { text: 'Connection Node: Secure guest_node_session established.', type: 'system' },
    { text: 'Type "help" to display operational directives.', type: 'info' }
  ]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = input.trim();
    const cmd = rawInput.toLowerCase();
    if (!cmd) return;

    playAudioCue('return');
    const newHistory = [...history, { text: `$ ${rawInput}`, type: 'input' as const }];
    let hasError = false;

    switch (cmd) {
      case 'help':
        newHistory.push(
          { text: 'Available System Mandates:', type: 'system' },
          { text: '  about        - Profile biography overview', type: 'info' },
          { text: '  cat profile  - Readout profile configuration spec file', type: 'info' },
          { text: '  skills       - Retrieve capability stack database', type: 'info' },
          { text: '  projects     - Decrypt software application records', type: 'info' },
          { text: '  experience   - List development milestones', type: 'info' },
          { text: '  education    - Display academic graduation records', type: 'info' },
          { text: '  resume       - Retrieve copy of professional CV', type: 'info' },
          { text: '  contact      - Display communication access keys', type: 'info' },
          { text: '  github       - Launch GitHub link in new viewport', type: 'info' },
          { text: '  linkedin     - Launch LinkedIn link in new viewport', type: 'info' },
          { text: '  theme        - Toggle OS theme (cyber | obsidian | matrix)', type: 'info' },
          { text: '  system       - Fetch telemetry and hardware uptime diagnostics', type: 'info' },
          { text: '  matrix       - Initialize matrix code stream', type: 'info' },
          { text: '  whoami       - Identify currently authenticated node', type: 'info' },
          { text: '  coffee       - Inject caffeine arpeggio (confetti!)', type: 'info' },
          { text: '  clear        - Clear buffer screen history', type: 'info' }
        );
        break;

      case 'about':
        newHistory.push(
          { text: 'Extracting profile details...', type: 'system' },
          { text: 'Sanjaikumar P K is a Software Systems graduate specializing in modern frontend stacks, modular API layers, and responsive web aesthetics. He designs immersive virtual workspaces and stable cloud apps.', type: 'info' }
        );
        break;

      case 'cat profile':
        newHistory.push(
          { text: '--- PROFILE SPECIFICATION DATA ---', type: 'success' },
          { text: 'IDENTIFIER: Sanjaikumar P K', type: 'info' },
          { text: 'CLASS: Software Engineer // Full-Stack Developer', type: 'info' },
          { text: 'FOCUS: React + TypeScript Interfaces, Python (FastAPI/Django) APIs', type: 'info' },
          { text: 'LOCATION: Coimbatore, Tamil Nadu, India', type: 'info' },
          { text: 'MISSION: Build beautiful, high-efficiency, secure digital experiences.', type: 'info' }
        );
        break;

      case 'skills':
        newHistory.push(
          { text: 'Accessing stack capabilities registry...', type: 'system' },
          { text: 'Frontend: React.js, TypeScript, JavaScript (ES6+), CSS/Tailwind, Framer Motion', type: 'info' },
          { text: 'Backend & DB: Python, FastAPI, Django Rest Framework, SQL, MongoDB', type: 'info' },
          { text: 'DevOps & Pipelines: Docker containerization, Git workflows, Linux admin, AWS Practitioner Modules', type: 'info' }
        );
        break;

      case 'projects':
        newHistory.push(
          { text: 'Decrypting project catalog entries...', type: 'system' },
          { text: '• Nova - AI RFP Automator (TypeScript validations)', type: 'info' },
          { text: '• Aquarium Commerce - Dockerized full-stack store (SQL optimized)', type: 'info' },
          { text: '• Mindwave - Personal AI Life OS (Python FastAPI & MongoDB)', type: 'info' },
          { text: '• Student Ranking App - Role-based analytical grade sorting engine', type: 'info' }
        );
        break;

      case 'experience':
        newHistory.push(
          { text: 'Consulting milestone chronology database...', type: 'system' },
          { text: '2021 - 2025: B.Sc. Software Systems Integrated Degree (Kongu Engineering College)', type: 'info' },
          { text: 'Key Projects: Built AI automation tools, database indexes, and responsive SaaS interfaces during collaborative Agile sprints.', type: 'info' }
        );
        break;

      case 'education':
        newHistory.push(
          { text: 'Opening credentials verification...', type: 'system' },
          { text: 'Graduated: 2025 (Bachelor of Science in Software Systems)', type: 'info' },
          { text: 'Institution: Kongu Engineering College, Erode, Tamil Nadu', type: 'info' },
          { text: 'Academic Standing: CGPA 8.05 / 10 // First Class Honors // No arrears.', type: 'info' }
        );
        break;

      case 'resume':
        newHistory.push(
          { text: 'Establishing secure file stream...', type: 'system' },
          { text: '[SUCCESS] Opening resume document path in new viewport.', type: 'success' }
        );
        window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
        break;

      case 'contact':
        newHistory.push(
          { text: 'Decrypting direct connection points:', type: 'success' },
          { text: 'Email: sanjaikumarkaleeswarann@gmail.com', type: 'info' },
          { text: 'Phone Node: +91-8667010490', type: 'info' },
          { text: 'Address: Coimbatore, Tamil Nadu, India', type: 'info' }
        );
        break;

      case 'github':
        newHistory.push({ text: 'Redirecting port to GitHub interface...', type: 'success' });
        window.open('https://github.com/sanjaikumarkaleeswaran', '_blank');
        break;

      case 'linkedin':
        newHistory.push({ text: 'Redirecting port to LinkedIn interface...', type: 'success' });
        window.open('https://linkedin.com/in/sanjaikumarkaleeswaran', '_blank');
        break;

      case 'theme':
        const nextTheme = theme === 'cyber' ? 'obsidian' : theme === 'obsidian' ? 'matrix' : 'cyber';
        setTheme(nextTheme);
        newHistory.push({ text: `Theme successfully set to: ${nextTheme.toUpperCase()}_OS`, type: 'success' });
        break;

      case 'system':
        newHistory.push(
          { text: '--- HARDWARE UTILITIES STATUS ---', type: 'system' },
          { text: `System Uptime: ${sysUptime}`, type: 'info' },
          { text: 'Active Core: WebGL Cinematic GPU Buffer', type: 'info' },
          { text: 'Active Threads: 8 virtual node logical units', type: 'info' },
          { text: 'Host Theme: ' + theme.toUpperCase() + '_OS', type: 'info' }
        );
        break;

      case 'matrix':
        setTheme('matrix');
        newHistory.push(
          { text: 'Initializing digital rain module...', type: 'success' },
          { text: 'System code streaming active.', type: 'success' }
        );
        addNotification('Matrix mode initiated', 'success');
        break;

      case 'whoami':
        newHistory.push({ text: 'guest_operator@sanjai_portfolio_node // Authenticated recruiter profile', type: 'info' });
        break;

      case 'coffee':
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        playAudioCue('success');
        newHistory.push({ text: '☕ Coffee core injected! Code efficiency boosted by 200%.', type: 'success' });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        hasError = true;
        newHistory.push({ text: `Mandate not recognized: "${rawInput}". Type "help" for options.`, type: 'error' });
    }

    if (hasError) {
      playAudioCue('error');
    } else if (cmd !== 'coffee' && cmd !== 'clear') {
      playAudioCue('success');
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[355px] bg-slate-950/40 rounded-xl overflow-hidden border border-white/5 font-mono text-[11px]">
      {/* Screen Buffer */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scroll bg-black/40 text-slate-300">
        {history.map((line, index) => (
          <div 
            key={index}
            className={`
              ${line.type === 'input' ? 'text-white font-bold' : ''}
              ${line.type === 'system' ? 'text-cyber-purple/80' : ''}
              ${line.type === 'success' ? 'text-cyber-green font-bold' : ''}
              ${line.type === 'error' ? 'text-cyber-magenta font-semibold' : ''}
              ${line.type === 'info' ? 'text-slate-400' : ''}
            `}
          >
            {line.text}
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-slate-950/95 flex items-center">
        <ChevronRight size={14} className="text-cyber-cyan mr-1.5 animate-pulse" />
        <span className="text-cyber-cyan mr-2 font-bold">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            playAudioCue('type');
          }}
          placeholder="Type command (e.g. 'help', 'cat profile')..."
          className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 font-mono text-[11px]"
          autoFocus
        />
      </form>
    </div>
  );
};
