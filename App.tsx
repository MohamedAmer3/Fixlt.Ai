import React, { useState } from 'react';
import StatusPanel from './components/StatusPanel';
import LogicPanel from './components/LogicPanel';
import RenderPanel from './components/RenderPanel';
import SchematicPanel from './components/SchematicPanel';
import { analyzeImage } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisLogs, setAnalysisLogs] = useState<string>("");
  const [scadCode, setScadCode] = useState<string>("");
  const [threeCode, setThreeCode] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    setAppState(AppState.SCANNING);
    setAnalysisLogs(prev => prev + `\n>> INITIATING SCAN ON FILE: ${file.name}...\n`);
    
    // Simulate scan delay for effect (2 seconds matching the progress bar animation)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAppState(AppState.ANALYZING);
    setAnalysisLogs(prev => prev + ">> SCAN COMPLETE. UPLOADING TO GEMINI CORE...\n>> AWAITING NEURAL ANALYSIS...\n");

    try {
      // Convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        // Strip the data:image/jpeg;base64, part for Gemini
        const base64Content = base64Data.split(',')[1];

        try {
          const result = await analyzeImage(base64Content);
          
          setAnalysisLogs(prev => prev + `\n>> ANALYSIS RECEIVED.\n--------------------------------\n${result.technicalAnalysis}\n--------------------------------\n>> GENERATING SCHEMATICS... DONE.\n>> COMPILING VISUALS... DONE.\n`);
          setScadCode(result.openScadCode);
          setThreeCode(result.threeJsCode);
          setAppState(AppState.COMPLETE);

        } catch (error) {
          console.error(error);
          setAppState(AppState.ERROR);
          setAnalysisLogs(prev => prev + "\n>> CRITICAL ERROR: UNABLE TO PROCESS PART DATA.\n");
        }
      };
    } catch (err) {
      setAppState(AppState.ERROR);
      setAnalysisLogs(prev => prev + "\n>> ERROR READING FILE STREAM.\n");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050A10] text-cyan-400 p-4 md:p-6 flex flex-col">
      
      {/* HEADER SECTION */}
      <header className="flex items-center gap-4 mb-6 px-2 select-none">
        {/* Logo Container */}
        <div className="w-12 h-12 border-2 border-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-[#050A10] relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors"></div>
            {/* Lightning Bolt SVG */}
            <svg className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" /> 
            </svg>
        </div>
        
        {/* Text Container */}
        <div className="flex flex-col justify-center">
            <h1 className="font-orbitron font-bold text-2xl md:text-[32px] tracking-wide text-cyan-400 leading-none drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                FixIt.AI
            </h1>
            <span className="font-orbitron text-[10px] font-bold text-cyan-700 uppercase tracking-[0.3em] mt-1 ml-0.5">
                Autonomous Repair System
            </span>
        </div>
      </header>

      {/* Main Grid Container */}
      <div className="flex-grow flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto h-auto md:h-[80vh] grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 pb-8 md:pb-0">
          
          {/* PANEL A: STATUS & UPLOAD */}
          {/* Mobile: Order 1, Height 320px | Desktop: Order None, Height Auto */}
          <div className="bg-[#050A10] border border-cyan-900/50 p-6 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden hover:border-cyan-700/50 transition-colors order-1 md:order-none h-80 md:h-auto">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>
            <StatusPanel appState={appState} onUpload={handleFileUpload} />
          </div>

          {/* PANEL B: LOGIC CORE */}
          {/* Mobile: Order 3, Height 320px | Desktop: Order None, Height Auto */}
          <div className="bg-[#050A10] border border-cyan-900/50 p-6 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col relative hover:border-cyan-700/50 transition-colors order-3 md:order-none h-80 md:h-auto">
             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
             <LogicPanel logs={analysisLogs} />
          </div>

          {/* PANEL C: THREE.JS RENDER */}
          {/* Mobile: Order 2, Height 400px | Desktop: Order None, Height Auto */}
          <div className="bg-[#050A10] border border-cyan-900/50 p-1 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col relative hover:border-cyan-700/50 transition-colors order-2 md:order-none h-[400px] md:h-auto">
             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-30"></div>
             <RenderPanel code={threeCode} />
          </div>

          {/* PANEL D: SCHEMATIC */}
          {/* Mobile: Order 4, Height 320px | Desktop: Order None, Height Auto */}
          <div className="bg-[#050A10] border border-cyan-900/50 p-6 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col relative hover:border-cyan-700/50 transition-colors order-4 md:order-none h-80 md:h-auto">
             <div className="absolute top-0 left-0 w-20 h-[1px] bg-cyan-900"></div>
             <SchematicPanel scadCode={scadCode} />
          </div>

        </div>
      </div>

      {/* Optional Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-cyan-900/5 to-transparent z-[-1]"></div>
    </div>
  );
};

export default App;