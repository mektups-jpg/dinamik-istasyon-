import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GameHeader } from '../../../components/ui/GameHeader';
import { InlineMath, BlockMath } from 'react-katex';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Star, Sparkles, X } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

export default function PyramidApp() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [a, setA] = useState(5.0); // Taban Ayrıtı
  const [h, setH] = useState(4.5); // Piramit Yüksekliği (True Height)

  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();
  const [hasWon, setHasWon] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (progress === 0 && !hasWon) {
      setHasWon(true);
      setShowSuccess(true);
      unlockAtom('G8.GEO.020.3');
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

    let w = mountRef.current.clientWidth || 800;
    let h_canvas = mountRef.current.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0B0C10');
    scene.fog = new THREE.FogExp2('#0B0C10', 0.02);

    const camera = new THREE.PerspectiveCamera(45, w / h_canvas, 0.1, 100);
    camera.position.set(10, 10, 14);
    camera.setViewOffset(w, h_canvas, 190, 0, w, h_canvas);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h_canvas);
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
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00E5FF, 3, 20);
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

    const gridHelper = new THREE.GridHelper(40, 40, 0x00E5FF, 0x1a1a1a);
    gridHelper.position.y = -1.99;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.2;
    scene.add(gridHelper);

    const sceneGroup = new THREE.Group();
    sceneGroup.position.set(0, -1, 0); // Center standard
    scene.add(sceneGroup);

    // --- Materials ---
    const matBase = new THREE.MeshPhysicalMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.2, side: THREE.DoubleSide });
    const matSides = new THREE.MeshPhysicalMaterial({ color: 0xB388FF, transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0.3, clearcoat: 1.0, side: THREE.DoubleSide });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

    globalsRef.current = { scene, camera, renderer, controls, sceneGroup, materials: { matBase, matSides, edgeMat } };

    // --- Animation Loop ---
    let frameId: number;
    const render = () => {
      frameId = requestAnimationFrame(render);
      controls.update();
      
      const time = Date.now() * 0.001;
      sceneGroup.position.y = -1 + Math.sin(time * 2) * 0.15; // Floating pyramid
      
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
      matBase.dispose(); matSides.dispose(); edgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  // 2. Dynamic Geometry Rebuilder
  useEffect(() => {
    if (!globalsRef.current) return;
    const { sceneGroup, materials } = globalsRef.current;
    const { matBase, matSides, edgeMat } = materials;

    while (sceneGroup.children.length > 0) {
      sceneGroup.remove(sceneGroup.children[0]);
    }

    const W = a;
    const H = h;
    const L = Math.sqrt(H * H + (W / 2) * (W / 2)); 
    const foldingAngle = -Math.PI + Math.acos((W / 2) / L);

    // 1. Base (Square)
    const baseGeo = new THREE.PlaneGeometry(W, W);
    baseGeo.rotateX(-Math.PI / 2); // Lay flat on XZ
    const baseMesh = new THREE.Mesh(baseGeo, matBase);
    baseMesh.castShadow = true; baseMesh.receiveShadow = true;
    baseMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo), edgeMat));
    sceneGroup.add(baseMesh);

    // --- Outward Triangle Geometry ---
    const triGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -W / 2, 0, 0,  
       W / 2, 0, 0,  
       0, 0, L       
    ]);
    triGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    triGeo.computeVertexNormals(); 

    const createTriangle = () => {
      const mesh = new THREE.Mesh(triGeo, matSides);
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(triGeo), edgeMat));
      mesh.castShadow = true; mesh.receiveShadow = true;
      return mesh;
    };

    const createFoldingHinge = (posX: number, posZ: number, rotY: number) => {
      const edgeAnchor = new THREE.Group();
      edgeAnchor.position.set(posX, 0, posZ);
      edgeAnchor.rotation.y = rotY; 

      const hinge = new THREE.Group(); 
      hinge.add(createTriangle());
      edgeAnchor.add(hinge);

      sceneGroup.add(edgeAnchor);
      return hinge; 
    };

    const frontHinge = createFoldingHinge(0, W / 2, 0); 
    const backHinge = createFoldingHinge(0, -W / 2, Math.PI); 
    const rightHinge = createFoldingHinge(W / 2, 0, Math.PI / 2); 
    const leftHinge = createFoldingHinge(-W / 2, 0, -Math.PI / 2); 

    sceneRef.current = { rightHinge, leftHinge, frontHinge, backHinge, foldingAngle };
    
    updateHinges(progress);

    return () => {
      baseGeo.dispose();
      triGeo.dispose();
    };
  }, [a, h]);

  const updateHinges = (p: number) => {
    if (!sceneRef.current) return;
    const { rightHinge, leftHinge, frontHinge, backHinge, foldingAngle } = sceneRef.current;
    
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const targetAngle = foldingAngle * ease;

    if (rightHinge) rightHinge.rotation.x = targetAngle;
    if (leftHinge) leftHinge.rotation.x = targetAngle;
    if (frontHinge) frontHinge.rotation.x = targetAngle;
    if (backHinge) backHinge.rotation.x = targetAngle;
  };

  useEffect(() => { updateHinges(progress); }, [progress, a, h]);

  const L = Math.sqrt(Math.pow(h, 2) + Math.pow(a / 2, 2));
  const areaValue = (Math.pow(a, 2) + 2 * a * L).toFixed(1);
  const perimeterValue = (8 * a).toFixed(1); // Standard star net

  return (
    <div className="w-full h-full flex flex-col relative bg-[#0B0C10] overflow-hidden">
      <GameHeader title="3D Kare Dik Piramit" subtitle="Geometrik Gizemler: Kuantum Çekirdeği" />
      
      <div ref={mountRef} className="absolute inset-0 z-10" style={{ top: '80px' }} />
      
      {/* Right Side Control Panel */}
      <div className="absolute right-0 top-[80px] bottom-0 w-[380px] bg-[#0B0C10]/80 border-l border-[#00E5FF]/20 backdrop-blur-xl p-6 flex flex-col z-50 shadow-[-10px_0_40px_rgba(0,229,255,0.15)] overflow-y-auto">
        
        {/* Slider Section */}
        <div className="mb-8">
          <label className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#B388FF] animate-pulse"></span>
            Simülasyon Barı
          </label>
          
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={progress} 
            onChange={(e) => setProgress(parseFloat(e.target.value))} 
            className="w-full accent-[#B388FF] mb-3 rounded-full cursor-pointer h-2 outline-none appearance-none"
            style={{
              background: `linear-gradient(to right, #B388FF ${progress * 100}%, rgba(255,255,255,0.1) ${progress * 100}%)`
            }}
          />
          
          <div className="flex justify-between w-full text-[11px] font-bold text-gray-500 uppercase px-1">
            <span className={`transition-colors duration-300 ${progress < 0.1 ? "text-[#00E5FF]" : ""}`}>Açık (Ağ)</span>
            <span className={`transition-colors duration-300 ${progress > 0.9 ? "text-[#B388FF]" : ""}`}>Kapalı (Zirve)</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent mb-6"></div>

        {/* Math Section */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-xs font-bold text-[#00E5FF] tracking-wider uppercase mb-3 text-center">Piramidi Tanıyalım</h3>
            <p className="text-[12px] font-medium text-gray-300 leading-relaxed mb-4">
              Kare dik piramit, <strong className="text-[#00E5FF]">1 kare taban</strong> ve bu tabanın kenarlarından yükselerek tek bir zirvede birleşen <strong className="text-[#B388FF]">4 eş ikizkenar üçgenden</strong> oluşur.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-[12px] text-gray-300 font-mono tracking-tight leading-tight flex flex-col gap-3">
               
               <div className="flex justify-between border-b border-white/5 pb-2 items-center">
                 <span className="text-gray-400">Kare Ayrıtı (<InlineMath math="a"/>)</span> 
                 <div className="flex items-center gap-1">
                   <button onClick={() => setA(Math.max(2, a - 1))} className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white font-bold transition-all">-</button>
                   <span className="text-[#00E5FF] w-8 text-center text-sm font-bold">{a}</span>
                   <button onClick={() => setA(Math.min(8, a + 1))} className="w-5 h-5 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/40 rounded-md flex items-center justify-center text-[#00E5FF] font-bold transition-all">+</button>
                 </div>
               </div>
               
               <div className="flex justify-between items-center pt-1">
                 <span className="text-gray-400">Piramit Yüksekliği (<InlineMath math="h"/>)</span> 
                 <div className="flex items-center gap-1">
                   <button onClick={() => setH(Math.max(2, h - 1))} className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white font-bold transition-all">-</button>
                   <span className="text-[#B388FF] w-8 text-center text-sm font-bold">{h}</span>
                   <button onClick={() => setH(Math.min(10, h + 1))} className="w-5 h-5 bg-[#B388FF]/20 hover:bg-[#B388FF]/40 rounded-md flex items-center justify-center text-[#B388FF] font-bold transition-all">+</button>
                 </div>
               </div>
               
               <div className="flex justify-between border-t border-white/5 mt-1 pt-2 items-center">
                 <span className="text-gray-400">Üçgen Yüksekliği (<InlineMath math="L"/>)</span> 
                 <span className="text-gray-400 text-xs pr-2">{L.toFixed(1)} br</span>
               </div>
               
            </div>
          </div>

          <div className="bg-[#B388FF]/10 border border-[#B388FF]/20 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#B388FF]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-[12px] font-bold text-[#B388FF] tracking-wider uppercase mb-2">Yüzey Alanı</h3>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              Zemindeki kare evrağını ve yanlarındaki 4 üçgensel yelkeni toplarız!
            </p>
            <div className="text-sm text-white mb-2 overflow-x-auto overflow-y-hidden text-center scale-95 origin-center font-sans">
              <BlockMath math="\text{Alan} = A_{\text{kare}} + 4 \cdot A_{\text{üçgen}}" />
              <BlockMath math={`\\text{Alan} = a^2 + 4 \\cdot \\left(\\frac{a \\cdot L}{2}\\right)`} />
              <BlockMath math={`\\text{Alan} = ${a}^2 + 2 \\cdot (${a} \\cdot ${L.toFixed(1)})`} />
            </div>
            <div className="text-3xl font-bold text-white tracking-widest text-center mt-2 flex items-baseline justify-center gap-1">
              {areaValue} <span className="text-[12px] text-gray-400 font-medium">br²</span>
            </div>
          </div>

          <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-16 h-16 bg-[#00E5FF]/10 rounded-br-full -ml-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-[12px] font-bold text-[#00E5FF] tracking-wider uppercase mb-2">Ağ Çevresi (Yıldız Modeli)</h3>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              4 yapraklı yonca (veya yıldız) gibi açılan piramidin dış hatlarının toplamı.
            </p>
            <div className="text-sm text-white mb-2 overflow-x-auto overflow-y-hidden text-center scale-95 origin-center font-sans">
              <BlockMath math="\text{Çevre} = 8 \cdot a" />
              <BlockMath math={`\\text{Çevre} = 8 \\cdot (${a})`} />
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
              className="bg-gradient-to-b from-[#1F2833] to-[#121212] p-10 rounded-[2.5rem] max-w-md w-full border border-gray-700 text-center shadow-[0_0_100px_rgba(179,136,255,0.2)] relative overflow-hidden"
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
              <p className="text-gray-400 mb-8 text-lg relative z-10">Kare Piramidin ağını (açınımını) başarıyla çözümledin.</p>
              
              <div className="bg-[#0B0C10]/80 rounded-2xl p-6 mb-8 text-left border border-gray-800 relative z-10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B388FF]" /> Kazanılan Atom
                </h3>
                <div className="space-y-4">
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">G8.GEO.020.3</div>
                      <div className="text-xs text-gray-400">Piramit Açınımı ve Temel Elemanları</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 bg-[#B388FF] hover:bg-[#9d66ff] text-[#0B0C10] font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(179,136,255,0.4)] relative z-10"
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
