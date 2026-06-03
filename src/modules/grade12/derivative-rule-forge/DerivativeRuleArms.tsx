import { motion } from 'motion/react';
import { RuleFlowRail, RuleTag } from './DerivativeRuleMechanismParts';
import { BuildStepId, ForgeMission, RuleTool } from './derivativeRuleModel';

export function BaseFlowRails({ mission, active, accent, glow }: { mission: ForgeMission; active: boolean; accent: string; glow: string }) {
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

export function RuleArms({
  layer,
  tool,
  active,
  accent,
  alarm,
  mission,
  lockedStepSet,
  revealFormula,
}: {
  layer: 'rails' | 'labels';
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

    if (layer === 'rails') {
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
        </g>
      );
    }

    return (
      <g>
        <RuleTag x={506} y={90} label={revealFormula || upperReady ? 'fʼ · g' : hasStep('derive-f') ? 'fʼ · g?' : hasStep('keep-g') ? 'fʼ? · g' : 'f türev, g aynen'} color={color} />
        <RuleTag x={508} y={296} label={revealFormula || lowerReady ? 'f · gʼ' : hasStep('keep-f') ? 'f · gʼ?' : hasStep('derive-g') ? 'f? · gʼ' : 'f aynen, g türev'} color="#00FF88" />
        <RuleTag x={656} y={132} label={revealFormula || bridgeReady ? '+' : 'topla'} color="#9FF5FF" compact />
      </g>
    );
  }

  if (tool === 'quotient') {
    const firstReady = hasStep('derive-f') && hasStep('keep-g');
    const secondReady = hasStep('keep-f') && hasStep('derive-g');
    const payReady = firstReady && secondReady && hasStep('subtract-pay');
    const shieldReady = hasStep('shield-g2');

    if (layer === 'rails') {
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
        </g>
      );
    }

    return (
      <g>
        <RuleTag x={510} y={82} label={revealFormula || payReady ? 'fʼg - fgʼ' : firstReady ? 'fʼg - ?' : secondReady ? '? - fgʼ' : 'payı kur'} color={color} />
        <RuleTag x={508} y={324} label={revealFormula || shieldReady ? 'payda g²' : 'payda karesi'} color="#FFB84D" />
      </g>
    );
  }

  if (tool === 'chain') {
    const outerReady = hasStep('outer-shell');
    const innerReady = hasStep('inner-core');

    if (layer === 'rails') {
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
        </g>
      );
    }

    return (
      <g>
        <RuleTag x={506} y={58} label={revealFormula || outerReady ? 'dış türev' : 'dışı türevle'} color={color} />
        <RuleTag x={506} y={318} label={revealFormula || innerReady ? 'iç türev' : 'içi türevle'} color="#00E5FF" />
      </g>
    );
  }

  const firstReady = hasStep('derive-f');
  const secondReady = hasStep('derive-g');
  const bridgeReady = hasStep(tool === 'difference' ? 'bridge-minus' : 'bridge-plus');

  if (layer === 'rails') {
    return (
      <g>
        <RuleFlowRail d="M302 150 C348 150 382 150 428 166" color="#00E5FF" active={firstReady} missionId={mission.id} />
        <RuleFlowRail d="M302 254 C348 246 384 220 428 194" color={tool === 'difference' ? '#FF8ABB' : '#00FF88'} active={secondReady} missionId={mission.id} />
        <RuleFlowRail d="M586 180 C624 180 674 178 714 176" color={tool === 'difference' ? '#FF8ABB' : '#9FF5FF'} active={bridgeReady} missionId={mission.id} width={7} />
      </g>
    );
  }

  return (
    <g>
      <RuleTag x={432} y={88} label={revealFormula || firstReady ? 'fʼ' : 'f türevi'} color="#00E5FF" />
      <RuleTag x={434} y={292} label={revealFormula || secondReady ? (tool === 'difference' ? '-gʼ' : 'gʼ') : tool === 'difference' ? 'g türevi çıkar' : 'g türevi'} color={tool === 'difference' ? '#FF8ABB' : '#00FF88'} />
      <RuleTag x={650} y={136} label={revealFormula || bridgeReady ? (tool === 'difference' ? '-' : '+') : tool === 'difference' ? 'çıkar' : 'topla'} color={tool === 'difference' ? '#FF8ABB' : '#9FF5FF'} compact />
    </g>
  );
}
