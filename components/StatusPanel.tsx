import React, { useState, useRef } from 'react';
import { AppState } from '../types';

interface StatusPanelProps {
  appState: AppState;
  onUpload: (file: File) => void;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ appState, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  // Progress Bar Calculation
  // We want to animate 10 blocks.
  // If scanning, we animate them filling up.
  const renderProgressBlocks = () => {
    const blocks = [];
    for (let i = 0; i < 10; i++) {
      let bgClass = "bg-[#0e2a35]"; // Inactive dark blue
      let glowClass = "";

      if (appState === AppState.SCANNING || appState === AppState.ANALYZING) {
        // Simple animation simulation based on index
        bgClass = "bg-[#0e2a35] animate-pulse";
        // In a real app we might control this index strictly with state, 
        // but CSS animation with delay works great for "vibe"
      }
      
      if (appState === AppState.COMPLETE) {
         bgClass = "bg-cyan-400";
         glowClass = "shadow-[0_0_8px_rgba(34,211,238,0.8)]";
      }

      blocks.push(
        <div
          key={i}
          className={`h-4 flex-1 mx-[2px] rounded-sm transition-colors duration-300 ${bgClass} ${glowClass}`}
          style={{
             animationDelay: `${i * 0.2}s`,
             animationDuration: '2s' 
          }}
        />
      );
    }
    return blocks;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-orbitron tracking-widest text-cyan-400">INITIATE SCAN</h2>
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
      </div>

      <div 
        className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-300 relative overflow-hidden group
          ${dragActive ? 'border-cyan-400 bg-cyan-900/20' : 'border-cyan-800 hover:border-cyan-600'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input 
          ref={inputRef} 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleChange}
        />
        
        {appState === AppState.IDLE ? (
           <>
            <svg className="w-16 h-16 text-cyan-700 group-hover:text-cyan-400 transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <span className="font-orbitron text-cyan-600 group-hover:text-cyan-300 text-sm tracking-widest">UPLOAD SOURCE IMAGE</span>
           </>
        ) : (
           <div className="absolute inset-0 bg-[#050A10]/80 flex flex-col items-center justify-center z-10">
              <div className="text-4xl font-orbitron text-cyan-400 mb-2 animate-pulse">
                {appState === AppState.SCANNING ? "SCANNING..." : (appState === AppState.ANALYZING ? "ANALYZING..." : "SCAN COMPLETE")}
              </div>
           </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-end mb-1 text-xs text-cyan-600 font-orbitron">
           <span>SYSTEM STATUS</span>
           <span>{appState === AppState.IDLE ? "STANDBY" : (appState === AppState.COMPLETE ? "READY" : "PROCESSING")}</span>
        </div>
        <div className="flex w-full">
          {renderProgressBlocks()}
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
