import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, CircleDot, Pizza } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import type { BotMessage } from '../../../components/ui/AstroBot';
import { Grade2ChoiceButton, Grade2Completion, Grade2MissionFrame, Grade2Panel } from '../shared/Grade2MissionKit';

const ACCENT = '#FFB020';

interface FractionTask {
  id: string;
  title: string;
  prompt: string;
  correct: number;
  choices: number[];
  pieces: 2 | 4;
  filledPieces: number;
  atomId: string;
}

const BASE_TASKS: FractionTask[] = [
  {
    id: 'half-cut',
    title: 'Yarım',
    prompt: 'Yarım pizza yapmak için bütün pizza kaç eş dilime ayrılır?',
    correct: 2,
    choices: [2, 3, 4],
    pieces: 2,
    filledPieces: 1,
    atomId: 'MAT.2.1.7.1',
  },
  {
    id: 'halves-whole',
    title: 'Bütün',
    prompt: 'Bir bütün pizza için kaç yarım parçayı birleştiririz?',
    correct: 2,
    choices: [1, 2, 3],
    pieces: 2,
    filledPieces: 2,
    atomId: 'MAT.2.1.7.2',
  },
  {
    id: 'quarter-cut',
    title: 'Çeyrek',
    prompt: 'Çeyrek pizza yapmak için bütün pizza kaç eş dilime ayrılır?',
    correct: 4,
    choices: [2, 3, 4],
    pieces: 4,
    filledPieces: 1,
    atomId: 'MAT.2.1.7.3',
  },
  {
    id: 'quarters-whole',
    title: 'Bütün',
    prompt: 'Bir bütün pizza için kaç çeyrek parçayı birleştiririz?',
    correct: 4,
    choices: [2, 3, 4],
    pieces: 4,
    filledPieces: 4,
    atomId: 'MAT.2.1.7.4',
  },
];

export default function FractionPizzaWorkshopApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<FractionTask[]>(() => createFractionTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    tasks.forEach((item) => unlockAtom(item.atomId));
    unlockModule('fraction-pizza-workshop');
    addScore(100);
  }, [addScore, isComplete, tasks, unlockAtom, unlockModule]);

  const choose = (value: number) => {
    if (feedback === 'success') return;
    setSelected(value);

    if (value !== task.correct) {
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
    }, 850);
  };

  const restart = () => {
    setTasks((currentTasks) => createFractionTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 100, text: 'Pizza atölyesi hazır! Bütün, yarım ve çeyrek parçaları ayırt ettin.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: 'Doğru sayı! Pizza eş dilimlerle tam oldu.', type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: 'Pizza dilimlerine tekrar bak. Dilimler eş olmalı.', type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  })();

  return (
    <Grade2MissionFrame
      title="Yarım-Çeyrek Pizza Atölyesi"
      subtitle="İlkokul 2. Sınıf / Bütün, Yarım ve Çeyrek"
      icon={<Pizza className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section
        data-testid="fraction-pizza-workshop-stage"
        className="flex min-h-[540px] items-center justify-center rounded-[2rem] border border-[#FFB020]/20 bg-[#1C1308]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]"
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade2Completion
              key="complete"
              title="Atölye Tamam!"
              message="Yarım, çeyrek ve bütün parçalarını eş parça fikriyle kurdun."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.2.1.7.1', label: 'Şekli iki eş parçaya bölerek yarım elde eder.' },
                { id: 'MAT.2.1.7.2', label: 'İki yarımı birleştirip bütün eder.' },
                { id: 'MAT.2.1.7.3', label: 'Bütünü dört eş parçaya bölerek çeyrek oluşturur.' },
                { id: 'MAT.2.1.7.4', label: 'Dört çeyrekle bütün oluşturur.' },
              ]}
            />
          ) : (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-4xl"
            >
              <div className="mb-6 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#FFB020]/74">Parçayı gör</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
              </div>

              <div className="grid grid-cols-1 items-center gap-5 rounded-[2rem] border border-white/10 bg-black/24 p-5 md:grid-cols-[1fr_220px]">
                <div className="grid place-items-center rounded-[2rem] border border-[#FFB020]/14 bg-[#FFB020]/8 p-6">
                  <PizzaVisual pieces={task.pieces} filledPieces={task.filledPieces} feedback={feedback} />
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 text-center">
                  <CircleDot className="mx-auto h-9 w-9 text-[#FFB020]" />
                  <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/44">Soru</p>
                  <p className="mt-1 text-4xl font-black text-white">{task.title}</p>
                  <p className="mt-3 text-sm font-black leading-snug text-white/58">{task.prompt}</p>
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
            <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FFB020]/74">
              Pizza kutlaması
            </p>
            <h2 className="mt-2 text-2xl font-black">Bütün tabak tamam!</h2>
            <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">
              Yarım, çeyrek ve bütün parçaları eş dilimlerle doğru kurdun.
            </p>
            <div className="mt-6 rounded-3xl border border-emerald-300/22 bg-emerald-300/10 px-6 py-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Görevler tamam</p>
              <p className="mt-1 text-4xl font-black text-emerald-300">{tasks.length}/{tasks.length}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FFB020]/74">Parça kartları</p>
            <h2 className="mt-2 text-2xl font-black">Doğru sayıya dokun.</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
              Pizzaya bak, sorudaki parçaları say ve doğru sayıya dokun.
            </p>
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
                    accent={ACCENT}
                  >
                    <span className="text-3xl">{choice} parça</span>
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

