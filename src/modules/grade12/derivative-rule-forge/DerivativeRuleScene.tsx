import { useMemo, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { BaseFlowRails, RuleArms } from './DerivativeRuleArms';
import { RuleConstructionBench } from './DerivativeRuleBuildDock';
import { RuleCartridgeCore } from './DerivativeRuleMechanismParts';
import { BuildStepId, ForgeMission, isRuleCorrect, MODULE_ID, RuleTool, toolCopy } from './derivativeRuleModel';
import { bridgeStepCopy } from './derivativeRuleBridgeCopy';

interface DerivativeRuleSceneProps {
  mission: ForgeMission;
  tool: RuleTool | null;
  lockedSteps: BuildStepId[];
  solved: boolean;
  status: Grade12StageStatus;
  onLockStep: (stepId: BuildStepId) => void;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function DerivativeRuleScene({ mission, tool, lockedSteps, solved, status, onLockStep, onHome }: DerivativeRuleSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const lockedStepSet = useMemo(() => new Set(lockedSteps), [lockedSteps]);
  const toolMatches = isRuleCorrect(mission, tool);
  const checkedCorrect = status === 'success' && toolMatches;
  const accent = selected?.accent ?? neutralAccent;
  const focusText = solved ? mission.expression : selected ? selected.focusLabel : mission.structure;
  const lockedCount = mission.buildSteps.filter((step) => lockedStepSet.has(step.id)).length;
  const statusLabel = solved
    ? 'Sonuç hazır'
    : tool === null
      ? 'Kural seç'
      : checkedCorrect
        ? 'Doğru kural'
        : status === 'error'
          ? toolMatches
            ? 'Eksik adım'
            : 'Yanlış kural'
          : 'Kural önizlemede';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_44%_34%,rgba(0,229,255,0.12),transparent_42%),radial-gradient(circle_at_72%_64%,rgba(179,136,255,0.10),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.04)_0_1px,transparent_1px_94px)] opacity-50" />

      <div className="relative flex h-full w-full items-start justify-center px-5 py-2">
        <motion.div
          data-testid={`${MODULE_ID}-manipulator`}
          role="group"
          aria-label={`${mission.title}: ${mission.prompt}`}
          aria-keyshortcuts="Home"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative h-full min-h-[560px] w-[98.5%] outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/70"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ perspective: 1200 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[2%] z-30 flex w-[min(92%,980px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/44 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif kural</p>
              <p className="truncate text-sm font-black text-white/88">{mission.title}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: status === 'error' ? '#FF4FA355' : `${accent}44`,
                color: status === 'error' ? '#FF8ABB' : accent,
                backgroundColor: status === 'error' ? 'rgba(255,79,163,0.12)' : `${accent}14`,
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div className="absolute inset-x-[1%] top-[7%] h-[88%] rounded-[60px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(7,24,43,0.96),rgba(3,8,18,0.78)_55%,rgba(1,4,10,0.94))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />

          <div className="absolute left-1/2 top-[11%] z-20 -translate-x-1/2 rounded-[24px] border border-[#00E5FF]/20 bg-[#03111b]/92 px-5 py-2.5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">
              {solved ? 'kural formülü' : 'ne bulunacak?'}
            </p>
            <p className="mt-1 text-lg font-black tracking-tight text-white lg:text-xl">
              {focusText}
            </p>
          </div>

          <ForgeMechanism
            mission={mission}
            tool={tool}
            lockedStepSet={lockedStepSet}
            lockedCount={lockedCount}
            solved={solved}
            status={status}
            accent={accent}
            toolMatches={toolMatches}
          />

          <RuleConstructionBench
            mission={mission}
            tool={tool}
            lockedStepSet={lockedStepSet}
            lockedCount={lockedCount}
            solved={solved}
            status={status}
            accent={accent}
            onLockStep={onLockStep}
          />
        </motion.div>
      </div>
    </div>
  );
}

