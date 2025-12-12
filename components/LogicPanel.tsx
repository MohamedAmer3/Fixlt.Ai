import React, { useEffect, useRef } from 'react';

interface LogicPanelProps {
  logs: string;
}

const LogicPanel: React.FC<LogicPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      <h2 className="text-xl font-orbitron tracking-widest text-cyan-400 mb-4 border-b border-cyan-900 pb-2">
        {">>"} ANALYSIS_LOG
      </h2>
      
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto font-mono text-sm leading-relaxed p-2"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        <pre className="whitespace-pre-wrap text-cyan-500/90 shadow-cyan-500/50 drop-shadow-md">
          {logs || "// WAITING FOR INPUT STREAM..."}
        </pre>
        <div className="h-4" /> {/* Spacer */}
      </div>

      {/* Decorative scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
    </div>
  );
};

export default LogicPanel;
