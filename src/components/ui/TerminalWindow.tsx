import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import confetti from 'canvas-confetti';

interface TerminalLine {
  text: string;
  type: 'input' | 'system' | 'success' | 'error' | 'info';
}

export const TerminalWindow: React.FC = () => {
  const { playAudioCue } = useOS();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'SANJAI_OS [Version 1.1.0]', type: 'system' },
    { text: 'Loading interface assets... Done.', type: 'system' },
    { text: 'Initializing developer node shell...', type: 'system' },
    { text: 'Type "help" to display standard commands.', type: 'info' }
  ]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    playAudioCue('click');
    const newHistory = [...history, { text: `$ ${input}`, type: 'input' as const }];

    switch (cmd) {
      case 'help':
        newHistory.push(
          { text: 'System terminal helper directory:', type: 'system' },
          { text: '  neofetch   - Display OS specifications and credentials', type: 'info' },
          { text: '  about      - Display brief bio description', type: 'info' },
          { text: '  skills     - Output technology stack registry', type: 'info' },
          { text: '  projects   - Output deployed application catalog', type: 'info' },
          { text: '  education  - Print university academic record', type: 'info' },
          { text: '  contact    - Retrieve developer contact terminals', type: 'info' },
          { text: '  coffee     - Infuse caffeine arpeggios (confetti blast!)', type: 'info' },
          { text: '  hack       - Simulate cyber gateway bypass protocol', type: 'info' },
          { text: '  clear      - Clear command buffer history', type: 'info' }
        );
        break;
      case 'neofetch':
        newHistory.push(
          { text: '  /\\_/\\     SANJAI_OS v1.1.0', type: 'success' },
          { text: ' ( o.o )    OS: React/Vite/TS (WebGL Mode)', type: 'success' },
          { text: '  > ^ <     Uptime: Active & Operational', type: 'success' },
          { text: '            Developer: SANJAIKUMAR P K', type: 'info' },
          { text: '            College: Kongu Engineering College', type: 'info' },
          { text: '            CGPA: 8.05 / 10 (Software Systems)', type: 'info' },
          { text: '            Location: Coimbatore, India', type: 'info' }
        );
        break;
      case 'about':
        newHistory.push(
          { text: 'Extracting profile details...', type: 'success' },
          { text: 'Sanjaikumar P K is a B.Sc. Software Systems graduate (2025) specializing in building context-aware UI/UX flows and robust full-stack software applications (React, TS, Python).', type: 'info' }
        );
        break;
      case 'skills':
        newHistory.push(
          { text: 'Retrieving technical competencies...', type: 'success' },
          { text: 'Frontend: React, TypeScript, TailwindCSS, Framer Motion, JavaScript.', type: 'info' },
          { text: 'Backend & DB: Python, FastAPI, Django, REST APIs, SQL, MongoDB.', type: 'info' },
          { text: 'Cloud & DevOps: Docker, Git, Linux, AWS Practitioner (In Progress).', type: 'info' }
        );
        break;
      case 'projects':
        newHistory.push(
          { text: 'Decrypting software records...', type: 'success' },
          { text: '1. Nova - AI RFP Automator (React/TypeScript Sprints)', type: 'info' },
          { text: '2. Aquarium Commerce - Full Stack Dockerized E-Commerce', type: 'info' },
          { text: '3. Mindwave - Personal AI Life OS (FastAPI/MongoDB)', type: 'info' }
        );
        break;
      case 'education':
        newHistory.push(
          { text: 'Querying educational credentials...', type: 'success' },
          { text: 'Degree: Bachelor of Science in Software Systems (5-year Integrated)', type: 'info' },
          { text: 'College: Kongu Engineering College (Erode, Tamil Nadu)', type: 'info' },
          { text: 'CGPA: 8.05 / 10 (Graduated 2025)', type: 'info' }
        );
        break;
      case 'contact':
        newHistory.push(
          { text: 'Generating secure communication portals:', type: 'success' },
          { text: 'Email: sanjaikumarkaleeswarann@gmail.com', type: 'info' },
          { text: 'GitHub: github.com/sanjaikumarkaleeswaran', type: 'info' },
          { text: 'LinkedIn: linkedin.com/in/sanjaikumarkaleeswaran', type: 'info' }
        );
        break;
      case 'coffee':
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        playAudioCue('success');
        newHistory.push({ text: '☕ Coffee core injected! Code throughput increased by 150%.', type: 'success' });
        break;
      case 'hack':
        confetti({ particleCount: 300, spread: 180, colors: ['#39ff14', '#ff007f'] });
        playAudioCue('success');
        newHistory.push(
          { text: '☠️ SECURITY BREACH SIMULATED...', type: 'error' },
          { text: 'BYPASSING NEURAL INTERFACES... SUCCESS.', type: 'success' },
          { text: 'WELCOME ROOT OPERATOR.', type: 'success' }
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHistory.push({ text: `Unknown mandate: "${cmd}". Type "help" to review directives.`, type: 'error' });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[350px] bg-slate-950/40 rounded-xl overflow-hidden border border-white/5 font-mono text-[11px]">
      {/* Screen Buffer */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scroll bg-black/40 text-slate-300">
        {history.map((line, index) => (
          <div 
            key={index}
            className={`
              ${line.type === 'input' ? 'text-white font-bold' : ''}
              ${line.type === 'system' ? 'text-cyber-purple/80' : ''}
              ${line.type === 'success' ? 'text-cyber-green' : ''}
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
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type terminal command..."
          className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 font-mono text-[11px]"
          autoFocus
        />
      </form>
    </div>
  );
};
