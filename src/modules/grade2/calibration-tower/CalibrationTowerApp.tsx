import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Clock3, Home, Ruler, RotateCcw, Star } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2MissionFrame } from '../shared/Grade2MissionKit';
import {
  CALIBRATION_TOWER_ATOMS,
  createCalibrationTasks,
  type CalibrationTask,
} from './calibrationTowerTasks';

const MODULE_ID = 'calibration-tower';
const ACCENT = '#38BDF8';

export default function CalibrationTowerApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<CalibrationTask[]>(() => createCalibrationTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    CALIBRATION_TOWER_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(130);
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
    setTasks(createCalibrationTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 150, text: 'Kalibrasyon kulesi hazır! Saat, sıvı ve ölçme araçlarını doğru ayarladın.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title="Kalibrasyon Kulesi"
      subtitle="İlkokul 2. Sınıf / Saat, Sıvı ve Ölçme"
      icon={<Ruler className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="calibration-tower-stage"
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#38BDF8]/18 bg-[radial-gradient(circle_at_50%_12%,rgba(56,189,248,0.13),transparent_34%),linear-gradient(180deg,rgba(7,21,35,0.94),rgba(5,12,22,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence>
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
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#38BDF8]/74">Ayar zamanı</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
              </div>
              <CalibrationStage task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="calibration-tower-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#38BDF8]/74">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
        <div
          data-testid="calibration-tower-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Kule tamamlandı.' : task.prompt}</p>
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
    </Grade2MissionFrame>
  );
}

function CalibrationStage({ task, feedback }: { task: CalibrationTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      {task.kind === 'clock-read' || task.kind === 'clock-set' ? (
        <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
          <ClockFace hour={task.hour ?? 1} minute={task.minute ?? 0} />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 text-center">
            <Clock3 className="mx-auto h-9 w-9 text-[#38BDF8]" />
            <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/44">Dijital panel</p>
            <p className="mt-2 text-4xl font-black text-white">{task.kind === 'clock-set' ? `${String(task.hour).padStart(2, '0')}.${String(task.minute).padStart(2, '0')}` : '??.??'}</p>
            <p className="mt-3 text-sm font-bold leading-relaxed text-white/54">{task.kind === 'clock-set' ? 'Yelkovanın yerini seç.' : 'Akrep ve yelkovanı oku.'}</p>
          </div>
        </div>
      ) : task.kind === 'tool' ? (
        <ToolScene />
      ) : task.kind === 'liquid' ? (
        <LiquidScene cups={task.cups ?? 4} />
      ) : (
        <LengthScene lengthCm={task.lengthCm ?? 12} />
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
        {feedback === 'success' ? 'Doğru!' : feedback === 'error' ? 'Tekrar dene' : 'Göstergeyi izle'}
      </div>
    </div>
  );
}

function ClockFace({ hour, minute }: { hour: number; minute: number }) {
  const hourRotation = (hour % 12) * 30 + minute * 0.5;
  const minuteRotation = minute * 6;
  const marks = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className="grid place-items-center rounded-[2rem] border border-[#38BDF8]/18 bg-[#061321]/90 p-6">
      <div
        data-testid="calibration-clock-face"
        data-hour={hour}
        data-minute={minute}
        className="relative h-72 w-72 overflow-hidden rounded-full border border-[#38BDF8]/35 bg-[radial-gradient(circle_at_50%_45%,rgba(56,189,248,0.18),rgba(2,8,18,0.94)_64%)] shadow-[0_0_38px_rgba(56,189,248,0.16)]"
      >
        {marks.map((mark) => {
          const angle = mark * 30;
          return (
            <span
              key={mark}
              className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/[0.06] text-sm font-black text-white/80"
              style={{ transform: `rotate(${angle}deg) translateY(-112px) rotate(-${angle}deg)` }}
            >
              {mark}
            </span>
          );
        })}
        <span className="absolute left-1/2 top-1/2 z-10 h-0 w-0" style={{ transform: `rotate(${hourRotation}deg)` }}>
          <span className="absolute bottom-0 left-[-4px] h-20 w-2 rounded-full bg-white" />
        </span>
        <span className="absolute left-1/2 top-1/2 z-10 h-0 w-0" style={{ transform: `rotate(${minuteRotation}deg)` }}>
          <span className="absolute bottom-0 left-[-3px] h-24 w-1.5 rounded-full bg-[#38BDF8]" />
        </span>
        <span className="absolute left-1/2 top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#38BDF8] shadow-[0_0_22px_rgba(56,189,248,0.60)]" />
      </div>
    </div>
  );
}

function ToolScene() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Değişen ölçü</p>
        <div className="mt-5 flex items-end gap-4">
          <div className="h-16 w-24 rounded-2xl bg-[#38BDF8]/24" />
          <div className="h-20 w-32 rounded-2xl bg-[#B388FF]/24" />
        </div>
        <p className="mt-4 text-sm font-bold text-white/58">Karış ve adım herkeste aynı olmayabilir.</p>
      </div>
      <div className="rounded-[2rem] border border-[#38BDF8]/24 bg-[#38BDF8]/10 p-5">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#38BDF8]">Ortak araç</p>
        <div className="mt-6 h-14 rounded-2xl border border-white/20 bg-white/12 p-2">
          <div className="flex h-full items-end justify-between">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className="w-1 rounded-full bg-white/78" style={{ height: index % 2 === 0 ? 30 : 18 }} />
            ))}
          </div>
        </div>
        <p className="mt-4 text-sm font-bold text-white/66">Cetvel aynı sonucu verir.</p>
      </div>
    </div>
  );
}

