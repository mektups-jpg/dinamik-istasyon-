import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ScanLine, Equal, Lock, Unlock, AlertTriangle, ShieldCheck, ArrowRight, Trophy, Info, CheckCircle, X } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Link } from 'react-router-dom';
import Bot from '../../../components/characters/Bot';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';

export default function FractionSynchronizerApp({ onBack }: { onBack?: () => void }) {
  // STEPS: 
  // 1. extract: Convert Tam Sayılı -> Bileşik
  // 2. optimize: Scale the fraction to match denominators
  // 3. compare: Select the larger fraction
  // 4. victory: Check and Win
  const [step, setStep] = useState<'extract' | 'optimize' | 'compare' | 'victory'>('extract');
  
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [botMessage, setBotMessage] = useState<BotMessage>({ text: "Ajan! Sistemde format uyuşmazlığı tespit edildi. Sol matrisin kilidini kır ve tam sayılı bloğu bileşik formda (noktalar halinde) matrise dağıt!", type: 'info', id: 0 });
  const [showError, setShowError] = useState(false);

  const showBotMessage = (text: string, type: BotMessageType = 'info') => {
    setBotMessage(prev => ({ text, type, id: prev.id + 1 }));
  };

  // FRAC 1 (Starts as Mixed: 2 1/3)
  const W1 = 2;
  const N1 = 1;
  const D1 = 3;
  const totalN1 = (W1 * D1) + N1; // 7

  // FRAC 2 (Starts as Improper: 11/6)
  const N2 = 11;
  const D2 = 6;

  const [extracted, setExtracted] = useState(false);
  const [m1, setM1] = useState(1);
  const [m2, setM2] = useState(1);

  const currentN1 = totalN1 * m1;
  const currentD1 = D1 * m1;
  const currentN2 = N2 * m2;
  const currentD2 = D2 * m2;

  const isSync = currentD1 === currentD2;

  useEffect(() => {
    if (showError) return;
    if (step === 'extract') {
      showBotMessage("Ajan! Sistemde format uyuşmazlığı tespit edildi. Sol matrisin kilidini kır ve tam sayılı bloğu bileşik formda (noktalar halinde) matrise dağıt!", "info");
    } else if (step === 'optimize') {
      showBotMessage("Formatlar onaylandı, fakat frekanslar (paydalar) farklı. Ağın 6 frekansında senkronize olması için sol matrisin çözünürlüğünü (+) ile genişleterek eşitle!", "info");
    } else if (step === 'compare') {
      showBotMessage("Frekanslar senkronize! Şimdi iki matrisin dolu blok hacmine (paya) bak. Ağı kurtarmak için hacmi BÜYÜK olanı seç!", "info");
    } else if (step === 'victory') {
       showBotMessage("Görev tamamlandı! Ağ onarıldı ve matematiksel yetki mühürlerin (Kazanımlar) aktifleşti. Sisteme veri yazılıyor...", "success");
    }
  }, [step, showError]);

  const handleExtract = () => {
    setExtracted(true);
    setTimeout(() => {
      setStep('optimize');
    }, 1500);
  };

  const handleWrongAnswer = () => {
    setShowError(true);
    showBotMessage("Hata! Çözünürlükler eşitlendiğinde, sağ taraftaki yapının sadece 11 bloğu var. Solun ise 14 bloğu var. Mantıksal analizi tekrar yap!", "error");
    setTimeout(() => setShowError(false), 5000);
  };

  const handleWin = () => {
    unlockAtom('MAT.5.1.3.2'); // Dönüştürme
    unlockAtom('MAT.5.1.4.1'); // Genişletme/Sıralama
    addScore(150);
    setStep('victory');
  };

  const renderGrid = (multiplier: number, baseD: number, baseN: number, isExtracted: boolean, isActive: boolean) => {
     if (!isExtracted) {
        return (
          <div className="w-56 aspect-square flex flex-col items-center justify-center bg-white/5 border border-white/20 rounded-2xl relative overflow-hidden">
             <Lock className="w-12 h-12 text-white/20 absolute z-0" />
             <div className="z-10 flex gap-4 text-white">
                <span className="text-6xl font-black">{W1}</span>
                <div className="flex flex-col items-center text-2xl font-bold">
                   <span className="text-[#00E5FF]">{baseN}</span>
                   <div className="w-8 h-1 bg-white/30 my-1"></div>
                   <span className="text-gray-400">{baseD}</span>
                </div>
             </div>
          </div>
        )
     }

     const totalCells = baseD * multiplier;
     const filledCells = baseN * multiplier;
     const colorHex = isActive ? 'bg-[#00E5FF]' : 'bg-[#B388FF]';
     
     return (
       <div className="w-56 aspect-square border border-white/20 rounded-2xl overflow-hidden flex flex-wrap bg-white/5 relative shadow-inner">
          <div className="absolute inset-0 grid" 
               style={{ 
                 gridTemplateRows: `repeat(${multiplier}, minmax(0, 1fr))`,
                 gridTemplateColumns: `repeat(${baseD}, minmax(0, 1fr))` 
               }}>
             {Array.from({ length: totalCells }).map((_, i) => (
                <motion.div 
                   key={i} 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.02 }}
                   className={`border-[0.5px] border-black/50 transition-all duration-300 ${i < filledCells ? colorHex : 'bg-transparent'}`} 
                />
             ))}
          </div>
       </div>
     );
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#050510] text-gray-200 p-4 md:p-8 font-sans select-none overflow-hidden relative flex flex-col items-center">
      
      {/* Tech Background */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#00E5FF]/5 to-transparent transition-opacity" style={{ opacity: step === 'victory' ? 0.3 : 1 }}></div>
         <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-t from-[#B388FF]/5 to-transparent transition-opacity" style={{ opacity: step === 'victory' ? 0.3 : 1 }}></div>
         <div className="absolute inset-0 noise-overlay opacity-[0.04]"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between mb-8 max-w-6xl w-full">
        <div className="flex items-center gap-6">
          {onBack && (
            <button onClick={onBack} className="p-3 bg-[#1A1A24] border border-white/10 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-md">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
              <ScanLine className="w-8 h-8 text-[#00E5FF]" />
              KOD ÇEKİRDEĞİ {step !== 'victory' && `// PROTOKOL: ${step.toUpperCase()}`}
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1">MAT.5.1.3 & MAT.5.1.4 // Tam Senkronizasyon Ağı</p>
          </div>
        </div>
      </header>

      {/* MAIN ARENA */}
      <main className="relative z-10 flex-1 w-full max-w-5xl flex flex-col items-center justify-center pb-20">
         <AnimatePresence mode="wait">
            
            {step !== 'victory' ? (
               <motion.div key="game" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="bg-[#0B0C10]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 w-full flex flex-col items-center shadow-2xl relative overflow-hidden">
                  
                  {/* Status Top */}
                  <div className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 border-b border-white/5 bg-white/[0.02]">
                     <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-gray-400">
                        <span className={`w-2 h-2 rounded-full ${step === 'extract' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                        AŞAMA 1: DAĞITIM
                        <ChevronLeft className="w-4 h-4 mx-2 rotate-180 opacity-30" />
                        <span className={`w-2 h-2 rounded-full ${step === 'optimize' ? 'bg-yellow-400 animate-pulse' : (step === 'compare' ? 'bg-green-400' : 'bg-gray-700')}`}></span>
                        AŞAMA 2: ÇÖZÜNÜRLÜK
                        <ChevronLeft className="w-4 h-4 mx-2 rotate-180 opacity-30" />
                        <span className={`w-2 h-2 rounded-full ${step === 'compare' ? 'bg-[#00E5FF] animate-pulse' : 'bg-gray-700'}`}></span>
                        AŞAMA 3: ANALİZ
                     </div>
                     {step === 'extract' && <span className="text-yellow-400 text-xs font-mono uppercase border border-yellow-400/30 px-3 py-1 rounded-full flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Format Uyuşmazlığı</span>}
                     {step === 'optimize' && !isSync && <span className="text-[#B388FF] text-xs font-mono uppercase border border-[#B388FF]/30 px-3 py-1 rounded-full">Frekans Uyuşmazlığı</span>}
                     {isSync && step === 'compare' && <span className="text-[#00E5FF] text-xs font-mono uppercase bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-3 py-1 rounded-full flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Sistem Senkronize</span>}
                  </div>

                  <div className="mt-16 flex flex-col md:flex-row gap-12 justify-center items-center w-full min-h-[300px]">
                     
                     {/* --- LEFT ENTITY --- */}
                     <div className="flex flex-col items-center gap-6">
                        <div className={`p-1.5 rounded-2xl transition-all duration-500 ${isSync ? 'bg-[#00E5FF]' : 'bg-transparent'}`}>
                          {renderGrid(m1, D1, totalN1, extracted, true)}
                        </div>
                        
                        <div className={`flex flex-col items-center gap-4 transition-opacity duration-300 ${extracted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                           <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                              <div className="flex flex-col items-center">
                                 <span className="text-3xl font-black text-white">{currentN1}</span>
                                 <div className="w-10 h-0.5 bg-white/30 my-1"></div>
                                 <span className={`text-2xl font-bold ${isSync ? 'text-[#00E5FF]' : 'text-gray-500'}`}>{currentD1}</span>
                              </div>
                              {step === 'optimize' && (
                                 <>
                                   <div className="h-12 w-[1px] bg-white/10"></div>
                                   <div className="flex flex-col items-center gap-2">
                                     <span className="text-[10px] text-gray-500 font-mono tracking-widest">ÇÖZÜNÜRLÜK (x{m1})</span>
                                     <div className="flex gap-2">
                                       <button onClick={() => setM1(p=>Math.max(1, p-1))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white">-</button>
                                       <button onClick={() => { setM1(p=>p+1); if(D1*(m1+1) === currentD2) { setTimeout(() => setStep('compare'), 800) } }} className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center text-[#00E5FF] font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]" disabled={isSync}>+</button>
                                     </div>
                                   </div>
                                 </>
                              )}
                           </div>
                        </div>

                        {/* Extract Button Logic */}
                        {!extracted && (
                           <motion.button 
                              initial={{ y: 0 }}
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              onClick={handleExtract}
                              className="absolute bottom-12 left-12 md:static mt-4 px-6 py-3 bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black font-black uppercase text-sm tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                           >
                              KİLİDİ KIR & DAĞIT
                           </motion.button>
                        )}
                     </div>

                     {/* --- CENTER UI --- */}
                     <div className="font-mono text-gray-600 text-3xl font-black tracking-widest flex items-center justify-center">
                        {step === 'extract' ? <Unlock className="w-12 h-12 text-white/5" /> : 
                         isSync ? <Equal className="w-16 h-16 text-[#00E5FF] animate-pulse drop-shadow-[0_0_20px_rgba(0,229,255,0.5)]" /> : '≠'}
                     </div>

                     {/* --- RIGHT ENTITY --- */}
                     <div className="flex flex-col items-center gap-6">
                        <div className={`p-1.5 rounded-2xl transition-all duration-500 ${isSync ? 'bg-[#00E5FF]' : 'bg-transparent'}`}>
                          {renderGrid(m2, D2, N2, true, false)}
                        </div>
                        
                        <div className="flex flex-col items-center gap-4">
                           <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 opacity-50">
                              <div className="flex flex-col items-center">
                                 <span className="text-3xl font-black text-white">{currentN2}</span>
                                 <div className="w-10 h-0.5 bg-white/30 my-1"></div>
                                 <span className={`text-2xl font-bold ${isSync ? 'text-[#00E5FF]' : 'text-gray-500'}`}>{currentD2}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>

                  {/* --- STEP 3: COMPARE PANEL --- */}
                  <AnimatePresence>
                     {step === 'compare' && isSync && (
                        <motion.div 
                           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                           className="w-full mt-12 p-8 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-3xl flex flex-col items-center relative overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.1)]"
                        >
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent"></div>
                           <p className="text-[#00E5FF] font-mono text-sm tracking-widest uppercase mb-8 text-center bg-[#00E5FF]/10 px-4 py-2 rounded-full">
                             Veri Blokları Senkronize. Hangi yapının hacmi (payı) daha büyük?
                           </p>
                           <div className="flex gap-6 w-full justify-center">
                              <button 
                                onClick={handleWin} 
                                className="flex-1 max-w-[250px] py-4 bg-white/5 hover:bg-[#00E5FF]/20 hover:scale-105 border border-white/20 hover:border-[#00E5FF] text-white rounded-2xl font-mono text-sm tracking-widest font-bold transition-all"
                              >
                                SOL ({currentN1}/{currentD1}) DAHA BÜYÜK
                              </button>
                              <button 
                                onClick={handleWrongAnswer} 
                                className="flex-1 max-w-[250px] py-4 bg-white/5 hover:bg-red-500/20 hover:scale-105 border border-white/20 hover:border-red-500 text-white rounded-2xl font-mono text-sm tracking-widest transition-all"
                              >
                                SAĞ ({currentN2}/{currentD2}) DAHA BÜYÜK
                              </button>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>

               </motion.div>
            ) : (
               
               // === VICTORY SCREEN ===
               <motion.div key="victory" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center w-full max-w-4xl py-12">
                  <div className="relative mb-12 flex items-center justify-center">
                     <div className="absolute w-[400px] h-[400px] bg-[#00E5FF]/20 rounded-full blur-[100px] animate-pulse"></div>
                     <Trophy className="w-32 h-32 text-[#00E5FF] drop-shadow-[0_0_30px_rgba(0,229,255,0.8)] relative z-10" />
                  </div>
                  
                  <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 tracking-tight text-center">
                     SİSTEM ONARILDI
                  </h2>
                  <p className="text-lg text-[#00E5FF] font-mono mb-12 uppercase tracking-widest text-center shadow-[#00E5FF]">Kazanım Mühürleri Aktifleştirildi</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                     {/* Atom 1 */}
                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#12121A] border border-[#00E5FF]/30 p-6 rounded-3xl flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-3xl group-hover:bg-[#00E5FF]/20 transition-all"></div>
                        <div className="flex items-center gap-3 mb-3">
                           <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />
                           <span className="font-mono text-[#00E5FF] font-bold">MAT.5.1.3.2</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">Tam sayılı ve bileşik kesirleri birbirine dönüştürür. Dağıtım ve modelleme protokolü başarıyla öğrenildi.</p>
                     </motion.div>

                     {/* Atom 2 */}
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#12121A] border border-[#B388FF]/30 p-6 rounded-3xl flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B388FF]/10 rounded-full blur-3xl group-hover:bg-[#B388FF]/20 transition-all"></div>
                        <div className="flex items-center gap-3 mb-3">
                           <ShieldCheck className="w-6 h-6 text-[#B388FF]" />
                           <span className="font-mono text-[#B388FF] font-bold">MAT.5.1.4.1</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">Paydaları eşit veya birinin paydası diğerinin katı olan kesirleri sıralar. Frekans senkronizasyonu öğrenildi.</p>
                     </motion.div>
                  </div>

                  <Link 
                     to="/"
                     className="mt-16 px-10 py-5 bg-[#00E5FF] hover:bg-white text-black font-black text-lg font-mono rounded-2xl flex items-center gap-4 transition-all hover:scale-105 shadow-[0_0_40px_rgba(0,229,255,0.4)]"
                  >
                     UZAY ÜSSÜNE DÖN <ArrowRight className="w-6 h-6" />
                  </Link>
               </motion.div>
            )}
         </AnimatePresence>
      </main>

      {botMessage && <AstroBot message={botMessage} />}
    </div>
  );
}
