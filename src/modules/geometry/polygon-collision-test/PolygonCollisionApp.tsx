import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { Link } from 'react-router-dom';
import { Ruler, CheckCircle2, Zap } from 'lucide-react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { GameHeader } from '../../../components/ui/GameHeader';

const getTriangleType = (a: number, b: number, c: number) => {
    if (a + b <= c || a + c <= b || b + c <= a) return 'INVALID';
    if (a === b && b === c) return 'EQUILATERAL';
    if (a === b || a === c || b === c) return 'ISOSCELES';
    return 'SCALENE';
};

export default function PolygonCollisionApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const { showMessage } = useAstroBotStore();

  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [c, setC] = useState(8);
  
  const [phase, setPhase] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [typesFound, setTypesFound] = useState({ EQUILATERAL: false, ISOSCELES: false, SCALENE: false });

  const currentType = getTriangleType(a, b, c);
  const isValid = currentType !== 'INVALID';

  // State calculations
  useEffect(() => {
    if (phase === 0 && isValid) {
        showMessage("Harika! Çubuklar bağlandı. 3, 4, 8 iken neden bağlanmadı? İki kısa kenarın toplamı uzun kenardan BÜYÜK olmak zorunda! (Üçgen Eşitsizliği)", "success");
        setPhase(1);
        setTypesFound(prev => ({ ...prev, [currentType]: true }));
    } else if (phase === 1 && isValid) {
        setTypesFound(prev => {
            if (prev[currentType]) return prev;
            return { ...prev, [currentType]: true };
        });
    }
  }, [isValid, currentType, phase, showMessage]);

  useEffect(() => {
    if (phase === 0) {
        showMessage("Çubukları (A, B, C) kaydır! İki kısa ucu kavuşturabilirsen Üçgen Eşitsizliği portalını açarız.", "info");
    }
  }, [phase, showMessage]);

  useEffect(() => {
      if (phase === 1) {
          if (typesFound.EQUILATERAL && typesFound.ISOSCELES && typesFound.SCALENE) {
              setPhase(2);
          } else {
              const missing: string[] = [];
              if (!typesFound.EQUILATERAL) missing.push("Eşkenar");
              if (!typesFound.ISOSCELES) missing.push("İkizkenar");
              if (!typesFound.SCALENE) missing.push("Çeşitkenar");
              
              const foundCount = 3 - missing.length;
              if (foundCount === 2) {
                  showMessage(`Mükemmel gidiyorsun! Son bir tane kaldı: Kilit açmak için bir ${missing[0]} Üçgen oluştur!`, "info");
              } else if (foundCount === 1) {
                  const timer = setTimeout(() => {
                     showMessage(`Diğer varyasyonları da keşfetmeliyiz! Eksik olanlar: ${missing.join(', ')}`, "info");
                  }, 8000);
                  return () => clearTimeout(timer);
              }
          }
      }
  }, [typesFound, phase, showMessage]);

  useEffect(() => {
      if (phase === 2) {
          showMessage("SİSTEM TAMAMLANDI! Poligon Kalkanı aktif.", "success");
          const timer = setTimeout(() => {
              unlockAtom('MAT.5.3.7.1');
              unlockModule('polygon-collision-test');
              addScore(1500);
              setShowVictory(true);
          }, 4000);
          return () => clearTimeout(timer);
      }
  }, [phase, unlockAtom, unlockModule, addScore, showMessage]);

  // Geometry Calculations
  const scale = 18; // Rescaled to prevent SVG viewport overflow with max values (15)
  const cScaled = c * scale;
  const bScaled = b * scale;
  const aScaled = a * scale;

  let angleB = 0;
  let angleA = 180;

  if (isValid) {
    const cosB = (b * b + c * c - a * a) / (2 * b * c);
    const radB = Math.acos(cosB);
    angleB = -radB * (180 / Math.PI); 

    const tipX = bScaled * Math.cos(radB);
    const tipY = -bScaled * Math.sin(radB); 

    const radA = Math.atan2(tipY, tipX - cScaled);
    angleA = radA * (180 / Math.PI); 
  } else {
    // Drop them to the floor visually
    if (a + b <= c) {
      angleB = 0; 
      angleA = 180;
    } else if (b + c <= a) {
      angleB = 180; 
      angleA = 180;
    } else if (a + c <= b) {
      angleB = 0; 
      angleA = 0; 
    }
  }

  // Calculate triangle vertices for polygon fill if valid
  const p1 = { x: -cScaled/2, y: 0 };
  const p2 = { x: cScaled/2, y: 0 };
  
  // Calculate tips using exact angles
  const bTipX = p1.x + bScaled * Math.cos(angleB * Math.PI / 180);
  const bTipY = p1.y + bScaled * Math.sin(angleB * Math.PI / 180);
  const aTipX = p2.x + aScaled * Math.cos(angleA * Math.PI / 180);
  const aTipY = p2.y + aScaled * Math.sin(angleA * Math.PI / 180);

  // tip wrt origin at center of C
  const p3 = isValid ? { x: bTipX, y: bTipY } : null;

  return (
    <div className="h-full w-full bg-[#05050A] text-white overflow-y-auto overflow-x-hidden relative selection:bg-[#B388FF]/30 flex flex-col pb-16">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]"></div>
      </div>

      <GameHeader 
        title="POLİGON ÇATIŞMA TESTİ" 
        subtitle="ÜÇGEN EŞİTSİZLİĞİ" 
        rightContent={
          isValid && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-xs px-4 py-2 font-mono tracking-widest text-[#00FF88] bg-[#00FF88]/10 rounded-lg border border-[#00FF88]/30 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                  BAĞLANTI BAŞARILI
              </motion.div>
          )
        }
      />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 flex flex-col pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          
          {/* Sol Panel: Kontrol Paneli */}
          <div className="lg:col-span-1 flex flex-col gap-3 overflow-y-auto CustomScrollbar pr-2">
            
            {/* Uzunluk Kontrolleri (Kompakt) */}
            <div className="bg-[#12121A]/80 backdrop-blur-xl border border-gray-800 p-4 rounded-3xl shadow-2xl relative overflow-hidden flex-shrink-0 flex flex-col gap-4">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent"></div>
                
                {/* A */}
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Ruler className="w-3.5 h-3.5 text-[#FF3366]"/> Kırmızı (A)
                        </h3>
                        <span className="font-mono text-[#FF3366] font-bold text-sm">{a} U</span>
                    </div>
                    <input type="range" min="1" max="15" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#FF3366]" />
                </div>

                {/* B */}
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Ruler className="w-3.5 h-3.5 text-[#33CCFF]"/> Mavi (B)
                        </h3>
                        <span className="font-mono text-[#33CCFF] font-bold text-sm">{b} U</span>
                    </div>
                    <input type="range" min="1" max="15" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#33CCFF]" />
                </div>

                {/* C */}
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Ruler className="w-3.5 h-3.5 text-[#00FF88]"/> Yeşil (C)
                        </h3>
                        <span className="font-mono text-[#00FF88] font-bold text-sm">{c} U</span>
                    </div>
                    <input type="range" min="1" max="15" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00FF88]" />
                </div>
            </div>

            {/* Görev Durumu */}
            <div className="bg-black/40 border border-[#B388FF]/20 rounded-2xl p-3 flex-shrink-0">
                <h4 className="text-[10px] text-[#B388FF] uppercase tracking-widest font-bold mb-2 border-b border-[#B388FF]/20 pb-1.5">Varyasyon Keşfi</h4>
                <div className="flex flex-col gap-1.5 text-xs text-gray-400 font-mono">
                    <div className={`flex justify-between ${typesFound.EQUILATERAL ? 'text-[#00FF88]' : ''}`}>
                        <span>Eşkenar</span> <span>{typesFound.EQUILATERAL ? '✓' : '—'}</span>
                    </div>
                    <div className={`flex justify-between ${typesFound.ISOSCELES ? 'text-[#00FF88]' : ''}`}>
                        <span>İkizkenar</span> <span>{typesFound.ISOSCELES ? '✓' : '—'}</span>
                    </div>
                    <div className={`flex justify-between ${typesFound.SCALENE ? 'text-[#00FF88]' : ''}`}>
                        <span>Çeşitkenar</span> <span>{typesFound.SCALENE ? '✓' : '—'}</span>
                    </div>
                </div>
            </div>

            {/* Matematik Paneli */}
            <div className="bg-black/40 border border-[#00E5FF]/20 rounded-2xl p-3 flex-shrink-0">
                <h4 className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-bold mb-2 border-b border-[#00E5FF]/20 pb-1.5">Üçgen Eşitsizliği Şartı</h4>
                <div className="space-y-1 font-mono text-xs overflow-x-auto overflow-y-hidden KatexPanel CustomScrollbar pb-1">
                    <div className={`rounded ${a + b > c ? 'text-[#00FF88]' : 'text-[#FF3366] bg-[#FF3366]/10 border border-[#FF3366]/30 px-1'}`}>
                        <BlockMath math={`a + b > c \\Rightarrow ${a} + ${b} > ${c} \\Rightarrow ${a + b} > ${c}`} />
                    </div>
                    <div className={`rounded ${a + c > b ? 'text-[#00FF88]' : 'text-[#FF3366] bg-[#FF3366]/10 border border-[#FF3366]/30 px-1'}`}>
                        <BlockMath math={`a + c > b \\Rightarrow ${a} + ${c} > ${b} \\Rightarrow ${a + c} > ${b}`} />
                    </div>
                    <div className={`rounded ${b + c > a ? 'text-[#00FF88]' : 'text-[#FF3366] bg-[#FF3366]/10 border border-[#FF3366]/30 px-1'}`}>
                        <BlockMath math={`b + c > a \\Rightarrow ${b} + ${c} > ${a} \\Rightarrow ${b + c} > ${a}`} />
                    </div>
                </div>
            </div>
          </div>

          {/* Sağ Panel: Fizik Kanvası */}
          <div className="lg:col-span-3 bg-[#0A0A0F]/90 backdrop-blur border border-gray-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] min-h-[500px]">
             <AnimatePresence>
               {!isValid && (
                   <motion.div 
                     initial={{ opacity: 0, y: -20, scale: 0.9 }} 
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -20, scale: 0.9 }}
                     className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
                   >
                       <Zap className="w-8 h-8 text-[#FF3366] mb-2 drop-shadow-[0_0_10px_rgba(255,51,102,0.8)]" />
                       <div className="bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/30 px-5 py-2.5 rounded-xl font-mono text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(255,51,102,0.2)] backdrop-blur-md">
                           Çatışma: Uçlar Kavuşamadı
                       </div>
                   </motion.div>
               )}
             </AnimatePresence>
             
             <svg width="100%" height="100%" viewBox="-400 -300 800 600" className="overflow-visible absolute inset-0">
                {/* Dağılan Yaylar (Radii Arcs) */}
                <motion.circle 
                    cx={p1.x} cy={p1.y} 
                    r={bScaled} 
                    fill="none" 
                    stroke="#33CCFF" 
                    strokeWidth="1.5" 
                    strokeDasharray="6,8" 
                    className="opacity-20"
                    animate={{ r: bScaled, cx: p1.x }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                <motion.circle 
                    cx={p2.x} cy={p2.y} 
                    r={aScaled} 
                    fill="none" 
                    stroke="#FF3366" 
                    strokeWidth="1.5" 
                    strokeDasharray="6,8" 
                    className="opacity-20"
                    animate={{ r: aScaled, cx: p2.x }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* Geometri İç Dolgu (Sadece üçgen oluştuğunda) */}
                <AnimatePresence>
                    {isValid && p3 && (
                        <motion.path 
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: 0.15,
                                d: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z` 
                            }}
                            exit={{ opacity: 0 }}
                            fill="#00E5FF"
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    )}
                </AnimatePresence>

                {/* Baz Çizgisi (Yeşil C) */}
                <motion.line
                    x1={p1.x} y1={p1.y}
                    x2={p2.x} y2={p2.y}
                    stroke="#00FF88" strokeWidth="8" strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                    animate={{ x1: p1.x, x2: p2.x, y1: p1.y, y2: p2.y }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                
                {/* Sol Pivot */}
                <motion.circle cx={p1.x} cy={p1.y} r="6" fill="#12121A" stroke="#00FF88" strokeWidth="3" className="z-10 relative" animate={{ cx: p1.x, cy: p1.y }} transition={{ type: "spring", stiffness: 100, damping: 20 }} />
                {/* Sağ Pivot */}
                <motion.circle cx={p2.x} cy={p2.y} r="6" fill="#12121A" stroke="#00FF88" strokeWidth="3" className="z-10 relative" animate={{ cx: p2.x, cy: p2.y }} transition={{ type: "spring", stiffness: 100, damping: 20 }}/>

                {/* Mavi (B) Çizgisi - Sol uca bağlı */}
                <motion.line 
                    x1={p1.x} y1={p1.y} x2={bTipX} y2={bTipY} 
                    stroke="#33CCFF" strokeWidth="8" strokeLinecap="round" 
                    className="drop-shadow-[0_0_10px_rgba(51,204,255,0.8)]"
                    animate={{ x1: p1.x, y1: p1.y, x2: bTipX, y2: bTipY }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                <motion.circle 
                    cx={bTipX} cy={bTipY} r="6" fill="#12121A" stroke="#33CCFF" strokeWidth="3" 
                    className="z-10 relative"
                    animate={{ cx: bTipX, cy: bTipY }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* Kırmızı (A) Çizgisi - Sağ uca bağlı */}
                <motion.line 
                    x1={p2.x} y1={p2.y} x2={aTipX} y2={aTipY} 
                    stroke="#FF3366" strokeWidth="8" strokeLinecap="round" 
                    className="drop-shadow-[0_0_10px_rgba(255,51,102,0.8)]"
                    animate={{ x1: p2.x, y1: p2.y, x2: aTipX, y2: aTipY }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                <motion.circle 
                    cx={aTipX} cy={aTipY} r="6" fill="#12121A" stroke="#FF3366" strokeWidth="3" 
                    className="z-10 relative"
                    animate={{ cx: aTipX, cy: aTipY }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* Çatışma Yoksa Açıklık Mesafesini Göster (Kırmızı Kesik Çizgi) */}
                <AnimatePresence>
                    {!isValid && (
                        <motion.g 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Mühendislik tarzı ölçüm çizgileri */}
                            <motion.line 
                                x1={bTipX} y1={bTipY + 40} 
                                x2={aTipX} y2={aTipY + 40}
                                stroke="#FF3366" strokeWidth="2" strokeDasharray="6,6"
                                animate={{ x1: bTipX, y1: bTipY + 40, x2: aTipX, y2: aTipY + 40 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                            <motion.line 
                                x1={bTipX} y1={bTipY} x2={bTipX} y2={bTipY + 40} 
                                stroke="#FF3366" strokeWidth="1" strokeDasharray="2,4" opacity="0.6"
                                animate={{ x1: bTipX, y1: bTipY, x2: bTipX, y2: bTipY + 40 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                            <motion.line 
                                x1={aTipX} y1={aTipY} x2={aTipX} y2={aTipY + 40} 
                                stroke="#FF3366" strokeWidth="1" strokeDasharray="2,4" opacity="0.6"
                                animate={{ x1: aTipX, y1: aTipY, x2: aTipX, y2: aTipY + 40 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                            
                            {/* Mesafeyi Metin Olarak Ekle */}
                            <motion.text 
                                x={(bTipX + aTipX) / 2} 
                                y={(bTipY + aTipY) / 2 + 60}
                                fill="#FF3366" 
                                textAnchor="middle" 
                                className="font-mono text-sm tracking-widest fill-[#FF3366] drop-shadow-[0_0_10px_rgba(255,51,102,0.8)]"
                                animate={{ x: (bTipX + aTipX) / 2, y: (bTipY + aTipY) / 2 + 60 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            >
                                {(Math.hypot(bTipX - aTipX, bTipY - aTipY) / scale).toFixed(1)} U AÇIKLIK
                            </motion.text>
                        </motion.g>
                    )}
                </AnimatePresence>
             </svg>

             {/* Alt Bilgi Paneli */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-8 py-3 rounded-full border border-gray-800 flex gap-8 text-lg font-mono tracking-widest font-bold shadow-lg pointer-events-none">
                 <span className="text-[#FF3366] drop-shadow-[0_0_5px_rgba(255,51,102,0.5)]">A={a}</span>
                 <span className="text-[#33CCFF] drop-shadow-[0_0_5px_rgba(51,204,255,0.5)]">B={b}</span>
                 <span className="text-[#00FF88] drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]">C={c}</span>
             </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showVictory && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#12121A] border border-[#00FF88]/30 p-8 md:p-12 rounded-3xl max-w-2xl w-full relative overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.15)] flex flex-col items-center text-center">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"></div>
                 <div className="w-24 h-24 bg-[#00FF88]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
                     <CheckCircle2 className="w-12 h-12 text-[#00FF88]" />
                 </div>
                 <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Kalkan Aktif</h2>
                 <p className="text-gray-400 mb-8 max-w-lg text-lg leading-relaxed">
                   Tebrikler! Üçgen eşitsizliğini kırarak her kenarın fiziksel olarak nasıl sınırlandığını çözdünüz.
                 </p>
                 <div className="flex gap-4">
                     <Link to="/" className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-all hover:scale-105 uppercase tracking-widest text-sm">
                         Ana Merkeze Dön
                     </Link>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

