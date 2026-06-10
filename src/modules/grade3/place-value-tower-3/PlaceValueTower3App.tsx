import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Building2, CheckCircle2, Home, RotateCcw, Sparkles, Star } from 'lucide-react';
import { AstroBot, type BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { createPlaceValueTasks, PLACE_VALUE_ATOMS, type PlaceValueTask } from './placeValueTower3Tasks';

const MODULE_ID = 'place-value-tower-3';
const ACCENT = '#2EE7FF';
const HUNDRED = '#A78BFA';
const TEN = '#FFB020';
const ONE = '#34D399';
const ERROR = '#FB7185';

export default function PlaceValueTower3App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<PlaceValueTask[]>(() => createPlaceValueTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const unlockedAtomIds = useMemo(() => [...new Set(tasks.flatMap((item) => item.atomIds))], [tasks]);
  const stageNumber = task.mode === 'decompose' || feedback === 'success' ? String(task.value) : '?';
  const stageNumberLabel = task.mode === 'decompose' ? 'Parçalanacak sayı' : 'Sayı kartı';

  useEffect(() => {
    if (!isComplete) return;
    unlockedAtomIds.forEach((atomId) => unlockAtom(atomId));
    unlockModule(MODULE_ID);
    addScore(120);
  }, [addScore, isComplete, unlockAtom, unlockModule, unlockedAtomIds]);

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
    }, 900);
  };

  const restart = () => {
    setTasks((currentTasks) => createPlaceValueTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) {
      return { id: 900, text: 'Kule tamam! Yüzlük, onluk ve birlik katlarını doğru okudun.', type: 'success' };
    }
    if (feedback === 'success') {
      return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    }
    if (feedback === 'error' && selected) {
      return { id: taskIndex * 10 + 3, text: `${selected} bu kuleye uymadı. ${task.hint}`, type: 'error' };
    }
    return { id: taskIndex * 10 + 1, text: `${task.prompt} Büyük parçalar yüzlük, çubuklar onluk, küpler birliktir.`, type: 'info' };
  }, [feedback, isComplete, selected, task, taskIndex]);

  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto bg-[#070B12] pb-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.25rem_3.25rem]" />
      <div className="pointer-events-none fixed left-[6%] top-[10%] h-72 w-72 rounded-full bg-[#2EE7FF]/10 blur-[110px]" />
      <div className="pointer-events-none fixed right-[9%] top-[18%] h-64 w-64 rounded-full bg-[#FFB020]/10 blur-[115px]" />
      <div className="pointer-events-none fixed bottom-[4%] left-[42%] h-80 w-80 rounded-full bg-[#34D399]/10 blur-[125px]" />

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
            <Building2 className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-[#2EE7FF] md:text-2xl">Yüzlük-Onluk-Birlik Kulesi</h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">
              İlkokul 3. Sınıf / 1000'e Kadar Sayı Kurma
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-right">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">Görev</p>
          <p className="text-xl font-black text-[#2EE7FF]">{isComplete ? tasks.length : taskIndex}/{tasks.length}</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] w-full max-w-7xl grid-cols-1 gap-5 px-4 py-3 md:px-7 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section
          data-testid="place-value-tower-3-stage"
          className="flex min-h-[560px] items-center justify-center overflow-hidden rounded-[2rem] border border-[#2EE7FF]/18 bg-[radial-gradient(circle_at_50%_16%,rgba(46,231,255,0.12),transparent_34%),linear-gradient(180deg,rgba(8,21,34,0.95),rgba(5,13,24,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
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
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#2EE7FF]/74">Basamak kulesi</p>
                  <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                  <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
                </div>

                <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-black/24 p-4 shadow-[inset_0_0_42px_rgba(46,231,255,0.04)] lg:grid-cols-[1fr_190px]">
                  <div className="grid gap-3 md:grid-cols-3">
                    <TowerColumn
                      title="Yüzlük"
                      count={task.hundreds}
                      color={HUNDRED}
                      emptyLabel="0 yüzlük"
                      render={(index) => <HundredSlab key={index} index={index} />}
                    />
                    <TowerColumn
                      title="Onluk"
                      count={task.tens}
                      color={TEN}
                      emptyLabel="0 onluk"
                      render={(index) => <TenRod key={index} index={index} compact={task.tens > 9} />}
                    />
                    <TowerColumn
                      title="Birlik"
                      count={task.ones}
                      color={ONE}
                      emptyLabel="0 birlik"
                      render={(index) => <OneCube key={index} index={index} />}
                    />
                  </div>

                  <div className="grid content-center gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 text-center">
                    <Sparkles className="mx-auto h-9 w-9 text-[#FFB020]" />
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/44">{stageNumberLabel}</p>
                    <p className="text-5xl font-black text-white">{stageNumber}</p>
                    <div className="grid gap-2 text-left">
                      <CountChip label="Yüzlük" value={task.hundreds} color={HUNDRED} />
                      <CountChip label="Onluk" value={task.tens} color={TEN} />
                      <CountChip label="Birlik" value={task.ones} color={ONE} />
                    </div>
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
              <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]/74">Kule kutlaması</p>
              <h2 className="mt-2 text-2xl font-black">Tüm katlar tamam!</h2>
              <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">Sayıları yüzlük, onluk ve birlik katlarıyla kurdun.</p>
              <div className="mt-6 rounded-3xl border border-emerald-300/22 bg-emerald-300/10 px-6 py-4">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Görevler tamam</p>
                <p className="mt-1 text-4xl font-black text-emerald-300">{tasks.length}/{tasks.length}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]/74">Cevap kartları</p>
              <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
              <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
                Büyük parça yüzlük, çubuk onluk, küçük küp birliktir.
              </p>

              <div
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
                    onClick={() => choose(choice)}
                    selected={selected === choice}
                    feedback={feedback}
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

