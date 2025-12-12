import React from 'react';

interface SchematicPanelProps {
  scadCode: string;
}

const SchematicPanel: React.FC<SchematicPanelProps> = ({ scadCode }) => {

  const handleDownloadSCAD = () => {
    if (!scadCode) return;
    const blob = new Blob([scadCode], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fixit_schematic.scad';
    link.click();
  };

  return (
    <div className="flex flex-col h-full w-full relative">
       <h2 className="text-xl font-orbitron tracking-widest text-cyan-400 mb-4 border-b border-cyan-900 pb-2">
        {"<>"} SCHEMATIC.SCAD
      </h2>

      <button 
        onClick={handleDownloadSCAD}
        className="absolute top-0 right-0 z-20 bg-transparent border border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 font-orbitron font-bold text-xs px-6 py-3 md:px-4 md:py-2 rounded transition-all uppercase tracking-wider"
      >
        Export .SCAD
      </button>

      <div className="flex-grow bg-black/50 border border-cyan-900/30 p-4 overflow-auto font-mono text-xs text-gray-300">
        <pre>
          <code>
            {scadCode || "// NO SCHEMATIC DATA FOUND"}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default SchematicPanel;