import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftRight, CheckCircle2, Rocket } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { formatTurkishDistributiveNumber } from '../../../lib/turkishText';
import { Grade2ChoiceButton, Grade2Completion, Grade2MissionFrame, Grade2Panel } from '../shared/Grade2MissionKit';

const ACCENT = '#00FF88';

type Direction = 'forward' | 'backward';
type Step = 2 | 3 | 4 | 5;

const STEP_THEMES: Record<Step, { accent: string; label: string }> = {
  2: { accent: '#00FF88', label: 'Yeşil ikişer ritim' },
  3: { accent: '#38E8FF', label: 'Mavi üçer ritim' },
  4: { accent: '#FFB020', label: 'Sarı dörder ritim' },
  5: { accent: '#B388FF', label: 'Mor beşer ritim' },
};

const STEP_ATOM_LABELS = [
  { id: 'MAT.2.1.4.1', label: `İleriye doğru ${formatTurkishDistributiveNumber(2)} ritmik sayar.` },
  { id: 'MAT.2.1.4.2', label: `İleriye doğru ${formatTurkishDistributiveNumber(3)} ritmik sayar.` },
  { id: 'MAT.2.1.4.3', label: `İleriye doğru ${formatTurkishDistributiveNumber(4)} ritmik sayar.` },
  { id: 'MAT.2.1.4.4', label: `İleriye doğru ${formatTurkishDistributiveNumber(5)} ritmik sayar.` },
  { id: 'MAT.2.1.4.5', label: `Geriye doğru ${formatTurkishDistributiveNumber(2)} ritmik sayar.` },
  { id: 'MAT.2.1.4.6', label: `Geriye doğru ${formatTurkishDistributiveNumber(3)} ritmik sayar.` },
  { id: 'MAT.2.1.4.7', label: `Geriye doğru ${formatTurkishDistributiveNumber(4)} ritmik sayar.` },
  { id: 'MAT.2.1.4.8', label: `Geriye doğru ${formatTurkishDistributiveNumber(5)} ritmik sayar.` },
];
const STEP_ATOMS = {
  '2-forward': 'MAT.2.1.4.1',
  '3-forward': 'MAT.2.1.4.2',
  '4-forward': 'MAT.2.1.4.3',
  '5-forward': 'MAT.2.1.4.4',
  '2-backward': 'MAT.2.1.4.5',
  '3-backward': 'MAT.2.1.4.6',
  '4-backward': 'MAT.2.1.4.7',
  '5-backward': 'MAT.2.1.4.8',
} as const;

interface SkipTask {
  step: Step;
  direction: Direction;
  sequence: number[];
  answer: number;
  choices: number[];
}

