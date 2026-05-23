import { useMemo, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { RuleConstructionBench } from './DerivativeRuleBuildDock';
import { RuleCartridgeCore, RuleFlowRail, RuleTag } from './DerivativeRuleMechanismParts';
import { BuildStepId, ForgeMission, isRuleCorrect, MODULE_ID, RuleTool, toolCopy } from './derivativeRuleModel';

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
  const lockedCount = mission.buildSteps.filter((step) => lockedStepSet.has(step.id)).length;
  const statusLabel = solved
    ? 'Kural döküldü'
    : tool === null
      ? 'Kartuş bekliyor'
      : checkedCorrect
        ? 'Doğru kural çalışıyor'
        : status === 'error'
          ? toolMatches
            ? 'Eksik parça alarmı'
            : 'Yanlış kural alarmı'
          : 'Kartuş önizlemede';

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
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif üretim</p>
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
              {solved ? 'kural formülü' : 'üretim isteği'}
            </p>
            <p className="mt-1 text-lg font-black tracking-tight text-white lg:text-xl">
              {solved ? mission.expression : mission.structure}
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
  const outputLabel = solved ? mission.output : tool ? `${lockedCount}/${mission.buildSteps.length} kilit` : 'çıktı ?';
  const outputBadge = solved ? mission.badge : tool ? toolCopy[tool].label : 'Kartuş bekliyor';
  const mechanismCopy = solved
    ? mission.mechanism
    : latestLockedStep
      ? latestLockedStep.note
      : tool
      ? toolCopy[tool].hint
      : 'Kartuş seçilince hangi parçanın türevlenip hangi parçanın korunacağı burada görünür.';

  return (
    <div className="absolute inset-x-[5%] top-[22%] z-20 h-[47%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.60))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" role="img" aria-label={`${mission.title} türev kural döküm bandı`}>
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

      </svg>

      <div className="sr-only">{mission.proof}</div>

      <div className="absolute left-[7%] bottom-[6%] z-30 rounded-[26px] border border-[#00E5FF]/24 bg-[#00E5FF]/10 px-4 py-3 shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">giriş kapsülleri</p>
        <p className="mt-1 text-xl font-black text-white">{mission.inputA} · {mission.inputB}</p>
      </div>

      <div className="absolute right-[7%] bottom-[6%] z-30 max-w-[330px] rounded-[26px] border border-[#00FF88]/18 bg-[#00FF88]/9 px-4 py-3 text-right shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">mekanik okuma</p>
        <p className="mt-1 text-sm font-black leading-snug text-white/78">{mechanismCopy}</p>
      </div>
    </div>
  );
}

function BaseFlowRails({ mission, active, accent, glow }: { mission: ForgeMission; active: boolean; accent: string; glow: string }) {
  const inputRailOpacity = active ? 0 : 0.42;
  const outputRailOpacity = active ? 0.34 : 0.42;
  const outputColor = active ? glow : '#00E5FF';

  return (
    <>
      <g opacity={inputRailOpacity}>
        <path
          d="M298 150 C330 150 360 150 388 150"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="10"
          strokeLinecap="round"
          filter={`url(#forge-glow-${mission.id})`}
        />
        <path
          d="M298 254 C334 246 360 226 388 218"
          fill="none"
          stroke="#00FF88"
          strokeWidth="10"
          strokeLinecap="round"
          filter={`url(#forge-glow-${mission.id})`}
        />
        <circle cx="388" cy="150" r="5" fill="#00E5FF" />
        <circle cx="388" cy="218" r="5" fill="#00FF88" />
      </g>
      <g opacity={outputRailOpacity}>
        <motion.path
          d="M626 180 C664 180 696 178 736 176"
          fill="none"
          stroke={outputColor}
          strokeWidth="12"
          strokeLinecap="round"
          filter={`url(#forge-glow-${mission.id})`}
          animate={{ opacity: active ? [0.56, 1, 0.56] : 0.78 }}
          transition={{ duration: 2.1, repeat: active ? Infinity : 0 }}
        />
        <circle cx="626" cy="180" r="6" fill={accent} />
      </g>
    </>
  );
}

