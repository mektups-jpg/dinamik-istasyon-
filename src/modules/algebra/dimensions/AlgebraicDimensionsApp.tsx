import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, PanInfo } from 'motion/react';
import { ArrowLeft, Box, Square, Minus, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import AstroGuide, { AstroMood } from '../../../components/AstroGuide';

type Dimension = 1 | 2 | 3;

export default function AlgebraicDimensionsApp() {
  const navigate = useNavigate();
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [xValue, setXValue] = useState<number>(1);
  const [activeDim, setActiveDim] = useState<Dimension>(1);
  const [explored, setExplored] = useState({ 1: false, 2: false, 3: false });

  // 3D Orbital Controls via Mouse Drag
  const rotateX = useMotionValue(20);
  const rotateY = useMotionValue(-30);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handlePan = (event: Event, info: PanInfo) => {
    // Modify rotation based on drag deltas
    rotateY.set(rotateY.get() + info.delta.x * 0.6);
    rotateX.set(rotateX.get() - info.delta.y * 0.6);
  };

  // Guide Logic
  const getGuideMood = (): AstroMood => 'hint';
  const getGuideMessage = () => {
    if (activeDim === 1) return "1. Boyut (Uzunluk): Tek bir eksende uzayan düz bir çizgi! Ekrandaki siyah alana tıklayıp fareyi sürükle, çizgiyi 3D uzayda çevirerek yakından incele.";
    if (activeDim === 2) return "2. Boyut (Alan): İki eksen x². Ekranı fareyle çevir ve kareye yandan bak! Tamamen düz, kalınlığı 'sıfır' olan mükemmel bir alan göreceksin.";
    return "3. Boyut (Hacim): Derinlik de eklendi! (x³). 3D dünyamıza hoş geldin. Tesseract'ı fareyle tut, istediğin gibi çevirip her açısından incele.";
  };

  const handleXChange = (val: number) => {
    setXValue(val);
    if (!explored[activeDim] && val > 3) {
      setExplored(prev => ({ ...prev, [activeDim]: true }));
      unlockAtom("G7.ALG.020.1");
      if (explored[1] && explored[2] && explored[3]) {
         unlockAtom("G7.ALG.020.2");
         addScore(150);
      }
    }
  };

  // Base unit sizing for the visualizer
  const BASE_UNIT = 8; // 1 unit = 8px. Max x = 20 -> 160px
  
  const currentResult = Math.pow(xValue, activeDim);
  const getFormattedFormula = () => {
    if (activeDim === 1) return `x = ${xValue}`;
    if (activeDim === 2) return `x² = ${xValue}² = ${currentResult}`;
    return `x³ = ${xValue}³ = ${currentResult}`;
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-mono flex flex-col w-full h-full relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050510] to-[#050510]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <header className="p-6 border-b border-gray-800 bg-black/50 backdrop-blur-md flex items-center justify-between relative z-30">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
            <h1 className="text-xl font-medium tracking-tight text-blue-100">Boyutlararası Cebir Odası</h1>
            <p className="text-xs text-blue-500/70 mt-1 uppercase tracking-widest">SİSTEM: TESSERACT // CEBİR_V1</p>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-6 relative z-20 max-w-7xl mx-auto w-full">
        
        {/* Top Control Panel */}
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-black/40 border border-blue-900/50 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" /> Değişken Sensörü
                </h3>
                <div className="flex items-center gap-6">
                    <span className="text-2xl text-blue-300 font-light">x = <span className="font-bold text-white">{xValue}</span></span>
                    <input 
                        type="range" min="1" max="25" value={xValue}
                        onChange={(e) => handleXChange(parseInt(e.target.value))}
                        className="flex-1 h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <button 
                  onClick={() => setActiveDim(1)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${
                      activeDim === 1 ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                    <Minus className="w-6 h-6" />
                    <div className="text-left">
                        <div className="text-sm font-bold">1D</div>
                        <div className="text-[10px] uppercase opacity-70">Uzunluk (x)</div>
                    </div>
                </button>
                <button 
                  onClick={() => setActiveDim(2)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${
                      activeDim === 2 ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                    <Square className="w-6 h-6" />
                    <div className="text-left">
                        <div className="text-sm font-bold">2D</div>
                        <div className="text-[10px] uppercase opacity-70">Alan (x²)</div>
                    </div>
                </button>
                <button 
                  onClick={() => setActiveDim(3)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${
                      activeDim === 3 ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                    <Box className="w-6 h-6" />
                    <div className="text-left">
                        <div className="text-sm font-bold">3D</div>
                        <div className="text-[10px] uppercase opacity-70">Hacim (x³)</div>
                    </div>
                </button>
            </div>
        </div>

        {/* Math HUD */}
        <div className="flex gap-4 items-end">
            <div className="bg-black/80 border border-gray-700/50 p-4 rounded-xl flex items-center justify-between w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: activeDim === 1 ? '#3b82f6' : activeDim === 2 ? '#a855f7' : '#10b981' }}></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest pl-3 mb-1">Cebirsel Değerlendirme</span>
                    <span className="text-3xl font-light pl-3 tracking-wider">{getFormattedFormula()}</span>
                </div>
            </div>
            {explored[1] && explored[2] && explored[3] && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse">
                    Müfredat Hedefi Tamamlandı
                </div>
            )}
        </div>

        {/* The Holographic Theater */}
        <div className="flex-1 bg-[#0A0A0F] rounded-3xl border border-gray-800/80 relative flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] overflow-hidden [perspective:1000px] cursor-grab active:cursor-grabbing">
            
            {/* Draggable Surface */}
            <motion.div 
              className="absolute inset-0 z-40"
              onPan={handlePan}
            />

            {/* Hint Overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-gray-700/50 pointer-events-none z-30">
                <span className="text-gray-400 text-xs">Fare ile tut ve çevir</span>
            </div>

            {/* Center Coordinate Crosshair (Static) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20 pointer-events-none z-10">
                <div className="absolute top-1/2 w-full h-[1px] bg-white -translate-y-1/2" />
                <div className="absolute left-1/2 h-full w-[1px] bg-white -translate-x-1/2" />
            </div>

            {/* 3D Master Orbit Container */}
            <motion.div 
                className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d] pointer-events-none"
                style={{ rotateX: springRotateX, rotateY: springRotateY }}
            >
                <AnimatePresence mode="wait">
                    
                    {/* 1D Visualizer (Line in 3D Space) */}
                    {activeDim === 1 && (
                        <motion.div 
                            key="1d"
                            className="absolute bg-blue-500 shadow-[0_0_30px_#3b82f6] rounded-full [backface-visibility:visible]"
                            initial={{ opacity: 0, scale: 0.5 }} 
                            animate={{ opacity: 1, scale: 1, width: xValue * BASE_UNIT * 3, height: 4, x: "-50%", y: "-50%" }} 
                            exit={{ opacity: 0, scale: 0.5 }}
                            style={{ top: '50%', left: '50%' }}
                        />
                    )}

                    {/* 2D Visualizer (Square Plane in 3D Space) */}
                    {activeDim === 2 && (
                        <motion.div 
                            key="2d"
                            className="absolute bg-purple-500/20 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-sm [backface-visibility:visible]"
                            initial={{ opacity: 0, scale: 0.5 }} 
                            animate={{ 
                                opacity: 1, scale: 1, 
                                width: xValue * BASE_UNIT * 1.5, 
                                height: xValue * BASE_UNIT * 1.5,
                                x: "-50%", y: "-50%"
                            }} 
                            exit={{ opacity: 0, scale: 0.5 }}
                            style={{ top: '50%', left: '50%' }}
                        />
                    )}

                    {/* 3D Visualizer (Isometric Cube) */}
                    {activeDim === 3 && (
                        <motion.div 
                            key="3d"
                            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} exit={{ opacity: 0, scale: 0.5 }}
                        >
                            {/* Cube Faces via standard CSS 3D */}
                            {['front','back','top','bottom','left','right'].map((face) => {
                                const size = xValue * BASE_UNIT;
                                const half = size / 2;
                                let transform = '';
                                
                                switch(face) {
                                    case 'front': transform = `translateZ(${half}px)`; break;
                                    case 'back': transform = `rotateY(180deg) translateZ(${half}px)`; break;
                                    case 'right': transform = `rotateY(90deg) translateZ(${half}px)`; break;
                                    case 'left': transform = `rotateY(-90deg) translateZ(${half}px)`; break;
                                    case 'top': transform = `rotateX(90deg) translateZ(${half}px)`; break;
                                    case 'bottom': transform = `rotateX(-90deg) translateZ(${half}px)`; break;
                                }

                                return (
                                    <motion.div 
                                        key={face}
                                        className="absolute top-1/2 left-1/2 border border-emerald-400/50 bg-emerald-900/40 backdrop-blur-sm [backface-visibility:visible]"
                                        animate={{ 
                                            width: size, 
                                            height: size,
                                            x: "-50%",
                                            y: "-50%",
                                            transform: transform
                                        }}
                                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                        style={{ transformOrigin: "center" }}
                                    />
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

        </div>
      </main>

      <AstroGuide 
        visible={true}
        message={getGuideMessage()}
        mood={getGuideMood()}
        onClose={() => {}}
      />
    </div>
  );
}
