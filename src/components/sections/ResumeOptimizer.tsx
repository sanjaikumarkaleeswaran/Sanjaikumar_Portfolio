import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Brain, FileDown, Sparkles, Printer, Terminal, RefreshCw } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { getAllProjects } from '../../data/projects';

interface Skill {
  name: string;
  aliases: string[];
  level: number;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Methodology' | 'Design';
}

const SKILLS_INVENTORY: Skill[] = [
  { name: 'React.js', aliases: ['react', 'react.js', 'reactjs', 'frontend'], level: 90, category: 'Frontend' },
  { name: 'TypeScript', aliases: ['typescript', 'ts'], level: 85, category: 'Frontend' },
  { name: 'JavaScript', aliases: ['javascript', 'js', 'es6'], level: 88, category: 'Frontend' },
  { name: 'TailwindCSS', aliases: ['tailwind', 'tailwindcss', 'css'], level: 92, category: 'Frontend' },
  { name: 'Framer Motion', aliases: ['framer', 'motion', 'animations'], level: 80, category: 'Frontend' },
  { name: 'Three.js', aliases: ['three', 'three.js', 'threejs', 'webgl'], level: 75, category: 'Frontend' },
  { name: 'Python', aliases: ['python', 'py'], level: 85, category: 'Backend' },
  { name: 'FastAPI', aliases: ['fastapi'], level: 82, category: 'Backend' },
  { name: 'Django', aliases: ['django', 'drf'], level: 78, category: 'Backend' },
  { name: 'MySQL', aliases: ['mysql', 'sql', 'relational'], level: 85, category: 'Database' },
  { name: 'MongoDB', aliases: ['mongodb', 'nosql', 'mongo'], level: 80, category: 'Database' },
  { name: 'Docker', aliases: ['docker', 'container', 'docker-compose', 'virtualization'], level: 75, category: 'DevOps' },
  { name: 'AWS', aliases: ['aws', 's3', 'cloudfront', 'cloud', 'infrastructure'], level: 65, category: 'DevOps' },
  { name: 'Linux', aliases: ['linux', 'bash', 'shell', 'unix'], level: 70, category: 'DevOps' },
  { name: 'Git', aliases: ['git', 'github', 'pipelines'], level: 82, category: 'DevOps' },
  { name: 'Agile', aliases: ['agile', 'scrum', 'jira', 'sprints', 'testing'], level: 85, category: 'Methodology' },
  { name: 'UI/UX', aliases: ['ui', 'ux', 'wireframing', 'user flows'], level: 82, category: 'Design' }
];