function TowerColumn({
  title,
  count,
  color,
  emptyLabel,
  render,
}: {
  title: string;
  count: number;
  color: string;
  emptyLabel: string;
  render: (index: number) => React.ReactNode;
}) {
  return (
    <div className="min-h-[330px] rounded-[1.6rem] border bg-black/20 p-3" style={{ borderColor: `${color}2F`, backgroundColor: `${color}12` }}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/54">{title}</p>
        <span className="rounded-full border px-3 py-1 text-sm font-black" style={{ borderColor: `${color}44`, color }}>
          {count}
        </span>
      </div>
      {count === 0 ? (
      <div className="grid min-h-[260px] place-items-center rounded-3xl border border-dashed border-white/12 bg-black/20 text-center">
          <span className="text-4xl font-black text-white/30">0</span>
          <span className="-mt-12 text-xs font-black uppercase tracking-[0.18em] text-white/34">{emptyLabel}</span>
        </div>
      ) : (
        <div className="grid max-h-[280px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: count }, (_, index) => render(index))}
        </div>
      )}
    </div>
  );
}

function HundredSlab({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0.78, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.035 }}
      className="aspect-square rounded-2xl border border-[#A78BFA]/35 bg-[#A78BFA]/14 p-2 shadow-[0_0_24px_rgba(167,139,250,0.14)]"
      aria-label="bir yüzlük"
    >
      <div className="grid h-full grid-cols-4 gap-1">
        {Array.from({ length: 16 }, (_, cell) => (
          <div key={cell} className="rounded bg-[#A78BFA]/46 shadow-[inset_0_0_8px_rgba(255,255,255,0.16)]" />
        ))}
      </div>
    </motion.div>
  );
}

function TenRod({ index, compact }: { index: number; compact: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.78, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className={`${compact ? 'h-20' : 'h-24'} grid grid-rows-5 gap-1 rounded-2xl border border-[#FFB020]/34 bg-[#FFB020]/14 p-1.5 shadow-[0_0_22px_rgba(255,176,32,0.14)]`}
      aria-label="bir onluk"
    >
      {Array.from({ length: 5 }, (_, row) => (
        <div key={row} className="grid grid-cols-2 gap-1">
          <div className="rounded bg-[#FFB020]/58 shadow-[inset_0_0_8px_rgba(255,255,255,0.14)]" />
          <div className="rounded bg-[#FFB020]/42 shadow-[inset_0_0_8px_rgba(255,255,255,0.12)]" />
        </div>
      ))}
    </motion.div>
  );
}

function OneCube({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.035 }}
      className="aspect-square rounded-2xl border border-[#34D399]/30 bg-[#34D399]/18 shadow-[0_0_20px_rgba(52,211,153,0.14)]"
      aria-label="bir birlik"
    />
  );
}

function CountChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/24 px-3 py-2">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/46">{label}</span>
      <span className="text-xl font-black" style={{ color }}>{value}</span>
    </div>
  );
}

function ChoiceButton({
  choice,
  onClick,
  selected,
  feedback,
}: {
  choice: string;
  onClick: () => void;
  selected: boolean;
  feedback: 'idle' | 'success' | 'error';
}) {
  const isSuccess = selected && feedback === 'success';
  const isError = selected && feedback === 'error';
  const stateClass = isSuccess
    ? 'border-emerald-300/70 bg-emerald-300/18 text-white shadow-[0_0_34px_rgba(52,211,153,0.32)]'
    : isError
      ? 'border-rose-300/70 bg-rose-400/16 text-white shadow-[0_0_28px_rgba(251,113,133,0.26)]'
      : selected
        ? 'border-white/40 bg-white/16 text-white'
        : 'border-white/10 bg-white/[0.06] text-white/86 hover:bg-white/[0.10]';

  return (
    <motion.button
      type="button"
      data-testid={`place-value-tower-3-choice-${choice.replaceAll(' ', '-')}`}
      aria-label={`${choice} cevap kartı`}
      whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined}
      whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined}
      animate={isSuccess ? { scale: [1, 1.05, 1] } : isError ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0, scale: 1 }}
      transition={{ duration: isSuccess ? 0.42 : 0.34 }}
      onClick={onClick}
      className={`min-h-16 rounded-3xl border px-4 py-3 text-lg font-black leading-snug transition ${stateClass}`}
    >
      {choice}
    </motion.button>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.34)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Kule Tamam!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Üç basamaklı sayıları yüzlük, onluk ve birlik katlarıyla okudun.
      </p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]">Kazanılan atomlar</p>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          {PLACE_VALUE_ATOMS.map((atom) => (
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
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-[#07101d]"
          style={{ background: `linear-gradient(90deg, ${ACCENT}, #B388FF)` }}
        >
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
