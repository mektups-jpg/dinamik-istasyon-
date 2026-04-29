import React, { ReactNode, useState } from 'react';
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
export type LabVariant = 'holo' | 'reactor' | 'circuit' | 'tension' | 'forensic' | 'radar';

export interface LabBadge {
  label: string;
  value: string;
  tone?: LabTone;
}

interface Grade9LabShellProps {
  title: string;
  subtitle: string;
  moduleId: string;
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
  pink: 'border-[#FF0055]/30 bg-[#FF0055]/10 text-[#FF6B9A]',
  amber: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
};

const choiceVariantClass: Record<LabVariant, string> = {
  holo: 'rounded-2xl border-cyan-300/20 bg-cyan-300/[0.035] hover:border-cyan-300/45 hover:bg-cyan-300/[0.075]',
  reactor: 'rounded-[1.5rem_0.65rem_1.5rem_0.65rem] border-emerald-300/20 bg-emerald-300/[0.04] hover:border-emerald-300/45 hover:bg-emerald-300/[0.08]',
  circuit: 'rounded-lg border-dashed border-sky-300/25 bg-sky-300/[0.035] hover:border-sky-300/55 hover:bg-sky-300/[0.075]',
  tension: 'rounded-2xl border-teal-200/20 bg-teal-200/[0.035] hover:border-teal-200/45 hover:bg-teal-200/[0.075]',
  forensic: 'rounded-md border-violet-200/20 bg-violet-200/[0.035] hover:border-violet-200/45 hover:bg-violet-200/[0.075]',
  radar: 'rounded-3xl border-lime-200/20 bg-lime-200/[0.035] hover:border-lime-200/45 hover:bg-lime-200/[0.075]',
};

const choiceSelectedClass: Record<LabVariant, string> = {
  holo: 'shadow-[0_0_24px_rgba(0,229,255,0.16)]',
  reactor: 'shadow-[0_0_28px_rgba(0,255,136,0.16)]',
  circuit: 'shadow-[0_0_22px_rgba(56,189,248,0.16)]',
  tension: 'shadow-[0_0_24px_rgba(45,212,191,0.16)]',
  forensic: 'shadow-[0_0_24px_rgba(167,139,250,0.16)]',
  radar: 'shadow-[0_0_24px_rgba(190,242,100,0.14)]',
};

const metricVariantClass: Record<LabVariant, string> = {
  holo: 'rounded-2xl',
  reactor: 'rounded-[1.25rem_0.55rem_1.25rem_0.55rem]',
  circuit: 'rounded-lg border-dashed',
  tension: 'rounded-full',
  forensic: 'rounded-md',
  radar: 'rounded-3xl',
};

export function useGrade9MissionProgress({ moduleId, missions, completionAtomIds = [], reward = 30 }: MissionProgressOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const { showMessage } = useAstroBotStore();
  const isQaSession = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('qa') === '1';

  const activeMission = missions[activeIndex];

  const submitMission = ({ ok, success, error }: MissionResult): boolean => {
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
      showMessage('Kazanım zinciri tamamlandı. Laboratuvar kaydı mühürlendi.', 'success');
      return true;
    }

    setActiveIndex((current) => current + 1);
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

export function Grade9LabShell({
  title,
  subtitle,
  moduleId,
  missions,
  activeIndex,
  completed,
  badges = [],
  children,
  onRestart,
  frameClassName = 'bg-[#050510]',
  contentClassName = 'max-w-7xl px-4 py-5 sm:px-6 lg:px-8',
}: Grade9LabShellProps) {
  const activeMission = missions[activeIndex] ?? missions[0];

  return (
    <div className={`h-full w-full overflow-x-hidden overflow-y-auto text-white selection:bg-[#00E5FF] selection:text-[#050510] ${frameClassName}`}>
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
                title="9. SINIF LAB TAMAMLANDI"
                message="Kazanım atomları açıldı. Bu simülasyonu tekrar çalıştırabilir veya ana merkeze dönebilirsin."
                scoreEarned={missions.length * 30}
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

interface ChoiceButtonProps {
  selected: boolean;
  label: string;
  detail?: string;
  onClick: () => void;
  tone?: LabTone;
  testId?: string;
  variant?: LabVariant;
}

export function ChoiceButton({ selected, label, detail, onClick, tone = 'cyan', testId, variant = 'holo' }: ChoiceButtonProps) {
  return (
    <motion.button
      data-testid={testId}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-[56px] border p-4 text-left transition-colors ${choiceVariantClass[variant]} ${
        selected ? `${badgeToneClass[tone]} ${choiceSelectedClass[variant]}` : 'text-white'
      }`}
    >
      <span className="block text-sm font-black">{label}</span>
      {detail ? <span className="mt-1 block text-xs text-white/55">{detail}</span> : null}
    </motion.button>
  );
}

interface MetricPillProps {
  label: string;
  value: string;
  tone?: LabTone;
  variant?: LabVariant;
}

export function MetricPill({ label, value, tone = 'cyan', variant = 'holo' }: MetricPillProps) {
  return (
    <div className={`border px-3 py-2 ${metricVariantClass[variant]} ${badgeToneClass[tone]}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-black">{value}</p>
    </div>
  );
}
