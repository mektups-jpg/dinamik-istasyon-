import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GameHeader } from '../../../components/ui/GameHeader';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { ControlPanel, FactoryStage, HeaderBadge } from './Base10FactoryPanels';

const TOTAL_TASKS = 3;
const REWARD = 75 * TOTAL_TASKS;
const createTaskNumber = () => Math.floor(Math.random() * 39) + 11;

export default function Base10FactoryApp() {
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();
  const clearMessage = useAstroBotStore((state) => state.clearMessage);

  const [targetNumber, setTargetNumber] = useState(createTaskNumber);
  const [tensCount, setTensCount] = useState(0);
  const [onesCount, setOnesCount] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(2);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [feedbackNote, setFeedbackNote] = useState<string | null>(null);

  const currentTotal = tensCount * 10 + onesCount;
  const isCorrect = currentTotal === targetNumber;
  const gap = targetNumber - currentTotal;
  const targetTens = Math.floor(targetNumber / 10);
  const targetOnes = targetNumber % 10;
  const isCompleted = phase === 4;

  useEffect(() => {
    clearMessage();

    return () => clearMessage();
  }, [clearMessage]);

  const generateNewTask = () => {
    const newTarget = createTaskNumber();
    setTargetNumber(newTarget);
    setTensCount(0);
    setOnesCount(0);
    setPhase(2);
    setFeedbackNote(null);
  };

  const handleStart = () => {
    setCompletedTasks(0);
    generateNewTask();
  };

  const handleRestart = () => {
    setCompletedTasks(0);
    generateNewTask();
  };

  const handleCheck = () => {
    if (!isCorrect) {
      setFeedbackNote(
        gap > 0
          ? `${Math.abs(gap)} enerji eksik. Bir onluk 10 eder; birlikleri de hedefe kadar tamamla.`
          : `${Math.abs(gap)} enerji fazla yüklendi. Eksi düğmesiyle fazla çubuk veya küpü geri al.`
      );
      return;
    }

    if (completedTasks + 1 >= TOTAL_TASKS) {
      setCompletedTasks(TOTAL_TASKS);
      setPhase(4);
      unlockAtom('MAT.2.1.2.1');
      unlockAtom('MAT.2.1.2.2');
      unlockAtom('MAT.2.1.2.3');
      addScore(REWARD);
      clearMessage();
      return;
    }

    setFeedbackNote(`${targetNumber} tamam: ${tensCount} onluk + ${onesCount} birlik doğru kuruldu!`);
    setCompletedTasks((prev) => prev + 1);
    setPhase(3);
    setTimeout(() => {
      generateNewTask();
    }, 1400);
  };

  const updateTens = (delta: number) => {
    setFeedbackNote(null);
    setTensCount((value) => Math.max(0, value + delta));
  };

  const updateOnes = (delta: number) => {
    setFeedbackNote(null);
    setOnesCount((value) => Math.max(0, value + delta));
  };

  const statusText = phase === 1
    ? 'Makineyi çalıştır.'
    : isCorrect
      ? 'Tamam! Şimdi gönder.'
      : gap > 0
        ? `${gap} enerji eksik.`
        : `${Math.abs(gap)} enerji fazla.`;

  const statusClass = isCorrect
    ? 'border-[#00FF88]/35 bg-[#00FF88]/12 text-[#A9FFD6]'
    : gap < 0
      ? 'border-[#FF4FA3]/35 bg-[#FF4FA3]/12 text-[#FFB4D4]'
      : 'border-[#00E5FF]/28 bg-[#00E5FF]/10 text-[#A9F8FF]';

  const panelMessage = feedbackNote ?? (
    phase === 1
      ? 'Makineyi çalıştır, AstroBot hedef sayıyı getirsin.'
      : isCorrect
        ? `${targetNumber} doğru kuruldu. Gönder ve yeni bataryayı aç.`
        : gap > 0
          ? `${targetTens} mor onluk ve ${targetOnes} mavi birlik hedefini tamamla.`
          : 'Fazla yük var. Eksi düğmeleriyle dengele.'
  );

  const progressLabel = `${completedTasks}/${TOTAL_TASKS}`;

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#050510] text-white selection:bg-[#00E5FF] selection:text-[#050510]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(0,229,255,0.16),transparent_32%),radial-gradient(circle_at_72%_64%,rgba(179,136,255,0.16),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(0,229,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px] opacity-45" />

      <GameHeader
        title="Onluk-Birlik Çözümleme"
        subtitle="İlkokul 2. Sınıf / Onluk-Birlik Çözümleme"
        rightContent={
          <div className="hidden items-center gap-2 md:flex">
            <HeaderBadge label="Görev" value={progressLabel} tone="cyan" />
            <HeaderBadge label="Hedef" value={phase === 1 ? '--' : String(targetNumber)} tone="purple" />
            <HeaderBadge label="Yük" value={String(currentTotal)} tone={isCorrect ? 'green' : gap < 0 ? 'pink' : 'cyan'} />
          </div>
        }
      />

      <main className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[minmax(190px,0.9fr)_minmax(0,1.35fr)] gap-4 px-4 py-4 pb-32 sm:px-5 lg:gap-5 lg:py-5">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.section
              key="base10-completed"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="col-span-2 mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-black/45 p-4 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6"
            >
              <ModuleCompletedScreen
                title="FABRİKA AÇILDI"
                message="Üç hedef sayıyı onluk ve birliklerine ayırdın. Mor çubuklar ve mavi küpler artık dengede."
                scoreEarned={REWARD}
                onRestart={handleRestart}
              />
            </motion.section>
          ) : (
            <>
              <FactoryStage
                targetNumber={targetNumber}
                targetTens={targetTens}
                targetOnes={targetOnes}
                tensCount={tensCount}
                onesCount={onesCount}
                currentTotal={currentTotal}
                phase={phase}
                completedTasks={completedTasks}
                totalTasks={TOTAL_TASKS}
              />

              <ControlPanel
                phase={phase}
                statusClass={statusClass}
                statusText={statusText}
                currentTotal={currentTotal}
                isCorrect={isCorrect}
                targetNumber={targetNumber}
                targetTens={targetTens}
                targetOnes={targetOnes}
                tensCount={tensCount}
                onesCount={onesCount}
                panelMessage={panelMessage}
                onStart={handleStart}
                onCheck={handleCheck}
                onTensMinus={() => updateTens(-1)}
                onTensPlus={() => updateTens(1)}
                onOnesMinus={() => updateOnes(-1)}
                onOnesPlus={() => updateOnes(1)}
              />
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
