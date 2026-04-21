import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GameHeader } from '../../../components/ui/GameHeader';
import { InlineMath, BlockMath } from 'react-katex';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Star, Sparkles, X } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

export default function ConeApp() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [r, setR] = useState(3.0);
  const [h, setH] = useState(4.5);

  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();
  const [hasWon, setHasWon] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (progress === 0 && !hasWon) {
      setHasWon(true);
      setShowSuccess(true);
      unlockAtom('G8.GEO.020.5');
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
    scene.fog = new THREE.FogExp2('#0B0C10', 0.025);

    const camera = new THREE.PerspectiveCamera(45, w / h_canvas, 0.1, 100);
    camera.position.set(10, 8, 14);
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
    controls.target.set(0, 1.5, 0);

    // --- High-End Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x9D4EDD, 3, 20);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x00A8FF, 2, 15);
    pointLight2.position.set(0, 0, 5);
    scene.add(pointLight2);

    // --- Environment / Grid ---
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(40, 40, 0x00A8FF, 0x1a1a1a);
    gridHelper.position.y = -1.99;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.15;
    scene.add(gridHelper);

    const sceneGroup = new THREE.Group();
    sceneGroup.position.set(0, -1, 0);
    scene.add(sceneGroup);

    // --- Elegant Sci-Fi Materials ---
    const baseMat = new THREE.MeshPhysicalMaterial({ color: 0x00A8FF, transparent: true, opacity: 0.6, roughness: 0.2, metalness: 0.8, side: THREE.DoubleSide });
    const sideMat = new THREE.MeshPhysicalMaterial({ color: 0x9D4EDD, transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0.4, clearcoat: 1.0, side: THREE.DoubleSide });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xE0AAFF, wireframe: true, transparent: true, opacity: 0.25 });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00A8FF, opacity: 0.8, transparent: true });

    globalsRef.current = { scene, camera, renderer, controls, sceneGroup, materials: { baseMat, sideMat, wireMat, edgeMat } };

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
      baseMat.dispose(); sideMat.dispose(); wireMat.dispose(); edgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  // 2. Dynamic Geometry Rebuilder
  useEffect(() => {
    if (!globalsRef.current) return;
    const { sceneGroup, materials } = globalsRef.current;
    const { baseMat, sideMat, wireMat, edgeMat } = materials;

    while (sceneGroup.children.length > 0) {
      sceneGroup.remove(sceneGroup.children[0]);
    }

    const L = Math.sqrt(r * r + h * h); 
    const thetaMax = 2 * Math.PI * (r / L); 

    // 1. Base Circle
    const baseGeo = new THREE.CircleGeometry(r, 64);
    baseGeo.rotateX(-Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.receiveShadow = true;
    baseMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo), edgeMat));
    sceneGroup.add(baseMesh);

    // 2. Side Surface
    const segmentsX = 120;
    const segmentsY = 16;
    const planeGeo = new THREE.BufferGeometry();
    
    const vertexCount = (segmentsX + 1) * (segmentsY + 1);
    const positions = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = [];
    
    let idx = 0;
    for (let iy = 0; iy <= segmentsY; iy++) {
      for (let ix = 0; ix <= segmentsX; ix++) {
        uvs[idx * 2] = ix / segmentsX;     
        uvs[idx * 2 + 1] = iy / segmentsY; 
        idx++;
      }
    }
    
    for (let iy = 0; iy < segmentsY; iy++) {
      for (let ix = 0; ix < segmentsX; ix++) {
        const a_i = ix + (segmentsX + 1) * iy;
        const b_i = ix + (segmentsX + 1) * (iy + 1);
        const c_i = (ix + 1) + (segmentsX + 1) * (iy + 1);
        const d_i = (ix + 1) + (segmentsX + 1) * iy;
        indices.push(a_i, b_i, d_i);
        indices.push(b_i, c_i, d_i);
      }
    }

    planeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    planeGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    planeGeo.setIndex(indices);

    const sideMesh = new THREE.Mesh(planeGeo, sideMat);
    sideMesh.castShadow = true; sideMesh.receiveShadow = true;
    const wireMesh = new THREE.Mesh(planeGeo, wireMat);
    
    sceneGroup.add(sideMesh);
    sceneGroup.add(wireMesh);

    sceneRef.current = { planeGeo, positions, uvs, R: r, H: h, L, thetaMax, segmentsX, segmentsY };
    
    updateGeometry(progress);

    return () => {
      baseGeo.dispose();
      planeGeo.dispose();
    };
  }, [r, h]);

  const updateGeometry = (p: number) => {
    if (!sceneRef.current) return;
    const { planeGeo, positions, uvs, R, H, L, thetaMax, segmentsX, segmentsY } = sceneRef.current;
    
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    let idx = 0;
    for (let iy = 0; iy <= segmentsY; iy++) {
      for (let ix = 0; ix <= segmentsX; ix++) {
        const u = uvs[idx * 2];
        const vRaw = uvs[idx * 2 + 1]; 
        const v = 1 - vRaw; 

        // 1. PERFECT CONE STATE (p=1)
        const phi = (u - 0.5) * 2 * Math.PI; 
        const currentR_Cone = v * R;
        const cX = currentR_Cone * Math.sin(phi);
        const cY = (1 - v) * H;
        const cZ = currentR_Cone * Math.cos(phi);

        // 2. FLAT SECTOR STATE (p=0)
        const alpha = (u - 0.5) * thetaMax;
        const distFromApex = v * L;
        
        const fX = distFromApex * Math.sin(alpha);
        const fY = 0;
        const fZ = (R + L) - distFromApex * Math.cos(alpha);

        let posX = cX * ease + fX * (1 - ease);
        let posZ = cZ * ease + fZ * (1 - ease);
        let posY = cY * ease + fY * (1 - ease);

        const lift = Math.sin(ease * Math.PI);
        posY += lift * (1 - v) * 0.2; 

        positions[idx * 3] = posX;
        positions[idx * 3 + 1] = posY;
        positions[idx * 3 + 2] = posZ;
        idx++;
      }
    }
    
    planeGeo.attributes.position.needsUpdate = true;
    planeGeo.computeVertexNormals();
  };

  useEffect(() => { updateGeometry(progress); }, [progress, r, h]);

  const LString = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2)).toFixed(1);
  const areaValue = (Math.PI * Math.pow(r, 2) + Math.PI * r * parseFloat(LString)).toFixed(1);
  // Yay uzunluğu + 2 L + Taban dairesi
  const yay = 2 * Math.PI * r;
  const perimeterValue = (yay + 2 * parseFloat(LString) + yay).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col relative bg-[#0B0C10] overflow-hidden">
      <GameHeader title="3D Koni Açılımı" subtitle="Geometrik Deformasyon: Portal" />
      
      <div ref={mountRef} className="absolute inset-0 z-10" style={{ top: '80px' }} />
      
      {/* Right Side Control Panel */}
      <div className="absolute right-0 top-[80px] bottom-0 w-[380px] bg-[#0B0C10]/80 border-l border-[#9D4EDD]/20 backdrop-blur-xl p-6 flex flex-col z-50 shadow-[-10px_0_40px_rgba(157,78,221,0.15)] overflow-y-auto">
        
        {/* Slider Section */}
        <div className="mb-8">
          <label className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#9D4EDD] animate-pulse"></span>
            Simülasyon Barı
          </label>
          
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={progress} 
            onChange={(e) => setProgress(parseFloat(e.target.value))} 
            className="w-full accent-[#9D4EDD] mb-3 rounded-full cursor-pointer h-2 outline-none appearance-none"
            style={{
              background: `linear-gradient(to right, #9D4EDD ${progress * 100}%, rgba(255,255,255,0.1) ${progress * 100}%)`
            }}
          />
          
          <div className="flex justify-between w-full text-[11px] font-bold text-gray-500 uppercase px-1">
            <span className={`transition-colors duration-300 ${progress < 0.1 ? "text-[#00A8FF]" : ""}`}>Açık (Sektör)</span>
            <span className={`transition-colors duration-300 ${progress > 0.9 ? "text-[#9D4EDD]" : ""}`}>Kapalı (Koni)</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#9D4EDD]/30 to-transparent mb-6"></div>

        {/* Math Section */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-xs font-bold text-[#00A8FF] tracking-wider uppercase mb-3 text-center">Koniyi Tanıyalım</h3>
            <p className="text-[12px] font-medium text-gray-300 leading-relaxed mb-4">
              Yan yüzeyi tamamen açtığımızda mükemmel bir üçgen DEĞİL, devasa bir <strong className="text-[#9D4EDD]">Daire Dilimi (Sektör)</strong> elde ederiz!
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-[12px] text-gray-300 font-mono tracking-tight leading-tight flex flex-col gap-3">
               
               <div className="flex justify-between border-b border-white/5 pb-2 items-center">
                 <span className="text-gray-400">Yarıçap (<InlineMath math="r"/>)</span> 
                 <div className="flex items-center gap-1">
                   <button onClick={() => setR(Math.max(1, r - 0.5))} className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white font-bold transition-all">-</button>
                   <span className="text-[#00A8FF] w-8 text-center text-sm font-bold">{r.toFixed(1)}</span>
                   <button onClick={() => setR(Math.min(5, r + 0.5))} className="w-5 h-5 bg-[#00A8FF]/20 hover:bg-[#00A8FF]/40 rounded-md flex items-center justify-center text-[#00A8FF] font-bold transition-all">+</button>
                 </div>
               </div>
               
               <div className="flex justify-between items-center pt-1">
                 <span className="text-gray-400">Koni Yüksekliği (<InlineMath math="h"/>)</span> 
                 <div className="flex items-center gap-1">
                   <button onClick={() => setH(Math.max(2, h - 0.5))} className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white font-bold transition-all">-</button>
                   <span className="text-[#9D4EDD] w-8 text-center text-sm font-bold">{h.toFixed(1)}</span>
                   <button onClick={() => setH(Math.min(10, h + 0.5))} className="w-5 h-5 bg-[#9D4EDD]/20 hover:bg-[#9D4EDD]/40 rounded-md flex items-center justify-center text-[#9D4EDD] font-bold transition-all">+</button>
                 </div>
               </div>
               
               <div className="flex justify-between border-t border-white/5 mt-1 pt-2 items-center">
                 <span className="text-gray-400">Ana Doğru (<InlineMath math="L"/>)</span> 
                 <span className="text-[#9D4EDD]/80 text-xs pr-2">{LString} br</span>
               </div>
               
            </div>
          </div>

          <div className="bg-[#9D4EDD]/10 border border-[#9D4EDD]/20 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#9D4EDD]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-[12px] font-bold text-[#9D4EDD] tracking-wider uppercase mb-2">Yüzey Alanı</h3>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              Koniyi oluşturan taban dairesi ile onu saran daire dilimi (sektör) alanlarının toplamı.
            </p>
            <div className="text-sm text-white mb-2 overflow-x-auto overflow-y-hidden text-center scale-95 origin-center font-sans">
              <BlockMath math="\text{Alan} = \pi \cdot r^2 + \pi \cdot r \cdot L" />
              <BlockMath math={`\\text{Alan} = \pi \\cdot ${r.toFixed(1)}^2 + \pi \\cdot ${r.toFixed(1)} \\cdot ${LString}`} />
            </div>
            <div className="text-3xl font-bold text-white tracking-widest text-center mt-2 flex items-baseline justify-center gap-1">
              {areaValue} <span className="text-[12px] text-gray-400 font-medium">br²</span>
            </div>
          </div>

          <div className="bg-[#00A8FF]/10 border border-[#00A8FF]/20 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-16 h-16 bg-[#00A8FF]/10 rounded-br-full -ml-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-[12px] font-bold text-[#00A8FF] tracking-wider uppercase mb-2">Ağ Çevresi (Dış Sınır)</h3>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              Ayrılmış durumdaki taban çemberi ve yan yüzeyin (2 yarıçap L ve yay) etrafını dolaşma mesafesi.
            </p>
            <div className="text-sm text-white mb-2 overflow-x-auto overflow-y-hidden text-center scale-95 origin-center font-sans">
              <BlockMath math="\text{Çevre} = (2\pi \cdot r) + (2L + 2\pi \cdot r)" />
              <BlockMath math={`\\text{Çevre} \\approx ${yay.toFixed(1)} + (2 \\cdot ${LString} + ${yay.toFixed(1)})`} />
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
              className="bg-gradient-to-b from-[#1F2833] to-[#121212] p-10 rounded-[2.5rem] max-w-md w-full border border-gray-700 text-center shadow-[0_0_100px_rgba(0,168,255,0.2)] relative overflow-hidden"
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
              <p className="text-gray-400 mb-8 text-lg relative z-10">Koninin ağını (açınımını) başarıyla çözümledin.</p>
              
              <div className="bg-[#0B0C10]/80 rounded-2xl p-6 mb-8 text-left border border-gray-800 relative z-10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00A8FF]" /> Kazanılan Atom
                </h3>
                <div className="space-y-4">
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">G8.GEO.020.5</div>
                      <div className="text-xs text-gray-400">Koninin Açınımı ve Temel Elemanları</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 bg-[#00A8FF] hover:bg-[#0090e6] text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(0,168,255,0.4)] relative z-10"
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
