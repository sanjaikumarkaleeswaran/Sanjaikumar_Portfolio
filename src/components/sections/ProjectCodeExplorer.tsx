import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown, Cpu, Shield, AlertTriangle } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { PROJECT_REPOS } from '../../data/projectFiles';
import type { ProjectRepo, ProjectFile } from '../../data/projectFiles';

export const ProjectCodeExplorer: React.FC = () => {
  const { playAudioCue } = useOS();
  const [selectedRepo, setSelectedRepo] = useState<ProjectRepo>(PROJECT_REPOS[0]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_REPOS[0].files[0]);
  const [isFolderOpen, setIsFolderOpen] = useState(true);

  // Sync selected file when repository tab changes
  useEffect(() => {
    setSelectedFile(selectedRepo.files[0]);
  }, [selectedRepo]);

  const handleSelectRepo = (repoId: string) => {
    playAudioCue('click');
    const repo = PROJECT_REPOS.find(r => r.id === repoId);
    if (repo) setSelectedRepo(repo);
  };

  const handleSelectFile = (file: ProjectFile, e: React.MouseEvent) => {
    const pan = (e.clientX / window.innerWidth) * 2 - 1;
    playAudioCue('click', pan);
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-col h-[400px] border border-white/5 rounded-xl overflow-hidden font-mono bg-slate-950 text-slate-300">
      
      {/* VS Code header toolbar tabs */}
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/40 select-none">
        <div className="flex items-center">
          {PROJECT_REPOS.map((repo) => {
            const isTabActive = selectedRepo.id === repo.id;
            return (
              <button
                key={repo.id}
                onClick={() => handleSelectRepo(repo.id)}
                className={`px-4 py-2 border-r border-white/5 text-[9px] font-semibold transition-all cursor-pointer ${
                  isTabActive 
                    ? 'bg-slate-950 text-cyber-cyan border-t border-t-cyber-cyan' 
                    : 'text-slate-500 hover:text-slate-300 bg-black/20'
                }`}
              >
                {repo.name.split(' ')[0]}.git
              </button>
            );
          })}
        </div>
        <div className="px-4 text-[8px] text-slate-600 uppercase tracking-widest hidden sm:block">
          Repository Inspect Core
        </div>
      </div>

      {/* Main split pane */}
      <div className="flex flex-1 min-h-0">
        
        {/* Sidebar explorer pane */}
        <div className="w-48 border-r border-white/5 bg-slate-950 select-none flex flex-col">
          <div className="px-3 py-1.5 border-b border-white/5 text-[8px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-between">
            <span>Explorer</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-[10px]">
            {/* Project Root Folder */}
            <div 
              onClick={() => { playAudioCue('dockHover'); setIsFolderOpen(!isFolderOpen); }}
              className="flex items-center gap-1.5 px-1 py-1 rounded hover:bg-white/5 text-slate-200 cursor-pointer"
            >
              {isFolderOpen ? <ChevronDown size={11} className="text-slate-500" /> : <ChevronRight size={11} className="text-slate-500" />}
              {isFolderOpen ? <FolderOpen size={12} className="text-cyber-purple" /> : <Folder size={12} className="text-cyber-purple" />}
              <span className="font-semibold truncate">{selectedRepo.id}_core</span>
            </div>

            {/* Folder Files List */}
            {isFolderOpen && (
              <div className="pl-4 space-y-0.5">
                {selectedRepo.files.map((file) => {
                  const isFileActive = selectedFile.name === file.name;
                  return (
                    <div
                      key={file.name}
                      onClick={(e) => handleSelectFile(file, e)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                        isFileActive 
                          ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20' 
                          : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileCode size={11} className={isFileActive ? 'text-cyber-cyan' : 'text-slate-500'} />
                      <span className="truncate">{file.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Editor and Analysis split pane */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-900/10">
          
          {/* Code editor view */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/5 min-h-0">
            <div className="px-3 py-1 bg-slate-950 text-[9px] text-slate-500 border-b border-white/5 truncate">
              {selectedRepo.id}_core &gt; {selectedFile.path}
            </div>

            <div className="flex-1 overflow-auto p-4 bg-black/60 custom-scroll text-[10px] leading-relaxed text-slate-300 font-mono select-text">
              <pre className="whitespace-pre">
                {/* Simulated Syntax Highlighting */}
                {selectedFile.code.split('\n').map((line, index) => {
                  // Format comments
                  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
                    return <div key={index} className="text-slate-500">{line}</div>;
                  }
                  // Format imports
                  if (line.startsWith('import ') || line.startsWith('from ')) {
                    return <div key={index} className="text-cyan-400">{line}</div>;
                  }
                  // Format functions/classes
                  if (line.includes('const ') || line.includes('function ') || line.includes('def ') || line.includes('class ')) {
                    return <div key={index} className="text-cyber-purple">{line}</div>;
                  }
                  // Format returns
                  if (line.trim().startsWith('return ')) {
                    return <div key={index} className="text-pink-400">{line}</div>;
                  }
                  return <div key={index}>{line}</div>;
                })}
              </pre>
            </div>
          </div>

          {/* Code Spec details */}
          <div className="w-full md:w-64 overflow-y-auto p-4 space-y-4 bg-slate-950/80 text-[10px] leading-relaxed select-text custom-scroll">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[8px] text-cyber-purple uppercase font-bold tracking-wider">// CODE ANALYSIS</span>
              <h4 className="text-slate-100 font-semibold text-[11px] mt-0.5">{selectedFile.name} Specs</h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-cyber-cyan font-bold">
                  <Cpu size={12} />
                  <span>COMPONENT PURPOSE</span>
                </div>
                <p className="text-slate-400 pl-3.5 border-l border-cyber-cyan/25">{selectedFile.purpose}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-cyber-green font-bold">
                  <Shield size={12} />
                  <span>KEY EXECUTION LOGIC</span>
                </div>
                <p className="text-slate-400 pl-3.5 border-l border-cyber-green/25">{selectedFile.logic}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <AlertTriangle size={12} />
                  <span>TRADE-OFF CONSIDERATIONS</span>
                </div>
                <p className="text-slate-400 pl-3.5 border-l border-amber-500/25">{selectedFile.tradeoffs}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
