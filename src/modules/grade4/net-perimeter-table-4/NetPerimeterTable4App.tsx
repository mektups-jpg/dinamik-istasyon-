import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Home, PackageOpen, RotateCcw, Ruler, Sparkles, Star } from 'lucide-react';
import { AstroBot, type BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import {
  createNetPerimeterTasks,
  NET_PERIMETER_ATOMS,
  type GridModel,
  type NetPerimeterTask,
} from './netPerimeterTable4Tasks';
import { EdgeLengthModel } from './NetPerimeterEdgeModel';

const MODULE_ID = 'net-perimeter-table-4';
type Feedback = 'idle' | 'success' | 'error';

export default function NetPerimeterTable4App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<NetPerimeterTask[]>(() => createNetPerimeterTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    NET_PERIMETER_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(180);
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
    setTasks(createNetPerimeterTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) {
      return { id: 900, text: 'Geometri keşfi tamam! Açınım, çevre, alan, simetri ve kodlu şekli birlikte çözdün.', type: 'success' };
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
            <PackageOpen className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-[#2EE7FF] md:text-2xl">Açınım ve Çevre Keşfi</h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">
              İlkokul 4. Sınıf / Geometri ve Alan Tahmini
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
          data-testid="net-perimeter-table-4-stage"
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
                    Geometri keşfi
                  </p>
                  <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                  <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
                </div>
                <GeometryStage task={task} feedback={feedback} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside
          data-testid="net-perimeter-table-4-control-panel"
          className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
        >
          {isComplete ? (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-300/30 bg-emerald-300/14 shadow-[0_0_36px_rgba(52,211,153,0.22)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Keşif tamam!</h2>
              <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">Açınım, çevre, alan ve simetri görevleri bitti.</p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: task.accent }}>
                Cevap kartları
              </p>
              <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
              <div
                data-testid="net-perimeter-table-4-feedback"
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

function GeometryStage({ task, feedback }: { task: NetPerimeterTask; feedback: Feedback }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
      <div className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
        <div className="mb-4 flex items-center justify-center gap-2 text-center">
          <Sparkles className="h-5 w-5" style={{ color: task.accent }} />
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Canlı model</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
          <ModelView task={task} feedback={feedback} />
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

function ModelView({ task, feedback }: { task: NetPerimeterTask; feedback: Feedback }) {
  if (task.kind === 'perimeter' && task.dimensions) {
    return <PerimeterModel width={task.dimensions.width} height={task.dimensions.height} accent={task.accent} feedback={feedback} />;
  }

  if (task.kind === 'edge') {
    return <EdgeLengthModel accent={task.accent} feedback={feedback} />;
  }

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-black/24 p-4">
      {task.codeBlocks && (
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {task.codeBlocks.map((block) => (
            <span key={block} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white/72">
              {block}
            </span>
          ))}
        </div>
      )}
      {task.grid && <GridModelView grid={task.grid} accent={task.accent} />}
    </div>
  );
}

function PerimeterModel({ width, height, accent, feedback }: { width: number; height: number; accent: string; feedback: Feedback }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-white/10 bg-black/24 p-6">
      <div className="relative" style={{ width: `${width * 48}px`, height: `${height * 48}px` }}>
        <motion.div
          initial={{ scale: 0.92, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 rounded-3xl border-[6px] bg-white/[0.04]"
          style={{ borderColor: accent, boxShadow: `0 0 34px ${accent}44` }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80"
          style={{ backgroundColor: feedback === 'success' ? '#34D399' : accent, boxShadow: `0 0 24px ${feedback === 'success' ? '#34D399' : accent}` }}
          animate={{
            left: ['0%', '100%', '100%', '0%', '0%'],
            top: ['0%', '0%', '100%', '100%', '0%'],
          }}
          transition={{ duration: 4.5, ease: 'linear', repeat: Infinity }}
        />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-white/[0.08] px-4 py-2 text-sm font-black text-white">{width} birim</span>
        <span className="absolute -right-20 top-1/2 -translate-y-1/2 rounded-full bg-white/[0.08] px-4 py-2 text-sm font-black text-white">{height} birim</span>
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/[0.08] px-4 py-2 text-sm font-black text-white">{width} birim</span>
        <span className="absolute -left-20 top-1/2 -translate-y-1/2 rounded-full bg-white/[0.08] px-4 py-2 text-sm font-black text-white">{height} birim</span>
        <Ruler className="absolute -bottom-12 right-0 h-8 w-8" style={{ color: accent }} />
      </div>
    </div>
  );
}

function GridModelView({ grid, accent }: { grid: GridModel; accent: string }) {
  const cellMap = new Map(grid.cells.map((cell) => [`${cell.x}-${cell.y}`, cell]));
  const ghostMap = new Map((grid.ghostCells ?? []).map((cell) => [`${cell.x}-${cell.y}`, cell]));

  return (
    <div className="relative mx-auto grid max-w-xl gap-2" style={{ gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: grid.columns * grid.rows }).map((_, index) => {
        const x = index % grid.columns;
        const y = Math.floor(index / grid.columns);
        const cell = cellMap.get(`${x}-${y}`);
        const ghost = ghostMap.get(`${x}-${y}`);
        return (
          <motion.div
            key={`${x}-${y}`}
            initial={{ scale: cell || ghost ? 0.75 : 1, opacity: 0.55 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.012 }}
            className="grid aspect-square min-h-12 place-items-center rounded-2xl border text-lg font-black"
            style={{
              borderColor: cell ? (cell.tone ?? accent) : ghost ? `${accent}77` : 'rgba(255,255,255,0.10)',
              background: cell
                ? `linear-gradient(180deg, ${cell.tone ?? accent}, rgba(255,255,255,0.12))`
                : ghost
                  ? `${accent}18`
                  : 'rgba(255,255,255,0.035)',
              color: cell ? '#07101d' : 'rgba(255,255,255,0.46)',
              boxShadow: cell ? `0 0 22px ${(cell.tone ?? accent)}55` : undefined,
            }}
          >
            {cell?.label ?? (ghost ? 'ayna' : '')}
          </motion.div>
        );
      })}
      {grid.axis && <AxisLine axis={grid.axis} accent={accent} />}
    </div>
  );
}

function AxisLine({ axis, accent }: { axis: 'vertical' | 'horizontal' | 'diagonal'; accent: string }) {
  const base = 'pointer-events-none absolute rounded-full';
  const style = { backgroundColor: accent, boxShadow: `0 0 22px ${accent}` };
  if (axis === 'vertical') return <span className={`${base} left-1/2 top-0 h-full w-1 -translate-x-1/2`} style={style} />;
  if (axis === 'horizontal') return <span className={`${base} left-0 top-1/2 h-1 w-full -translate-y-1/2`} style={style} />;
  return <span className={`${base} left-1/2 top-1/2 h-1 w-full -translate-x-1/2 -translate-y-1/2 rotate-45`} style={style} />;
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
      data-testid="net-perimeter-table-4-choice"
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
      data-testid="net-perimeter-table-4-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Geometri keşfi tamam!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Açınım, eş kenar, çevre, alan, simetri ve kodlu şekil görevlerini bitirdin.
      </p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]">Kazanılan atomlar</p>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          {NET_PERIMETER_ATOMS.map((atom) => (
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
          data-testid="net-perimeter-table-4-restart"
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
