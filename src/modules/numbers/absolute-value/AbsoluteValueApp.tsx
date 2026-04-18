import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Target, Hexagon, Crosshair, Gem } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import AstroGuide, { AstroMood } from '../../../components/AstroGuide';

const RANGE = 10; // -10 to +10

// Yeni Yansıma (Reflection) Mekaniğine göre seviyeler
const LEVELS = [
  { 
    id: 1, 
    desc: "Aynanın gücünü kullanalım! Hedef +6 noktasında. Lazer sıfırdan seker. Vurmak için kuleyi nereye kurmalısın?", 
    targetPos: 6 
  },
  { 
    id: 2, 
    desc: "Hedef bu kez negatif bölgede (-8 noktasında). Aynaya olan uzaklığın aynı oranda yansıyacağını unutma!", 
    targetPos: -8,
  },
  { 
    id: 3, 
    desc: "Zorlu Görev! Hedef +4 noktasında. Doğru simetri noktasını bul ve mutlak değeri kanıtla.", 
    targetPos: 4,
  }
];

export default function AbsoluteValueApp() {
  const navigate = useNavigate();
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const level = LEVELS[currentLevelIdx];

  const [turretPos, setTurretPos] = useState(-3);
  const [isFiring, setIsFiring] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const [guideConfig, setGuideConfig] = useState<{ visible: boolean; message: string; mood: AstroMood }>({
    visible: true,
    message: "Kaptan! Lazer sadece '0' aynasına çarpıp diğer tarafa yansıyabilir. Hedefi kırmak için kuleyi doğru hizaya kur!",
    mood: 'idle'
  });

  const getPercent = (val: number) => ((val + RANGE) / (RANGE * 2)) * 100;

  const handleFire = () => {
    if (turretPos === 0) {
      setGuideConfig({
        visible: true, mood: 'error', 
        message: "Kule aynanın tam üzerinde (0)! Ateş edemezsin. Kuleyi aynadan uzaklaştır."
      });
      return;
    }

    setIsFiring(true);
    setShowMeasurement(false);

    // Laser hit checks
    const reflectedPos = -turretPos;
    const distance = Math.abs(turretPos);
    const success = (reflectedPos === level.targetPos);

    setTimeout(() => {
      setShowMeasurement(true);
      
      if (success) {
        setGuideConfig({ visible: false, message: '', mood: 'idle' });
        setTimeout(() => {
          setShowSuccess(true);
          unlockAtom("G6.NUM.020.1"); 
          unlockAtom("G6.NUM.020.2"); 
          unlockAtom("G6.NUM.020.3"); 
          addScore(100);
        }, 1500);
      } else {
        setAttempts(prev => prev + 1);
        let msg = "";
        let mood: AstroMood = "error";
        
        if (attempts === 0) {
            msg = `Karavana! Lazer ${distance} birim uzaktan geldiği için 0'dan yine ${distance} birim uzağa sekti ve ${reflectedPos}'i vurdu.`;
        } else {
            mood = 'hint';
            msg = `Matematiksel Simetri! Hedef ${level.targetPos} noktasındaysa, senin lazeri tam zıttı olan ${-level.targetPos} noktasından ateşlemen gerekir.`;
        }

        setGuideConfig({ visible: true, mood, message: msg });
        
        setTimeout(() => {
          setIsFiring(false);
          setShowMeasurement(false);
        }, 3000);
      }
    }, 1200); // Wait for both lasers to finish matching
  };

  const handleNext = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setTurretPos(LEVELS[currentLevelIdx + 1].targetPos === 6 ? -2 : 2); // default near
      setIsFiring(false);
      setShowMeasurement(false);
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

  const AxisTicks = () => {
    const ticks = [];
    for (let i = -RANGE; i <= RANGE; i++) {
      const isZero = i === 0;
      const pct = getPercent(i);
      ticks.push(
        <div key={`tick-${i}`} className="absolute top-0 bottom-0 flex flex-col items-center" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
          <div className={`w-0.5 ${isZero ? 'h-8 bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]' : 'h-4 bg-gray-600'} transition-all`} />
          {!isZero && i % 2 === 0 && (
            <span className="text-[10px] text-gray-500 mt-2 font-mono">{i}</span>
          )}
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col w-full h-full relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <header className="p-6 border-b border-gray-800 bg-black/50 backdrop-blur-md flex items-center gap-4 relative z-30">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Sıfıra Uzaklık Aynası</h1>
          <p className="text-xs text-gray-500 mt-1">SİSTEM: MUTLAK_DEĞER // V2.0</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-6 relative z-20 max-w-6xl mx-auto w-full">
        
        {/* Mission Briefing */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00E5FF]"></div>
            <div className="flex-1">
                <h2 className="text-[#00E5FF] text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> GÖREV BİLGİSİ
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">{level.desc}</p>
            </div>
            <div className="bg-black/50 border border-gray-800 rounded-xl py-3 px-6 text-center shrink-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Mevcut Hedef</p>
                <div className="text-3xl font-light text-[#00E5FF]">{level.targetPos}</div>
            </div>
        </div>

        {/* The Physics Canvas */}
        <div className="flex-1 w-full bg-[#0A0A0A] rounded-3xl border border-gray-800 relative flex flex-col justify-center items-center p-8 shadow-[inset_0_0_100px_rgba(0,0,0,1)] overflow-hidden">
            
            {/* The Zero Background Line */}
            <div className="absolute top-10 bottom-10 w-[2px] bg-[#00E5FF] opacity-10 left-[50%] z-0" />

            {/* Main Axis Line Component */}
            <div className="relative w-full h-32 mt-12">
                <div className="absolute top-0 w-full h-[2px] bg-gray-700" />
                {AxisTicks()}

                {/* The Zero Mirror Element (Fixed perfectly on the '0' axis) */}
                <div className="absolute top-0 left-1/2 translate-x-[-50%] translate-y-[-50%] z-30 flex flex-col items-center">
                    <div className="relative">
                        <motion.div 
                            animate={{ rotate: 360, borderColor: isFiring ? 'rgba(0,229,255,1)' : 'rgba(0,229,255,0.4)', backgroundColor: isFiring ? 'rgba(0,229,255,0.2)' : 'rgba(0,229,255,0.05)' }} 
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-16 border-2 rounded-sm flex items-center justify-center backdrop-blur-md"
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                        />
                        <Hexagon className="absolute inset-0 w-full h-full text-[#00E5FF]/90 p-1" />
                    </div>
                    <div className="absolute top-[120%] bg-black border border-[#00E5FF] text-[#00E5FF] px-3 py-1 rounded-full text-[10px] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)] whitespace-nowrap">
                        '0' AYNASI
                    </div>
                </div>

                {/* Target Crystal */}
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-24px] w-12 h-12 flex flex-col items-center z-10"
                    style={{ left: `${getPercent(level.targetPos)}%`, translateX: '-50%' }}
                >
                    <div className="bg-[#111] border-2 border-[#00E5FF]/50 rounded-lg p-2 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                        <Gem className="w-6 h-6 text-[#00E5FF]" />
                    </div>
                </motion.div>

                {/* The Laser Turret */}
                <motion.div 
                    className="absolute top-[-24px] w-12 h-12 flex flex-col items-center z-40 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                    style={{ left: `${getPercent(turretPos)}%`, translateX: '-50%' }}
                    layout
                >
                    <div className={`bg-black border-2 rounded-lg p-1.5 rotate-45 mb-2 ${isFiring ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'}`}>
                        <Crosshair className={`w-5 h-5 -rotate-45 ${isFiring ? 'text-red-400' : 'text-purple-400'}`} />
                    </div>
                </motion.div>

                {/* Turret Draggable Slider */}
                <input 
                  type="range"
                  min={-RANGE}
                  max={RANGE}
                  step={1}
                  value={turretPos}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if(val !== turretPos) {
                        setTurretPos(val);
                        setIsFiring(false);
                        setShowMeasurement(false);
                    }
                  }}
                  disabled={isFiring || showSuccess}
                  className="absolute top-[-10px] left-0 w-full h-10 opacity-0 cursor-pointer z-50 disabled:cursor-not-allowed"
                />

                {/* Beam 1: Turret to Zero */}
                <div className="absolute top-[-6px] h-3 z-20 pointer-events-none" style={{
                    left: turretPos < 0 ? `${getPercent(turretPos)}%` : '50%',
                    right: turretPos > 0 ? `${100 - getPercent(turretPos)}%` : '50%',
                }}>
                    <motion.div 
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ 
                            scaleX: isFiring ? 1 : 0,
                            opacity: isFiring ? 1 : 0
                        }}
                        transition={{ duration: 0.5, ease: "easeIn" }}
                        style={{ transformOrigin: turretPos < 0 ? 'left' : 'right' }}
                        className="w-full h-full bg-[#FF00FF] shadow-[0_0_30px_#FF00FF] rounded-full"
                    />
                </div>

                {/* Beam 2: Zero to Reflected Pos (Bouncing Laser) */}
                <div className="absolute top-[-6px] h-3 z-20 pointer-events-none" style={{
                    left: turretPos < 0 ? '50%' : `${getPercent(-turretPos)}%`,
                    right: turretPos > 0 ? '50%' : `${100 - getPercent(-turretPos)}%`,
                }}>
                    <motion.div 
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ 
                            scaleX: isFiring ? 1 : 0,
                            opacity: isFiring ? 1 : 0
                        }}
                        // Gecikmeli ateşleme! İlk lazer aynaya çarptıktan sonra (0.5s) ikinci lazer çıkar.
                        transition={{ duration: 0.5, delay: isFiring ? 0.5 : 0, ease: "easeOut" }}
                        // Ayna noktasından dışarıya doğru uzar
                        style={{ transformOrigin: turretPos < 0 ? 'left' : 'right' }} 
                        className="w-full h-full bg-[#FF00FF] shadow-[0_0_30px_#FF00FF] rounded-full"
                    />
                </div>

                {/* Dynamic Symmetrical Measurement Tape removed from here */}

            </div>

            {/* Fire Button Controls */}
            <div className="mt-16 z-40 bg-black/50 border border-gray-800 p-2 rounded-2xl backdrop-blur-md">
                <button 
                    onClick={handleFire}
                    disabled={isFiring || showSuccess}
                    className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Zap className="w-5 h-5 fill-current" /> ATEŞLE VE YANSIT
                </button>
            </div>

            {/* HUD: Static Symmetrical Proof Box */}
            <AnimatePresence>
                {showMeasurement && isFiring && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-6 left-6 z-50 pointer-events-none"
                    >
                        <div className="bg-[#111]/95 border border-[#00E5FF]/30 p-5 rounded-2xl backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-4 min-w-[280px]">
                            <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
                                <div className="bg-[#00E5FF]/20 p-1.5 rounded-lg flex items-center justify-center border border-[#00E5FF]/30">
                                    <Hexagon className="w-4 h-4 text-[#00E5FF]" />
                                </div>
                                <span className="text-[#00E5FF] text-xs uppercase tracking-widest font-bold">Matematİksel Kanıt</span>
                            </div>
                            
                            <div className="flex flex-col gap-3 font-mono">
                                <div className="flex items-center justify-between bg-black/50 p-2 rounded-lg border border-gray-800">
                                    <span className="text-gray-400 text-[11px] uppercase tracking-wider">Atış Uzaklığı</span>
                                    <span className="text-purple-400 text-lg font-bold">|{turretPos}| = {Math.abs(turretPos)}</span>
                                </div>
                                <div className="flex items-center justify-between bg-black/50 p-2 rounded-lg border border-gray-800">
                                    <span className="text-gray-400 text-[11px] uppercase tracking-wider">Yansıma Uzaklığı</span>
                                    <span className="text-[#00E5FF] text-lg font-bold">|{-turretPos}| = {Math.abs(-turretPos)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
              className="bg-[#111] border border-purple-900/50 p-10 rounded-3xl max-w-lg w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
              <div className="bg-purple-900/30 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border border-purple-500/50">
                <Target className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-3xl font-medium text-white mb-3 tracking-tight">İspat Tamamlandı!</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                İşte mutlak değer kuralı tam olarak budur: <br/>
                <span className="text-white font-semibold block mt-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  Lazer 0'a ne kadar mesafe geldiyse, tam zıttına da o kadar mesafe seker. Uzaklık ASLA değişmez.
                </span>
              </p>
              
              <button 
                onClick={handleNext}
                className="w-full py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-400 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              >
                {currentLevelIdx < LEVELS.length - 1 ? 'SONRAKİ HEDEFE GEÇ' : 'LABORATUVARI KAPAT'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
