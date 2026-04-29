import React, { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
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
}: Grade9LabShellProps) {
  const activeMission = missions[activeIndex] ?? missions[0];
  const progressPercent = Math.round(((completed ? missions.length : activeIndex) / missions.length) * 100);

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#050510] text-white selection:bg-[#00E5FF] selection:text-[#050510]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,229,255,0.18),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(179,136,255,0.12),transparent_30%),linear-gradient(180deg,#050510_0%,#0B1024_52%,#050510_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(0,229,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#00E5FF]/10 to-transparent" />
      </div>

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

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_40px_rgba(0,229,255,0.06)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#00E5FF]/70">Görev Zinciri</p>
                <h2 className="mt-1 text-xl font-black text-white">{progressPercent}% Senkron</h2>
              </div>
              <Sparkles className="h-6 w-6 text-[#00E5FF]" />
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-black/40">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] via-[#00FF88] to-[#B388FF]"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 xl:block xl:space-y-3 xl:overflow-visible xl:pb-0">
              {missions.map((mission, index) => {
                const isDone = completed || index < activeIndex;
                const isActive = !completed && index === activeIndex;

                return (
                  <div
                    key={mission.id}
                    className={`min-w-[218px] rounded-xl border p-3 transition-colors xl:min-w-0 ${
                      isActive
                        ? 'border-[#00E5FF]/45 bg-[#00E5FF]/10'
                        : isDone
                          ? 'border-[#00FF88]/30 bg-[#00FF88]/10'
                          : 'border-white/10 bg-black/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isDone ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00FF88]" />
                      ) : (
                        <Circle className={`mt-0.5 h-5 w-5 shrink-0 ${isActive ? 'text-[#00E5FF]' : 'text-white/25'}`} />
                      )}
                      <div>
                        <p className="text-sm font-black text-white">{mission.title}</p>
                        <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white/35">{mission.atomId}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0 max-w-full rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_0_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5">
            <AnimatePresence mode="wait">
              {completed ? (
                <ModuleCompletedScreen
                  key={`${moduleId}-completed`}
                  title="9. SINIF LAB TAMAMLANDI"
                  message="Kazanım atomları açıldı. Bu simülasyonu tekrar çalıştırabilir veya ana merkeze dönebilirsin."
                  scoreEarned={missions.length * 30}
                  onRestart={onRestart}
                />
              ) : (
                <motion.div
                  key={activeMission.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-[#00E5FF]/15 bg-[#00E5FF]/[0.06] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00E5FF]/70">Aktif Kazanım Görevi</p>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-white">{activeMission.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">{activeMission.prompt}</p>
                  </div>

                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </section>
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
}

export function ChoiceButton({ selected, label, detail, onClick, tone = 'cyan', testId }: ChoiceButtonProps) {
  return (
    <motion.button
      data-testid={testId}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-[56px] rounded-2xl border p-4 text-left transition-colors ${
        selected ? badgeToneClass[tone] : 'border-white/10 bg-white/[0.045] text-white hover:border-[#00E5FF]/35'
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
}

export function MetricPill({ label, value, tone = 'cyan' }: MetricPillProps) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${badgeToneClass[tone]}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-black">{value}</p>
    </div>
  );
}
