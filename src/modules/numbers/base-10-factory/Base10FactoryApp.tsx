import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Star, Sparkles, Cpu, Plus, Minus, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

export default function Base10FactoryApp() {
  const navigate = useNavigate();
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [targetNumber, setTargetNumber] = useState(24);
  const [tensCount, setTensCount] = useState(0);
  const [onesCount, setOnesCount] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Göreve başlarken rastgele bir sayı belirletelim
  useEffect(() => {
    generateNewTask();
  }, []);

  const generateNewTask = () => {
    // 11 ile 49 arası rastgele sayı
    const newTarget = Math.floor(Math.random() * 39) + 11;
    setTargetNumber(newTarget);
    setTensCount(0);
    setOnesCount(0);
    setPhase(2);
    setShowSuccess(false);
  };

  const handleStart = () => {
    setPhase(2);
  };

  const handleCheck = () => {
    if (tensCount * 10 + onesCount === targetNumber) {
      if (completedTasks + 1 >= 3) {
        // En az 3 soru bildikten sonra gerçek başarı ekranını gösteririz
        setPhase(4);
        setShowSuccess(true);
        unlockAtom("G1.NUM.003.1"); // Onluk ve birliklerine ayırır
        unlockAtom("G1.NUM.003.2"); // 10 birliğin 1 onluk ettiğini gösterir
        addScore(75 * 3); // 3 soruluk büyük puan
      } else {
        // Sadece geçiş efekti verip yeni sayıya geçeriz
        setCompletedTasks(prev => prev + 1);
        setPhase(3); // Ara geçiş ekranı veya efekti için
        setTimeout(() => {
          generateNewTask();
        }, 1500);
      }
    }
  };

  const currentTotal = tensCount * 10 + onesCount;
  const isCorrect = currentTotal === targetNumber;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white font-sans flex flex-col w-full h-full relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F2833_1px,transparent_1px),linear-gradient(to_bottom,#1F2833_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5FF] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B388FF] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse pointer-events-none" />

      {/* Header */}
      <header className="p-6 border-b border-gray-800/50 bg-[#0B0C10]/50 backdrop-blur-md flex items-center gap-4 relative z-30">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#B388FF] bg-clip-text text-transparent">
            <Cpu className="w-5 h-5 text-[#00E5FF]" /> Onluk Bozma Fabrikası
          </h1>
          <p className="text-sm text-gray-400">İlkokul 1 & 2. Sınıf • Basamak Değerleri</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-8 relative z-20">
        
        {/* Instruction Section */}
        {phase === 1 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-[#1F2833] to-[#121212] p-10 rounded-[2.5rem] max-w-lg w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-700 mt-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#00E5FF] to-[#B388FF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[#00E5FF]/20 shadow-[0_0_30px]">
              <Zap className="w-10 h-10 text-[#0B0C10]" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Enerji Ayrıştırıcıya Hoş Geldin!</h2>
            <p className="text-gray-400 text-lg mb-8">
              Bize ulaşan ham enerji bloklarını, dev onluk tüplere ve küçük birlik küplere ayırman gerekiyor. Hazır mısın?
            </p>
            <button 
              onClick={handleStart}
              className="w-full py-4 bg-[#00E5FF] hover:bg-[#66FCF1] text-[#0B0C10] font-bold text-xl rounded-2xl transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              Makineyi Çalıştır
            </button>
          </motion.div>
        )}

        {/* Game Area */}
        {(phase === 2 || phase === 3) && (
          <div className="w-full max-w-5xl flex flex-col gap-6">
            
            {/* Progress Indicator */}
            <div className="flex justify-center gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-12 h-3 rounded-full transition-all duration-500 ${
                    i < completedTasks ? 'bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]' : 
                    i === completedTasks ? 'bg-gray-700 animate-pulse' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>

            <div className="w-full flex gap-8 h-[600px] relative">
              {/* Transition Overlay (Phase 3) */}
            <AnimatePresence>
              {phase === 3 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 rounded-3xl flex items-center justify-center border border-[#00E5FF]/50 shadow-[0_0_50px_rgba(0,229,255,0.2)]"
                >
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-[#00E5FF]/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-16 h-16 text-[#00E5FF] animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-widest uppercase">Enerji İşlendi!</h2>
                    <p className="text-[#00E5FF] font-bold mt-2">Yeni batarya yükleniyor...</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left: Input Panel */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-1/3 flex flex-col items-center justify-center bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent" />
              <div className="text-[#00E5FF] font-bold text-lg mb-4 uppercase tracking-widest text-center">Gelen Ham Enerji</div>
              <div className="text-[8rem] font-black leading-none bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {targetNumber}
              </div>
              <div className="mt-8 flex gap-4 w-full">
                <div className="flex-1 bg-gray-900/50 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-gray-500 text-sm font-medium mb-1">Onlar</div>
                  <div className="text-2xl font-bold text-[#B388FF]">{Math.floor(targetNumber / 10)}</div>
                </div>
                <div className="flex-1 bg-gray-900/50 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-gray-500 text-sm font-medium mb-1">Birler</div>
                  <div className="text-2xl font-bold text-[#00E5FF]">{targetNumber % 10}</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Work Panel */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-2/3 flex flex-col bg-[#1F2833]/80 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Ayrıştırıcı Bölmesi</h3>
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 font-medium">Mevcut Yükleme:</div>
                  <div className={`text-2xl font-bold px-4 py-1 rounded-lg ${currentTotal > targetNumber ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-white'}`}>
                    {currentTotal}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex gap-8">
                
                {/* Tens Column */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="h-64 w-full bg-black/40 rounded-2xl border border-gray-800/80 p-4 shrink-0 flex flex-wrap gap-3 content-end justify-center mb-6 overflow-hidden">
                    <AnimatePresence>
                      {Array.from({ length: tensCount }).map((_, i) => (
                        <motion.div
                          key={`ten-${i}`}
                          initial={{ scale: 0, y: -20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-8 h-40 bg-gradient-to-t from-[#8C52FF] to-[#B388FF] rounded-md shadow-[0_0_15px_#8C52FF] relative overflow-hidden"
                        >
                          {/* Inner lines to look like 10 blocks */}
                          <div className="absolute inset-0 flex flex-col justify-evenly">
                            {Array.from({ length: 9 }).map((_, j) => (
                              <div key={j} className="w-full h-px bg-black/30" />
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex items-center justify-between w-full bg-[#121212] p-2 rounded-2xl border border-gray-700">
                    <button 
                      onClick={() => setTensCount(Math.max(0, tensCount - 1))}
                      className="w-12 h-12 flex items-center justify-center bg-gray-800 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-[#B388FF] font-bold text-2xl">{tensCount}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Onluk</span>
                    </div>
                    <button 
                      onClick={() => setTensCount(tensCount + 1)}
                      className="w-12 h-12 flex items-center justify-center bg-gray-800 hover:bg-[#B388FF]/20 hover:text-[#B388FF] rounded-xl transition-colors"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Ones Column */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="h-64 w-full bg-black/40 rounded-2xl border border-gray-800/80 p-4 shrink-0 flex flex-col flex-wrap-reverse gap-2 content-start justify-end mb-6 overflow-hidden">
                    <AnimatePresence>
                      {Array.from({ length: onesCount }).map((_, i) => (
                        <motion.div
                          key={`one-${i}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-8 h-8 shrink-0 bg-gradient-to-tr from-[#00B8CC] to-[#00E5FF] rounded-md shadow-[0_0_10px_#00E5FF] border border-[#00E5FF]/50"
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between w-full bg-[#121212] p-2 rounded-2xl border border-gray-700">
                    <button 
                      onClick={() => setOnesCount(Math.max(0, onesCount - 1))}
                      className="w-12 h-12 flex items-center justify-center bg-gray-800 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-[#00E5FF] font-bold text-2xl">{onesCount}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Birlik</span>
                    </div>
                    <button 
                      onClick={() => setOnesCount(Math.max(0, onesCount + 1))} // Don't limit to let them make 14 ones if they want, but usually up to 19 is fine. We let it be free.
                      className="w-12 h-12 flex items-center justify-center bg-gray-800 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] rounded-xl transition-colors"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handleCheck}
                  disabled={!isCorrect}
                  className={`w-full py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 transition-all ${
                    isCorrect 
                      ? 'bg-gradient-to-r from-[#00E5FF] to-[#33EAFF] text-[#0B0C10] hover:scale-[1.02] shadow-[0_0_30px_rgba(0,229,255,0.4)]'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Cpu className="w-6 h-6" /> Doğrula ve Sisteme Gönder
                </button>
              </div>

            </motion.div>
          </div>
          </div>
        )}

      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-[#1F2833] to-[#121212] p-10 rounded-[2.5rem] max-w-md w-full border border-gray-700 text-center shadow-[0_0_100px_rgba(0,229,255,0.2)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-[#B388FF]/20 to-transparent pointer-events-none" />

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-24 h-24 bg-gradient-to-br from-[#8C52FF] to-[#B388FF] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(179,136,255,0.4)]"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-3">Harika Kodlama!</h2>
              <p className="text-gray-400 mb-8 text-lg">3 adet enerji küpünü başarıyla ayrıştırdın ve fabrikanın çalışmasını sağladın!</p>
              
              <div className="bg-[#0B0C10]/80 rounded-2xl p-6 mb-8 text-left border border-gray-800">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B388FF]" /> Kazanılan Atomlar
                </h3>
                <div className="space-y-4">
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">G1.NUM.003.1</div>
                      <div className="text-xs text-gray-400">Onluk ve Birliğine Ayırma</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all"
                >
                  Kapat
                </button>
                <button 
                  onClick={() => {
                    setCompletedTasks(0);
                    generateNewTask();
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-[#00E5FF] to-[#33EAFF] text-[#0B0C10] font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all"
                >
                  Yeniden Oyna
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
