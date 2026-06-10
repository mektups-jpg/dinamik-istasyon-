import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Clock3,
  Coins,
  Droplets,
  Home,
  RotateCcw,
  Ruler,
  Scale,
  Sparkles,
  Star,
  Timer,
} from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2ChoiceButton, Grade2MissionFrame } from '../../grade2/shared/Grade2MissionKit';
import {
  createUnitConverter3Tasks,
  UNIT_CONVERTER_3_ATOMS,
  type UnitConverterAtom,
  type UnitConverterTask,
} from './unitConverter3Tasks';

const ACCENT = '#22D3EE';
const CLOCK_HOUR_COLOR = '#A78BFA';
const CLOCK_MINUTE_COLOR = '#22D3EE';
const UNIT_CONVERTER_3_LEGACY_QA_IDS = [
  'unit-converter-3-stage',
  'unit-converter-3-control-panel',
  'unit-converter-3-choice',
  'unit-converter-3-feedback',
  'unit-converter-3-complete',
  'unit-converter-3-restart',
];

export interface UnitConverter3ExperienceProps {
  moduleId: string;
  title: string;
  subtitle: string;
  accent: string;
  icon: React.ReactNode;
  atoms: UnitConverterAtom[];
  createTasks: (seed?: number) => UnitConverterTask[];
  completionTitle: string;
  completionBody: string;
  botSuccessText: string;
  score: number;
  testIdPrefix: string;
}

export default function UnitConverter3App() {
  return (
    <UnitConverter3Experience
      moduleId="unit-converter-3"
      title="Birim Dönüşüm İstasyonu"
      subtitle="İlkokul 3. Sınıf / Zaman, Ölçü ve Para"
      icon={<Timer className="h-6 w-6" />}
      accent={ACCENT}
      atoms={UNIT_CONVERTER_3_ATOMS}
      createTasks={createUnitConverter3Tasks}
      completionTitle="Birim Dönüşüm İstasyonu hazır!"
      completionBody="Saat, uzunluk, kütle, para ve sıvı ölçülerini doğru dönüştürdün."
      botSuccessText="Birim Dönüşüm İstasyonu hazır! Saat, uzunluk, kütle, para ve sıvı ölçülerini kilitledin."
      score={130}
      testIdPrefix={UNIT_CONVERTER_3_LEGACY_QA_IDS[0].replace('-stage', '')}
    />
  );
}

export function UnitConverter3Experience({
  moduleId,
  title,
  subtitle,
  accent,
  icon,
  atoms,
  createTasks,
  completionTitle,
  completionBody,
  botSuccessText,
  score,
  testIdPrefix,
}: UnitConverter3ExperienceProps) {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [runSeed, setRunSeed] = useState(() => Math.floor(Math.random() * 1000));
  const [tasks, setTasks] = useState<UnitConverterTask[]>(() => createTasks(runSeed));
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    atoms.forEach((atom) => unlockAtom(atom.id));
    unlockModule(moduleId);
    addScore(score);
  }, [addScore, atoms, isComplete, moduleId, score, unlockAtom, unlockModule]);

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
    setTasks(createTasks(nextSeed));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 370, text: botSuccessText, type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [botSuccessText, feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title={title}
      subtitle={subtitle}
      icon={icon}
      accent={accent}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid={`${testIdPrefix}-stage`}
        data-answer={task.answer}
        data-complete={isComplete ? 'true' : 'false'}
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#22D3EE]/22 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,rgba(7,21,35,0.96),rgba(5,12,22,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <CompletionCard
              key="complete"
              atoms={atoms}
              completionTitle={completionTitle}
              completionBody={completionBody}
              onRestart={restart}
              testIdPrefix={testIdPrefix}
            />
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
                  Dönüşüm makinesi
                </p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/60 md:text-base">{task.prompt}</p>
              </div>
              <ConverterMachine task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid={`${testIdPrefix}-control-panel`}
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE]/78">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru sonucu seç.</h2>
        <div
          data-testid={`${testIdPrefix}-feedback`}
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? `${title} tamam.` : task.prompt}</p>
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
                <span data-testid={`${testIdPrefix}-choice`} className="block text-base leading-snug md:text-lg">{choice}</span>
              </Grade2ChoiceButton>
            ))}
          </div>
        )}
      </aside>
    </Grade2MissionFrame>
  );
}

function ConverterMachine({ task, feedback }: { task: UnitConverterTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="rounded-[2rem] border border-white/10 bg-[#06131F]/92 p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_76px_1fr]">
            <MachineBox label={task.inputLabel} value={task.inputValue} color="#22D3EE" />
            <div className="grid place-items-center">
              <motion.div
                animate={feedback === 'error' ? { x: [0, -8, 7, -4, 0] } : { rotate: feedback === 'success' ? [0, 12, -8, 0] : 0 }}
                className="grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-white/[0.08]"
                style={{ boxShadow: `0 0 28px ${task.color}33` }}
              >
                <Sparkles className="h-7 w-7" style={{ color: task.color }} />
              </motion.div>
            </div>
            <MachineBox label={task.outputLabel} value="?" color={task.color} />
          </div>
          <Scene task={task} />
        </div>
        <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.05] p-4">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">Kısa ipucu</p>
            <p className="mt-3 text-sm font-bold leading-relaxed text-white/58">{task.hint}</p>
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
            {feedback === 'success' ? 'Dönüşüm kilitlendi' : feedback === 'error' ? 'Tekrar dene' : 'Kartı seç'}
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
      <p className="mt-3 break-words text-2xl font-black leading-tight md:text-3xl" style={{ color }}>{value}</p>
    </div>
  );
}

