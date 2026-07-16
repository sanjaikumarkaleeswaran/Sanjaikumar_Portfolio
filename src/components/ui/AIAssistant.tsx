import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RefreshCw, Command } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { searchKnowledge } from '../../data/knowledgeBase';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const { playAudioCue, setActiveWindow, addNotification } = useOS();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'Greetings. I am Sanjaikumar\'s Neural Copilot agent. I can answer recruiter questions, search technologies, recommend projects, or navigate the OS workspace for you. Try asking "Explain MindWave" or "How does your RAG pipeline work?".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Wake up chime on first render
  useEffect(() => {
    playAudioCue('wake');
  }, []);

  // Thinking processing sound rhythm
  useEffect(() => {
    if (!isTyping) return;
    const interval = setInterval(() => {
      playAudioCue('thinking');
    }, 320);
    return () => clearInterval(interval);
  }, [isTyping]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    playAudioCue('click');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // User message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI typing & answering simulation
    setTimeout(() => {
      let replyText = "";
      const query = textToSend.toLowerCase();

      // Navigation Command Parser
      if (query.includes('open projects') || query.includes('show projects') || query.includes('navigate to projects')) {
        setActiveWindow('projects');
        addNotification('Opening projects registry database', 'info');
        replyText = "Command acknowledged. Opening the **Software Artistry Registry** window now. Here you can inspect his core builds and system architecture diagrams.";
      } else if (query.includes('open skills') || query.includes('show skills') || query.includes('navigate to skills') || query.includes('open planetarium')) {
        setActiveWindow('skills');
        addNotification('Opening technical capabilities planetarium', 'info');
        replyText = "Command acknowledged. Launching the **Technical Capabilities Planetarium** galaxy. Click on the planets to zoom in on specific sub-technologies and framework moons.";
      } else if (query.includes('open about') || query.includes('show bio') || query.includes('navigate to about') || query.includes('open experience')) {
        setActiveWindow('about');
        addNotification('Opening biographical specs registry', 'info');
        replyText = "Command acknowledged. Launching the **Biographical Specifications Registry** window detailing his education chronology and AWS/Linux credentials.";
      } else if (query.includes('go home') || query.includes('open dashboard') || query.includes('close window')) {
        setActiveWindow('hero');
        addNotification('Returning to Central OS Dashboard', 'info');
        replyText = "Command acknowledged. Minimizing active windows and returning to the **Central OS Dashboard**.";
      } else {
        // Run Local RAG Similarity Search
        const searchMatches = searchKnowledge(textToSend);
        
        if (searchMatches.length > 0) {
          const topMatch = searchMatches[0];
          replyText = `🔍 [LOCAL RAG NODE: MATCHED ${topMatch.doc.title} (SCORE: ${topMatch.score.toFixed(2)})]\n\n${topMatch.doc.content}`;
        } else {
          // Safeguard fallback to prevent hallucination
          replyText = `⚠️ [SYSTEM SAFEGUARD ALERT: OUTSIDE VERIFIED KNOWLEDGEBASE]\n\nNo matching documents found in local knowledge archives. To prevent hallucinations and safeguard recruitment integrity, the AI Core is restricted to local credentials.\n\nTry asking:\n• "Explain Mindwave / Nova / Aquarium"\n• "Which projects use Docker / MongoDB / Python?"\n• "Tell me about your education / college credentials"`;
        }
      }

      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      playAudioCue('success');
    }, 1100);
  };

  const handleQuickReply = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="flex flex-col h-[360px] bg-slate-950/40 rounded-xl overflow-hidden border border-white/5">
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scroll bg-black/40">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="h-6 w-6 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center text-cyber-purple shrink-0">
                <Sparkles size={11} className="animate-pulse" />
              </div>
            )}
            
            <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl text-[11px] font-mono whitespace-pre-line border leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyber-cyan/10 border-cyber-cyan/35 text-slate-100 rounded-tr-none'
                  : 'bg-slate-900/60 border-white/5 text-cyber-cyan rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[8px] text-slate-500 font-mono mt-1 px-1">{msg.timestamp}</span>
            </div>

            {msg.sender === 'user' && (
              <div className="h-6 w-6 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan shrink-0">
                <User size={11} />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center text-cyber-purple shrink-0 animate-spin">
              <RefreshCw size={11} />
            </div>
            <div className="text-[10px] font-mono text-slate-500 animate-pulse">Neural copilot is decoding...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="p-2.5 bg-slate-950/80 border-t border-white/5 flex gap-2 overflow-x-auto select-none custom-scroll">
        {[
          'open projects',
          'open skills',
          'recommend project',
          'Contact info'
        ].map((reply, i) => (
          <button
            key={i}
            onClick={() => handleQuickReply(reply)}
            disabled={isTyping}
            className="px-2.5 py-1 rounded-full border border-white/10 hover:border-cyber-purple/40 bg-white/5 hover:bg-cyber-purple/10 text-slate-400 hover:text-cyber-purple font-mono text-[9px] transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            {reply.includes('open') ? (
              <span className="flex items-center gap-1">
                <Command size={8} />
                {reply}
              </span>
            ) : reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }} 
        className="p-3 border-t border-white/5 bg-slate-950/95 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          placeholder="Type database query or 'open projects'..."
          className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-1.5 font-mono text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors"
        />
        <button
          type="submit"
          disabled={isTyping}
          className="p-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/30 border border-cyber-cyan/30 rounded-lg text-cyber-cyan hover:text-white transition-all cursor-pointer flex items-center justify-center"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
};
