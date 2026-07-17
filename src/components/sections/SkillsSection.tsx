import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Layers, Calendar } from 'lucide-react';
import { useOS } from '../../context/OSContext';

// Lazy-load the heavy 3D planetarium only when skills tab is open
const TechPlanetarium = lazy(() => import('../canvas/TechPlanetarium').then(m => ({ default: m.TechPlanetarium })));

import { PROJECTS } from '../../data/projects';

interface SkillDetail {
  name: string;
  proficiency: number;
  years: number;
  projects: string[];
}

export const SkillsSection: React.FC = () => {
  const { playAudioCue } = useOS();

  // 1. Gather all tech from projects
  const techCounts: Record<string, { count: number; projects: string[] }> = {};
  PROJECTS.forEach(proj => {
    const allTechs = Array.from(new Set([...(proj.tech || []), ...(proj.technologies || [])]));
    allTechs.forEach(t => {
      let cleanTech = t.trim();
      const lower = cleanTech.toLowerCase();
      if (lower === 'react' || lower === 'react.js') cleanTech = 'React.js';
      else if (lower === 'typescript') cleanTech = 'TypeScript';
      else if (lower === 'javascript') cleanTech = 'JavaScript';
      else if (lower === 'node.js' || lower === 'node') cleanTech = 'Node.js';
      else if (lower === 'express' || lower === 'express.js') cleanTech = 'Express.js';
      else if (lower === 'mongodb') cleanTech = 'MongoDB';
      else if (lower === 'fastapi') cleanTech = 'FastAPI';
      else if (lower === 'postgresql') cleanTech = 'PostgreSQL';
      else if (lower === 'tailwindcss') cleanTech = 'TailwindCSS';
      else if (lower === 'html') cleanTech = 'HTML';
      else if (lower === 'css') cleanTech = 'CSS';
      else if (lower === 'docker' || lower === 'docker compose') cleanTech = 'Docker';
      else if (lower === 'github actions' || lower === 'git pipelines') cleanTech = 'GitHub Actions';
      else if (lower === 'git') cleanTech = 'Git';
      else if (lower === 'rag') cleanTech = 'RAG';
      else if (lower === 'openai api') cleanTech = 'OpenAI API';
      else if (lower === 'rest apis' || lower === 'rest api') cleanTech = 'REST APIs';

      if (!techCounts[cleanTech]) {
        techCounts[cleanTech] = { count: 0, projects: [] };
      }
      techCounts[cleanTech].count++;
      if (!techCounts[cleanTech].projects.includes(proj.title)) {
        techCounts[cleanTech].projects.push(proj.title);
      }
    });
  });

  const getCategoryForTech = (tech: string): string => {
    const t = tech.toLowerCase();
    if (['react.js', 'typescript', 'javascript', 'html', 'css', 'tailwindcss', 'bootstrap', 'framer motion', 'vite'].includes(t)) {
      return 'Frontend';
    }
    if (['node.js', 'express.js', 'fastapi', 'rest apis', 'jwt'].includes(t)) {
      return 'Backend';
    }
    if (['rag', 'vector search', 'openai api', 'sentence-transformers', 'tensorflow', 'keras', 'cnn', 'lstm', 'computer vision', 'algorithms', 'ai', 'llm', 'llms', 'prompt engineering'].includes(t)) {
      return 'AI';
    }
    if (['mongodb', 'postgresql', 'nosql', 'local storage', 'mysql'].includes(t)) {
      return 'Database';
    }
    if (['docker', 'github actions', 'git', 'github', 'devops', 'cicd'].includes(t)) {
      return 'DevOps';
    }
    return 'Languages';
  };

  const getProficiencyAndYears = (tech: string, count: number): { proficiency: number; years: number } => {
    const t = tech.toLowerCase();
    let baseProf = 80;
    let baseYears = 1.5;

    if (t === 'react.js' || t === 'javascript' || t === 'html' || t === 'css') {
      baseProf = 92;
      baseYears = 3;
    } else if (t === 'typescript' || t === 'python') {
      baseProf = 90;
      baseYears = 2.5;
    } else if (t === 'mongodb' || t === 'node.js' || t === 'git') {
      baseProf = 85;
      baseYears = 2.5;
    } else if (t === 'rag' || t === 'openai api') {
      baseProf = 88;
      baseYears = 2;
    } else if (t === 'docker' || t === 'fastapi' || t === 'postgresql') {
      baseProf = 82;
      baseYears = 2;
    }

    const proficiency = Math.min(98, baseProf + (count - 1) * 2);
    const years = parseFloat((baseYears + (count - 1) * 0.5).toFixed(1));

    return { proficiency, years };
  };

  const skillsData: Record<string, SkillDetail[]> = {
    Frontend: [],
    Backend: [],
    AI: [],
    Database: [],
    DevOps: [],
    Languages: []
  };

  Object.entries(techCounts).forEach(([tech, info]) => {
    const cat = getCategoryForTech(tech);
    const { proficiency, years } = getProficiencyAndYears(tech, info.count);
    skillsData[cat].push({
      name: tech,
      proficiency,
      years,
      projects: info.projects
    });
  });

  // Sort by usage frequency (count) descending, then by name
  Object.keys(skillsData).forEach(cat => {
    skillsData[cat].sort((a, b) => {
      const countA = techCounts[a.name]?.count || 0;
      const countB = techCounts[b.name]?.count || 0;
      if (countB !== countA) return countB - countA;
      return a.name.localeCompare(b.name);
    });
  });

  // Filter out empty categories
  const activeCategories = Object.keys(skillsData).filter(cat => skillsData[cat].length > 0);

  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategories.includes('Frontend') ? 'Frontend' : activeCategories[0] || 'Frontend');

  const handleSelectTech = (category: string, _list: string[]) => {
    const mapped: Record<string, string> = {
      'FRONTEND': 'Frontend',
      'BACKEND': 'Backend',
      'DATABASE': 'Database',
      'DEVOPS': 'DevOps',
      'DEVOPS & CLOUD': 'DevOps',
      'UI/UX & COLLAB': 'Languages'
    };
    const norm = mapped[category] || 'Frontend';
    if (activeCategories.includes(norm)) {
      setSelectedCategory(norm);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* 3D Planetarium Canvas panel */}
      <div className="lg:col-span-6 h-[350px] md:h-[420px] relative rounded-2xl border border-white/5 bg-slate-950/20 overflow-hidden">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin" />
          </div>
        }>
          <TechPlanetarium onSelectTech={handleSelectTech} />
        </Suspense>
      </div>

      {/* Selected Tech Detailing Panel */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 border border-white/5 bg-slate-950/45 rounded-2xl min-h-[350px] md:min-h-[420px]">
        
        <div className="space-y-5">
          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-3">
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playAudioCue('click');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.15)]'
                    : 'bg-white/5 border border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skills Lists with Details */}
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1 custom-scroll">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {skillsData[selectedCategory].map((skill) => (
                  <div key={skill.name} className="p-3 border border-white/5 bg-black/30 rounded-xl space-y-2 hover:border-white/10 transition-all group">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <Zap size={10} className="text-cyber-cyan animate-pulse group-hover:text-cyber-magenta transition-colors" />
                        {skill.name}
                      </span>
                      <span className="text-cyber-cyan font-bold">{skill.proficiency}%</span>
                    </div>
                    
                    {/* Interactive Glass Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 p-[0.5px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                      />
                    </div>

                    {/* Metadata: Years & Projects */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[8px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar size={8} />
                        Experience: {skill.years} {skill.years === 1 ? 'Year' : 'Years'}
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-slate-500 flex items-center gap-0.5">
                          <Layers size={8} />
                          Contexts:
                        </span>
                        {skill.projects.map((proj, pIdx) => (
                          <span key={pIdx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300">
                            {proj}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Diagnostic Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[8.5px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-cyber-green" size={12} />
            <span>INTELLIGENT MATRIX COMPILATION // SUCCESS</span>
          </div>
          <span className="text-cyber-purple font-bold tracking-widest">[STAGE_READY]</span>
        </div>

      </div>

    </div>
  );
};
