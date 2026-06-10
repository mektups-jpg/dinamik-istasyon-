import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Equal, Scale } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade1ChoiceButton, Grade1Completion, Grade1MissionFrame, Grade1Panel } from '../shared/Grade1MissionKit';
import type { BotMessage } from '../../../components/ui/AstroBot';

const ACCENT = '#00FF88';
const MAX_BALANCE_VALUE = 10;
const MAX_RIGHT_START = 7;
const MAX_ADD_VALUE = 5;
const TASKS_PER_ROUND = 3;

interface BalanceTask {
  left: number;
  right: number;
  choices: number[];
}

export default function EqualityBalanceLabApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<BalanceTask[]>(() => createBalanceTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const needed = task.left - task.right;
  const rightTotal = task.right + (selected ?? 0);
  const tilt = Math.max(-10, Math.min(10, (rightTotal - task.left) * 3));

  const leftCubes = useMemo(() => Array.from({ length: task.left }, (_, index) => index), [task.left]);
  const rightCubes = useMemo(() => Array.from({ length: rightTotal }, (_, index) => index), [rightTotal]);

  useEffect(() => {
    if (!isComplete) return;
    unlockAtom('MAT.1.2.3.1');
    unlockAtom('MAT.1.2.3.2');
    unlockModule('equality-balance-lab');
    addScore(80);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const chooseCube = (value: number) => {
    if (feedback === 'success') return;
    setSelected(value);

    if (value !== needed) {
      setFeedback('error');
      window.setTimeout(() => {
        setFeedback('idle');
        setSelected(null);
      }, 850);
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
    setTasks((currentTasks) => createBalanceTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 40, text: 'Terazi dengede! Eşittir işaretinin iki tarafı aynı güçte tuttuğunu kanıtladın.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: 'Denge geldi! İki tarafta da aynı sayıda enerji küpü var.', type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: 'Terazi hâlâ eğik. Sağ tarafı sol tarafla aynı sayıya getirmen gerekiyor.', type: 'error' };
    return { id: taskIndex * 10 + 1, text: `Sağ tarafa kaç küp eklersek ${task.left} = ${task.right} + ? dengelenir?`, type: 'info' };
  })();

  return (
    <Grade1MissionFrame
      title="Denge Terazisi"
      subtitle="İlkokul 1. Sınıf / Eşittir ve Denge"
      icon={<Scale className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-[#00FF88]/18 bg-[#071D18]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade1Completion
              key="complete"
              title="Denge Kuruldu!"
              message="Eşittir işaretinin iki tarafı aynı miktara getirdiğini gördün."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.1.2.3.1', label: 'Eşittir sembolünün denge anlamını onaylar.' },
                { id: 'MAT.1.2.3.2', label: 'Eşitliğin iki tarafını terazide test eder.' },
              ]}
            />
          ) : (
            <motion.div
              key={taskIndex}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-4xl"
            >
              <div className="mb-6 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#00FF88]/72">Dengeyi kur</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">
                  {task.left} = {task.right} + ?
                </h2>
              </div>

              <div className="relative mx-auto min-h-[340px] rounded-[2rem] border border-white/10 bg-black/28 p-5">
                <motion.div
                  animate={{ rotate: tilt }}
                  transition={{ type: 'spring', stiffness: 130, damping: 16 }}
                  className="absolute left-1/2 top-28 h-3 w-[82%] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00E5FF] via-white to-[#00FF88] shadow-[0_0_26px_rgba(0,255,136,0.20)]"
                />
                <div className="absolute left-1/2 top-28 h-40 w-4 -translate-x-1/2 rounded-full bg-white/18" />
                <div className="absolute left-1/2 top-[260px] h-5 w-36 -translate-x-1/2 rounded-full bg-white/14" />

                <div className="grid grid-cols-[1fr_92px_1fr] gap-3 pt-10">
                  <CubeTray title="Sol" count={task.left} cubes={leftCubes} tone="#00E5FF" />
                  <div className="flex flex-col items-center justify-center">
                    <div className="grid h-20 w-20 place-items-center rounded-[28px] border border-[#00FF88]/24 bg-[#00FF88]/12">
                      <Equal className="h-11 w-11 text-[#00FF88]" />
                    </div>
                    <p className="mt-3 text-center text-xs font-black uppercase tracking-[0.16em] text-white/42">Aynı mı?</p>
                  </div>
                  <CubeTray title="Sağ" count={rightTotal} cubes={rightCubes} tone="#00FF88" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade1Panel>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00FF88]/74">Enerji küpü</p>
        <h2 className="mt-2 text-2xl font-black">Sağa kaç ekleyelim?</h2>
        <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
          Amaç iki tarafı aynı sayıya getirmek. Denge gelince eşittir anlam kazanır.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3">
          {task.choices.map((choice) => (
            <Grade1ChoiceButton
              key={choice}
              onClick={() => chooseCube(choice)}
              selected={selected === choice}
              disabled={isComplete}
              accent={ACCENT}
            >
              <span className="text-3xl">+{choice}</span>
            </Grade1ChoiceButton>
          ))}
        </div>
      </Grade1Panel>
    </Grade1MissionFrame>
  );
}

function CubeTray({ title, count, cubes, tone }: { title: string; count: number; cubes: number[]; tone: string }) {
  return (
    <div className="flex min-h-56 flex-col justify-end rounded-[2rem] border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-3 text-center">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{title}</p>
        <p className="text-4xl font-black" style={{ color: tone }}>{count}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {cubes.map((cube) => (
          <motion.div
            key={cube}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="aspect-square rounded-2xl border border-white/12"
            style={{ background: `${tone}22`, boxShadow: `0 0 18px ${tone}22` }}
          />
        ))}
      </div>
    </div>
  );
}

function createBalanceTasks(previousTasks: BalanceTask[] = []): BalanceTask[] {
  const previousKey = tasksKey(previousTasks);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const nextTasks: BalanceTask[] = [];
    const used = new Set<string>();

    while (nextTasks.length < TASKS_PER_ROUND) {
      const right = randomInt(2, MAX_RIGHT_START);
      const needed = randomInt(1, Math.min(MAX_ADD_VALUE, MAX_BALANCE_VALUE - right));
      const left = right + needed;
      const key = `${left}-${right}`;

      if (!used.has(key)) {
        used.add(key);
        nextTasks.push({ left, right, choices: createChoices(needed, MAX_BALANCE_VALUE - right) });
      }
    }

    if (tasksKey(nextTasks) !== previousKey) return nextTasks;
  }

  return previousTasks.length > 0
    ? previousTasks.map((task) => {
        const needed = task.left - task.right;
        const right = task.right === MAX_RIGHT_START ? 2 : task.right + 1;
        const nextNeeded = Math.min(needed, MAX_BALANCE_VALUE - right);
        return {
          left: right + nextNeeded,
          right,
          choices: createChoices(nextNeeded, MAX_BALANCE_VALUE - right),
        };
      })
    : [
        { left: 4, right: 2, choices: [1, 2, 3] },
        { left: 7, right: 4, choices: [2, 3, 5] },
        { left: 9, right: 5, choices: [3, 4, 6] },
      ];
}

function createChoices(correct: number, maxChoice: number): number[] {
  const candidates = new Set<number>([correct]);
  const nearby = [correct - 2, correct - 1, correct + 1, correct + 2, correct + 3];

  for (const value of nearby) {
    if (value >= 1 && value <= maxChoice && value !== correct) candidates.add(value);
    if (candidates.size === 3) break;
  }

  for (let value = 1; value <= maxChoice && candidates.size < 3; value += 1) {
    candidates.add(value);
  }

  return [...candidates].sort((first, second) => first - second);
}

function tasksKey(tasks: BalanceTask[]): string {
  return tasks.map((task) => `${task.left}-${task.right}`).join('|');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
