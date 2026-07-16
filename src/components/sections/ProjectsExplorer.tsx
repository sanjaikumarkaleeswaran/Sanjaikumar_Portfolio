import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, ExternalLink, ShieldAlert, Cpu, Award, X } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface Project {
  id: string;
  title: string;
  category: string;
  tech: string[];
  stats: string;
  desc: string;
  challenge: string;
  solution: string;
  outcome: string;
  github: string;
}

export const ProjectsExplorer: React.FC = () => {
  const { playAudioCue } = useOS();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'nova',
      title: 'Nova AI RFP Platform',
      category: 'AI WORKFLOW AUTOMATION',
      tech: ['React', 'TypeScript', 'TailwindCSS', 'QA Testing', 'Agile'],
      stats: '100% Type-Safe Architecture',
      desc: 'Collaborated in Agile sprints to build modular React + TypeScript UI components with robust validation and workflow systems.',
      challenge: 'Managing complex multi-step form states with nested validation rules across enterprise RFPs without impacting browser performance.',
      solution: 'Designed custom React hooks for form validations, optimized re-renders, and built automated test cases for regressions.',
      outcome: 'Successfully launched a scalable interface that reduced RFP completion timelines and eliminated interface layout errors.',
      github: 'https://github.com/sanjaikumarkaleeswaran'
    },
    {
      id: 'aquarium',
      title: 'Aquarium Commerce',
      category: 'FULL-STACK E-COMMERCE',
      tech: ['React.js', 'REST APIs', 'SQL Database', 'Docker', 'SDLC'],
      stats: '+30% Data Retrieval Efficiency',
      desc: 'Built end-to-end responsive UI across desktop and mobile. Designed user flows from requirement gathering through deployment.',
      challenge: 'Handling sluggish dashboard queries during bulk order updates and inventory synchronizations.',
      solution: 'Redesigned database schemas, added indexing, and normalized query lookup paths. Managed containerized builds using Docker.',
      outcome: 'Optimized SQL queries by ~30%, yielding faster load times and consistent cross-environment staging deployments.',
      github: 'https://github.com/sanjaikumarkaleeswaran'
    },
    {
      id: 'mindwave',
      title: 'Mindwave AI Life OS',
      category: 'PRODUCTIVITY PLATFORM',
      tech: ['Python', 'AI APIs', 'MongoDB', 'NoSQL', 'Modular Architecture'],
      stats: 'Self-Hosted AI Assistant',
      desc: 'Designed context-aware UX flows for task management, goal tracking, and personalized smart reminders with a self-hosted AI-integrated platform.',
      challenge: 'Integrating multiple third-party AI APIs without tight coupling to keep the app scalable.',
      solution: 'Developed a decoupled modular backend using Python and stored flexible document contexts inside MongoDB.',
      outcome: 'A fully functional solo productivity build ready to support new AI agent nodes seamlessly.',
      github: 'https://github.com/sanjaikumarkaleeswaran'
    },
    {
      id: 'ranking',
      title: 'Student Ranking App',
      category: 'DATA ANALYTICS',
      tech: ['Python', 'SQL', 'Algorithms', 'Data Vis', 'Information Arch'],
      stats: 'Role-Based Dashboards',
      desc: 'Developed CRUD-based ranking system with automated CGPA calculation, sorting algorithms, analytics dashboard, and database optimization.',
      challenge: 'Designing a secure information architecture separating student details from admin panels.',
      solution: 'Constructed role-based database query guards and visualized grade statistics using simple data matrices.',
      outcome: 'Ensured student grade privacy while letting administrators sort performance metrics instantly.',
      github: 'https://github.com/sanjaikumarkaleeswaran'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header telemetry info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h3 className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-wider">// PROJECTS_DECK_REGISTRY</h3>
        <span className="font-mono text-[9px] text-slate-500">4 ENTRIES DECRYPTED</span>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={() => {
              playAudioCue('click');
              setSelectedProject(proj);
            }}
            className="p-5 border border-white/5 hover:border-cyber-cyan/40 bg-slate-950/40 hover:bg-slate-900/30 rounded-xl flex flex-col justify-between h-[220px] cursor-pointer transition-all shadow-lg hover:shadow-cyber-cyan/5 group"
          >
            {/* Top row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-cyber-purple font-bold uppercase tracking-widest">{proj.category}</span>
                <span className="font-mono text-[9px] text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 px-2 py-0.5 rounded-full">{proj.stats}</span>
              </div>
              <h4 className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyber-cyan transition-colors">{proj.title}</h4>
              <p className="font-mono text-[10px] text-slate-400 line-clamp-3 leading-relaxed">{proj.desc}</p>
            </div>

            {/* Bottom Row: Tech pills */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2 select-none">
              <div className="flex items-center gap-1.5 overflow-hidden">
                {proj.tech.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="font-mono text-[8px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[9px] text-cyber-cyan group-hover:underline flex items-center gap-1">
                Decrypt info &rarr;
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Projects Modal Details */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[550px] border border-white/10 rounded-2xl bg-slate-950/95 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-5 font-mono"
            >
              {/* Modal Title */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] text-cyber-purple font-bold tracking-widest uppercase">{selectedProject.category}</span>
                  <h3 className="text-sm font-bold text-white mt-1">{selectedProject.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Challenge-Solution-Outcome structure */}
              <div className="space-y-4 text-[11px] leading-relaxed">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyber-magenta font-bold">
                    <ShieldAlert size={12} />
                    <span>TECHNICAL CHALLENGE</span>
                  </div>
                  <p className="text-slate-400 pl-4 border-l border-cyber-magenta/20">{selectedProject.challenge}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyber-cyan font-bold">
                    <Cpu size={12} />
                    <span>IMPLEMENTED SOLUTION</span>
                  </div>
                  <p className="text-slate-400 pl-4 border-l border-cyber-cyan/20">{selectedProject.solution}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyber-green font-bold">
                    <Award size={12} />
                    <span>DEVELOPMENT OUTCOME</span>
                  </div>
                  <p className="text-slate-400 pl-4 border-l border-cyber-green/20">{selectedProject.outcome}</p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-slate-500">Metric Index: {selectedProject.stats}</span>
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playAudioCue('click')}
                  className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-cyber-cyan/50 bg-white/5 text-slate-300 hover:text-cyber-cyan text-[10px] flex items-center gap-1.5 transition-all"
                >
                  <FolderGit2 size={12} />
                  <span>GitHub Repository</span>
                  <ExternalLink size={10} />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