function RuleArms({
  tool,
  active,
  accent,
  alarm,
  mission,
  lockedStepSet,
  revealFormula,
}: {
  tool: RuleTool;
  active: boolean;
  accent: string;
  alarm: boolean;
  mission: ForgeMission;
  lockedStepSet: Set<BuildStepId>;
  revealFormula: boolean;
}) {
  const color = alarm ? '#FF4FA3' : accent;
  const hasStep = (stepId: BuildStepId) => lockedStepSet.has(stepId);

  if (!active) {
    return null;
  }

  if (tool === 'product') {
    const upperReady = hasStep('derive-f') && hasStep('keep-g');
    const lowerReady = hasStep('keep-f') && hasStep('derive-g');
    const bridgeReady = hasStep('bridge-plus');

    return (
      <g>
        <RuleFlowRail
          d="M302 148 C350 126 372 76 426 76 L580 76 C636 76 658 118 640 154 C654 162 664 170 672 180"
          color={color}
          active={upperReady}
          missionId={mission.id}
        />
        <RuleFlowRail
          d="M302 254 C350 278 374 304 426 304 L580 304 C636 304 658 242 640 206 C654 198 664 190 672 180"
          color="#00FF88"
          active={lowerReady}
          missionId={mission.id}
        />
        <RuleTag x={506} y={90} label={revealFormula || upperReady ? 'fʼ·g' : hasStep('derive-f') ? 'fʼ · koru?' : hasStep('keep-g') ? 'türev? · g' : 'türevle · koru'} color={color} />
        <RuleTag x={508} y={296} label={revealFormula || lowerReady ? 'f·gʼ' : hasStep('keep-f') ? 'f · türev?' : hasStep('derive-g') ? 'koru? · gʼ' : 'koru · türevle'} color="#00FF88" />
        <RuleTag x={638} y={116} label={revealFormula || bridgeReady ? '+' : 'köprü'} color="#9FF5FF" compact />
      </g>
    );
  }

  if (tool === 'quotient') {
    const firstReady = hasStep('derive-f') && hasStep('keep-g');
    const secondReady = hasStep('keep-f') && hasStep('derive-g');
    const payReady = firstReady && secondReady && hasStep('subtract-pay');
    const shieldReady = hasStep('shield-g2');

    return (
      <g>
        <RuleFlowRail
          d="M308 140 C360 112 398 82 448 82 L572 82 C624 82 650 122 672 152"
          color={color}
          active={firstReady}
          missionId={mission.id}
        />
        <RuleFlowRail
          d="M316 238 C366 268 398 300 450 300 L572 300 C626 300 650 232 672 204"
          color="#FF4FA3"
          active={secondReady}
          missionId={mission.id}
          width={7}
        />
        <rect x="398" y="266" width="218" height="38" rx="19" fill="rgba(255,184,77,0.12)" stroke="#FFB84D" strokeOpacity={shieldReady ? 0.92 : 0.42} strokeWidth="3" />
        <RuleTag x={510} y={82} label={revealFormula || payReady ? 'fʼg - fgʼ' : firstReady ? 'fʼg - ?' : secondReady ? '? - fgʼ' : 'pay bandı'} color={color} />
        <RuleTag x={508} y={324} label={revealFormula || shieldReady ? 'g² kalkanı' : 'payda zırhı'} color="#FFB84D" />
      </g>
    );
  }

  if (tool === 'chain') {
    const outerReady = hasStep('outer-shell');
    const innerReady = hasStep('inner-core');

    return (
      <g>
        <motion.circle
          cx="506"
          cy="180"
          r="112"
          fill="rgba(179,136,255,0.08)"
          stroke={color}
          strokeOpacity={outerReady ? 0.95 : 0.48}
          strokeWidth="8"
          strokeDasharray="30 16"
          filter={`url(#forge-glow-${mission.id})`}
          animate={{ strokeDashoffset: outerReady ? [0, -92] : 0 }}
          transition={{ duration: 2.4, repeat: outerReady ? Infinity : 0, ease: 'linear' }}
        />
        <motion.circle
          cx="506"
          cy="180"
          r="66"
          fill="rgba(0,229,255,0.09)"
          stroke="#00E5FF"
          strokeOpacity={innerReady ? 0.95 : 0.48}
          strokeWidth="7"
          strokeDasharray="20 12"
          animate={{ strokeDashoffset: innerReady ? [0, 72] : 0 }}
          transition={{ duration: 2, repeat: innerReady ? Infinity : 0, ease: 'linear' }}
        />
        <RuleFlowRail d="M302 202 C356 190 390 180 428 180" color="#00E5FF" active={innerReady} missionId={mission.id} width={7} />
        <RuleFlowRail d="M586 180 C624 180 674 176 714 174" color={color} active={outerReady && innerReady} missionId={mission.id} width={7} />
        <RuleTag x={506} y={58} label={revealFormula || outerReady ? 'dış türev' : 'dış halka'} color={color} />
        <RuleTag x={506} y={318} label={revealFormula || innerReady ? 'iç türev' : 'iç çekirdek'} color="#00E5FF" />
      </g>
    );
  }

  const firstReady = hasStep('derive-f');
  const secondReady = hasStep('derive-g');
  const bridgeReady = hasStep(tool === 'difference' ? 'bridge-minus' : 'bridge-plus');

  return (
    <g>
      <RuleFlowRail d="M302 150 C348 150 382 150 428 166" color="#00E5FF" active={firstReady} missionId={mission.id} />
      <RuleFlowRail d="M302 254 C348 246 384 220 428 194" color={tool === 'difference' ? '#FF8ABB' : '#00FF88'} active={secondReady} missionId={mission.id} />
      <RuleFlowRail d="M586 180 C624 180 674 178 714 176" color={tool === 'difference' ? '#FF8ABB' : '#9FF5FF'} active={bridgeReady} missionId={mission.id} width={7} />
      <RuleTag x={432} y={88} label={revealFormula || firstReady ? 'fʼ' : '1. ışın'} color="#00E5FF" />
      <RuleTag x={434} y={292} label={revealFormula || secondReady ? (tool === 'difference' ? '-gʼ' : 'gʼ') : tool === 'difference' ? 'ters ışın' : '2. ışın'} color={tool === 'difference' ? '#FF8ABB' : '#00FF88'} />
      <RuleTag x={638} y={136} label={revealFormula || bridgeReady ? (tool === 'difference' ? '-' : '+') : 'köprü'} color={tool === 'difference' ? '#FF8ABB' : '#9FF5FF'} compact />
    </g>
  );
}

function FunctionCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-84" y="-30" width="168" height="60" rx="24" fill="rgba(2,7,13,0.88)" stroke={color} strokeOpacity="0.62" strokeWidth="3" />
      <text x="0" y="7" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}

function OutputCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-116" y="-38" width="232" height="76" rx="30" fill="rgba(2,7,13,0.90)" stroke={color} strokeOpacity="0.70" strokeWidth="3" />
      <text x="0" y="8" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}
