import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, ArrowRight, CheckCircle, ChevronLeft, Droplets, Home, RotateCcw, ShieldCheck, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';

type Step = 'extract' | 'expand' | 'compare' | 'victory';
type Side = 'left' | 'right';

type FractionTask = {
  whole: number;
  numerator: number;
  denominator: number;
  rightNumerator: number;
  rightDenominator: number;
};

const TASK_POOL: FractionTask[] = [
  { whole: 2, numerator: 1, denominator: 3, rightNumerator: 11, rightDenominator: 6 },
  { whole: 1, numerator: 3, denominator: 4, rightNumerator: 10, rightDenominator: 8 },
  { whole: 2, numerator: 1, denominator: 5, rightNumerator: 23, rightDenominator: 10 },
  { whole: 3, numerator: 1, denominator: 4, rightNumerator: 27, rightDenominator: 8 },
  { whole: 1, numerator: 1, denominator: 2, rightNumerator: 10, rightDenominator: 6 },
  { whole: 2, numerator: 1, denominator: 3, rightNumerator: 20, rightDenominator: 9 },
  { whole: 1, numerator: 2, denominator: 3, rightNumerator: 17, rightDenominator: 9 },
  { whole: 2, numerator: 1, denominator: 4, rightNumerator: 25, rightDenominator: 12 },
  { whole: 1, numerator: 1, denominator: 2, rightNumerator: 13, rightDenominator: 8 },
  { whole: 2, numerator: 1, denominator: 2, rightNumerator: 18, rightDenominator: 8 },
  { whole: 1, numerator: 2, denominator: 3, rightNumerator: 19, rightDenominator: 12 },
  { whole: 2, numerator: 1, denominator: 3, rightNumerator: 29, rightDenominator: 12 },
];
const TASK_COUNT = 3;
const LAST_FIRST_TASK_KEY = 'fraction-synchronizer-last-first-task';
const REQUIRED_MULTIPLIERS = [2, 3, 4];

const taskKey = (task: FractionTask) =>
  `${task.whole}-${task.numerator}-${task.denominator}-${task.rightNumerator}-${task.rightDenominator}`;

const shuffleTasks = (tasks: FractionTask[]) => {
  const result = [...tasks];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
};

const createTaskSet = () => {
  const groupedTasks = REQUIRED_MULTIPLIERS.flatMap((multiplier) => {
    const candidates = TASK_POOL.filter((task) => task.rightDenominator / task.denominator === multiplier);
    const selectedTask = shuffleTasks(candidates)[0];
    return selectedTask ? [selectedTask] : [];
  });
  const tasks = shuffleTasks(groupedTasks).slice(0, TASK_COUNT);

  if (typeof window !== 'undefined') {
    const lastFirstTask = window.localStorage.getItem(LAST_FIRST_TASK_KEY);
    if (lastFirstTask && taskKey(tasks[0]) === lastFirstTask) {
      const nextIndex = tasks.findIndex((task) => taskKey(task) !== lastFirstTask);
      if (nextIndex > 0) {
        [tasks[0], tasks[nextIndex]] = [tasks[nextIndex], tasks[0]];
      }
    }
    window.localStorage.setItem(LAST_FIRST_TASK_KEY, taskKey(tasks[0]));
  }

  return tasks.slice(0, TASK_COUNT);
};

const MODULE_ID = 'fraction-synchronizer';
const ATOMS = ['MAT.5.1.3.2', 'MAT.5.1.4.1'];

const makeMessage = (text: string, type: BotMessageType, id: number): BotMessage => ({ text, type, id });
const getImproperNumerator = (task: FractionTask) => task.whole * task.denominator + task.numerator;
const makeConversionHint = (task: FractionTask) => {
  const improperNumerator = getImproperNumerator(task);
  return `${task.whole} × ${task.denominator} + ${task.numerator} = ${improperNumerator}; yani ${improperNumerator}/${task.denominator}.`;
};
const makeConversionMessage = (task: FractionTask) =>
  `Önce sol tanktaki tam sayılı kesri bileşik kesre çevirelim. Kural: tam × payda + pay. Bu görevde ${makeConversionHint(task)}`;

