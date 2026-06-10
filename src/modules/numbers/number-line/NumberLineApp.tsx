import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowLeftCircle, CheckCircle2, RotateCcw, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import Bot, { BotState } from '../../../components/characters/Bot';
import { createNumberLineTask, NUMBER_LINE_MAX_NUMBER } from './numberLineTask';

export default function NumberLineApp() {
  const navigate = useNavigate();
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();
  
  const [task, setTask] = useState(() => createNumberLineTask());
  const [position, setPosition] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [botState, setBotState] = useState<BotState>('idle');
  const [facing, setFacing] = useState<1 | -1>(1);
  
  const { startNum, jumpNum, targetNum } = task;
  const maxNumber = NUMBER_LINE_MAX_NUMBER;
  const numbers = Array.from({ length: maxNumber + 1 }, (_, i) => i);

  useEffect(() => {
    if (phase === 1 && position === startNum && botState === 'idle') {
      setTimeout(() => setPhase(2), 600);
    } else if (phase === 2 && position === targetNum && botState === 'idle') {
      setTimeout(() => {
        setPhase(3);
        setShowSuccess(true);
        unlockAtom("MAT.1.1.5.1");
        unlockAtom("MAT.1.2.1.1");
        addScore(50);
      }, 600);
    }
  }, [position, phase, botState, startNum, targetNum, unlockAtom, addScore]);

  const restartGame = () => {
    setTask((currentTask) => createNumberLineTask(currentTask));
    setPosition(0);
    setPhase(1);
    setShowSuccess(false);
    setBotState('idle');
    setFacing(1);
  };

  const handleJump = (dir: number) => {
    if (botState !== 'idle') return;
    setFacing(dir as 1 | -1);
    setBotState('jumping');
    setPosition(p => Math.max(0, Math.min(maxNumber, p + dir)));
    setTimeout(() => setBotState('idle'), 400); // Animasyon süresi kadar bekle
  };

  const handleRunToTarget = () => {
    if (position === targetNum || botState !== 'idle') return;
    const dir = targetNum > position ? 1 : -1;
    setFacing(dir);
    setBotState('running');
    
    let currentPos = position;
    const interval = setInterval(() => {
      currentPos += dir;
      setPosition(currentPos);
      
      if (currentPos === targetNum) {
        clearInterval(interval);
        setTimeout(() => setBotState('idle'), 300);
      }
    }, 250);
  };

  // Klavye kontrolleri (Sağ/Sol Ok Tuşları)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 3 || botState !== 'idle') return;
      
      if (e.key === 'ArrowRight' && position < maxNumber) {
        handleJump(1);
      } else if (e.key === 'ArrowLeft' && position > 0) {
        handleJump(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, botState, position, maxNumber]);

  // Hedef sayıyı belirle (yanıp sönmesi için)
  const currentTarget = phase === 1 ? startNum : (phase === 2 ? targetNum : null);

  return (
    <div className="h-full bg-[#0B0C10] text-white font-sans flex flex-col w-full relative overflow-x-hidden overflow-y-auto">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F2833_1px,transparent_1px),linear-gradient(to_bottom,#1F2833_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5FF] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B388FF] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse pointer-events-none" />

      {/* Header */}
      <header className="px-4 py-3 md:p-5 border-b border-gray-800/50 bg-[#0B0C10]/70 backdrop-blur-md flex items-center gap-3 md:gap-4 relative z-30">
        <button onClick={() => navigate('/')} className="min-h-11 min-w-11 p-2 hover:bg-gray-800 rounded-xl transition-colors flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-[#00E5FF] flex items-center gap-2 leading-tight">
            <Sparkles className="w-5 h-5 shrink-0" /> Sayı Doğrusunda İlerleme
          </h1>
          <p className="text-xs md:text-sm text-gray-400">İlkokul 1. Sınıf • Toplama İşlemi</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3 px-4 py-3 md:px-8 md:py-5 relative z-20">
        
        {/* Instruction Card (Floating Animation) */}
        <motion.div 
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-gradient-to-b from-[#1F2833] to-[#121212] px-5 py-4 md:px-7 md:py-5 rounded-2xl md:rounded-3xl border border-gray-700/50 max-w-xl w-full text-center shadow-[0_14px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Card inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-[#B388FF]/5 pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-2 relative z-10 leading-tight">
            {phase === 1 && <span className="text-white">Robotu <span className="text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">{startNum}</span> noktasına götür.</span>}
            {phase === 2 && <span className="text-white">Şimdi <span className="text-[#B388FF] drop-shadow-[0_0_10px_rgba(179,136,255,0.8)]">{jumpNum} adım</span> ileri zıpla!</span>}
            {phase === 3 && <span className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">Harika! {startNum} + {jumpNum} = {targetNum} eder!</span>}
          </h2>
          <p className="text-gray-400 text-sm md:text-base relative z-10 leading-snug">
            {phase === 1 && "Sayı doğrusunda başlangıç noktasını bulalım."}
            {phase === 2 && "Toplama işlemi ileriye doğru saymaktır."}
            {phase === 3 && "Görev tamamlandı, atomlar kazanıldı!"}
          </p>
        </motion.div>

        {/* Number Line Area */}
        <div className="w-full max-w-5xl relative h-32 md:h-40 flex items-center">
          
          {/* The Main Line (Glowing) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-gray-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-gray-700">
            {/* Progress fill */}
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/50 rounded-full"
              animate={{ width: `${(position / maxNumber) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          
          {/* Ticks and Numbers (Nodes) */}
          {numbers.map((num) => {
            const isTarget = num === currentTarget;
            const isPassed = num <= position;
            
            return (
              <div 
                key={num} 
                className="absolute top-1/2 flex flex-col items-center"
                style={{ left: `${(num / maxNumber) * 100}%`, transform: 'translate(-50%, -12px)' }}
              >
                {/* Node (Lily pad / Platform) */}
                <div className="relative flex items-center justify-center mb-4">
                  <motion.div 
                    className={`w-6 h-6 rounded-full border-4 z-0 transition-colors duration-300 ${
                      isTarget 
                        ? 'border-[#00E5FF] bg-[#00E5FF]/20 shadow-[0_0_20px_#00E5FF]' 
                        : isPassed 
                          ? 'border-[#00E5FF]/50 bg-[#0B0C10]' 
                          : 'border-gray-700 bg-[#0B0C10]'
                    }`}
                    animate={isTarget ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
                    transition={isTarget ? { duration: 1.5, repeat: Infinity } : {}}
                  />
                  {/* Small inner dot */}
                  <div className={`absolute w-1.5 h-1.5 rounded-full ${isPassed ? 'bg-[#00E5FF]' : 'bg-gray-600'}`} />
                </div>

                {/* Number Text */}
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  num === position 
                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-125' 
                    : isTarget
                      ? 'text-[#00E5FF]'
                      : 'text-gray-500'
                }`}>
                  {num}
                </span>
              </div>
            );
          })}

          {/* The Bot / Character */}
          <motion.div 
            className="absolute top-1/2 -mt-[68px] md:-mt-[84px] z-20"
            initial={false}
            animate={{ 
              left: `${(position / maxNumber) * 100}%`,
              x: "-50%",
              y: botState === 'jumping' ? [0, -60, 0] : botState === 'running' ? [0, -15, 0] : 0,
            }}
            transition={{ 
              left: { type: "spring", stiffness: botState === 'running' ? 400 : 300, damping: botState === 'running' ? 25 : 25 },
              y: { duration: botState === 'running' ? 0.25 : 0.4, ease: "easeOut" }
            }}
          >
            <Bot state={botState} direction={facing} />
          </motion.div>
        </div>

        {/* Controls (Game Buttons) */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 z-20">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => handleJump(-1)}
            disabled={position === 0 || phase === 3 || botState !== 'idle'}
            className="min-h-12 flex items-center gap-2 md:gap-3 px-5 md:px-6 py-3 md:py-4 bg-[#1F2833] hover:bg-[#2A3645] border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-base md:text-lg font-bold transition-colors shadow-lg"
          >
            <ArrowLeftCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            <span className="text-gray-200">-1 Zıpla</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => handleJump(1)}
            disabled={position === maxNumber || phase === 3 || botState !== 'idle'}
            className="min-h-12 flex items-center gap-2 md:gap-3 px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-[#00E5FF] to-[#00B8CC] hover:from-[#33EAFF] hover:to-[#00D4EB] text-[#0B0C10] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-base md:text-lg font-bold transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]"
          >
            <span className="drop-shadow-sm">+1 Zıpla</span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          {phase === 2 && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 2 }}
              onClick={handleRunToTarget}
              disabled={position === targetNum || botState !== 'idle'}
              className="min-h-12 flex items-center gap-2 md:gap-3 px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-[#B388FF] to-[#8C52FF] hover:from-[#C4A1FF] hover:to-[#9D6BFF] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-base md:text-lg font-bold transition-all shadow-[0_0_20px_rgba(179,136,255,0.4)]"
            >
              <span className="drop-shadow-sm">Hedefe Koş</span>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          )}
        </div>

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
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-gradient-to-b from-[#1F2833] to-[#121212] p-4 md:p-5 rounded-3xl md:rounded-[2.5rem] max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto w-full border border-gray-700 text-center shadow-[0_0_100px_rgba(0,229,255,0.2)] relative"
            >
              {/* Confetti/Glow background */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-green-500/20 to-transparent pointer-events-none" />

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(74,222,128,0.4)]"
              >
                <CheckCircle2 className="w-9 h-9 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Harika İş!</h2>
              <p className="text-gray-400 mb-3 text-sm md:text-base leading-snug">Toplama işleminin ileriye doğru saymak olduğunu kanıtladın.</p>
              
              <div className="bg-[#0B0C10]/80 rounded-2xl p-3 md:p-4 mb-3 text-left border border-gray-800">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" /> Kazanılan Atomlar
                </h3>
                <div className="space-y-2">
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">MAT.1.1.5.1</div>
                      <div className="text-xs text-gray-400">İleri Ritmik Sayma</div>
                    </div>
                  </motion.div>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">MAT.1.2.1.1</div>
                      <div className="text-xs text-gray-400">Miktarın Artması</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartGame}
                className="mb-2 flex w-full min-h-11 items-center justify-center gap-2 py-2.5 md:py-3 bg-gradient-to-r from-[#00E5FF] to-[#B388FF] text-[#0B0C10] font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] transition-all"
              >
                <RotateCcw className="h-5 w-5" />
                Tekrar Oyna
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
                className="w-full min-h-11 py-2.5 md:py-3 bg-white/8 text-white font-bold text-base rounded-2xl border border-white/10 hover:bg-white/12 transition-all"
              >
                Laboratuvardan Çık
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
