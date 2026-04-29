import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../../store/useGameStore';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { GameHeader } from '../../../components/ui/GameHeader';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { Anchor, BatteryWarning, Cpu, CircleCheckBig, Beaker, Waves } from 'lucide-react';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';

const ATOM_ID = 'MAT.9.2.3.1';
const MODULE_ID = 'equation-submarine';

type InteractionMode = 'intro' | 'multiply' | 'add' | 'solveX' | 'substitute' | 'completed' | 'finished';

type Level = {
  id: number;
  title: string;
  description: string;
  eq1: string;
  eq2: string;
  initialMode: InteractionMode;
  mulReq1?: number;
  mulReq2?: number;
  postMulEq1Str?: string;
  postMulEq2Str?: string;
  sumX: number;
  sumC: number;
  finalX: number;
  finalY: number;
};

const formatEquation = (a: number, b: number, c: number) => {
  let str = '';
  if (a === 1) str += 'x';
  else if (a === -1) str += '-x';
  else if (a !== 0) str += `${a}x`;

  if (b === 1) str += (str ? ' + ' : '') + 'y';
  else if (b === -1) str += (str ? ' - ' : '-') + 'y';
  else if (b > 0) str += (str ? ' + ' : '') + `${b}y`;
  else if (b < 0) str += (str ? ' - ' : '-') + `${Math.abs(b)}y`;

  str += ` = ${c}`;
  return str;
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const integerDraftPattern = /^-?\d*$/;
const integerPattern = /^-?\d+$/;

const parseIntegerInput = (value: string): number | null => {
  const trimmed = value.trim();
  if (!integerPattern.test(trimmed)) return null;
  return Number(trimmed);
};

const generateLevel = (stage: number): Level => {
  const finalX = randomInt(2, 6);
  const finalY = randomInt(2, 6);

  let a1 = randomInt(1, 4);
  let a2 = randomInt(1, 4);
  let b1 = 1, b2 = -1;
  let mulReq1 = 1, mulReq2 = 1;
  let title = '', description = '';

  if (stage === 1) {
    title = 'Aşama 1: Taraf Tarafa Yok Etme';
    description = "Reaktör sızdırıyor! Oksijen (x) ve Basınç (y) sistemlerini dengele. y değerlerini yok etmek için iki denklemi taraf tarafa topla.";
    const bAbs = randomInt(1, 4);
    b1 = bAbs;
    b2 = -bAbs;
  } else if (stage === 2) {
    title = 'Aşama 2: Katsayı Dengeleme';
    description = "Kalkanlar çöküyor! y değerlerini yok etmek için tek bir denklemi hangi güç çarpanıyla dengelemelisin?";
    const type = randomInt(1, 2);
    if (type === 1) {
        b1 = randomInt(2, 4);
        b2 = -1;
        mulReq1 = 1;
        mulReq2 = b1;
    } else {
        b1 = 1;
        b2 = -randomInt(2, 4);
        mulReq1 = Math.abs(b2);
        mulReq2 = 1;
    }
  } else {
    title = 'Aşama 3: Çift Yönlü Çarpım Çekirdeği';
    description = "Tam sistem çöküşü! Hem üst hem alt jeneratörü uygun çarpanlarla genişleterek y'leri yok et.";
    const pairs = [[2, -3], [3, -2], [3, -4], [4, -3], [5, -2], [2, -5]];
    const p = pairs[randomInt(0, pairs.length - 1)];
    b1 = p[0];
    b2 = p[1];
    mulReq1 = Math.abs(b2);
    mulReq2 = Math.abs(b1);
  }

  if (a1 * mulReq1 + a2 * mulReq2 === 0) {
    a1 += 1;
  }

  const c1 = a1 * finalX + b1 * finalY;
  const c2 = a2 * finalX + b2 * finalY;

  const pa1 = a1 * mulReq1;
  const pb1 = b1 * mulReq1;
  const pc1 = c1 * mulReq1;

  const pa2 = a2 * mulReq2;
  const pb2 = b2 * mulReq2;
  const pc2 = c2 * mulReq2;

  return {
    id: stage,
    title,
    description,
    eq1: formatEquation(a1, b1, c1),
    eq2: formatEquation(a2, b2, c2),
    initialMode: stage === 1 ? 'add' : 'multiply',
    mulReq1,
    mulReq2,
    postMulEq1Str: formatEquation(pa1, pb1, pc1),
    postMulEq2Str: formatEquation(pa2, pb2, pc2),
    sumX: pa1 + pa2,
    sumC: pc1 + pc2,
    finalX,
    finalY
  };
};

export default function EquationSubmarineApp() {
  const { addScore } = useGameStore();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { showMessage } = useAstroBotStore();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const successLockedRef = useRef(false);

  const generateNewLevels = () => [
    generateLevel(1),
    generateLevel(2),
    generateLevel(3)
  ];

  const [levels, setLevels] = useState<Level[]>(generateNewLevels());
  const [levelIndex, setLevelIndex] = useState(0);
  const [mode, setMode] = useState<InteractionMode>('intro');

  const [inpMul1, setInpMul1] = useState('');
  const [inpMul2, setInpMul2] = useState('');
  const [inpSumX, setInpSumX] = useState('');
  const [inpSumC, setInpSumC] = useState('');
  const [inpFinalX, setInpFinalX] = useState('');
  const [inpFinalY, setInpFinalY] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [isSuccessShake, setIsSuccessShake] = useState(false);

  const level = levels[levelIndex];
  const oxygenActive = mode === 'solveX' || mode === 'substitute' || mode === 'completed';
  const pressureActive = mode === 'substitute' || mode === 'completed';
  const systemStable = mode === 'completed';

  const clearTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
    successLockedRef.current = false;
  };

  const queueTimer = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timersRef.current = timersRef.current.filter(activeTimer => activeTimer !== timer);
      callback();
    }, delay);
    timersRef.current.push(timer);
  };

  const resetInputs = () => {
    setInpMul1('');
    setInpMul2('');
    setInpSumX('');
    setInpSumC('');
    setInpFinalX('');
    setInpFinalY('');
  };

  useEffect(() => clearTimers, []);

  const handleStart = () => {
    setMode(level.initialMode);
  };

  const triggerError = (msg: string) => {
    showMessage(msg, 'error');
    setErrorShake(true);
    queueTimer(() => setErrorShake(false), 500);
  };

  const triggerSuccessTransition = (nextMode: InteractionMode, score: number) => {
    if (successLockedRef.current) return;
    successLockedRef.current = true;
    setIsSuccessShake(true);
    addScore(score);
    queueTimer(() => {
      setIsSuccessShake(false);
      setMode(nextMode);
      successLockedRef.current = false;
    }, 1000);
  }

  const checkMultiply = () => {
    const requiredMul1 = level.mulReq1 ?? 1;
    const requiredMul2 = level.mulReq2 ?? 1;
    const val1 = requiredMul1 === 1 ? 1 : parseIntegerInput(inpMul1);
    const val2 = requiredMul2 === 1 ? 1 : parseIntegerInput(inpMul2);

    if (val1 === null || val2 === null) {
      triggerError('Lütfen çarpanlar için geçerli tam sayılar girin!');
      return;
    }

    if (val1 !== requiredMul1) {
      triggerError(`Üst denklem çarpımında hata var! (Beklenen: ${requiredMul1})`);
      return;
    }
    if (val2 !== requiredMul2) {
      triggerError(`Alt denklem çarpımında hata var! (Beklenen: ${requiredMul2})`);
      return;
    }

    if (val1 === requiredMul1 && val2 === requiredMul2) {
      triggerSuccessTransition('add', 20);
    } else {
      triggerError('Çarpanlar y\'leri eşitlemek için yeterli değil. Zıt işaretli eşit katsayılar elde etmelisin!');
    }
  };

  const checkAdd = () => {
    const parsedX = parseIntegerInput(inpSumX);
    const parsedC = parseIntegerInput(inpSumC);

    if (parsedX === null || parsedC === null) {
      triggerError('Lütfen geçerli sayılar girin!');
      return;
    }

    if (parsedX === level.sumX && parsedC === level.sumC) {
      triggerSuccessTransition('solveX', 15);
    } else if (parsedX !== level.sumX) {
      triggerError(`Toplama işleminde hata! x'in katsayısı yanlış. (İpucu: Alt alta x'leri toplayın)`);
    } else {
      triggerError(`Toplama işleminde hata! Eşitliğin sağ tarafı (sonuç kısmı) yanlış.`);
    }
  };

  const checkSolveX = () => {
    const parsedX = parseIntegerInput(inpFinalX);
    if (parsedX === null) {
      triggerError('Lütfen x için geçerli bir tam sayı girin!');
      return;
    }

    if (parsedX === level.finalX) {
      triggerSuccessTransition('substitute', 15);
    } else {
      triggerError(`${level.sumX}x = ${level.sumC} denkleminde her iki tarafı ${level.sumX} sayısına bölmelisin.`);
    }
  };

  const checkSubstitute = () => {
    const parsedY = parseIntegerInput(inpFinalY);
    if (parsedY === null) {
      triggerError('Lütfen y için bir sayı girin!');
      return;
    }

    if (parsedY === level.finalY) {
      triggerSuccessTransition('completed', 50);
    } else {
      triggerError(`Yerine koyma hatalı. x = ${level.finalX} değerini ilk denklemdeki x yerine yazdığınızda hesaplanan y değerini bulmalısınız.`);
    }
  };

  const handleNextLevel = () => {
    if (levelIndex + 1 < levels.length) {
      setLevelIndex(prev => prev + 1);
      setMode('intro');
      resetInputs();
    } else {
      unlockAtom(ATOM_ID);
      unlockModule(MODULE_ID);
      setMode('finished');
    }
  };

  const handleRestart = () => {
    clearTimers();
    setLevels(generateNewLevels());
    setLevelIndex(0);
    setMode('intro');
    setErrorShake(false);
    setIsSuccessShake(false);
    resetInputs();
  };

  const renderCurrentEquations = () => {
    const isMultiplied = mode === 'add' || mode === 'solveX' || mode === 'substitute' || mode === 'completed';
    const topEq = isMultiplied ? (level.postMulEq1Str || level.eq1) : level.eq1;
    const botEq = isMultiplied ? (level.postMulEq2Str || level.eq2) : level.eq2;

    return (
      <div className="flex flex-col gap-3 sm:gap-4 relative">
        <motion.div
          layout
          className="min-h-[58px] bg-gray-900/80 px-4 py-3 sm:px-5 border border-gray-700 rounded-xl font-mono text-xl sm:text-2xl md:text-3xl text-[#00E5FF] tracking-normal sm:tracking-widest flex items-center justify-start sm:justify-center gap-3 sm:gap-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] overflow-x-auto"
        >
          <span className="shrink-0 opacity-50 text-xs sm:text-sm">(1)</span>
          <span className="whitespace-nowrap">{topEq}</span>
        </motion.div>

        <motion.div
          layout
          className="min-h-[58px] bg-gray-900/80 px-4 py-3 sm:px-5 border border-gray-700 rounded-xl font-mono text-xl sm:text-2xl md:text-3xl text-[#B388FF] tracking-normal sm:tracking-widest flex items-center justify-start sm:justify-center gap-3 sm:gap-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] overflow-x-auto"
        >
          <span className="shrink-0 opacity-50 text-xs sm:text-sm">(2)</span>
          <span className="whitespace-nowrap">{botEq}</span>
        </motion.div>

        {/* Visual Line for Addition */}
        {mode === 'add' && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            className="w-full h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent my-1 sm:my-2 relative"
          >
            <div className="absolute left-10 -top-4 text-gray-500 text-3xl">+</div>
          </motion.div>
        )}

        {(mode === 'solveX' || mode === 'substitute' || mode === 'completed') && (
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="min-h-[56px] bg-[#00E5FF]/10 px-4 py-3 sm:px-5 border border-[#00E5FF]/30 rounded-xl font-mono text-xl sm:text-2xl text-[#00E5FF] tracking-normal sm:tracking-widest flex items-center justify-start sm:justify-center gap-3 sm:gap-4 shadow-[0_0_24px_rgba(0,229,255,0.08)] overflow-x-auto"
          >
            <span className="shrink-0 opacity-60 text-sm">Σ</span>
            <span className="whitespace-nowrap">{formatEquation(level.sumX, 0, level.sumC)}</span>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#070b14] text-white flex flex-col font-sans selection:bg-[#00E5FF] selection:text-black relative">
      {/* Background Ambience & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 noise-overlay opacity-50 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#00E5FF]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[#B388FF]/20 rounded-full blur-[120px]"></div>
      </div>

      <GameHeader title="DENİZALTI REAKTÖRÜ: DENKLEMLER" subtitle="Cebir / Denklem Sistemleri" />

      <main className="flex-1 max-w-4xl w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] mx-auto flex flex-col pt-4 sm:pt-6 pb-36 lg:pb-28 relative z-10">
         <AnimatePresence mode="wait">
            {mode === 'finished' ? (
              <ModuleCompletedScreen
                key="finished"
                title="SİSTEMLER ONARILDI"
                message="Kaptan, oksijen ve basınç değerleri tam olarak istenen seviyede. Tüm denizaltı sistemleri güvenle çalışıyor!"
                scoreEarned={100}
                onRestart={handleRestart}
              />
            ) : (
              <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col w-full gap-5 sm:gap-6">
                {/* Status Header */}
                <div className="w-full grid gap-4 bg-gray-900/60 p-4 sm:p-5 rounded-2xl border border-gray-800 backdrop-blur-md shadow-lg overflow-hidden">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gray-800 flex shrink-0 items-center justify-center border border-gray-700 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">
                      <Anchor className={`w-5 h-5 sm:w-6 sm:h-6 ${systemStable ? 'text-[#00E5FF]' : 'text-gray-400'}`} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-xl font-black uppercase tracking-widest leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 break-words">
                        {level.title}
                      </h2>
                      <div className="text-xs sm:text-sm font-mono text-[#00E5FF] tracking-widest mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        DERİNLİK: {(levelIndex + 1) * 300}M <span className="opacity-50">| BASINÇ: KRİTİK</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-3 gap-2">
                    {levels.map((_, i) => (
                      <div
                        key={i}
                        className={`min-w-0 rounded-lg border px-2 py-1 transition-all duration-500 ${
                          i < levelIndex ? 'border-[#00E5FF]/70 bg-[#00E5FF]/10 shadow-[0_0_14px_rgba(0,229,255,0.18)]' :
                          i === levelIndex ? 'border-gray-500 bg-gray-800/80' :
                          'border-gray-800 bg-gray-950/60'
                        }`}
                      >
                         <div className={`h-1 rounded-full ${
                           i < levelIndex ? 'bg-[#00E5FF]' :
                           i === levelIndex ? 'bg-gray-500 animate-pulse' :
                           'bg-gray-800'
                         }`} />
                         <span className="mt-0.5 block text-center text-[9px] text-gray-400 font-mono">L{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-start mb-8 relative">

          <motion.div
            className="w-full max-w-3xl mx-auto bg-[#0a0f1c]/90 rounded-2xl border-2 border-gray-800 p-4 sm:p-5 shadow-[0_26px_52px_rgba(0,0,0,0.55)] backdrop-blur-xl relative overflow-hidden"
            animate={
              errorShake ? { x: [-12, 12, -12, 12, 0], borderColor: 'rgba(255, 46, 84, 0.5)' } :
              isSuccessShake ? { scale: [1, 1.02, 1], borderColor: 'rgba(0, 229, 255, 0.5)' } :
              { borderColor: 'rgba(31, 41, 55, 1)' }
            }
            transition={{ duration: 0.4 }}
          >
            {/* Warning Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
               <div className="flex items-center gap-3">
                 <motion.div
                    animate={{ opacity: [0.65, 1, 0.65] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-12 h-12 rounded-2xl flex shrink-0 items-center justify-center ${systemStable ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-[#ff2e54]/20 text-[#ff2e54]'}`}
                  >
                   {systemStable ? <CircleCheckBig className="w-6 h-6" /> : <BatteryWarning className="w-6 h-6" />}
                 </motion.div>
                 <div className="min-w-0">
                   <h3 className={`text-lg sm:text-xl font-black tracking-widest ${systemStable ? 'text-[#00E5FF]' : 'text-[#ff2e54]'}`}>
                     {systemStable ? 'SİSTEMLER OPTİMUM' : 'SİSTEM UYARISI'}
                   </h3>
                   <div className="mt-1 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500">
                     <Cpu className="w-3.5 h-3.5" />
                     Reaktör Konsolu
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-2 sm:min-w-[260px]">
                 <div className={`rounded-xl border px-3 py-2 ${oxygenActive ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' : 'bg-black/30 border-gray-800 text-gray-500'}`}>
                   <div className="flex items-center gap-2 text-[11px] font-mono uppercase">
                     <Beaker className="w-4 h-4" />
                     Oksijen
                   </div>
                   <div className="mt-1 text-lg font-black font-mono">{oxygenActive ? 'AKTİF' : 'KİLİTLİ'}</div>
                 </div>
                 <div className={`rounded-xl border px-3 py-2 ${pressureActive ? 'bg-[#B388FF]/10 border-[#B388FF]/30 text-[#B388FF]' : 'bg-black/30 border-gray-800 text-gray-500'}`}>
                   <div className="flex items-center gap-2 text-[11px] font-mono uppercase">
                     <Waves className="w-4 h-4" />
                     Basınç
                   </div>
                   <div className="mt-1 text-lg font-black font-mono">{pressureActive ? 'AKTİF' : 'KİLİTLİ'}</div>
                 </div>
               </div>
            </div>

            {/* EQUATIONS DISPLAY */}
            <div className="mb-4 w-full px-0 sm:px-2">
               {renderCurrentEquations()}
            </div>

            {/* INTERACTION PANEL */}
            <div className={`p-4 rounded-xl border transition-colors duration-500 min-h-[128px] flex flex-col justify-center relative overflow-hidden ${
              mode === 'completed' ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30' : 'bg-[#12182b] border-gray-800'
            }`}>

              <AnimatePresence mode="wait">

                {mode === 'intro' && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center text-center gap-4"
                  >
                    <p className="text-gray-300 font-medium">Reaktör çekirdeğinde dengesizlik tespit edildi. Denklemleri çözerek oksijen ve basıncı stabilize edin.</p>
                    <SciFiButton variant="primary" onClick={handleStart} className="w-full sm:w-auto">
                        KONSOLU AÇ
                      </SciFiButton>
                  </motion.div>
                )}

                {mode === 'multiply' && (
                  <motion.div
                    key="multiply"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-5 w-full"
                    >
                      <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Aşama 1: Çarpanları Belirle</div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center inputs-container">
                         {level.mulReq1 !== 1 && (
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-gray-900/80 p-3 rounded-xl border border-gray-700 shadow-inner w-full sm:w-auto">
                             <span className="text-[#00E5FF] font-mono font-bold text-sm">Üst Denklem Çarpanı:</span>
                             <input
                              type="text"
                              maxLength={3}
                              value={inpMul1}
                              onChange={e => {
                                const val = e.target.value;
                                if (integerDraftPattern.test(val)) setInpMul1(val);
                              }}
                                className="h-12 w-full sm:w-20 bg-black/50 border border-[#00E5FF]/30 rounded-lg p-2 text-center font-mono text-xl text-white outline-none focus:border-[#00E5FF] transition-colors"
                             />
                           </div>
                         )}
                         {level.mulReq2 !== 1 && (
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-gray-900/80 p-3 rounded-xl border border-gray-700 shadow-inner w-full sm:w-auto">
                             <span className="text-[#B388FF] font-mono font-bold text-sm">Alt Denklem Çarpanı:</span>
                             <input
                              type="text"
                              maxLength={3}
                              value={inpMul2}
                              onChange={e => {
                                const val = e.target.value;
                                if (integerDraftPattern.test(val)) setInpMul2(val);
                              }}
                                className="h-12 w-full sm:w-20 bg-black/50 border border-[#B388FF]/30 rounded-lg p-2 text-center font-mono text-xl text-white outline-none focus:border-[#B388FF] transition-colors"
                             />
                           </div>
                         )}
                      </div>
                      <SciFiButton variant="secondary" onClick={checkMultiply} className="w-full sm:w-auto px-8">KALİBRE ET</SciFiButton>
                    </motion.div>
                  )}

                {mode === 'add' && (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-5 w-full"
                    >
                      <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Aşama 2: Taraf Tarafa Topla</div>
                      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-mono bg-gray-900/50 p-3 sm:p-4 rounded-xl border border-gray-800">
                        <input
                        type="text"
                        value={inpSumX}
                        onChange={e => {
                          const val = e.target.value;
                          if (integerDraftPattern.test(val)) setInpSumX(val);
                        }}
                          className="h-14 w-20 sm:w-24 bg-black/80 border border-[#00E5FF]/30 rounded-lg p-2 text-center text-white outline-none focus:border-[#00E5FF] transition-colors placeholder:text-gray-700"
                        placeholder="?"
                      />
                      <span className="text-[#00E5FF] font-bold">x</span>
                      <span className="text-gray-600">=</span>
                      <input
                        type="text"
                        value={inpSumC}
                        onChange={e => {
                          const val = e.target.value;
                          if (integerDraftPattern.test(val)) setInpSumC(val);
                        }}
                          className="h-14 w-24 sm:w-28 bg-black/80 border border-gray-700 rounded-lg p-2 text-center text-white outline-none focus:border-white transition-colors placeholder:text-gray-700"
                        placeholder="?"
                      />
                    </div>
                      <SciFiButton variant="primary" onClick={checkAdd} className="w-full sm:w-auto px-8">BİRLEŞTİR</SciFiButton>
                    </motion.div>
                  )}

                {mode === 'solveX' && (
                  <motion.div
                    key="solveX"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-5 w-full"
                  >
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center px-4">Aşama 3: x Değerini Çöz</div>
                    <p className="text-center text-sm text-gray-400 max-w-md">
                      Toplama sonucunda <span className="text-[#00E5FF] font-mono font-bold">{level.sumX}x = {level.sumC}</span> elde ettin. Şimdi x tek başına kalmalı.
                    </p>
                      <div className="flex items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-mono bg-gray-900/50 p-3 sm:p-4 rounded-xl border border-gray-800">
                      <span className="text-[#00E5FF] font-bold">x</span>
                      <span className="text-gray-600">=</span>
                      <input
                        type="text"
                        value={inpFinalX}
                        onChange={e => {
                          const val = e.target.value;
                          if (integerDraftPattern.test(val)) setInpFinalX(val);
                        }}
                          className="h-14 w-24 sm:w-28 bg-black/80 border border-[#00E5FF]/30 rounded-lg p-2 text-center text-white outline-none focus:border-[#00E5FF] transition-colors placeholder:text-gray-700"
                        placeholder="?"
                      />
                    </div>
                      <SciFiButton variant="primary" onClick={checkSolveX} className="w-full sm:w-auto px-8">OKSİJENİ AYARLA</SciFiButton>
                    </motion.div>
                  )}

                {mode === 'substitute' && (
                  <motion.div
                    key="substitute"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-5 w-full"
                  >
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center px-4">
                       Aşama 4: (1) Numaralı denklemde <span className="text-[#00E5FF]">x = {level.finalX}</span> yerine koy!
                    </div>
                      <div className="flex items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-mono bg-gray-900/50 p-3 sm:p-4 rounded-xl border border-gray-800">
                      <span className="text-[#B388FF] font-bold">y</span>
                      <span className="text-gray-600">=</span>
                      <input
                        type="text"
                        value={inpFinalY}
                        onChange={e => {
                          const val = e.target.value;
                          if (integerDraftPattern.test(val)) setInpFinalY(val);
                        }}
                          className="h-14 w-24 sm:w-28 bg-black/80 border border-[#B388FF]/30 rounded-lg p-2 text-center text-white outline-none focus:border-[#B388FF] transition-colors placeholder:text-gray-700"
                        placeholder="?"
                      />
                    </div>
                      <SciFiButton variant="primary" onClick={checkSubstitute} className="w-full sm:w-auto px-8">SENKRONİZE ET</SciFiButton>
                  </motion.div>
                )}

                {mode === 'completed' && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center gap-5 py-2"
                    >
                      <div className="flex w-full flex-col sm:flex-row items-stretch justify-center gap-3 mb-1">
                         <div className="flex min-w-[132px] flex-col items-center gap-2 bg-black/40 p-3 rounded-lg border border-[#00E5FF]/20 px-6">
                            <span className="text-gray-400 text-xs font-mono uppercase">Oksijen (x)</span>
                            <span className="text-2xl font-bold font-mono text-[#00E5FF]">{level.finalX}</span>
                         </div>
                         <div className="flex min-w-[132px] flex-col items-center gap-2 bg-black/40 p-3 rounded-lg border border-[#B388FF]/20 px-6">
                            <span className="text-gray-400 text-xs font-mono uppercase">Basınç (y)</span>
                            <span className="text-2xl font-bold font-mono text-[#B388FF]">{level.finalY}</span>
                         </div>
                    </div>

                    {levelIndex + 1 < levels.length ? (
                      <SciFiButton variant="primary" onClick={handleNextLevel} className="w-full sm:w-auto px-8">
                        SONRAKİ KATMANA İN
                      </SciFiButton>
                    ) : (
                      <SciFiButton variant="primary" onClick={handleNextLevel} className="w-full sm:w-auto px-8 bg-gradient-to-r from-[#00E5FF] to-blue-500 text-black border-transparent">
                        GÖREVİ BİTİR
                      </SciFiButton>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}
