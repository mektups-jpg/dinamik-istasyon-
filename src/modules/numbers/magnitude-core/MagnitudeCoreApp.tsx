import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAtomStore } from '../../../store/useAtomStore';
import { ArrowLeftRight, Database, Dices, ChevronLeft, Hexagon, Zap, Award, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Bot from '../../../components/characters/Bot';

// Modlar: "macro" (Milyonlar), "micro" (Olasılık)
type Mode = 'macro' | 'micro';

export type BotMessageType = 'info' | 'success' | 'error';
export interface BotMessage {
  text: string;
  type: BotMessageType;
  id: number;
}

export default function MagnitudeCoreApp() {
  const [mode, setMode] = useState<Mode>('macro');
  const { unlockAtom, unlockModule } = useAtomStore();

  const [macroMastered, setMacroMastered] = useState(false);
  const [microMastered, setMicroMastered] = useState(false);

  useEffect(() => {
    if (macroMastered && microMastered) {
      unlockModule('magnitude-core');
    }
  }, [macroMastered, microMastered, unlockModule]);
  const [botMessage, setBotMessage] = useState<BotMessage>({
    text: "Devasa Nicelik Çekirdeği'ne hoş geldin. Büyük sayıları rahat okuyabilmek için, rakamları sağdan sola doğru 3'erli gruplara ayırman gerekiyor. Biraz odaklanırsak bunu rahatça çözebiliriz.",
    type: 'info',
    id: 0
  });

  const showBotMessage = (text: string, type: BotMessageType = 'info') => {
    setBotMessage(prev => ({ text, type, id: prev.id + 1 }));
  };

  const toggleMode = () => {
    const newMode = mode === 'macro' ? 'micro' : 'macro';
    setMode(newMode);
    if (newMode === 'macro') {
      showBotMessage("Makro Evren aktif. Dev sayıları okumak dikkat gerektirir. Lazerleri sağdan sola doğru her 3 rakamda bir yerleştirmelisin.", "info");
    } else {
      showBotMessage("Mikro Evren'e geçiş yapıldı. Burada işler biraz daha kesin... ya da imkansız. Unutma, olasılık değeri daima 0 ile 1 arasındadır.", "info");
    }
  };

  const handleMacroWin = () => {
    setMacroMastered(true);
    unlockAtom('G5.NUM.010.1');
    showBotMessage("Tüm aşamalar tamamlandı. Milyonlarca basamağı hatasız bir şekilde çözümledin. Görünüşe göre dev sayılar senden biraz korkmaya başladı.", "success");
  };

  const handleMicroWin = () => {
    setMicroMastered(true);
    unlockAtom('G5.PROB.010.1');
    showBotMessage("Sistem çözüldü. İmkansız ile kesin olayları başarıyla ayırdın. Artık piyangoyu kazanma ihtimalini de kendin hesaplayabilirsin.", "success");
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-mono flex flex-col w-full h-full relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute w-[100vw] h-[100vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 transition-colors duration-1000 ${mode === 'macro' ? 'bg-[radial-gradient(circle,#00E5FF_0%,transparent_70%)]' : 'bg-[radial-gradient(circle,#B388FF_0%,transparent_70%)]'}`} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Top Header */}
      <header className="px-8 py-6 flex items-center justify-between z-10 relative border-b border-gray-800/50 bg-[#050510]/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link to="/" className="w-12 h-12 bg-[#12121A] rounded-2xl flex items-center justify-center border border-gray-800 hover:border-[#00E5FF] transition-colors group">
            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-[#00E5FF] transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              DEVASA NİCELİK <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#B388FF]">ÇEKİRDEĞİ</span>
            </h1>
            <p className="text-xs font-bold text-gray-500 tracking-[0.2em] min-h-[16px] mt-1">
              {(mode === 'macro' && macroMastered) ? '✅ KAZANIM: MAT.5.1.1 (MİLYONLAR)' : 
               (mode === 'micro' && microMastered) ? '✅ KAZANIM: MAT.5.6.1 (OLASILIK)' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMode}
            className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
              mode === 'macro' 
                ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                : 'bg-[#B388FF]/10 border-[#B388FF]/30 text-[#B388FF] shadow-[0_0_20px_rgba(179,136,255,0.2)]'
            }`}
          >
            {mode === 'macro' ? <Database className="w-5 h-5" /> : <Dices className="w-5 h-5" />}
            <span className="font-bold tracking-widest text-sm uppercase">
              {mode === 'macro' ? 'MAKRO MOD' : 'MİKRO MOD'}
            </span>
            <ArrowLeftRight className="w-4 h-4 ml-2 opacity-50" />
          </button>
        </div>
      </header>

      {/* Main Interface */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full mb-24">
        <AnimatePresence mode="wait">
          {mode === 'macro' ? (
            <MacroSimulator key="macro" onWin={handleMacroWin} showBotMessage={showBotMessage} />
          ) : (
            <MicroSimulator key="micro" onWin={handleMicroWin} showBotMessage={showBotMessage} />
          )}
        </AnimatePresence>
      </main>

      <AstroBot message={botMessage} />
    </div>
  );
}

// ----------------------------------------------------
// MAKRO MOD: İnteraktif Bölük Ayrıştırıcı
// ----------------------------------------------------
function MacroSimulator({ onWin, showBotMessage }: { onWin: () => void, showBotMessage: (msg: string, type?: BotMessageType) => void }) {
  const [targetNumber, setTargetNumber] = useState("145300999");
  const [lasers, setLasers] = useState<number[]>([]);
  const [isSliced, setIsSliced] = useState(false);
  const [error, setError] = useState(false);
  
  const [successCount, setSuccessCount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const initGame = () => {
    const lengths = [7, 8, 9];
    const len = lengths[Math.floor(Math.random() * lengths.length)];
    let numStr = (Math.floor(Math.random() * 9) + 1).toString();
    for (let i = 1; i < len; i++) {
      numStr += Math.floor(Math.random() * 10).toString();
    }
    setTargetNumber(numStr);
    setLasers([]);
    setIsSliced(false);
    setError(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const getCorrectGaps = () => {
    const len = targetNumber.length;
    const gaps = [];
    if (len > 3) gaps.push(len - 4); 
    if (len > 6) gaps.push(len - 7); 
    return gaps.sort();
  };

  const requiredLasers = getCorrectGaps().length;

  const toggleLaser = (idx: number) => {
    if (isSliced) return;
    setError(false);
    setLasers(prev => {
      if (prev.includes(idx)) return prev.filter(x => x !== idx);
      if (prev.length >= requiredLasers) {
        return [...prev.slice(1), idx];
      }
      return [...prev, idx];
    });
  };

  const handleSlice = () => {
    const correct = getCorrectGaps();
    const sortedLasers = [...lasers].sort();

    if (JSON.stringify(correct) === JSON.stringify(sortedLasers)) {
      setIsSliced(true);
      const newCount = successCount + 1;
      
      if (newCount >= 4) {
         showBotMessage("Son blok da parçalandı. Görevi başarıyla tamamladın.", "success");
      } else {
         showBotMessage(`Doğru ayırdın, bloklar uyum içinde parçalandı. Kalan aşama: ${4 - newCount}`, "success");
      }

      // Automatically prep next state but let user see result first via button click
    } else {
      setError(true);
      showBotMessage("İşlem başarısız. Sayıları bölüklere ayırırken daima sağdan (birler basamağından) başlamalı ve sola doğru 3'er saymalısın. Lazerleri yeniden ayarla.", "error");
      setTimeout(() => {
        setError(false);
        setLasers([]);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (successCount + 1 >= 4 && isSliced) {
      setSuccessCount(prev => prev + 1);
      setShowVictory(true);
      onWin();
    } else {
      setSuccessCount(prev => prev + 1);
      initGame();
    }
  };

  const getGroups = () => {
    const gaps = getCorrectGaps();
    if (gaps.length === 2) {
      return [
        { label: 'Milyonlar', val: targetNumber.slice(0, gaps[0] + 1), color: 'text-[#00E5FF]' },
        { label: 'Binler', val: targetNumber.slice(gaps[0] + 1, gaps[1] + 1), color: 'text-white' },
        { label: 'Birler', val: targetNumber.slice(gaps[1] + 1), color: 'text-gray-500' }
      ];
    } else if (gaps.length === 1) {
      return [
        { label: 'Binler', val: targetNumber.slice(0, gaps[0] + 1), color: 'text-white' },
        { label: 'Birler', val: targetNumber.slice(gaps[0] + 1), color: 'text-gray-500' }
      ];
    }
    return [];
  };

  if (showVictory) {
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-[#12121A] border border-[#00E5FF] rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.2)] max-w-2xl w-full text-center"
      >
        <Award className="w-32 h-32 text-[#00E5FF] mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(0,229,255,0.6)]" />
        <h2 className="text-4xl font-black text-white mb-4">SİSTEM ÇÖZÜLDÜ!</h2>
        <p className="text-lg text-[#00E5FF] font-bold tracking-widest mb-2 uppercase">Kazanım: MAT.5.1.1 Elde Edildi</p>
        <p className="text-gray-400 mb-10 text-lg">Bölükleri sağdan 3'er 3'er ayırma kuralını tamamen kavradın. Milyonlara kadar olan devasa sayılar artık senin için çok basit.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="bg-[#1F2833] text-white border border-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
            Lobiye Dön
          </Link>
          <button 
            onClick={() => { setShowVictory(false); setSuccessCount(0); initGame(); }}
            className="bg-[#00E5FF] text-[#050510] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Antrenmana Devam Et
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="w-full max-w-5xl flex flex-col items-center"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-white mb-4">Sayı Lazer Ayrıştırıcısı</h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Rakamların arasına tıklayarak lazerleri yerleştir. Sağdan 3'erli gruplar oluşturacak şekilde blokları parçalamalısın.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`w-12 h-2 rounded-full transition-all duration-500 ${i < successCount ? 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]' : 'bg-gray-800'}`} />
        ))}
      </div>
      <p className="text-xs font-bold text-gray-600 tracking-widest mb-8 uppercase">Aşama {successCount}/4</p>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: requiredLasers }).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < lasers.length ? 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]' : 'bg-gray-800'}`} />
        ))}
        <span className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-widest leading-none flex items-center">
          {lasers.length} / {requiredLasers} Lazer Aktif
        </span>
      </div>

      <div className={`bg-[#12121A] border ${error ? 'border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.3)]' : 'border-[#2A2A35]'} p-12 rounded-3xl w-full shadow-2xl relative overflow-hidden mb-8 transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center`}>
        <AnimatePresence>
          {error && <motion.div initial={{opacity:0}} animate={{opacity:0.2}} exit={{opacity:0}} className="absolute inset-0 bg-red-500 pointer-events-none" />}
          {isSliced && <motion.div initial={{opacity:0}} animate={{opacity:0.1}} exit={{opacity:0}} className="absolute inset-0 bg-[#00E5FF] pointer-events-none" />}
        </AnimatePresence>

        <div className="flex items-center justify-center relative z-10 w-full">
          {!isSliced ? (
            targetNumber.split('').map((digit, idx) => (
              <React.Fragment key={idx}>
                <div className="text-5xl md:text-8xl font-black tracking-tighter text-white cursor-default select-none transition-transform hover:scale-110">
                  {digit}
                </div>
                {idx < targetNumber.length - 1 && (
                  <div 
                    onClick={() => toggleLaser(idx)}
                    className="w-6 md:w-12 h-20 md:h-32 mx-1 flex justify-center items-center cursor-pointer group"
                  >
                    <div className={`w-1 transition-all duration-300 rounded-full ${
                      lasers.includes(idx) 
                        ? 'h-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]' 
                        : 'h-1/3 bg-gray-800 group-hover:h-2/3 group-hover:bg-[#00E5FF]/40'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <motion.div 
               initial={{ gap: "0rem" }}
               animate={{ gap: "2rem", md: { gap: "3rem" } } as any}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
               className="flex"
            >
              {getGroups().map((group, i) => (
                <div key={i} className="flex flex-col items-center">
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className={`text-[10px] md:text-xs uppercase font-bold tracking-widest mb-4 ${group.color}`}
                  >
                    {group.label} Bölüğü
                  </motion.span>
                  <div className={`text-5xl md:text-8xl font-black tracking-tighter ${group.color}`}>
                    {group.val}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {!isSliced ? (
          <button 
            onClick={handleSlice}
            disabled={lasers.length !== requiredLasers}
            className="bg-[#00E5FF] text-[#050510] disabled:bg-gray-800 disabled:text-gray-500 px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]"
          >
            <Zap className="w-6 h-6" /> Bölükleri Ayır
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="bg-[#12121A] text-white border border-[#00E5FF] px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:bg-[#00E5FF]/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
          >
            {successCount + 1 >= 4 ? 'Kazanımı Al ve Tamamla' : 'Sonraki Sinyale Geç'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// MİKRO MOD: Olasılık Düzlemi (0 ile 1 Arası)
// ----------------------------------------------------
type ProbabilityEvent = { id: string; subject: string; val: number; desc: string; errorMsg: string };

function MicroSimulator({ onWin, showBotMessage }: { onWin: () => void, showBotMessage: (msg: string, type?: BotMessageType) => void }) {
  const events: ProbabilityEvent[] = [
    { id: '1', subject: 'Bir insanın zıplayarak aya ulaşabilmesi', val: 0, desc: 'Yerçekimi kanunlarına aykırı, imkansız olay.', errorMsg: 'Hata. Fizik kurallarına göre insanların aya zıplayarak gitmesi imkansızdır. Dolayısıyla bu olayın olasılık değeri 0 olmalıdır.' },
    { id: '2', subject: 'Hilesiz bir zarı atınca "Yazı" gelmesi', val: 0, desc: 'Zarda yazı/tura yoktur, imkansız olay.', errorMsg: 'Yanlış eşleştirme. Bir zarda sadece sayılar bulunur. Yazı gelme ihtimali sıfırdır, tabii zarı çaktırmadan bir madeni parayla değiştirmediysen.' },
    { id: '3', subject: 'Hilesiz bir paranın havaya atılınca "Tura" gelmesi', val: 0.5, desc: 'Sadece iki ihtimal var (Yazı/Tura), şanslar eşit.', errorMsg: 'Dikkatli ol. Hilesiz bir parada yazı ve tura gelme ihtimali birbirine eşittir. Bu yüzden olasılık değeri 1/2 olmalıdır.' },
    { id: '4', subject: 'Güneşin her sabah doğudan doğması', val: 1, desc: 'Doğa kanunu gereği şaşmaz, kesin olay.', errorMsg: 'Hesaplama hatası. Güneşin doğmadan önce yön değiştirmeyeceğine göre bu kesin bir olaydır. Olasılık değeri 1 olmalıdır.' }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeEvent = events[activeIdx];
  const [success, setSuccess] = useState<boolean | null>(null);
  
  const [successCount, setSuccessCount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const startOver = () => {
    setActiveIdx(0);
    setSuccessCount(0);
    setSuccess(null);
  };

  const handleGuess = (guessVal: number) => {
    if (guessVal === activeEvent.val) {
      setSuccess(true);
      const newCount = successCount + 1;
      showBotMessage("Doğru tespit. Analiz başarıyla tamamlandı.", "success");
      
      setTimeout(() => {
        if (newCount >= 4) {
          setShowVictory(true);
          onWin();
        } else {
          setSuccessCount(newCount);
          setActiveIdx(prev => prev + 1);
          setSuccess(null);
          showBotMessage("Sıradaki veri yükleniyor. Lütfen ekrandaki yeni olayın ihtimalini değerlendir.", "info");
        }
      }, 2000);
    } else {
      setSuccess(false);
      showBotMessage(activeEvent.errorMsg, "error");
      setTimeout(() => setSuccess(null), 1500);
    }
  };

  if (showVictory) {
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-[#12121A] border border-[#B388FF] rounded-3xl shadow-[0_0_50px_rgba(179,136,255,0.2)] max-w-2xl w-full text-center"
      >
        <Award className="w-32 h-32 text-[#B388FF] mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(179,136,255,0.6)]" />
        <h2 className="text-4xl font-black text-white mb-4">SİSTEM ÇÖZÜLDÜ!</h2>
        <p className="text-lg text-[#B388FF] font-bold tracking-widest mb-2 uppercase">Kazanım: MAT.5.6.1 Elde Edildi</p>
        <p className="text-gray-400 mb-10 text-lg">İmkansız, kesin ve eşit olasılıkların doğasını anladın. Sadece 0 ile 1 arasına sıkışan koca bir evreni çözdün!</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="bg-[#1F2833] text-white border border-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
            Lobiye Dön
          </Link>
          <button 
            onClick={() => { setShowVictory(false); startOver(); }}
            className="bg-[#B388FF] text-[#050510] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(179,136,255,0.3)]"
          >
            Antrenmana Devam Et
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="w-full max-w-5xl flex flex-col items-center"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-4">Mikro Olasılık Düzlemi</h2>
        <p className="text-gray-400">Devasa sayılardan küçüldük. Olasılık sadece ve sadece 0 (İmkansız) ile 1 (Kesin) arasında yaşar!</p>
      </div>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`w-12 h-2 rounded-full transition-all duration-500 ${i < successCount ? 'bg-[#B388FF] shadow-[0_0_10px_#B388FF]' : 'bg-gray-800'}`} />
        ))}
      </div>
      <p className="text-xs font-bold text-gray-600 tracking-widest mb-12 uppercase">Aşama {successCount}/4</p>

      {/* Ekrandaki Olay */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeEvent.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="bg-[#12121A] border border-[#B388FF]/30 p-8 rounded-2xl mb-16 max-w-2xl w-full text-center shadow-[0_0_30px_rgba(179,136,255,0.1)] relative"
        >
          {success === true && (
            <div className="absolute -inset-1 bg-[#00FF88]/20 blur-xl rounded-2xl z-0 transition-opacity"></div>
          )}
          {success === false && (
            <div className="absolute -inset-1 bg-[#FF0055]/20 blur-xl rounded-2xl z-0 transition-opacity animate-pulse"></div>
          )}
          
          <Hexagon className="w-10 h-10 text-[#B388FF] mx-auto mb-4 relative z-10" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 relative z-10 leading-snug">{activeEvent.subject}</h3>
          
          {success === true && (
            <p className="text-[#00FF88] font-bold mt-4 relative z-10">{activeEvent.desc}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 0, 0.5, 1 Ölçeği */}
      <div className="relative w-full max-w-3xl h-2 bg-gray-800 rounded-full mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
          <button 
            disabled={success === true}
            onClick={() => handleGuess(0)}
            className="w-20 h-20 bg-[#1A1A24] rounded-full border-4 border-gray-700 flex flex-col items-center justify-center hover:border-[#FF0055] hover:shadow-[0_0_20px_rgba(255,0,85,0.3)] transition-all group disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="text-2xl font-black text-gray-400 group-hover:text-[#FF0055]">0</span>
            <span className="text-[10px] font-bold text-gray-600 group-hover:text-[#FF0055]">İMKANSIZ</span>
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
          <button 
            disabled={success === true}
            onClick={() => handleGuess(0.5)}
            className="w-20 h-20 bg-[#1A1A24] rounded-full border-4 border-gray-700 flex flex-col items-center justify-center hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all group disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="text-2xl font-black text-gray-400 group-hover:text-[#FFD700]">1/2</span>
            <span className="text-[10px] font-bold text-gray-600 group-hover:text-[#FFD700]">EŞİT ŞANS</span>
          </button>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          <button 
            disabled={success === true}
            onClick={() => handleGuess(1)}
            className="w-20 h-20 bg-[#1A1A24] rounded-full border-4 border-gray-700 flex flex-col items-center justify-center hover:border-[#00FF88] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all group disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="text-2xl font-black text-gray-400 group-hover:text-[#00FF88]">1</span>
            <span className="text-[10px] font-bold text-gray-600 group-hover:text-[#00FF88]">KESİN</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}


// --- ASTRO-BOT COMPONENT ---
function AstroBot({ message }: { message: BotMessage }) {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    setIsVisible(true);
  }, [message.id]);

  const colors = {
    info: 'border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
    success: 'border-[#00FF88]/50 shadow-[0_10px_30px_rgba(0,255,136,0.15)]',
    error: 'border-[#FF0055]/50 shadow-[0_10px_30px_rgba(255,0,85,0.15)]'
  };

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      className="fixed bottom-8 right-8 flex items-end gap-4 z-50 pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {message && isVisible && (
          <motion.div 
            key={message.id}
            initial={{ opacity: 0, scale: 0.8, y: 10, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={`bg-[#1F2833]/95 backdrop-blur-xl border text-white p-4 pt-6 rounded-2xl rounded-br-sm max-w-[340px] mb-8 relative pointer-events-auto flex items-start gap-3 ${colors[message.type]}`}
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-0.5 min-w-[20px]">
              {message.type === 'info' && <Info className="w-5 h-5 text-[#00E5FF]" />}
              {message.type === 'success' && <CheckCircle className="w-5 h-5 text-[#00FF88]" />}
              {message.type === 'error' && <AlertTriangle className="w-5 h-5 text-[#FF0055]" />}
            </div>
            <p className="text-sm font-medium leading-relaxed pr-1">{message.text}</p>
            <div className={`absolute -bottom-2 right-4 w-4 h-4 bg-[#1F2833] border-b border-r transform rotate-45 ${message.type === 'info' ? 'border-gray-700' : message.type === 'success' ? 'border-[#00FF88]/50' : 'border-[#FF0055]/50'}`}></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative pb-2">
        <Bot state="idle" direction={-1} />
      </div>
    </motion.div>
  );
}
