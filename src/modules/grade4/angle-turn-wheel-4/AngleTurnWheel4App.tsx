import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Gauge, Home, RotateCcw, Sparkles, Star } from 'lucide-react';
import { AstroBot, type BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { ANGLE_TURN_ATOMS, createAngleTurnTasks, type AngleTurnTask } from './angleTurnWheel4Tasks';

const MODULE_ID = 'angle-turn-wheel-4';
type Feedback = 'idle' | 'success' | 'error';

export default function AngleTurnWheel4App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<AngleTurnTask[]>(() => createAngleTurnTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    ANGLE_TURN_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(150);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (choice: string) => {
    if (feedback !== 'idle') return;
    setSelected(choice);

    if (choice !== task.answer) {
      setFeedback('error');
      window.setTimeout(() => {
        setSelected(null);
        setFeedback('idle');
      }, 850);
      return;
    }

    setFeedback('success');
    window.setTimeout(() => {
      if (taskIndex === tasks.length - 1) {
        setIsComplete(true);
      } else {
        setTaskIndex((current) => current + 1);
        setSelected(null);
        setFeedback('idle');
      }
    }, 850);
  };

  const restart = () => {
    setTasks(createAngleTurnTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) {
      return { id: 900, text: 'Açı çarkı tamam! Dönme, iletki ve dik-dar-geniş sınıflarını doğru ayırdın.', type: 'success' };
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
            <Gauge className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-[#2EE7FF] md:text-2xl">Açı Ölçme Çarkı</h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">
              İlkokul 4. Sınıf / Açı ve Dönme
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
          data-testid="angle-turn-wheel-4-stage"
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
                    Açı ölçme çarkı
                  </p>
                  <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                  <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
                </div>
                <AngleStage task={task} feedback={feedback} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside
          data-testid="angle-turn-wheel-4-control-panel"
          className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
        >
          {isComplete ? (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-300/30 bg-emerald-300/14 shadow-[0_0_36px_rgba(52,211,153,0.22)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Açı çarkı tamam!</h2>
              <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">Dönme ve açı türleri tamam.</p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: task.accent }}>
                Cevap kartları
              </p>
              <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
              <div
                data-testid="angle-turn-wheel-4-feedback"
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

function AngleStage({ task, feedback }: { task: AngleTurnTask; feedback: Feedback }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
      <div className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
        <div className="mb-4 flex items-center justify-center gap-2 text-center">
          <Sparkles className="h-5 w-5" style={{ color: task.accent }} />
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Canlı dönme</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
          <AngleModel task={task} />
          <div className="grid content-center gap-3">
            {task.chips.map((chip) => (
              <div key={chip} className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4 text-center text-base font-black text-white/86">
                {chip}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FeedbackGlow feedback={feedback} accent={task.accent} />
    </div>
  );
}

function AngleModel({ task }: { task: AngleTurnTask }) {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-[560px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/24 p-5">
      <div className="absolute bottom-9 left-1/2 h-52 w-[420px] -translate-x-1/2 rounded-t-full border-t-4 border-dashed border-white/14" />
      {task.kind === 'tool' && (
        <div className="absolute bottom-10 left-1/2 h-56 w-[440px] -translate-x-1/2 rounded-t-full border-t-8 border-[#B388FF]/35" />
      )}
      <div className="absolute left-1/2 top-[68%] h-2 w-64 rounded-full bg-white/25" />
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: -task.angle }}
        transition={{ type: 'spring', stiffness: 95, damping: 16 }}
        className="absolute left-1/2 top-[68%] h-4 w-64 origin-left rounded-full"
        style={{ background: `linear-gradient(90deg, ${task.accent}, rgba(255,255,255,0.22))`, boxShadow: `0 0 28px ${task.accent}77` }}
      />
      <div className="absolute left-1/2 top-[68%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#07101d] shadow-[0_0_28px_rgba(46,231,255,0.20)]">
        <span className="h-5 w-5 rounded-full" style={{ backgroundColor: task.accent, boxShadow: `0 0 18px ${task.accent}` }} />
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-sm font-black text-white/75">
        Menteşe
      </div>
      <div className="absolute left-7 top-7 rounded-3xl border px-5 py-4 text-center" style={{ borderColor: `${task.accent}55`, background: `${task.accent}16` }}>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Dönme</p>
        <p className="mt-1 text-4xl font-black" style={{ color: task.accent }}>{task.angle}°</p>
      </div>
      <span className="absolute bottom-9 left-[calc(50%+260px)] text-xs font-black text-white/42">0</span>
      <span className="absolute bottom-[248px] left-1/2 text-xs font-black text-white/42">90</span>
    </div>
  );
}

function ChoiceButton({ choice, accent, selected, feedback, onClick }: { choice: string; accent: string; selected: boolean; feedback: Feedback; onClick: () => void }) {
  const stateClass = selected && feedback === 'success'
    ? 'border-emerald-300/70 bg-emerald-300/18 text-white'
    : selected && feedback === 'error'
      ? 'border-rose-300/70 bg-rose-400/18 text-white'
      : selected
        ? 'border-white/40 bg-white/16 text-white'
        : 'border-white/10 bg-white/[0.06] text-white/86 hover:bg-white/[0.10]';

  return (
    <motion.button
      type="button"
      data-testid="angle-turn-wheel-4-choice"
      whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined}
      whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined}
      disabled={feedback !== 'idle'}
      onClick={onClick}
      className={`min-h-16 rounded-3xl border px-4 py-3 text-center text-lg font-black leading-snug break-words transition ${stateClass} disabled:cursor-not-allowed disabled:opacity-80`}
      style={selected ? { boxShadow: `0 0 26px ${feedback === 'error' ? '#FB718566' : accent + '55'}` } : undefined}
    >
      {choice}
    </motion.button>
  );
}

function FeedbackGlow({ feedback, accent }: { feedback: Feedback; accent: string }) {
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
      data-testid="angle-turn-wheel-4-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Açı çarkı tamam!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Dönme, iletki, dik açı, dar açı ve geniş açı görevlerini bitirdin.
      </p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]">Kazanılan atomlar</p>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          {ANGLE_TURN_ATOMS.map((atom) => (
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
          data-testid="angle-turn-wheel-4-restart"
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
