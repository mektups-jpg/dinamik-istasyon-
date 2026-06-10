import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Boxes, CheckCircle2, Hash } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { Grade2Completion, Grade2MissionFrame, Grade2Panel } from '../shared/Grade2MissionKit';

const ACCENT = '#00E5FF';
const TASKS_PER_ROUND = 3;

interface HundredTask {
  value: number;
  choices: number[];
}

export default function HundredBoxCountApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<HundredTask[]>(() => createHundredTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const tens = Math.floor(task.value / 10);
  const ones = task.value % 10;
  const tenRods = useMemo(() => Array.from({ length: tens }, (_, index) => index), [tens]);
  const oneCubes = useMemo(() => Array.from({ length: ones }, (_, index) => index), [ones]);

  useEffect(() => {
    if (!isComplete) return;
    unlockAtom('MAT.2.1.1.1');
    unlockAtom('MAT.2.1.1.2');
    unlockModule('hundred-box-count');
    addScore(90);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (value: number) => {
    if (feedback === 'success') return;
    setSelected(value);

    if (value !== task.value) {
      setFeedback('error');
      window.setTimeout(() => {
        setFeedback('idle');
        setSelected(null);
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
    }, 850);
  };

  const restart = () => {
    setTasks((currentTasks) => createHundredTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 80, text: 'Sayı kutusu tamam! Onlukları ve birlikleri doğru sayı kartıyla eşleştirdin.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: 'Doğru sayı! Onluklar önce gelir, birlikler sonuna eklenir.', type: 'success' };
    if (feedback === 'error' && selected !== null) {
      return {
        id: taskIndex * 10 + 3,
        text: `${selected} sayısı ${Math.floor(selected / 10)} onluk ve ${selected % 10} birlik demek. Kutuda ${tens} onluk ve ${ones} birlik var.`,
        type: 'error',
      };
    }
    return { id: taskIndex * 10 + 1, text: `${tens} onluk ve ${ones} birlik var. Doğru sayı kartına dokun.`, type: 'info' };
  })();

  return (
    <Grade2MissionFrame
      title="Sayı Oluşturma"
      subtitle="İlkokul 2. Sınıf / Onluk ve Birlikten Sayı Kurma"
      icon={<Boxes className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="hundred-box-count-stage"
        className="flex min-h-[540px] items-center justify-center overflow-hidden rounded-[2rem] border border-[#00E5FF]/18 bg-[radial-gradient(circle_at_50%_18%,rgba(0,229,255,0.14),transparent_34%),linear-gradient(180deg,rgba(7,21,35,0.94),rgba(5,12,22,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade2Completion
              key="complete"
              title="Kutu Okundu!"
              message="Onlukları ve birlikleri okuyup doğru sayı kartıyla eşleştirdin."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.2.1.1.1', label: "100'e kadar blok/nesne sayısını görsel tanır." },
                { id: 'MAT.2.1.1.2', label: "100'e kadar çokluğu doğru sayı sembolüyle eşleştirir." },
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
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#00E5FF]/72">Bak ve eşleştir</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">Bu kutuda kaç var?</h2>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/24 p-4 shadow-[inset_0_0_42px_rgba(0,229,255,0.04)]">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_150px]">
                  <div className="rounded-[1.6rem] border border-[#B388FF]/16 bg-[#B388FF]/8 p-4">
                    <p className="mb-3 text-center font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#B388FF]/72">Onluk çubuklar</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {tenRods.map((rod) => (
                        <TenRod key={rod} index={rod} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-[#00E5FF]/16 bg-[#00E5FF]/8 p-4">
                    <p className="mb-3 text-center font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/72">Birlikler</p>
                    <div className="grid grid-cols-3 gap-2">
                      {oneCubes.length === 0 ? (
                        <div className="col-span-3 grid min-h-32 place-items-center rounded-3xl border border-dashed border-[#00E5FF]/22 bg-black/20 text-center">
                          <span className="text-4xl font-black text-white/34">0</span>
                          <span className="-mt-7 text-xs font-black uppercase tracking-[0.18em] text-[#00E5FF]/48">birlik</span>
                        </div>
                      ) : (
                        oneCubes.map((cube) => <OneCube key={cube} index={cube} />)
                      )}
                    </div>
                  </div>
                </div>

                <div data-testid="hundred-box-count-math-strip" className="mt-4 grid gap-2 sm:grid-cols-3">
                  <NumberStrip label="Onluklar" value={`${tens} x 10 = ${tens * 10}`} tone="purple" />
                  <NumberStrip label="Birlikler" value={`${ones} x 1 = ${ones}`} tone="cyan" />
                  <NumberStrip label="Sayı kartı" value={`${tens * 10} + ${ones} = ?`} tone="green" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade2Panel>
        {isComplete ? (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/74">Kutu kutlaması</p>
            <h2 className="mt-2 text-2xl font-black">Sayı kutusu tamam!</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/58">
              Onlukları ve birlikleri sayıya çevirdin.
            </p>
            <div className="mt-5 rounded-3xl border border-emerald-300/24 bg-emerald-300/10 p-5 text-center shadow-[0_0_34px_rgba(52,246,164,0.12)]">
              <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-200" />
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-100/70">Görevler tamam</p>
              <p className="mt-1 text-4xl font-black text-white">3/3</p>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/74">Sayı kartları</p>
            <h2 className="mt-2 text-2xl font-black">Sayıyı seç.</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
              Onluk 10 eder. Birlik 1 eder.
            </p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-black/22 p-4 text-center">
              <Hash className="mx-auto h-8 w-8 text-[#00E5FF]" />
              <p className="mt-2 text-sm font-black text-white/62">{tens} onluk + {ones} birlik</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3">
              {task.choices.map((choice) => (
                <HundredChoiceButton
                  key={choice}
                  value={choice}
                  onClick={() => choose(choice)}
                  selected={selected === choice}
                  feedback={feedback}
                />
              ))}
            </div>
          </>
        )}
      </Grade2Panel>
    </Grade2MissionFrame>
  );
}

function TenRod({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0.78, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.035 }}
      className="grid h-28 grid-rows-5 gap-1 rounded-3xl border border-[#B388FF]/30 bg-[#B388FF]/12 p-2 shadow-[0_0_24px_rgba(179,136,255,0.14)]"
      aria-label="bir onluk"
    >
      {Array.from({ length: 5 }, (_, row) => (
        <div key={row} className="grid grid-cols-2 gap-1">
          <div className="rounded-lg bg-[#B388FF]/58 shadow-[inset_0_0_10px_rgba(255,255,255,0.16)]" />
          <div className="rounded-lg bg-[#B388FF]/42 shadow-[inset_0_0_10px_rgba(255,255,255,0.14)]" />
        </div>
      ))}
    </motion.div>
  );
}

function OneCube({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="aspect-square rounded-2xl border border-[#00E5FF]/26 bg-[#00E5FF]/18 shadow-[0_0_20px_rgba(0,229,255,0.16)]"
      aria-label="bir birlik"
    />
  );
}

function NumberStrip({ label, value, tone }: { label: string; value: string; tone: 'purple' | 'cyan' | 'green' }) {
  const toneClass = tone === 'purple'
    ? 'border-[#B388FF]/18 bg-[#B388FF]/10 text-[#E2D3FF]'
    : tone === 'cyan'
      ? 'border-[#00E5FF]/18 bg-[#00E5FF]/10 text-[#BDF8FF]'
      : 'border-emerald-300/18 bg-emerald-300/10 text-emerald-100';

  return (
    <div className={`rounded-2xl border px-3 py-3 text-center ${toneClass}`}>
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/48">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function HundredChoiceButton({
  value,
  onClick,
  selected,
  feedback,
}: {
  value: number;
  onClick: () => void;
  selected: boolean;
  feedback: 'idle' | 'success' | 'error';
}) {
  const isSuccess = selected && feedback === 'success';
  const isError = selected && feedback === 'error';

  return (
    <motion.button
      type="button"
      data-testid={`hundred-box-count-choice-${value}`}
      aria-label={`${value} sayı kartı`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      animate={isSuccess ? { scale: [1, 1.05, 1] } : isError ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0, scale: 1 }}
      transition={{ duration: isSuccess ? 0.42 : 0.34 }}
      onClick={onClick}
      className={`min-h-16 rounded-3xl border px-4 py-3 text-lg font-black transition ${
        isSuccess
          ? 'border-[#00FF88]/70 bg-[#00FF88]/18 text-[#B8FFD8] shadow-[0_0_34px_rgba(0,255,136,0.34)]'
          : isError
            ? 'border-[#FF4FA3]/70 bg-[#FF4FA3]/14 text-[#FFB4D4] shadow-[0_0_28px_rgba(255,79,163,0.24)]'
            : selected
            ? 'border-white/40 bg-white/16 text-white shadow-[0_0_26px_rgba(0,229,255,0.28)]'
            : 'border-white/10 bg-white/[0.06] text-white/86 hover:bg-white/[0.10]'
      }`}
    >
      <span className="text-4xl">{value}</span>
    </motion.button>
  );
}

function createHundredTasks(previousTasks: HundredTask[] = []): HundredTask[] {
  const previousKey = tasksKey(previousTasks);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const nextTasks: HundredTask[] = [];
    const used = new Set<number>();
    const answerSlots = createAnswerSlots();

    while (nextTasks.length < TASKS_PER_ROUND) {
      const tens = randomInt(2, 9);
      const ones = randomInt(0, 9);
      const value = tens * 10 + ones;
      if (!used.has(value)) {
        used.add(value);
        nextTasks.push({ value, choices: createChoices(value, answerSlots[nextTasks.length]) });
      }
    }

    if (tasksKey(nextTasks) !== previousKey) return nextTasks;
  }

  const answerSlots = createAnswerSlots();
  return [
    { value: 36, choices: createChoices(36, answerSlots[0]) },
    { value: 58, choices: createChoices(58, answerSlots[1]) },
    { value: 74, choices: createChoices(74, answerSlots[2]) },
  ];
}

function createChoices(correct: number, taskSlot = randomInt(0, 2)): number[] {
  const distractors = new Set<number>();
  const candidates = [correct - 10, correct + 10, correct - 1, correct + 1, correct - 9, correct + 9];

  for (const value of candidates) {
    if (value >= 1 && value <= 100 && value !== correct) distractors.add(value);
    if (distractors.size === 2) break;
  }

  for (let value = 1; value <= 100 && distractors.size < 2; value += 1) {
    if (value !== correct) distractors.add(value);
  }

  const choices: number[] = [];
  const remainingDistractors = [...distractors];
  const correctSlot = taskSlot % 3;

  for (let index = 0; index < 3; index += 1) {
    choices.push(index === correctSlot ? correct : remainingDistractors.shift() ?? correct);
  }

  return choices;
}

function createAnswerSlots(): number[] {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const slots = shuffleNumbers([0, 1, 2]);
    if (slots.join(',') !== '0,1,2') return slots;
  }

  return [1, 2, 0];
}

function shuffleNumbers(values: number[]): number[] {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function tasksKey(tasks: HundredTask[]): string {
  return tasks.map((task) => task.value).join('|');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
