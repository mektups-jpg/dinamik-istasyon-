import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CircleDot, Equal, Split, Unlink } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2ChoiceButton, Grade2Completion, Grade2MissionFrame, Grade2Panel } from '../../grade2/shared/Grade2MissionKit';

const MODULE_ID = 'odd-even-pair-lab';
const ACCENT = '#34D399';
const ODD = '#FFB020';
const EVEN = '#2EE7FF';
const TASKS_PER_ROUND = 4;

type Parity = 'Tek' | 'Çift';

interface PairTask {
  value: number;
  answer: Parity;
  ones: number;
}

export default function OddEvenPairLabApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<PairTask[]>(() => createPairTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<Parity | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const pairs = useMemo(() => createPairs(task.ones), [task.ones]);

  useEffect(() => {
    if (!isComplete) return;
    unlockAtom('MAT.3.1.5.1');
    unlockAtom('MAT.3.1.5.2');
    unlockAtom('MAT.3.1.5.3');
    unlockModule(MODULE_ID);
    addScore(105);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (choice: Parity) => {
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
    }, 860);
  };

  const restart = () => {
    setTasks((currentTasks) => createPairTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 130, text: 'Tek-çift eşleme tamam! Birler basamağıyla hızlı karar verdin.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: `Doğru. ${task.value} sayısı ${task.answer.toLocaleLowerCase('tr-TR')} sayıdır.`, type: 'success' };
    if (feedback === 'error') {
      return {
        id: taskIndex * 10 + 3,
        text: `Birler basamağı ${task.ones}. İkişerli eşleştir; artan kalırsa tek, artan yoksa çift olur.`,
        type: 'error',
      };
    }
    return { id: taskIndex * 10 + 1, text: `${task.value} sayısının birler basamağına bak. Küpleri ikişerli eşleştir ve kartı seç.`, type: 'info' };
  })();

  return (
    <Grade2MissionFrame
      title="Tek-Çift Eşleme"
      subtitle="İlkokul 3. Sınıf / Birler Basamağıyla Tek-Çift"
      icon={<CircleDot className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="odd-even-pair-lab-stage"
        className="flex min-h-[560px] min-w-0 items-center justify-center overflow-hidden rounded-[2rem] border border-[#34D399]/18 bg-[radial-gradient(circle_at_50%_18%,rgba(52,211,153,0.14),transparent_34%),linear-gradient(180deg,rgba(7,22,24,0.95),rgba(5,13,24,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade2Completion
              key="complete"
              title="Eşleme Tamam!"
              message="Tek ve çift sayıları birler basamağına bakarak ayırdın."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.3.1.5.1', label: 'Nesneleri ikişerli eşleyerek sayının tek/çift olduğunu görselleştirir.' },
                { id: 'MAT.3.1.5.2', label: 'Sayının birler basamağına bakarak tek etiketi koyar.' },
                { id: 'MAT.3.1.5.3', label: 'Sayının birler basamağına bakarak çift etiketi koyar.' },
              ]}
            />
          ) : (
            <motion.div
              key={task.value}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-4xl"
            >
              <div className="mb-5 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#34D399]/74">Birler istasyonu</p>
                <h2 className="mt-2 text-4xl font-black md:text-6xl">{task.value}</h2>
                <p className="mt-2 text-sm font-bold text-white/58 md:text-base">Birler basamağını ikişerli eşleştir.</p>
              </div>

              <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-black/24 p-4 md:grid-cols-[230px_1fr]">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 text-center">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/44">Basamaklar</p>
                  <DigitStrip value={task.value} ones={task.ones} />
                  <div className="mt-4 rounded-3xl border border-[#34D399]/26 bg-[#34D399]/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/46">Birler</p>
                    <p className="mt-1 text-5xl font-black text-[#34D399]">{task.ones}</p>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-[#07141B]/80 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">İkişerli eşleme</p>
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-black text-white/56">
                      {task.ones === 0 ? 'Artan yok' : pairs.hasRemainder ? '1 artan var' : 'Artan yok'}
                    </span>
                  </div>
                  {task.ones === 0 ? (
                    <div className="grid min-h-64 place-items-center rounded-3xl border border-dashed border-[#2EE7FF]/24 bg-[#2EE7FF]/8 text-center">
                      <Equal className="h-11 w-11 text-[#2EE7FF]" />
                      <p className="mt-3 text-xl font-black">0 birlik çift kabul edilir.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                      {pairs.groups.map((group, index) => (
                        <PairPod key={index} count={group} index={index} remainder={group === 1} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade2Panel>
        {isComplete ? (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/74">Eşleme kutlaması</p>
            <h2 className="mt-2 text-2xl font-black">Tek-çift tamam!</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/58">Birler basamağına bakarak hızlı karar verdin.</p>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#34D399]/74">Karar kartı</p>
            <h2 className="mt-2 text-2xl font-black">Sayı tek mi, çift mi?</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">İkişerli eşleştir. Artan kalırsa tek, artan yoksa çift.</p>
            <div className="mt-5 grid gap-3">
              {(['Tek', 'Çift'] as Parity[]).map((choice) => (
                <Grade2ChoiceButton
                  key={choice}
                  accent={choice === 'Tek' ? ODD : EVEN}
                  selected={selected === choice}
                  status={selected === choice ? feedback : 'idle'}
                  disabled={feedback !== 'idle'}
                  onClick={() => choose(choice)}
                >
                  <span className="flex items-center justify-center gap-3">
                    {choice === 'Tek' ? <Unlink className="h-5 w-5" /> : <Equal className="h-5 w-5" />}
                    {choice}
                  </span>
                </Grade2ChoiceButton>
              ))}
            </div>
          </>
        )}
        <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Görev ilerlemesi">
          {tasks.map((item, index) => (
            <div
              key={`${item.value}-${index}`}
              className={`grid min-h-12 place-items-center rounded-2xl border text-sm font-black ${
                index === taskIndex && !isComplete
                  ? 'border-[#34D399]/54 bg-[#34D399]/16 text-white'
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

function DigitStrip({ value, ones }: { value: number; ones: number }) {
  const digits = String(value).padStart(3, '0').split('');

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {digits.map((digit, index) => {
        const isOnes = index === 2;
        return (
          <div
            key={`${digit}-${index}`}
            className={`rounded-2xl border px-2 py-3 ${isOnes ? 'border-[#34D399]/50 bg-[#34D399]/14' : 'border-white/10 bg-white/[0.05]'}`}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/38">{index === 0 ? 'Yüz' : index === 1 ? 'On' : 'Bir'}</p>
            <p className="mt-1 text-3xl font-black" style={{ color: isOnes ? ACCENT : '#FFFFFF' }}>{isOnes ? ones : digit}</p>
          </div>
        );
      })}
    </div>
  );
}

function PairPod({ count, index, remainder }: { count: number; index: number; remainder: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.045 }}
      className={`grid min-h-24 place-items-center rounded-3xl border p-3 ${remainder ? 'border-[#FFB020]/45 bg-[#FFB020]/12' : 'border-[#2EE7FF]/30 bg-[#2EE7FF]/10'}`}
    >
      <div className="flex gap-2">
        {Array.from({ length: count }, (_, cube) => (
          <div
            key={cube}
            className="h-10 w-10 rounded-2xl border border-white/16 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
            style={{ background: remainder ? ODD : EVEN }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-white/48">{remainder ? 'Artan' : 'Eş çift'}</p>
    </motion.div>
  );
}

function createPairs(ones: number): { groups: number[]; hasRemainder: boolean } {
  const groups = Array.from({ length: Math.floor(ones / 2) }, () => 2);
  if (ones % 2 === 1) groups.push(1);
  return { groups, hasRemainder: ones % 2 === 1 };
}

function createPairTasks(previousTasks: PairTask[] = []): PairTask[] {
  const wantedOnes = shuffleNumbers([7, 2, 5, 0, 9, 4, 1, 8]).slice(0, TASKS_PER_ROUND);
  const nextTasks = wantedOnes.map((ones) => {
    const value = createValueWithOnes(ones);
    return { value, ones, answer: parityFor(ones) };
  });

  if (tasksKey(nextTasks) !== tasksKey(previousTasks)) return nextTasks;

  return [3, 6, 9, 4].map((ones) => {
    const value = createValueWithOnes(ones);
    return { value, ones, answer: parityFor(ones) };
  });
}

function parityFor(ones: number): Parity {
  return ones % 2 === 0 ? 'Çift' : 'Tek';
}

function createValueWithOnes(ones: number): number {
  return randomInt(1, 9) * 100 + randomInt(1, 9) * 10 + ones;
}

function shuffleNumbers(values: number[]): number[] {
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function tasksKey(tasks: PairTask[]): string {
  return tasks.map((task) => task.value).join('|');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
