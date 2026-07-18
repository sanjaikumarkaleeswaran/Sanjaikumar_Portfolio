import React, { useState } from 'react';
import { Award, BookOpen, Layers, Zap, Star } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface TimelineEvent {
  year: string;
  title: string;
  category: 'Education' | 'Project' | 'Certification' | 'Learning Journey' | 'Achievement';
  sub: string;
  details: string;
  metric?: string;
}

export const CareerChronology: React.FC = () => {
  const { playAudioCue } = useOS();
  const [filter, setFilter] = useState<string>('All');

  const timelineEvents: TimelineEvent[] = [
    {
      year: '2025',
      title: 'MindWave AI Platform',
      category: 'Project',
      sub: 'AI-Powered Client-Side Retrieval Hub',
      details: 'Released MindWave AI, featuring client-side TF-IDF vector similarity scoring, custom Web Audio oscillator panning, and sub-second contextual responses.',
      metric: '90% Match Accuracy'
    },
    {
      year: '2024',
      title: 'Smart Flashcard Generator',
      category: 'Project',
      sub: 'AI Spaced Repetition Learning Suite',
      details: 'Engineered an AI-driven learning assistant utilizing OpenAI completions to ingest PDFs and output custom spaced repetition flashcards automatically.',
      metric: '40% Retention Increase'
    },
    {
      year: '2021 - 2024',
      title: 'B.Sc. Software Systems',
      category: 'Education',
      sub: 'Kongu Engineering College, TN, India',
      details: 'Completed rigorous curriculum covering Object-Oriented design, DBMS normalization, Operating Systems internals, Computer Networks, and Agile sprints. No standing arrears.',
      metric: 'CGPA: 8.05 / 10'
    },
    {
      year: '2024',
      title: 'AWS Cloud Practitioner Essentials',
      category: 'Certification',
      sub: 'Amazon Web Services (AWS)',
      details: 'Mastered cloud identity management (IAM), secure data lifecycle (S3 buckets), scalable VPC network designs, and EC2 virtualization routing.',
      metric: 'Cloud Certified'
    },
    {
      year: '2024',
      title: 'Nova AI RFP Platform',
      category: 'Project',
      sub: 'Automated Document Bid Engine',
      details: 'Engineered an automated request-for-proposal document processor running FastAPI backends, MongoDB data stores, and containerized Docker orchestrations.',
      metric: '82% Throughput Gain'
    },
    {
      year: '2023',
      title: 'Linux Administration & Networks Fundamentals',
      category: 'Certification',
      sub: 'Udemy Academy Licensing',
      details: 'Mastered command-line bash shell pipelines, file permissions management, OSI routing layers, TCP/IP flow setups, and secure DNS configurations.',
      metric: 'Credential Verified'
    },
    {
      year: '2022',
      title: 'Aquarium Engine WebGL Simulation',
      category: 'Project',
      sub: 'Interactive 3D Render & Commerce Flow',
      details: 'Developed a WebGL 3D physics rendering simulation with custom matrix transformations, running beside an Express.js checkout transaction pipeline.',
      metric: '60 FPS Rendering'
    },
    {
      year: '2022',
      title: 'Full-Stack Software Engineering Genesis',
      category: 'Learning Journey',
      sub: 'Open Source & Core Systems Dev',
      details: 'Transitioned to advanced Javascript/TypeScript stacks and database Normalization models. Initiated contribution pipelines across local git workspaces.',
      metric: '4+ Stacks Mastered'
    },
    {
      year: '2021',
      title: 'Higher Secondary School Certification',
      category: 'Education',
      sub: 'State Board of Tamil Nadu',
      details: 'Graduated with First Class Honors, specializing in Computer Science foundations, Boolean algebra, logic gates, and early C++ memory models.',
      metric: 'First Class Honor'
    }
  ];

  const categories = ['All', 'Education', 'Project', 'Certification', 'Learning Journey'];

  const filteredEvents = filter === 'All' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category === filter);

  // Category Tag Colors mapping
  const categoryStyles: Record<string, { border: string; bg: string; text: string; icon: React.ReactNode }> = {
    Education: {
      border: 'border-cyber-cyan/30',
      bg: 'bg-cyber-cyan/5',
      text: 'text-cyber-cyan',
      icon: <BookOpen size={10} />
    },
    Project: {
      border: 'border-cyber-green/30',
      bg: 'bg-cyber-green/5',
      text: 'text-cyber-green',
      icon: <Layers size={10} />
    },
    Certification: {
      border: 'border-cyber-purple/30',
      bg: 'bg-cyber-purple/5',
      text: 'text-cyber-purple',
      icon: <Award size={10} />
    },
    'Learning Journey': {
      border: 'border-cyber-magenta/30',
      bg: 'bg-cyber-magenta/5',
      text: 'text-cyber-magenta',
      icon: <Zap size={10} />
    },
    Achievement: {
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/5',
      text: 'text-yellow-500',
      icon: <Star size={10} />
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filtering control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playAudioCue('click');
                setFilter(cat);
              }}
              className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.15)]'
                  : 'bg-white/5 border border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest hidden md:inline">SYSTEM_CHRONOLOGY_DECK</span>
      </div>

      {/* Vertical Timeline Thread */}
      <div className="relative pl-6 border-l border-white/10 space-y-6 ml-2 font-mono">
        {filteredEvents.map((event, i) => {
          const style = categoryStyles[event.category] || categoryStyles['Learning Journey'];
          return (
            <div key={i} className="relative group animate-[fadeIn_0.3s_ease_both]">
              
              {/* Glowing vertical node dot */}
              <div className={`absolute -left-[32px] top-1.5 h-5 w-5 rounded-full border bg-black flex items-center justify-center transition-all group-hover:scale-110 shadow-lg ${style.border} ${style.text}`}>
                {style.icon}
              </div>

              {/* Event content box */}
              <div className="p-4 border border-white/5 bg-slate-950/40 backdrop-blur-md rounded-xl space-y-2 hover:border-white/10 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white font-bold">{event.year}</span>
                    <span className={`text-[7.5px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${style.border} ${style.bg} ${style.text}`}>
                      {event.category}
                    </span>
                  </div>
                  {event.metric && (
                    <span className="text-[8px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                      {event.metric}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyber-cyan transition-colors">{event.title}</h4>
                  <div className="text-[9px] text-slate-500">{event.sub}</div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{event.details}</p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