function PizzaVisual({
  pieces,
  filledPieces,
  feedback,
}: {
  pieces: 2 | 4;
  filledPieces: number;
  feedback: 'idle' | 'success' | 'error';
}) {
  const angle = 360 / pieces;
  const filledAngle = angle * filledPieces;
  const fillColor = feedback === 'success' ? '#00FF88' : '#FFB020';
  const background = `conic-gradient(${fillColor} 0deg ${filledAngle}deg, rgba(255,255,255,0.10) ${filledAngle}deg 360deg)`;

  return (
    <motion.div
      animate={feedback === 'error' ? { rotate: [-2, 2, -1, 1, 0] } : { rotate: 0 }}
      className="relative grid h-72 w-72 place-items-center rounded-full border-[12px] border-[#B45309] shadow-[inset_0_0_38px_rgba(0,0,0,0.32),0_24px_60px_rgba(0,0,0,0.32)]"
      style={{ background }}
      aria-label="pizza parçaları"
    >
      <div className="absolute inset-[11%] rounded-full border border-white/16 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.20),transparent_16%),radial-gradient(circle_at_64%_62%,rgba(255,255,255,0.16),transparent_18%)]" />
      {Array.from({ length: pieces }, (_, index) => (
        <div
          key={index}
          className="absolute left-1/2 top-1/2 h-[47%] w-1 origin-bottom rounded-full bg-[#5A2B10]/72"
          style={{ transform: `translate(-50%, -100%) rotate(${index * angle}deg)` }}
        />
      ))}
      <Topping top="27%" left="40%" />
      <Topping top="41%" left="65%" />
      <Topping top="63%" left="34%" />
      <Topping top="64%" left="58%" />
      <div className="relative grid h-24 w-24 place-items-center rounded-[2rem] border border-white/12 bg-black/32 backdrop-blur-sm">
        <span className="text-4xl font-black text-white">{filledPieces}/{pieces}</span>
      </div>
    </motion.div>
  );
}

function Topping({ top, left }: { top: string; left: string }) {
  return (
    <div
      className="absolute h-5 w-5 rounded-full border border-white/18 bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.28)]"
      style={{ top, left }}
    />
  );
}

function createFractionTasks(previousTasks: FractionTask[] = []): FractionTask[] {
  const nextTasks = BASE_TASKS.map((task) => ({
    ...task,
    choices: shuffleItems(task.choices),
  }));

  if (choicesKey(nextTasks) !== choicesKey(previousTasks)) return nextTasks;

  return BASE_TASKS.map((task, index) => ({
    ...task,
    choices: rotateChoices(task.choices, index + 1),
  }));
}

function rotateChoices(values: number[], offset: number): number[] {
  return values.map((_, index) => values[(index + offset) % values.length]);
}

function shuffleItems<T>(values: T[]): T[] {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function choicesKey(tasks: FractionTask[]): string {
  return tasks.map((task) => `${task.id}:${task.choices.join('-')}`).join('|');
}
