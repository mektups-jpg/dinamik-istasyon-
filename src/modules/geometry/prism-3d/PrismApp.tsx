import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GameHeader } from '../../../components/ui/GameHeader';
import { InlineMath, BlockMath } from 'react-katex';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Star, Sparkles, X } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

export default function PrismApp() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [w, setW] = useState(4.0);
  const [h, setH] = useState(3.0);
  const [d, setD] = useState(2.0);

  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();
  const [hasWon, setHasWon] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (progress === 0 && !hasWon) {
      setHasWon(true);
      setShowSuccess(true);
      unlockAtom('G8.GEO.020.2');
      addScore(50);
    }
  }, [progress, hasWon, unlockAtom, addScore]);

  const sceneRef = useRef<any>(null);
  const globalsRef = useRef<any>(null);

  // 1. One-time Setup
  useEffect(() => {
    if (!mountRef.current) return;
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    let cw = mountRef.current.clientWidth || 800;
    let ch = mountRef.current.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0B0C10');
    scene.fog = new THREE.FogExp2('#0B0C10', 0.02);

    const camera = new THREE.PerspectiveCamera(45, cw / ch, 0.1, 100);
    camera.position.set(12, 10, 16);
    camera.setViewOffset(cw, ch, 190, 0, cw, ch);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(cw, ch);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.position = 'absolute';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xFF0055, 3, 20);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // --- Floor / Grid ---
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(40, 40, 0xFF0055, 0x1a1a1a);
    gridHelper.position.y = -1.99;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.15;
    scene.add(gridHelper);

    const sceneGroup = new THREE.Group();
    sceneGroup.position.set(0, -1, 0);
    scene.add(sceneGroup);

    // --- Sci-Fi Materials ---
    const matBaseTop = new THREE.MeshPhysicalMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.6, roughness: 0.2, metalness: 0.5, side: THREE.DoubleSide });
    const matSides = new THREE.MeshPhysicalMaterial({ color: 0x0088FF, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.3, clearcoat: 1.0, side: THREE.DoubleSide });
    const matFrontBack = new THREE.MeshPhysicalMaterial({ color: 0xFF0055, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.4, clearcoat: 1.0, side: THREE.DoubleSide });
    
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

    globalsRef.current = { scene, camera, renderer, controls, sceneGroup, materials: { matBaseTop, matSides, matFrontBack, edgeMat } };

    // --- Animation Loop ---
    let frameId: number;
    const render = () => {
      frameId = requestAnimationFrame(render);
      controls.update();
      
      const time = Date.now() * 0.001;
      sceneGroup.position.y = -1 + Math.sin(time * 2) * 0.15;
      
      renderer.render(scene, camera);
    };
    render();

    const resize = () => {
      if (!mountRef.current || !globalsRef.current) return;
      const wWidth = mountRef.current.clientWidth;
      const wHeight = mountRef.current.clientHeight;
      camera.aspect = wWidth / wHeight;
      camera.setViewOffset(wWidth, wHeight, 190, 0, wWidth, wHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(wWidth, wHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) mountRef.current.removeChild(renderer.domElement);
      floorGeo.dispose(); floorMat.dispose();
      matBaseTop.dispose(); matSides.dispose(); matFrontBack.dispose(); edgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  // 2. Dynamic Geometry Rebuilder
  useEffect(() => {
    if (!globalsRef.current) return;
    const { sceneGroup, materials } = globalsRef.current;
    const { matBaseTop, matSides, matFrontBack, edgeMat } = materials;

    while (sceneGroup.children.length > 0) {
      sceneGroup.remove(sceneGroup.children[0]);
    }

    const createFace = (faceW: number, faceH: number, mat: THREE.Material) => {
      const geo = new THREE.PlaneGeometry(faceW, faceH);
      geo.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
      return { geo, mesh };
    };

    // 1. Base Face
    const baseSetup = createFace(w, d, matBaseTop);
    sceneGroup.add(baseSetup.mesh);

    // 2. Right Face
    const rightSetup = createFace(h, d, matSides);
    const rightHinge = new THREE.Group();
    rightHinge.position.set(w/2, 0, 0); 
    rightSetup.mesh.position.set(h/2, 0, 0); 
    rightHinge.add(rightSetup.mesh);
    sceneGroup.add(rightHinge);

    // 3. Left Face
    const leftSetup = createFace(h, d, matSides);
    const leftHinge = new THREE.Group();
    leftHinge.position.set(-w/2, 0, 0); 
    leftSetup.mesh.position.set(-h/2, 0, 0);
    leftHinge.add(leftSetup.mesh);
    sceneGroup.add(leftHinge);

    // 4. Front Face
    const frontSetup = createFace(w, h, matFrontBack);
    const frontHinge = new THREE.Group();
    frontHinge.position.set(0, 0, d/2); 
    frontSetup.mesh.position.set(0, 0, h/2);
    frontHinge.add(frontSetup.mesh);
    sceneGroup.add(frontHinge);

    // 5. Back Face
    const backSetup = createFace(w, h, matFrontBack);
    const backHinge = new THREE.Group();
    backHinge.position.set(0, 0, -d/2); 
    backSetup.mesh.position.set(0, 0, -h/2);
    backHinge.add(backSetup.mesh);
    sceneGroup.add(backHinge);

    // 6. Top Face (Attached to Front Face)
    const topSetup = createFace(w, d, matBaseTop);
    const topHinge = new THREE.Group();
    topHinge.position.set(0, 0, h); 
    topSetup.mesh.position.set(0, 0, d/2);
    topHinge.add(topSetup.mesh);
    frontHinge.add(topHinge);

    sceneRef.current = { rightHinge, leftHinge, frontHinge, backHinge, topHinge };
    
    updateHinges(progress);

    return () => {
      baseSetup.geo.dispose();
      rightSetup.geo.dispose();
      leftSetup.geo.dispose();
      frontSetup.geo.dispose();
      backSetup.geo.dispose();
      topSetup.geo.dispose();
    };
  }, [w, h, d]);

  const updateHinges = (p: number) => {
    if (!sceneRef.current) return;
    const { rightHinge, leftHinge, frontHinge, backHinge, topHinge } = sceneRef.current;
    
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    
    if (rightHinge) rightHinge.rotation.z = (Math.PI / 2) * ease;
    if (leftHinge) leftHinge.rotation.z = -(Math.PI / 2) * ease;
    if (frontHinge) frontHinge.rotation.x = -(Math.PI / 2) * ease;
    if (backHinge) backHinge.rotation.x = (Math.PI / 2) * ease;
    if (topHinge) topHinge.rotation.x = -(Math.PI / 2) * ease;
  };

  useEffect(() => { updateHinges(progress); }, [progress, w, h, d]);

  const areaValue = (2 * (w * h + w * d + h * d)).toFixed(1);
  const perimeterValue = (2 * w + 4 * d + 8 * h).toFixed(1); 

  return (
    <div className="w-full h-full flex flex-col relative bg-[#0B0C10] overflow-hidden">
      <GameHeader title="3D Prizma Açılımı" subtitle="Geometrik Tasarım: Holografik Veri Bloğu" />
      
      <div ref={mountRef} className="absolute inset-0 z-10" style={{ top: '80px' }} />
      
      {/* Right Side Control Panel */}
      <div className="absolute right-0 top-[80px] bottom-0 w-[380px] bg-[#0B0C10]/80 border-l border-[#FF0055]/20 backdrop-blur-xl p-6 flex flex-col z-50 shadow-[-10px_0_40px_rgba(255,0,85,0.1)] overflow-y-auto">
        
        {/* Slider Section */}
        <div className="mb-8">
          <label className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#FF0055] animate-pulse"></span>
            Simülasyon Barı
          </label>
          
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={progress} 
            onChange={(e) => setProgress(parseFloat(e.target.value))} 
            className="w-full accent-[#FF0055] mb-3 rounded-full cursor-pointer h-2 outline-none appearance-none"
            style={{
              background: `linear-gradient(to right, #FF0055 ${progress * 100}%, rgba(255,255,255,0.1) ${progress * 100}%)`
            }}
          />
          
          <div className="flex justify-between w-full text-[11px] font-bold text-gray-500 uppercase px-1">
            <span className={`transition-colors duration-300 ${progress < 0.1 ? "text-[#00E5FF]" : ""}`}>Açık (Ağ)</span>
            <span className={`transition-colors duration-300 ${progress > 0.9 ? "text-[#FF0055]" : ""}`}>Kapalı (Kutu)</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF0055]/30 to-transparent mb-6"></div>

        {/* Math Section */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-xs font-bold text-[#FF0055] tracking-wider uppercase mb-3 text-center">Prizmayı Tanıyalım</h3>
            <p className="text-[12px] font-medium text-gray-300 leading-relaxed mb-4">
              Dikdörtgenler prizması <strong className="text-[#FF0055]">6 adet</strong> dikdörtgen yüzeyden oluşur. Karşılıklı bakan yüzeylerin alanları birbirine <strong className="text-[#00E5FF]">eşittir</strong>.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-[12px] text-gray-300 font-mono tracking-tight leading-tight flex flex-col gap-3">
               
               <div className="flex justify-between border-b border-white/5 pb-2 items-center">
                 <span className="text-gray-400">Genişlik (<InlineMath math="w"/>)</span> 
                 <div className="flex items-center gap-1">
                   <button onClick={() => setW(Math.max(2, w - 1))} className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white font-bold transition-all">-</button>
                   <span className="text-[#00E5FF] w-8 text-center text-sm font-bold">{w}</span>
                   <button onClick={() => setW(Math.min(8, w + 1))} className="w-5 h-5 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/40 rounded-md flex items-center justify-center text-[#00E5FF] font-bold transition-all">+</button>
                 </div>
               </div>

               <div className="flex justify-between border-b border-white/5 pb-2 items-center">
                 <span className="text-gray-400">Derinlik (<InlineMath math="d"/>)</span> 
                 <div className="flex items-center gap-1">
                   <button onClick={() => setD(Math.max(2, d - 1))} className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white font-bold transition-all">-</button>
                   <span className="text-[#00E5FF] w-8 text-center text-sm font-bold">{d}</span>
                   <button onClick={() => setD(Math.min(8, d + 1))} className="w-5 h-5 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/40 rounded-md flex items-center justify-center text-[#00E5FF] font-bold transition-all">+</button>
                 </div>
               </div>
               
               <div className="flex justify-between items-center pt-1">
                 <span className="text-gray-400">Yükseklik (<InlineMath math="h"/>)</span> 
                 <div className="flex items-center gap-1">
                   <button onClick={() => setH(Math.max(2, h - 1))} className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white font-bold transition-all">-</button>
                   <span className="text-[#FF0055] w-8 text-center text-sm font-bold">{h}</span>
                   <button onClick={() => setH(Math.min(8, h + 1))} className="w-5 h-5 bg-[#FF0055]/20 hover:bg-[#FF0055]/40 rounded-md flex items-center justify-center text-[#FF0055] font-bold transition-all">+</button>
                 </div>
               </div>
               
            </div>
          </div>

          <div className="bg-[#FF0055]/10 border border-[#FF0055]/20 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF0055]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-[12px] font-bold text-[#FF0055] tracking-wider uppercase mb-2">Yüzey Alanı (Karton Miktarı)</h3>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              3 farklı dikdörtgenden ikişer tane! (Ön-Arka, Sağ-Sol, Alt-Üst)
            </p>
            <div className="text-sm text-white mb-2 overflow-x-auto overflow-y-hidden text-center scale-95 origin-center font-sans">
              <BlockMath math="\text{Alan} = 2 \cdot (w{\cdot}h + w{\cdot}d + h{\cdot}d)" />
              <BlockMath math={`\\text{Alan} = 2 \\cdot (${w}{\\cdot}${h} + ${w}{\\cdot}${d} + ${h}{\\cdot}${d})`} />
            </div>
            <div className="text-3xl font-bold text-white tracking-widest text-center mt-2 flex items-baseline justify-center gap-1">
              {areaValue} <span className="text-[12px] text-gray-400 font-medium">br²</span>
            </div>
          </div>

          <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-16 h-16 bg-[#00E5FF]/10 rounded-br-full -ml-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-[12px] font-bold text-[#00E5FF] tracking-wider uppercase mb-2">Ağ Çevresi (Dış Sınır)</h3>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              Klasik haç biçiminde açılmış prizmanın çevresi boyunca makas çizgisi.
            </p>
            <div className="text-sm text-white mb-2 overflow-x-auto overflow-y-hidden text-center scale-95 origin-center font-sans">
              <BlockMath math="\text{Çevre} = 2 \cdot w + 4 \cdot d + 8 \cdot h" />
              <BlockMath math={`\\text{Çevre} = 2(${w}) + 4(${d}) + 8(${h})`} />
            </div>
            <div className="text-3xl font-bold text-white tracking-widest text-center mt-2 flex items-baseline justify-center gap-1">
              {perimeterValue} <span className="text-[12px] text-gray-400 font-medium">br</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-gradient-to-b from-[#1F2833] to-[#121212] p-10 rounded-[2.5rem] max-w-md w-full border border-gray-700 text-center shadow-[0_0_100px_rgba(255,0,85,0.2)] relative overflow-hidden"
            >
              <button 
                onClick={() => setShowSuccess(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-green-500/20 to-transparent pointer-events-none" />

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(74,222,128,0.4)] relative z-10"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-3 relative z-10">Harika İş!</h2>
              <p className="text-gray-400 mb-8 text-lg relative z-10">Dikdörtgenler Prizmasının ağını başarıyla çözümledin.</p>
              
              <div className="bg-[#0B0C10]/80 rounded-2xl p-6 mb-8 text-left border border-gray-800 relative z-10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF0055]" /> Kazanılan Atom
                </h3>
                <div className="space-y-4">
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">G8.GEO.020.2</div>
                      <div className="text-xs text-gray-400">Dikdörtgenler Prizması Açınımı</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 bg-[#FF0055] hover:bg-[#ff1a66] text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,0,85,0.4)] relative z-10"
              >
                İncelemeye Devam Et
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