export default function SkipCountRocketApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<SkipTask[]>(() => createSkipTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const isForward = task.direction === 'forward';
  const currentNumber = task.sequence[task.sequence.length - 1];
  const pathNumbers = useMemo(() => [...task.sequence, null], [task.sequence]);
  const stepLabel = formatTurkishDistributiveNumber(task.step);
  const theme = STEP_THEMES[task.step];
  const accent = isComplete ? ACCENT : theme.accent;

  useEffect(() => {
    if (!isComplete) return;
    Object.values(STEP_ATOMS).forEach((atomId) => unlockAtom(atomId));
    unlockModule('skip-count-rocket');
    addScore(120);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (value: number) => {
    if (feedback === 'success') return;
    setSelected(value);

    if (value !== task.answer) {
      setFeedback('error');
      window.setTimeout(() => {
        setSelected(null);
        setFeedback('idle');
      }, 720);
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
    }, 780);
  };

  const restart = () => {
    setTasks((currentTasks) => createSkipTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 120, text: 'Ritim roketi bütün durakları tamamladı! 2, 3, 4 ve 5 adımları kilitlendi.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: 'Doğru durak! Aynı adımla devam ettin.', type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: isForward ? `${task.step} ekleyerek ilerle.` : `${task.step} azaltarak geri git.`, type: 'error' };
    return {
      id: taskIndex * 10 + 1,
      text: isForward ? `${currentNumber} sayısından sonra ${task.step} ekle. Roket hangi durağa gider?` : `${currentNumber} sayısından sonra ${task.step} azalt. Roket hangi durağa gider?`,
      type: 'info',
    };
  })();

  return (
    <Grade2MissionFrame
      title="Ritim Roketi 2-5"
      subtitle="İlkokul 2. Sınıf / Ritmik Sayma İleri ve Geri"
      icon={<Rocket className="h-6 w-6" />}
      accent={accent}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="skip-count-rocket-stage"
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
        style={{
          borderColor: withAlpha(accent, 0.2),
          background: `linear-gradient(145deg, ${withAlpha(accent, 0.12)}, rgba(7,13,24,0.90) 48%, ${withAlpha(accent, 0.06)})`,
        }}
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade2Completion
              key="complete"
              title="Ritim Rotası Tamam!"
              message={`${formatTurkishDistributiveNumber(2)}, ${formatTurkishDistributiveNumber(3)}, ${formatTurkishDistributiveNumber(4)} ve ${formatTurkishDistributiveNumber(5)} ileri-geri ritmik sayma duraklarını doğru buldun.`}
              accent={ACCENT}
              onRestart={restart}
              atoms={STEP_ATOM_LABELS}
            />
          ) : (
            <motion.div
              key={`${task.step}-${task.direction}-${task.sequence.join('-')}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full"
            >
              <div className="mb-6 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: withAlpha(accent, 0.74) }}>
                  {theme.label}
                </p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">
                  {stepLabel} {isForward ? 'ileri' : 'geri'}
                </h2>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {pathNumbers.map((number, index) => (
                    <SequencePad
                      key={`${number ?? 'target'}-${index}`}
                      value={number}
                      index={index}
                      isTarget={number === null}
                      revealedAnswer={feedback === 'success' ? task.answer : null}
                      accent={accent}
                    />
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <motion.div
                    animate={feedback === 'success' ? { x: [0, 48, 92], y: [0, -18, 0] } : { y: [0, -8, 0] }}
                    transition={feedback === 'success' ? { duration: 0.72, ease: 'easeInOut' } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="grid h-28 w-28 place-items-center rounded-[2rem] border"
                    style={{
                      borderColor: withAlpha(accent, 0.26),
                      backgroundColor: withAlpha(accent, 0.13),
                      boxShadow: `0 0 34px ${withAlpha(accent, 0.2)}`,
                    }}
                  >
                    <Rocket className="h-14 w-14 rotate-45" style={{ color: accent }} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade2Panel>
        {isComplete ? (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-300/30 bg-emerald-300/14 shadow-[0_0_36px_rgba(0,255,136,0.22)]">
              <CheckCircle2 className="h-12 w-12 text-emerald-300" />
            </div>
            <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00FF88]/74">
              Roket kutlaması
            </p>
            <h2 className="mt-2 text-2xl font-black">Bütün duraklar tamam!</h2>
            <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">
              Ritim roketi 2, 3, 4 ve 5 adımlarını ileri-geri doğru takip etti.
            </p>
            <div className="mt-6 rounded-3xl border border-emerald-300/22 bg-emerald-300/10 px-6 py-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Görevler tamam</p>
              <p className="mt-1 text-4xl font-black text-emerald-300">{tasks.length}/{tasks.length}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: withAlpha(accent, 0.74) }}>
              Roket kontrolü
            </p>
            <h2 className="mt-2 text-2xl font-black">Doğru durağı seç.</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
              Aynı adımı koru: ileri görevde ekle, geri görevde azalt.
            </p>
            <div
              className="mt-5 rounded-3xl border p-5 text-center"
              style={{ borderColor: withAlpha(accent, 0.2), backgroundColor: withAlpha(accent, 0.1) }}
            >
              <ArrowLeftRight className="mx-auto h-9 w-9" style={{ color: accent }} />
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-white/46">Adım</p>
              <p className="mt-1 text-4xl font-black text-white">{task.step}</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3">
              {task.choices.map((choice) => {
                const isSelected = selected === choice;
                return (
                  <Grade2ChoiceButton
                    key={choice}
                    onClick={() => choose(choice)}
                    selected={isSelected}
                    status={isSelected ? feedback : 'idle'}
                    disabled={feedback === 'success'}
                    accent={accent}
                  >
                    <span className="text-4xl">{choice}</span>
                  </Grade2ChoiceButton>
                );
              })}
            </div>
          </>
        )}
      </Grade2Panel>
    </Grade2MissionFrame>
  );
}

function SequencePad({
  value,
  index,
  isTarget,
  revealedAnswer,
  accent,
}: {
  value: number | null;
  index: number;
  isTarget: boolean;
  revealedAnswer: number | null;
  accent: string;
}) {
  const display = isTarget ? revealedAnswer : value;

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`grid min-h-28 place-items-center rounded-[1.7rem] border p-3 ${
        isTarget
          ? ''
          : 'border-white/10 bg-white/[0.06]'
      }`}
      style={isTarget ? { borderColor: withAlpha(accent, 0.38), backgroundColor: withAlpha(accent, 0.11) } : undefined}
    >
      <p className={`text-4xl font-black ${display === null ? 'text-white/30' : 'text-white'}`}>
        {display ?? '?'}
      </p>
    </motion.div>
  );
}

function createSkipTasks(previousTasks: SkipTask[] = []): SkipTask[] {
  const pairs: Array<{ step: Step; direction: Direction }> = [
    { step: 2, direction: 'forward' },
    { step: 3, direction: 'forward' },
    { step: 4, direction: 'forward' },
    { step: 5, direction: 'forward' },
    { step: 2, direction: 'backward' },
    { step: 3, direction: 'backward' },
    { step: 4, direction: 'backward' },
    { step: 5, direction: 'backward' },
  ];

  const tasks = shuffleItems(pairs).map(({ step, direction }) => createTask(step, direction));
  if (tasksKey(tasks) !== tasksKey(previousTasks)) return tasks;

  return pairs.map(({ step, direction }, index) => createTask(step, direction, 20 + index * 5));
}

function createTask(step: Step, direction: Direction, seed?: number): SkipTask {
  const minSlot = 3;
  const maxSlot = direction === 'forward'
    ? Math.floor((100 - step) / step)
    : Math.floor((100 - step * 2) / step);
  const rawSlot = seed === undefined ? randomInt(minSlot, maxSlot) : Math.floor(seed / step);
  const slot = Math.max(minSlot, Math.min(maxSlot, rawSlot));
  const start = slot * step;

  const sequence = direction === 'forward'
    ? [start - step * 2, start - step, start]
    : [start + step * 2, start + step, start];

  const answer = direction === 'forward' ? start + step : start - step;
  return { step, direction, sequence, answer, choices: createChoices(answer, step, direction) };
}

function createChoices(answer: number, step: Step, direction: Direction): number[] {
  const options = new Set<number>([answer]);
  const candidates = direction === 'forward'
    ? [answer + 1, answer - 1, answer + step, answer - step]
    : [answer - 1, answer + 1, answer - step, answer + step];

  for (const value of candidates) {
    if (value >= 0 && value <= 100 && value !== answer) options.add(value);
    if (options.size === 3) break;
  }

  return shuffleItems([...options]);
}

function shuffleItems<T>(values: T[]): T[] {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function tasksKey(tasks: SkipTask[]): string {
  return tasks.map((task) => `${task.step}-${task.direction}-${task.answer}`).join('|');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red},${green},${blue},${alpha})`;
}
