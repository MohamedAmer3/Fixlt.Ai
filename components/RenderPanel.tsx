import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

interface RenderPanelProps {
  code: string;
}

const RenderPanel: React.FC<RenderPanelProps> = ({ code }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const exportGroupRef = useRef<THREE.Group>(new THREE.Group());
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a10); // Very dark grid bg
    
    // Grid Helper
    const gridHelper = new THREE.GridHelper(50, 50, 0x112233, 0x050A10);
    scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2); 
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    const backLight = new THREE.DirectionalLight(0x00ffff, 0.5);
    backLight.position.set(-10, -5, -10);
    scene.add(backLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add Export Group to Scene
    scene.add(exportGroupRef.current);
    sceneRef.current = scene;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (exportGroupRef.current) {
        exportGroupRef.current.rotation.y += 0.002; // Slow rotation for vibe
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Execute Gemini Code
  useEffect(() => {
    if (!code || !exportGroupRef.current) return;

    // Clear previous mesh
    exportGroupRef.current.clear();

    try {
      // Safe(ish) execution of the generated code
      // We pass 'THREE' and 'exportGroup' to the function scope
      const generateMesh = new Function('THREE', 'exportGroup', code);
      generateMesh(THREE, exportGroupRef.current);
      console.log("Mesh generated successfully");
    } catch (err) {
      console.error("Error executing Gemini Three.js code:", err);
      // Fallback visualization on error (Red Cube)
      const geo = new THREE.BoxGeometry(5,5,5);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      const errorMesh = new THREE.Mesh(geo, mat);
      exportGroupRef.current.add(errorMesh);
    }

  }, [code]);

  const handleDownloadSTL = () => {
    if (!exportGroupRef.current) return;
    const exporter = new STLExporter();
    const result = exporter.parse(exportGroupRef.current, { binary: true }); // Export as binary
    const blob = new Blob([result], { type: 'application/octet-stream' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fixit_repair_part.stl';
    link.click();
  };

  return (
    <div className="flex flex-col h-full w-full relative group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-xl font-orbitron tracking-widest text-cyan-400 drop-shadow-md">LIVE RENDER // THREE.JS</h2>
      </div>

      <button 
        onClick={handleDownloadSTL}
        className="absolute top-4 right-4 z-20 bg-cyan-400 hover:bg-cyan-300 text-black font-orbitron font-bold text-xs px-6 py-3 md:px-4 md:py-2 rounded shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all uppercase tracking-wider"
      >
        Download .STL
      </button>

      <div ref={mountRef} className="flex-grow w-full h-full bg-[#080c14] border border-cyan-900/50 relative overflow-hidden">
        {/* Grid overlay handled by Three.js helper, but we can add corner markers via CSS */}
        <div className="absolute bottom-2 left-2 text-[10px] text-cyan-800 font-mono">X: RED | Y: GREEN | Z: BLUE</div>
      </div>
    </div>
  );
};

export default RenderPanel;