function Scene({ task }: { task: UnitConverterTask }) {
  return (
    <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/24 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-black text-white/68">
          <SceneIcon kind={task.kind} color={task.color} />
          <span>Canlı model</span>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {task.tokens.map((token) => (
            <span key={token} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white/64">
              {token}
            </span>
          ))}
        </div>
      </div>
      {task.kind === 'clock' && task.clock ? <ClockScene task={task} /> : <TokenScene task={task} />}
    </div>
  );
}

function SceneIcon({ kind, color }: { kind: UnitConverterTask['kind']; color: string }) {
  const className = 'h-5 w-5';
  if (kind === 'clock' || kind === 'time' || kind === 'duration') return <Clock3 className={className} style={{ color }} />;
  if (kind === 'length') return <Ruler className={className} style={{ color }} />;
  if (kind === 'mass') return <Scale className={className} style={{ color }} />;
  if (kind === 'money') return <Coins className={className} style={{ color }} />;
  return <Droplets className={className} style={{ color }} />;
}

function ClockScene({ task }: { task: UnitConverterTask }) {
  const hour = task.clock?.hour ?? 1;
  const minute = task.clock?.minute ?? 0;
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const center = 128;
  const minuteHand = pointOnClock(center, 74, minuteAngle);
  const hourHand = pointOnClock(center, 54, hourAngle);

  return (
    <div className="grid place-items-center py-2">
      <div className="relative grid h-72 w-72 place-items-center rounded-full border border-white/14 bg-[#071522] shadow-[0_0_40px_rgba(34,211,238,0.16)]">
        <svg viewBox="0 0 256 256" role="img" aria-label={`${hour}:${String(minute).padStart(2, '0')} analog saat modeli`} className="h-full w-full overflow-visible">
          <circle cx={center} cy={center} r="116" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          {Array.from({ length: 60 }).map((_, index) => {
            const outer = pointOnClock(center, 108, index * 6);
            const inner = pointOnClock(center, index % 5 === 0 ? 98 : 103, index * 6);
            return (
              <line
                key={`tick-${index}`}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={index % 5 === 0 ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.14)'}
                strokeLinecap="round"
                strokeWidth={index % 5 === 0 ? 3 : 1.5}
              />
            );
          })}
          {Array.from({ length: 12 }).map((_, index) => {
            const number = index === 0 ? 12 : index;
            const point = pointOnClock(center, 88, index * 30);
            return (
              <g key={`number-${number}`}>
                <circle cx={point.x} cy={point.y} r="13" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
                <text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.76)"
                className="text-[11px] font-black"
                >
                  {number}
                </text>
              </g>
            );
          })}
          <line
            x1={center}
            y1={center}
            x2={hourHand.x}
            y2={hourHand.y}
            stroke={CLOCK_HOUR_COLOR}
            strokeLinecap="round"
            strokeWidth="8"
          />
          <line
            x1={center}
            y1={center}
            x2={minuteHand.x}
            y2={minuteHand.y}
            stroke={CLOCK_MINUTE_COLOR}
            strokeLinecap="round"
            strokeWidth="5"
          />
          <circle cx={center} cy={center} r="8" fill="white" filter="drop-shadow(0 0 12px rgba(255,255,255,0.72))" />
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-[10px] font-black text-white/64">
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1" style={{ color: CLOCK_HOUR_COLOR }}>
          Akrep: saat
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1" style={{ color: CLOCK_MINUTE_COLOR }}>
          Yelkovan: dakika
        </span>
      </div>
    </div>
  );
}

function pointOnClock(center: number, radius: number, degrees: number) {
  const radians = (degrees - 90) * (Math.PI / 180);
  return {
    x: center + Math.cos(radians) * radius,
    y: center + Math.sin(radians) * radius,
  };
}

function TokenScene({ task }: { task: UnitConverterTask }) {
  const items = task.visualItems.length > 0 ? task.visualItems : task.tokens;
  const gridClass = items.length > 4
    ? 'grid-cols-2 sm:grid-cols-3'
    : items.length > 2
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="grid min-h-64 place-items-center rounded-[1.4rem] border border-white/10 bg-[#071522]/86 p-4">
      <div className={`grid w-full max-w-xl gap-3 ${gridClass}`}>
        {items.map((item, index) => (
          <motion.span
            key={`${item}-${index}`}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex min-h-16 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.07] px-3 text-center text-sm font-black text-white/78"
            style={{ boxShadow: `0 0 18px ${task.color}30` }}
          >
            <SceneIcon kind={task.kind} color={task.color} />
            <span className="leading-tight">{item}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function CompletionCard({
  atoms,
  completionTitle,
  completionBody,
  onRestart,
  testIdPrefix,
}: {
  atoms: UnitConverterAtom[];
  completionTitle: string;
  completionBody: string;
  onRestart: () => void;
  testIdPrefix: string;
}) {
  return (
    <motion.section
      data-testid={`${testIdPrefix}-complete`}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">{completionTitle}</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">
        {completionBody}
      </p>
      <div className="mt-5 max-h-72 w-full space-y-2 overflow-y-auto rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE]">Kazanılan atomlar</p>
        {atoms.map((atom) => (
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
        <motion.button type="button" data-testid={`${testIdPrefix}-restart`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onRestart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80">
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#22D3EE,#34D399)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
