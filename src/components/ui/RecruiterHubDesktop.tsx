import React from 'react';
import { Mail, FileText, Calendar, MessageSquare } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const RecruiterHubDesktop: React.FC = () => {
  const { playAudioCue, addNotification, setActiveWindow } = useOS();

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-3 p-2 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md shadow-2xl animate-[fadeIn_0.3s_ease-out]">
      <div className="text-[7.5px] text-cyber-purple font-mono uppercase text-center font-bold tracking-widest border-b border-white/5 pb-1 select-none">
        RECRUIT_HUD
      </div>
      
      {/* Email Mailto */}
      <a 
        href="mailto:sanjaikumarkaleeswarann@gmail.com?subject=Opportunity%20Inquiry" 
        onClick={() => playAudioCue('click')}
        className="w-10 h-10 rounded-xl border border-white/5 hover:border-cyber-cyan bg-white/5 text-slate-400 hover:text-cyber-cyan flex items-center justify-center transition-all group relative"
        title="Hire Me / Email"
      >
        <Mail size={16} />
        <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-cyan border border-cyber-cyan/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Hire Me / Email</span>
      </a>

      {/* Download Resume */}
      <a 
        href="https://github.com/sanjaikumarkaleeswaran" 
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          playAudioCue('click');
          addNotification('Downloading Resume from records', 'success');
        }}
        className="w-10 h-10 rounded-xl border border-white/5 hover:border-cyber-green bg-white/5 text-slate-400 hover:text-cyber-green flex items-center justify-center transition-all group relative"
        title="Download Resume"
      >
        <FileText size={16} />
        <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-green border border-cyber-green/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Download Resume</span>
      </a>

      {/* Book Interview */}
      <a 
        href="mailto:sanjaikumarkaleeswarann@gmail.com?subject=Interview%20Scheduling&body=Hi%20Sanjai,%20We%20would%20like%20to%20schedule%20an%20interview..."
        onClick={() => playAudioCue('click')}
        className="w-10 h-10 rounded-xl border border-white/5 hover:border-cyber-magenta bg-white/5 text-slate-400 hover:text-cyber-magenta flex items-center justify-center transition-all group relative"
        title="Book Interview"
      >
        <Calendar size={16} />
        <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-magenta border border-cyber-magenta/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Book Interview</span>
      </a>

      {/* LinkedIn */}
      <a 
        href="https://www.linkedin.com/in/sanjaikumar-kaleeswaran/" 
        target="_blank"
        rel="noreferrer"
        onClick={() => playAudioCue('click')}
        className="w-10 h-10 rounded-xl border border-white/5 hover:border-blue-400 bg-white/5 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all group relative"
        title="LinkedIn Profile"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">LinkedIn</span>
      </a>

      {/* GitHub */}
      <a 
        href="https://github.com/sanjaikumarkaleeswaran" 
        target="_blank"
        rel="noreferrer"
        onClick={() => playAudioCue('click')}
        className="w-10 h-10 rounded-xl border border-white/5 hover:border-slate-300 bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all group relative"
        title="GitHub Profile"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-slate-300 border border-white/20 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">GitHub</span>
      </a>

      {/* Contact Scroll trigger */}
      <button 
        onClick={() => {
          playAudioCue('click');
          const contactNode = document.getElementById('contact-section');
          if (contactNode) {
            contactNode.scrollIntoView({ behavior: 'smooth' });
          } else {
            setActiveWindow('contact');
          }
        }}
        className="w-10 h-10 rounded-xl border border-white/5 hover:border-cyber-purple bg-white/5 text-slate-400 hover:text-cyber-purple flex items-center justify-center transition-all group relative cursor-pointer"
        title="Contact Form"
      >
        <MessageSquare size={16} />
        <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all bg-black/95 text-cyber-purple border border-cyber-purple/30 px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap z-50 pointer-events-none">Contact Form</span>
      </button>
    </div>
  );
};
