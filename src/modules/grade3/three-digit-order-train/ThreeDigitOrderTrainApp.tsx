import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, CheckCircle2, MousePointerClick, Sparkles, TrainFront } from 'lucide-react';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade2Completion, Grade2MissionFrame, Grade2Panel } from '../../grade2/shared/Grade2MissionKit';

const MODULE_ID = 'three-digit-order-train';
const ACCENT = '#8B5CF6';
const SUCCESS_TONE = '#34D399';
const ERROR_TONE = '#FB7185';
const CAR_TONES = ['#2EE7FF', '#34D399', '#FFB020', '#FB7185', '#A78BFA'];
const TASKS_PER_ROUND = 4;

type Direction = 'asc' | 'desc';
type Focus = 'hundreds' | 'tens' | 'ones' | 'mixed';

interface OrderingTask {
  numbers: number[];
  ordered: number[];
  direction: Direction;
  focus: Focus;
}

export default function ThreeDigitOrderTrainApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<OrderingTask[]>(() => createOrderingTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrongValue, setWrongValue] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const expected = task.ordered[placed.length];
  const isAscending = task.direction === 'asc';
  const parkedCars = useMemo(() => task.numbers.filter((number) => !placed.includes(number)), [placed, task.numbers]);

  useEffect(() => {
    if (!isComplete) return;
    unlockAtom('MAT.3.1.3.1');
    unlockAtom('MAT.3.1.3.2');
    unlockModule(MODULE_ID);
    addScore(110);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const chooseCar = (value: number) => {
    if (feedback !== 'idle') return;

    if (value !== expected) {
      setWrongValue(value);
      setFeedback('error');
      window.setTimeout(() => {
        setWrongValue(null);
        setFeedback('idle');
      }, 760);
      return;
    }

    const nextPlaced = [...placed, value];
    setPlaced(nextPlaced);
    setFeedback('success');

    window.setTimeout(() => {
      if (nextPlaced.length < task.ordered.length) {
        setFeedback('idle');
        return;
      }

      if (taskIndex === tasks.length - 1) {
        setIsComplete(true);
      } else {
        setTaskIndex((current) => current + 1);
        setPlaced([]);
        setFeedback('idle');
      }
    }, 860);
  };

  const restart = () => {
    setTasks((currentTasks) => createOrderingTasks(currentTasks));
    setTaskIndex(0);
    setPlaced([]);
    setWrongValue(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 120, text: 'Üç basamaklı tren hazır! Sayıları iki yönde de doğru sıraladın.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + placed.length + 2, text: 'Doğru vagon rayına oturdu. Sıradaki vagonu bul.', type: 'success' };
    if (feedback === 'error') {
      return {
        id: taskIndex * 10 + 3,
        text: isAscending ? 'Bu en küçük kalan vagon değil. Önce yüzlük basamağına bak.' : 'Bu en büyük kalan vagon değil. Önce yüzlük basamağına bak.',
        type: 'error',
      };
    }
    return {
      id: taskIndex * 10 + 1,
      text: isAscending ? 'Vagonları küçükten büyüğe diz. İlk vagon en küçük sayı olsun.' : 'Vagonları büyükten küçüğe diz. İlk vagon en büyük sayı olsun.',
      type: 'info',
    };
  })();

  return (
    <Grade2MissionFrame
      title="Üç Basamaklı Sıralama Treni"
      subtitle="İlkokul 3. Sınıf / Üç Basamaklı Sayıları Sıralama"
      icon={<TrainFront className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="three-digit-order-train-stage"
        className="flex min-h-[560px] min-w-0 items-center justify-center overflow-hidden rounded-[2rem] border border-[#8B5CF6]/20 bg-[radial-gradient(circle_at_50%_18%,rgba(139,92,246,0.16),transparent_34%),linear-gradient(180deg,rgba(12,16,36,0.95),rgba(6,13,24,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade2Completion
              key="complete"
              title="Tren Hazır!"
              message="Üç basamaklı sayıları küçükten büyüğe ve büyükten küçüğe doğru sıraladın."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.3.1.3.1', label: 'Üç basamaklı sayıları büyükten küçüğe sıralar.' },
                { id: 'MAT.3.1.3.2', label: 'Üç basamaklı sayıları küçükten büyüğe sıralar.' },
              ]}
            />
          ) : (
            <motion.div
              key={`${task.direction}-${task.numbers.join('-')}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full min-w-0"
            >
              <div className="mb-6 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#A78BFA]/74">Vagonları sırala</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{isAscending ? 'Küçükten büyüğe' : 'Büyükten küçüğe'}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-bold text-white/56">Önce yüzlük, eşitse onluk, yine eşitse birlik basamağına bak.</p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4">
                <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {Array.from({ length: task.ordered.length }, (_, index) => {
                    const value = placed[index];
                    const isNextSlot = index === placed.length;
                    const isFreshlyPlaced = feedback === 'success' && index === placed.length - 1;
                    return (
                      <div
                        key={index}
                        className={`relative grid min-h-28 place-items-center rounded-[1.6rem] border p-2 transition ${
                          value === undefined && isNextSlot
                            ? 'border-[#FFB020]/70 bg-[#FFB020]/10 shadow-[0_0_34px_rgba(255,176,32,0.18)]'
                            : 'border-white/10 bg-white/[0.05]'
                        }`}
                      >
                        {value === undefined ? (
                          <>
                            {isNextSlot && (
                              <motion.div
                                aria-hidden="true"
                                animate={{ scale: [1, 1.08, 1], opacity: [0.72, 1, 0.72] }}
                                transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-3 rounded-[1.25rem] border border-[#FFB020]/42"
                              />
                            )}
                            <span className={`text-4xl font-black ${isNextSlot ? 'text-[#FFB020]' : 'text-white/18'}`}>{index + 1}</span>
                          </>
                        ) : (
                          <TrainCar value={value} tone={isFreshlyPlaced ? SUCCESS_TONE : toneForNumber(value)} isPlaced isFreshlyPlaced={isFreshlyPlaced} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="relative h-4 rounded-full bg-gradient-to-r from-[#2EE7FF]/60 via-white/70 to-[#8B5CF6]/60 shadow-[0_0_26px_rgba(139,92,246,0.20)]" />

                <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {parkedCars.map((number) => (
                    <motion.button
                      type="button"
                      key={number}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.94 }}
                      animate={wrongValue === number ? { x: [-8, 8, -5, 5, 0] } : { x: 0 }}
                      onClick={() => chooseCar(number)}
                      aria-label={`${number} vagonu`}
                      data-testid={`three-digit-order-train-car-${number}`}
                      className={`rounded-[1.8rem] border p-2 transition ${
                        wrongValue === number
                          ? 'border-rose-300/80 bg-rose-300/14 shadow-[0_0_30px_rgba(251,113,133,0.18)]'
                          : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.10]'
                      }`}
                    >
                      <TrainCar value={number} tone={wrongValue === number ? ERROR_TONE : toneForNumber(number)} isWrong={wrongValue === number} />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade2Panel>
        {isComplete ? (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/74">Tren kutlaması</p>
            <h2 className="mt-2 text-2xl font-black">Tren yola çıktı!</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/58">Üç basamaklı sayıları iki yönde de karşılaştırdın.</p>
            <div className="mt-5 rounded-3xl border border-emerald-300/24 bg-emerald-300/10 p-5 text-center shadow-[0_0_34px_rgba(52,211,153,0.12)]">
              <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-200" />
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-100/70">Görevler tamam</p>
              <p className="mt-1 text-4xl font-black text-white">{TASKS_PER_ROUND}/{TASKS_PER_ROUND}</p>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A78BFA]/74">Sıralama yönü</p>
            <h2 className="mt-2 text-2xl font-black">{isAscending ? 'En küçükten başla.' : 'En büyükten başla.'}</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">Kalan vagonlara bak. Doğru olan parlayan boş kutuya gider.</p>
            <div className="mt-5 rounded-3xl border border-[#FFB020]/26 bg-[#FFB020]/10 p-5 text-center shadow-[0_0_34px_rgba(255,176,32,0.10)]">
              <MousePointerClick className="mx-auto h-10 w-10 text-[#FFB020]" />
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-white/46">Şimdi seç</p>
              <p className="mt-1 text-2xl font-black text-white">{isAscending ? 'En küçük vagon' : 'En büyük vagon'}</p>
            </div>
            <div className="mt-5 rounded-3xl border border-[#8B5CF6]/18 bg-[#8B5CF6]/10 p-5 text-center">
              {isAscending ? <ArrowUpNarrowWide className="mx-auto h-9 w-9 text-[#A78BFA]" /> : <ArrowDownWideNarrow className="mx-auto h-9 w-9 text-[#A78BFA]" />}
              <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-white/46">Kural</p>
              <p className="mt-1 text-lg font-black text-white">{isAscending ? 'Küçükten büyüğe' : 'Büyükten küçüğe'}</p>
            </div>
          </>
        )}
        <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Görev ilerlemesi">
          {tasks.map((item, index) => (
            <div
              key={`${item.direction}-${item.focus}-${index}`}
              className={`grid min-h-12 place-items-center rounded-2xl border text-sm font-black ${
                index === taskIndex && !isComplete
                  ? 'border-[#8B5CF6]/54 bg-[#8B5CF6]/16 text-white'
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

function TrainCar({
  value,
  tone,
  isPlaced = false,
  isFreshlyPlaced = false,
  isWrong = false,
}: {
  value: number;
  tone: string;
  isPlaced?: boolean;
  isFreshlyPlaced?: boolean;
  isWrong?: boolean;
}) {
  const digits = String(value).split('').map(Number);

  return (
    <motion.div
      initial={isPlaced ? { scale: 0.75, opacity: 0 } : undefined}
      animate={isPlaced ? { scale: 1, opacity: 1 } : { y: [0, -4, 0] }}
      transition={isPlaced ? { type: 'spring', stiffness: 180, damping: 14 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative grid min-h-28 place-items-center rounded-[1.6rem] border px-3 ${
        isWrong ? 'border-rose-200/52 bg-rose-300/10' : isFreshlyPlaced ? 'border-emerald-200/52 bg-emerald-300/10' : 'border-white/14 bg-black/24'
      }`}
      style={{ boxShadow: `0 0 ${isFreshlyPlaced ? 34 : 24}px ${tone}${isFreshlyPlaced ? '55' : '28'}` }}
    >
      {isFreshlyPlaced && <Sparkles className="absolute right-3 top-3 h-5 w-5 text-emerald-100" />}
      <div className="absolute inset-x-4 top-3 h-3 rounded-full bg-white/12" />
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
      <div className="mb-2 grid w-full grid-cols-3 gap-1">
        {['Y', 'O', 'B'].map((label, index) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.05] px-1 py-1 text-center">
            <p className="text-[8px] font-black text-white/40">{label}</p>
            <p className="text-sm font-black" style={{ color: index === 0 ? '#A78BFA' : index === 1 ? '#FFB020' : '#34D399' }}>{digits[index]}</p>
          </div>
        ))}
      </div>
      <div className="absolute bottom-1 flex gap-5">
        <div className="h-4 w-4 rounded-full border border-white/18" style={{ background: tone }} />
        <div className="h-4 w-4 rounded-full border border-white/18" style={{ background: tone }} />
      </div>
    </motion.div>
  );
}

function toneForNumber(value: number): string {
  return CAR_TONES[value % CAR_TONES.length];
}

function createOrderingTasks(previousTasks: OrderingTask[] = []): OrderingTask[] {
  const focuses: Focus[] = ['hundreds', 'tens', 'ones', 'mixed'];
  const directions: Direction[] = ['asc', 'desc', 'asc', 'desc'];
  const nextTasks = focuses.map((focus, index) => createTask(directions[index], focus));

  if (tasksKey(nextTasks) !== tasksKey(previousTasks)) return nextTasks;

  return focuses.map((focus, index) => createTask(directions[(index + 1) % directions.length], focus));
}

function createTask(direction: Direction, focus: Focus): OrderingTask {
  const numbers = focus === 'hundreds'
    ? createHundredsFocusNumbers()
    : focus === 'tens'
      ? createTensFocusNumbers()
      : focus === 'ones'
        ? createOnesFocusNumbers()
        : createMixedNumbers();
  const shuffled = shuffleNumbers(numbers);
  const ordered = [...numbers].sort((first, second) => direction === 'asc' ? first - second : second - first);
  return { numbers: shuffled, ordered, direction, focus };
}

function createHundredsFocusNumbers(): number[] {
  const hundreds = shuffleNumbers([2, 4, 6, 8]).slice(0, 4);
  return hundreds.map((hundred) => hundred * 100 + randomInt(1, 8) * 10 + randomInt(1, 9));
}

function createTensFocusNumbers(): number[] {
  const hundred = randomInt(3, 7);
  const tens = shuffleNumbers([1, 3, 5, 8]).slice(0, 4);
  return tens.map((ten) => hundred * 100 + ten * 10 + randomInt(1, 9));
}

function createOnesFocusNumbers(): number[] {
  const hundred = randomInt(2, 8);
  const ten = randomInt(1, 8);
  const ones = shuffleNumbers([1, 3, 6, 9]).slice(0, 4);
  return ones.map((one) => hundred * 100 + ten * 10 + one);
}

function createMixedNumbers(): number[] {
  const values = new Set<number>();

  while (values.size < 4) {
    values.add(randomInt(100, 999));
  }

  return [...values];
}

function shuffleNumbers(values: number[]): number[] {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function tasksKey(tasks: OrderingTask[]): string {
  return tasks.map((task) => `${task.direction}:${task.focus}:${task.ordered.join(',')}`).join('|');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