function LiquidScene({ cups }: { cups: number }) {
  return (
    <div data-testid="calibration-liquid-scene" data-cups={cups} className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_210px]">
      <div className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Bardak izleri</p>
        <div className="mt-5 grid grid-cols-5 gap-3">
          {Array.from({ length: cups }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.55, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="h-20 rounded-b-3xl rounded-t-xl border border-[#38BDF8]/38 bg-[linear-gradient(180deg,rgba(56,189,248,0.18),rgba(56,189,248,0.62))]"
            />
          ))}
        </div>
      </div>
      <div className="flex h-72 items-end rounded-[2rem] border border-[#38BDF8]/30 bg-white/[0.04] p-4">
        <motion.div initial={{ height: '20%' }} animate={{ height: `${Math.min(92, cups * 18)}%` }} className="w-full rounded-3xl bg-[linear-gradient(180deg,#7DD3FC,#0284C7)] shadow-[0_0_30px_rgba(56,189,248,0.28)]" />
      </div>
    </div>
  );
}

function LengthScene({ lengthCm }: { lengthCm: number }) {
  return (
    <div data-testid="calibration-length-scene" data-length-cm={lengthCm} className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Cetvel kontrolü</p>
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <div className="relative h-14 rounded-full bg-[linear-gradient(90deg,#FDE68A,#F59E0B)] shadow-[0_0_24px_rgba(245,158,11,0.20)]" style={{ width: `${Math.min(90, lengthCm * 5.2)}%` }}>
          <span className="absolute -right-3 top-1/2 h-10 w-10 -translate-y-1/2 rotate-45 rounded-sm bg-[#F59E0B]" />
        </div>
        <div className="mt-5 flex items-end justify-between rounded-2xl border border-[#38BDF8]/24 bg-[#38BDF8]/10 px-3 py-2">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} className="flex flex-col items-center gap-1 text-[10px] font-black text-white/48">
              <span className="w-1 rounded-full bg-[#38BDF8]" style={{ height: index % 5 === 0 ? 24 : 14 }} />
              {index % 5 === 0 ? index : ''}
            </span>
          ))}
        </div>
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
    <motion.button
      type="button"
      data-testid="calibration-tower-choice"
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
      data-testid="calibration-tower-complete"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">Kule ayarlandı!</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">Saatleri, sıvıyı ve ölçme araçlarını doğru kalibre ettin.</p>
      <div className="mt-5 max-h-72 w-full space-y-2 overflow-y-auto rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#38BDF8]">Kazanılan atomlar</p>
        {CALIBRATION_TOWER_ATOMS.map((atom) => (
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
          data-testid="calibration-tower-restart"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80"
        >
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#38BDF8,#B388FF)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
