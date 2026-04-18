import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Crosshair, Radar, LocateFixed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import AstroGuide, { AstroMood } from '../../../components/AstroGuide';

const GRID_SIZE = 10;
const GRID_HALF = GRID_SIZE / 2;

const LEVELS = [
  { id: 1, target: { x: 3, y: 2 }, desc: "Hedef (3, 2). X ekseni yatay, Y ekseni ise dikey konumu belirler." },
  { id: 2, target: { x: -4, y: 1 }, desc: "Negatif alanlara giriyoruz. X lazerini merkezin soluna kaydır." },
  { id: 3, target: { x: -3, y: -4 }, desc: "Hem X hem Y negatif. Hedef, 3. Bölge'de saklanıyor!" },
  { id: 4, target: { x: 0, y: -5 }, desc: "Y ekseninin en dibine inmelisin, X ise tam merkezde kalmalı." },
];

export default function CoordinateGridApp() {
  const navigate = useNavigate();
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const level = LEVELS[currentLevelIdx];

  // Laser Controls
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const [guideConfig, setGuideConfig] = useState<{ visible: boolean; message: string; mood: AstroMood }>({
    visible: true,
    message: "Kaptan! Holografik Lazer Ağına hoş geldin. X ve Y sürgülerini kullanarak kesişim noktasını hedefin üzerine getir!",
    mood: 'idle'
  });

  const getPosPercents = (val: number) => {
    return ((val + GRID_HALF) / GRID_SIZE) * 100;
  };

  const handleFire = () => {
    if (currentX === level.target.x && currentY === level.target.y) {
      // Success
      setGuideConfig({ visible: false, message: '', mood: 'idle' });
      setShowSuccess(true);
      setTimeout(() => {
        unlockAtom("G8.GEO.010.1"); 
        unlockAtom("G8.GEO.010.2"); 
        unlockAtom("G8.GEO.010.3"); 
        addScore(100);
      }, 500);
    } else {
      // Error handling & Hints
      setAttempts(prev => prev + 1);
      
      let msg = "";
      let mood: AstroMood = "error";
      
      if (currentX !== level.target.x && currentY !== level.target.y) {
        msg = `Hedefi ıskaladık! Hem X hem Y lazerinin ayarı hatalı. Hedef (${level.target.x}, ${level.target.y}) konumunda!`;
      } else if (currentX !== level.target.x) {
        const dir = currentX > level.target.x ? 'sola (eksi)' : 'sağa (artı)';
        mood = 'hint';
        msg = `Y dikey lazerin harika konumda ama yatayda hedeften uzağız! X lazerini biraz daha ${dir} kaydır.`;
      } else {
        const dir = currentY > level.target.y ? 'aşağı (eksi)' : 'yukarı (artı)';
        mood = 'hint';
        msg = `X yatay lazeri tam üstünde! Fakat dikeyde ıskaladık. Y lazerini biraz daha ${dir} çek.`;
      }

      setGuideConfig({ visible: true, mood, message: msg });
    }
  };

  const handleNext = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setCurrentX(0); 
      setCurrentY(0);
      setAttempts(0);
      setGuideConfig({
        visible: true,
        mood: 'idle',
        message: LEVELS[currentLevelIdx + 1].desc
      });
      setShowSuccess(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col w-full h-full relative overflow-hidden">
      
      {/* Background Starfield */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />
      
      <header className="p-6 border-b border-gray-800 bg-black/50 backdrop-blur-md flex items-center gap-4 relative z-30">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Holografik Lazer Ağı</h1>
          <p className="text-xs text-gray-500 mt-1">SİSTEM: ANALİTİK_GEOMETRİ // V2.0</p>
        </div>
      </header>

      <main className="flex-1 flex md:flex-row flex-col p-6 gap-6 relative z-20">
        
        {/* LEFT: Laser Controls */}
        <div className="w-full md:w-[350px] flex flex-col gap-6">
          
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-[#B388FF]"></div>
            
            <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Radar className="w-4 h-4 text-[#00E5FF]" /> Lazer Kontrol Paneli
            </h2>
            
            <div className="bg-black/50 border border-gray-800 rounded-xl p-4 mb-8">
               <p className="text-xs text-gray-500 mb-1">Mevcut Koordinat</p>
               <div className="text-3xl font-light tracking-wider flex items-center gap-2">
                 <span>(</span>
                 <span className="text-[#00E5FF] w-8 text-center">{currentX}</span>
                 <span className="text-gray-500">,</span>
                 <span className="text-[#B388FF] w-8 text-center">{currentY}</span>
                 <span>)</span>
               </div>
            </div>

            <div className="space-y-8">
              {/* X Axis Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-medium text-[#00E5FF] flex items-center gap-2">
                    X Ekseni <span className="text-xs text-gray-500 uppercase">(Yatay Lazer)</span>
                  </label>
                  <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-1 rounded text-xs border border-[#00E5FF]/20">{currentX}</span>
                </div>
                <input 
                  type="range" 
                  min="-5" max="5" step="1"
                  value={currentX} 
                  onChange={(e) => setCurrentX(parseInt(e.target.value))}
                  className="w-full accent-[#00E5FF] h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                  <span>-5 (Sol)</span>
                  <span>0</span>
                  <span>+5 (Sağ)</span>
                </div>
              </div>

              {/* Y Axis Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-medium text-[#B388FF] flex items-center gap-2">
                    Y Ekseni <span className="text-xs text-gray-500 uppercase">(Dikey Lazer)</span>
                  </label>
                  <span className="bg-[#B388FF]/10 text-[#B388FF] px-2 py-1 rounded text-xs border border-[#B388FF]/20">{currentY}</span>
                </div>
                <input 
                  type="range" 
                  min="-5" max="5" step="1"
                  value={currentY} 
                  onChange={(e) => setCurrentY(parseInt(e.target.value))}
                  className="w-full accent-[#B388FF] h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                  <span>-5 (Aşağı)</span>
                  <span>0</span>
                  <span>+5 (Yukarı)</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleFire}
              className="w-full mt-10 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-white hover:text-white text-gray-300 font-medium rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95"
            >
              <LocateFixed className="w-5 h-5" /> IŞINLA (LOCK ON)
            </button>
          </div>
        </div>

        {/* RIGHT: Visual Radar Canvas */}
        <div className="flex-1 bg-[#050505] rounded-3xl border border-gray-800 relative flex items-center justify-center p-4 lg:p-12 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)]">
          
          <div className="relative w-full max-w-[600px] aspect-square rounded-xl border border-gray-800/50 relative bg-[#0a0a0a]">
            {/* Grid Cells Background */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>
            
            {/* Main Axes */}
            <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-gray-600 z-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <div className="absolute top-[50%] left-0 right-0 h-[2px] bg-gray-600 z-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />

            {/* Target Asteroid/Anomaly */}
            <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: 360 }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute w-8 h-8 rounded-full border border-red-500/30 flex items-center justify-center translate-x-[-50%] translate-y-[50%] z-20 bg-red-500/10"
               style={{ left: `${getPosPercents(level.target.x)}%`, bottom: `${getPosPercents(level.target.y)}%` }}
            >
               <Crosshair className="w-6 h-6 text-red-500" />
               <div className="absolute w-full h-full rounded-full bg-red-500/20 animate-ping"></div>
            </motion.div>

            {/* Laser X (Vertical line moving horizontally based on X value) */}
            <motion.div 
              animate={{ left: `${getPosPercents(currentX)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute top-0 bottom-0 w-[3px] bg-[#00E5FF] z-30 translate-x-[-50%] shadow-[0_0_20px_#00E5FF]"
            />

            {/* Laser Y (Horizontal line moving vertically based on Y value) */}
            <motion.div 
              animate={{ bottom: `${getPosPercents(currentY)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute left-0 right-0 h-[3px] bg-[#B388FF] z-30 translate-y-[50%] shadow-[0_0_20px_#B388FF]"
            />

            {/* The Intersection Node (Where lasers cross) */}
            <motion.div 
              animate={{ left: `${getPosPercents(currentX)}%`, bottom: `${getPosPercents(currentY)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute w-6 h-6 bg-white rounded-full z-40 translate-x-[-50%] translate-y-[50%] shadow-[0_0_30px_#fff] border-4 border-[#050505] flex items-center justify-center"
            >
               <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </motion.div>

          </div>

          <div className="absolute top-6 left-6 text-[#00E5FF]/50 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" /> Hedef Arayıcı Aktif
          </div>
        </div>

      </main>

      <AstroGuide 
        visible={guideConfig.visible}
        message={guideConfig.message}
        mood={guideConfig.mood}
        onClose={() => setGuideConfig(prev => ({ ...prev, visible: false }))}
      />

      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-gray-800 p-10 rounded-3xl max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none" />
              <LocateFixed className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-medium text-white mb-3 tracking-tight">Kilitlenme Başarılı!</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Kesişim noktası hedefin tam merkezinde. Koordinatlar doğru okundu ve doğrulandı.
              </p>
              
              <button 
                onClick={handleNext}
                className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {currentLevelIdx < LEVELS.length - 1 ? 'SONRAKİ HEDEF' : 'GÖREVİ TAMAMLA'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
