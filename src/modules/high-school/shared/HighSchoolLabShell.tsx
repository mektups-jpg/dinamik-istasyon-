import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GameHeader } from '../../../components/ui/GameHeader';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';

export interface MissionStep {
  id: string;
  title: string;
  prompt: string;
  atomId: string;
}

export type LabTone = 'cyan' | 'green' | 'purple' | 'pink' | 'amber';

export interface LabBadge {
  label: string;
  value: string;
  tone?: LabTone;
}

interface HighSchoolLabShellProps {
  title: string;
  subtitle: string;
  moduleId: string;
  gradeLabel: string;
  missions: MissionStep[];
  activeIndex: number;
  completed: boolean;
  badges?: LabBadge[];
  children: ReactNode;
  onRestart: () => void;
  frameClassName?: string;
  contentClassName?: string;
}

interface MissionProgressOptions {
  moduleId: string;
  missions: MissionStep[];
  completionAtomIds?: string[];
  reward?: number;
}

interface MissionResult {
  ok: boolean;
  success: string;
  error: string;
}

const badgeToneClass: Record<LabTone, string> = {
  cyan: 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]',
  green: 'border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]',
  purple: 'border-[#B388FF]/30 bg-[#B388FF]/10 text-[#B388FF]',
  pink: 'border-[#FF4FA3]/30 bg-[#FF4FA3]/10 text-[#FF8FC8]',
  amber: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
};

export function useHighSchoolMissionProgress({ moduleId, missions, completionAtomIds = [], reward = 35 }: MissionProgressOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const { showMessage } = useAstroBotStore();
  const isQaSession = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('qa') === '1';

  const activeMission = missions[activeIndex];

  const submitMission = ({ ok, success, error }: MissionResult): boolean => {
    if (completed) return false;

    if (!ok) {
      showMessage(error, 'error');
      return false;
    }

    if (!isQaSession) {
      unlockAtom(activeMission.atomId);
      addScore(reward);
    }

    if (activeIndex >= missions.length - 1) {
      if (!isQaSession) {
        missions.forEach((mission) => unlockAtom(mission.atomId));
        completionAtomIds.forEach((atomId) => unlockAtom(atomId));
        unlockModule(moduleId);
      }
      setCompleted(true);
      showMessage('Makro atom tamamlandı. Lise laboratuvarı kaydı mühürlendi.', 'success');
      return true;
    }

    setActiveIndex((currentIndex) => Math.min(currentIndex + 1, missions.length - 1));
    showMessage(success, 'success');
    return true;
  };

  const restart = () => {
    setActiveIndex(0);
    setCompleted(false);
  };

  return {
    activeIndex,
    activeMission,
    completed,
    restart,
    submitMission,
  };
}

export function HighSchoolLabShell({
  title,
  subtitle,
  moduleId,
  gradeLabel,
  missions,
  activeIndex,
  completed,
  badges = [],
  children,
  onRestart,
  frameClassName = 'bg-[#050510]',
  contentClassName = 'max-w-7xl px-4 py-5 sm:px-6 lg:px-8',
}: HighSchoolLabShellProps) {
  const activeMission = missions[activeIndex] ?? missions[0];
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    frameRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeIndex, completed]);

  return (
    <div ref={frameRef} className={`h-full w-full overflow-x-hidden overflow-y-auto text-white selection:bg-[#00E5FF] selection:text-[#050510] ${frameClassName}`}>
      <GameHeader
        title={title}
        subtitle={subtitle}
        rightContent={
          <div className="hidden items-center gap-2 xl:flex">
            {badges.map((badge) => (
              <div
                key={`${badge.label}-${badge.value}`}
                className={`rounded-xl border px-3 py-2 text-right ${badgeToneClass[badge.tone ?? 'cyan']}`}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">{badge.label}</p>
                <p className="text-sm font-black">{badge.value}</p>
              </div>
            ))}
          </div>
        }
      />

      <main className={`relative z-10 mx-auto w-full ${contentClassName}`}>
        <AnimatePresence mode="wait">
          {completed ? (
            <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <ModuleCompletedScreen
                key={`${moduleId}-completed`}
                title={`${gradeLabel} LAB TAMAMLANDI`}
                message="Kazanım atomları açıldı. Deneyi tekrar çalıştırabilir veya ana merkeze dönebilirsin."
                scoreEarned={missions.length * 35}
                onRestart={onRestart}
              />
            </section>
          ) : (
            <motion.div
              key={activeMission.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
