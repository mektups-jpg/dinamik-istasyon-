import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Rocket, Target } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade1Completion, Grade1MissionFrame, Grade1Panel } from '../shared/Grade1MissionKit';
import type { BotMessage } from '../../../components/ui/AstroBot';

const ACCENT = '#B388FF';
const TOTAL_ROCKETS = 10;
const TASKS_PER_ROUND = 3;

interface RocketTask {
  target: number;
  label: string;
}

const ordinalLabels = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.'];

const rocketThemes = [
  { body: '#22D3EE', fin: '#0284C7', glow: 'rgba(34,211,238,0.35)' },
  { body: '#F97316', fin: '#C2410C', glow: 'rgba(249,115,22,0.34)' },
  { body: '#A78BFA', fin: '#7C3AED', glow: 'rgba(167,139,250,0.36)' },
  { body: '#34D399', fin: '#059669', glow: 'rgba(52,211,153,0.34)' },
  { body: '#FACC15', fin: '#CA8A04', glow: 'rgba(250,204,21,0.34)' },
  { body: '#FB7185', fin: '#E11D48', glow: 'rgba(251,113,133,0.34)' },
  { body: '#60A5FA', fin: '#2563EB', glow: 'rgba(96,165,250,0.34)' },
  { body: '#C084FC', fin: '#9333EA', glow: 'rgba(192,132,252,0.35)' },
  { body: '#2DD4BF', fin: '#0F766E', glow: 'rgba(45,212,191,0.34)' },
  { body: '#FBBF24', fin: '#D97706', glow: 'rgba(251,191,36,0.34)' },
];

