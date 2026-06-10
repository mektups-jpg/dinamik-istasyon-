import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Home, Minus, PieChart, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { AstroBot, type BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { COMPLETION_ATOM_IDS, createFractionTasks, DENOMINATOR_OPTIONS, type FractionTask } from './fractionReactorTasks';

const ACCENT = '#38E8FF';
const SUCCESS = '#34D399';
const ERROR = '#FB7185';

export default function FractionReactorApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<FractionTask[]>(() => createFractionTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [numerator, setNumerator] = useState(0);
  const [denominator, setDenominator] = useState(1);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const progress = isComplete ? tasks.length : taskIndex;
  const builtFraction = `${numerator}/${denominator}`;
  const targetFraction = `${task.targetNum}/${task.targetDenom}`;
  const canRemoveSlice = numerator > 0 && feedback !== 'success';
  const canAddSlice = numerator < denominator && feedback !== 'success';

  useEffect(() => {
    if (!isComplete) return;
    COMPLETION_ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
    unlockModule('fraction-reactor-3');
    addScore(140);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const chooseDenominator = (value: number) => {
    if (feedback === 'success') return;
    setDenominator(value);
    setNumerator((current) => Math.min(current, value));
    setFeedback('idle');
  };

  const addSlice = () => {
    if (!canAddSlice) return;
    setNumerator((current) => Math.min(denominator, current + 1));
    setFeedback('idle');
  };

  const removeSlice = () => {
    if (!canRemoveSlice) return;
    setNumerator((current) => Math.max(0, current - 1));
    setFeedback('idle');
  };

  const checkAnswer = () => {
    if (feedback === 'success') return;

    if (numerator !== task.targetNum || denominator !== task.targetDenom) {
      setFeedback('error');
      return;
    }

    setFeedback('success');
    window.setTimeout(() => {
      if (taskIndex === tasks.length - 1) {
        setIsComplete(true);
        return;
      }

      setTaskIndex((current) => current + 1);
      setDenominator(1);
      setNumerator(0);
      setFeedback('idle');
    }, 860);
  };

  const restart = () => {
    setTasks((currentTasks) => createFractionTasks(currentTasks));
    setTaskIndex(0);
    setDenominator(1);
    setNumerator(0);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) {
      return { id: 500, text: 'Kesir tabakları tamam! Payı, paydayı, bütün-yarım-çeyrek modellerini doğru kurdun.', type: 'success' };
    }
    if (feedback === 'success') {
      return { id: taskIndex * 10 + 2, text: `Harika! ${targetFraction} kesrini doğru kurdun.`, type: 'success' };
    }
    if (feedback === 'error') {
      return { id: taskIndex * 10 + 3, text: `${task.hint} Hedef ${targetFraction}, senin tabağın ${builtFraction}.`, type: 'error' };
    }
    return { id: taskIndex * 10 + 1, text: `${task.prompt} Önce eş parça sayısını seç, sonra dolu dilimleri ayarla.`, type: 'info' };
  }, [builtFraction, feedback, isComplete, targetFraction, task, taskIndex]);

  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto bg-[#070B12] pb-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.25rem_3.25rem]" />
      <div className="pointer-events-none fixed left-[6%] top-[8%] h-80 w-80 rounded-full bg-[#38E8FF]/10 blur-[115px]" />
      <div className="pointer-events-none fixed bottom-[5%] right-[10%] h-80 w-80 rounded-full bg-[#FFB020]/10 blur-[120px]" />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-label="Ana merkeze dön"
            className="grid min-h-11 min-w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/72 transition hover:border-[#38E8FF]/40 hover:text-[#38E8FF]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#38E8FF]">
            <PieChart className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-[#38E8FF] md:text-2xl">Kesri Şekille Göster</h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">
              İlkokul 3. Sınıf / Bütün, Pay ve Payda
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-right">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">Görev</p>
          <p className="text-xl font-black text-[#38E8FF]">{progress}/{tasks.length}</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] w-full max-w-7xl grid-cols-1 gap-5 px-4 py-3 md:px-7 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section
          data-testid="fraction-reactor-stage"
          className="flex min-h-[560px] items-center justify-center rounded-[2rem] border border-[#38E8FF]/18 bg-[#071522]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <CompletionCard onRestart={restart} />
            ) : (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="w-full max-w-4xl"
              >
                <div className="mb-5 text-center">
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#38E8FF]/74">Hedef kesir</p>
                  <h2 className="mt-2 text-4xl font-black md:text-6xl">{targetFraction}</h2>
                  <p className="mt-2 text-lg font-black text-white/70">{task.title}</p>
                </div>

                <div className="grid grid-cols-1 items-center gap-5 rounded-[2rem] border border-white/10 bg-black/24 p-5 md:grid-cols-[1fr_220px]">
                  <button
                    type="button"
                    aria-label="Dilim ekle"
                    onClick={addSlice}
                    disabled={!canAddSlice}
                    className="grid min-h-[340px] place-items-center rounded-[2rem] border border-[#38E8FF]/16 bg-[#38E8FF]/8 p-4 transition hover:border-[#38E8FF]/42 disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <FractionPlate numerator={numerator} denominator={denominator} feedback={feedback} />
                  </button>

                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 text-center">
                    <Sparkles className="mx-auto h-9 w-9 text-[#FFB020]" />
                    <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/44">Senin tabağın</p>
                    <p className="mt-1 text-5xl font-black text-white">{builtFraction}</p>
                    <p className="mt-3 text-sm font-black leading-snug text-white/58">{task.prompt}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5">
          {isComplete ? (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-300/30 bg-emerald-300/14 shadow-[0_0_36px_rgba(52,211,153,0.22)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              </div>
              <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#38E8FF]/74">Kesir kutlaması</p>
              <h2 className="mt-2 text-2xl font-black">Tüm tabaklar tamam!</h2>
              <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">
                Payda eş parça sayısı, pay ise dolu dilim sayısı olarak kuruldu.
              </p>
              <div className="mt-6 rounded-3xl border border-emerald-300/22 bg-emerald-300/10 px-6 py-4">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Görevler tamam</p>
                <p className="mt-1 text-4xl font-black text-emerald-300">{tasks.length}/{tasks.length}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#38E8FF]/74">Dilim kontrolü</p>
              <h2 className="mt-2 text-2xl font-black">Kesri kur ve kontrol et.</h2>
              <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
                Payda eş parçaları, pay dolu dilimleri anlatır.
              </p>

              <div className="mt-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Payda: eş parça sayısı</p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {DENOMINATOR_OPTIONS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => chooseDenominator(value)}
                      disabled={feedback === 'success'}
                      className={`min-h-14 rounded-2xl border text-xl font-black transition ${
                        denominator === value
                          ? 'border-[#38E8FF]/70 bg-[#38E8FF]/18 text-white shadow-[0_0_24px_rgba(56,232,255,0.22)]'
                          : 'border-white/10 bg-white/[0.06] text-white/80 hover:bg-white/[0.10]'
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={removeSlice}
                  disabled={!canRemoveSlice}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-black text-white/82 transition hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                  Dilim azalt
                </button>
                <button
                  type="button"
                  onClick={addSlice}
                  disabled={!canAddSlice}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#38E8FF]/20 bg-[#38E8FF]/12 text-sm font-black text-white transition hover:bg-[#38E8FF]/18 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                  Dilim ekle
                </button>
              </div>

              <div
                className={`mt-5 rounded-3xl border p-4 ${
                  feedback === 'success'
                    ? 'border-emerald-300/34 bg-emerald-300/10'
                    : feedback === 'error'
                      ? 'border-rose-300/34 bg-rose-400/10'
                      : 'border-white/10 bg-black/24'
                }`}
              >
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef / Senin</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-3xl font-black text-[#38E8FF]">{targetFraction}</span>
                  <span className="text-2xl font-black text-white/32">=</span>
                  <span className="text-3xl font-black text-white">{builtFraction}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={checkAnswer}
                className="mt-5 min-h-14 w-full rounded-2xl bg-gradient-to-r from-[#38E8FF] to-[#B388FF] px-5 py-3 text-base font-black text-[#07101d] shadow-[0_0_28px_rgba(56,232,255,0.24)] transition hover:scale-[1.01]"
              >
                Kontrol Et
              </button>
            </>
          )}
        </aside>
      </main>

      <AstroBot message={botMessage} />
    </div>
  );
}

function FractionPlate({
  numerator,
  denominator,
  feedback,
}: {
  numerator: number;
  denominator: number;
  feedback: 'idle' | 'success' | 'error';
}) {
  const angle = 360 / denominator;
  const filledAngle = angle * numerator;
  const fillColor = feedback === 'success' ? SUCCESS : feedback === 'error' ? ERROR : ACCENT;
  const background = `conic-gradient(${fillColor} 0deg ${filledAngle}deg, rgba(255,255,255,0.10) ${filledAngle}deg 360deg)`;

  return (
    <motion.div
      animate={feedback === 'error' ? { rotate: [-2, 2, -1, 1, 0] } : { rotate: 0 }}
      className="relative grid h-72 w-72 place-items-center rounded-full border-[12px] border-[#16455A] shadow-[inset_0_0_38px_rgba(0,0,0,0.32),0_24px_60px_rgba(0,0,0,0.32)] md:h-80 md:w-80"
      style={{ background }}
    >
      <div className="absolute inset-[11%] rounded-full border border-white/16 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.18),transparent_16%),radial-gradient(circle_at_64%_62%,rgba(255,255,255,0.12),transparent_18%)]" />
      {Array.from({ length: denominator }, (_, index) => (
        <div
          key={index}
          className="absolute left-1/2 top-1/2 h-[47%] w-1 origin-bottom rounded-full bg-[#06111F]/80"
          style={{ transform: `translate(-50%, -100%) rotate(${index * angle}deg)` }}
        />
      ))}
      <div className="relative grid h-28 w-28 place-items-center rounded-[2rem] border border-white/12 bg-black/38 backdrop-blur-sm">
        <span className="text-4xl font-black text-white">{numerator}/{denominator}</span>
      </div>
    </motion.div>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      key="complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.34)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Kesir Şekilleri Tamam!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Bütün, yarım, çeyrek, birim kesir, pay ve payda görevlerini doğru kurdun.
      </p>

      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#38E8FF]">Kazanılan atomlar</p>
        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
          {[
            { id: 'MAT.3.1.9.1', label: 'Bütün modelini kesir sembolüyle eşleştirir.' },
            { id: 'MAT.3.1.9.2', label: 'Yarım modelini 1/2 ile eşleştirir.' },
            { id: 'MAT.3.1.9.3', label: 'Çeyrek modelini 1/4 ile eşleştirir.' },
            { id: 'MAT.3.1.10.1', label: 'Birim kesri eş parçalardan tanımlar.' },
            { id: 'MAT.3.1.11.1', label: 'Paydanın bütünü kaça böldüğünü ayırt eder.' },
            { id: 'MAT.3.1.11.2', label: 'Payın alınan dilim sayısı olduğunu gösterir.' },
          ].map((atom) => (
            <div key={atom.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3">
              <Sparkles className="h-5 w-5 shrink-0 fill-yellow-300 text-yellow-300" />
              <div>
                <p className="text-sm font-black text-white">{atom.id}</p>
                <p className="text-xs font-bold text-white/48">{atom.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80"
        >
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link
          to="/"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#38E8FF] to-[#B388FF] px-4 py-3 text-sm font-black text-[#07101d]"
        >
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
