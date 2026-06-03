import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { BuildStepId, ForgeBuildStep, ForgeMission, MODULE_ID, RuleTool, toolCopy } from './derivativeRuleModel';
import { bridgeStepCopy } from './derivativeRuleBridgeCopy';

interface RuleConstructionBenchProps {
  mission: ForgeMission;
  tool: RuleTool | null;
  lockedStepSet: Set<BuildStepId>;
  lockedCount: number;
  solved: boolean;
  status: Grade12StageStatus;
  accent: string;
  onLockStep: (stepId: BuildStepId) => void;
}

export function RuleConstructionBench({
  mission,
  tool,
  lockedStepSet,
  lockedCount,
  solved,
  status,
  accent,
  onLockStep,
}: RuleConstructionBenchProps) {
  const muted = tool === null;
  const progressText = solved ? 'sonuç hazır' : `${lockedCount}/${mission.buildSteps.length} adım`;
  const selectedLabel = tool ? toolCopy[tool].label : 'Kural seç';

  return (
    <motion.div
      className="absolute left-1/2 top-[70%] z-50 flex w-[min(92%,1040px)] -translate-x-1/2 items-stretch gap-3 rounded-[28px] border bg-[#041725]/98 p-3 shadow-[0_22px_58px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
      style={{ borderColor: status === 'error' ? '#FF4FA355' : `${accent}66` }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid w-[142px] shrink-0 place-items-center rounded-[22px] border bg-[#050b13]/78 px-3 text-center" style={{ borderColor: `${accent}55` }}>
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: status === 'error' ? '#FF8ABB' : accent }}>
          {progressText}
        </p>
        <p className="mt-1 text-sm font-black leading-tight text-white">{selectedLabel}</p>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        {mission.buildSteps.map((step) => {
          const displayStep = getDisplayStep(step, tool);

          return (
          <BuildStepButton
            key={step.id}
            step={displayStep}
            locked={lockedStepSet.has(step.id)}
            disabled={muted || solved}
            onLockStep={onLockStep}
          />
          );
        })}
      </div>
    </motion.div>
  );
}

type BuildStepDisplay = Pick<ForgeBuildStep, 'id' | 'label' | 'action' | 'accent'>;

function getDisplayStep(step: ForgeBuildStep, tool: RuleTool | null): BuildStepDisplay {
  if (!tool || step.target !== 'bridge') return step;

  return {
    ...step,
    ...bridgeStepCopy[tool],
  };
}

function BuildStepButton({
  step,
  locked,
  disabled,
  onLockStep,
}: {
  step: BuildStepDisplay;
  locked: boolean;
  disabled: boolean;
  onLockStep: (stepId: BuildStepId) => void;
}) {
  return (
    <motion.button
      type="button"
      data-testid={`${MODULE_ID}-step-${step.id}`}
      aria-pressed={locked}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={() => onLockStep(step.id)}
      className="min-h-[54px] min-w-[92px] flex-1 rounded-2xl border px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-[0.42]"
      style={{
        borderColor: locked ? `${step.accent}AA` : `${step.accent}33`,
        background: locked ? `linear-gradient(180deg, ${step.accent}2E, rgba(2,7,13,0.78))` : 'rgba(255,255,255,0.052)',
        boxShadow: locked ? `0 0 28px ${step.accent}22` : 'none',
      }}
    >
      <span className="block font-mono text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: locked ? step.accent : 'rgba(255,255,255,0.45)' }}>
        {locked ? 'tamamlandı' : step.label}
      </span>
      <span className="mt-1 block text-xs font-black leading-tight text-white">{step.action}</span>
    </motion.button>
  );
}
