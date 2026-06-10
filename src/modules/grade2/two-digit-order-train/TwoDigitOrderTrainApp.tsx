import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, CheckCircle2, MousePointerClick, Sparkles, TrainFront } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { Grade2Completion, Grade2MissionFrame, Grade2Panel } from '../shared/Grade2MissionKit';

const ACCENT = '#B388FF';
const TASKS_PER_ROUND = 3;
const SUCCESS_TONE = '#34F6A4';
const ERROR_TONE = '#FF5DA2';
const CAR_TONES = ['#00E5FF', '#34F6A4', '#FFD166', '#FF7AC8', '#B388FF'];

type Direction = 'asc' | 'desc';

interface OrderingTask {
  numbers: number[];
  ordered: number[];
  direction: Direction;
}

export default function TwoDigitOrderTrainApp() {
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

  const parkedCars = useMemo(
    () => task.numbers.filter((number) => !placed.includes(number)),
    [placed, task.numbers]
  );

  useEffect(() => {
    if (!isComplete) return;
    unlockAtom('MAT.2.1.3.1');
    unlockAtom('MAT.2.1.3.2');
    unlockModule('two-digit-order-train');
    addScore(95);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const chooseCar = (value: number) => {
    if (feedback === 'success') return;

    if (value !== expected) {
      setWrongValue(value);
      setFeedback('error');
      window.setTimeout(() => {
        setWrongValue(null);
        setFeedback('idle');
      }, 720);
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
    }, 850);
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
    if (isComplete) return { id: 90, text: 'Sıralama treni yola çıktı! İki basamaklı sayıları iki yönde de dizdin.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + placed.length + 2, text: 'Doğru vagon rayına oturdu. Sıradaki sayıyı bul.', type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: isAscending ? 'Bu en küçük değil. Kalan vagonlara tekrar bak.' : 'Bu en büyük değil. Kalan vagonlara tekrar bak.', type: 'error' };
    return {
      id: taskIndex * 10 + 1,
      text: isAscending ? 'Vagonları küçükten büyüğe diz. İlk vagon en küçük sayı olmalı.' : 'Vagonları büyükten küçüğe diz. İlk vagon en büyük sayı olmalı.',
      type: 'info',
    };
  })();

  return (
    <Grade2MissionFrame
      title="Sayı Sıralama Treni"
      subtitle="İlkokul 2. Sınıf / İki Basamaklı Sayıları Sıralama"
      icon={<TrainFront className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="two-digit-order-train-stage"
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#B388FF]/20 bg-[#0C1024]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade2Completion
              key="complete"
              title="Tren Hazır!"
              message="İki basamaklı sayıları küçükten büyüğe ve büyükten küçüğe doğru sıraladın."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.2.1.3.1', label: 'İki basamaklı sayıları büyükten küçüğe sıralar.' },
                { id: 'MAT.2.1.3.2', label: 'İki basamaklı sayıları küçükten büyüğe sıralar.' },
              ]}
            />
          ) : (
            <motion.div
              key={`${task.direction}-${task.numbers.join('-')}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full"
            >
              <div className="mb-6 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#B388FF]/74">Vagonları diz</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">
                  {isAscending ? 'Küçükten büyüğe' : 'Büyükten küçüğe'}
                </h2>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4">
                <div className="mb-5 grid grid-cols-4 gap-3">
                  {Array.from({ length: task.ordered.length }, (_, index) => {
                    const value = placed[index];
                    const isNextSlot = index === placed.length;
                    const isFreshlyPlaced = feedback === 'success' && index === placed.length - 1;
                    return (
                      <div
                        key={index}
                        className={`relative grid min-h-28 place-items-center rounded-[1.6rem] border p-2 transition ${
                          value === undefined && isNextSlot
                            ? 'border-[#FFD166]/70 bg-[#FFD166]/10 shadow-[0_0_34px_rgba(255,209,102,0.18)]'
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
                                className="absolute inset-3 rounded-[1.25rem] border border-[#FFD166]/42"
                              />
                            )}
                            <span className={`text-4xl font-black ${isNextSlot ? 'text-[#FFD166]' : 'text-white/18'}`}>{index + 1}</span>
                          </>
                        ) : (
                          <TrainCar value={value} tone={isFreshlyPlaced ? SUCCESS_TONE : toneForNumber(value)} isPlaced isFreshlyPlaced={isFreshlyPlaced} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="relative h-4 rounded-full bg-gradient-to-r from-[#00E5FF]/60 via-white/70 to-[#B388FF]/60 shadow-[0_0_26px_rgba(179,136,255,0.20)]" />

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {parkedCars.map((number) => (
                    <motion.button
                      type="button"
                      key={number}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.94 }}
                      animate={wrongValue === number ? { x: [-8, 8, -5, 5, 0] } : { x: 0 }}
                      onClick={() => chooseCar(number)}
                      aria-label={`${number} vagonu`}
                      className={`rounded-[1.8rem] border p-2 transition ${
                        wrongValue === number
                          ? 'border-pink-300/80 bg-pink-300/14 shadow-[0_0_30px_rgba(255,93,162,0.18)]'
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
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/58">
              Üç görevi bitirdin. Sayıları iki yönde de karşılaştırdın.
            </p>
            <div className="mt-5 rounded-3xl border border-emerald-300/24 bg-emerald-300/10 p-5 text-center shadow-[0_0_34px_rgba(52,246,164,0.12)]">
              <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-200" />
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-100/70">Görevler tamam</p>
              <p className="mt-1 text-4xl font-black text-white">3/3</p>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B388FF]/74">Sıralama yönü</p>
            <h2 className="mt-2 text-2xl font-black">{isAscending ? 'En küçükten başla.' : 'En büyükten başla.'}</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
              Kalan vagonlara bak. Doğru olan parlayan boş kutuya gider.
            </p>
            <div className="mt-5 rounded-3xl border border-[#FFD166]/26 bg-[#FFD166]/10 p-5 text-center shadow-[0_0_34px_rgba(255,209,102,0.10)]">
              <MousePointerClick className="mx-auto h-10 w-10 text-[#FFD166]" />
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-white/46">Şimdi seç</p>
              <p className="mt-1 text-2xl font-black text-white">{isAscending ? 'En küçük vagon' : 'En büyük vagon'}</p>
            </div>
            <div className="mt-5 rounded-3xl border border-[#B388FF]/18 bg-[#B388FF]/10 p-5 text-center">
              {isAscending ? (
                <ArrowUpNarrowWide className="mx-auto h-9 w-9 text-[#B388FF]" />
              ) : (
                <ArrowDownWideNarrow className="mx-auto h-9 w-9 text-[#B388FF]" />
              )}
              <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-white/46">Kural</p>
              <p className="mt-1 text-lg font-black text-white">{isAscending ? 'Küçükten büyüğe' : 'Büyükten küçüğe'}</p>
            </div>
          </>
        )}
        <div className="mt-5 grid grid-cols-3 gap-2" aria-label="Görev ilerlemesi">
          {tasks.map((item, index) => (
            <div
              key={`${item.direction}-${index}`}
              className={`grid min-h-12 place-items-center rounded-2xl border text-sm font-black ${
                index === taskIndex && !isComplete
                  ? 'border-[#B388FF]/54 bg-[#B388FF]/16 text-white'
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
  return (
    <motion.div
      initial={isPlaced ? { scale: 0.75, opacity: 0 } : undefined}
      animate={isPlaced ? { scale: 1, opacity: 1 } : { y: [0, -4, 0] }}
      transition={isPlaced ? { type: 'spring', stiffness: 180, damping: 14 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative grid min-h-24 place-items-center rounded-[1.6rem] border px-3 ${
        isWrong ? 'border-pink-200/52 bg-pink-300/10' : isFreshlyPlaced ? 'border-emerald-200/52 bg-emerald-300/10' : 'border-white/14 bg-black/24'
      }`}
      style={{ boxShadow: `0 0 ${isFreshlyPlaced ? 34 : 24}px ${tone}${isFreshlyPlaced ? '55' : '28'}` }}
    >
      {isFreshlyPlaced && <Sparkles className="absolute right-3 top-3 h-5 w-5 text-emerald-100" />}
      <div className="absolute inset-x-4 top-3 h-3 rounded-full bg-white/12" />
      <p className="text-4xl font-black text-white">{value}</p>
      <div className="absolute bottom-2 flex gap-5">
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
  const directions: Direction[] = ['asc', 'desc', Math.random() > 0.5 ? 'asc' : 'desc'];
  const nextTasks = directions.map((direction) => createTask(direction));

  if (tasksKey(nextTasks) !== tasksKey(previousTasks)) return nextTasks;

  return directions.map((direction, index) => {
    const base = 21 + index * 13;
    const numbers = shuffleNumbers([base, base + 8, base + 19, base + 31]);
    const ordered = [...numbers].sort((first, second) => direction === 'asc' ? first - second : second - first);
    return { numbers, ordered, direction };
  });
}

function createTask(direction: Direction): OrderingTask {
  const values = new Set<number>();

  while (values.size < 4) {
    values.add(randomInt(12, 98));
  }

  const numbers = shuffleNumbers([...values]);
  const ordered = [...numbers].sort((first, second) => direction === 'asc' ? first - second : second - first);
  return { numbers, ordered, direction };
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
  return tasks.map((task) => `${task.direction}:${task.ordered.join(',')}`).join('|');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
