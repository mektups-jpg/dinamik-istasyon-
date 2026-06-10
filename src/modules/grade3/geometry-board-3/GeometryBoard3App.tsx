import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Ruler, Shapes, Sparkles } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import {
  Grade2ChoiceButton,
  Grade2Completion,
  Grade2MissionFrame,
} from '../../grade2/shared/Grade2MissionKit';
import {
  createGeometryBoard3Tasks,
  GEOMETRY_BOARD_3_ATOMS,
  type BoardPoint,
  type GeometryBoardTask,
} from './geometryBoard3Tasks';

const MODULE_ID = 'geometry-board-3';
const ACCENT = '#22D3EE';

export default function GeometryBoard3App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [runSeed, setRunSeed] = useState(() => Math.floor(Math.random() * 1000));
  const [tasks, setTasks] = useState<GeometryBoardTask[]>(() => createGeometryBoard3Tasks(runSeed));
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    GEOMETRY_BOARD_3_ATOMS.forEach((atom) => unlockAtom(atom.id));
    unlockModule(MODULE_ID);
    addScore(125);
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
    setTasks(createGeometryBoard3Tasks(nextSeed));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 390, text: 'Geometri tahtası hazır! Cisim, çokgen, çevre ve simetri görevlerini kilitledin.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [feedback, isComplete, task, taskIndex]);

  return (
    <Grade2MissionFrame
      title="Dijital Geometri Tahtası"
      subtitle="İlkokul 3. Sınıf / Çokgen, Çevre ve Simetri"
      icon={<Shapes className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex + 1}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="geometry-board-3-stage"
        data-answer={task.answer}
        data-complete={isComplete ? 'true' : 'false'}
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#22D3EE]/22 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,rgba(7,21,35,0.96),rgba(5,12,22,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <div key="complete" data-testid="geometry-board-3-complete" className="w-full">
              <Grade2Completion
                title="Geometri tahtası hazır!"
                message="Cisim özelliklerini saydın, çokgeni tanıdın, çevreyi topladın ve simetriyi tamamladın."
                atoms={GEOMETRY_BOARD_3_ATOMS}
                accent={ACCENT}
                onRestart={restart}
              />
            </div>
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
                  Geometri tahtası
                </p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-relaxed text-white/60 md:text-base">{task.prompt}</p>
              </div>
              <GeometryBoard task={task} feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside
        data-testid="geometry-board-3-control-panel"
        className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE]/78">Cevap kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru kartı seç.</h2>
        <div
          data-testid="geometry-board-3-feedback"
          className={`mt-5 rounded-3xl border p-4 ${
            feedback === 'success'
              ? 'border-emerald-300/34 bg-emerald-300/10'
              : feedback === 'error'
                ? 'border-rose-300/34 bg-rose-400/10'
                : 'border-white/10 bg-black/24'
          }`}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
          <p className="mt-2 text-lg font-black leading-snug text-white">{isComplete ? 'Tahta tamamlandı.' : task.prompt}</p>
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
                <span data-testid="geometry-board-3-choice" className="block text-base leading-snug md:text-lg">
                  {choice}
                </span>
              </Grade2ChoiceButton>
            ))}
          </div>
        )}
      </aside>
    </Grade2MissionFrame>
  );
}

