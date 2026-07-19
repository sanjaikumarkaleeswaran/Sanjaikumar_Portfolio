import React from 'react';
import { ShieldCheck, GraduationCap, Cpu, Layers, MapPin } from 'lucide-react';

export const AboutSpecs: React.FC = () => {
  const hardwareSpecs = [
    { label: 'NODE IDENTIFIER', val: 'SANJAIKUMAR P K', icon: <Cpu className="text-cyber-cyan" size={14} /> },
    { label: 'ACADEMIC RECORD', val: 'B.Sc. Software Systems (2021-2024)', icon: <GraduationCap className="text-cyber-purple" size={14} /> },
    { label: 'INSTITUTION', val: 'Kongu Engineering College, TN', icon: <Layers className="text-cyber-magenta" size={14} /> },
    { label: 'LOCATION INDEX', val: 'Tiruppur, India', icon: <MapPin className="text-cyber-green" size={14} /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Introduction Bio */}
      <div className="p-5 border border-white/5 bg-slate-950/40 rounded-xl space-y-3">
        <h3 className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-wider">// SYSTEM_CORE_PROFILE</h3>
        <p className="font-mono text-[11px] md:text-xs text-slate-400 leading-relaxed">
          Sanjaikumar P K is a passionate software engineering professional focused on full-stack web architectures and intelligent AI platforms. 
          Through his training at Kongu Engineering College, he has mastered modern web tooling (React, TypeScript, Tailwind) and backend computing (Python, SQL, REST, Docker containerization). 
          He focuses on creating smooth UI layouts, testing for accessibility, and optimizing database systems.
        </p>
      </div>

      {/* Grid of Hardware Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Motherboard Details */}
        <div className="p-5 border border-white/5 bg-slate-950/45 rounded-xl space-y-4">
          <h3 className="font-mono text-xs font-bold text-cyber-purple uppercase tracking-wider">// HARDWARE_SPECS_DIAGNOSTIC</h3>
          
          <div className="space-y-3">
            {hardwareSpecs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                  {spec.icon}
                  <span>{spec.label}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-200 font-bold">{spec.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Scoreboard */}
        <div className="p-5 border border-white/5 bg-slate-950/45 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-bold text-cyber-magenta uppercase tracking-wider">// EDUCATION_METRICS</h3>
            <p className="font-mono text-[10px] text-slate-400">Bachelor of Science in Software Systems (3-year Undergraduate Program). Focused on algorithms, object-oriented systems, databases, web development, and cloud computing.</p>
          </div>

          <div className="p-4 border border-cyber-green/20 bg-cyber-green/5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-cyber-green" size={24} />
              <div>
                <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">KEC GPA RATING</div>
                <div className="font-mono text-xs font-bold text-slate-200">8.05 / 10</div>
              </div>
            </div>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-cyber-green/40 text-cyber-green bg-cyber-green/10">NO ARREARS</span>
          </div>
        </div>

      </div>

    </div>
  );
};
