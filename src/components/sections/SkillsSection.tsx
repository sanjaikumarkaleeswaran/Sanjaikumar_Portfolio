import React, { useState } from 'react';
import { TechPlanetarium } from '../canvas/TechPlanetarium';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('FRONTEND');
  const [moons, setMoons] = useState<string[]>([
    'React.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 'Framer Motion'
  ]);

  // Skill meters mapping
  const skillValues: Record<string, number> = {
    'React.js': 90,
    'TypeScript': 85,
    'JavaScript': 88,
    'TailwindCSS': 92,
    'Framer Motion': 80,
    'Python': 85,
    'FastAPI': 82,
    'Django': 78,
    'SQL (MySQL/PG)': 85,
    'MongoDB': 80,
    'Docker': 75,
    'AWS Infrastructure': 65,
    'Linux Admin': 70,
    'Git Pipelines': 82,
    'Wireframing': 85,
    'User Flows': 80,
    'Usability Testing': 78,
    'Agile / Jira': 85
  };

  const handleSelectTech = (category: string, list: string[]) => {
    setSelectedCategory(category);
    setMoons(list);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* 3D Planetarium Canvas panel */}
      <div className="lg:col-span-7 h-[400px] md:h-[480px]">
        <TechPlanetarium onSelectTech={handleSelectTech} />
      </div>

      {/* Selected Tech Detailing Panel */}
      <div className="lg:col-span-5 flex flex-col justify-between p-5 border border-white/5 bg-slate-950/45 rounded-xl min-h-[300px] md:min-h-[400px]">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-wider">// SKILLS_REGISTRY</h3>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-cyber-purple/40 text-cyber-purple bg-cyber-purple/5 uppercase font-bold tracking-wider">
              {selectedCategory}
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3.5"
              >
                {moons.map((moon) => {
                  const val = skillValues[moon] || 80;
                  return (
                    <div key={moon} className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <Zap size={10} className="text-cyber-cyan animate-pulse" />
                          {moon}
                        </span>
                        <span className="text-cyber-cyan font-bold">{val}%</span>
                      </div>
                      
                      {/* Interactive Glass Progress Bar */}
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Diagnostic Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center gap-3 font-mono text-[9px] text-slate-500">
          <ShieldCheck className="text-cyber-green" size={14} />
          <span>COMPILING REGISTRY OK // SYSTEMS VERIFIED</span>
        </div>

      </div>

    </div>
  );
};