export const ResumeOptimizer: React.FC = () => {
  const { playAudioCue, addNotification } = useOS();
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<{
    score: number;
    matched: Skill[];
    missing: string[];
    summary: string;
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      addNotification('Please enter a job description to optimize.', 'info');
      return;
    }

    playAudioCue('click');
    setIsAnalyzing(true);

    setTimeout(() => {
      const jd = jobDescription.toLowerCase();
      const matched: Skill[] = [];
      const mentionedSkillsSet = new Set<string>();

      // Basic NLP Tokenizer match
      SKILLS_INVENTORY.forEach((skill) => {
        const matches = skill.aliases.some(alias => jd.includes(alias.toLowerCase()));
        if (matches) {
          matched.push(skill);
          mentionedSkillsSet.add(skill.name.toLowerCase());
        }
      });

      // Find potential missing key terms in Job description not in our inventory
      const commonRequiredKeywords = [
        'kubernetes', 'kubernetes', 'graphql', 'next.js', 'nextjs', 'nest.js', 'nestjs', 'redis', 'postgres', 
        'postgresql', 'rust', 'go', 'golang', 'node', 'nodejs', 'express', 'vue', 'angular'
      ];
      
      const missing: string[] = [];
      commonRequiredKeywords.forEach(keyword => {
        if (jd.includes(keyword) && !mentionedSkillsSet.has(keyword)) {
          // Clean presentation name
          let cleanName = keyword;
          if (keyword === 'postgresql') cleanName = 'PostgreSQL';
          if (keyword === 'nextjs') cleanName = 'Next.js';
          if (keyword === 'nestjs') cleanName = 'NestJS';
          if (keyword === 'nodejs') cleanName = 'Node.js';
          missing.push(cleanName);
        }
      });

      // Calculate score matching formula
      let score = 70; // baseline for base resume relevance
      if (matched.length > 0) {
        const matchRatio = matched.length / SKILLS_INVENTORY.length;
        score = Math.round(75 + (matchRatio * 20));
      }
      if (score > 98) score = 98; // keep realistic ceiling
      if (matched.length === 0) score = 40; // low relevance if no keywords match

      // Compile tailored description summary
      let summary = '';
      if (score >= 85) {
        summary = `High Match! Sanjaikumar's capabilities in ${matched.slice(0, 3).map(m => m.name).join(', ')} strongly align with your requirements. He has deployed active full-stack environments with equivalent setups.`;
      } else if (score >= 70) {
        summary = `Good Fit. Core requirements in ${matched.slice(0, 2).map(m => m.name).join(' & ')} are covered. For missing blocks like ${missing.slice(0, 2).join(', ') || 'cloud scale'}, Sanjaikumar can leverage his strong learning curve and core software systems grounding.`;
      } else {
        summary = `Partial Alignment. The position relies heavily on stacks Sanjaikumar hasn't fully integrated yet. However, his academic core in Software Systems provides the fundamentals to quickly adapt.`;
      }

      setAnalysis({
        score,
        matched,
        missing: missing.slice(0, 4),
        summary
      });

      setIsAnalyzing(false);
      playAudioCue('success');
      addNotification(`Resume Optimized: Match Score ${score}%`, 'success');
    }, 1200);
  };

  // One-click JSON export
  const exportTailoredJSON = () => {
    if (!analysis) return;
    playAudioCue('click');

    const matchedProjects = getAllProjects().filter(p => 
      p.tech.some(t => analysis.matched.some(m => m.name === t))
    );

    const resumeJSON = {
      candidate: "Sanjaikumar P K",
      target_alignment_score: `${analysis.score}%`,
      profile_summary: analysis.summary,
      matched_capabilities: analysis.matched.map(m => ({ skill: m.name, level: `${m.level}%`, category: m.category })),
      education: {
        degree: "B.Sc. Software Systems",
        institution: "Kongu Engineering College",
        gpa: "8.05/10",
        duration: "2021-2024"
      },
      aligned_engineering_projects: matchedProjects.map(p => ({
        title: p.title,
        role: p.role,
        tech_stack: p.tech,
        challenge: p.challenges,
        solution: p.solutions
      }))
    };

    const blob = new Blob([JSON.stringify(resumeJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sanjaikumarkaleeswaran_resume_optimized_${analysis.score}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Downloaded tailored JSON resume package.', 'success');
  };

  // Tailored Print/PDF generator using a clean, print-styled window layout
  const exportTailoredPDF = () => {
    if (!analysis) return;
    playAudioCue('click');

    const matchedProjects = getAllProjects().filter(p => 
      p.tech.some(t => analysis.matched.some(m => m.name === t))
    );

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addNotification('Popup blocked. Please allow popups to export printable CV.', 'info');
      return;
    }

    // Write printable tailorable HTML document
    printWindow.document.write(`
      <html>
        <head>
          <title>Sanjaikumar P K - Tailored CV Resume</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #222; margin: 40px; line-height: 1.5; font-size: 13px; }
            h1 { font-size: 24px; margin-bottom: 5px; color: #000; letter-spacing: -0.5px; }
            h2 { font-size: 14px; border-bottom: 2px solid #333; padding-bottom: 3px; text-transform: uppercase; margin-top: 25px; margin-bottom: 12px; color: #111; letter-spacing: 0.5px; }
            .meta { font-size: 11px; color: #555; margin-bottom: 15px; }
            .summary { background: #f5f5f5; padding: 12px; border-left: 3px solid #333; font-style: italic; margin-bottom: 20px; font-size: 12px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; }
            .section { margin-bottom: 20px; }
            .project { margin-bottom: 15px; page-break-inside: avoid; }
            .project-title { font-weight: bold; font-size: 13px; color: #000; }
            .project-tech { font-family: monospace; font-size: 10px; color: #555; margin-bottom: 4px; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
            .skill-badge { background: #e0e0e0; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-family: monospace; font-weight: bold; }
            .edu-header { display: flex; justify-content: space-between; font-weight: bold; }
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h1>SANJAIKUMAR P K</h1>
              <div class="meta">Tiruppur, India | sanjaikumarpk2003@gmail.com | +91 95973 59918</div>
            </div>
            <div style="text-align: right; font-family: monospace; font-size: 10px; color: #777;">
              Tailored Resume Match Score: ${analysis.score}%<br/>
              Generated via Portfolio OS Engine
            </div>
          </div>

          <div class="summary">
            <strong>Target Alignment:</strong> ${analysis.summary}
          </div>

          <h2>Technical Capabilities Stack (Aligned to Role)</h2>
          <div class="skills-list">
            ${analysis.matched.map(m => `<span class="skill-badge">${m.name} (${m.level}%)</span>`).join(' ')}
          </div>

          <h2>Core Engineering Projects</h2>
          ${matchedProjects.map(p => `
            <div class="project">
              <div class="project-header" style="display: flex; justify-content: space-between; font-weight: bold;">
                <span class="project-title">${p.title}</span>
                <span style="font-size: 11px; font-weight: normal;">Role: ${p.role}</span>
              </div>
              <div class="project-tech">Stack: ${p.tech.join(', ')}</div>
              <div style="margin-top: 4px;"><strong>Challenge:</strong> ${p.challenges}</div>
              <div><strong>Action:</strong> ${p.solutions}</div>
              <div><strong>Outcome:</strong> ${p.lessons}</div>
            </div>
          `).join('')}

          <h2>Academic Credentials</h2>
          <div class="section">
            <div class="edu-header">
              <span>B.Sc. Software Systems</span>
              <span>2021 - 2024</span>
            </div>
            <div style="font-style: italic; font-size: 11px;">Kongu Engineering College, Erode, Tamil Nadu</div>
            <div style="margin-top: 3px;">CGPA Rating: <strong>8.05 / 10</strong> (First Class Honors, No Arrears)</div>
            <div style="margin-top: 2px; font-size: 11px; color: #555;">Completed key modules on Full-Stack systems, Database normalizations, Object-Oriented design, and Agile workflows.</div>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #333; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: bold;">Print / Save as PDF</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    addNotification('Triggered tailored printable CV render canvas.', 'success');
  };

  return (
    <div className="p-6 border border-cyber-purple/20 bg-slate-950/80 rounded-2xl space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h3 className="text-xs font-bold text-cyber-purple uppercase tracking-wider flex items-center gap-1.5">
          <Brain size={12} className="animate-pulse text-cyber-purple" />
          <span>// RESUME_CAPABILITY_OPTIMIZER</span>
        </h3>
        <span className="text-[8px] text-slate-500">LOCAL_NLP_MATCH: ACTIVE</span>
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        Recruiter Utility: Paste your job description below. The neural optimizer will analyze requested keywords, align them to Sanjaikumar's skills, and compile a tailored PDF/JSON CV package.
      </p>

      {/* Input Text Area */}
      <div className="space-y-2">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description / Required skills here (e.g. 'Looking for a React developer with Python and Docker experience...')"
          className="w-full h-24 bg-black/60 border border-white/10 rounded-lg p-2.5 text-[10px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyber-purple transition-colors resize-none"
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-2 bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/20 rounded-lg font-bold text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={11} className="animate-spin" />
              <span>ALIGNING MATRIX CHUNKS...</span>
            </>
          ) : (
            <>
              <Sparkles size={11} className="animate-pulse" />
              <span>OPTIMIZE & MATCH RESUME</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 pt-4 space-y-4 overflow-hidden"
          >
            {/* Score Ring / Bar */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-3 rounded-lg border border-white/5">
              <div className="h-12 w-12 rounded-full border border-cyber-green/30 bg-cyber-green/5 flex flex-col items-center justify-center text-cyber-green shrink-0">
                <span className="text-xs font-bold">{analysis.score}%</span>
                <span className="text-[6px] text-slate-500 uppercase">MATCH</span>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-200 font-bold">COMPATIBILITY PROFILE RATING</div>
                <p className="text-[9px] text-slate-400 leading-tight">{analysis.summary}</p>
              </div>
            </div>

            {/* Aligned and missing lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[9px]">
              {/* Aligned */}
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2">
                <span className="text-cyber-green font-bold flex items-center gap-1">
                  <ShieldCheck size={11} />
                  <span>ALIGNED CAPABILITIES</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matched.length === 0 ? (
                    <span className="text-slate-500">None detected</span>
                  ) : (
                    analysis.matched.map(m => (
                      <span key={m.name} className="px-1.5 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/20 text-cyber-green">
                        {m.name}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Gaps */}
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2">
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <AlertTriangleIcon size={11} />
                  <span>KEYWORDS DETECTED (GAPS)</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing.length === 0 ? (
                    <span className="text-slate-500">No missing matches found</span>
                  ) : (
                    analysis.missing.map(m => (
                      <span key={m} className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        {m}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportTailoredPDF}
                className="flex-1 py-1.5 rounded bg-cyber-green/15 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/20 font-bold text-[9px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Printer size={11} />
                <span>EXPORT PRINTABLE CV</span>
              </button>
              <button
                onClick={exportTailoredJSON}
                className="flex-1 py-1.5 rounded bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 font-bold text-[9px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <FileDown size={11} />
                <span>DOWNLOAD JSON CV</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal icon proxy
const AlertTriangleIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <Terminal size={size} className="text-amber-500" />
);
