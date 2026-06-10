import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, CheckCircle2, Home, RotateCcw, Star } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2MissionFrame } from '../shared/Grade2MissionKit';
import {
  createDataCore2Tasks,
  DATA_CORE_2_ATOMS,
  type DataCoreTask,
  type TeamData,
} from './dataCore2Tasks';

const MODULE_ID = 'data-core-2';
const ACCENT = '#22D3EE';

export default function DataCore2App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<DataCoreTask[]>(() => createDataCore2Tasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    DATA_CORE_2_ATOMS.forEach((atom) => unlockAtom(atom.id));
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
    setTasks(createDataCore2Tasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 210, text: 'Veri çekirdeği parladı! Tahmin, çetele, grafik farkı ve sıralama görevlerini tamamladın.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title="Veri Çekirdeği"
      subtitle="İlkokul 2. Sınıf / Tahmin, Grafik ve Sıralama"
      icon={<BarChart3 className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="data-core-2-stage"
        data-answer={task.answer}
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#22D3EE]/18 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.13),transparent_34%),linear-gradient(180deg,rgba(7,21,35,0.94),rgba(5,12,22,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
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
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#22D3EE]/74">Veri çekirdeği</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
              </div>
              <DataCoreStage task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="data-core-2-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE]/74">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
        <div
          data-testid="data-core-2-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Veri çekirdeği tamamlandı.' : task.prompt}</p>
        </div>
        {!isComplete && (
          <div className="mt-5 grid grid-cols-1 gap-3">
            {task.choices.map((choice) => (
              <ChoiceButton key={choice} choice={choice} selected={selected === choice} feedback={feedback} onClick={() => choose(choice)} />
            ))}
          </div>
        )}
      </aside>
    </Grade2MissionFrame>
  );
}

function DataCoreStage({ task, feedback }: { task: DataCoreTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      {task.kind === 'estimate' ? (
        <PacketCloud count={task.packetCount ?? 24} />
      ) : task.kind === 'order-asc' || task.kind === 'order-desc' ? (
        <OrderRails numbers={task.numbers ?? []} direction={task.kind === 'order-asc' ? 'Küçükten büyüğe' : 'Büyükten küçüğe'} />
      ) : (
        <TeamTable teams={task.teams ?? []} targetColor={task.targetColor ?? 'blue'} />
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
        {feedback === 'success' ? 'Doğru!' : feedback === 'error' ? 'Tekrar dene' : 'Veriyi izle'}
      </div>
    </div>
  );
}

function PacketCloud({ count }: { count: number }) {
  return (
    <div data-testid="data-core-2-packet-cloud" data-count={count} className="rounded-[2rem] border border-[#22D3EE]/18 bg-[#081522]/92 p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Dağınık veri paketleri</p>
      <div className="mt-5 grid grid-cols-8 gap-2 md:grid-cols-9">
        {Array.from({ length: count }).map((_, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.012 }}
            className="h-8 rounded-2xl border border-white/14 bg-[radial-gradient(circle_at_35%_22%,rgba(255,255,255,0.7),transparent_18%),linear-gradient(135deg,#22D3EE,#B388FF)] shadow-[0_0_18px_rgba(34,211,238,0.20)]"
          />
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-white/54">Beşer düşün, yaklaşık sayıyı seç.</p>
    </div>
  );
}

function TeamTable({ teams, targetColor }: { teams: TeamData[]; targetColor: 'blue' | 'yellow' }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {teams.map((team) => (
        <div key={team.name} data-testid="data-core-2-team" data-team={team.name} data-blue={team.blue} data-yellow={team.yellow} className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
          <h3 className="text-xl font-black text-white">{team.name}</h3>
          <DataBar label="Mavi" count={team.blue} color="#22D3EE" active={targetColor === 'blue'} />
          <DataBar label="Sarı" count={team.yellow} color="#FACC15" active={targetColor === 'yellow'} />
        </div>
      ))}
    </div>
  );
}

function DataBar({ label, count, color, active }: { label: string; count: number; color: string; active: boolean }) {
  return (
    <div className={`mt-4 rounded-3xl border p-3 ${active ? 'border-white/24 bg-white/[0.08]' : 'border-white/10 bg-white/[0.04]'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-black text-white">{label}</p>
        <p className="font-mono text-sm font-black text-white/70">{count} çizgi</p>
      </div>
      <div className="mt-3 flex min-h-9 items-end gap-1.5">
        {Array.from({ length: count }).map((_, index) => (
          <span key={index} className="w-3 rounded-full" style={{ height: `${16 + (index % 3) * 6}px`, backgroundColor: color, boxShadow: `0 0 14px ${color}55` }} />
        ))}
      </div>
    </div>
  );
}

function OrderRails({ numbers, direction }: { numbers: number[]; direction: string }) {
  return (
    <div data-testid="data-core-2-order-rails" data-numbers={numbers.join(',')} className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE]">{direction}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {numbers.map((number) => (
          <motion.div key={number} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="grid min-h-32 place-items-center rounded-[2rem] border border-[#22D3EE]/22 bg-white/[0.06] text-5xl font-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
            {number}
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-white/54">Kartların doğru sıra dizisini seç.</p>
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
    <motion.button type="button" data-testid="data-core-2-choice" whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined} whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined} disabled={feedback !== 'idle'} onClick={onClick} className={`min-h-16 rounded-3xl border px-4 py-3 text-xl font-black transition ${stateClass} disabled:cursor-not-allowed disabled:opacity-80`}>
      {choice}
    </motion.button>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section data-testid="data-core-2-complete" initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7">
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Veri çekirdeği hazır!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">Tahmin, çetele, grafik farkı ve sayı sıralama görevlerini tamamladın.</p>
      <div className="mt-5 max-h-72 w-full space-y-2 overflow-y-auto rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE]">Kazanılan atomlar</p>
        {DATA_CORE_2_ATOMS.map((atom) => (
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
        <motion.button type="button" data-testid="data-core-2-restart" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onRestart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80">
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