function ForgeMechanism({
  mission,
  tool,
  lockedStepSet,
  lockedCount,
  solved,
  status,
  accent,
  toolMatches,
}: {
  mission: ForgeMission;
  tool: RuleTool | null;
  lockedStepSet: Set<BuildStepId>;
  lockedCount: number;
  solved: boolean;
  status: Grade12StageStatus;
  accent: string;
  toolMatches: boolean;
}) {
  const active = tool !== null;
  const alarm = status === 'error';
  const checkedCorrect = status === 'success' && toolMatches;
  const activeTool = tool ?? 'sum';
  const glow = alarm ? '#FF4FA3' : checkedCorrect ? accent : active ? accent : '#00E5FF';
  const latestLockedStep = [...mission.buildSteps].reverse().find((step) => lockedStepSet.has(step.id));
  const selectedBridgeNote = tool && latestLockedStep?.target === 'bridge' ? bridgeStepCopy[tool].note : null;
  const mechanismCopy = solved
    ? mission.mechanism
    : latestLockedStep
      ? selectedBridgeNote ?? latestLockedStep.note
      : tool
      ? toolCopy[tool].hint
      : 'Kural seçilince hangi fonksiyonun türevlendiği, hangisinin aynen kaldığı burada görünür.';
  const outputLabel = solved ? mission.output : tool ? toolCopy[tool].resultShape : 'sonuç ?';
  const outputBadge = solved ? mission.badge : tool ? toolCopy[tool].label : 'Kural seç';

  return (
    <div className="absolute inset-x-[5%] top-[22%] z-20 h-[47%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.60))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" role="img" aria-label={`${mission.title} türev kuralı sahnesi`}>
        <defs>
          <linearGradient id={`forge-belt-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.92" />
            <stop offset="52%" stopColor={glow} stopOpacity="1" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.86" />
          </linearGradient>
          <filter id={`forge-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 8 }).map((_, index) => (
          <line key={`vx-${index}`} x1={140 + index * 100} x2={140 + index * 100} y1="46" y2="314" stroke="rgba(255,255,255,0.055)" />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <line key={`hy-${index}`} x1="86" x2="928" y1={70 + index * 48} y2={70 + index * 48} stroke="rgba(255,255,255,0.06)" />
        ))}

        <BaseFlowRails mission={mission} active={active} accent={accent} glow={glow} />

        <FunctionCapsule x={210} y={150} label={mission.inputA} color="#00E5FF" />
        <FunctionCapsule x={210} y={254} label={mission.inputB} color="#00FF88" />

        <RuleArms
          layer="rails"
          tool={activeTool}
          active={active}
          accent={accent}
          alarm={alarm}
          mission={mission}
          lockedStepSet={lockedStepSet}
          revealFormula={solved}
        />

        <RuleCartridgeCore active={active} accent={accent} glow={glow} missionId={mission.id} solved={solved} symbol={tool ? toolCopy[tool].short : '?'} />

        <OutputCapsule x={788} y={174} label={outputLabel} color={checkedCorrect ? '#00FF88' : active ? accent : '#00E5FF'} />
        <text x="788" y="244" fill="rgba(255,255,255,0.72)" fontSize="20" fontWeight="900" textAnchor="middle">{outputBadge}</text>

        <RuleArms
          layer="labels"
          tool={activeTool}
          active={active}
          accent={accent}
          alarm={alarm}
          mission={mission}
          lockedStepSet={lockedStepSet}
          revealFormula={solved}
        />

      </svg>

      <div className="sr-only">{mission.proof}</div>

      <div className="absolute left-[7%] bottom-[6%] z-30 max-w-[390px] rounded-[26px] border border-[#00E5FF]/24 bg-[#00E5FF]/10 px-4 py-3 shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">verilen fonksiyonlar</p>
        <p className="mt-1 text-lg font-black leading-tight text-white">
          {formatForgeMathLabel(mission.inputA)}, {formatForgeMathLabel(mission.inputB)}
        </p>
      </div>

      <div className="absolute right-[7%] bottom-[6%] z-30 max-w-[330px] rounded-[26px] border border-[#00FF88]/18 bg-[#00FF88]/9 px-4 py-3 text-right shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">kuralın anlamı</p>
        <p className="mt-1 text-sm font-black leading-snug text-white/78">{mechanismCopy}</p>
      </div>
    </div>
  );
}

function FunctionCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const displayLabel = formatForgeMathLabel(label);
  const width = Math.max(168, Math.min(230, displayLabel.length * 12 + 44));
  const fontSize = displayLabel.length > 13 ? 18 : 22;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-width / 2} y="-30" width={width} height="60" rx="24" fill="rgba(2,7,13,0.88)" stroke={color} strokeOpacity="0.62" strokeWidth="3" />
      <text x="0" y="7" fill="#FFFFFF" fontSize={fontSize} fontWeight="900" textAnchor="middle">{displayLabel}</text>
    </g>
  );
}

function formatForgeMathLabel(label: string) {
  return label.replace(/\s*=\s*/g, ' = ');
}

function OutputCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const fontSize = label.length > 14 ? 17 : 22;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-116" y="-38" width="232" height="76" rx="30" fill="rgba(2,7,13,0.90)" stroke={color} strokeOpacity="0.70" strokeWidth="3" />
      <text x="0" y="8" fill="#FFFFFF" fontSize={fontSize} fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}