export default function FractionSynchronizerApp({ onBack }: { onBack?: () => void }) {
  const [tasks, setTasks] = useState<FractionTask[]>(() => createTaskSet());
  const [taskIndex, setTaskIndex] = useState(0);
  const [step, setStep] = useState<Step>('extract');
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<{ type: BotMessageType; text: string } | null>(null);
  const [messageId, setMessageId] = useState(0);
  const [botMessage, setBotMessage] = useState<BotMessage>(
    makeMessage(makeConversionMessage(tasks[0]), 'info', 0),
  );

  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const task = tasks[taskIndex];
  const progressStep = step === 'extract' ? 0 : step === 'expand' ? 0.34 : step === 'compare' ? 0.67 : 1;
  const progress = Math.round(((taskIndex + progressStep) / tasks.length) * 100);

  const model = useMemo(() => {
    const improperNumerator = getImproperNumerator(task);
    const multiplier = task.rightDenominator / task.denominator;
    const expandedNumerator = improperNumerator * multiplier;
    const answer: Side = expandedNumerator >= task.rightNumerator ? 'left' : 'right';

    return {
      improperNumerator,
      multiplier,
      expandedNumerator,
      answer,
    };
  }, [task]);

  const speak = (text: string, type: BotMessageType = 'info') => {
    setMessageId((id) => {
      const nextId = id + 1;
      setBotMessage(makeMessage(text, type, nextId));
      return nextId;
    });
  };

  const resetGame = () => {
    const nextTasks = createTaskSet();
    setTasks(nextTasks);
    setTaskIndex(0);
    setStep('extract');
    setExpanded(false);
    setFeedback(null);
    speak(makeConversionMessage(nextTasks[0]), 'info');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home') resetGame();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const showFeedback = (text: string, type: BotMessageType) => {
    setFeedback({ text, type });
    speak(text, type);
  };

  const handleExtract = () => {
    setExpanded(false);
    setFeedback(null);
    showFeedback(`${makeConversionHint(task)} Şimdi paydaları eşitleyelim.`, 'success');
    window.setTimeout(() => setStep('expand'), 900);
  };

  const handleWrongExpand = () => {
    showFeedback(`Bu hamle paydaları eşitlemez. Sol tankın paydasını ${task.denominator} yerine ${task.rightDenominator} yapmak için ${model.multiplier} ile genişletmeliyiz.`, 'error');
  };

  const handleCorrectExpand = () => {
    setExpanded(true);
    setFeedback(null);
    showFeedback(`Harika. Sol tank artık ${model.expandedNumerator}/${task.rightDenominator}. İki tankın paydası da ${task.rightDenominator}.`, 'success');
    window.setTimeout(() => setStep('compare'), 850);
  };

  const handleCompare = (side: Side) => {
    if (side !== model.answer) {
      const larger = model.answer === 'left' ? model.expandedNumerator : task.rightNumerator;
      const smaller = model.answer === 'left' ? task.rightNumerator : model.expandedNumerator;
      showFeedback(`Paydalar eşitken payı büyük olan kesir büyüktür. ${larger} parça, ${smaller} parçadan fazla.`, 'error');
      return;
    }

    setFeedback(null);
    ATOMS.forEach((atomId) => unlockAtom(atomId));
    const isLastTask = taskIndex === tasks.length - 1;

    if (isLastTask) {
      unlockModule(MODULE_ID);
      addScore(150);
      speak('Doğru. Üç kesir tankını da bileşik kesir, denk payda ve karşılaştırma kuralıyla tamamladın.', 'success');
      setStep('victory');
      return;
    }

    showFeedback('Doğru. Bir sonraki kesir tankı açılıyor; aynı kuralı yeni sayılarla uygula.', 'success');
    window.setTimeout(() => {
      const nextTask = tasks[taskIndex + 1];
      setTaskIndex((index) => index + 1);
      setStep('extract');
      setExpanded(false);
      setFeedback(null);
      speak(makeConversionMessage(nextTask));
    }, 900);
  };

  const leftNumerator = step === 'extract' ? model.improperNumerator : expanded ? model.expandedNumerator : model.improperNumerator;
  const leftDenominator = expanded ? task.rightDenominator : task.denominator;
  const prompt =
    step === 'extract'
      ? `Görev ${taskIndex + 1}/${tasks.length}: ${task.whole} tam + ${task.numerator}/${task.denominator} tankını bileşik kesre çevir.`
      : step === 'expand'
        ? `Görev ${taskIndex + 1}/${tasks.length}: Paydaları eşitle; sol tankın paydasını ${task.denominator} yerine ${task.rightDenominator} yap.`
        : `Görev ${taskIndex + 1}/${tasks.length}: Paydalar eşit. Hangi tankta daha çok parça var?`;

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#050510] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              aria-label="Geri dön"
              onClick={onBack}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-200">MAT.5.1.3.2 · MAT.5.1.4.1</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Kesir Tankları</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-right">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">İlerleme</p>
            <p data-testid="fraction-progress" className="text-xl font-black text-cyan-100">%{progress}</p>
          </div>
          <button
            aria-keyshortcuts="Home"
            onClick={resetGame}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
          >
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section
          data-testid="fraction-synchronizer-stage"
          className="rounded-[32px] border border-cyan-300/20 bg-slate-950/70 p-5 shadow-[0_30px_90px_rgba(0,229,255,0.12)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-cyan-100">Ana oyuncak: kesir tankları</p>
              <p className="mt-1 text-sm text-slate-300">{prompt}</p>
            </div>
            <StepPills step={step} />
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#07111f] p-5">
            <div className="grid items-center gap-5 lg:grid-cols-[1fr_90px_1fr]">
              {step === 'extract' ? (
                <MixedTank task={task} />
              ) : (
                <FractionTank label="Sol tank" numerator={leftNumerator} denominator={leftDenominator} tone="cyan" active={step === 'expand'} />
              )}

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="rounded-full border border-cyan-200/20 bg-white/5 p-4 text-cyan-100">
                  <Droplets className="h-8 w-8" />
                </div>
                <div className="text-4xl font-black text-cyan-200">{step === 'extract' ? '→' : '='}</div>
              </div>

              <FractionTank label="Sağ tank" numerator={task.rightNumerator} denominator={task.rightDenominator} tone="violet" active={false} />
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <AnimatePresence mode="wait">
              {step === 'extract' && (
                <motion.div key="extract" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col items-center gap-4">
                  <p className="text-center text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Tam tankları eşit parçalara ayır</p>
                  <FormulaHint task={task} improperNumerator={model.improperNumerator} />
                  <button
                    data-testid="fraction-valve"
                    onClick={handleExtract}
                    className="min-h-16 w-full max-w-sm rounded-2xl bg-cyan-300 px-6 py-4 text-lg font-black text-slate-950 shadow-[0_0_35px_rgba(103,232,249,0.35)] transition hover:scale-[1.02] hover:bg-white"
                  >
                    Vanayı çevir
                  </button>
                </motion.div>
              )}

              {step === 'expand' && (
                <motion.div key="expand" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-4 sm:grid-cols-3">
                  <ChoiceButton testId="fraction-expand-wrong" label={`${model.multiplier + 1} ile genişlet`} onClick={handleWrongExpand} />
                  <ChoiceButton testId="fraction-expand-correct" label={`${model.multiplier} ile genişlet`} onClick={handleCorrectExpand} />
                  <ChoiceButton testId="fraction-expand-wrong-side" label="Sağ tankı değiştir" onClick={handleWrongExpand} />
                </motion.div>
              )}

              {step === 'compare' && (
                <motion.div key="compare" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-4 sm:grid-cols-2">
                  <ChoiceButton testId="fraction-compare-left" label={`Sol tank (${model.expandedNumerator}/${task.rightDenominator})`} onClick={() => handleCompare('left')} />
                  <ChoiceButton testId="fraction-compare-right" label={`Sağ tank (${task.rightNumerator}/${task.rightDenominator})`} onClick={() => handleCompare('right')} />
                </motion.div>
              )}
            </AnimatePresence>

            {feedback && step !== 'victory' && (
              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${feedback.type === 'error' ? 'border-rose-400/40 bg-rose-500/10 text-rose-100' : 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'}`}>
                {feedback.text}
              </div>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[28px] border border-cyan-300/30 bg-cyan-950/40 p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Canlı durum</p>
            <h2 className="mt-3 text-2xl font-black text-white">{step === 'victory' ? 'Tanklar tamam' : 'AstroBot hazır'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">{botMessage.text}</p>
          </section>

          <section className="rounded-[28px] border border-white/15 bg-white/[0.07] p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Kural kanıtı</p>
            <div className="mt-4 space-y-3">
              <RuleLine done={step !== 'extract'} text="Tam sayılı kesri bileşik kesre çevir" />
              <RuleLine done={expanded || step === 'victory'} text="Paydaları denk olacak şekilde genişlet" />
              <RuleLine done={step === 'victory'} text="Paydalar eşitken payı büyük olanı seç" />
            </div>
          </section>
        </aside>
      </main>

      {step === 'victory' && <VictoryPanel onReplay={resetGame} />}
      {step !== 'victory' && <AstroBot message={botMessage} />}
    </div>
  );
}

function MixedTank({ task }: { task: FractionTask }) {
  return (
    <div className="rounded-[28px] border border-cyan-200/25 bg-cyan-300/10 p-5">
      <p className="text-center font-mono text-xs font-black uppercase tracking-[0.3em] text-cyan-100">Sol tank</p>
      <div className="mt-4 flex min-h-[260px] flex-col justify-center gap-4">
        <div className="flex justify-center gap-3">
          {Array.from({ length: task.whole }).map((_, index) => (
            <MiniTank key={index} filled={task.denominator} denominator={task.denominator} />
          ))}
          <MiniTank filled={task.numerator} denominator={task.denominator} />
        </div>
        <div className="text-center text-5xl font-black text-white">
          {task.whole} tam + {task.numerator}/{task.denominator}
        </div>
      </div>
    </div>
  );
}

function FormulaHint({ task, improperNumerator }: { task: FractionTask; improperNumerator: number }) {
  return (
    <div className="w-full max-w-xl rounded-2xl border border-cyan-200/25 bg-cyan-300/10 px-4 py-3 text-center">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100">İpucu</p>
      <p className="mt-1 text-sm font-bold text-cyan-50">
        Tam × payda + pay: {task.whole} × {task.denominator} + {task.numerator} = {improperNumerator}, yeni kesir {improperNumerator}/{task.denominator}.
      </p>
    </div>
  );
}

function MiniTank({ filled, denominator }: { filled: number; denominator: number }) {
  return (
    <div className="grid h-28 w-16 overflow-hidden rounded-2xl border border-cyan-100/30 bg-slate-950/60" style={{ gridTemplateRows: `repeat(${denominator}, minmax(0, 1fr))` }}>
      {Array.from({ length: denominator }).map((_, index) => (
        <div key={index} className={`border-t border-slate-900/50 ${index >= denominator - filled ? 'bg-cyan-300' : 'bg-white/5'}`} />
      ))}
    </div>
  );
}

function FractionTank({ label, numerator, denominator, tone, active }: { label: string; numerator: number; denominator: number; tone: 'cyan' | 'violet'; active: boolean }) {
  const rows = Math.max(2, Math.ceil(numerator / denominator));
  const color = tone === 'cyan' ? 'bg-cyan-300' : 'bg-violet-400';
  const border = tone === 'cyan' ? 'border-cyan-200/30' : 'border-violet-200/30';

  return (
    <div className={`rounded-[28px] border ${border} bg-white/[0.05] p-5 ${active ? 'shadow-[0_0_35px_rgba(103,232,249,0.18)]' : ''}`}>
      <p className="text-center font-mono text-xs font-black uppercase tracking-[0.3em] text-white/70">{label}</p>
      <div className="mx-auto mt-4 grid min-h-[260px] max-w-sm overflow-hidden rounded-[26px] border border-white/15 bg-slate-950/70 p-2" style={{ gridTemplateColumns: `repeat(${denominator}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows * denominator }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.85, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.min(index * 0.015, 0.18) }}
            className={`m-1 rounded-xl border border-slate-900/50 ${index < numerator ? color : 'bg-white/5'}`}
          />
        ))}
      </div>
      <div className="mx-auto mt-4 w-28 rounded-2xl border border-white/15 bg-slate-950/80 py-3 text-center">
        <div className="text-3xl font-black text-white">{numerator}</div>
        <div className="mx-auto my-1 h-0.5 w-12 bg-white/40" />
        <div className="text-2xl font-black text-cyan-100">{denominator}</div>
      </div>
    </div>
  );
}

function ChoiceButton({ label, onClick, testId }: { label: string; onClick: () => void; testId: string }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className="min-h-16 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:border-cyan-200/50 hover:bg-cyan-300 hover:text-slate-950"
    >
      {label}
    </button>
  );
}

function StepPills({ step }: { step: Step }) {
  const steps: Array<{ id: Step; label: string }> = [
    { id: 'extract', label: 'Çevir' },
    { id: 'expand', label: 'Eşitle' },
    { id: 'compare', label: 'Karşılaştır' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((item) => (
        <span key={item.id} className={`rounded-full border px-3 py-1 text-xs font-black ${step === item.id ? 'border-cyan-200 bg-cyan-300 text-slate-950' : step === 'victory' ? 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100' : 'border-white/10 bg-white/5 text-white/60'}`}>
          {item.label}
        </span>
      ))}
    </div>
  );
}

function RuleLine({ done, text }: { done: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${done ? 'border-emerald-300/35 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-slate-950/45 text-white/70'}`}>
      {done ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5 opacity-50" />}
      {text}
    </div>
  );
}

function VictoryPanel({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl rounded-[36px] border border-cyan-200/30 bg-slate-950 p-8 text-center shadow-[0_30px_100px_rgba(0,229,255,0.22)]">
        <Trophy className="mx-auto h-20 w-20 text-cyan-300" />
        <h2 className="mt-5 text-4xl font-black text-white">Kesir tankları tamam</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
          Üç görevde tam sayılı kesri bileşik kesre çevirdin, paydaları eşitledin ve büyük kesri parça sayısına bakarak buldun.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ATOMS.map((atomId) => (
            <div key={atomId} className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-4 text-left">
              <ShieldCheck className="mb-2 h-5 w-5 text-cyan-200" />
              <p className="font-mono text-sm font-black text-cyan-100">{atomId}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button data-testid="fraction-replay" onClick={onReplay} className="rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white">
            Tekrar oyna
          </button>
          <Link data-testid="fraction-home" to="/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/15">
            Ana merkeze dön <Home className="h-5 w-5" /> <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
