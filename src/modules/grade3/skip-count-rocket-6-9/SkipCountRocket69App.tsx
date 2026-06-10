import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowUp, CheckCircle2, Rocket, Sparkles } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { formatTurkishDistributiveNumber } from '../../../lib/turkishText';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2ChoiceButton, Grade2Completion, Grade2MissionFrame, Grade2Panel } from '../../grade2/shared/Grade2MissionKit';

const MODULE_ID = 'skip-count-rocket-6-9';
const ACCENT = '#FFB020';
const TASKS_PER_ROUND = 5;
const STEP_TONES: Record<number, string> = {
  6: '#34D399',
  7: '#2EE7FF',
  8: '#FFB020',
  9: '#A78BFA',
};

type Direction = 'forward' | 'backward';

interface RhythmTask {
  id: string;
  step: number;
  direction: Direction;
  visibleStops: number[];
  answer: number;
  choices: number[];
}

export default function SkipCountRocket69App() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<RhythmTask[]>(() => createRhythmTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const tone = STEP_TONES[task.step];
  const rhythmWord = formatTurkishDistributiveNumber(task.step);
  const directionLabel = task.direction === 'forward' ? 'ileri' : 'geri';
  const shownStops = useMemo(() => [...task.visibleStops, feedback === 'success' ? task.answer : null], [feedback, task.answer, task.visibleStops]);

  useEffect(() => {
    if (!isComplete) return;
    ['MAT.3.1.4.1', 'MAT.3.1.4.2', 'MAT.3.1.4.3', 'MAT.3.1.4.4', 'MAT.3.1.4.5'].forEach((atomId) => unlockAtom(atomId));
    unlockModule(MODULE_ID);
    addScore(130);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (choice: number) => {
    if (feedback !== 'idle') return;
    setSelected(choice);

    if (choice !== task.answer) {
      setFeedback('error');
      window.setTimeout(() => {
        setSelected(null);
        setFeedback('idle');
      }, 760);
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
    setTasks((currentTasks) => createRhythmTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 160, text: 'Ritmik sayma roketi tamam! Altışar, yedişer, sekizer ve dokuzar sayma rotalarını kurdun.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: `Doğru durak: ${task.answer}. ${rhythmWord} ${directionLabel} ritmi kilitlendi.`, type: 'success' };
    if (feedback === 'error' && selected !== null) {
      return { id: taskIndex * 10 + 3, text: `${selected} bu ritme uymadı. Her durakta ${task.step} ${task.direction === 'forward' ? 'ekle' : 'çıkar'}.`, type: 'error' };
    }
    return { id: taskIndex * 10 + 1, text: `${rhythmWord} ${directionLabel} say. Sıradaki roket durağını seç.`, type: 'info' };
  })();

  return (
    <Grade2MissionFrame
      title="Ritmik Sayma Roketi"
      subtitle="İlkokul 3. Sınıf / Altışar, Yedişer, Sekizer, Dokuzar Sayma"
      icon={<Rocket className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="skip-count-rocket-6-9-stage"
        className="flex min-h-[560px] min-w-0 items-center justify-center overflow-hidden rounded-[2rem] border border-[#FFB020]/20 bg-[radial-gradient(circle_at_50%_16%,rgba(255,176,32,0.14),transparent_34%),linear-gradient(180deg,rgba(22,16,7,0.95),rgba(5,13,24,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade2Completion
              key="complete"
              title="Ritmik Sayma Rotası Tamam!"
              message="6, 7, 8 ve 9 ritimleriyle ileri ve geri sayma zincirleri kuruldu."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.3.1.4.1', label: 'İleriye doğru altışar ritmik sayar.' },
                { id: 'MAT.3.1.4.2', label: 'İleriye doğru yedişer ritmik sayar.' },
                { id: 'MAT.3.1.4.3', label: 'İleriye doğru sekizer ritmik sayar.' },
                { id: 'MAT.3.1.4.4', label: 'İleriye doğru dokuzar ritmik sayar.' },
                { id: 'MAT.3.1.4.5', label: 'Geriye doğru ritmik sayma zincirini tamamlar.' },
              ]}
            />
          ) : (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-5xl"
            >
              <div className="mb-6 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: `${tone}CC` }}>
                  Ritim uçuşu
                </p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{capitalize(rhythmWord)} {directionLabel} uçuş</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold text-white/58">
                  Her durakta {task.direction === 'forward' ? `${task.step} ekle` : `${task.step} çıkar`}. Sıradaki durağı seç.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
                <div className="relative min-h-72 rounded-[1.8rem] border border-white/10 bg-[#06111F]/80 p-5">
                  <div className="absolute left-8 right-8 top-1/2 h-3 rounded-full bg-white/10" />
                  <motion.div
                    aria-hidden="true"
                    animate={{ x: task.direction === 'forward' ? ['0%', '8%', '0%'] : ['8%', '0%', '8%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[calc(50%-3.4rem)] z-10 grid h-16 w-16 place-items-center rounded-[1.4rem] border border-white/16"
                    style={{ background: `${tone}28`, color: tone, boxShadow: `0 0 34px ${tone}44` }}
                  >
                    <Rocket className={`h-9 w-9 ${task.direction === 'backward' ? '-scale-x-100' : ''}`} />
                  </motion.div>
                  <div className="relative z-20 grid grid-cols-4 gap-3">
                    {shownStops.map((stop, index) => (
                      <StopCard key={`${task.id}-${index}`} stop={stop} index={index} tone={tone} success={feedback === 'success' && index === shownStops.length - 1} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade2Panel>
        {isComplete ? (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/74">Roket kutlaması</p>
            <h2 className="mt-2 text-2xl font-black">Ritmik sayma rotası tamam!</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/58">6, 7, 8 ve 9 ritimleri kilitlendi.</p>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: `${tone}CC` }}>Durak kartları</p>
            <h2 className="mt-2 text-2xl font-black">Sıradaki durak hangisi?</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
              {capitalize(rhythmWord)} sayarken {task.direction === 'forward' ? 'sağa ilerle' : 'sola dön'}.
            </p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-black/24 p-4 text-center">
              {task.direction === 'forward' ? <ArrowUp className="mx-auto h-9 w-9" style={{ color: tone }} /> : <ArrowDown className="mx-auto h-9 w-9" style={{ color: tone }} />}
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-white/44">Ritim</p>
              <p className="mt-1 text-2xl font-black text-white">{task.step}</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3">
              {task.choices.map((choice) => (
                <Grade2ChoiceButton
                  key={choice}
                  accent={tone}
                  selected={selected === choice}
                  status={selected === choice ? feedback : 'idle'}
                  disabled={feedback !== 'idle'}
                  onClick={() => choose(choice)}
                >
                  <span className="text-3xl">{choice}</span>
                </Grade2ChoiceButton>
              ))}
            </div>
          </>
        )}
        <div className="mt-5 grid grid-cols-5 gap-2" aria-label="Görev ilerlemesi">
          {tasks.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`grid min-h-12 place-items-center rounded-2xl border text-sm font-black ${
                index === taskIndex && !isComplete
                  ? 'border-[#FFB020]/54 bg-[#FFB020]/16 text-white'
                  : index < taskIndex || isComplete
                    ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
                    : 'border-white/10 bg-white/[0.04] text-white/36'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </Grade2Panel>
    </Grade2MissionFrame>
  );
}

function StopCard({ stop, index, tone, success }: { stop: number | null; index: number; tone: string; success: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0 }}
      animate={{ scale: success ? [1, 1.07, 1] : 1, opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className={`grid min-h-48 place-items-center rounded-[1.8rem] border p-3 text-center ${
        stop === null ? 'border-dashed border-white/18 bg-white/[0.04]' : success ? 'border-emerald-300/50 bg-emerald-300/12' : 'border-white/10 bg-white/[0.06]'
      }`}
      style={stop !== null ? { boxShadow: `0 0 28px ${success ? '#34D39955' : `${tone}28`}` } : undefined}
    >
      {stop === null ? (
        <>
          <Sparkles className="h-9 w-9" style={{ color: tone }} />
          <p className="text-5xl font-black text-white">?</p>
        </>
      ) : (
        <>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42">{index + 1}. durak</p>
          <p className="text-5xl font-black text-white">{stop}</p>
        </>
      )}
    </motion.div>
  );
}

function createRhythmTasks(previousTasks: RhythmTask[] = []): RhythmTask[] {
  const tasks = [6, 7, 8, 9].map((step) => createTask(step, 'forward'));
  tasks.push(createTask([6, 7, 8, 9][randomInt(0, 3)], 'backward'));

  if (tasksKey(tasks) !== tasksKey(previousTasks)) return tasks;

  return [6, 7, 8, 9, 6].map((step, index) => createTask(step, index === 4 ? 'backward' : 'forward'));
}

function createTask(step: number, direction: Direction): RhythmTask {
  const seed = direction === 'forward' ? randomInt(1, 4) * step : randomInt(8, 12) * step;
  const visibleStops = direction === 'forward'
    ? [seed, seed + step, seed + step * 2]
    : [seed, seed - step, seed - step * 2];
  const answer = direction === 'forward' ? seed + step * 3 : seed - step * 3;
  return {
    id: `${step}-${direction}-${seed}`,
    step,
    direction,
    visibleStops,
    answer,
    choices: createChoices(answer, step),
  };
}

function createChoices(answer: number, step: number): number[] {
  const options = new Set<number>([answer]);
  [answer + step, answer - step, answer + step * 2, answer - step * 2].forEach((value) => {
    if (value >= 0 && value <= 120) options.add(value);
  });

  for (let value = 0; options.size < 3 && value <= 120; value += step) {
    options.add(value);
  }

  return shuffleNumbers([...options].slice(0, 3));
}

function shuffleNumbers(values: number[]): number[] {
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function tasksKey(tasks: RhythmTask[]): string {
  return tasks.map((task) => task.id).join('|');
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase('tr-TR') + value.slice(1);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
