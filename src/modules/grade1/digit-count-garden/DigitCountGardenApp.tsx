import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Flower2 } from 'lucide-react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade1ChoiceButton, Grade1Completion, Grade1MissionFrame, Grade1Panel } from '../shared/Grade1MissionKit';
import type { BotMessage } from '../../../components/ui/AstroBot';

const ACCENT = '#00E5FF';

const tasks = [
  { count: 6, choices: [4, 6, 8] },
  { count: 9, choices: [7, 9, 10] },
  { count: 12, choices: [11, 12, 14] },
];

export default function DigitCountGardenApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [taskIndex, setTaskIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [selected, setSelected] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const task = tasks[taskIndex];
  const seeds = useMemo(() => Array.from({ length: task.count }, (_, index) => index), [task.count]);

  useEffect(() => {
    if (!isComplete) return;
    unlockAtom('MAT.1.1.1.1');
    unlockAtom('MAT.1.1.1.4');
    unlockAtom('MAT.1.1.1.5');
    unlockModule('digit-count-garden');
    addScore(90);
  }, [addScore, isComplete, unlockAtom, unlockModule]);

  const choose = (value: number) => {
    if (feedback === 'success') return;
    setSelected(value);
    if (value !== task.count) {
      setFeedback('error');
      window.setTimeout(() => {
        setFeedback('idle');
        setSelected(null);
      }, 700);
      return;
    }

    setFeedback('success');
    window.setTimeout(() => {
      if (taskIndex === tasks.length - 1) {
        setIsComplete(true);
      } else {
        setTaskIndex((current) => current + 1);
        setFeedback('idle');
        setSelected(null);
      }
    }, 800);
  };

  const restart = () => {
    setTaskIndex(0);
    setFeedback('idle');
    setSelected(null);
    setIsComplete(false);
  };

  const botMessage: BotMessage = (() => {
    if (isComplete) return { id: 40, text: 'Rakam bahçesi parladı! Çokluğu sayıyla eşleştirdin.', type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: 'Tam isabet! Saydığın çokluk karttaki rakamla aynı.', type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: 'Bir daha sayalım. Her tohumu bir kez gözünle takip et, sonra rakam kartına dokun.', type: 'error' };
    return { id: taskIndex * 10 + 1, text: 'Bahçedeki tohumları say, sonra aynı sayıyı gösteren büyük karta dokun.', type: 'info' };
  })();

  return (
    <Grade1MissionFrame
      title="Rakam Bahçesi"
      subtitle="İlkokul 1. Sınıf / Sayı-Çokluk Eşleştirme"
      icon={<Flower2 className="h-6 w-6" />}
      accent={ACCENT}
      progress={isComplete ? tasks.length : taskIndex}
      total={tasks.length}
      botMessage={botMessage}
    >
      <section className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-[#00E5FF]/18 bg-[#071523]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.30)]">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <Grade1Completion
              key="complete"
              title="Bahçe Tamam!"
              message="Nesneleri saydın, doğru rakamla eşleştirdin."
              accent={ACCENT}
              onRestart={restart}
              atoms={[
                { id: 'MAT.1.1.1.1', label: 'Rakam sembollerini tanır.' },
                { id: 'MAT.1.1.1.4', label: '20’ye kadar nesne gruplarını sayar.' },
                { id: 'MAT.1.1.1.5', label: 'Niceliği doğru sayı ile eşleştirir.' },
              ]}
            />
          ) : (
            <motion.div
              key={taskIndex}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-3xl"
            >
              <div className="mb-5 text-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#00E5FF]/72">Say ve eşleştir</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">Kaç tohum var?</h2>
              </div>
              <div className="grid grid-cols-4 gap-3 rounded-[2rem] border border-emerald-200/14 bg-[radial-gradient(circle_at_50%_12%,rgba(34,197,94,0.18),transparent_32%),linear-gradient(180deg,rgba(45,30,18,0.68),rgba(10,8,6,0.74))] p-4 shadow-[inset_0_0_42px_rgba(0,0,0,0.34)] sm:grid-cols-6 md:grid-cols-6">
                {seeds.map((seed) => (
                  <motion.div
                    key={seed}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: seed * 0.035 }}
                    className="grid aspect-square place-items-center rounded-3xl border border-amber-200/18 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.11),transparent_36%),linear-gradient(180deg,rgba(60,42,27,0.64),rgba(24,16,10,0.72))] shadow-[0_16px_34px_rgba(0,0,0,0.24)]"
                  >
                    <SeedGlyph index={seed} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Grade1Panel>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/74">Rakam kartları</p>
        <h2 className="mt-2 text-2xl font-black">Doğru kartı seç.</h2>
        <p className="mt-2 text-sm font-bold leading-relaxed text-white/52">
          Çocuk önce görsel çokluğu sayar, sonra rakam sembolüyle eşleştirir.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3">
          {task.choices.map((choice) => (
            <Grade1ChoiceButton
              key={choice}
              onClick={() => choose(choice)}
              selected={selected === choice}
              disabled={isComplete}
              accent={ACCENT}
            >
              <span className="text-4xl">{choice}</span>
            </Grade1ChoiceButton>
          ))}
        </div>
      </Grade1Panel>
    </Grade1MissionFrame>
  );
}

function SeedGlyph({ index }: { index: number }) {
  const rotations = [-14, 9, -5, 13, -10, 4];
  const rotation = rotations[index % rotations.length];
  const hasSprout = index % 4 === 1;

  return (
    <div className="relative grid h-full w-full place-items-center" aria-label="tohum">
      <div className="absolute bottom-[18%] h-3 w-12 rounded-full bg-black/38 blur-sm" />
      {hasSprout && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-[14%] flex items-end gap-0.5"
        >
          <div className="h-4 w-2 rounded-full rounded-br-sm bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.42)]" />
          <div className="h-5 w-2 rotate-12 rounded-full rounded-bl-sm bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.36)]" />
        </motion.div>
      )}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.3, repeat: Infinity, delay: index * 0.08, ease: 'easeInOut' }}
        className="relative h-16 w-11 md:h-[4.6rem] md:w-12"
        style={{ rotate: `${rotation}deg` }}
      >
        <div className="absolute inset-0 rounded-[60%_42%_58%_44%/68%_52%_72%_48%] border border-amber-100/28 bg-[radial-gradient(circle_at_35%_26%,rgba(255,236,191,0.72),transparent_17%),radial-gradient(circle_at_68%_74%,rgba(77,45,18,0.50),transparent_36%),linear-gradient(135deg,#D49B4C_0%,#8A541F_46%,#4D2A11_100%)] shadow-[inset_-7px_-9px_14px_rgba(53,28,10,0.44),inset_5px_6px_10px_rgba(255,223,154,0.34),0_0_20px_rgba(212,155,76,0.20)]" />
        <div className="absolute left-1/2 top-[12%] h-[76%] w-1 -translate-x-1/2 rounded-full bg-[#5B3214]/58 shadow-[1px_0_0_rgba(255,224,160,0.18)]" />
        <div className="absolute left-[30%] top-[21%] h-5 w-3 rounded-full bg-white/24 blur-[1px]" />
      </motion.div>
    </div>
  );
}
