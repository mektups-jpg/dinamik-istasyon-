import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, CreditCard, Home, RotateCcw, ShoppingBag, Star } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2MissionFrame } from '../shared/Grade2MissionKit';
import {
  CANTEEN_CASH_ATOMS,
  createCanteenCashTasks,
  formatMoney,
  type CanteenTask,
} from './canteenCashTasks';

const MODULE_ID = 'canteen-cash-terminal';
const ACCENT = '#FACC15';

export default function CanteenCashTerminalApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<CanteenTask[]>(() => createCanteenCashTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    CANTEEN_CASH_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(100);
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
    setTasks(createCanteenCashTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 240, text: 'Kasa terminali tamam! Paraları topladın ve para üstünü buldun.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title="Kasa Terminali"
      subtitle="İlkokul 2. Sınıf / Paralar ve Para Üstü"
      icon={<CreditCard className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="canteen-cash-terminal-stage"
        data-answer={task.answer}
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#FACC15]/20 bg-[radial-gradient(circle_at_50%_12%,rgba(250,204,21,0.14),transparent_34%),linear-gradient(180deg,rgba(18,19,9,0.96),rgba(7,12,20,0.97))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
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
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#FACC15]/74">Kasa terminali</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/60 md:text-base">{task.prompt}</p>
              </div>
              <CanteenStage task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="canteen-cash-terminal-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FACC15]/74">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
        <div
          data-testid="canteen-cash-terminal-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Kasa tamamlandı.' : task.prompt}</p>
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

function CanteenStage({ task, feedback }: { task: CanteenTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
        <ProductPanel product={task.product} price={task.price} />
        {task.kind === 'change' ? (
          <ChangePanel paidValues={task.paidValues ?? []} />
        ) : (
          <TargetPanel price={task.price} />
        )}
      </div>
      <div
        className={`mx-auto mt-4 w-fit rounded-full border px-5 py-2 text-sm font-black ${
          feedback === 'success'
            ? 'border-emerald-300/50 bg-emerald-300/12 text-emerald-200'
            : feedback === 'error'
              ? 'border-rose-300/50 bg-rose-400/12 text-rose-100'
              : 'border-white/10 bg-white/[0.05] text-white/58'
        }`}
      >
        {feedback === 'success' ? 'Doğru!' : feedback === 'error' ? 'Tekrar dene' : 'Paraları say'}
      </div>
    </div>
  );
}

function ProductPanel({ product, price }: { product: string; price: number }) {
  return (
    <div className="rounded-[2rem] border border-[#FACC15]/22 bg-[#0A1420]/92 p-5 text-center">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] border border-[#FACC15]/22 bg-[#FACC15]/12">
        <ShoppingBag className="h-11 w-11 text-[#FACC15]" />
      </div>
      <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Ürün</p>
      <h3 className="mt-2 text-2xl font-black text-white">{product}</h3>
      <div className="mx-auto mt-5 w-fit rounded-[1.5rem] border border-[#FACC15]/30 bg-[#FACC15]/12 px-7 py-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#FACC15]/80">Fiyat</p>
        <p className="text-5xl font-black text-white">{price} TL</p>
      </div>
    </div>
  );
}

function TargetPanel({ price }: { price: number }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#07111D]/92 p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Kasa ekranı</p>
      <h3 className="mt-2 text-2xl font-black text-white">{price} TL yap.</h3>
      <div className="mt-5 grid min-h-48 place-items-center rounded-[2rem] border border-dashed border-[#FACC15]/28 bg-[#FACC15]/8">
        <div className="text-center">
          <p className="text-6xl font-black text-[#FACC15]">{price}</p>
          <p className="mt-1 text-sm font-black text-white/58">TL hedefi</p>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-bold text-white/54">Sağdaki cüzdanlardan toplamı aynı olanı seç.</p>
    </div>
  );
}

function ChangePanel({ paidValues }: { paidValues: number[] }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#07111D]/92 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Ödenen para</p>
          <h3 className="mt-2 text-2xl font-black text-white">{formatMoney(paidValues)}</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/42">Para üstü</p>
          <p className="text-3xl font-black text-[#FACC15]">?</p>
        </div>
      </div>
      <MoneyTray values={paidValues} />
      <p className="mt-4 text-center text-sm font-bold text-white/54">Ödenen paradan ürün fiyatını çıkar.</p>
    </div>
  );
}

function MoneyTray({ values }: { values: number[] }) {
  return (
    <div data-testid="canteen-cash-terminal-money-tray" className="mt-5 flex min-h-48 flex-wrap items-center justify-center gap-4 rounded-[2rem] border border-white/10 bg-black/24 p-4">
      {values.map((value, index) => (
        <MoneyPiece key={`${value}-${index}`} value={value} />
      ))}
    </div>
  );
}

function MoneyPiece({ value }: { value: number }) {
  if (value === 1) {
    return (
      <motion.div
        initial={{ scale: 0.72, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        className="grid h-24 w-24 place-items-center rounded-full border-[6px] border-[#E5E7EB] bg-[radial-gradient(circle,#FDE68A_0_44%,#A16207_45%_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.28)]"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#111827]/86">
          <p className="text-center text-xl font-black leading-none text-white">1<br /><span className="text-[10px]">TL</span></p>
        </div>
      </motion.div>
    );
  }

  const colors: Record<number, string> = {
    5: '#B388FF',
    10: '#38BDF8',
    20: '#34D399',
    50: '#F472B6',
  };
  const color = colors[value] ?? '#FACC15';

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative h-24 w-40 overflow-hidden rounded-[1.4rem] border border-white/22 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.28)]"
      style={{ background: `linear-gradient(135deg, ${color}, #111827)` }}
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/18" />
      <div className="absolute bottom-3 left-3 right-3 h-3 rounded-full bg-white/22" />
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/70">Kağıt para</p>
      <p className="mt-2 text-4xl font-black text-white">{value}</p>
      <p className="text-sm font-black text-white/74">TL</p>
    </motion.div>
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
    <motion.button
      type="button"
      data-testid="canteen-cash-terminal-choice"
      whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined}
      whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined}
      disabled={feedback !== 'idle'}
      onClick={onClick}
      className={`min-h-16 rounded-3xl border px-4 py-3 text-lg font-black transition ${stateClass} disabled:cursor-not-allowed disabled:opacity-80`}
    >
      {choice}
    </motion.button>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      data-testid="canteen-cash-terminal-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Kasa terminali hazır!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">Paraları birleştirdin, fiyatı okudun ve para üstünü buldun.</p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FACC15]">Kazanılan atomlar</p>
        <div className="mt-3 space-y-2">
          {CANTEEN_CASH_ATOMS.map((atom) => (
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
        <motion.button type="button" data-testid="canteen-cash-terminal-restart" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onRestart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80">
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#FACC15,#B388FF)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
