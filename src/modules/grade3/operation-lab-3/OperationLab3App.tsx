import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Calculator, CheckCircle2, Home, RotateCcw, Sparkles, Star } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2ChoiceButton, Grade2MissionFrame } from '../../grade2/shared/Grade2MissionKit';
import { MiniBlocks } from './OperationLab3Models';
import {
  createOperationLab3Tasks,
  OPERATION_LAB_3_ATOMS,
  type OperationLabTask,
} from './operationLab3Tasks';

const MODULE_ID = 'operation-lab-3';
const ACCENT = '#34D399';

export default function OperationLab3App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [runSeed, setRunSeed] = useState(() => Math.floor(Math.random() * 1_000_000));
  const [tasks, setTasks] = useState<OperationLabTask[]>(() => createOperationLab3Tasks(runSeed));
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    OPERATION_LAB_3_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(140);
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
    setTasks(createOperationLab3Tasks(nextSeed));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 360, text: 'İşlem makinesi hazır! Tahmin, taşıma, bozma, kalan ve denge görevlerini tamamladın.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title="Dört İşlem Makinesi"
      subtitle="İlkokul 3. Sınıf / Dört İşlem ve Problem"
      icon={<Calculator className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="operation-lab-3-stage"
        data-answer={task.answer}
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#34D399]/22 bg-[radial-gradient(circle_at_50%_12%,rgba(52,211,153,0.16),transparent_34%),linear-gradient(180deg,rgba(7,28,23,0.96),rgba(6,12,22,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
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
                  İşlem makinesi
                </p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/60 md:text-base">{task.prompt}</p>
              </div>
              <OperationMachine task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="operation-lab-3-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#34D399]/78">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru kartı seç.</h2>
        <div
          data-testid="operation-lab-3-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Dört İşlem Makinesi tamam.' : task.prompt}</p>
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
                <span data-testid="operation-lab-3-choice" className="block text-base leading-snug md:text-lg">{choice}</span>
              </Grade2ChoiceButton>
            ))}
          </div>
        )}
      </aside>
    </Grade2MissionFrame>
  );
}

function OperationMachine({ task, feedback }: { task: OperationLabTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      <div
        data-testid="operation-lab-3-hint-strip"
        className="mb-4 flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.05] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Kısa ipucu</p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-white/62">{task.hint}</p>
        </div>
        <div
          className={`shrink-0 rounded-2xl border px-4 py-3 text-center text-sm font-black ${
            feedback === 'success'
              ? 'border-emerald-300/50 bg-emerald-300/12 text-emerald-200'
              : feedback === 'error'
                ? 'border-rose-300/50 bg-rose-400/12 text-rose-100'
                : 'border-white/10 bg-black/24 text-white/60'
          }`}
        >
          {feedback === 'success' ? 'Makine kilitlendi' : feedback === 'error' ? 'Tekrar dene' : 'Kartı seç'}
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-[#06131F]/92 p-4 md:p-5">
        <div className="grid min-h-72 place-items-center">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_80px_1fr]">
              <MachineBox label="Giren işlem" value={task.expression} color="#22D3EE" />
              <div className="grid place-items-center">
                <motion.div
                  animate={feedback === 'error' ? { x: [0, -8, 7, -4, 0] } : { x: 0 }}
                  className="grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-white/[0.08]"
                  style={{ boxShadow: `0 0 28px ${task.color}33` }}
                >
                  <Sparkles className="h-7 w-7" style={{ color: task.color }} />
                </motion.div>
              </div>
              <MachineBox label="Çıkış" value="?" color={task.color} />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {task.chips.map((chip) => (
                <span key={chip} className="rounded-2xl border border-white/10 bg-black/24 px-4 py-2 text-sm font-black text-white/70">
                  {chip}
                </span>
              ))}
            </div>
            <MiniBlocks task={task} feedback={feedback} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MachineBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-black/24 p-4 text-center">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">{label}</p>
      <p className="mt-3 text-3xl font-black leading-tight" style={{ color }}>{value}</p>
    </div>
  );
}

function CompletionCard({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section
      data-testid="operation-lab-3-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">İşlem makinesi hazır!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        Tahmin ettin, taşıdın, bozdun, kalanı buldun ve problemleri sıraya koydun.
      </p>
      <div className="mt-5 max-h-72 w-full space-y-2 overflow-y-auto rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#34D399]">Kazanılan atomlar</p>
        {OPERATION_LAB_3_ATOMS.map((atom) => (
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
        <motion.button type="button" data-testid="operation-lab-3-restart" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onRestart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80">
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#34D399,#22D3EE)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
