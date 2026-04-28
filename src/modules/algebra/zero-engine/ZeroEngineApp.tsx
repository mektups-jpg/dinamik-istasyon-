import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { AstroBot, BotMessage } from '../../../components/ui/AstroBot';
import { Bug, Crosshair, ArrowLeft, ArrowRight, ArrowDownToLine, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Phase = 'PHASE1_ZERO_FACTORY' | 'PHASE2_COLUMN_WEDGE' | 'VICTORY';
type BugState = 'WRONG' | 'INSPECTING' | 'FIXED';

export default function ZeroEngineApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();

  const [phase, setPhase] = useState<Phase>('PHASE1_ZERO_FACTORY');
  const [showVictory, setShowVictory] = useState(false);
  const [botFeedback, setBotFeedback] = useState<string | null>(null);

  // --- Phase 1: Zero Factory State ---
  const [baseNumber, setBaseNumber] = useState<number>(0);
  const [currentZeros, setCurrentZeros] = useState<number>(0);
  const [targetZeros, setTargetZeros] = useState<number>(0);
  
  // --- Phase 2: Column Wedge (Bug Hunt) State ---
  const [factor1, setFactor1] = useState<number>(0);
  const [factor2, setFactor2] = useState<number>(0);
  const [row2Base, setRow2Base] = useState<number>(0);
  const [bugState, setBugState] = useState<BugState>('WRONG');
  const [isDragging, setIsDragging] = useState(false);
  const [addedZeros, setAddedZeros] = useState(0);
  const [targetZerosPhase2, setTargetZerosPhase2] = useState(0);

  useEffect(() => {
    generateLevel();
  }, []);

  const generateLevel = () => {
    // Generate Phase 1 (Target: 10, 100, 1000 multiplier simulation)
    const baseNum = Math.floor(Math.random() * 90) + 10; // 10 to 99
    
    setBaseNumber(baseNum);
    const isAdding = Math.random() > 0.5;
    
    if (isAdding) {
       setCurrentZeros(0);
       setTargetZeros(Math.floor(Math.random() * 3) + 1); // 1, 2, or 3
    } else {
       setCurrentZeros(Math.floor(Math.random() * 2) + 2); // 2 or 3
       setTargetZeros(Math.floor(Math.random() * 2)); // 0 or 1
    }

    // Generate Phase 2 (Column Shift Wedge Mechanism via BUG HUNT)
    const f1Phase2 = Math.floor(Math.random() * 40) + 12; // 12-51
    const missingZ = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const f2BaseVal = Math.floor(Math.random() * 8) + 2; // 2-9
    const f2Phase2 = f2BaseVal * Math.pow(10, missingZ);
    
    setFactor1(f1Phase2);
    setFactor2(f2Phase2);
    setRow2Base(f1Phase2 * f2BaseVal);
    setTargetZerosPhase2(missingZ);
    setAddedZeros(0);

    setPhase('PHASE1_ZERO_FACTORY');
    setBugState('WRONG');
    setShowVictory(false);
    setBotFeedback(null);
  };

  // -- Zero Factory Logic --
  const modifyZeros = (amount: number) => {
    if (phase !== 'PHASE1_ZERO_FACTORY') return;
    setBotFeedback(null);
    
    const newZeros = currentZeros + amount;
    
    if (newZeros < 0) {
      setBotFeedback("Dikkat: Silebileceğin başka SIFIR kapsülü kalmadı!");
      return;
    }
    if (newZeros > 5) {
      setBotFeedback("Kapasite aşıldı! Çok fazla sıfır eklersen motor havaya uçar.");
      return;
    }
    
    setCurrentZeros(newZeros);
  };

  const confirmPhase1 = () => {
    if (currentZeros === targetZeros) {
      setBotFeedback(null);
      setPhase('PHASE2_COLUMN_WEDGE');
      unlockAtom('MAT.4.2.4.1');
    } else {
      setBotFeedback(`Hata! Üretim bandındaki veri (${formatNumber(baseNumber, currentZeros)}) hedef veriye (${formatNumber(baseNumber, targetZeros)}) uymuyor.`);
    }
  };

  // -- Column Wedge (Bug Hunt) Logic --
  const inspectBug = () => {
    if (phase !== 'PHASE2_COLUMN_WEDGE') return;
    setBugState('INSPECTING');
    setBotFeedback(null);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const dropZone = document.getElementById('zero-drop-zone');
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      const padding = 50; // forgiving drop area
      if (
        info.point.x >= rect.left - padding &&
        info.point.x <= rect.right + padding &&
        info.point.y >= rect.top - padding &&
        info.point.y <= rect.bottom + padding
      ) {
        if (addedZeros < 4) {
           setAddedZeros(prev => prev + 1);
           setBotFeedback(null);
        }
      }
    }
  };

  const verifyFix = () => {
    if (addedZeros === targetZerosPhase2) {
      injectZeroToFix();
    } else {
      setBotFeedback(`Hata! ${factor2} sayısına dikkat et. Kaç tane sıfır eklemen gerektiğini bulmalısın!`);
      setAddedZeros(0);
    }
  };

  const clearZeros = () => {
    setAddedZeros(0);
  };

  const injectZeroToFix = () => {
    if (phase !== 'PHASE2_COLUMN_WEDGE') return;
    setBugState('FIXED');
    setBotFeedback(null);
    
    setTimeout(() => {
      setPhase('VICTORY');
      unlockAtom('MAT.4.2.5.1');
      unlockModule('zero-engine-4');
      addScore(600);
      setShowVictory(true);
    }, 2500);
  };

  const formatNumber = (num: number, zCount: number) => {
    const s = num.toString() + '0'.repeat(zCount);
    return Number(s).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getBotMessage = (): BotMessage => {
    if (botFeedback) {
       return { id: 99, text: botFeedback, type: 'error' };
    }
    if (phase === 'PHASE1_ZERO_FACTORY') {
      return { id: 1, text: `Sıfır Laboratuvarına hoş geldin. Yandaki hedef değere ulaşmak için lazerlerle '0' Kapsülü fırlat (Ekle) ya da geri emerek (Sil) eşleşmeyi yakala, sonra ONAYLA!`, type: 'info' };
    }
    if (phase === 'PHASE2_COLUMN_WEDGE') {
      if (bugState === 'WRONG') {
         return { id: 2, text: `ALARM! Asistan robot bir çarpma işlemi yaptı ama sonuç fena halde YANLIŞ. Hatayı bulmak için incelemeyi başlat!`, type: 'error' };
      }
      if (bugState === 'INSPECTING') {
         return { id: 3, text: `Sıfırlı çarpmayı kısa yoldan yapıp hatalı toplam bulduk! Kaç basamak kaydırma yapacağımızı senin bulman gerekiyor. SIFIR kapsüllerini turuncu yuvaya sürükleyip TEST ET'e bas!`, type: 'info' };
      }
      if (bugState === 'FIXED') {
         return { id: 4, text: `Harika! Kısa yoldan çarpmada çarpan sayının sonundaki sıfırları doğrudan sonuca eklemen gerektiğini anladın. İşlem onaylandı!`, type: 'success' };
      }
    }
    return { id: 5, text: 'Zihinden işlemler laboratuvarı tamamlandı!', type: 'success' };
  };

  // Variables for buggy UI processing
  const currentTestSumStr = row2Base.toString() + '0'.repeat(addedZeros);
  const currentTestSum = Number(currentTestSumStr);
  const correctSum = factor1 * factor2;

  return (
    <div className="h-full w-full bg-[#0B0C10] text-white flex flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 relative font-sans selection:bg-[#00E5FF] selection:text-black custom-scrollbar pb-32">
      {/* Space Lab Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] xl:top-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-[#00E5FF]/5 blur-[120px]"></div>
        <div className="absolute top-[40%] xl:top-[50%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#FF3366]/5 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <header className="max-w-7xl w-full mx-auto flex items-center justify-between relative z-20 mb-8 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-12 h-12 bg-[#12121A] rounded-2xl flex items-center justify-center border border-gray-800 hover:border-[#00E5FF] transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <Bug className="w-6 h-6 text-[#FF3366]" /> SIFIR <span className="text-[#00E5FF]">HATA MOTORU</span>
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Bug Avcısı ve Takoz Sistemi</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative z-20 flex-1">
        
        {/* LEFT PANEL: ZERO FACTORY */}
        <div className={`border rounded-3xl p-6 lg:p-8 flex flex-col transition-all duration-500 overflow-hidden relative ${phase === 'PHASE1_ZERO_FACTORY' ? 'border-[#00E5FF] bg-[#12121A] shadow-[0_0_30px_rgba(0,229,255,0.15)]' : 'border-gray-800 bg-[#0B0C10] opacity-50 grayscale pointer-events-none'}`}>
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50"></div>
           
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <Crosshair className="w-6 h-6 text-[#00E5FF]" />
               <h2 className="text-xl font-bold uppercase text-white tracking-widest">Sıfır Sentezleyici</h2>
             </div>
             <div className="text-[#00E5FF] text-xs font-bold px-3 py-1 border border-[#00E5FF]/50 rounded-full bg-[#00E5FF]/10">TEST 1</div>
           </div>

           <div className="bg-[#0B0C10] border border-[#1F2833] rounded-2xl p-6 mb-6 text-center relative overflow-hidden flex-1 shadow-inner flex flex-col justify-center">             
             <div className="text-xs text-gray-500 uppercase font-bold tracking-[0.3em] mb-4">ULAŞILMASI İSTENEN HEDEF DEĞER</div>
             <div className="text-3xl font-black text-[#FF3366] px-4 py-2 border border-dashed border-[#FF3366]/50 rounded-xl mb-8 inline-block shadow-[inset_0_0_10px_rgba(255,51,102,0.2)] bg-[#FF3366]/5">
               {formatNumber(baseNumber, targetZeros)}
             </div>

             <div className="text-xs text-gray-500 uppercase font-bold tracking-[0.3em] mb-4">ÜRETİM BANDINDAKİ SAYI</div>
             
             <div className="flex items-center justify-center gap-2 min-h-[100px] bg-[#12121A] p-6 rounded-2xl border border-gray-800">
                <span className="text-5xl lg:text-6xl font-black text-white">{baseNumber}</span>
                <AnimatePresence mode="popLayout">
                  {Array.from({ length: currentZeros }).map((_, i) => (
                    <motion.div
                      key={`z-${i}`}
                      initial={{ opacity: 0, scale: 0, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0, y: 50 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-12 h-16 bg-[#00E5FF]/20 border-2 border-[#00E5FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    >
                      <span className="text-4xl font-black text-[#00E5FF]">0</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-4">
             <button 
               onClick={() => modifyZeros(1)} 
               className="py-4 flex flex-col items-center justify-center gap-1 bg-gray-900 hover:bg-gray-800 border border-[#00E5FF]/50 rounded-2xl text-white transition-all shadow-[inset_0_0_20px_rgba(0,229,255,0.1)] group"
             >
                <div className="flex items-center gap-2 text-[#00E5FF]">
                   <span className="font-black text-xl group-hover:scale-110 transition-transform">Enjekte Et (x10)</span>
                </div>
             </button>
             
             <button 
               onClick={() => modifyZeros(-1)} 
               className="py-4 flex flex-col items-center justify-center gap-1 bg-gray-900 hover:bg-gray-800 border border-[#FF3366]/50 rounded-2xl text-white transition-all shadow-[inset_0_0_20px_rgba(255,51,102,0.1)] group"
             >
                <div className="flex items-center gap-2 text-[#FF3366]">
                   <span className="font-black text-xl group-hover:scale-110 transition-transform">Sil (Böl 10)</span>
                </div>
             </button>
           </div>
           
           <button 
             onClick={confirmPhase1}
             className="w-full py-5 bg-[#00E5FF] text-black font-black uppercase tracking-wider rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
           >
             <CheckCircle2 className="w-6 h-6" /> ONAYLA VE BAĞLA
           </button>
        </div>

        {/* RIGHT PANEL: BUG HUNT (SHIFT WEDGE) */}
        <div className={`border rounded-3xl p-6 lg:p-8 flex flex-col transition-all duration-500 overflow-hidden relative ${(phase === 'PHASE2_COLUMN_WEDGE' || phase === 'VICTORY') ? 'border-[#FF3366] bg-[#12121A] shadow-[0_0_40px_rgba(255,51,102,0.15)]' : 'border-gray-800 bg-[#0B0C10] opacity-50 grayscale pointer-events-none'}`}>
           <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#FF3366] to-transparent opacity-50"></div>
           
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <Bug className={`w-6 h-6 ${bugState === 'FIXED' ? 'text-[#00FF88]' : 'text-[#FF3366] animate-pulse'}`} />
               <h2 className="text-xl font-bold uppercase text-white tracking-widest">Hata Teşhis Masası</h2>
             </div>
             <div className={`text-xs font-bold px-3 py-1 border rounded-full ${bugState === 'FIXED' ? 'border-[#00FF88] text-[#00FF88] bg-[#00FF88]/10' : 'border-[#FF3366] text-[#FF3366] bg-[#FF3366]/10'}`}>
                {bugState === 'FIXED' ? 'ÇÖZÜLDÜ' : 'KONTROL: HATALI'}
             </div>
           </div>

           <div className={`border rounded-2xl p-6 mb-8 flex-1 flex flex-col items-center justify-center font-mono relative overflow-hidden transition-colors ${bugState === 'FIXED' ? 'bg-[#0B0C10] border-[#00FF88]/50 shadow-[inset_0_0_30px_rgba(0,255,136,0.1)]' : 'bg-red-900/10 border-red-500 shadow-[inset_0_0_30px_rgba(239,68,68,0.2)]'}`}>
              
              <div className="text-5xl text-gray-300 tracking-[0.5em] flex flex-col items-end">
                 <div className="mb-2 pr-4">{factor1}</div>
                 <div className="mb-2 pr-4 flex items-center"><span className="text-gray-500 mr-6 font-black font-sans text-3xl">x</span>{factor2}</div>
                 
                 <div className="w-full h-1 bg-gray-700 mb-6 rounded-full"></div>

                 {/* Row 2 (The Bug / The Fix) */}
                 <div className="relative flex justify-end items-center h-16 mb-4">
                    <motion.div 
                      layout
                      className="relative z-10 flex items-center"
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <div className={`transition-colors duration-500 font-bold ${bugState === 'WRONG' ? 'text-red-500 border border-red-500/50 p-1 rounded bg-red-500/10' : bugState === 'INSPECTING' ? 'text-white border border-transparent p-1' : 'text-[#00E5FF] p-1'}`}>
                         {row2Base}
                      </div>
                    </motion.div>

                    {/* The Zero Wedge Area */}
                    <div 
                       id="zero-drop-zone" 
                       className={`relative transition-all rounded-lg ml-2 flex justify-end items-center overflow-hidden h-14 ${bugState === 'WRONG' ? 'w-0 border-none opacity-0' : bugState === 'INSPECTING' ? 'min-w-[48px] border-2 border-dashed border-orange-500 bg-orange-500/10 px-2' : 'min-w-[48px] border-2 border-[#00E5FF] bg-[#00E5FF]/20 px-2'}`}
                    >
                       <AnimatePresence>
                          {(bugState === 'FIXED' || addedZeros > 0) && Array.from({ length: bugState === 'FIXED' ? targetZerosPhase2 : addedZeros }).map((_, i) => (
                            <motion.span 
                               key={i}
                               initial={{ opacity: 0, scale: 3 }}
                               animate={{ opacity: 1, scale: 1 }}
                               exit={{ opacity: 0, scale: 0, width: 0 }}
                               transition={{ type: 'spring', bounce: 0.6 }}
                               className="text-3xl font-black text-[#00E5FF] font-sans"
                            >
                               0
                            </motion.span>
                          ))}
                       </AnimatePresence>
                    </div>
                 </div>

                 <div className="w-full h-1 bg-gray-700 my-4 rounded-full"></div>
                 
                 {/* Total Sum */}
                 <div className="w-full flex justify-end pr-4">
                    <AnimatePresence mode="wait">
                       {bugState === 'FIXED' ? (
                          <motion.div 
                             key="correct-sum"
                             initial={{ opacity: 0, y: 20, scale: 0.8 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             className="text-6xl text-[#00FF88] font-black drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]"
                          >
                             {correctSum}
                          </motion.div>
                       ) : (
                          <motion.div 
                             key="wrong-sum"
                             className={`text-5xl transition-colors ${addedZeros > 0 ? 'text-[#00E5FF]' : 'text-red-500 line-through decoration-4 decoration-red-600 opacity-80'}`}
                          >
                             {currentTestSum}
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </div>
              
              {bugState === 'WRONG' && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-900/80 border border-red-500 px-4 py-2 rounded-full backdrop-blur-md">
                    <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                    <span className="text-red-500 font-bold text-sm tracking-widest whitespace-nowrap">KRİTİK HATA! YANLIŞ TOPLAM</span>
                 </div>
              )}
           </div>

           {/* Controls */}
           {bugState === 'WRONG' && phase === 'PHASE2_COLUMN_WEDGE' && (
             <motion.button 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               onClick={inspectBug}
               className="w-full py-5 bg-red-900/80 hover:bg-red-800 border-2 border-red-500 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
             >
               <Bug className="w-6 h-6" /> HATALI İŞLEMİ İNCELE
             </motion.button>
           )}

           {bugState === 'INSPECTING' && phase === 'PHASE2_COLUMN_WEDGE' && (
             <div className="w-full flex flex-col items-center justify-center gap-6 py-4 relative">
                <p className="text-orange-400 font-bold text-sm tracking-widest animate-pulse border border-orange-500/50 bg-orange-500/10 px-4 py-2 rounded-full">
                  İHTİYACIN KADAR SIFIR KAPSÜLÜNÜ YUVAYA BIRAK!
                </p>
                
                <div className="flex gap-4">
                  <motion.div
                    drag
                    dragSnapToOrigin
                    whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    className="w-16 h-16 bg-orange-500 border-4 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.8)] rounded-xl flex items-center justify-center cursor-grab z-50 relative"
                  >
                    <span className="text-black font-black text-4xl">0</span>
                    
                    {isDragging && (
                      <motion.div 
                        key="drag-pulse"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-white rounded-xl pointer-events-none"
                      />
                    )}
                  </motion.div>
                  
                  <div className="flex flex-col gap-2">
                    <button onClick={verifyFix} className="px-6 py-2 bg-[#00E5FF] text-black font-black rounded-lg hover:bg-white transition-colors h-1/2 min-h-12 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                       TEST ET
                    </button>
                    {addedZeros > 0 && (
                      <button onClick={clearZeros} className="px-6 py-2 bg-gray-800 text-gray-400 font-bold rounded-lg hover:text-white transition-colors text-xs border border-gray-700 h-1/2 min-h-8">
                         TEMİZLE
                      </button>
                    )}
                  </div>
                </div>
             </div>
           )}
           
           {bugState === 'FIXED' && (
              <div className="w-full py-5 bg-[#00FF88]/20 border border-[#00FF88] text-[#00FF88] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-6 h-6" /> BUG ONARILDI
              </div>
           )}

        </div>

      </main>

      <AstroBot message={getBotMessage()} />

      <AnimatePresence>
        {showVictory && (
           <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-sans"
         >
           <motion.div 
             initial={{ scale: 0.9, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             className="bg-[#12121A] border border-[#00E5FF]/30 p-10 rounded-[3rem] max-w-2xl w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,229,255,0.2)]"
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00E5FF]/20 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="w-24 h-24 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00E5FF]/30 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
               <Zap className="w-12 h-12 text-[#00E5FF]" />
             </div>
             
             <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter">
               BUG <span className="text-[#00E5FF]">ONARILDI!</span>
             </h2>
             <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                Sıfırla biten sayılarla çarpmada pratik yolu öğrendin! Çarpana ait sıfırların işlemdeki varlığını analiz edip doğru miktarda kaydırmayı sen belirledin. Çok yaşa!
             </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#1F2833] border border-[#00E5FF]/30 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
                     <span className="font-mono text-[#00E5FF] font-bold text-[10px]">MAT.4.2.4.1</span>
                   </div>
                   <p className="text-white text-xs leading-relaxed">Sıfırlar başarılı şekilde sentezlendi ve eklendi.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#1F2833] border border-[#00FF88]/30 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-[#00FF88]"></span>
                     <span className="font-mono text-[#00FF88] font-bold text-[10px]">MAT.4.2.5.1</span>
                   </div>
                   <p className="text-white text-xs leading-relaxed">Çarpma hatası teşhis edildi, basamak değeri düzeltildi.</p>
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
                 className="flex-[2] px-6 py-4 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.4)]"
               >
                 ÇIKIŞ YAP <ArrowRight className="w-5 h-5" />
               </Link>
             </div>

           </motion.div>
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}