import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, ExternalLink, ShieldAlert, Cpu, Award, X, Activity, Server, FileText, 
  Sparkles, Copy, Check, Play, RefreshCw, ArrowRight 
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { getAllProjects, getRelatedProjects, getUniqueTechnologies } from '../../data/projects';
import type { ProjectData, ArchNode } from '../../types/project';

// ─── REDESIGNED LARGE PREMIUM PROJECT CARD ───────────────────────────────────
const ProjectCard: React.FC<{ 
  project: ProjectData; 
  onInspect: (tab: 'specs' | 'diagram' | 'metrics' | 'docs') => void;
}> = ({ project, onInspect }) => {
  const { playAudioCue } = useOS();

  return (
    <div className="p-6 border border-white/10 hover:border-cyber-cyan/45 bg-slate-950/65 rounded-2xl flex flex-col justify-between gap-5 transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.06)] group relative overflow-hidden">
      {/* Light spotlight sweep effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />

      {/* Cover image or abstract themed gradient */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/5 bg-slate-900 select-none">
        {project.coverImage ? (
          <img 
            src={project.coverImage} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyber-cyan/10 via-cyber-purple/5 to-cyber-magenta/10 flex items-center justify-center">
            <FolderGit2 className="text-white/20 animate-pulse" size={32} />
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[8px] text-cyber-cyan uppercase font-bold tracking-wider font-mono">
          {project.category}
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[8px] text-cyber-purple uppercase font-bold tracking-wider font-mono">
          {project.status}
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-1">
        <h4 className="text-base font-bold text-white group-hover:text-cyber-cyan transition-colors font-sans">{project.title}</h4>
        <div className="text-[10px] text-slate-400 font-mono">Role: <strong>{project.role}</strong> ({project.duration})</div>
      </div>

      {/* AI focus explanation summary */}
      <div className="p-3.5 rounded-xl border border-cyber-cyan/15 bg-cyber-cyan/5 text-[9.5px] text-cyber-cyan leading-relaxed font-mono relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 text-[7px] text-cyber-cyan/45 font-bold">AI_DECODER</div>
        <Sparkles size={11} className="inline mr-1.5 text-cyber-cyan shrink-0 animate-pulse" />
        <span>{project.aiSummary}</span>
      </div>

      {/* STAR brief (Problem, Solution, Impact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[9.5px] font-mono py-1">
        <div className="space-y-1 border-l border-cyber-magenta/30 pl-2.5">
          <span className="text-cyber-magenta font-bold block text-[8px] uppercase tracking-wider">CHALLENGE (PROBLEM)</span>
          <p className="text-slate-400 line-clamp-3 leading-normal font-sans">{project.challenges}</p>
        </div>
        <div className="space-y-1 border-l border-cyber-cyan/30 pl-2.5">
          <span className="text-cyber-cyan font-bold block text-[8px] uppercase tracking-wider">ACTION (SOLUTION)</span>
          <p className="text-slate-400 line-clamp-3 leading-normal font-sans">{project.solutions}</p>
        </div>
        <div className="space-y-1 border-l border-cyber-green/30 pl-2.5">
          <span className="text-cyber-green font-bold block text-[8px] uppercase tracking-wider">OUTCOME (IMPACT)</span>
          <p className="text-slate-400 line-clamp-3 leading-normal font-sans">{project.lessons}</p>
        </div>
      </div>

      {/* Systems Telemetry Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] font-mono bg-black/30 p-2.5 rounded-xl border border-white/5">
        <div>
          <span className="text-slate-500 block text-[7px] uppercase">SCORE</span>
          <span className="text-white font-bold">{project.metrics.value}% ({project.metrics.label.split(' ')[0]})</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[7px] uppercase">LATENCY</span>
          <span className="text-cyber-cyan font-bold">{project.metrics.latency || 'N/A'}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[7px] uppercase">THROUGHPUT</span>
          <span className="text-cyber-purple font-bold">{project.metrics.throughput || 'N/A'}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[7px] uppercase">ERROR RATIO</span>
          <span className="text-cyber-green font-bold">{project.metrics.errorRate || 'N/A'}</span>
        </div>
      </div>

      {/* Technologies pills */}
      <div className="flex flex-wrap items-center gap-1.5 select-none">
        {project.tech.map((t, idx) => (
          <span key={idx} className="font-mono text-[8px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
            {t}
          </span>
        ))}
      </div>

      {/* Interactive Inspector Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-white/5">
        <div className="flex gap-2">
          <button 
            onClick={() => { playAudioCue('click'); onInspect('diagram'); }}
            className="px-3 py-1.5 rounded-lg border border-cyber-cyan/35 bg-cyber-cyan/5 text-cyber-cyan hover:bg-cyber-cyan/15 text-[9.5px] font-bold font-mono flex items-center gap-1 cursor-pointer transition-all"
          >
            <Server size={10} />
            <span>Interactive Architecture</span>
          </button>
          
          <button 
            onClick={() => { playAudioCue('click'); onInspect('docs'); }}
            className="px-3 py-1.5 rounded-lg border border-cyber-green/35 bg-cyber-green/5 text-cyber-green hover:bg-cyber-green/15 text-[9.5px] font-bold font-mono flex items-center gap-1 cursor-pointer transition-all"
          >
            <Sparkles size={10} />
            <span>AI STAR Docs</span>
          </button>
        </div>

        <div className="flex gap-2">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => playAudioCue('click')}
            className="p-2 rounded-lg border border-white/5 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            title="GitHub Repository"
          >
            <FolderGit2 size={13} />
          </a>
          
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              onClick={() => playAudioCue('click')}
              className="p-2 rounded-lg border border-white/5 hover:border-cyber-cyan/50 bg-white/5 text-slate-400 hover:text-cyber-cyan flex items-center justify-center transition-all"
              title="Live Demo Simulator"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

    </div>
  );
};

export const ProjectsExplorer: React.FC = () => {
  const { playAudioCue, addNotification } = useOS();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor resize
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  
  // Filtering States
  const [techList, setTechList] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal tab management
  const [activeModalTab, setActiveModalTab] = useState<'specs' | 'diagram' | 'metrics' | 'docs'>('specs');
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ArchNode | null>(null);

  // AI documentation subtabs
  const [activeDocSubTab, setActiveDocSubTab] = useState<'star' | 'readme' | 'pitch' | 'qa'>('star');
  const [isCopied, setIsCopied] = useState(false);

  // Request flow animation states
  const [isFlowAnimating, setIsFlowAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationLogs, setAnimationLogs] = useState<{ time: string; msg: string; type: string }[]>([]);
  const [activeFlowComponent, setActiveFlowComponent] = useState<string | null>(null);
  
  const animIntervalRef = useRef<number | null>(null);

  // Load projects from registry
  useEffect(() => {
    const data = getAllProjects();
    setProjects(data);
    setFilteredProjects(data);
    setTechList(getUniqueTechnologies());
  }, []);

  // Filter logic
  useEffect(() => {
    let result = projects;
    if (selectedTech !== 'All') {
      result = result.filter(p => p.tech.includes(selectedTech));
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    setFilteredProjects(result);
  }, [selectedTech, selectedCategory, projects]);

  // Reset nodes on project/tab change
  useEffect(() => {
    if (selectedProject) {
      const nodes = selectedProject.architecture || [];
      setSelectedNode(nodes[0] || null);
    } else {
      setSelectedNode(null);
    }
    stopFlowAnimation();
  }, [selectedProject, activeModalTab]);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const stopFlowAnimation = () => {
    if (animIntervalRef.current) {
      window.clearInterval(animIntervalRef.current);
      animIntervalRef.current = null;
    }
    setIsFlowAnimating(false);
    setAnimationStep(0);
    setActiveFlowComponent(null);
  };

  const startFlowAnimation = () => {
    if (isFlowAnimating) {
      stopFlowAnimation();
      return;
    }
    
    playAudioCue('click');
    setIsFlowAnimating(true);
    setAnimationStep(1);
    setAnimationLogs([]);
    
    const requestFlow = selectedProject?.metrics?.requestFlow || [];
    const logsList: { time: string; msg: string; type: string; nodeRole: string }[] = [
      { time: '00:00.00', msg: `INITIATING TRANSACTION PATH FOR ${selectedProject?.title.toUpperCase()}...`, type: 'info', nodeRole: 'Frontend' }
    ];

    requestFlow.forEach((flowStep, idx) => {
      const matchingNode = selectedProject?.architecture?.find(
        n => n.name.toLowerCase() === flowStep.to.toLowerCase() ||
             n.role.toLowerCase() === flowStep.to.toLowerCase() ||
             n.name.toLowerCase().includes(flowStep.to.toLowerCase().split(' ')[0]) ||
             n.role.toLowerCase().includes(flowStep.to.toLowerCase().split(' ')[0])
      );

      logsList.push({
        time: `00:00.${((idx + 1) * 12).toString().padStart(2, '0')}`,
        msg: `TRANSMIT [${flowStep.type.toUpperCase()}]: ${flowStep.label} (${flowStep.from} -> ${flowStep.to})`,
        type: flowStep.type,
        nodeRole: matchingNode ? matchingNode.role : flowStep.to
      });
    });

    logsList.push({
      time: `00:00.${((requestFlow.length + 1) * 12).toString().padStart(2, '0')}`,
      msg: `TRANSACTION FINALIZED: Output compiled successfully.`,
      type: 'success',
      nodeRole: 'Frontend'
    });

    let currentStep = 1;
    setAnimationLogs([logsList[0]]);
    
    const nodes = selectedProject?.architecture || [];
    const feNode = nodes.find(n => n.role.toLowerCase() === 'frontend');
    if (feNode) setActiveFlowComponent(feNode.id);

    animIntervalRef.current = window.setInterval(() => {
      currentStep++;
      setAnimationStep(currentStep);
      
      if (currentStep <= logsList.length) {
        setAnimationLogs(prev => [...prev, logsList[currentStep - 1]]);
        const nextLog = logsList[currentStep - 1];
        const nextNode = nodes.find(
          n => n.role.toLowerCase() === nextLog.nodeRole.toLowerCase() ||
               n.name.toLowerCase().includes(nextLog.nodeRole.toLowerCase())
        );
        if (nextNode) {
          setActiveFlowComponent(nextNode.id);
        }
        playAudioCue('sparkle');
      } else {
        stopFlowAnimation();
        playAudioCue('success');
        addNotification('System transaction simulation complete!', 'success');
      }
    }, 950);
  };

  const copyDocToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    playAudioCue('success');
    addNotification('Document copied to clipboard', 'success');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Compile project document options
  const generateDocContent = (): { title: string; body: string } => {
    if (!selectedProject) return { title: '', body: '' };
    const p = selectedProject;

    switch (activeDocSubTab) {
      case 'star':
        return {
          title: `STAR Interview Framework: ${p.title}`,
          body: `# STAR Interview Guide - ${p.title}
## ROLE: ${p.role} | DURATION: ${p.duration}

### 1. SITUATION (CONTEXT)
${p.challenges}

### 2. TASK (OBJECTIVE)
Deploy a high-performance solution that handles secure authentication, guarantees low latency thresholds, and maintains clean code structure under the ${p.role} role.

### 3. ACTION (SOLUTION)
${p.solutions}
Implemented modular system blocks composed of:
${p.architecture.map(n => `- **${n.name}** (${n.role}): Using ${n.tech}.`).join('\n')}

### 4. RESULT (IMPACT)
${p.lessons}
Key Metric: ${p.metrics.label} of ${p.metrics.value}%.

### 5. FUTURE ROADMAP & IMPROVEMENTS
${p.futureWork}`
        };
      case 'readme':
        return {
          title: `Technical README.md: ${p.title}`,
          body: `# ${p.title}
> ${p.shortDescription}

## 📊 Deployment Specifications
- **Status:** ${p.status}
- **Database Backend:** ${p.database || 'None'}
- **Auth Guard:** ${p.authentication || 'None'}
- **Infrastructure Target:** ${p.deployment || 'None'}

## 🛠️ Technology capability Stack
- **Core Languages:** TypeScript, Python, Javascript, SQL
- **Ecosystem:** ${p.tech.join(', ')}

## 🏗️ Architecture Design Details
${p.architecture.map(n => `### ${n.name} (${n.role})
- **Tech Stack:** ${n.tech}
- **Role Purpose:** ${n.purpose}
- **Engineering Decision:** ${n.reason}
- **Security Control:** ${n.security}`).join('\n\n')}`
        };
      case 'pitch':
        return {
          title: `Elevator Pitch: ${p.title}`,
          body: `## 30-Second Recruiter Pitch
"I engineered **${p.title}**, which is a ${p.shortDescription.toLowerCase()}
As the **${p.role}**, the main challenge was: *${p.challenges}*

I resolved this using **${p.tech.slice(0, 3).join(', ')}** architecture, which optimized latency down to **${p.metrics.latency || '25ms'}** and achieved a **${p.metrics.label} of ${p.metrics.value}%**. 

This demonstrates my ability to coordinate full-stack databases, Docker containers, and high-performance React panels."`
        };
      case 'qa':
        return {
          title: `Technical Q&A Cheat Sheet: ${p.title}`,
          body: `# Technical Mock Interview Q&As: ${p.title}

### Q1: What was the primary technical challenge on ${p.title}?
**Answer:** The primary hurdle was: *${p.challenges}*. I designed a custom architecture to isolate heavy tasks and run calculations asynchronously.

### Q2: Why did you choose these specific architecture frameworks?
**Answer:** I chose:
${p.architecture.map(n => `- **${n.name} (${n.tech})**: Chosen because ${n.reason}.`).join('\n')}

### Q3: What trade-offs did you face during development?
**Answer:** The trade-offs included:
${p.architecture.map(n => `- **${n.name}**: ${n.tradeoffs}`).join('\n')}

### Q4: How did you optimize latency and throughput?
**Answer:** We achieved a latency of **${p.metrics.latency || 'N/A'}** and throughput of **${p.metrics.throughput || 'N/A'}** by applying:
${p.architecture.map(n => `- **${n.name}**: ${n.performance}`).join('\n')}`
        };
      default:
        return { title: '', body: '' };
    }
  };

  const currentDoc = generateDocContent();

  return (
    <div className="space-y-6">
      
      {/* Header filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-wider">// SYSTEM_PROJECTS_REGISTRY</h3>
          <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
            {filteredProjects.length} OF {projects.length} INSTALLED
          </span>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 text-[9px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">CATEGORY:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => { playAudioCue('click'); setSelectedCategory(e.target.value); }}
              className="bg-black/90 border border-white/10 text-cyber-cyan rounded px-2 py-0.5 focus:outline-none focus:border-cyber-cyan cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">TECHNOLOGY:</span>
            <select 
              value={selectedTech}
              onChange={(e) => { playAudioCue('click'); setSelectedTech(e.target.value); }}
              className="bg-black/90 border border-white/10 text-cyber-purple rounded px-2 py-0.5 focus:outline-none focus:border-cyber-purple cursor-pointer max-w-[120px]"
            >
              <option value="All">ALL TECH</option>
              {techList.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Premium Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-xl font-mono text-[10px] text-slate-500 md:col-span-2">
            NO COMPILED PROJECTS MATCH THE ACTIVE SELECTIONS
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onInspect={(tab) => {
                setSelectedProject(proj);
                setActiveModalTab(tab);
              }}
            />
          ))
        )}
      </div>

      {/* Project Inspector Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-[680px] border border-white/10 rounded-2xl bg-slate-950/95 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(0,0,0,0.95)] space-y-5 font-mono z-10"
            >
              {/* Header Title */}
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
                  aria-label="Close modal"
                  className="p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation Tab Bar */}
              <div className="flex border-b border-white/5 pb-2 gap-3.5 text-[10px] overflow-x-auto select-none custom-scroll">
                {[
                  { id: 'specs', label: 'SPECIFICATIONS', icon: <FileText size={11} />, color: 'border-cyber-cyan text-cyber-cyan' },
                  { id: 'diagram', label: 'INTERACTIVE ARCHITECTURE', icon: <Server size={11} />, color: 'border-cyber-purple text-cyber-purple' },
                  { id: 'metrics', label: 'TELEMETRY METRICS', icon: <Activity size={11} />, color: 'border-cyber-magenta text-cyber-magenta' },
                  { id: 'docs', label: 'AI DOC GENERATOR', icon: <Sparkles size={11} />, color: 'border-cyber-green text-cyber-green' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { playAudioCue('click'); setActiveModalTab(t.id as any); }}
                    className={`flex items-center gap-1.5 pb-1.5 border-b cursor-pointer transition-all shrink-0 ${
                      activeModalTab === t.id ? `${t.color} font-bold` : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content Panels */}
              <div className="min-h-[290px] max-h-[380px] overflow-y-auto custom-scroll pr-1">
                
                {/* Tab 1: Specs */}
                {activeModalTab === 'specs' && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4 text-[11px] leading-relaxed"
                  >
                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-3.5 text-[10px]">
                      <div>
                        <span className="text-slate-500 uppercase">ROLE POSITION</span>
                        <div className="text-white font-bold">{selectedProject.role}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 uppercase">DURATION TARGET</span>
                        <div className="text-white font-bold">{selectedProject.duration}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-cyber-magenta font-bold">
                        <ShieldAlert size={12} />
                        <span>SITUATION / PROBLEM CHALLENGE</span>
                      </div>
                      <p className="text-slate-400 pl-3.5 border-l border-cyber-magenta/25 font-sans">{selectedProject.challenges}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-cyber-cyan font-bold">
                        <Cpu size={12} />
                        <span>IMPLEMENTED SOLUTION ACTIONS</span>
                      </div>
                      <p className="text-slate-400 pl-3.5 border-l border-cyber-cyan/25 font-sans">{selectedProject.solutions}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-cyber-green font-bold">
                        <Award size={12} />
                        <span>OUTCOME RESULTS & IMPACTS</span>
                      </div>
                      <p className="text-slate-400 pl-3.5 border-l border-cyber-green/25 font-sans">{selectedProject.lessons}</p>
                    </div>

                    {/* Related projects */}
                    <div className="border-t border-white/5 pt-4 mt-4 space-y-2.5">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">RELATED CONTEXTUAL BUILDS</span>
                      <div className="grid grid-cols-2 gap-3">
                        {getRelatedProjects(selectedProject).map((rp) => (
                          <div 
                            key={rp.id}
                            role="button"
                            onClick={() => { playAudioCue('click'); setSelectedProject(rp); setActiveModalTab('specs'); }}
                            className="p-2 border border-white/5 bg-slate-900/30 rounded-lg hover:border-cyber-purple/50 cursor-pointer flex justify-between items-center transition-all group"
                          >
                            <div className="truncate pr-2">
                              <div className="text-[10px] text-white font-bold truncate group-hover:text-cyber-purple transition-colors">{rp.title}</div>
                              <div className="text-[7.5px] text-slate-500 uppercase truncate">{rp.category}</div>
                            </div>
                            <ArrowRight size={10} className="text-slate-500 shrink-0 group-hover:translate-x-1 transition-transform" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: Interactive Architecture Diagram */}
                {activeModalTab === 'diagram' && (
                  <motion.div
                    key="diagram"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl border border-white/5 bg-slate-950/80 space-y-4">
                      {isMobile ? (
                        <div className="space-y-4">
                          <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">// ARCHITECTURE COMPONENTS</div>
                          
                          {/* Mini Grid representation for mobile */}
                          <div className="grid grid-cols-2 gap-2">
                            {selectedProject.architecture.map((node) => {
                              const isNodeSelected = selectedNode?.id === node.id;
                              return (
                                <button
                                  key={node.id}
                                  onClick={() => {
                                    playAudioCue('click');
                                    setSelectedNode(node);
                                  }}
                                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                                    isNodeSelected 
                                      ? 'border-cyber-purple bg-cyber-purple/10 text-white shadow-[0_0_10px_rgba(157,78,221,0.2)]'
                                      : 'border-white/5 bg-slate-900/30 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  <span className="text-[6px] text-slate-500 uppercase tracking-wider font-mono">{node.role}</span>
                                  <span className="font-bold text-[9px] truncate w-full font-mono">{node.name}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Details stacked below */}
                          {selectedNode && (
                            <motion.div
                              key={selectedNode.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3.5 border border-white/5 rounded-lg bg-slate-950/70 text-[9px] leading-relaxed text-slate-300 space-y-2 text-left"
                            >
                              <div className="text-cyber-purple font-bold text-[8px] uppercase tracking-wider">// COMPONENT SPEC: {selectedNode.role.toUpperCase()}</div>
                              <p><strong className="text-slate-100">Name:</strong> {selectedNode.name}</p>
                              <p><strong className="text-slate-100">Purpose:</strong> {selectedNode.purpose}</p>
                              <p><strong className="text-slate-100">Tech:</strong> <code className="text-cyber-cyan bg-white/5 px-1 py-0.5 rounded">{selectedNode.tech}</code></p>
                              <p><strong className="text-cyber-magenta font-semibold">Trade-offs:</strong> {selectedNode.tradeoffs}</p>
                              <p><strong className="text-cyber-cyan font-semibold">Performance:</strong> {selectedNode.performance}</p>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <div className="flex flex-col">
                              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">// INTERACTIVE ARCHITECTURE PLAYGROUND</span>
                              <span className="text-[7.5px] text-cyber-cyan">Hover nodes to inspect specifications • Click to lock selection</span>
                            </div>
                            <button
                              onClick={startFlowAnimation}
                              className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                isFlowAnimating 
                                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse' 
                                  : 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                              }`}
                            >
                              {isFlowAnimating ? <RefreshCw size={9} className="animate-spin" /> : <Play size={9} />}
                              <span>{isFlowAnimating ? 'HALT SIMULATION' : 'RUN PIPELINE SIMULATION'}</span>
                            </button>
                          </div>

                          {/* Interactive Canvas Grid representing Node Flow */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative py-6 bg-slate-950/90 rounded-xl border border-white/5 p-4 min-h-[110px] items-center justify-center">
                            
                            {/* Directional Connector Flow Line */}
                            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta opacity-15 hidden md:block" />
                            
                            {selectedProject.architecture.map((node, index) => {
                              const isNodeSelected = selectedNode?.id === node.id;
                              const isNodeHovered = hoveredNode?.id === node.id;
                              const isFlowActive = activeFlowComponent === node.id;
                              
                              let colorClass = 'border-white/10 hover:border-cyber-cyan/40 text-slate-400';
                              let bgClass = 'bg-slate-900/40';
                              
                              if (isNodeSelected || isNodeHovered) {
                                colorClass = 'border-cyber-purple text-white shadow-[0_0_12px_rgba(157,78,221,0.25)] scale-102';
                                bgClass = 'bg-cyber-purple/10';
                              }
                              
                              if (isFlowActive) {
                                colorClass = 'border-cyber-cyan text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105';
                                bgClass = 'bg-cyber-cyan/15 animate-pulse';
                              }

                              return (
                                <div key={node.id} className="relative flex items-center w-full">
                                  <button
                                    onClick={() => {
                                      playAudioCue('click');
                                      setSelectedNode(node);
                                    }}
                                    onMouseEnter={() => setHoveredNode(node)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    className={`relative z-10 p-3.5 w-full rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${colorClass} ${bgClass}`}
                                  >
                                    <div className="text-[6.5px] text-slate-500 uppercase font-bold mb-0.5 tracking-wider font-mono">{node.role}</div>
                                    <div className="font-bold text-[10px] truncate w-full font-mono">{node.name}</div>
                                  </button>

                                  {/* Right side connection arrow index */}
                                  {index < selectedProject.architecture.length - 1 && (
                                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-20 text-[8px] text-slate-600 font-bold hidden md:block">
                                      →
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Dynamic Simulation Telemetry / Console Side-by-side Panel */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Live Telemetry monitor panel */}
                            <div className="p-3 bg-black/50 rounded-xl border border-white/5 font-mono text-[9px] text-slate-300 space-y-2">
                              <div className="text-cyber-cyan font-bold border-b border-white/5 pb-1 flex items-center justify-between">
                                <span>// LIVE PIPELINE TELEMETRY</span>
                                {isFlowAnimating && <span className="text-[7.5px] text-cyber-green animate-pulse">RUNNING</span>}
                              </div>
                              <div className="grid grid-cols-3 gap-2 py-1">
                                <div className="p-1.5 rounded bg-white/5 border border-white/5">
                                  <span className="text-slate-500 block text-[6.5px] uppercase">LATENCY</span>
                                  <span className="text-cyber-cyan font-bold font-mono">
                                    {isFlowAnimating 
                                      ? `${(12 + animationStep * 4.5).toFixed(0)} ms` 
                                      : (hoveredNode || selectedNode) ? `${selectedProject.metrics.latency}` : '0 ms'}
                                  </span>
                                </div>
                                <div className="p-1.5 rounded bg-white/5 border border-white/5">
                                  <span className="text-slate-500 block text-[6.5px] uppercase">HTTP STATUS</span>
                                  <span className="text-cyber-green font-bold">200 OK</span>
                                </div>
                                <div className="p-1.5 rounded bg-white/5 border border-white/5">
                                  <span className="text-slate-500 block text-[6.5px] uppercase">PAYLOAD</span>
                                  <span className="text-white truncate block">
                                    {isFlowAnimating 
                                      ? `size: ${(256 + animationStep * 64)}B` 
                                      : (hoveredNode || selectedNode) ? '256B payload' : '0B'}
                                  </span>
                                </div>
                                <div className="p-1.5 rounded bg-white/5 border border-white/5">
                                  <span className="text-slate-500 block text-[6.5px] uppercase">CACHE STATE</span>
                                  <span className={isFlowAnimating && animationStep > 3 ? 'text-cyber-green font-bold' : 'text-yellow-500'}>
                                    {isFlowAnimating && animationStep > 3 ? 'HIT' : 'MISS'}
                                  </span>
                                </div>
                                <div className="p-1.5 rounded bg-white/5 border border-white/5">
                                  <span className="text-slate-500 block text-[6.5px] uppercase">JWT HEADER</span>
                                  <span className="text-cyber-purple font-bold">VERIFIED</span>
                                </div>
                                <div className="p-1.5 rounded bg-white/5 border border-white/5">
                                  <span className="text-slate-500 block text-[6.5px] uppercase">FLOW STAGE</span>
                                  <span className="text-cyber-magenta font-bold">
                                    {isFlowAnimating ? `${animationStep}/${(selectedProject.metrics?.requestFlow?.length || 0) + 2}` : 'IDLE'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Telemetry logs terminal */}
                            <div className="p-3 bg-black/85 rounded-xl border border-white/5 font-mono text-[9px] text-slate-400 space-y-1 h-[110px] overflow-y-auto custom-scroll">
                              <div className="text-cyber-cyan border-b border-white/5 pb-1 mb-1 font-bold flex items-center justify-between">
                                <span>TELEMETRY TRANSACTION LOGS:</span>
                                <span className="text-[7px] text-slate-600">Piped via OS Console</span>
                              </div>
                              {isFlowAnimating ? (
                                animationLogs.map((log, idx) => (
                                  <div key={idx} className="flex gap-1.5 items-center">
                                    <span className="text-slate-600">[{log.time}]</span>
                                    <span className="text-cyber-cyan">&gt;</span>
                                    <span className={log.type === 'success' ? 'text-cyber-green' : log.type === 'auth' ? 'text-cyber-purple' : log.type === 'ai' ? 'text-cyber-magenta' : 'text-slate-300'}>
                                      {log.msg}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-slate-600 text-center py-5 italic">Press "RUN PIPELINE SIMULATION" above to watch active transactions process.</div>
                              )}
                            </div>
                          </div>

                          {/* Selected / Hovered Node Detailed Specifications Inspector */}
                          {(hoveredNode || selectedNode) && (
                            <motion.div 
                              key={(hoveredNode || selectedNode)?.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4.5 p-4.5 rounded-xl border border-white/5 bg-slate-950/90 text-[10px] leading-relaxed text-slate-300 relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl bg-cyber-purple/20 text-[7px] text-cyber-purple font-mono uppercase font-bold">
                                {hoveredNode ? 'Quick Inspect' : 'Locked Spec'}
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <span className="text-[7.5px] text-cyber-cyan uppercase font-bold tracking-wider">[ROLE: {(hoveredNode || selectedNode)?.role}]</span>
                                  <h4 className="text-slate-100 font-bold text-[11px] mt-0.5">{(hoveredNode || selectedNode)?.name}</h4>
                                </div>
                                <p><strong className="text-slate-200">Purpose:</strong> {(hoveredNode || selectedNode)?.purpose}</p>
                                <p><strong className="text-slate-200">Tech Stack:</strong> <code className="text-cyber-cyan bg-white/5 px-1 py-0.5 rounded">{(hoveredNode || selectedNode)?.tech}</code></p>
                                <p><strong className="text-slate-200">Rationale:</strong> {(hoveredNode || selectedNode)?.reason}</p>
                              </div>
                              <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/5 pt-2 md:pt-0 md:pl-4">
                                <p><strong className="text-cyber-magenta font-semibold">Trade-offs:</strong> {(hoveredNode || selectedNode)?.tradeoffs}</p>
                                <p><strong className="text-cyber-cyan font-semibold">Performance:</strong> {(hoveredNode || selectedNode)?.performance}</p>
                                <p><strong className="text-yellow-500 font-semibold">Security Controls:</strong> {(hoveredNode || selectedNode)?.security}</p>
                                <p><strong className="text-cyber-green font-semibold">Scaling Vector:</strong> {(hoveredNode || selectedNode)?.scale}</p>
                              </div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Performance Metrics */}
                {activeModalTab === 'metrics' && (
                  <motion.div
                    key="metrics"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 space-y-4">
                      {/* Metric Gauge */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">{selectedProject.metrics.label}</span>
                          <span className="text-cyber-cyan font-bold">{selectedProject.metrics.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden p-[1px]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedProject.metrics.value}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                          />
                        </div>
                      </div>

                      {/* Technical statistics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[9.5px]">
                        <div className="p-2.5 rounded border border-white/5 bg-black/40">
                          <span className="text-slate-500 block text-[8px] uppercase">ENDPOINT LATENCY</span>
                          <span className="text-white font-bold text-xs">{selectedProject.metrics.latency || 'N/A'}</span>
                        </div>
                        <div className="p-2.5 rounded border border-white/5 bg-black/40">
                          <span className="text-slate-500 block text-[8px] uppercase">API THROUGHPUT</span>
                          <span className="text-cyber-purple font-bold text-xs">{selectedProject.metrics.throughput || 'N/A'}</span>
                        </div>
                        <div className="p-2.5 rounded border border-white/5 bg-black/40">
                          <span className="text-slate-500 block text-[8px] uppercase">ERROR RATIO</span>
                          <span className="text-cyber-green font-bold text-xs">{selectedProject.metrics.errorRate || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Static indicators */}
                      <div className="grid grid-cols-2 gap-4 text-[9.5px] pt-3 border-t border-white/5">
                        <div>
                          <span className="text-slate-500 uppercase">DATABASE CONFIG</span>
                          <div className="text-white font-bold mt-0.5">{selectedProject.database || 'None'}</div>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase">AUTHENTICATION</span>
                          <div className="text-cyber-cyan font-bold mt-0.5">{selectedProject.authentication || 'None'}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 4: AI Doc Generator */}
                {activeModalTab === 'docs' && (
                  <motion.div
                    key="docs"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex border-b border-white/5 pb-1 gap-3 text-[9.5px] overflow-x-auto custom-scroll">
                      {[
                        { id: 'star', label: 'STAR STORY' },
                        { id: 'readme', label: 'TECHNICAL README' },
                        { id: 'pitch', label: 'ELEVATOR PITCH' },
                        { id: 'qa', label: 'INTERVIEW QUESTIONS' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { playAudioCue('click'); setActiveDocSubTab(t.id as any); }}
                          className={`pb-1 border-b transition-all cursor-pointer ${
                            activeDocSubTab === t.id ? 'border-cyber-green text-cyber-green font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative p-4 rounded-xl border border-cyber-green/20 bg-slate-950/90 max-h-[250px] overflow-y-auto custom-scroll">
                      {/* Copy Button */}
                      <button
                        onClick={() => copyDocToClipboard(currentDoc.body)}
                        className="absolute top-3 right-3 p-1.5 rounded border border-cyber-green/30 bg-cyber-green/5 text-cyber-green hover:bg-cyber-green/10 transition-all cursor-pointer outline-none"
                        title="Copy to clipboard"
                      >
                        {isCopied ? <Check size={11} /> : <Copy size={11} />}
                      </button>

                      <div className="text-[10px] text-cyber-green font-mono uppercase tracking-widest border-b border-white/5 pb-2 mb-2">
                        // DYNAMIC GENERATOR: {currentDoc.title}
                      </div>

                      <pre className="font-mono text-[9px] text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {currentDoc.body}
                      </pre>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Action Footer */}
              <div className="pt-3.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-slate-500">Product Index: {selectedProject.metrics.value}% ({selectedProject.metrics.label})</span>
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
