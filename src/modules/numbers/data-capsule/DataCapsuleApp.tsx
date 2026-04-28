import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { AstroBot, BotMessage } from '../../../components/ui/AstroBot';
import { Lock, Unlock, ArrowLeft, ChevronUp, ChevronDown, CheckCircle, Database, ServerCrash, ShieldCheck, ArrowRight } from 'lucide-react';

type Phase = 'PHASE1_CRYPTO' | 'PHASE2_SORT' | 'PHASE3_PATTERN' | 'VICTORY';

export default function DataCapsuleApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();

  const [phase, setPhase] = useState<Phase>('PHASE1_CRYPTO');
  const [showVictory, setShowVictory] = useState(false);
  const [botFeedback, setBotFeedback] = useState<string | null>(null);

  // Phase 1 (Crypto)
  const [targetCrypto, setTargetCrypto] = useState<number[]>([]);
  const [cryptoCode, setCryptoCode] = useState<number[]>([0,0,0,0,0,0]);
  
  // Phase 2 (Sort)
  const [sortBlocks, setSortBlocks] = useState<{id: number, val: number}[]>([]);
  
  // Phase 3 (Pattern)
  const [patternSeq, setPatternSeq] = useState<(number | null)[]>([]);
  const [missingVal, setMissingVal] = useState<number>(0);
  const [missingIdx, setMissingIdx] = useState<number>(0);
  const [patternInput, setPatternInput] = useState<string>('');

  useEffect(() => {
    generateLevel();
  }, []);

  const generateLevel = () => {
    // Generate Phase 1 Target
    const p1 = Array.from({length: 6}, () => Math.floor(Math.random() * 10));
    if (p1[0] === 0) p1[0] = 1; // Ensure 6 digits
    setTargetCrypto(p1);
    setCryptoCode([0,0,0,0,0,0]);

    // Generate Phase 2 Sorting Blocks
    const base = 100000 + Math.floor(Math.random() * 800000);
    const b1 = base;
    const b2 = base + Math.floor(Math.random() * 10000) + 1000;
    const b3 = base - Math.floor(Math.random() * 10000) - 1000;
    const b4 = base + Math.floor(Math.random() * 50000) + 20000;
    // shuffle
    const unsorted = [b1,b2,b3,b4]
      .sort(() => Math.random() - 0.5)
      .map((v, i) => ({ id: i, val: v }));
    setSortBlocks(unsorted);

    // Generate Phase 3 Pattern
    const step = (Math.floor(Math.random() * 9) + 1) * 1000; // 1k to 9k
    const start = (Math.floor(Math.random() * 50) + 10) * 10000; // 100k to 500k
    const pSeq = [start, start + step, start + 2*step, start + 3*step, start + 4*step];
    const mIdx = Math.floor(Math.random() * 3) + 1; // idx 1, 2, or 3
    
    setMissingVal(pSeq[mIdx]);
    setMissingIdx(mIdx);
    
    const renderedSeq: (number | null)[] = [...pSeq];
    renderedSeq[mIdx] = null;
    setPatternSeq(renderedSeq);
    setPatternInput('');

    setPhase('PHASE1_CRYPTO');
    setShowVictory(false);
    setBotFeedback(null);
  };

  const handleCryptoChange = (index: number, delta: number) => {
    if (phase !== 'PHASE1_CRYPTO') return;
    setBotFeedback(null);
    const newCode = [...cryptoCode];
    let val = newCode[index] + delta;
    if (val > 9) val = 0;
    if (val < 0) val = 9;
    newCode[index] = val;
    setCryptoCode(newCode);

    if (newCode.join('') === targetCrypto.join('')) {
      setTimeout(() => {
        setPhase('PHASE2_SORT');
        unlockAtom('MAT.4.1.1.1');
      }, 800);
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const moveBlock = (index: number, direction: 'UP' | 'DOWN') => {
    if (phase !== 'PHASE2_SORT') return;
    setBotFeedback(null);
    const newBlocks = [...sortBlocks];
    if (direction === 'UP' && index > 0) {
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;
    } else if (direction === 'DOWN' && index < newBlocks.length - 1) {
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;
    }
    setSortBlocks(newBlocks);
  };

  const checkSort = () => {
    setBotFeedback(null);
    // Check descending (each block must be greater than or equal to the next)
    let isSorted = true;
    for (let i = 1; i < sortBlocks.length; i++) {
      if (sortBlocks[i - 1].val < sortBlocks[i].val) {
        isSorted = false;
        break;
      }
    }
    
    if (isSorted) {
      setTimeout(() => {
        setPhase('PHASE3_PATTERN');
        unlockAtom('MAT.4.1.3.1');
      }, 800);
    } else {
      setBotFeedback("Dikkat: Veriler hala düzensiz! Lütfen en büyük sayıyı en üste, en küçük sayıyı en alta yerleştir.");
    }
  };

  const checkPattern = () => {
    setBotFeedback(null);
    if (Number(patternInput) === missingVal) {
      setPhase('VICTORY');
      setTimeout(() => {
        unlockAtom('MAT.4.1.4.1');
        unlockModule('data-capsule-4');
        addScore(500);
        setShowVictory(true);
      }, 1000);
    } else {
      setBotFeedback("Hatalı veri girişi! Örüntünün kaçar kaçar arttığını bularak tekrar hesaplamayı dene.");
    }
  };

  const getBotMessage = (): BotMessage => {
    if (botFeedback) {
       return { id: 99, text: botFeedback, type: 'error' };
    }
    if (phase === 'PHASE1_CRYPTO') {
      return { id: 1, text: `Erişim reddediliyor! Ana kripto kodunu terminal ekranında gördüğün şifreye ayarla.`, type: 'info' };
    }
    if (phase === 'PHASE2_SORT') {
      return { id: 2, text: 'Kapsül kırıldı! İçinden düşen veri bloklarını sıralamalısın. Modül talimatlarını oku!', type: 'info' };
    }
    if (phase === 'PHASE3_PATTERN') {
       return { id: 3, text: 'Son aşama! Motor ritmik bir hata veriyor. Algoritmayı çözüp eksik veriyi gir!', type: 'error'};
    }
    return { id: 4, text: 'Bütün sistemler devrede! Süper bir iş çıkardın.', type: 'success' };
  };

  return (
    <div className="h-full w-full bg-[#0B0C10] text-white flex flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 relative font-sans selection:bg-[#00E5FF] selection:text-black custom-scrollbar pb-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#00E5FF]/5 blur-[120px]"></div>
        <div className="absolute top-[60%] right-[20%] w-[30%] h-[30%] rounded-full bg-[#B388FF]/10 blur-[100px]"></div>
      </div>

      <header className="max-w-7xl w-full mx-auto flex items-center justify-between relative z-20 mb-8 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-12 h-12 bg-[#12121A] rounded-2xl flex items-center justify-center border border-gray-800 hover:border-[#00E5FF] transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <Database className="w-6 h-6 text-[#00E5FF]" /> VERİ KAPSÜLÜ <span className="text-[#00E5FF]">MOTORU</span>
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">100.000'ler Şifre Çözümü</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto relative z-20 flex-1 flex flex-col gap-6">
        
        {/* PHASE 1: CRYPTO */}
        <div className={`p-8 rounded-3xl border transition-all duration-500 ${phase === 'PHASE1_CRYPTO' ? 'bg-[#12121A] border-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.15)]' : 'bg-[#0B0C10] border-gray-800 opacity-50 grayscale'}`}>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase flex items-center gap-2">
                <Lock className={`w-6 h-6 ${phase === 'PHASE1_CRYPTO' ? 'text-[#00E5FF]' : 'text-gray-500'}`} /> Aşama 1: Kripto Kilidi
              </h2>
              {phase !== 'PHASE1_CRYPTO' && <CheckCircle className="w-6 h-6 text-[#00FF88]" />}
           </div>

           {phase === 'PHASE1_CRYPTO' && (
             <div className="bg-blue-900/10 border border-[#00E5FF]/20 p-4 rounded-xl mb-6 text-center max-w-sm mx-auto shadow-inner">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">Gerekli Şifre Kodu</span>
                <span className="text-3xl font-mono font-black text-[#00E5FF] tracking-[0.2em]">{targetCrypto.length > 0 ? formatNumber(Number(targetCrypto.join(''))) : '---.---'}</span>
             </div>
           )}

           <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 bg-black/50 p-6 rounded-2xl border border-gray-900">
               {/* Binler Bölüğü */}
               <div className="flex gap-2 bg-[#1F2833] p-4 rounded-xl border border-gray-800">
                  {[0,1,2].map(i => (
                    <div key={i} className="flex flex-col items-center">
                       <button disabled={phase !== 'PHASE1_CRYPTO'} onClick={() => handleCryptoChange(i, 1)} className="p-2 text-gray-500 hover:text-[#00E5FF] disabled:opacity-50"><ChevronUp className="w-6 h-6" /></button>
                       <div className="w-12 h-16 bg-black border-2 border-gray-700 rounded-lg flex items-center justify-center text-3xl font-mono font-bold text-white shadow-inner">
                         {cryptoCode[i]}
                       </div>
                       <button disabled={phase !== 'PHASE1_CRYPTO'} onClick={() => handleCryptoChange(i, -1)} className="p-2 text-gray-500 hover:text-[#00E5FF] disabled:opacity-50"><ChevronDown className="w-6 h-6" /></button>
                    </div>
                  ))}
               </div>

               <span className="text-4xl text-[#00E5FF] font-black pointer-events-none pb-2">.</span>

               {/* Birler Bölüğü */}
               <div className="flex gap-2 bg-[#1F2833] p-4 rounded-xl border border-gray-800">
                  {[3,4,5].map(i => (
                    <div key={i} className="flex flex-col items-center">
                       <button disabled={phase !== 'PHASE1_CRYPTO'} onClick={() => handleCryptoChange(i, 1)} className="p-2 text-gray-500 hover:text-[#00E5FF] disabled:opacity-50"><ChevronUp className="w-6 h-6" /></button>
                       <div className="w-12 h-16 bg-black border-2 border-gray-700 rounded-lg flex items-center justify-center text-3xl font-mono font-bold text-white shadow-inner">
                         {cryptoCode[i]}
                       </div>
                       <button disabled={phase !== 'PHASE1_CRYPTO'} onClick={() => handleCryptoChange(i, -1)} className="p-2 text-gray-500 hover:text-[#00E5FF] disabled:opacity-50"><ChevronDown className="w-6 h-6" /></button>
                    </div>
                  ))}
               </div>
           </div>
        </div>

        {/* PHASE 2: SORT */}
        <div className={`p-8 rounded-3xl border transition-all duration-500 ${(phase === 'PHASE2_SORT') ? 'bg-[#12121A] border-[#B388FF] shadow-[0_0_30px_rgba(179,136,255,0.15)]' : 'bg-[#0B0C10] border-gray-800 opacity-50 grayscale pointer-events-none'}`}>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase flex items-center gap-2">
                <Unlock className={`w-6 h-6 ${(phase === 'PHASE2_SORT') ? 'text-[#B388FF]' : 'text-gray-500'}`} /> Aşama 2: Veri Sıralama
              </h2>
              {(phase === 'PHASE3_PATTERN' || phase === 'VICTORY') && <CheckCircle className="w-6 h-6 text-[#00FF88]" />}
           </div>

           {phase === 'PHASE2_SORT' && (
             <div className="bg-[#B388FF]/10 border border-[#B388FF]/20 p-4 rounded-xl mb-6 text-center max-w-lg mx-auto">
                <p className="text-[#B388FF] text-sm font-medium">Bozuk veri bloklarını yukarı ve aşağı okları kullanarak <strong>BÜYÜKTEN KÜÇÜĞE (Azalan)</strong> doğru sırala.</p>
             </div>
           )}

           <div className="flex flex-col gap-3 max-w-lg mx-auto">
              {phase === 'PHASE2_SORT' && (
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2">BÜYÜK SAYI</div>
              )}
              
              <AnimatePresence>
                {sortBlocks.map((block, idx) => (
                  <motion.div 
                    layout
                    key={block.id}
                    className={`flex items-center justify-between bg-[#1F2833] border p-4 rounded-xl ${phase === 'PHASE2_SORT' ? 'border-gray-600' : 'border-gray-800'}`}
                  >
                    <span className="font-mono text-2xl font-black text-white px-4">{formatNumber(block.val)}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => moveBlock(idx, 'UP')}
                        disabled={idx === 0 || phase !== 'PHASE2_SORT'}
                        className="w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-gray-900"
                      >
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      </button>
                      <button 
                        onClick={() => moveBlock(idx, 'DOWN')}
                        disabled={idx === sortBlocks.length - 1 || phase !== 'PHASE2_SORT'}
                        className="w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-gray-900"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {phase === 'PHASE2_SORT' && (
                <>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mt-2">KÜÇÜK SAYI</div>
                  <button 
                    onClick={checkSort}
                    className="mt-4 w-full py-4 bg-[#B388FF] text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Sıralamayı Doğrula
                  </button>
                </>
              )}
           </div>
        </div>

        {/* PHASE 3: PATTERN */}
        <div className={`p-8 rounded-3xl border transition-all duration-500 ${(phase === 'PHASE3_PATTERN') ? 'bg-[#12121A] border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-[#0B0C10] border-gray-800 opacity-50 grayscale pointer-events-none'}`}>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase flex items-center gap-2 text-white">
                <ServerCrash className={`w-6 h-6 ${(phase === 'PHASE3_PATTERN') ? 'text-red-500' : 'text-gray-500'}`} /> Aşama 3: Ritmik Motor Arızası
              </h2>
           </div>

           {phase === 'PHASE3_PATTERN' && (
             <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl mb-8 text-center text-red-300 text-sm max-w-2xl mx-auto shadow-inner">
                Aşağıdaki sayılar belirli bir kurala göre ardışık (ritmik) olarak artmaktadır. Kuralı (artış miktarını) bul ve arızalı veriyi (<strong>?</strong>) klavyenle yazarak motoru onar.
             </div>
           )}

           <div className="bg-black/50 p-6 rounded-2xl border border-gray-900 overflow-x-auto custom-scrollbar">
             <div className="flex min-w-max gap-4 items-center justify-center mb-8">
               {patternSeq.map((val, idx) => (
                 <div key={idx} className="flex items-center gap-4">
                   {val === null ? (
                      <div className="w-[140px]">
                         <input 
                           type="number" 
                           placeholder="?"
                           value={patternInput}
                           onChange={(e) => {
                              setPatternInput(e.target.value);
                              setBotFeedback(null);
                           }}
                           className="w-full text-center bg-red-900/20 border-2 border-red-500 text-white font-mono text-xl py-3 rounded-xl focus:outline-none focus:border-white transition-colors"
                         />
                      </div>
                   ) : (
                      <div className="bg-[#1F2833] border border-gray-700 text-gray-300 font-mono text-lg py-3 px-4 rounded-xl whitespace-nowrap shadow-inner">
                        {formatNumber(val)}
                      </div>
                   )}
                   
                   {idx < patternSeq.length - 1 && (
                     <div className="text-gray-600">
                       <ArrowRight className="w-6 h-6" />
                     </div>
                   )}
                 </div>
               ))}
             </div>
             
             {phase === 'PHASE3_PATTERN' && (
                <button 
                  onClick={checkPattern}
                  disabled={!patternInput}
                  className="w-full max-w-sm mx-auto block py-4 bg-red-500 text-white font-black uppercase tracking-wider rounded-xl hover:bg-red-400 disabled:opacity-50 transition-colors"
                >
                  Motoru Onar
                </button>
             )}
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
               <Database className="w-12 h-12 text-[#00E5FF]" />
             </div>
             
             <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter">
               KAPSÜL <span className="text-[#00E5FF]">KIRILDI!</span>
             </h2>
             <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                Büyük veri motoru yeniden devrede. Tüm verileri sıraladın ve arızayı onardın!
             </p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#1F2833] border border-[#00E5FF]/30 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                      <span className="font-mono text-[#00E5FF] font-bold text-[10px]">MAT.4.1.1.1</span>
                   </div>
                   <p className="text-white text-xs leading-relaxed">6 haneli şifre çözüldü.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#1F2833] border border-[#B388FF]/30 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#B388FF]" />
                      <span className="font-mono text-[#B388FF] font-bold text-[10px]">MAT.4.1.3.1</span>
                   </div>
                   <p className="text-white text-xs leading-relaxed">Veriler sıralandı.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#1F2833] border border-[#00FF88]/30 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
                      <span className="font-mono text-[#00FF88] font-bold text-[10px]">MAT.4.1.4.1</span>
                   </div>
                   <p className="text-white text-xs leading-relaxed">Motor onarıldı.</p>
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
