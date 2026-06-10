import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Home, RotateCcw, Sparkles, Star } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2ChoiceButton, Grade2MissionFrame } from '../shared/Grade2MissionKit';
import { DesignVisual, getHologramDisplayCode } from './HologramDesignVisuals';
import {
  createHologramDesignBase2Tasks,
  HOLOGRAM_DESIGN_2_ATOMS,
  type HologramDesignTask,
} from './hologramDesignBase2Tasks';

const MODULE_ID = 'hologram-design-base-2';
const ACCENT = '#38BDF8';

export default function HologramDesignBase2App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [runSeed, setRunSeed] = useState(() => Math.floor(Math.random() * 1000));
  const [tasks, setTasks] = useState<HologramDesignTask[]>(() => createHologramDesignBase2Tasks(runSeed));
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    HOLOGRAM_DESIGN_2_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(120);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (choice: string) => {
    if (feedback !== 'idle') return;
    setSelected(choice);

    if (choice !== task.answer) {
      setFeedback('error');
      window.setTimeout(() => {
        setSelected(null);
        setFeedback('idle');
      }, 820);
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
    }, 860);
  };

  const restart = () => {
    const nextSeed = runSeed + 1;
    setRunSeed(nextSeed);
    setTasks(createHologramDesignBase2Tasks(nextSeed));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 320, text: 'Hologram üssü hazır! Model, simetri, örüntü ve rota görevlerini tamamladın.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title="Hologram Tasarım Üssü"
      subtitle="İlkokul 2. Sınıf / Geometri, Simetri ve Örüntü"
      icon={<Sparkles className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="hologram-design-base-2-stage"
        data-answer={task.answer}
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#38BDF8]/22 bg-[radial-gradient(circle_at_50%_12%,rgba(56,189,248,0.16),transparent_34%),linear-gradient(180deg,rgba(8,24,36,0.96),rgba(6,12,22,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
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
              className="w-full max-w-4xl"
            >
              <div className="mb-5 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: task.color }}>
                  Tasarım ekranı
                </p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/60 md:text-base">{task.prompt}</p>
              </div>
              <DesignScreen task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="hologram-design-base-2-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#38BDF8]/78">Seçim kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru tasarımı seç.</h2>
        <div
          data-testid="hologram-design-base-2-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Tasarım üssü tamam.' : task.prompt}</p>
        </div>
        {!isComplete && (
          <div className="mt-5 grid grid-cols-1 gap-3">
            {task.choices.map((choice) => (
              <Grade2ChoiceButton
                key={choice}
                accent={task.color}
                selected={selected === choice}
                status={selected === choice ? feedback : 'idle'}
                disabled={feedback !== 'idle'}
                onClick={() => choose(choice)}
              >
                <span data-testid="hologram-design-base-2-choice">{choice}</span>
              </Grade2ChoiceButton>
            ))}
          </div>
        )}
      </aside>
    </Grade2MissionFrame>
  );
}

function DesignScreen({ task, feedback }: { task: HologramDesignTask; feedback: 'idle' | 'success' | 'error' }) {
  const displayCode = getHologramDisplayCode(task);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="min-h-80 rounded-[2rem] border border-white/10 bg-[#06131F]/92 p-5">
          <DesignVisual task={task} />
        </div>
        <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.05] p-4">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Tasarım kodu</p>
            <div className="mt-3 rounded-[1.6rem] border border-dashed p-5 text-center" style={{ borderColor: `${task.color}88`, boxShadow: `0 0 26px ${task.color}22` }}>
              <p className="text-3xl font-black" style={{ color: task.color }}>{displayCode}</p>
            </div>
            <p className="mt-4 text-sm font-bold leading-relaxed text-white/58">{task.hint}</p>
          </div>
          <div
            className={`mt-5 rounded-2xl border px-4 py-3 text-center text-sm font-black ${
              feedback === 'success'
                ? 'border-emerald-300/50 bg-emerald-300/12 text-emerald-200'
                : feedback === 'error'
                  ? 'border-rose-300/50 bg-rose-400/12 text-rose-100'
                  : 'border-white/10 bg-black/24 text-white/60'
            }`}
          >
            {feedback === 'success' ? 'Tasarım kilitlendi' : feedback === 'error' ? 'Tekrar dene' : 'Hologramı incele'}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      data-testid="hologram-design-base-2-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Tasarım üssü hazır!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Model kurdun, simetriyi gördün, örüntüyü ve rotayı tamamladın.
      </p>
      <div className="mt-5 max-h-72 w-full space-y-2 overflow-y-auto rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#38BDF8]">Kazanılan atomlar</p>
        {HOLOGRAM_DESIGN_2_ATOMS.map((atom) => (
          <div key={atom.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3">
            <Star className="h-5 w-5 shrink-0 fill-yellow-300 text-yellow-300" />
            <div>
              <p className="text-sm font-black text-white">{atom.id}</p>
              <p className="text-xs font-bold text-white/48">{atom.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
        <motion.button type="button" data-testid="hologram-design-base-2-restart" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onRestart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80">
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#38BDF8,#A78BFA)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
