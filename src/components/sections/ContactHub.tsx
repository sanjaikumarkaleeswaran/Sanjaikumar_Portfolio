import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Copy, Check, Send, ShieldAlert } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const ContactHub: React.FC = () => {
  const { playAudioCue, addNotification } = useOS();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Canvas radar ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clipboard copy functions
  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    playAudioCue('success');
    addNotification(`Copied ${type === 'email' ? 'email address' : 'phone number'} to clipboard`, 'success');
    
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      playAudioCue('error');
      addNotification('Please enter all requested fields', 'warning');
      return;
    }

    playAudioCue('click');
    setIsSending(true);

    setTimeout(() => {
      playAudioCue('success');
      addNotification('Transmission successfully broadcasted!', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setIsSending(false);
    }, 1500);
  };

  // 2D Canvas Radar Sweeper
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 250;
      canvas.height = 180;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 10;

      // Draw concentric radar lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Circles
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2); ctx.stroke();

      // Crosshairs
      ctx.beginPath(); ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius); ctx.stroke();

      // Draw radar sweep line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const sweepX = cx + Math.cos(angle) * radius;
      const sweepY = cy + Math.sin(angle) * radius;
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Sweeping gradient fill wedge
      ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - 0.2, angle);
      ctx.closePath();
      ctx.fill();

      // Blinking Target (Tiruppur position tracker)
      const targetX = cx + radius * 0.4;
      const targetY = cy - radius * 0.3;
      const blink = Math.sin(Date.now() * 0.007) * 0.5 + 0.5;

      ctx.fillStyle = `rgba(255, 0, 127, ${blink})`;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 0, 127, ${0.4 * blink})`;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#00f0ff';
      ctx.font = '8px monospace';
      ctx.fillText('TIRUPPUR_NODE', targetX + 8, targetY + 3);

      angle += 0.015;
      animId = requestAnimationFrame(drawRadar);
    };

    drawRadar();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      
      {/* Left Column: Form submission */}
      <div className="md:col-span-7 p-5 border border-white/5 bg-slate-950/40 rounded-xl space-y-4">
        <h3 className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-wider">// TRANSMIT_MESSAGE</h3>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-[10px]">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 uppercase">IDENTIFIER (NAME)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors text-[10px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 uppercase">PORT ROUTE (EMAIL)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email..."
                className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors text-[10px]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 uppercase">MESSAGE DATAFRAME</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compile transmissions details..."
              className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors resize-none text-[10px]"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-2 rounded border border-cyber-cyan/30 hover:border-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan hover:text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-all uppercase"
          >
            {isSending ? (
              <>
                <ShieldAlert size={12} className="animate-spin" />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <Send size={12} />
                <span>Broadcast message</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Copy-Contacts & Radar Sweep */}
      <div className="md:col-span-5 flex flex-col justify-between gap-4">
        
        {/* Radar Sweeper */}
        <div className="p-4 border border-white/5 bg-slate-950/45 rounded-xl flex flex-col items-center">
          <canvas ref={canvasRef} className="w-full block bg-black/20 rounded border border-white/5" />
        </div>

        {/* Contacts details */}
        <div className="p-4 border border-white/5 bg-slate-950/45 rounded-xl space-y-3 font-mono text-[9px]">
          
          {/* Email Copy Card */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-cyber-cyan" />
              <div>
                <span className="text-slate-500">EMAIL ROUTE</span>
                <div className="text-[10px] text-slate-200 font-bold">sanjaikumarkaleeswarann@gmail.com</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard('sanjaikumarkaleeswarann@gmail.com', 'email')}
              className="p-1.5 border border-white/10 hover:border-cyber-cyan rounded bg-white/5 text-slate-400 hover:text-cyber-cyan transition-all"
            >
              {copiedEmail ? <Check size={10} className="text-cyber-green" /> : <Copy size={10} />}
            </button>
          </div>

          {/* Phone Copy Card */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-cyber-purple" />
              <div>
                <span className="text-slate-500">PHONE NODE</span>
                <div className="text-[10px] text-slate-200 font-bold">+91-8667010490</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard('+91-8667010490', 'phone')}
              className="p-1.5 border border-white/10 hover:border-cyber-purple rounded bg-white/5 text-slate-400 hover:text-cyber-purple transition-all"
            >
              {copiedPhone ? <Check size={10} className="text-cyber-green" /> : <Copy size={10} />}
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <a
              href="https://github.com/sanjaikumarkaleeswaran"
              target="_blank"
              rel="noreferrer"
              onClick={() => playAudioCue('click')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-cyber-cyan transition-colors"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/sanjaikumar-kaleeswaran/"
              target="_blank"
              rel="noreferrer"
              onClick={() => playAudioCue('click')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-cyber-purple transition-colors"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
