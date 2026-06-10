import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, CheckCircle2, Home, RotateCcw, Star } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { AstroBot } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import {
  BAR_CHART_TERMINAL_ATOMS,
  createBarChartTerminalTasks,
  type BarChartTask,
  type ChartItem,
} from './barChartTerminalTasks';

const MODULE_ID = 'bar-chart-terminal-3';
const ACCENT = '#22D3EE';

export default function BarChartTerminal3App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<BarChartTask[]>(() => createBarChartTerminalTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    BAR_CHART_TERMINAL_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(110);
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
    setTasks(createBarChartTerminalTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 310, text: 'Sütun grafiği terminali hazır! Tabloyu okudun, grafiği kurdun ve karar verdin.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto bg-[#070B12] pb-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.25rem_3.25rem]" />
      <div className="pointer-events-none fixed left-[8%] top-[8%] h-72 w-72 rounded-full bg-[#22D3EE]/10 blur-[110px]" />
      <div className="pointer-events-none fixed bottom-[5%] right-[10%] h-80 w-80 rounded-full bg-[#B388FF]/10 blur-[120px]" />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" aria-keyshortcuts="Home" className="grid min-h-11 min-w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/72 transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
            <Home className="h-5 w-5" />
          </Link>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#22D3EE]">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-[#22D3EE] md:text-2xl">Sütun Grafiği Terminali</h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">İlkokul 3. Sınıf / Veri Tablosu ve Grafik</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-right">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">Görev</p>
          <p className="text-xl font-black text-[#22D3EE]">{isComplete ? tasks.length : taskIndex + 1}/{tasks.length}</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] w-full max-w-7xl grid-cols-1 gap-5 px-4 py-3 md:px-7 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section
          data-testid="bar-chart-terminal-3-stage"
          data-answer={task.answer}
          className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#22D3EE]/18 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.13),transparent_34%),linear-gradient(180deg,rgba(7,21,35,0.94),rgba(5,12,22,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <CompletionCard key="complete" onRestart={restart} />
            ) : (
              <motion.div key={task.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="w-full max-w-4xl">
                <div className="mb-5 text-center">
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#22D3EE]/74">Veri terminali</p>
                  <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                  <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
                </div>
                <ChartStage task={task} feedback={feedback} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside data-testid="bar-chart-terminal-3-control-panel" className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE]/74">Cevap kartları</p>
          <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
          <div data-testid="bar-chart-terminal-3-feedback" className={`mt-5 rounded-3xl border p-4 ${feedback === 'success' ? 'border-emerald-300/34 bg-emerald-300/10' : feedback === 'error' ? 'border-rose-300/34 bg-rose-400/10' : 'border-white/10 bg-black/24'}`}>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
            <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Grafik tamamlandı.' : task.prompt}</p>
          </div>
          {!isComplete && (
            <div className="mt-5 grid grid-cols-1 gap-3">
              {task.choices.map((choice) => (
                <ChoiceButton key={choice} choice={choice} selected={selected === choice} feedback={feedback} onClick={() => choose(choice)} />
              ))}
            </div>
          )}
        </aside>
      </main>

      <AstroBot message={botMessage} />
    </div>
  );
}

function ChartStage({ task, feedback }: { task: BarChartTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      <div className="grid gap-5 md:grid-cols-[260px_minmax(0,1fr)]">
        <DataTable title={task.dataTitle} items={task.items} targetName={task.targetName} />
        <BarChart items={task.items} targetName={task.targetName} />
      </div>
      <div className={`mx-auto mt-4 w-fit rounded-full border px-5 py-2 text-sm font-black ${feedback === 'success' ? 'border-emerald-300/50 bg-emerald-300/12 text-emerald-200' : feedback === 'error' ? 'border-rose-300/50 bg-rose-400/12 text-rose-100' : 'border-white/10 bg-white/[0.05] text-white/56'}`}>
        {feedback === 'success' ? 'Doğru!' : feedback === 'error' ? 'Tekrar dene' : 'Grafiği oku'}
      </div>
    </div>
  );
}

function DataTable({ title, items, targetName }: { title: string; items: ChartItem[]; targetName?: string }) {
  return (
    <div className="rounded-[2rem] border border-[#22D3EE]/18 bg-[#081522]/92 p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Veri tablosu</p>
      <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.name} className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${targetName === item.name ? 'border-[#22D3EE]/50 bg-[#22D3EE]/12' : 'border-white/10 bg-white/[0.05]'}`}>
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 16px ${item.color}88` }} />
              <p className="text-base font-black text-white">{item.name}</p>
            </div>
            <p className="text-2xl font-black text-white">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ items, targetName }: { items: ChartItem[]; targetName?: string }) {
  const max = Math.max(...items.map((item) => item.count));

  return (
    <div data-testid="bar-chart-terminal-3-chart" className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE]">Sütun grafiği</p>
      <div className="mt-5 grid min-h-72 grid-cols-3 items-end gap-4 rounded-[2rem] border border-white/10 bg-black/24 p-4">
        {items.map((item) => {
          const height = 72 + (item.count / max) * 150;
          return (
            <div key={item.name} className="flex h-full flex-col items-center justify-end gap-3">
              <motion.div initial={{ height: 24 }} animate={{ height }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} className={`w-full max-w-20 rounded-t-3xl border border-white/18 ${targetName === item.name ? 'ring-2 ring-[#22D3EE]' : ''}`} style={{ background: `linear-gradient(180deg, ${item.color}, rgba(15,23,42,0.92))`, boxShadow: `0 0 24px ${item.color}55` }}>
                <p className="pt-3 text-center text-lg font-black text-white">{item.count}</p>
              </motion.div>
              <p className="text-center text-sm font-black text-white/76">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceButton({ choice, selected, feedback, onClick }: { choice: string; selected: boolean; feedback: 'idle' | 'success' | 'error'; onClick: () => void }) {
  const stateClass = selected && feedback === 'success'
    ? 'border-emerald-300/70 bg-emerald-300/18 text-white'
    : selected && feedback === 'error'
      ? 'border-rose-300/70 bg-rose-400/18 text-white'
      : selected
        ? 'border-white/40 bg-white/16 text-white'
        : 'border-white/10 bg-white/[0.06] text-white/86 hover:bg-white/[0.10]';

  return (
    <motion.button type="button" data-testid="bar-chart-terminal-3-choice" whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined} whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined} disabled={feedback !== 'idle'} onClick={onClick} className={`min-h-16 rounded-3xl border px-4 py-3 text-xl font-black transition ${stateClass} disabled:cursor-not-allowed disabled:opacity-80`}>
      {choice}
    </motion.button>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section data-testid="bar-chart-terminal-3-complete" initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7">
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Grafik terminali hazır!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">Tabloyu okudun, sütunları kurdun ve grafikten karar verdin.</p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE]">Kazanılan atomlar</p>
        <div className="mt-3 space-y-2">
          {BAR_CHART_TERMINAL_ATOMS.map((atom) => (
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
        <motion.button type="button" data-testid="bar-chart-terminal-3-restart" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onRestart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80">
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#22D3EE,#B388FF)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
