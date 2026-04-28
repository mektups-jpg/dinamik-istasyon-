import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../../store/useGameStore';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { GameHeader } from '../../../components/ui/GameHeader';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { Anchor, BatteryWarning, Cpu, CircleCheckBig, CircleAlert, XCircle, Beaker, Waves } from 'lucide-react';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';

const ATOM_ID = 'MAT.9.2.3.1';

type InteractionMode = 'intro' | 'multiply' | 'add' | 'substitute' | 'completed' | 'finished';

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
  const { unlockAtom } = useAtomStore();
  const { showMessage } = useAstroBotStore();

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
  const [inpFinalY, setInpFinalY] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [isSuccessShake, setIsSuccessShake] = useState(false);

  const level = levels[levelIndex];

  useEffect(() => {
    if (mode === 'intro') {
      showMessage(`Kaptan! Denizaltında arıza var. Sistem denklemlerini çözmeliyiz. Hazır olduğunda BAŞLAT'a tıkla!`, 'info');
    }
  }, [levelIndex, mode, showMessage]);

  const handleStart = () => {
    setMode(level.initialMode);
    showMessage(level.description, 'info');
  };

  const triggerError = (msg: string) => {
    showMessage(msg, 'error');
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };
  
  const triggerSuccessTransition = (nextMode: InteractionMode, msg: string, score: number) => {
    showMessage(msg, 'success');
    setIsSuccessShake(true);
    addScore(score);
    setTimeout(() => {
      setIsSuccessShake(false);
      setMode(nextMode);
    }, 1000);
  }

  const checkMultiply = () => {
    const val1 = inpMul1 === '' || inpMul1 === '-' ? 1 : parseInt(inpMul1);
    const val2 = inpMul2 === '' || inpMul2 === '-' ? 1 : parseInt(inpMul2);

    if (level.mulReq1 !== undefined && val1 !== level.mulReq1) {
      triggerError(`Üst denklem çarpımında hata var! (Beklenen: ${level.mulReq1})`);
      return;
    }
    if (level.mulReq2 !== undefined && val2 !== level.mulReq2) {
      triggerError(`Alt denklem çarpımında hata var! (Beklenen: ${level.mulReq2})`);
      return;
    }

    if (val1 === level.mulReq1 && val2 === level.mulReq2) {
      triggerSuccessTransition('add', 'Harika! Katsayılar dengelendi. Şimdi denklemleri alt alta topla.', 20);
    } else {
      triggerError('Çarpanlar y\'leri eşitlemek için yeterli değil. Zıt işaretli eşit katsayılar elde etmelisin!');
    }
  };

  const checkAdd = () => {
    const parsedX = parseInt(inpSumX);
    const parsedC = parseInt(inpSumC);
    
    if (isNaN(parsedX) || isNaN(parsedC)) {
      triggerError('Lütfen geçerli sayılar girin!');
      return;
    }

    if (parsedX === level.sumX && parsedC === level.sumC) {
      triggerSuccessTransition('substitute', `Mükemmel! Böylece x = ${level.finalX} değerini bulduk. Şimdi ilk denklemde yerine koy!`, 30);
    } else if (parsedX !== level.sumX) {
      triggerError(`Toplama işleminde hata! x'in katsayısı yanlış. (İpucu: Alt alta x'leri toplayın)`);
    } else {
      triggerError(`Toplama işleminde hata! Eşitliğin sağ tarafı (sonuç kısmı) yanlış.`);
    }
  };

  const checkSubstitute = () => {
    const parsedY = parseInt(inpFinalY);
    if (isNaN(parsedY)) {
      triggerError('Lütfen y için bir sayı girin!');
      return;
    }
    
    if (parsedY === level.finalY) {
      triggerSuccessTransition('completed', `Sistem Onarıldı! Oksijen: ${level.finalX}, Basınç: ${level.finalY}.`, 50);
    } else {
      triggerError(`Yerine koyma hatalı. x = ${level.finalX} değerini ilk denklemdeki x yerine yazdığınızda hesaplanan y değerini bulmalısınız.`);
    }
  };

  const handleNextLevel = () => {
    if (levelIndex + 1 < levels.length) {
      setLevelIndex(prev => prev + 1);
      setMode('intro');
      setInpMul1(''); setInpMul2('');
      setInpSumX(''); setInpSumC(''); setInpFinalY('');
    } else {
      unlockAtom(ATOM_ID);
      showMessage('Tüm sistemler onarıldı! Denizaltı tam güçte çalışıyor. GÖREV BAŞARILI, KAZANIM AÇILDI.', 'success');
      setMode('finished');
    }
  };

  const handleRestart = () => {
    setLevels(generateNewLevels());
    setLevelIndex(0);
    setMode('intro');
    setInpMul1(''); setInpMul2('');
    setInpSumX(''); setInpSumC(''); setInpFinalY('');
  };

  const renderCurrentEquations = () => {
    const isMultiplied = mode === 'add' || mode === 'substitute' || mode === 'completed';
    const topEq = isMultiplied ? (level.postMulEq1Str || level.eq1) : level.eq1;
    const botEq = isMultiplied ? (level.postMulEq2Str || level.eq2) : level.eq2;

    return (
      <div className="flex flex-col gap-4 relative">
        <motion.div 
          layout
          className="bg-gray-900/80 p-5 border border-gray-700 rounded-xl font-mono text-2xl text-[#00E5FF] tracking-widest flex items-center justify-center gap-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
        >
          <span className="opacity-50 text-sm absolute left-4">(1)</span>
          {topEq}
        </motion.div>
        
        <motion.div 
          layout
          className="bg-gray-900/80 p-5 border border-gray-700 rounded-xl font-mono text-2xl text-[#B388FF] tracking-widest flex items-center justify-center gap-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
        >
          <span className="opacity-50 text-sm absolute left-4">(2)</span>
          {botEq}
        </motion.div>
        
        {/* Visual Line for Addition */}
        {mode === 'add' && (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            className="w-full h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent mt-2 mb-2 relative"
          >
            <div className="absolute left-10 -top-4 text-gray-500 text-3xl">+</div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#070b14] text-white flex flex-col font-sans selection:bg-[#00E5FF] selection:text-black relative">
      {/* Background Ambience & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#00E5FF]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[#B388FF]/20 rounded-full blur-[120px]"></div>
      </div>

      <GameHeader title="DENİZALTI REAKTÖRÜ: DENKLEMLER" subtitle="Cebir / Denklem Sistemleri" />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:px-8 flex flex-col pt-6 pb-24 relative z-10">
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
              <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col w-full">
                {/* Status Header */}
                <div className="w-full flex justify-between items-center mb-10 bg-gray-900/60 p-4 px-6 rounded-2xl border border-gray-800 backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">
                      <Anchor className={`w-6 h-6 ${mode === 'completed' ? 'text-[#00E5FF]' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {level.title}
                      </h2>
                      <div className="text-sm font-mono text-[#00E5FF] tracking-widest mt-1">
                        DERİNLİK: {(levelIndex + 1) * 300}M <span className="opacity-50">| BASINÇ: KRİTİK</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {levels.map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                         <div className={`w-8 h-2 rounded-full transition-all duration-500 border ${
                           i < levelIndex ? 'bg-[#00E5FF] border-[#00E5FF] shadow-[0_0_10px_#00E5FF]' :
                           i === levelIndex ? 'bg-gray-700 border-gray-500 animate-pulse' :
                           'bg-gray-800 border-gray-900'
                         }`} />
                         <span className="text-[10px] text-gray-500 font-mono">L{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center mb-16 relative">
          
          {/* Side Info Panels */}
          <div className="hidden lg:flex absolute -left-20 top-1/2 -translate-y-1/2 flex-col gap-4 opacity-70">
             <div className="flex flex-col items-center gap-2">
                <Beaker className={`w-6 h-6 ${(mode === 'completed' || mode === 'substitute') ? 'text-[#00E5FF]' : 'text-gray-600'}`} />
                <span className="font-mono text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>Oksijen (x)</span>
             </div>
          </div>
          <div className="hidden lg:flex absolute -right-20 top-1/2 -translate-y-1/2 flex-col gap-4 opacity-70">
             <div className="flex flex-col items-center gap-2">
                <Waves className={`w-6 h-6 ${mode === 'completed' ? 'text-[#B388FF]' : 'text-gray-600'}`} />
                <span className="font-mono text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>Basınç (y)</span>
             </div>
          </div>

          <motion.div 
            className="w-full max-w-2xl mx-auto bg-[#0a0f1c]/90 rounded-3xl border-2 border-gray-800 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
            animate={
              errorShake ? { x: [-12, 12, -12, 12, 0], borderColor: 'rgba(255, 46, 84, 0.5)' } : 
              isSuccessShake ? { scale: [1, 1.02, 1], borderColor: 'rgba(0, 229, 255, 0.5)' } :
              { borderColor: 'rgba(31, 41, 55, 1)' }
            }
            transition={{ duration: 0.4 }}
          >
            {/* Warning Header */}
            <div className="text-center mb-10 flex flex-col items-center justify-center">
               <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${mode === 'completed' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-[#ff2e54]/20 text-[#ff2e54]'}`}
                >
                 {mode === 'completed' ? <CircleCheckBig className="w-8 h-8" /> : <BatteryWarning className="w-8 h-8" />}
               </motion.div>
               <h3 className={`text-2xl font-black tracking-widest ${mode === 'completed' ? 'text-[#00E5FF]' : 'text-[#ff2e54]'}`}>
                 {mode === 'completed' ? 'SİSTEMLER OPTİMUM' : 'SİSTEM UYARISI'}
               </h3>
            </div>

            {/* EQUATIONS DISPLAY */}
            <div className="mb-10 w-full px-4">
               {renderCurrentEquations()}
            </div>

            {/* INTERACTION PANEL */}
            <div className={`p-6 rounded-2xl border transition-colors duration-500 min-h-[180px] flex flex-col justify-center relative overflow-hidden ${
              mode === 'completed' ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30' : 'bg-[#12182b] border-gray-800'
            }`}>
              
              <AnimatePresence mode="wait">
                
                {mode === 'intro' && (
                  <motion.div 
                    key="intro" 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center gap-6"
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
                    className="flex flex-col items-center gap-6 w-full"
                  >
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Aşama 1: Çarpanları Belirle</div>
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center inputs-container">
                       {level.mulReq1 !== 1 && (
                         <div className="flex items-center gap-3 bg-gray-900/80 p-3 rounded-xl border border-gray-700 shadow-inner">
                           <span className="text-[#00E5FF] font-mono font-bold text-sm">Üst Denklem Çarpanı:</span>
                           <input 
                              type="text" 
                              maxLength={3}
                              value={inpMul1} 
                              onChange={e => {
                                const val = e.target.value;
                                if (/^-?\d*$/.test(val)) setInpMul1(val);
                              }} 
                              className="w-16 bg-black/50 border border-[#00E5FF]/30 rounded-lg p-2 text-center font-mono text-xl text-white outline-none focus:border-[#00E5FF] transition-colors"
                           />
                         </div>
                       )}
                       {level.mulReq2 !== 1 && (
                         <div className="flex items-center gap-3 bg-gray-900/80 p-3 rounded-xl border border-gray-700 shadow-inner">
                           <span className="text-[#B388FF] font-mono font-bold text-sm">Alt Denklem Çarpanı:</span>
                           <input 
                              type="text" 
                              maxLength={3}
                              value={inpMul2} 
                              onChange={e => {
                                const val = e.target.value;
                                if (/^-?\d*$/.test(val)) setInpMul2(val);
                              }} 
                              className="w-16 bg-black/50 border border-[#B388FF]/30 rounded-lg p-2 text-center font-mono text-xl text-white outline-none focus:border-[#B388FF] transition-colors"
                           />
                         </div>
                       )}
                    </div>
                    <SciFiButton variant="secondary" onClick={checkMultiply} className="px-10">KALİBRE ET</SciFiButton>
                  </motion.div>
                )}

                {mode === 'add' && (
                  <motion.div 
                    key="add" 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-6 w-full"
                  >
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Aşama 2: Taraf Tarafa Topla</div>
                    <div className="flex items-center justify-center gap-4 text-3xl font-mono bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                      <input 
                        type="text" 
                        value={inpSumX}
                        onChange={e => {
                          const val = e.target.value;
                          if (/^-?\d*$/.test(val)) setInpSumX(val);
                        }}
                        className="w-20 bg-black/80 border border-[#00E5FF]/30 rounded-lg p-2 text-center text-white outline-none focus:border-[#00E5FF] transition-colors placeholder:text-gray-700"
                        placeholder="?"
                      />
                      <span className="text-[#00E5FF] font-bold">x</span>
                      <span className="text-gray-600">=</span>
                      <input 
                        type="text" 
                        value={inpSumC}
                        onChange={e => {
                          const val = e.target.value;
                          if (/^-?\d*$/.test(val)) setInpSumC(val);
                        }}
                        className="w-24 bg-black/80 border border-gray-700 rounded-lg p-2 text-center text-white outline-none focus:border-white transition-colors placeholder:text-gray-700"
                        placeholder="?"
                      />
                    </div>
                    <SciFiButton variant="primary" onClick={checkAdd} className="px-10">BİRLEŞTİR</SciFiButton>
                  </motion.div>
                )}

                {mode === 'substitute' && (
                  <motion.div 
                    key="substitute" 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-6 w-full"
                  >
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center px-4">
                       Aşama 3: (1) Numaralı denklemde <span className="text-[#00E5FF]">x = {level.finalX}</span> yerine koy!
                    </div>
                    <div className="flex items-center justify-center gap-4 text-3xl font-mono bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                      <span className="text-[#B388FF] font-bold">y</span>
                      <span className="text-gray-600">=</span>
                      <input 
                        type="text" 
                        value={inpFinalY}
                        onChange={e => {
                          const val = e.target.value;
                          if (/^-?\d*$/.test(val)) setInpFinalY(val);
                        }}
                        className="w-24 bg-black/80 border border-[#B388FF]/30 rounded-lg p-2 text-center text-white outline-none focus:border-[#B388FF] transition-colors placeholder:text-gray-700"
                        placeholder="?"
                      />
                    </div>
                    <SciFiButton variant="primary" onClick={checkSubstitute} className="px-10">SENKRONİZE ET</SciFiButton>
                  </motion.div>
                )}

                {mode === 'completed' && (
                  <motion.div 
                    key="completed" 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-6 py-2"
                  >
                    <div className="flex items-center gap-6 mb-2">
                       <div className="flex flex-col items-center gap-2 bg-black/40 p-3 rounded-lg border border-[#00E5FF]/20 px-6">
                          <span className="text-gray-400 text-xs font-mono uppercase">Oksijen (x)</span>
                          <span className="text-2xl font-bold font-mono text-[#00E5FF]">{level.finalX}</span>
                       </div>
                       <div className="flex flex-col items-center gap-2 bg-black/40 p-3 rounded-lg border border-[#B388FF]/20 px-6">
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

