import React, { useState, useEffect } from 'react';
import { motion, useAnimationFrame } from 'motion/react';
import { ArrowLeft, Settings2, Play, Square, CheckCircle2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

import AstroGuide, { AstroMood } from '../../../components/AstroGuide';

// --- GEOMETRIC SVG GEAR GENERATOR ---
// Gerçekçi dişli (involute gear profile approximation) oluşturur.
const generateGearPath = (teeth: number, pitchRadius: number, module: number = 4) => {
  const parts = [];
  // Merkezi (0,0) noktasına alıyoruz, böylece viewBox ile tam ortalayacağız.
  const cx = 0;
  const cy = 0;
  
  // modül (m) dişlinin diş boyutunu belirler. 
  // pitchRadius (r) = (teeth * module) / 2
  const addendum = module; // diş üstü
  const dedendum = module * 1.25; // diş dibi boşluğu
  
  const outerRadius = pitchRadius + addendum;
  const innerRadius = pitchRadius - dedendum;
  
  // Diş profil açıları (yaklaşık)
  const anglePerTooth = (Math.PI * 2) / teeth;
  const toothWidthAngle = anglePerTooth * 0.45; // dişin tepesinin genişliği
  const gapWidthAngle = anglePerTooth * 0.55;  // boşluğun genişliği

  for (let i = 0; i < teeth; i++) {
    const startAngle = i * anglePerTooth;
    
    // Diş dibi başlangıç
    const a1 = startAngle;
    // Diş tepesi başlangıç (hafif eğim veriyoruz involute görünümü için)
    const a2 = startAngle + (gapWidthAngle * 0.2);
    // Diş tepesi bitiş
    const a3 = startAngle + toothWidthAngle - (gapWidthAngle * 0.2);
    // Diş dibi bitiş
    const a4 = startAngle + toothWidthAngle;

    const p1x = cx + Math.cos(a1) * innerRadius;
    const p1y = cy + Math.sin(a1) * innerRadius;
    
    const p2x = cx + Math.cos(a2) * outerRadius;
    const p2y = cy + Math.sin(a2) * outerRadius;
    
    const p3x = cx + Math.cos(a3) * outerRadius;
    const p3y = cy + Math.sin(a3) * outerRadius;
    
    const p4x = cx + Math.cos(a4) * innerRadius;
    const p4y = cy + Math.sin(a4) * innerRadius;

    if (i === 0) {
      parts.push(`M ${p1x} ${p1y}`);
    } else {
      parts.push(`L ${p1x} ${p1y}`);
    }

    // Diş profili çizimi
    parts.push(`L ${p2x} ${p2y}`);
    parts.push(`L ${p3x} ${p3y}`);
    parts.push(`L ${p4x} ${p4y}`);
  }
  parts.push("Z");
  return parts.join(" ");
};

// Seviyeler
const LEVELS = [
  { id: 1, driveTeeth: 24, targetRatio: 2, desc: "Çıkış çarkının, ana çarktan 2 kat daha hızlı (2x RPM) dönmesi gerekiyor." },
  { id: 2, driveTeeth: 12, targetRatio: 0.5, desc: "Çıkış çarkının hızını yarıya (0.5x RPM) düşürmeliyiz." },
  { id: 3, driveTeeth: 30, targetRatio: 3, desc: "Aşırı hızlanma testi! Çıkış çarkı 3 kat hızlı (3x RPM) dönmeli." },
];

export default function GearRatioApp() {
  const navigate = useNavigate();
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const level = LEVELS[currentLevelIdx];

  const [drivenTeeth, setDrivenTeeth] = useState(12);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // AstroGuide State
  const [attempts, setAttempts] = useState(0);
  const [labStatus, setLabStatus] = useState<'normal' | 'error' | 'success'>('normal');
  const [guideConfig, setGuideConfig] = useState<{ visible: boolean; message: string; mood: AstroMood }>({
    visible: true,
    message: "Hadi şu makineyi çalıştıralım! Sistem konfigürasyonundan çıkış çarkının diş sayısını ayarla.",
    mood: 'idle'
  });
  
  // Rotasyon State
  const [rotA, setRotA] = useState(0);

  // Idle timer logic
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    if (!isRunning && !showSuccess && attempts === 0) {
      idleTimer = setTimeout(() => {
        setGuideConfig({
          visible: true,
          mood: 'idle',
          message: `${level.targetRatio}x hıza ulaşmak için sence çıkış çarkını (B) büyütmeli miyiz, küçültmeli miyiz? Sürgüyü oynatıp test et!`
        });
      }, 20000);
    }
    return () => clearTimeout(idleTimer);
  }, [isRunning, showSuccess, attempts, level.targetRatio]);
  
  // Oyun döngüsü / Fizik Motoru
  useAnimationFrame((t, delta) => {
    if (isRunning) {
      // rpm -> base speed. Let's say drive gear turns at generic speed
      const baseSpeed = 0.05; 
      setRotA(prev => prev + baseSpeed * delta);
    }
  });

  // Modül (Diş büyüklüğü) - her iki çark için AYNIDIR
  const GEAR_MODULE = 8;
  
  // Pitch (Bölüm Dairesi) Yarıçapları = (Diş Sayısı * Modül) / 2
  const pitchRadiusA = (level.driveTeeth * GEAR_MODULE) / 2;
  const pitchRadiusB = (drivenTeeth * GEAR_MODULE) / 2;
  
  // Eksenler arası mesafe (Pitch dairelerinin birbirine teğet olduğu nokta)
  const distance = pitchRadiusA + pitchRadiusB;
  
  // Dişlerin dış çaplarını hesaba katarak SVG kutularını boyutlandırma
  // Dış yarıçap = Pitch Radius + Modül
  const outerRadiusA = pitchRadiusA + GEAR_MODULE;
  const outerRadiusB = pitchRadiusB + GEAR_MODULE;

  // Çarkların birbiriyle diş dişe oturması için mükemmel açıyı hesaplama (Phase Offset).
  const toothAngleA = (Math.PI * 2) / level.driveTeeth;
  const toothAngleB = (Math.PI * 2) / drivenTeeth;
  
  const phaseOffsetB = 180 / drivenTeeth; 
  const rotB = -rotA * (level.driveTeeth / drivenTeeth) + phaseOffsetB + (level.driveTeeth % 2 !== 0 ? 180/drivenTeeth : 0);

  const getTargetTeeth = () => level.driveTeeth / level.targetRatio;
  const isCorrect = drivenTeeth === getTargetTeeth();

  const handleTest = () => {
    setIsRunning(true);
    setGuideConfig(prev => ({ ...prev, visible: false }));
    setLabStatus('normal');

    if (isCorrect) {
      setTimeout(() => {
        setIsRunning(false);
        setLabStatus('success');
        setGuideConfig({
          visible: true,
          mood: 'success',
          message: `Harika! ${level.driveTeeth} diş Ana Çark x 1 RPM = ${drivenTeeth} diş Çıkış Çarkı x ${level.targetRatio} RPM. Denklem sağlandı!`
        });
        setShowSuccess(true);
        unlockAtom("G6.ALG.010.1"); // Oran belirler
        unlockAtom("G6.ALG.010.2"); // Fiziksel sistemde ters orantı
        addScore(100);
      }, 3000);
    } else {
      setTimeout(() => {
        setIsRunning(false);
        setLabStatus('error');
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        let msg = "";
        let mood: AstroMood = "error";

        if (newAttempts === 1) {
          msg = `Hata! Çıkış çarkı hedeflenen ${level.targetRatio}x hıza ulaşamadı. Sence çarkı büyütmeli miyiz, küçültmeli miyiz?`;
        } else if (newAttempts === 2) {
          mood = "hint";
          const direction = drivenTeeth > getTargetTeeth() ? "küçük" : "büyük";
          msg = `Ters orantı kuralını hatırla! Çark küçüldükçe daha hızlı döner. Şu an çarkımız çok ${drivenTeeth > getTargetTeeth() ? 'büyük (yavaş)' : 'küçük (hızlı)'}. Daha ${direction} bir çark seçmelisin.`;
        } else {
          mood = "hint";
          msg = `Matematiği kullanalım: Ana Çark (${level.driveTeeth}) / Hedef Oran (${level.targetRatio}) = Çıkış Çarkı. Ayarlaman gereken diş sayısı ${getTargetTeeth()} olmalı!`;
        }

        setGuideConfig({
          visible: true,
          mood,
          message: msg
        });

      }, 3500); // Wait 3.5 seconds to explicitly "see" the failure
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRotA(0);
    setLabStatus('normal');
    setGuideConfig(prev => ({ ...prev, visible: false }));
  };

  const handleNext = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setDrivenTeeth(12);
      setAttempts(0);
      handleReset();
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

  // Lab glow colors for visual juice
  const labGlow = 
    labStatus === 'error' ? 'shadow-[inset_0_0_100px_rgba(239,68,68,0.2)] border-red-900/50' : 
    labStatus === 'success' ? 'shadow-[inset_0_0_100px_rgba(0,229,255,0.2)] border-[#00E5FF]/50' : 
    'shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border-gray-800';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col w-full h-full relative overflow-hidden">
      
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50" />
      
      {/* Header */}
      <header className="p-6 border-b border-gray-800 bg-black/50 backdrop-blur-md flex items-center gap-4 relative z-30">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Kinetik Oran Laboratuvarı</h1>
          <p className="text-xs text-gray-500 mt-1">SİSTEM: TERS_ORANTI_SIMÜLATÖRÜ // V1.0</p>
        </div>
      </header>

      <main className="flex-1 flex md:flex-row flex-col p-6 gap-6 relative z-20">
        
        {/* LEFT: Gear Simulation Canvas */}
        <div className={`flex-1 bg-[#111] rounded-2xl border relative overflow-hidden flex items-center justify-center p-12 transition-all duration-1000 ${labGlow}`}>
          <div className="absolute top-4 left-4 text-xs text-gray-600">CANVAS_RENDER: ACTIVE</div>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Merkez container'ı */}
            <div className="absolute top-1/2 left-1/2 w-0 h-0">
              
              {/* Gear A (Driving) */}
              <motion.div 
                className="absolute drop-shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center justify-center"
                style={{ 
                  left: -distance / 2, // Merkezin solunda
                  x: "-50%",
                  y: "-50%",
                  rotate: rotA 
                }}
              >
                <svg width={(outerRadiusA + 20) * 2} height={(outerRadiusA + 20) * 2} viewBox={`-${outerRadiusA + 20} -${outerRadiusA + 20} ${(outerRadiusA + 20) * 2} ${(outerRadiusA + 20) * 2}`}>
                  <path 
                    d={generateGearPath(level.driveTeeth, pitchRadiusA, GEAR_MODULE)} 
                    fill="#0B0C10" 
                    stroke={labStatus === 'error' ? '#ef4444' : '#00E5FF'} 
                    strokeWidth="2"
                    className="transition-colors duration-1000"
                  />
                  <circle cx="0" cy="0" r={pitchRadiusA * 0.4} fill="none" stroke={labStatus === 'error' ? '#ef4444' : '#00E5FF'} strokeWidth="2" strokeDasharray="4 4" className="transition-colors duration-1000" />
                  <circle cx="0" cy="0" r="8" fill={labStatus === 'error' ? '#ef4444' : '#00E5FF'} className="transition-colors duration-1000" />
                </svg>
              </motion.div>

              {/* Gear B (Driven) */}
              <motion.div 
                className="absolute drop-shadow-[0_0_15px_rgba(179,136,255,0.2)] flex items-center justify-center"
                style={{ 
                  left: distance / 2, // Merkezin sağında
                  x: "-50%",
                  y: "-50%",
                  rotate: rotB
                }}
              >
                <svg width={(outerRadiusB + 20) * 2} height={(outerRadiusB + 20) * 2} viewBox={`-${outerRadiusB + 20} -${outerRadiusB + 20} ${(outerRadiusB + 20) * 2} ${(outerRadiusB + 20) * 2}`}>
                  <path 
                    d={generateGearPath(drivenTeeth, pitchRadiusB, GEAR_MODULE)} 
                    fill="#0B0C10" 
                    stroke={labStatus === 'error' ? '#ef4444' : '#B388FF'} 
                    strokeWidth="2"
                    className="transition-colors duration-1000"
                  />
                  <circle cx="0" cy="0" r={pitchRadiusB * 0.4} fill="none" stroke={labStatus === 'error' ? '#ef4444' : '#B388FF'} strokeWidth="2" strokeDasharray="4 4" className="transition-colors duration-1000" />
                  <circle cx="0" cy="0" r="8" fill={labStatus === 'error' ? '#ef4444' : '#B388FF'} className="transition-colors duration-1000" />
                </svg>
              </motion.div>

            </div>
          </div>
          
          {/* Real-time Telemetry Overlay */}
          <div className="absolute bottom-6 left-6 text-xs text-gray-500 font-mono space-y-1">
            <div className="flex gap-4">
              <span className="text-[#00E5FF]">ANA_MOTOR: {level.driveTeeth} DİŞ</span>
              <span className="text-white">RPM: {isRunning ? '1.000' : '0.000'}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B388FF]">CIKIS_MOTORU: {drivenTeeth} DİŞ</span>
              <span className="text-white">RPM: {isRunning ? (level.driveTeeth/drivenTeeth).toFixed(3) : '0.000'}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Control Interface */}
        <div className="w-full md:w-96 flex flex-col gap-6">
          
          {/* Mission Panel */}
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Görev Parametreleri
            </h2>
            <div className="bg-black/50 p-4 rounded-xl border border-gray-800 mb-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                {level.desc}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">HEDEF ORAN</div>
                <div className="text-xl text-[#00E5FF]">x{level.targetRatio}</div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">ANA ÇARK (A)</div>
                <div className="text-xl text-white">{level.driveTeeth} Diş</div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 flex-1 flex flex-col">
            <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-6">Sistem Konfigürasyonu</h2>
            
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>ÇIKIŞ ÇARKI DİŞ SAYISI (B)</span>
                <span className="text-[#B388FF]">{drivenTeeth} DİŞ</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="60" 
                step="2"
                value={drivenTeeth}
                onChange={(e) => {
                  setDrivenTeeth(parseInt(e.target.value));
                  handleReset(); // dişli değişirse simülasyonu durdur
                }}
                disabled={isRunning}
                className="w-full h-2 bg-gray-800 rounded-lg cursor-pointer accent-[#B388FF] disabled:opacity-50"
              />
            </div>

            <div className="mt-auto space-y-3">
              <button 
                onClick={handleTest}
                disabled={isRunning}
                className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" /> SİMÜLASYONU BAŞLAT
              </button>
              
              <button 
                onClick={handleReset}
                disabled={!isRunning}
                className="w-full py-4 bg-transparent border border-gray-800 hover:border-gray-600 text-gray-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" /> SIFIRLA
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111] border border-gray-800 p-8 rounded-2xl max-w-sm w-full text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-[#00E5FF] mx-auto mb-6" />
            <h2 className="text-2xl font-medium text-white mb-2">Sistem Kalibre Edildi</h2>
            <p className="text-sm text-gray-400 mb-8">
              Ters orantı denklemi doğru çözüldü. <br/>
              A x {level.driveTeeth} = B x {getTargetTeeth()}
            </p>
            
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-[#00E5FF] text-black font-medium rounded-xl hover:bg-[#33EAFF] transition-colors"
            >
              {currentLevelIdx < LEVELS.length - 1 ? 'SONRAKİ TEST' : 'LABORATUVARDAN ÇIK'}
            </button>
          </motion.div>
        </div>
      )}

      <style>{`
        .custom-shadow {
          box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
        }
      `}</style>
      {/* Astro Guide Feedback Overlay */}
      <AstroGuide 
        visible={guideConfig.visible}
        message={guideConfig.message}
        mood={guideConfig.mood}
        onClose={() => setGuideConfig(prev => ({ ...prev, visible: false }))}
      />

    </div>
  );
}
