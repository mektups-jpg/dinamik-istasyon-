import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { AstroBot, BotMessage } from '../../../components/ui/AstroBot';
import { PieChart, ArrowLeft, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FractionReactorApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();

  const MIN_DENOM = 1;
  const MAX_DENOM = 12;

  const [numerator, setNumerator] = useState<number>(0);
  const [denominator, setDenominator] = useState<number>(1);
  const [targetNum, setTargetNum] = useState<number>(1);
  const [targetDenom, setTargetDenom] = useState<number>(2);
  
  const [gameState, setGameState] = useState<'PLAYING' | 'VICTORY'>('PLAYING');
  const [showVictory, setShowVictory] = useState(false);

  useEffect(() => {
    generateLevel();
  }, []);

  // When denominator changes, ensure numerator is capped
  useEffect(() => {
    if (numerator > denominator) {
      setNumerator(denominator);
    }
    checkVictory();
  }, [denominator, numerator]);

  const generateLevel = () => {
    // Generate random fraction target
    // Denominator between 2 and 8 for visibility
    const newDenom = Math.floor(Math.random() * 7) + 2;
    // Numerator between 1 and newDenom
    const newNum = Math.floor(Math.random() * newDenom) + 1;
    
    setTargetDenom(newDenom);
    setTargetNum(newNum);
    setNumerator(0);
    setDenominator(1);
    setGameState('PLAYING');
    setShowVictory(false);
  };

  const checkVictory = () => {
    if (gameState === 'VICTORY') return;
    if (numerator === targetNum && denominator === targetDenom) {
      setGameState('VICTORY');
      setTimeout(() => {
        unlockAtom('MAT.3.1.9.1');
        unlockAtom('MAT.3.1.10.2');
        unlockAtom('MAT.3.1.11.1');
        unlockAtom('MAT.3.1.11.2');
        unlockModule('fraction-reactor-3');
        addScore(500);
        setShowVictory(true);
      }, 1000);
    }
  };

  const handleDenomChange = (val: number) => {
    if (gameState === 'VICTORY') return;
    setDenominator(val);
  };

  const handleSliceClick = () => {
    if (gameState === 'VICTORY') return;
    setNumerator((prev) => (prev < denominator ? prev + 1 : 0));
  };

  const getBotMessage = (): BotMessage => {
    if (gameState === 'VICTORY') {
      return { id: 1, text: 'Harika! Enerji çekirdeği tam istenen kapasitede senkronize edildi!', type: 'success' };
    }
    if (numerator === 0 && denominator === 1) {
      return { id: 2, text: `Komutanım, kalkanları açmak için ${targetNum}/${targetDenom} oranında enerji yüklemen gerekiyor! Önce alttaki PAYDA sürgüsünü ${targetDenom}'a/e çek, sonra dilimlere tıkla.`, type: 'error' };
    }
    if (denominator === targetDenom && numerator !== targetNum) {
      return { id: 3, text: `Payda (${denominator}) doğru! Şimdi ortadaki Reaktöre tıklayarak PAY (${targetNum}) miktarını doldur.`, type: 'info' };
    }
    return { id: 4, text: `Hedefimiz: ${targetNum}/${targetDenom}`, type: 'info' };
  };

  // SVG parameters
  const size = 300;
  const radius = 140;
  const cx = size / 2;
  const cy = size / 2;

  const renderSlices = () => {
    if (denominator === 1) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={radius} 
          fill={numerator === 1 ? '#00E5FF' : '#12121A'} 
          stroke={numerator === 1 ? '#B388FF' : '#333'} 
          strokeWidth="4"
          className="cursor-pointer transition-colors duration-300"
          onClick={handleSliceClick}
          style={{ filter: numerator === 1 ? 'drop-shadow(0 0 20px rgba(0,229,255,0.5))' : 'none' }}
        />
      );
    }

    const slices = [];
    const angleStep = (2 * Math.PI) / denominator;

    for (let i = 0; i < denominator; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;

      // Avoid floating point gaps by slightly extending the end angle if it is the last slice
      const adjustedEndAngle = i === denominator - 1 ? endAngle + 0.01 : endAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(adjustedEndAngle);
      const y2 = cy + radius * Math.sin(adjustedEndAngle);

      const largeArc = angleStep > Math.PI ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const isFilled = i < numerator;

      slices.push(
        <motion.path
          key={i}
          d={d}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: i * 0.02 }}
          fill={isFilled ? '#00E5FF' : '#12121A'}
          stroke="#0B0C10"
          strokeWidth="4"
          className="cursor-pointer origin-center transition-colors duration-300 hover:brightness-125"
          onClick={handleSliceClick}
          style={{ filter: isFilled ? 'drop-shadow(0 0 10px rgba(0,229,255,0.8))' : 'none' }}
        />
      );
    }

    return slices;
  };

  return (
    <div className="h-full w-full bg-[#0B0C10] text-white flex flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 relative font-sans selection:bg-[#00E5FF] selection:text-black custom-scrollbar pb-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] rounded-full bg-[#00E5FF]/5 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#B388FF]/5 blur-[120px]"></div>
      </div>

      <header className="max-w-7xl w-full mx-auto flex items-center justify-between relative z-20 mb-8 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-12 h-12 bg-[#12121A] rounded-2xl flex items-center justify-center border border-gray-800 hover:border-[#00E5FF] transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <PieChart className="w-6 h-6 text-[#00E5FF]" /> KESİR <span className="text-[#00E5FF]">SENKRONİZATÖRÜ</span>
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Pay & Payda Bütünlüğü</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-20 flex-1">
        
        {/* Core Reactor View */}
        <div className="lg:col-span-7 bg-[#12121A] border border-gray-800 rounded-3xl p-8 shadow-2xl relative flex flex-col items-center justify-center min-h-[500px]">
           <div className="absolute top-4 left-4 flex gap-2">
              <div className="px-3 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold border border-[#00E5FF]/20 uppercase tracking-widest">
                  Hedef: {targetNum} / {targetDenom}
              </div>
           </div>

           <div className="relative w-[300px] h-[300px] mb-8">
               <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible filter drop-shadow-2xl">
                 {/* Outer Ring */}
                 <circle cx={cx} cy={cy} r={radius + 10} fill="none" stroke="#1F2833" strokeWidth="2" strokeDasharray="4 4" />
                 <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.3" />
                 {renderSlices()}
               </svg>
               
               {/* Center Indicator */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-full border-4 border-[#0B0C10] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] z-10 pointer-events-none">
                  <PieChart className="w-6 h-6 text-gray-500 opacity-50" />
               </div>
           </div>

           <div className="text-center font-mono opacity-50 text-xs tracking-widest uppercase">
              Birim Kesir Hacmi: {denominator > 1 ? `1/${denominator}` : '1 Tam'}
           </div>
        </div>

        {/* Console / Controls */}
        <div className="lg:col-span-5 bg-[#12121A] border border-gray-800 rounded-3xl p-8 flex flex-col justify-center">
            
            <div className="flex flex-col items-center mb-12">
               <div className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Mevcut Durum</div>
               <div className="text-8xl font-black font-mono text-white tracking-tighter relative flex flex-col items-center">
                   <motion.span 
                      key={`num-${numerator}`} 
                      initial={{ y: -20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      className={numerator === targetNum ? 'text-[#00FF88] text-shadow-glow' : 'text-[#00E5FF]'}
                   >
                     {numerator}
                   </motion.span>
                   <div className="w-24 h-2 bg-gray-700 my-2 rounded-full"></div>
                   <motion.span 
                      key={`den-${denominator}`} 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }}
                      className={denominator === targetDenom ? 'text-[#00FF88] text-shadow-glow' : 'text-[#B388FF]'}
                   >
                     {denominator}
                   </motion.span>
               </div>
            </div>

            <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-xs font-bold text-[#B388FF] tracking-widest uppercase flex items-center gap-2">
                        <Zap className="w-4 h-4" /> PAYDA (Bölücü)
                     </span>
                     <span className="text-xs font-mono text-gray-500">{denominator} / {MAX_DENOM}</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min={MIN_DENOM} 
                    max={MAX_DENOM} 
                    value={denominator}
                    onChange={(e) => handleDenomChange(Number(e.target.value))}
                    disabled={gameState === 'VICTORY'}
                    className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#B388FF] disabled:opacity-50 hover:bg-gray-700 transition-colors"
                  />
                  <div className="mt-3 flex justify-between text-[10px] text-gray-600 font-mono">
                     <span>Bütün (1)</span>
                     <span>Çeyrek (1/4)</span>
                     <span>1/12</span>
                  </div>
                </div>

                <div className="p-4 bg-[#B388FF]/5 border border-[#B388FF]/20 rounded-xl mt-6">
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      <strong className="text-[#00E5FF]">Bilgi:</strong> Paydayı sürükleyerek çekirdeği kaç parçaya ayıracağını seç. Ardından parçalara tıklayarak <strong>PAY</strong> (istenen enerji) miktarını doldur.
                   </p>
                </div>
            </div>
            
        </div>
      </main>

      <AstroBot message={getBotMessage()} />

      <AnimatePresence>
        {showVictory && (
           <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
         >
           <motion.div 
             initial={{ scale: 0.9, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             className="bg-[#12121A] border border-[#00E5FF]/30 p-10 rounded-[3rem] max-w-2xl w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,229,255,0.2)]"
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00E5FF]/20 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="w-24 h-24 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00E5FF]/20">
               <PieChart className="w-12 h-12 text-[#00E5FF]" />
             </div>
             
             <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter">
               SENKRONİZASYON <span className="text-[#00E5FF]">BAŞARILI!</span>
             </h2>
             <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                Bütünü eş parçalara ayırdın ve doğru miktarda pay yüklemesi yaparak kalkanları aktif hale getirdin! 
             </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#1F2833] border border-[#00FF88]/30 p-6 rounded-3xl relative overflow-hidden group">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-[#00FF88]" />
                      <span className="font-mono text-[#00FF88] font-bold text-xs">MAT.3.1.11.1</span>
                   </div>
                   <p className="text-white text-sm leading-relaxed">Paydanın bütünü kaça böldüğü kavrandı.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#1F2833] border border-[#00E5FF]/30 p-6 rounded-3xl relative overflow-hidden group">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
                      <span className="font-mono text-[#00E5FF] font-bold text-xs">MAT.3.1.11.2</span>
                   </div>
                   <p className="text-white text-sm leading-relaxed">Payın alınan dilim olduğu kavrandı.</p>
                </motion.div>
             </div>

             <div className="flex gap-4 max-w-sm mx-auto">
               <button 
                 onClick={generateLevel}
                 className="flex-1 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl border border-gray-700 transition-colors"
               >
                 YENİ GÖREV
               </button>
               <Link 
                 to="/"
                 className="flex-[2] px-6 py-4 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors"
               >
                 KÖPRÜYE DÖN <ArrowRight className="w-5 h-5" />
               </Link>
             </div>

           </motion.div>
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
