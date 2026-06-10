import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, CheckCircle2, Home, RotateCcw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Grade1MissionFrame } from '../shared/Grade1MissionKit';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import {
  COLOR_INFO,
  createDataFlowTasks,
  DATA_FLOW_SCREEN_ATOMS,
  getCount,
  isCompareTask,
  type DataRow,
  type DataTask,
  type PacketColor,
} from './dataFlowScreenTasks';

const MODULE_ID = 'data-flow-screen';
const ACCENT = '#2EE7FF';

export default function DataFlowScreenApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<DataTask[]>(() => createDataFlowTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    DATA_FLOW_SCREEN_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(90);
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
    setTasks(createDataFlowTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) {
      return { id: 80, text: 'Renkli paket tablosu tamam! Paketleri renk kutularına, çizgilere ve en çok-en az kararına doğru taşıdın.', type: 'success' };
    }
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade1MissionFrame
      title="Renkli Paket Tablosu"
      subtitle="İlkokul 1. Sınıf / Tablo, Çetele ve En Çok"
      icon={<BarChart3 className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="data-flow-screen-stage"
        className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-[#2EE7FF]/18 bg-[radial-gradient(circle_at_50%_12%,rgba(46,231,255,0.13),transparent_34%),linear-gradient(180deg,rgba(7,21,35,0.92),rgba(5,12,22,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
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
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#2EE7FF]/74">Renkli paketler</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
              </div>
              <DataBoard task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="data-flow-screen-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]/74">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
        <div
          data-testid="data-flow-screen-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Renkli paket tablosu tamamlandı.' : task.prompt}</p>
        </div>
        {!isComplete && (
          <div className="mt-5 grid grid-cols-1 gap-3">
            {task.choices.map((choice) => (
              <ChoiceButton
                key={choice}
                choice={choice}
                selected={selected === choice}
                feedback={feedback}
                onClick={() => choose(choice)}
              />
            ))}
          </div>
        )}
      </aside>
    </Grade1MissionFrame>
  );
}

function DataBoard({ task, feedback }: { task: DataTask; feedback: 'idle' | 'success' | 'error' }) {
  const targetColor = task.targetColor;
  const targetInfo = targetColor ? COLOR_INFO[targetColor] : null;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      {task.kind === 'table' && targetColor ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Gelen paket</p>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {Array.from({ length: getCount(task.rows, targetColor) }).map((_, index) => (
                <DataPacket key={index} color={targetColor} index={index} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {task.rows.map((row) => (
              <ColorShelf key={row.color} row={row} active={row.color === targetColor} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {task.rows.map((row) => (
            <DataRowView key={row.color} row={row} highlight={task.targetColor === row.color || isCompareTask(task.kind)} />
          ))}
        </div>
      )}
      <div
        className={`mx-auto mt-4 w-fit rounded-full border px-5 py-2 text-sm font-black ${
          feedback === 'success'
            ? 'border-emerald-300/50 bg-emerald-300/12 text-emerald-200'
            : feedback === 'error'
              ? 'border-rose-300/50 bg-rose-400/12 text-rose-100'
              : 'border-white/10 bg-white/[0.05] text-white/56'
        }`}
      >
        {feedback === 'success' ? 'Doğru!' : feedback === 'error' ? 'Tekrar dene' : targetInfo ? `${targetInfo.label} paketleri izle` : 'Renk kutularına bak'}
      </div>
    </div>
  );
}

function DataRowView({ row, highlight }: { row: DataRow; highlight: boolean }) {
  const info = COLOR_INFO[row.color];

  return (
    <div
      data-testid="data-flow-screen-row"
      data-color-label={info.label}
      data-count={row.count}
      className="grid gap-3 rounded-3xl border bg-white/[0.05] p-3 sm:grid-cols-[112px_minmax(0,1fr)_96px]"
      style={{ borderColor: highlight ? `${info.strong}66` : 'rgba(255,255,255,0.10)', backgroundColor: highlight ? info.soft : undefined }}
    >
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: info.strong }} />
        <p className="text-lg font-black text-white">{info.label}</p>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: row.count }).map((_, index) => (
          <DataPacket key={index} color={row.color} index={index} small />
        ))}
      </div>
      <Tally count={row.count} color={row.color} />
    </div>
  );
}

function ColorShelf({ row, active }: { row: DataRow; active: boolean }) {
  const info = COLOR_INFO[row.color];

  return (
    <div
      data-color-label={info.label}
      className="rounded-3xl border p-4 text-center"
      style={{ borderColor: active ? `${info.strong}88` : 'rgba(255,255,255,0.10)', backgroundColor: active ? info.soft : 'rgba(255,255,255,0.05)' }}
    >
      <span className="mx-auto block h-8 w-8 rounded-full border border-white/20" style={{ backgroundColor: info.strong }} />
      <p className="mt-2 text-lg font-black text-white">{info.label}</p>
      <p className="mt-1 text-xs font-bold text-white/46">renk kutusu</p>
    </div>
  );
}

function DataPacket({ color, index, small = false }: { color: PacketColor; index: number; small?: boolean }) {
  const info = COLOR_INFO[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.55, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className={`rounded-2xl border border-white/16 shadow-[0_12px_24px_rgba(0,0,0,0.26)] ${small ? 'h-9' : 'h-16'}`}
      style={{
        background: `radial-gradient(circle at 35% 22%, rgba(255,255,255,0.72), transparent 18%), linear-gradient(135deg, ${info.strong}, rgba(255,255,255,0.12))`,
        boxShadow: `0 0 20px ${info.strong}33`,
      }}
    />
  );
}

function Tally({ count, color }: { count: number; color: PacketColor }) {
  const info = COLOR_INFO[color];

  return (
    <div className="flex min-h-10 items-center justify-center gap-1 rounded-2xl border border-white/10 bg-black/24 px-3">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="h-7 w-1.5 rounded-full" style={{ backgroundColor: info.strong, opacity: index % 5 === 4 ? 0.55 : 1 }} />
      ))}
    </div>
  );
}

function ChoiceButton({
  choice,
  selected,
  feedback,
  onClick,
}: {
  choice: string;
  selected: boolean;
  feedback: 'idle' | 'success' | 'error';
  onClick: () => void;
}) {
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
      data-testid="data-flow-screen-choice"
      whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined}
      whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined}
      disabled={feedback !== 'idle'}
      onClick={onClick}
      className={`min-h-16 rounded-3xl border px-4 py-3 text-xl font-black transition ${stateClass} disabled:cursor-not-allowed disabled:opacity-80`}
    >
      {choice}
    </motion.button>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      data-testid="data-flow-screen-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Renkli tablo tamam!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">Paketleri renk kutularına, çizgilere ve en çok-en az kararına bağladın.</p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]">Kazanılan atomlar</p>
        <div className="mt-3 space-y-2">
          {DATA_FLOW_SCREEN_ATOMS.map((atom) => (
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
          data-testid="data-flow-screen-restart"
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
