import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Target, CheckCircle2, RotateCw, Sparkles, ChevronRight } from 'lucide-react';
import { GameHeader } from '../../../components/ui/GameHeader';
import { cn } from '../../../lib/utils';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

// === GEOMETRY HELPERS ===

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeSector(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  // The path starts from center (M), draws a line to the start of arc (L), 
  // draws the arc (A), and closes back to center (Z).
  return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

// Get the 8 angles created by a transversal cutting 2 horizontal parallel lines
// t is the angle of the transversal line from the horizontal 0-degree right axis (increasing clockwise downwards)
const getAngles = (cx1: number, cx2: number, y1: number, y2: number, t: number) => {
    return [
      // Top intersection (I1)
      { id: 1, cx: cx1, cy: y1, start: 180, end: 180 + t, name: 'Sol Üst', location: 'dış' },
      { id: 2, cx: cx1, cy: y1, start: 180 + t, end: 360, name: 'Sağ Üst', location: 'dış' },
      { id: 3, cx: cx1, cy: y1, start: t, end: 180, name: 'Sol Alt', location: 'iç' },
      { id: 4, cx: cx1, cy: y1, start: 0, end: t, name: 'Sağ Alt', location: 'iç' },
      
      // Bottom intersection (I2)
      { id: 5, cx: cx2, cy: y2, start: 180, end: 180 + t, name: 'Sol Üst', location: 'iç' },
      { id: 6, cx: cx2, cy: y2, start: 180 + t, end: 360, name: 'Sağ Üst', location: 'iç' },
      { id: 7, cx: cx2, cy: y2, start: t, end: 180, name: 'Sol Alt', location: 'dış' },
      { id: 8, cx: cx2, cy: y2, start: 0, end: t, name: 'Sağ Alt', location: 'dış' },
    ];
};

const MISSIONS = [
  {
    title: 'Z Kuralı (İç Ters Açılar)',
    description: 'Uzay üssünün fiber hattı koptu! Lazerimiz paralel iki doğruyu kestiğinde "İÇ TERS" (Z kuralı) açılar oluşur. Lütfen birbirine Yalnız İÇ TERS olan iki açıyı seç onar!',
    validate: (selected: number[]) => {
      const [s1, s2] = [...selected].sort();
      return (s1 === 3 && s2 === 6) || (s1 === 4 && s2 === 5);
    }
  },
  {
    title: 'Yöndeş Açılar',
    description: 'Harikasın! Şimdi "YÖNDEŞ" açıları bulmalıyız. Kesici doğrunun sağladığı ve tamamen AYNI YÖNE bakan iki açıyı seç!',
    validate: (selected: number[]) => {
      const [s1, s2] = [...selected].sort();
      return (s1 === 1 && s2 === 5) || (s1 === 2 && s2 === 6) || (s1 === 3 && s2 === 7) || (s1 === 4 && s2 === 8);
    }
  },
  {
    title: 'U Kuralı (Karşı Durumlu)',
    description: 'Sistem ısınıyor. Karşılıklı bakan İÇ açılar 180 derecelik bir U köşesi yapar. Birbirini 180\'e tamamlayan U kuralı açı çiftini eşleştir.',
    validate: (selected: number[]) => {
      const [s1, s2] = [...selected].sort();
      return (s1 === 3 && s2 === 5) || (s1 === 4 && s2 === 6);
    }
  },
  {
    title: 'Dış Ters Açılar',
    description: 'Son stabilizasyon! Paralel doğrunun dışında kalan ve ters yönlü (DIŞ TERS) açı çiftini bul ve ateşle!',
    validate: (selected: number[]) => {
      const [s1, s2] = [...selected].sort();
      return (s1 === 1 && s2 === 8) || (s1 === 2 && s2 === 7);
    }
  }
];

export default function OpticLaserApp() {
    const [laserAngle, setLaserAngle] = useState(60);
    const [selectedAngles, setSelectedAngles] = useState<number[]>([]);
    const [missionIndex, setMissionIndex] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // SVG and Coordinates configuration
    const width = 800;
    const height = 600;
    const y1 = 200; // Top fiber optic
    const y2 = 400; // Bottom fiber optic
    const pivotX = 400; // Laser pivot center
    const pivotY = 300; // Laser pivot center

    // Calculate math for intersections
    const tRad = (laserAngle * Math.PI) / 180;
    const m = Math.tan(tRad);
    
    // cx = pivotX + (y - pivotY) / m
    const cx1 = pivotX + (y1 - pivotY) / m;
    const cx2 = pivotX + (y2 - pivotY) / m;
    
    const angles = useMemo(() => getAngles(cx1, cx2, y1, y2, laserAngle), [cx1, cx2, y1, y2, laserAngle]);

    const handleAngleClick = (id: number) => {
        if (showSuccess) return; // Block input during success animation
        
        if (selectedAngles.includes(id)) {
            setSelectedAngles(prev => prev.filter(aid => aid !== id));
        } else {
            setSelectedAngles(prev => {
                const next = [...prev, id];
                if (next.length > 2) return [next[1], next[2]];
                return next;
            });
        }
    };

    const { showMessage } = useAstroBotStore();
    const { unlockModule, unlockAtom } = useAtomStore();
    const { addScore } = useGameStore();

    // Auto validate when 2 selected
    useEffect(() => {
        if (selectedAngles.length === 2 && !showSuccess) {
           const currentMission = MISSIONS[missionIndex];
           if (currentMission.validate(selectedAngles)) {
               // Success
               setShowSuccess(true);
               showMessage("Güç akışı dengelendi! Mükemmel eşleşme.", 'success');
               
               if (missionIndex === MISSIONS.length - 1) {
                   unlockModule('optic-laser-lab');
                   unlockAtom('MAT.6.3.1.1');
                   addScore(1500);
               } else {
                   addScore(250);
               }

               setTimeout(() => {
                   if (missionIndex < MISSIONS.length - 1) {
                      setMissionIndex(m => m + 1);
                      setSelectedAngles([]);
                      setShowSuccess(false);
                      showMessage(MISSIONS[missionIndex + 1].description, 'info');
                   } else {
                      showMessage("Tüm paneller devrede! Optik Lazer Labirenti ana merkeze bağlandı. Başardın Kaptan!", 'success');
                   }
               }, 2500);
           } else {
               // Failed validation
               showMessage("Uyumsuz frekans! Açılar istenen kuralla eşleşmiyor. Lütfen tekrar dene.", 'error');
               setTimeout(() => {
                   setSelectedAngles([]);
                   if (missionIndex < MISSIONS.length) {    
                       showMessage(MISSIONS[missionIndex].description, 'info');
                   }
               }, 2000);
           }
        }
    }, [selectedAngles, missionIndex, showSuccess, showMessage, unlockModule]);

    useEffect(() => {
        showMessage(MISSIONS[0].description, 'info');
    }, [showMessage]);

    // Laser Line endpoints off screen
    // y = 0 -> x = pivotX + (0 - 300)/m
    const topLaserPoint = { x: pivotX + (-150 - pivotY) / m, y: -150 };
    // y = 750 -> x = pivotX + (750 - 300)/m
    const bottomLaserPoint = { x: pivotX + (750 - pivotY) / m, y: 750 };

    return (
        <div className="min-h-screen bg-[#05050A] text-white relative selection:bg-[#B388FF]/30 flex flex-col font-sans overflow-hidden">
            <GameHeader 
                title="Optik Lazer Labirenti" 
                subtitle="FİBER ONARIM GEOMETRİSİ" 
            />

            <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 min-h-0 container mx-auto max-w-7xl">
                
                {/* Sol Panel: Labirent (SVG Canvas) */}
                <div className="flex-1 bg-black/60 backdrop-blur-md rounded-3xl border border-[#00E5FF]/20 relative overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.05)] flex items-center justify-center">
                    
                    {/* SVG Filters */}
                    <svg className="absolute w-0 h-0">
                        <defs>
                            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                            <filter id="glow-pink" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                    </svg>

                    {/* Background Grid Elements */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDIyOSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-30"></div>

                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[70vh] relative z-10" preserveAspectRatio="xMidYMid meet">
                        {/* Paralel Doğrular (Fiber Optic Cables) */}
                        <motion.line 
                            x1="0" y1={y1} x2={width} y2={y1} 
                            stroke="#00E5FF" strokeWidth="6" 
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                        />
                        <motion.line 
                            x1="0" y1={y2} x2={width} y2={y2} 
                            stroke="#00E5FF" strokeWidth="6" 
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                        />
                        
                        {/* Kesen Lazer */}
                        <motion.line 
                            x1={topLaserPoint.x} y1={topLaserPoint.y} 
                            x2={bottomLaserPoint.x} y2={bottomLaserPoint.y}
                            stroke="#FF3366" strokeWidth="8"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_15px_rgba(255,51,102,0.9)]"
                            animate={{ x1: topLaserPoint.x, x2: bottomLaserPoint.x }}
                            transition={{ type: "spring", stiffness: 40, damping: 15 }}
                        />

                        {/* Açılar (Açı Bölgeleri) */}
                        <AnimatePresence>
                            {angles.map((a) => {
                                const isSelected = selectedAngles.includes(a.id);
                                // Normal radius 45, hover/selected larger
                                const baseR = 50;
                                const rad = isSelected ? 65 : baseR;
                                
                                const d = describeSector(a.cx, a.cy, rad, a.start, a.end);
                                
                                // Text placement
                                const midAngle = (a.start + a.end) / 2;
                                const textPos = polarToCartesian(a.cx, a.cy, rad + 20, midAngle);
                                const degreeValue = Math.abs(a.end - a.start).toFixed(0);

                                return (
                                    <motion.g key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {/* Tıklanabilir Açı Dilimi */}
                                        <motion.path
                                            d={d}
                                            className="cursor-pointer transition-colors duration-200"
                                            fill={isSelected ? '#00FF88' : 'rgba(0, 229, 255, 0.1)'}
                                            stroke={isSelected ? '#00FF88' : '#33CCFF'}
                                            strokeWidth="3"
                                            onClick={() => handleAngleClick(a.id)}
                                            whileHover={{ fill: isSelected ? '#00FF88' : 'rgba(0, 229, 255, 0.3)' }}
                                            animate={{ 
                                                d, // Re-animate paths dynamically
                                                fill: isSelected ? 'rgba(0, 255, 136, 0.7)' : 'rgba(0, 229, 255, 0.1)',
                                                stroke: isSelected ? '#00FF88' : '#33CCFF'
                                            }}
                                            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                                            style={isSelected ? { filter: 'url(#glow-cyan)' } : {}}
                                        />
                                        
                                        {/* Derece Etiketi */}
                                        <motion.text
                                            x={textPos.x}
                                            y={textPos.y}
                                            fill={isSelected ? '#00FF88' : '#FFFFFF'}
                                            className="font-mono text-xs font-bold pointer-events-none select-none drop-shadow-md"
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                            animate={{ scale: isSelected ? 1.2 : 1 }}
                                        >
                                            {degreeValue}°
                                        </motion.text>
                                    </motion.g>
                                );
                            })}
                        </AnimatePresence>

                        {/* Pivot Noktaları */}
                        <motion.circle cx={cx1} cy={y1} r="5" fill="#FFF" animate={{ cx: cx1 }} transition={{ type: "spring", stiffness: 40 }} />
                        <motion.circle cx={cx2} cy={y2} r="5" fill="#FFF" animate={{ cx: cx2 }} transition={{ type: "spring", stiffness: 40 }} />

                    </svg>
                </div>

                {/* Sağ Panel: Kontroller ve Görevler */}
                <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto CustomScrollbar pr-2">
                    
                    {/* Lazer Modülatörü */}
                    <div className="bg-[#12121A]/80 backdrop-blur-xl border border-[#FF3366]/30 p-5 rounded-3xl shadow-2xl relative flex-shrink-0">
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#FF3366]/5 to-transparent"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                <Crosshair className="w-4 h-4 text-[#FF3366]"/> Lazer Açısı
                            </h3>
                            <span className="font-mono text-[#FF3366] font-bold text-lg">{laserAngle}°</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="range" 
                                min="30" max="150" step="5"
                                value={laserAngle} 
                                onChange={(e) => setLaserAngle(Number(e.target.value))} 
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#FF3366]" 
                            />
                        </div>
                    </div>

                    {/* Görev Akışı */}
                    <div className="bg-black/40 border border-[#B388FF]/20 rounded-3xl p-5 flex-1 flex flex-col">
                        <h4 className="text-xs text-[#B388FF] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4"/> Aktif Güvenlik Şifresi
                        </h4>

                        <div className="flex flex-col gap-3">
                            {MISSIONS.map((mission, index) => {
                                const isPast = index < missionIndex;
                                const isCurrent = index === missionIndex;
                                
                                return (
                                    <div 
                                        key={index} 
                                        className={cn(
                                            "p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                                            isCurrent ? "bg-[#B388FF]/10 border-[#B388FF]/50 scale-[1.02]" : 
                                            isPast ? "bg-[#00FF88]/5 border-[#00FF88]/20 opacity-60" : 
                                            "bg-white/5 border-white/10 opacity-40 grayscale"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5">
                                                {isPast ? <CheckCircle2 className="w-5 h-5 text-[#00FF88]" /> : 
                                                 isCurrent ? <RotateCw className="w-5 h-5 text-[#B388FF] animate-spin" /> :
                                                 <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center text-[10px] text-gray-500">{index + 1}</div>}
                                            </div>
                                            <div>
                                                <h5 className={cn("font-bold text-sm", isCurrent ? "text-white" : isPast ? "text-gray-300" : "text-gray-500")}>
                                                    {mission.title}
                                                </h5>
                                                {isCurrent && (
                                                     <motion.p 
                                                         initial={{ opacity: 0, height: 0 }}
                                                         animate={{ opacity: 1, height: 'auto' }}
                                                         className="text-xs text-[#8A8A93] leading-relaxed mt-2"
                                                     >
                                                         {mission.description}
                                                     </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Success Flash Effect Overlay */}
                                        <AnimatePresence>
                                            {isCurrent && showSuccess && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-[#00E5FF] flex items-center justify-center z-10 rounded-2xl"
                                                >
                                                    <span className="font-bold text-[#05050A] tracking-widest flex items-center gap-2">
                                                        <Sparkles className="w-5 h-5" /> ŞİFRE KABUL EDİLDİ
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
