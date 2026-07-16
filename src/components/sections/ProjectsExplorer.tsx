import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FolderGit2, ExternalLink, ShieldAlert, Cpu, Award, X, Activity, Server, FileText } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { PROJECT_ARCHITECTURES } from '../../data/projectArchitecture';
import type { ArchNode } from '../../data/projectArchitecture';

interface Project {
  id: string;
  title: string;
  category: string;
  tech: string[];
  stats: string;
  metricValue: number;
  metricLabel: string;
  desc: string;
  challenge: string;
  solution: string;
  outcome: string;
  github: string;
  diagramNodes: string[];
}

// 3D Perspective Card Component
const ProjectCard: React.FC<{ project: Project; onClick: (e: React.MouseEvent<HTMLDivElement>) => void }> = ({ project, onClick }) => {
  const { playAudioCue } = useOS();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse positions to rotational degrees
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => playAudioCue('sparkle')}
      onClick={onClick}
      className="p-5 border border-white/5 hover:border-cyber-cyan/40 bg-slate-950/40 hover:bg-slate-900/30 rounded-xl flex flex-col justify-between h-[230px] cursor-pointer transition-all shadow-lg hover:shadow-cyber-cyan/5 group relative overflow-hidden"
    >
      {/* Light spotlight sweep effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />

      {/* Top row */}
      <div className="space-y-2 relative z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-cyber-purple font-bold uppercase tracking-widest">{project.category}</span>
          <span className="font-mono text-[8px] text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 px-2 py-0.5 rounded-full">{project.stats}</span>
        </div>
        <h4 className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyber-cyan transition-colors">{project.title}</h4>
        <p className="font-mono text-[10px] text-slate-400 line-clamp-3 leading-relaxed">{project.desc}</p>
      </div>

      {/* Bottom Row: Tech pills */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2 select-none relative z-10" style={{ transform: 'translateZ(10px)' }}>
        <div className="flex items-center gap-1.5 overflow-hidden">
          {project.tech.slice(0, 3).map((t, idx) => (
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
  );
};

export const ProjectsExplorer: React.FC = () => {
  const { playAudioCue } = useOS();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'specs' | 'diagram' | 'metrics'>('specs');
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);

  // Sync selectedNode when selectedProject or activeModalTab changes
  useEffect(() => {
    if (selectedProject) {
      const nodes = PROJECT_ARCHITECTURES[selectedProject.id] || [];
      setSelectedNode(nodes[0] || null);
    } else {
      setSelectedNode(null);
    }
  }, [selectedProject, activeModalTab]);

  const projects: Project[] = [
    {
      id: 'nova',
      title: 'Nova AI RFP Platform',
      category: 'AI WORKFLOW AUTOMATION',
      tech: ['React', 'TypeScript', 'TailwindCSS', 'QA Testing', 'Agile'],
      stats: '100% Type-Safe Architecture',
      metricValue: 95,
      metricLabel: 'Interface Responsiveness Score',
      desc: 'Collaborated in Agile sprints to build modular React + TypeScript UI components with robust validation and workflow engines.',
      challenge: 'Managing complex multi-step form states with nested validation rules across enterprise RFPs without impacting browser performance.',
      solution: 'Designed custom React hooks for form validations, optimized re-renders, and built automated test cases for regressions.',
      outcome: 'Successfully launched a scalable interface that reduced RFP completion timelines and eliminated interface layout errors.',
      github: 'https://github.com/sanjaikumarkaleeswaran',
      diagramNodes: ['UI Client Workspace', 'RFP State Core', 'Validation Engine', 'Export Transmit']
    },
    {
      id: 'aquarium',
      title: 'Aquarium Commerce',
      category: 'FULL-STACK E-COMMERCE',
      tech: ['React.js', 'REST APIs', 'SQL Database', 'Docker', 'SDLC'],
      stats: '+30% Data Retrieval Efficiency',
      metricValue: 88,
      metricLabel: 'Database Query Throughput',
      desc: 'Built end-to-end responsive UI across desktop and mobile. Designed user flows from requirement gathering through deployment.',
      challenge: 'Handling sluggish dashboard queries during bulk order updates and inventory synchronizations.',
      solution: 'Redesigned database schemas, added indexing, and normalized query lookup paths. Managed containerized builds using Docker.',
      outcome: 'Optimized SQL queries by ~30%, yielding faster load times and consistent cross-environment staging deployments.',
      github: 'https://github.com/sanjaikumarkaleeswaran',
      diagramNodes: ['Nginx Container', 'Node API Services', 'PostgreSQL DB Index', 'Docker Daemon']
    },
    {
      id: 'mindwave',
      title: 'Mindwave AI Life OS',
      category: 'PRODUCTIVITY PLATFORM',
      tech: ['Python', 'AI APIs', 'MongoDB', 'NoSQL', 'Modular Architecture'],
      stats: 'Self-Hosted AI Assistant',
      metricValue: 92,
      metricLabel: 'API Context Injection Speed',
      desc: 'Designed context-aware UX flows for task management, goal tracking, and personalized smart reminders with a self-hosted AI-integrated platform.',
      challenge: 'Integrating multiple third-party AI APIs without tight coupling to keep the app scalable.',
      solution: 'Developed a decoupled modular backend using Python and stored flexible document contexts inside MongoDB.',
      outcome: 'A fully functional solo productivity build ready to support new AI agent nodes seamlessly.',
      github: 'https://github.com/sanjaikumarkaleeswaran',
      diagramNodes: ['Flask/FastAPI Daemon', 'MongoDB Registry', 'External AI Gateways', 'Context Manager']
    },
    {
      id: 'ranking',
      title: 'Student Ranking App',
      category: 'DATA ANALYTICS',
      tech: ['Python', 'SQL', 'Algorithms', 'Data Vis', 'Information Arch'],
      stats: 'Role-Based Dashboards',
      metricValue: 98,
      metricLabel: 'Query Guard Processing Speed',
      desc: 'Developed CRUD-based ranking system with automated CGPA calculation, sorting algorithms, analytics dashboard, and database optimization.',
      challenge: 'Designing a secure information architecture separating student details from admin panels.',
      solution: 'Constructed role-based database query guards and visualized grade statistics using simple data matrices.',
      outcome: 'Ensured student grade privacy while letting administrators sort performance metrics instantly.',
      github: 'https://github.com/sanjaikumarkaleeswaran',
      diagramNodes: ['Role Auth Shield', 'CGPA Sorting Array', 'MySQL Database', 'Admin Analytics Panel']
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
          <ProjectCard
            key={proj.id}
            project={proj}
            onClick={(e) => {
              const pan = (e.clientX / window.innerWidth) * 2 - 1;
              playAudioCue('expand', pan);
              setSelectedProject(proj);
              setActiveModalTab('specs');
            }}
          />
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
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-[620px] border border-white/10 rounded-2xl bg-slate-950/95 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(0,0,0,0.95)] space-y-5 font-mono z-10"
            >
              {/* Modal Title Banner */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
                <div>
                  <span className="text-[9px] text-cyber-purple font-bold tracking-widest uppercase">{selectedProject.category}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedProject.title}</h3>
                </div>
                <button
                  onClick={(e) => {
                    const pan = (e.clientX / window.innerWidth) * 2 - 1;
                    playAudioCue('shutdown', pan);
                    setSelectedProject(null);
                  }}
                  className="p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Operations Navigation Tab Bar */}
              <div className="flex border-b border-white/5 pb-2 gap-3 text-[10px]">
                <button
                  onClick={() => { playAudioCue('click'); setActiveModalTab('specs'); }}
                  className={`flex items-center gap-1.5 pb-1 border-b cursor-pointer transition-all ${
                    activeModalTab === 'specs' ? 'border-cyber-cyan text-cyber-cyan font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <FileText size={11} />
                  <span>SPECIFICATIONS</span>
                </button>
                <button
                  onClick={() => { playAudioCue('click'); setActiveModalTab('diagram'); }}
                  className={`flex items-center gap-1.5 pb-1 border-b cursor-pointer transition-all ${
                    activeModalTab === 'diagram' ? 'border-cyber-purple text-cyber-purple font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Server size={11} />
                  <span>SYSTEM DIAGRAM</span>
                </button>
                <button
                  onClick={() => { playAudioCue('click'); setActiveModalTab('metrics'); }}
                  className={`flex items-center gap-1.5 pb-1 border-b cursor-pointer transition-all ${
                    activeModalTab === 'metrics' ? 'border-cyber-magenta text-cyber-magenta font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Activity size={11} />
                  <span>PERFORMANCE METRICS</span>
                </button>
              </div>

              {/* Dynamic Content Panel */}
              <div className="min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  
                  {/* Tab 1: Specs (Problem, Solution, Outcome) */}
                  {activeModalTab === 'specs' && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4 text-[11px] leading-relaxed"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-cyber-magenta font-bold">
                          <ShieldAlert size={12} />
                          <span>TECHNICAL CHALLENGE</span>
                        </div>
                        <p className="text-slate-400 pl-3.5 border-l border-cyber-magenta/25">{selectedProject.challenge}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-cyber-cyan font-bold">
                          <Cpu size={12} />
                          <span>IMPLEMENTED SOLUTION</span>
                        </div>
                        <p className="text-slate-400 pl-3.5 border-l border-cyber-cyan/25">{selectedProject.solution}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-cyber-green font-bold">
                          <Award size={12} />
                          <span>DEVELOPMENT OUTCOME</span>
                        </div>
                        <p className="text-slate-400 pl-3.5 border-l border-cyber-green/25">{selectedProject.outcome}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: System Architecture Diagram (Interactive Component flow & Spec lookup) */}
                  {activeModalTab === 'diagram' && (
                    <motion.div
                      key="diagram"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <style>{`
                        @keyframes flowPulse {
                          0% { left: 0%; opacity: 0; }
                          10% { opacity: 1; }
                          90% { opacity: 1; }
                          100% { left: 100%; opacity: 0; }
                        }
                      `}</style>
                      <div className="p-4 rounded-xl border border-white/5 bg-slate-950/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">// INTERACTIVE ARCHITECTURE EXPLORER</span>
                          <span className="text-[7px] text-cyber-cyan animate-pulse">● CLICK NODES FOR SPECIFICATION LOOKUP</span>
                        </div>

                        {/* Interactive flow chart row */}
                        <div className="flex items-center justify-around gap-2 py-4 relative bg-black/40 rounded-lg border border-white/5 overflow-hidden min-h-[70px]">
                          {/* Pulsing request flow grid connectors background */}
                          <div className="absolute inset-x-4 h-[1px] bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta opacity-25" />
                          <div 
                            className="absolute h-[2px] bg-cyber-cyan w-24" 
                            style={{ 
                              animationName: 'flowPulse',
                              animationDuration: '3.5s',
                              animationIterationCount: 'infinite',
                              animationTimingFunction: 'linear',
                              boxShadow: '0 0 8px var(--color-cyber-cyan)'
                            }} 
                          />

                          {(PROJECT_ARCHITECTURES[selectedProject.id] || []).map((node) => {
                            const isNodeSelected = selectedNode?.id === node.id;
                            return (
                              <button
                                key={node.id}
                                onClick={(e) => {
                                  const pan = (e.clientX / window.innerWidth) * 2 - 1;
                                  playAudioCue('click', pan);
                                  setSelectedNode(node);
                                }}
                                className={`relative z-10 px-3 py-2 rounded-lg border font-mono text-[9px] text-center transition-all cursor-pointer select-none ${
                                  isNodeSelected
                                    ? 'bg-cyber-purple/10 border-cyber-purple text-white shadow-[0_0_12px_rgba(157,78,221,0.3)] scale-105'
                                    : 'bg-slate-900/90 border-white/10 text-slate-400 hover:border-cyber-cyan/50 hover:text-slate-200'
                                }`}
                              >
                                <div className="text-[7px] text-slate-500 uppercase font-bold mb-0.5">{node.role}</div>
                                <div className="font-semibold">{node.name}</div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Node details lookup board */}
                        {selectedNode && (
                          <motion.div 
                            key={selectedNode.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4.5 rounded-lg border border-white/5 bg-slate-950/90 text-[10px] leading-relaxed text-slate-300 font-mono"
                          >
                            <div className="space-y-2">
                              <div>
                                <span className="text-[7px] text-cyber-cyan uppercase font-bold tracking-wider">[COMPONENT ROLE: {selectedNode.role}]</span>
                                <h4 className="text-slate-100 font-bold text-[11px] mt-0.5">{selectedNode.name}</h4>
                              </div>
                              <p><strong className="text-slate-200">Purpose:</strong> {selectedNode.purpose}</p>
                              <p><strong className="text-slate-200">Tech Stack:</strong> <code className="text-cyber-cyan bg-white/5 px-1 py-0.5 rounded">{selectedNode.tech}</code></p>
                              <p><strong className="text-slate-200">Why Chosen:</strong> {selectedNode.reason}</p>
                            </div>
                            <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/5 pt-2 md:pt-0 md:pl-4">
                              <p><strong className="text-cyber-magenta font-semibold">Trade-offs:</strong> {selectedNode.tradeoffs}</p>
                              <p><strong className="text-cyber-green font-semibold">Performance:</strong> {selectedNode.performance}</p>
                              <p><strong className="text-yellow-500 font-semibold">Security:</strong> {selectedNode.security}</p>
                              <p><strong className="text-purple-400 font-semibold">Scaling Strategy:</strong> {selectedNode.scale}</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Performance Metrics (Animated Gauges) */}
                  {activeModalTab === 'metrics' && (
                    <motion.div
                      key="metrics"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-bold uppercase">{selectedProject.metricLabel}</span>
                            <span className="text-cyber-cyan font-bold">{selectedProject.metricValue}%</span>
                          </div>
                          
                          {/* Interactive diagnostic indicator bar */}
                          <div className="h-2 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden p-[1px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedProject.metricValue}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-[9px] pt-2 border-t border-white/5">
                          <div>
                            <span className="text-slate-500 uppercase">SYSTEM COMPILATION</span>
                            <div className="text-cyber-green font-bold mt-0.5">VERIFIED OK</div>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase">CONTAINER STATUS</span>
                            <div className="text-cyber-purple font-bold mt-0.5">READY FOR DEPLOY</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-slate-500">Metric Index: {selectedProject.stats}</span>
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playAudioCue('click')}
                  className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-cyber-cyan/50 bg-white/5 text-slate-300 hover:text-cyber-cyan text-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
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
