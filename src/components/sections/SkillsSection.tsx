import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Layers, Calendar } from 'lucide-react';
import { useOS } from '../../context/OSContext';

// Lazy-load the heavy 3D planetarium only when skills tab is open
const TechPlanetarium = lazy(() => import('../canvas/TechPlanetarium').then(m => ({ default: m.TechPlanetarium })));

interface SkillDetail {
  name: string;
  proficiency: number;
  years: number;
  projects: string[];
}

export const SkillsSection: React.FC = () => {
  const { playAudioCue } = useOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('Frontend');

  // Organized skills catalog
  const skillsData: Record<string, SkillDetail[]> = {
    Frontend: [
      { name: 'React.js', proficiency: 92, years: 3, projects: ['MindWave AI', 'Aquarium Engine', 'Student Ranker'] },
      { name: 'TypeScript', proficiency: 88, years: 2.5, projects: ['MindWave AI', 'Nova AI RFP'] },
      { name: 'JavaScript', proficiency: 90, years: 4, projects: ['MindWave AI', 'Aquarium Engine'] },
      { name: 'TailwindCSS', proficiency: 92, years: 3, projects: ['Nova AI RFP', 'Portfolio'] },
      { name: 'Framer Motion', proficiency: 80, years: 2, projects: ['Portfolio'] }
    ],
    Backend: [
      { name: 'Node.js', proficiency: 85, years: 3, projects: ['MindWave AI', 'Nova AI RFP'] },
      { name: 'FastAPI', proficiency: 82, years: 2, projects: ['Nova AI RFP'] },
      { name: 'Django', proficiency: 78, years: 1.5, projects: ['Student Ranker'] },
      { name: 'Express.js', proficiency: 84, years: 2.5, projects: ['MindWave AI'] }
    ],
    AI: [
      { name: 'RAG Systems', proficiency: 85, years: 2, projects: ['Portfolio Copilot'] },
      { name: 'LLM Prompting', proficiency: 88, years: 2, projects: ['MindWave AI', 'Nova AI RFP'] },
      { name: 'NLP Similarity', proficiency: 80, years: 1.5, projects: ['Resume Optimizer'] }
    ],
    Cloud: [
      { name: 'AWS (S3/EC2)', proficiency: 70, years: 1.5, projects: ['Nova AI RFP'] },
      { name: 'Netlify / Vercel', proficiency: 88, years: 3, projects: ['Portfolio'] }
    ],
    Database: [
      { name: 'MongoDB', proficiency: 84, years: 2.5, projects: ['MindWave AI'] },
      { name: 'PostgreSQL', proficiency: 80, years: 2, projects: ['Nova AI RFP'] },
      { name: 'MySQL', proficiency: 85, years: 3, projects: ['Student Ranker'] }
    ],
    DevOps: [
      { name: 'Docker / Compose', proficiency: 80, years: 2, projects: ['Nova AI RFP', 'MindWave AI'] },
      { name: 'GitHub Actions', proficiency: 82, years: 2, projects: ['All Repositories'] },
      { name: 'Linux Terminal', proficiency: 85, years: 3, projects: ['Server Deployments'] }
    ],
    Tools: [
      { name: 'VS Code', proficiency: 92, years: 4, projects: ['All Projects'] },
      { name: 'Postman', proficiency: 88, years: 3, projects: ['API Integration'] },
      { name: 'Figma', proficiency: 78, years: 2, projects: ['Wireframes / UI Design'] }
    ],
    Languages: [
      { name: 'Python', proficiency: 88, years: 3.5, projects: ['Student Ranker', 'Nova AI RFP'] },
      { name: 'JavaScript ES6+', proficiency: 90, years: 4, projects: ['All Projects'] },
      { name: 'SQL Querying', proficiency: 85, years: 3, projects: ['Database Systems'] }
    ]
  };

  const handleSelectTech = (category: string, _list: string[]) => {
    // Normalise casing
    const mapped: Record<string, string> = {
      'FRONTEND': 'Frontend',
      'BACKEND': 'Backend',
      'DATABASE': 'Database',
      'DEVOPS': 'DevOps',
      'DESIGN': 'Tools'
    };
    const norm = mapped[category] || 'Frontend';
    setSelectedCategory(norm);
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
            {Object.keys(skillsData).map((cat) => (
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
