import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAtomStore } from '../../../store/useAtomStore';
import { ArrowLeftRight, Scale, Shield, ChevronLeft, Hexagon, Fingerprint, X, Info, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Bot from '../../../components/characters/Bot';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';

type Mode = 'select' | 'priority' | 'balance';

export default function EquationLabApp() {
  const [mode, setMode] = useState<Mode>('select');
  const { unlockAtom, unlockModule } = useAtomStore();

  const [priorityMastered, setPriorityMastered] = useState(false);
  const [balanceMastered, setBalanceMastered] = useState(false);

  useEffect(() => {
    if (priorityMastered && balanceMastered) {
      unlockModule('equation-lab');
    }
  }, [priorityMastered, balanceMastered, unlockModule]);

  const [botMessage, setBotMessage] = useState<BotMessage>({
    text: "Algoritmik Denklem Laboratuvarı'na hoş geldin. Uygulamalı deney odalarından birini seçerek çalışmalara başla.",
    type: 'info',
    id: 0
  });

  const showBotMessage = (text: string, type: BotMessageType = 'info') => {
    setBotMessage(prev => ({ text, type, id: prev.id + 1 }));
  };

  const getBgClass = () => {
    if (mode === 'select') return 'bg-[radial-gradient(circle,#00E5FF_0%,transparent_70%)]';
    if (mode === 'priority') return 'bg-[radial-gradient(circle,#00FF88_0%,transparent_70%)]';
    if (mode === 'balance') return 'bg-[radial-gradient(circle,#FFD700_0%,transparent_70%)]';
  };

  const selectMode = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === 'priority') {
      showBotMessage("Öncelik Kalkanı odasına girildi. Önce parantezleri, sonra çarpma/bölmeyi çözmelisin.", "info");
    } else if (newMode === 'balance') {
      showBotMessage("Kuantum Terazisi odasına girildi. Eşitliğin sağlandığından emin olmak için aynı enerjiyi yükle.", "info");
    } else {
      showBotMessage("Ana laboratuvar koridoruna dönüldü. Başka bir simülasyon seç.", "info");
    }
  };

  const handlePriorityWin = () => {
    setPriorityMastered(true);
    unlockAtom('G5.2.2.1');
    showBotMessage("Kalkanlar başarıyla indirildi. İşlem önceliği kurallarını çok iyi kavradın.", "success");
    setTimeout(() => selectMode('select'), 3000);
  };

  const handleBalanceWin = () => {
    setBalanceMastered(true);
    unlockAtom('G5.2.1.1');
    showBotMessage("Terazi mükemmel dengede. Eşitlik korunumu ilkesini başarıyla çözdün.", "success");
    setTimeout(() => selectMode('select'), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-mono flex flex-col w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute w-[100vw] h-[100vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 transition-colors duration-1000 ${getBgClass()}`} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <header className="px-8 py-6 flex items-center justify-between z-10 relative border-b border-gray-800/50 bg-[#050510]/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link to="/" className="w-12 h-12 bg-[#12121A] rounded-2xl flex items-center justify-center border border-gray-800 hover:border-[#00E5FF] transition-colors group">
            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-[#00E5FF] transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              ALGORİTMİK <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00FF88]">DENKLEM LAB</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {mode !== 'select' && (
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => selectMode('select')}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all hover:bg-gray-800 ${
                  mode === 'priority' 
                    ? 'border-[#00FF88]/30 text-[#00FF88]'
                    : 'border-[#FFD700]/30 text-[#FFD700]'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5" />
                <span className="font-bold tracking-widest text-sm uppercase">
                  ANA KORİDORA DÖN
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full mb-24">
        <AnimatePresence mode="wait">
          {mode === 'select' && (
            <motion.div 
               key="select-mode" 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-5xl"
            >
               <div className="text-center mb-16">
                 <h2 className="text-4xl font-black text-white mb-4 tracking-widest">BİR DENEY ODASI SEÇ</h2>
                 <p className="text-gray-400 text-lg">Denklemlerin gizemini çözmek ve laboratuvar başarısını tamamlamak için iki odadaki simülasyonları da bitirmelisin.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <button 
                   onClick={() => selectMode('priority')}
                   className="relative group bg-[#12121A] border border-gray-800 hover:border-[#00FF88] rounded-3xl p-10 overflow-hidden transition-all text-left flex flex-col"
                 >
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF88]/5 rounded-full blur-3xl group-hover:bg-[#00FF88]/10 transition-colors"></div>
                   
                   <div className="flex justify-between items-start w-full mb-8 relative z-10">
                      <div className="w-20 h-20 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="w-10 h-10 text-[#00FF88]" />
                      </div>
                      <div className="flex items-center gap-2">
                        {priorityMastered ? <CheckCircle className="w-6 h-6 text-[#00FF88]" /> : <Fingerprint className="w-6 h-6 text-gray-700" />}
                        <span className={`text-sm font-bold uppercase tracking-widest ${priorityMastered ? 'text-[#00FF88]' : 'text-gray-600'}`}>
                           {priorityMastered ? 'MÜHÜR ALINDI' : 'KİLİTLİ'}
                        </span>
                      </div>
                   </div>
                   
                   <h3 className="text-3xl font-black text-white mb-3 tracking-wider relative z-10 group-hover:text-[#00FF88] transition-colors">ÖNCELİK KALKANI</h3>
                   <p className="text-gray-400 font-medium leading-relaxed relative z-10 flex-1">
                     Bir denklemi sadeleştirmek, işlem kurallarını gerektirir. Parantez, çarpma ve bölme güvenlik kalkanlarını hackleyerek enerji çekirdeğine ulaş.
                   </p>
                 </button>

                 <button 
                   onClick={() => selectMode('balance')}
                   className="relative group bg-[#12121A] border border-gray-800 hover:border-[#FFD700] rounded-3xl p-10 overflow-hidden transition-all text-left flex flex-col"
                 >
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl group-hover:bg-[#FFD700]/10 transition-colors"></div>
                   
                   <div className="flex justify-between items-start w-full mb-8 relative z-10">
                      <div className="w-20 h-20 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Scale className="w-10 h-10 text-[#FFD700]" />
                      </div>
                      <div className="flex items-center gap-2">
                        {balanceMastered ? <CheckCircle className="w-6 h-6 text-[#FFD700]" /> : <Fingerprint className="w-6 h-6 text-gray-700" />}
                        <span className={`text-sm font-bold uppercase tracking-widest ${balanceMastered ? 'text-[#FFD700]' : 'text-gray-600'}`}>
                           {balanceMastered ? 'MÜHÜR ALINDI' : 'KİLİTLİ'}
                        </span>
                      </div>
                   </div>
                   
                   <h3 className="text-3xl font-black text-white mb-3 tracking-wider relative z-10 group-hover:text-[#FFD700] transition-colors">KUANTUM TERAZİSİ</h3>
                   <p className="text-gray-400 font-medium leading-relaxed relative z-10 flex-1">
                     Kuantum tepsisindeki bilinmeyeni bul. Eşitliğin korunumu yasasını baz alarak iki enerji kefesini dengele ve simetriyi kusursuz kur.
                   </p>
                 </button>
               </div>
            </motion.div>
          )}

          {mode === 'priority' && (
            <PrioritySimulator key="priority" onWin={handlePriorityWin} showBotMessage={showBotMessage} />
          )}
          {mode === 'balance' && (
            <BalanceSimulator key="balance" onWin={handleBalanceWin} showBotMessage={showBotMessage} />
          )}
        </AnimatePresence>
      </main>

      <AstroBot message={botMessage} />
    </div>
  );
}

function PrioritySimulator({ onWin, showBotMessage }: { onWin: () => void, showBotMessage: (msg: string, type?: BotMessageType) => void }) {
  const [successCount, setSuccessCount] = useState(0);
  
  const generateOptions = (correct: number) => {
    const opts = [correct, correct + Math.floor(Math.random() * 4) + 1, Math.max(1, correct - Math.floor(Math.random() * 3) - 1)];
    return opts.sort(() => Math.random() - 0.5);
  };

  const generatePriorityLevels = () => {
    return [
      (() => {
        const A = Math.floor(Math.random() * 10) + 5;
        const B = Math.floor(Math.random() * 5) + 2;
        const C = Math.floor(Math.random() * 5) + 2;
        const s1 = B * C;
        const f = A + s1;
        const opts = [s1, s1 + Math.floor(Math.random() * 4) + 1, Math.max(1, s1 - Math.floor(Math.random() * 3) - 1)].sort(() => Math.random() - 0.5);
        const fOpts = [f, f + Math.floor(Math.random() * 5) + 1, Math.max(1, f - Math.floor(Math.random() * 5) - 1)].sort(() => Math.random() - 0.5);
        return { id: 1, prefix: `${A} + `, targetStr: `(${B} x ${C})`, suffix: "", correctAnswer: s1, options: opts, nextPrefix: "", nextTargetStr: `${A} + ${s1}`, nextSuffix: "", finalAnswer: f, finalOptions: fOpts };
      })(),
      (() => {
        const C = Math.floor(Math.random() * 4) + 2;
        const s1 = Math.floor(Math.random() * 5) + 3;
        const B = C * s1;
        const A = s1 + Math.floor(Math.random() * 10) + 5;
        const D = Math.floor(Math.random() * 5) + 2;
        const f = A - s1 + D;
        const opts = [s1, s1 + Math.floor(Math.random() * 4) + 1, Math.max(1, s1 - Math.floor(Math.random() * 3) - 1)].sort(() => Math.random() - 0.5);
        const fOpts = [f, f + Math.floor(Math.random() * 4) + 1, Math.max(1, f - Math.floor(Math.random() * 4) - 1)].sort(() => Math.random() - 0.5);
        return { id: 2, prefix: `${A} - `, targetStr: `(${B} / ${C})`, suffix: ` + ${D}`, correctAnswer: s1, options: opts, nextPrefix: "", nextTargetStr: `${A} - ${s1}`, nextSuffix: ` + ${D}`, finalAnswer: f, finalOptions: fOpts };
      })(),
      (() => {
        const A = Math.floor(Math.random() * 8) + 2;
        const B = Math.floor(Math.random() * 8) + 2;
        const C = Math.floor(Math.random() * 4) + 2;
        const s1 = A + B;
        const f = s1 * C;
        const opts = [s1, s1 + Math.floor(Math.random() * 4) + 1, Math.max(1, s1 - Math.floor(Math.random() * 3) - 1)].sort(() => Math.random() - 0.5);
        const fOpts = [f, f + Math.floor(Math.random() * 6) + 1, Math.max(1, f - Math.floor(Math.random() * 6) - 1)].sort(() => Math.random() - 0.5);
        return { id: 3, prefix: "", targetStr: `(${A} + ${B})`, suffix: ` x ${C}`, correctAnswer: s1, options: opts, nextPrefix: "", nextTargetStr: `${s1} x ${C}`, nextSuffix: "", finalAnswer: f, finalOptions: fOpts };
      })()
    ];
  };

  const [levels, setLevels] = useState(generatePriorityLevels);
  const [activeLevel, setActiveLevel] = useState(levels[0]);
  const [stage, setStage] = useState<'breaking_shield' | 'entering_code' | 'shield_broken' | 'final_code'>('breaking_shield');
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSelectCode = (val: number) => {
    if (stage === 'entering_code') {
      if (val === activeLevel.correctAnswer) {
        setStage('shield_broken');
        showBotMessage("Kalkan kırıldı! Öncelikli işlem başarıyla çözüldü. Şimdi kalan denklemi bağla.", "success");
      } else {
        triggerShake();
        showBotMessage("Hatalı işlem şifresi! Kalkan direniyor, doğru hesapla.", "error");
      }
    } else if (stage === 'final_code') {
      if (val === activeLevel.finalAnswer) {
        showBotMessage("Görev tamam! Denklem deşifre edildi.", "success");
        setTimeout(() => {
          const nextCount = successCount + 1;
          setSuccessCount(nextCount);
          if (nextCount >= levels.length) {
            onWin();
          } else {
            setActiveLevel(levels[nextCount]);
            setStage('breaking_shield');
          }
        }, 1500);
      } else {
         triggerShake();
         showBotMessage("Sonuç hatalı. İşlemi tekrar kontrol et.", "error");
      }
    }
  };

  const handleTargetClick = () => {
    if (stage === 'breaking_shield') {
      setStage('entering_code');
      showBotMessage("Öncelikli kalkan hedeflendi. Kalkanı kırmak için içerideki işlemin sonucunu (ŞİFRE) gir.", "info");
    } else if (stage === 'shield_broken') {
      setStage('final_code');
      showBotMessage("Son aşama! Ana enerji çekirdeğini kırmak için denklemin sonucunu gir.", "info");
    }
  };

  if (successCount >= levels.length) {
    return (
      <ModuleCompletedScreen
        title="KALKANLAR İNDİRİLDİ"
        message="İşlem önceliği kalkanlarını kusursuz bir şekilde aştın. Kazanım mührü senin!"
        scoreEarned={50}
        onRestart={() => {
          const newLevels = generatePriorityLevels();
          setLevels(newLevels);
          setSuccessCount(0); 
          setStage('breaking_shield'); 
          setActiveLevel(newLevels[0]);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2 tracking-widest">ÖNCELİK KALKANI</h2>
        <p className="text-gray-400">Hedef kalkanı seç, işlemi hesapla, şifreyi gir ve çekirdeğe ulaş.</p>
      </div>
      
      <div className="flex gap-2 mb-12">
        {levels.map((_, i) => (
          <div key={i} className={`w-12 h-3 rounded-full transition-colors duration-500 ${i < successCount ? 'bg-[#00FF88] shadow-[0_0_10px_#00FF88]' : 'bg-gray-800'}`} />
        ))}
      </div>

      <motion.div 
         animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
         transition={{ duration: 0.4 }}
         className="bg-[#12121A] border border-[#2A2A35] py-20 px-12 rounded-3xl shadow-2xl min-h-[300px] w-full max-w-4xl flex flex-col items-center justify-center gap-8"
      >
        <div className="flex items-center justify-center gap-4 text-5xl font-black text-white select-none">
          {stage === 'breaking_shield' || stage === 'entering_code' ? (
             <>
               {activeLevel.prefix && <span className="text-gray-400 opacity-60">{activeLevel.prefix}</span>}
               <button 
                 onClick={handleTargetClick}
                 className={`relative group transition-all duration-300 ${stage === 'entering_code' ? 'scale-110' : 'hover:scale-105'}`}
               >
                 <div className={`absolute inset-0 bg-[#00FF88] blur-xl transition-opacity duration-300 ${stage === 'entering_code' ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'}`}></div>
                 <div className={`px-6 py-4 bg-[#1F2833] border-4 border-dashed rounded-2xl flex items-center gap-3 relative z-10 transition-colors ${stage === 'entering_code' ? 'border-[#00FF88] text-[#00FF88]' : 'border-[#00FF88]/50 text-[#00FF88]/80'}`}>
                   <Shield className={`w-8 h-8 ${stage === 'entering_code' ? 'animate-pulse' : ''}`} />
                   {activeLevel.targetStr}
                 </div>
               </button>
               {activeLevel.suffix && <span className="text-gray-400 opacity-60">{activeLevel.suffix}</span>}
             </>
          ) : (
             <>
               {activeLevel.nextPrefix && <span className="text-gray-400 opacity-60">{activeLevel.nextPrefix}</span>}
               <button 
                 onClick={handleTargetClick}
                 className={`relative group transition-all duration-300 ${stage === 'final_code' ? 'scale-110' : 'hover:scale-105'}`}
               >
                 <div className={`absolute inset-0 bg-[#00FF88] blur-xl transition-opacity duration-300 ${stage === 'final_code' ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'}`}></div>
                 <div className={`px-6 py-4 bg-[#1F2833] border-4 rounded-2xl flex items-center gap-3 relative z-10 transition-colors ${stage === 'final_code' ? 'border-[#00FF88] text-[#00FF88]' : 'border-[#00FF88]/50 text-[#00FF88]/80'}`}>
                   <Zap className={`w-8 h-8 ${stage === 'final_code' ? 'animate-pulse' : ''}`} />
                   {activeLevel.nextTargetStr}
                 </div>
               </button>
               {activeLevel.nextSuffix && <span className="text-gray-400 opacity-60">{activeLevel.nextSuffix}</span>}
             </>
          )}
        </div>

        {/* Interaction Panel */}
        <div className="h-24 mt-8 flex items-center justify-center w-full">
           <AnimatePresence mode="wait">
             {stage === 'breaking_shield' || stage === 'shield_broken' ? (
                <motion.div 
                  key="hint"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="text-gray-500 font-bold uppercase tracking-widest text-lg flex items-center gap-2"
                >
                  <ArrowLeftRight className="w-5 h-5 text-[#00E5FF] animate-bounce" />
                  Hedefe Tıkla ve Şifre Panelini Aç
                </motion.div>
             ) : (
                <motion.div 
                  key="options"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <div className="text-[#00FF88] font-bold tracking-widest text-sm uppercase">Kodu Deşifre Et (İşlem Sonucu)</div>
                  <div className="flex gap-6">
                    {(stage === 'entering_code' ? activeLevel.options : activeLevel.finalOptions).map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectCode(opt)}
                        className="w-20 h-20 bg-[#1F2833] border-2 border-gray-600 rounded-2xl text-3xl font-black text-white hover:border-[#00FF88] hover:bg-[#00FF88]/10 transition-all shadow-lg"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


function BalanceSimulator({ onWin, showBotMessage }: { onWin: () => void, showBotMessage: (msg: string, type?: BotMessageType) => void }) {
  const [successCount, setSuccessCount] = useState(0);
  const [leftWeight, setLeftWeight] = useState(15);
  const [rightWeight, setRightWeight] = useState(10);
  
  const generateBalanceLevels = () => [
    { left: Math.floor(Math.random() * 15) + 10, right: Math.floor(Math.random() * 8) + 5 },
    { left: Math.floor(Math.random() * 15) + 15, right: Math.floor(Math.random() * 10) + 15 },
    { left: Math.floor(Math.random() * 10) + 5, right: Math.floor(Math.random() * 8) + 10 }
  ].map(l => {
     if(l.left === l.right) l.left += 2; // prevent accidentally starting equal
     return l;
  });

  const [levels, setLevels] = useState(generateBalanceLevels);

  const startLevel = (lvl: number) => {
    if (lvl < levels.length) {
      setLeftWeight(levels[lvl].left);
      setRightWeight(levels[lvl].right);
    }
  };

  useEffect(() => {
    startLevel(successCount);
  }, [successCount]);

  const addWeight = (val: number) => {
    setRightWeight(prev => {
      const newVal = prev + val;
      return newVal < 0 ? 0 : newVal;
    });
  };

  const checkBalance = () => {
    if (leftWeight === rightWeight) {
      showBotMessage("MÜKEMMEL DENGE! İki tarafın enerjisi de birbirine eşitlendi.", "success");
      setTimeout(() => {
        const nextCount = successCount + 1;
        setSuccessCount(nextCount);
        if (nextCount >= levels.length) {
          onWin();
        } else {
          showBotMessage("Terazi sıfırlanıyor. Yeni denge bozukluğu tespit edildi! Sol taraf kilitli, sağ tarafı sen eşitle.", "info");
        }
      }, 2000);
    } else {
      showBotMessage(`Dengesizlik Tespit Edildi! Sol: ${leftWeight}, Sağ: ${rightWeight}. Mavi kefe üzerinden işlem yaparak sarı ile eşitlemelisin!`, "error");
    }
  };

  if (successCount >= levels.length) {
    return (
      <ModuleCompletedScreen
        title="MÜKEMMEL DENGE"
        message="Eşitlik kurallarını kusursuz uygulayarak teraziyi dengeledin. Sistem çözüldü."
        scoreEarned={50}
        onRestart={() => {
          setLevels(generateBalanceLevels());
          setSuccessCount(0); 
        }}
      />
    );
  }

  // DIKKAT: Sağ daha ağırsa rotation pozitif (sağ kefe aşağı). Sol ağırsa rotation negatif (sol kefe aşağı).
  const diff = rightWeight - leftWeight;
  const rotation = Math.max(-20, Math.min(20, diff * 1.5));

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-2 tracking-widest">KUANTUM TERAZİSİ</h2>
        <p className="text-gray-400">Sol kefe kilitli (hedef). Enerji tuşlarıyla mavi (sağ) kefeyi eşitle.</p>
      </div>

      <div className="flex gap-3 mb-16">
        {levels.map((_, i) => (
           <div key={i} className={`w-12 h-3 rounded-full transition-colors duration-500 ${i < successCount ? 'bg-[#FFD700] shadow-[0_0_10px_#FFD700]' : 'bg-gray-800'}`} />
        ))}
      </div>

      {/* Terazi Görseli */}
      <div className="relative w-full max-w-2xl h-80 flex flex-col items-center justify-end mb-16">
        {/* Hareketli Kol (Arm) */}
        <motion.div 
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 50, damping: 10, mass: 2 }}
          className="absolute top-16 w-3/4 max-w-[500px] h-4 bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 rounded-full flex justify-between z-10 shadow-lg origin-center"
        >
          {/* Sol Kefe İpi ve Tepsisi (Anti-rotation ile) */}
          <motion.div 
            animate={{ rotate: -rotation }}
            transition={{ type: "spring", stiffness: 50, damping: 10, mass: 2 }}
            className="absolute -left-10 w-28 h-28 origin-top flex items-end justify-center"
          >
            <div className="absolute top-2 w-1 h-20 bg-gray-600 -z-10 shadow-sm"></div>
            <div className="w-28 h-6 bg-gradient-to-b from-[#FFD700] to-[#B8860B] rounded-b-3xl border-t-4 border-yellow-300 flex items-end justify-center shadow-[0_10px_20px_rgba(255,215,0,0.3)] opacity-90">
               <div className="absolute bottom-6 flex flex-col-reverse items-center justify-end w-full px-2 gap-1 pb-1">
                 {/* Sabit kefe */}
                 <div className="text-3xl font-black text-white drop-shadow-md mb-2">{leftWeight}</div>
               </div>
               <div className="absolute -bottom-8 bg-[#12121A] text-[#FFD700] border border-[#FFD700] px-3 py-1 rounded-full text-xs font-bold tracking-widest shadow-[0_0_10px_rgba(255,215,0,0.3)]">KİLİTLİ</div>
            </div>
          </motion.div>

          <div className="w-6 h-6 bg-[#00E5FF] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_#00E5FF] z-20 border-4 border-gray-900"></div>
          
          {/* Sağ Kefe İpi ve Tepsisi (Anti-rotation ile) */}
          <motion.div 
            animate={{ rotate: -rotation }}
            transition={{ type: "spring", stiffness: 50, damping: 10, mass: 2 }}
            className="absolute -right-10 w-28 h-28 origin-top flex items-end justify-center"
          >
            <div className="absolute top-2 w-1 h-20 bg-gray-600 -z-10 shadow-sm"></div>
            <div className="w-28 h-6 bg-gradient-to-b from-[#00E5FF] to-[#008B8B] rounded-b-3xl border-t-4 border-cyan-300 flex items-end justify-center shadow-[0_10px_20px_rgba(0,229,255,0.3)]">
               <div className="absolute bottom-6 flex flex-col-reverse items-center justify-end w-full px-2 gap-1 pb-1">
                 <div className="text-3xl font-black text-white drop-shadow-md mb-2">{rightWeight}</div>
               </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Destek Ayağı */}
        <div className="w-12 h-64 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-xl z-0 relative shadow-2xl border-x border-gray-500/30">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-gray-900 rounded-t-2xl shadow-inner border-t-2 border-gray-700"></div>
        </div>
      </div>

      <div className="flex gap-16 w-full justify-center mt-4">
        {/* Sol Ekleme Paneli KALDIRILDI, butonların yerine simetri sağlasın diye boşluk bırakılabilir veya butonlar merkeze alınabilir */}
        
        <div className="flex items-center pb-3 pr-8 border-r border-[#1F2833]">
          <button 
            onClick={checkBalance} 
            className="px-10 py-5 bg-gradient-to-b from-white to-gray-300 text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            DENGE KONTROL
          </button>
        </div>

        {/* Sağ Ekleme Paneli */}
        <div className="flex flex-col gap-3 justify-center">
          <div className="text-[#00E5FF] font-bold mb-1 tracking-wider uppercase text-sm">ETKİLEŞİM PANELİ</div>
          <div className="flex gap-3">
            <button onClick={() => addWeight(-1)} disabled={rightWeight === 0} className="px-6 py-4 bg-[#12121A] border-2 border-gray-700 rounded-xl font-bold hover:bg-gray-800 hover:border-[#00E5FF] transition-colors disabled:opacity-30 disabled:pointer-events-none text-xl">-1</button>
            <button onClick={() => addWeight(1)} className="px-6 py-4 bg-[#12121A] border-2 border-gray-700 rounded-xl font-bold hover:bg-[#00E5FF]/20 hover:border-[#00E5FF] transition-colors text-xl">+1</button>
            <button onClick={() => addWeight(5)} className="px-6 py-4 bg-[#12121A] border-2 border-gray-700 rounded-xl font-bold hover:bg-[#00E5FF]/20 hover:border-[#00E5FF] transition-colors text-xl">+5</button>
          </div>
        </div>
      </div>
    </div>
  );
}