export default function OrdinalRocketLineApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<RocketTask[]>(() => createRocketTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!isComplete) return;
    unlockAtom('MAT.1.1.3.1');
    unlockAtom('MAT.1.1.3.2');
    unlockModule('ordinal-rocket-line');
    addScore(80);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const chooseRocket = (rocketNumber: number) => {
    if (feedback === 'success') return;
    setSelected(rocketNumber);

    if (rocketNumber !== task.target) {
      setFeedback('error');
      window.setTimeout(() => {
        setFeedback('idle');
        setSelected(null);
      }, 750);
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
    setTasks((currentTasks) => createRocketTasks(currentTasks));
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 40, text: 'Roket sırasını çözdün! Sıra sayıları artık pırıl pırıl.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: 'Doğru roket! Sıra sayısı, çizgideki yerini anlatır.', type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: 'Baştan say: üst sırada soldan sağa, sonra alt sırada devam et.', type: 'error' };
    return { id: taskIndex * 10 + 1, text: `${task.label} hangisi? Üst sıradan soldan sağa say, sonra alt sıraya geç.`, type: 'info' };
  })();

  return (
    <Grade1MissionFrame
      title="Sıra Roketi"
      subtitle="İlkokul 1. Sınıf / Sıra Sayıları"
      icon={<Rocket className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-[#B388FF]/20 bg-[#0C1024]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade1Completion
              key="complete"
              title="Filo Hazır!"
              message="Sıra eklerini okudun ve istenen sıradaki roketi seçtin."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.1.1.3.1', label: 'Sıra eklerini seçer.' },
                { id: 'MAT.1.1.3.2', label: 'İstenen sıradaki nesneyi işaretler.' },
              ]}
            />
          ) : (
            <motion.div
              key={taskIndex}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full"
            >
              <div className="mb-6 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#B388FF]/74">Sırayı bul</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.label} hangisi?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {ordinalLabels.map((label, index) => {
                  const rocketNumber = index + 1;
                  const isSelected = selected === rocketNumber;
                  const isTarget = feedback === 'success' && rocketNumber === task.target;
                  const theme = rocketThemes[index];
                  return (
                    <motion.button
                      type="button"
                      key={label}
                      aria-label={`${rocketNumber}. roket`}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => chooseRocket(rocketNumber)}
                      className={`relative flex min-h-36 flex-col items-center justify-between rounded-[2rem] border p-3 transition md:min-h-40 md:p-4 ${
                        isTarget
                          ? 'border-emerald-300/70 bg-emerald-300/14'
                          : isSelected
                            ? 'border-pink-300/70 bg-pink-300/12'
                            : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.10]'
                      }`}
                      style={isTarget ? { boxShadow: `0 0 34px ${theme.glow}` } : undefined}
                    >
                      <span className="rounded-full border border-white/10 bg-black/28 px-3 py-1 text-sm font-black text-white/70">{label}</span>
                      <motion.div
                        animate={isTarget ? { y: [-4, -16, -4] } : { y: [0, -6, 0] }}
                        transition={{ duration: isTarget ? 0.55 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="grid h-20 w-20 place-items-center rounded-[28px] border border-white/10 bg-black/18"
                        style={{ boxShadow: `0 0 24px ${theme.glow}` }}
                      >
                        <RocketGlyph theme={theme} />
                      </motion.div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/38">Roket</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade1Panel>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B388FF]/74">Görev kartı</p>
        <h2 className="mt-2 text-2xl font-black">Soldan sağa say.</h2>
        <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
          Üst sırada 1-5, alt sırada 6-10. Renkler roketi ayırt etmeye yardım eder.
        </p>
        <div className="mt-5 rounded-3xl border border-[#B388FF]/18 bg-[#B388FF]/10 p-5 text-center">
          <Target className="mx-auto h-9 w-9 text-[#B388FF]" />
          <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-white/46">Hedef</p>
          <p className="mt-1 text-4xl font-black text-white">{task.label}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2" aria-label="Görev ilerlemesi">
          {tasks.map((item, index) => (
            <div
              key={item.label}
              className={`grid min-h-12 place-items-center rounded-2xl border text-sm font-black ${
                index === taskIndex
                  ? 'border-[#B388FF]/54 bg-[#B388FF]/16 text-white'
                  : index < taskIndex
                    ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
                    : 'border-white/10 bg-white/[0.04] text-white/36'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </Grade1Panel>
    </Grade1MissionFrame>
  );
}

function RocketGlyph({ theme }: { theme: { body: string; fin: string; glow: string } }) {
  return (
    <div className="relative h-16 w-14" aria-hidden="true">
      <div
        className="absolute left-1/2 top-0 h-12 w-8 -translate-x-1/2 rounded-t-full rounded-b-[18px] border border-white/35 shadow-[inset_0_8px_10px_rgba(255,255,255,0.24),inset_0_-10px_14px_rgba(0,0,0,0.22)]"
        style={{ background: `linear-gradient(160deg, #FFFFFF 0%, ${theme.body} 34%, ${theme.fin} 100%)` }}
      >
        <div className="absolute left-1/2 top-4 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white/70 bg-[#07101d] shadow-[0_0_12px_rgba(255,255,255,0.30)]" />
      </div>
      <div
        className="absolute bottom-3 left-1 h-5 w-4 -rotate-12 rounded-t-2xl rounded-bl-md"
        style={{ background: theme.fin }}
      />
      <div
        className="absolute bottom-3 right-1 h-5 w-4 rotate-12 rounded-t-2xl rounded-br-md"
        style={{ background: theme.fin }}
      />
      <motion.div
        animate={{ scaleY: [0.72, 1.08, 0.72], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/2 h-6 w-5 -translate-x-1/2 rounded-b-full rounded-t-[10px] bg-gradient-to-b from-yellow-200 via-orange-400 to-pink-500 blur-[0.2px]"
      />
    </div>
  );
}

function createRocketTasks(previousTasks: RocketTask[] = []): RocketTask[] {
  const previousKey = previousTasks.map((task) => task.target).join(',');

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const targets = shuffleNumbers(TOTAL_ROCKETS).slice(0, TASKS_PER_ROUND).sort((first, second) => first - second);
    const nextTasks = targets.map((target) => ({ target, label: `${target}. roket` }));
    const nextKey = nextTasks.map((task) => task.target).join(',');

    if (nextKey !== previousKey) return nextTasks;
  }

  return previousTasks.length > 0
    ? previousTasks.map((task) => {
        const target = task.target === TOTAL_ROCKETS ? 1 : task.target + 1;
        return { target, label: `${target}. roket` };
      }).sort((first, second) => first.target - second.target)
    : [
        { target: 2, label: '2. roket' },
        { target: 5, label: '5. roket' },
        { target: 10, label: '10. roket' },
      ];
}

function shuffleNumbers(total: number): number[] {
  const values = Array.from({ length: total }, (_, index) => index + 1);

  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }

  return values;
}