function GeometryBoard({ task, feedback }: { task: GeometryBoardTask; feedback: 'idle' | 'success' | 'error' }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 md:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="rounded-[2rem] border border-white/10 bg-[#06131F]/92 p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/46">{task.boardTitle}</p>
              <p className="mt-2 text-sm font-bold text-white/58">{task.boardHint}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {task.badges.map((badge) => (
                <span key={badge} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white/64">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <BoardSvg task={task} feedback={feedback} />
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
            {feedback === 'success' ? 'Tahta kilitlendi' : feedback === 'error' ? 'Tekrar dene' : 'Çivileri incele'}
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardSvg({ task, feedback }: { task: GeometryBoardTask; feedback: 'idle' | 'success' | 'error' }) {
  const points = useMemo(() => new Map(task.points.map((point) => [point.id, point])), [task.points]);
  const pinGrid = useMemo(
    () => Array.from({ length: 36 }, (_, index) => ({ x: index % 6, y: Math.floor(index / 6) })),
    [],
  );
  const glowColor = feedback === 'success' ? '#34D399' : feedback === 'error' ? '#FB7185' : task.color;

  return (
    <div data-testid="geometry-board-3-board" className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#071522] p-3 shadow-[inset_0_0_40px_rgba(34,211,238,0.08)]">
      <svg viewBox="0 0 400 360" role="img" aria-label={task.boardTitle} className="h-[360px] w-full">
        <defs>
          <filter id="geometry-board-glow" x="0" y="0" width="400" height="360" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {pinGrid.map((pin) => {
          const pos = toSvg(pin);
          return <circle key={`${pin.x}-${pin.y}`} cx={pos.x} cy={pos.y} r="4" fill="rgba(255,255,255,0.16)" />;
        })}

        {task.axisX !== undefined && (
          <line
            x1={toSvg({ x: task.axisX, y: 0 }).x}
            y1="28"
            x2={toSvg({ x: task.axisX, y: 0 }).x}
            y2="332"
            stroke="#FACC15"
            strokeWidth="4"
            strokeDasharray="10 10"
            opacity="0.9"
          />
        )}

        {task.closeShape && <ClosedShape task={task} />}

        {task.segments.map((segment, index) => {
          const start = points.get(segment.from);
          const end = points.get(segment.to);
          if (!start || !end) return null;
          const a = toSvg(start);
          const b = toSvg(end);
          return (
            <g key={`${segment.from}-${segment.to}-${index}`}>
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.42, delay: index * 0.04 }}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={segment.dashed ? '#FACC15' : glowColor}
                strokeWidth={segment.dashed ? 4 : 8}
                strokeLinecap="round"
                strokeDasharray={segment.dashed ? '10 10' : undefined}
                filter="url(#geometry-board-glow)"
              />
              {segment.length !== undefined && (
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 10} textAnchor="middle" className="fill-white text-[17px] font-black">
                  {segment.length}
                </text>
              )}
            </g>
          );
        })}

        {task.points.map((point) => {
          const pos = toSvg(point);
          return (
            <g key={point.id}>
              <motion.circle
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                cx={pos.x}
                cy={pos.y}
                r={point.ghost ? 12 : 14}
                fill={point.ghost ? 'rgba(250,204,21,0.18)' : task.color}
                stroke={point.ghost ? '#FACC15' : 'rgba(255,255,255,0.82)'}
                strokeWidth="3"
              />
              {point.label && (
                <text x={pos.x} y={pos.y - 24} textAnchor="middle" className="fill-white text-[15px] font-black">
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/32 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm font-black text-white/70">
          <Ruler className="h-4 w-4" style={{ color: task.color }} />
          <span>{kindLabel(task.kind)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-black text-white/58">
          <Sparkles className="h-4 w-4" style={{ color: glowColor }} />
          <span>{feedback === 'success' ? 'Doğru' : feedback === 'error' ? 'Bir daha bak' : 'Hazır'}</span>
        </div>
      </div>
    </div>
  );
}

function ClosedShape({ task }: { task: GeometryBoardTask }) {
  const path = task.points.map((point) => {
    const pos = toSvg(point);
    return `${pos.x},${pos.y}`;
  }).join(' ');

  return <polygon points={path} fill={`${task.color}18`} stroke={`${task.color}55`} strokeWidth="2" />;
}

function toSvg(point: Pick<BoardPoint, 'x' | 'y'>) {
  return { x: 46 + point.x * 62, y: 38 + point.y * 58 };
}

function kindLabel(kind: GeometryBoardTask['kind']) {
  if (kind.includes('solid')) return 'Cisim özellikleri';
  if (kind.includes('perimeter')) return 'Çevre yolu';
  if (kind.includes('symmetry') || kind.includes('mirror')) return 'Simetri aynası';
  if (kind === 'draw') return 'Sanal cetvel';
  return 'Çokgen tarayıcı';
}
