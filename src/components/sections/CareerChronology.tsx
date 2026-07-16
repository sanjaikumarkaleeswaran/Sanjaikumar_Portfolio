import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const CareerChronology: React.FC = () => {
  const { playAudioCue } = useOS();
  const [activeTab, setActiveTab] = useState<'education' | 'certificates'>('education');

  const educationMilestones = [
    {
      year: '2021 - 2025',
      degree: 'B.Sc. Software Systems',
      institution: 'Kongu Engineering College, Erode, Tamil Nadu',
      details: '5-year integrated software systems course. Completed key modules on Full-Stack systems, Relational Database normalizations, Object-Oriented design, and Agile project life cycles. No standing arrears.',
      rating: 'CGPA: 8.05 / 10'
    },
    {
      year: '2021',
      degree: 'Higher Secondary School Certification',
      institution: 'State Board of Tamil Nadu',
      details: 'Concluded foundational science and mathematics matriculation with a focus on computer science basics, data layouts, and math systems.',
      rating: 'First Class Honor'
    }
  ];

  const credentials = [
    {
      name: 'AWS Cloud Practitioner Essentials',
      issuer: 'AWS Skill Builder',
      status: 'In Progress',
      desc: 'Acquiring fundamental cloud capabilities covering identity guards, EC2 container routing, and cloud billing frameworks.'
    },
    {
      name: 'Linux Fundamentals',
      issuer: 'Udemy Academic License',
      status: 'Completed',
      desc: 'Mastered command-line bash configurations, file permission structures, grep parsing, and environment variables.'
    },
    {
      name: 'Computer Networking Basics',
      issuer: 'Udemy Academic License',
      status: 'Completed',
      desc: 'Learned OSI layers, TCP/IP flow setups, subnet mask routers, DNS structures, and secure SSL connections.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Tab Selectors */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex gap-4">
          <button
            onClick={() => {
              playAudioCue('click');
              setActiveTab('education');
            }}
            className={`font-mono text-xs font-bold uppercase tracking-wider pb-1 cursor-pointer transition-colors border-b ${
              activeTab === 'education' 
                ? 'border-cyber-cyan text-cyber-cyan' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Education Timeline
          </button>
          <button
            onClick={() => {
              playAudioCue('click');
              setActiveTab('certificates');
            }}
            className={`font-mono text-xs font-bold uppercase tracking-wider pb-1 cursor-pointer transition-colors border-b ${
              activeTab === 'certificates' 
                ? 'border-cyber-purple text-cyber-purple' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Certifications
          </button>
        </div>
        <span className="font-mono text-[9px] text-slate-500">CHRONOLOGY_MATRIX</span>
      </div>

      {/* Timeline buffer */}
      <div className="space-y-4 font-mono">
        {activeTab === 'education' ? (
          <div className="relative pl-6 border-l border-cyber-cyan/20 space-y-6 ml-2">
            {educationMilestones.map((edu, i) => (
              <div key={i} className="relative group">
                
                {/* Glowing node dot */}
                <div className="absolute -left-[30px] top-1 h-4.5 w-4.5 rounded-full border border-cyber-cyan/50 bg-black flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyber-cyan group-hover:scale-125 transition-transform" />
                </div>

                <div className="space-y-1.5 p-4 border border-white/5 bg-slate-950/40 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[10px] text-cyber-cyan font-bold">{edu.year}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded border border-cyber-cyan/20 text-cyber-cyan bg-cyber-cyan/5 max-w-fit">{edu.rating}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{edu.degree}</h4>
                  <div className="text-[9px] text-slate-500">{edu.institution}</div>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1.5">{edu.details}</p>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {credentials.map((cert, i) => (
              <div key={i} className="p-4 border border-white/5 bg-slate-950/40 rounded-xl flex flex-col justify-between h-[160px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500 uppercase">
                      <Award size={12} className="text-cyber-purple" />
                      <span>{cert.issuer}</span>
                    </div>
                    <span className={`text-[8px] px-2 py-0.5 rounded border ${
                      cert.status === 'Completed'
                        ? 'border-cyber-green/35 text-cyber-green bg-cyber-green/5'
                        : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'
                    }`}>
                      {cert.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{cert.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
