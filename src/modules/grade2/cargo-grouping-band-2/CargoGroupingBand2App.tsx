import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Home, PackageCheck, RotateCcw, Star, Truck } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2ChoiceButton, Grade2MissionFrame } from '../shared/Grade2MissionKit';
import {
  CARGO_GROUPING_ATOMS,
  createCargoGroupingTasks,
  type CargoTask,
} from './cargoGroupingBand2Tasks';

const MODULE_ID = 'cargo-grouping-band-2';
const ACCENT = '#34D399';

export default function CargoGroupingBand2App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [runSeed, setRunSeed] = useState(() => Math.floor(Math.random() * 1000));
  const [tasks, setTasks] = useState<CargoTask[]>(() => createCargoGroupingTasks(runSeed));
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    CARGO_GROUPING_ATOMS.forEach((atom) => unlockAtom(atom.id));
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
      }, 800);
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
    const nextSeed = runSeed + 1;
    setRunSeed(nextSeed);
    setTasks(createCargoGroupingTasks(nextSeed));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 260, text: 'Eş gruplar tamam! Çarpma, eşit paylaştırma ve tur sayısını doğru kullandın.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title="Eş Gruplar Kargo Bandı"
      subtitle="İlkokul 2. Sınıf / Eş Gruplar ve Paylaştırma"
      icon={<Truck className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="cargo-grouping-band-2-stage"
        data-answer={task.answer}
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#34D399]/20 bg-[radial-gradient(circle_at_50%_12%,rgba(52,211,153,0.14),transparent_34%),linear-gradient(180deg,rgba(8,26,22,0.96),rgba(6,12,22,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
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
                  Eş gruplar bandı
                </p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/60 md:text-base">{task.prompt}</p>
              </div>
              <CargoStage task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="cargo-grouping-band-2-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#34D399]/78">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
        <div
          data-testid="cargo-grouping-band-2-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Eş gruplar tamamlandı.' : task.prompt}</p>
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
                <span data-testid="cargo-grouping-band-2-choice">{choice}</span>
              </Grade2ChoiceButton>
            ))}
          </div>
        )}
      </aside>
    </Grade2MissionFrame>
  );
}

function CargoStage({ task, feedback }: { task: CargoTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-[2rem] border border-white/10 bg-[#06131F]/92 p-4">
          {task.kind === 'share' ? (
            <ShareScene task={task} />
          ) : task.kind === 'subtract' ? (
            <SubtractScene task={task} />
          ) : task.kind === 'swap' ? (
            <SwapScene task={task} />
          ) : (
            <GroupScene task={task} />
          )}
        </div>
        <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.05] p-4">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Canlı ipucu</p>
            <p className="mt-3 break-words text-2xl font-black leading-tight text-white md:text-3xl">{task.helperLabel}</p>
            <p className="mt-3 text-sm font-bold leading-relaxed text-white/56">
              {task.guideText}
            </p>
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
            {feedback === 'success' ? 'Doğru!' : feedback === 'error' ? 'Tekrar dene' : task.actionLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupScene({ task }: { task: CargoTask }) {
  return (
    <div data-testid="cargo-grouping-band-2-groups" className="min-h-80">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Eş kargo kutuları</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: task.groups }).map((_, groupIndex) => (
          <CargoBay key={groupIndex} label={`${groupIndex + 1}. grup`} count={task.perGroup} color={task.color} />
        ))}
      </div>
    </div>
  );
}

function ShareScene({ task }: { task: CargoTask }) {
  return (
    <div data-testid="cargo-grouping-band-2-share" className="min-h-80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Eşit paylaşım</p>
        <span className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white/70">
          {task.total} kargo
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: task.groups }).map((_, groupIndex) => (
          <CargoBay key={groupIndex} label={`${groupIndex + 1}. robot`} count={task.perGroup} color={task.color} />
        ))}
      </div>
    </div>
  );
}

function SubtractScene({ task }: { task: CargoTask }) {
  const steps = Array.from({ length: task.groups }, (_, index) => task.total - index * task.perGroup);

  return (
    <div data-testid="cargo-grouping-band-2-subtract" className="min-h-80">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Her turda aynı sayıda çıkar</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {steps.map((value, index) => (
          <motion.div
            key={`${value}-${index}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-3xl border bg-white/[0.06] px-5 py-4 text-center"
            style={{ borderColor: `${task.color}44` }}
          >
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="mt-1 text-xs font-black text-white/50">kargo</p>
          </motion.div>
        ))}
        <div className="rounded-3xl border border-emerald-300/40 bg-emerald-300/12 px-5 py-4 text-center">
          <p className="text-3xl font-black text-emerald-200">0</p>
          <p className="mt-1 text-xs font-black text-white/50">bitti</p>
        </div>
      </div>
      <p className="mt-5 text-sm font-bold text-white/56">Aynı çıkarma kaç kez yapıldıysa tur sayısı odur.</p>
    </div>
  );
}

function SwapScene({ task }: { task: CargoTask }) {
  return (
    <div data-testid="cargo-grouping-band-2-swap" className="min-h-80">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">İki farklı diziliş, aynı toplam</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-4">
          <p className="text-center text-lg font-black text-white">{task.groups} x {task.perGroup}</p>
          <MiniGrid groups={task.groups} perGroup={task.perGroup} color={task.color} />
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-4">
          <p className="text-center text-lg font-black text-white">{task.perGroup} x {task.groups}</p>
          <MiniGrid groups={task.perGroup} perGroup={task.groups} color={task.color} />
        </div>
      </div>
    </div>
  );
}

function CargoBay({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <motion.div
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-4"
    >
      <p className="text-sm font-black text-white/62">{label}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <CargoBox key={index} color={color} delay={index * 0.03} />
        ))}
      </div>
    </motion.div>
  );
}

function MiniGrid({ groups, perGroup, color }: { groups: number; perGroup: number; color: string }) {
  return (
    <div className="mt-4 grid gap-2">
      {Array.from({ length: groups }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {Array.from({ length: perGroup }).map((__, itemIndex) => (
            <CargoBox key={`${rowIndex}-${itemIndex}`} color={color} small delay={(rowIndex + itemIndex) * 0.02} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CargoBox({ color, delay, small = false }: { color: string; delay: number; small?: boolean }) {
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0, y: 8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${small ? 'h-8 w-8 rounded-xl' : 'h-12 rounded-2xl'} grid place-items-center border border-white/16 bg-white/[0.08]`}
      style={{ boxShadow: `0 0 18px ${color}33` }}
    >
      <PackageCheck className={small ? 'h-4 w-4' : 'h-6 w-6'} style={{ color }} />
    </motion.span>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      data-testid="cargo-grouping-band-2-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Eş gruplar tamam!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Eş kargo kutularını çarpma ile anlattın, kargoları eşit paylaştırdın ve tur sayısını buldun.
      </p>
      <div className="mt-5 max-h-72 w-full space-y-2 overflow-y-auto rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#34D399]">Kazanılan atomlar</p>
        {CARGO_GROUPING_ATOMS.map((atom) => (
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
        <motion.button
          type="button"
          data-testid="cargo-grouping-band-2-restart"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80"
        >
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#34D399,#B388FF)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
