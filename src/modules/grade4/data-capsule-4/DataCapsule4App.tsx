import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Database, Home, RotateCcw, Sparkles, Star } from 'lucide-react';
import { AstroBot, type BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import {
  createDataCapsuleTasks,
  DATA_CAPSULE_ATOMS,
  digitsOf,
  formatNumber,
  placeLabel,
  type DataCapsuleTask,
} from './dataCapsule4Tasks';

const MODULE_ID = 'data-capsule-4';
const DIGIT_COLORS = ['#2EE7FF', '#69D0FF', '#B388FF', '#34D399', '#FFB020', '#FB7185'];

export default function DataCapsule4App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<DataCapsuleTask[]>(() => createDataCapsuleTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    DATA_CAPSULE_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(160);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (choice: string) => {
    if (feedback !== 'idle') return;
    setSelected(choice);

    if (choice !== task.answer) {
      setFeedback('error');
      window.setTimeout(() => {
        setFeedback('idle');
        setSelected(null);
      }, 900);
      return;
    }

    setFeedback('success');
    window.setTimeout(() => {
      if (taskIndex === tasks.length - 1) {
        setIsComplete(true);
      } else {
        setTaskIndex((current) => current + 1);
        setFeedback('idle');
        setSelected(null);
      }
    }, 900);
  };

  const restart = () => {
    setTasks(createDataCapsuleTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) {
      return { id: 900, text: 'Sayı dedektifi görevi tamam! Büyük sayıları okudun, çözdün, sıraladın ve örüntüyü tamamladın.', type: 'success' };
    }
    if (feedback === 'success') {
      return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    }
    if (feedback === 'error') {
      return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    }
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto bg-[#070B12] pb-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.25rem_3.25rem]" />
      <div className="pointer-events-none fixed left-[8%] top-[8%] h-72 w-72 rounded-full bg-[#2EE7FF]/10 blur-[110px]" />
      <div className="pointer-events-none fixed right-[10%] top-[18%] h-64 w-64 rounded-full bg-[#B388FF]/10 blur-[110px]" />
      <div className="pointer-events-none fixed bottom-[4%] left-[38%] h-80 w-80 rounded-full bg-[#34D399]/10 blur-[125px]" />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-label="Ana merkeze dön"
            aria-keyshortcuts="Home"
            className="grid min-h-11 min-w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/72 transition hover:border-[#2EE7FF]/40 hover:text-[#2EE7FF]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#2EE7FF]">
            <Database className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-[#2EE7FF] md:text-2xl">Altı Basamaklı Sayı Dedektifi</h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">
              İlkokul 4. Sınıf / Büyük Sayılar ve Örüntü
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-right">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">Görev</p>
          <p className="text-xl font-black text-[#2EE7FF]">{isComplete ? tasks.length : taskIndex + 1}/{tasks.length}</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] w-full max-w-7xl grid-cols-1 gap-5 px-4 py-3 md:px-7 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section
          data-testid="data-capsule-4-stage"
          className="flex min-h-[570px] items-center justify-center overflow-hidden rounded-[2rem] border border-[#2EE7FF]/18 bg-[radial-gradient(circle_at_50%_16%,rgba(46,231,255,0.12),transparent_34%),linear-gradient(180deg,rgba(8,21,34,0.95),rgba(5,13,24,0.96))] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.30)] md:p-5"
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <CompletionCard key="complete" onRestart={restart} />
            ) : (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="w-full max-w-5xl"
              >
                <div className="mb-5 text-center">
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: task.accent }}>
                    Büyük sayı tarayıcısı
                  </p>
                  <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                  <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
                </div>

                <TaskStage task={task} feedback={feedback} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside
          data-testid="data-capsule-4-control-panel"
          className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
        >
          {isComplete ? (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-300/30 bg-emerald-300/14 shadow-[0_0_36px_rgba(52,211,153,0.22)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Sayı dedektifi tamam!</h2>
              <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">Büyük sayıları parçaladın ve örüntüyü tamamladın.</p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: task.accent }}>
                Cevap kartları
              </p>
              <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
              <div
                data-testid="data-capsule-4-feedback"
                className={`mt-5 rounded-3xl border p-4 ${
                  feedback === 'success'
                    ? 'border-emerald-300/34 bg-emerald-300/10'
                    : feedback === 'error'
                      ? 'border-rose-300/34 bg-rose-400/10'
                      : 'border-white/10 bg-black/24'
                }`}
              >
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
                <p className="mt-2 text-lg font-black leading-snug text-white">{task.prompt}</p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                {task.choices.map((choice) => (
                  <ChoiceButton
                    key={choice}
                    choice={choice}
                    accent={task.accent}
                    selected={selected === choice}
                    feedback={feedback}
                    onClick={() => choose(choice)}
                  />
                ))}
              </div>
            </>
          )}
        </aside>
      </main>

      <AstroBot message={botMessage} />
    </div>
  );
}

function TaskStage({ task, feedback }: { task: DataCapsuleTask; feedback: 'idle' | 'success' | 'error' }) {
  if (task.kind === 'order' && task.displayNumbers) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          {task.displayNumbers.map((value, index) => (
            <motion.div
              key={`${value}-${index}`}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-[#FFB020]/26 bg-[#FFB020]/10 p-5 text-center text-3xl font-black text-white shadow-[0_0_24px_rgba(255,176,32,0.10)]"
            >
              {formatNumber(value)}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (task.kind === 'pattern' && task.sequence) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
        <div className="grid gap-3 md:grid-cols-5">
          {task.sequence.map((value, index) => (
            <div
              key={`${value ?? 'missing'}-${index}`}
              className={`grid min-h-24 place-items-center rounded-3xl border text-center text-2xl font-black ${
                value === null
                  ? 'border-[#FB7185]/45 bg-[#FB7185]/14 text-[#FB7185] shadow-[0_0_28px_rgba(251,113,133,0.18)]'
                  : 'border-white/10 bg-white/[0.06] text-white'
              }`}
            >
              {value === null ? '?' : formatNumber(value)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
      <NumberCapsule task={task} />
      <div className="mt-4 grid gap-2 md:grid-cols-6">
        {task.number && digitsOf(task.number).map((digit, index) => (
          <PlaceMiniCard key={`${task.number}-${index}`} digit={digit} index={index} active={task.focusIndex === index} />
        ))}
      </div>
      <FeedbackGlow feedback={feedback} accent={task.accent} />
    </div>
  );
}

function NumberCapsule({ task }: { task: DataCapsuleTask }) {
  const digits = task.number ? digitsOf(task.number) : [];

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-4">
      <div className="mb-3 flex items-center justify-center gap-2 text-center">
        <Sparkles className="h-5 w-5" style={{ color: task.accent }} />
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Dedektif ekranı</p>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {digits.map((digit, index) => {
          const active = task.focusIndex === index;
          return (
            <motion.div
              key={`${digit}-${index}`}
              animate={active ? { y: [0, -8, 0], scale: [1, 1.06, 1] } : { y: 0, scale: 1 }}
              transition={active ? { repeat: Infinity, duration: 1.5 } : undefined}
              className={`grid min-h-24 place-items-center rounded-3xl border text-4xl font-black ${
                active ? 'bg-white/16 text-white' : 'bg-black/28 text-white/82'
              }`}
              style={{
                borderColor: active ? DIGIT_COLORS[index] : 'rgba(255,255,255,0.10)',
                boxShadow: active ? `0 0 28px ${DIGIT_COLORS[index]}55` : undefined,
              }}
            >
              {digit}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PlaceMiniCard({ digit, index, active }: { digit: number; index: number; active: boolean }) {
  return (
    <div
      className={`min-h-24 rounded-3xl border p-3 text-center ${active ? 'bg-white/14' : 'bg-white/[0.05]'}`}
      style={{ borderColor: active ? `${DIGIT_COLORS[index]}88` : 'rgba(255,255,255,0.10)' }}
    >
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/44">{placeLabel(index)}</p>
      <p className="mt-2 text-3xl font-black" style={{ color: DIGIT_COLORS[index] }}>{digit}</p>
    </div>
  );
}

function ChoiceButton({
  choice,
  accent,
  selected,
  feedback,
  onClick,
}: {
  choice: string;
  accent: string;
  selected: boolean;
  feedback: 'idle' | 'success' | 'error';
  onClick: () => void;
}) {
  const statusClass = selected && feedback === 'success'
    ? 'border-emerald-300/70 bg-emerald-300/18 text-white'
    : selected && feedback === 'error'
      ? 'border-rose-300/70 bg-rose-400/18 text-white'
      : selected
        ? 'border-white/40 bg-white/16 text-white'
        : 'border-white/10 bg-white/[0.06] text-white/86 hover:bg-white/[0.10]';

  return (
    <motion.button
      type="button"
      data-testid="data-capsule-4-choice"
      whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined}
      whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined}
      disabled={feedback !== 'idle'}
      onClick={onClick}
      className={`min-h-16 rounded-3xl border px-4 py-3 text-base font-black transition md:text-lg ${statusClass} disabled:cursor-not-allowed disabled:opacity-80`}
      style={selected ? { boxShadow: `0 0 26px ${feedback === 'error' ? '#FB718566' : accent + '55'}` } : undefined}
    >
      {choice}
    </motion.button>
  );
}

function FeedbackGlow({ feedback, accent }: { feedback: 'idle' | 'success' | 'error'; accent: string }) {
  if (feedback === 'idle') return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto mt-4 w-fit rounded-full border px-5 py-2 text-sm font-black"
      style={{
        borderColor: feedback === 'success' ? '#34D39977' : '#FB718577',
        color: feedback === 'success' ? '#34D399' : '#FB7185',
        boxShadow: `0 0 28px ${feedback === 'success' ? '#34D39944' : '#FB718544'}`,
        background: `${feedback === 'success' ? '#34D399' : accent}18`,
      }}
    >
      {feedback === 'success' ? 'Doğru!' : 'Tekrar dene'}
    </motion.div>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      data-testid="data-capsule-4-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Sayı dedektifi tamam!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Altı basamaklı sayıları okudun, çözdün, sıraladın ve örüntüyü tamamladın.
      </p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]">Kazanılan atomlar</p>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          {DATA_CAPSULE_ATOMS.map((atom) => (
            <div key={atom.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3">
              <Star className="h-5 w-5 shrink-0 fill-yellow-300 text-yellow-300" />
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
          data-testid="data-capsule-4-restart"
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
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#2EE7FF,#B388FF)] px-4 py-3 text-sm font-black text-[#07101d]"
        >
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
