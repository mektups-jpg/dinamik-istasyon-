import { motion } from 'motion/react';
import type { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { previewOutput, toolCopy } from './optimizationTerrainModel';
import type { OptimizationMission, OptimizationTool, TerrainMode } from './optimizationTerrainModel';

interface TerrainMachineProps {
  mission: OptimizationMission;
  tool: OptimizationTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  accent: string;
  checkedCorrect: boolean;
}

export function TerrainMachine({ mission, tool, solved, status, accent, checkedCorrect }: TerrainMachineProps) {
  const active = tool !== null;
  const alarm = status === 'error';
  const glow = alarm ? '#FF4FA3' : checkedCorrect ? accent : active ? accent : '#00E5FF';
  const outputLabel = solved ? mission.output : tool ? previewOutput(tool) : 'karar ?';
  const outputBadge = solved ? mission.badge : tool ? toolCopy[tool].label : 'Karar bekliyor';
  const path = terrainPath(mission.mode);

  return (
    <div className="absolute inset-x-[5%] top-[23%] z-20 h-[54%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/12 bg-[linear-gradient(180deg,rgba(3,20,33,0.98),rgba(0,0,0,0.48))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.62),0_26px_80px_rgba(0,0,0,0.26)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" role="img" aria-label={`${mission.title} optimizasyon arazisi`}>
        <defs>
          <linearGradient id={`terrain-line-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.92" />
            <stop offset="55%" stopColor={glow} stopOpacity="1" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.86" />
          </linearGradient>
          <filter id={`terrain-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 8 }).map((_, index) => (
          <line key={`vx-${index}`} x1={140 + index * 100} x2={140 + index * 100} y1="42" y2="316" stroke="rgba(255,255,255,0.055)" />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <line key={`hy-${index}`} x1="84" x2="928" y1={66 + index * 50} y2={66 + index * 50} stroke="rgba(255,255,255,0.06)" />
        ))}

        <path d={path} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="42" strokeLinecap="round" />
        <motion.path
          d={path}
          fill="none"
          stroke={active ? 'rgba(160,232,255,0.20)' : `url(#terrain-line-${mission.id})`}
          strokeWidth={active ? 24 : 30}
          strokeLinecap="round"
          filter={`url(#terrain-glow-${mission.id})`}
          animate={{ pathLength: active ? 1 : [0.94, 1, 0.94] }}
          transition={{ duration: 2.8, repeat: active ? 0 : Infinity }}
        />

        <SelectedTerrainSegment mode={mission.mode} tool={tool} accent={accent} missionId={mission.id} />
        <TerrainLandmarks mode={mission.mode} activeTool={tool} missionId={mission.id} />
        <DerivativeSignStrip mode={mission.mode} activeTool={tool} active={active} accent={accent} alarm={alarm} />
        <DecisionOverlay mode={mission.mode} tool={tool} active={active} accent={accent} alarm={alarm} missionId={mission.id} revealDecision={solved} />
        <Rover point={mission.point} accent={glow} solved={solved} missionId={mission.id} />
        <OutputCapsule x={798} y={158} label={outputLabel} color={checkedCorrect ? '#00FF88' : active ? accent : '#00E5FF'} />
        <text x="798" y="224" fill="rgba(255,255,255,0.72)" fontSize="17" fontWeight="900" textAnchor="middle">{outputBadge}</text>
      </svg>

      {solved && <div className="sr-only">{mission.proof}</div>}
    </div>
  );
}

function terrainPath(mode: TerrainMode) {
  if (isAnalysisTerrain(mode)) {
    return analysisTerrainPath();
  }

  const paths: Record<TerrainMode, string> = {
    climb: analysisTerrainPath(),
    descent: analysisTerrainPath(),
    peak: analysisTerrainPath(),
    capacity: 'M112 286 C282 276 372 150 500 94 C630 150 724 274 900 286',
    cost: 'M112 94 C282 114 374 268 500 292 C628 268 724 116 900 94',
  };

  return paths[mode];
}

function analysisTerrainPath() {
  return 'M112 270 C204 246 244 128 336 100 C452 112 502 276 626 270 C724 260 776 138 900 118';
}

function isAnalysisTerrain(mode: TerrainMode) {
  return mode === 'climb' || mode === 'descent' || mode === 'peak';
}

function selectedTerrainSegment(mode: TerrainMode, tool: OptimizationTool | null) {
  if (tool === null) {
    return null;
  }

  if (isAnalysisTerrain(mode)) {
    if (tool === 'increasing') {
      return mode === 'descent'
        ? 'M640 266 C724 250 776 138 884 120'
        : 'M180 240 C224 198 260 128 336 100';
    }

    if (tool === 'decreasing') {
      return 'M354 104 C446 126 506 258 626 270';
    }
  }

  if (tool === 'max-volume') {
    return mode === 'capacity' ? terrainPath(mode) : null;
  }

  if (tool === 'min-cost') {
    return mode === 'cost' ? terrainPath(mode) : null;
  }

  return null;
}

function SelectedTerrainSegment({ mode, tool, accent, missionId }: { mode: TerrainMode; tool: OptimizationTool | null; accent: string; missionId: string }) {
  const segment = selectedTerrainSegment(mode, tool);

  if (segment === null) {
    return null;
  }

  return (
    <g filter={`url(#terrain-glow-${missionId})`}>
      <path
        d={segment}
        fill="none"
        stroke={accent}
        strokeWidth="34"
        strokeLinecap="round"
        opacity="0.28"
      />
      <motion.path
        d={segment}
        fill="none"
        stroke={accent}
        strokeWidth="18"
        strokeLinecap="round"
        strokeDasharray="24 22"
        animate={{ strokeDashoffset: [0, -92] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      />
    </g>
  );
}

function TerrainLandmarks({ mode, activeTool, missionId }: { mode: TerrainMode; activeTool: OptimizationTool | null; missionId: string }) {
  if (!isAnalysisTerrain(mode)) {
    return null;
  }

  const muted = activeTool !== null;
  const opacity = muted ? 0.48 : 0.58;
  const guideStroke = muted ? 'rgba(160,232,255,0.34)' : null;
  const risingOpacity = muted ? 0.13 : 0.36;
  const fallingOpacity = muted ? 0.13 : 0.34;
  const peakColor = muted ? 'rgba(255,255,255,0.34)' : '#FBBF24';
  const valleyColor = muted ? 'rgba(255,255,255,0.30)' : '#B388FF';
  const markerOpacity = muted ? 0.36 : 0.74;

  return (
    <g filter={`url(#terrain-glow-${missionId})`} opacity={opacity}>
      <path d="M180 240 C224 198 260 128 336 100" fill="none" stroke={guideStroke ?? '#00FF88'} strokeWidth="12" strokeLinecap="round" strokeDasharray="18 18" opacity={risingOpacity} />
      <path d="M354 104 C446 126 506 258 626 270" fill="none" stroke={guideStroke ?? '#FF4FA3'} strokeWidth="12" strokeLinecap="round" strokeDasharray="18 18" opacity={fallingOpacity} />
      <path d="M640 266 C724 250 776 138 884 120" fill="none" stroke={guideStroke ?? '#00FF88'} strokeWidth="12" strokeLinecap="round" strokeDasharray="18 18" opacity={risingOpacity} />

      <line x1="276" x2="396" y1="100" y2="100" stroke={peakColor} strokeWidth="6" strokeLinecap="round" opacity={markerOpacity} />
      <circle cx="336" cy="100" r="18" fill="rgba(251,191,36,0.10)" stroke={peakColor} strokeWidth="4" />
      {!muted && <RuleTag x={336} y={58} label="tepe" color="#FBBF24" />}

      <line x1="566" x2="686" y1="270" y2="270" stroke={valleyColor} strokeWidth="6" strokeLinecap="round" opacity={markerOpacity} />
      <circle cx="626" cy="270" r="18" fill="rgba(179,136,255,0.10)" stroke={valleyColor} strokeWidth="4" />
      {!muted && <RuleTag x={626} y={226} label="çukur" color="#B388FF" />}
    </g>
  );
}

function DerivativeSignStrip({ mode, activeTool, active, accent, alarm }: { mode: TerrainMode; activeTool: OptimizationTool | null; active: boolean; accent: string; alarm: boolean }) {
  const label = active ? toolCopy[activeTool ?? 'increasing'].short : '?';
  const color = alarm ? '#FF4FA3' : active ? accent : '#00E5FF';
  const signs = isAnalysisTerrain(mode)
    ? [
        { sign: '+', label: 'artan' },
        { sign: '0', label: 'tepe' },
        { sign: '-', label: 'azalan' },
        { sign: '0', label: 'çukur' },
        { sign: '+', label: 'artan' },
      ]
    : mode === 'capacity'
      ? [
          { sign: '+', label: 'artar' },
          { sign: '0', label: 'tepe' },
          { sign: '-', label: 'azalır' },
        ]
      : [
          { sign: '-', label: 'azalır' },
          { sign: '0', label: 'çukur' },
          { sign: '+', label: 'artar' },
        ];
  const startX = signs.length === 5 ? 220 : 290;
  const stepX = signs.length === 5 ? 140 : 210;

  return (
    <g>
      <rect x="190" y="300" width="620" height="38" rx="19" fill="rgba(2,7,13,0.84)" stroke="rgba(255,255,255,0.22)" />
      {signs.map((item, index) => (
        <g key={`${item.sign}-${item.label}-${index}`} transform={`translate(${startX + index * stepX} 319)`}>
          <circle r="18" fill={item.sign === '0' ? 'rgba(251,191,36,0.18)' : item.sign === '+' ? 'rgba(0,255,136,0.16)' : 'rgba(255,79,163,0.16)'} stroke={item.sign === '0' ? '#FBBF24' : item.sign === '+' ? '#00FF88' : '#FF4FA3'} strokeOpacity="0.88" />
          <text x="0" y="6" fill="#FFFFFF" fontSize="20" fontWeight="900" textAnchor="middle">{item.sign}</text>
          <text x="0" y="-26" fill="rgba(255,255,255,0.58)" fontSize="10" fontWeight="900" textAnchor="middle">{item.label}</text>
        </g>
      ))}
      {active && (
        <text x="500" y="286" fill={color} fontSize="13" fontWeight="900" textAnchor="middle">
          aktif karar: {label}
        </text>
      )}
    </g>
  );
}

function DecisionOverlay({ mode, tool, active, accent, alarm, missionId, revealDecision }: { mode: TerrainMode; tool: OptimizationTool | null; active: boolean; accent: string; alarm: boolean; missionId: string; revealDecision: boolean }) {
  const color = alarm ? '#FF4FA3' : accent;

  if (!active) {
    return null;
  }

  if (tool === 'max-volume') {
    const peak = capacityPeakPoint(mode);

    return (
      <PeakVolumeMarker
        x={peak.x}
        y={peak.y}
        label={revealDecision ? 'V maksimum' : 'hacim tepesi'}
        color={color}
        missionId={missionId}
      />
    );
  }

  if (tool === 'min-cost') {
    if (alarm) {
      return (
        <g filter={`url(#terrain-glow-${missionId})`}>
          <rect x="410" y="226" width="180" height="48" rx="18" fill="rgba(255,79,163,0.12)" stroke={color} strokeWidth="4" />
          <text x="500" y="256" textAnchor="middle" fill="#FFD3E6" fontSize="16" fontWeight="900">maliyet vadisi yok</text>
        </g>
      );
    }

    return (
      <g filter={`url(#terrain-glow-${missionId})`}>
        <ellipse cx="500" cy="248" rx="112" ry="34" fill="rgba(179,136,255,0.16)" stroke={color} strokeWidth="5" />
        <path d="M408 236 C448 278 552 278 592 236" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
        <RuleTag x={500} y={192} label={revealDecision ? 'C minimum' : 'maliyet vadisi'} color={color} />
      </g>
    );
  }

  if (tool === 'extremum') {
    if (isAnalysisTerrain(mode)) {
      return (
        <g filter={`url(#terrain-glow-${missionId})`}>
          <line x1="276" x2="396" y1="100" y2="100" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <circle cx="336" cy="100" r="48" fill="rgba(251,191,36,0.12)" stroke={color} strokeWidth="6" />
          <RuleTag x={336} y={42} label={revealDecision ? 'fʼ=0 tepe' : 'tepe kapısı'} color={color} />

          <line x1="566" x2="686" y1="270" y2="270" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.94" />
          <circle cx="626" cy="270" r="48" fill="rgba(251,191,36,0.10)" stroke={color} strokeWidth="6" opacity="0.94" />
          <RuleTag x={626} y={224} label={revealDecision ? 'fʼ=0 çukur' : 'çukur kapısı'} color={color} />
        </g>
      );
    }

    return (
      <g filter={`url(#terrain-glow-${missionId})`}>
        <line x1="392" x2="608" y1={mode === 'cost' ? 290 : 102} y2={mode === 'cost' ? 290 : 102} stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx="500" cy={mode === 'cost' ? 290 : 102} r="54" fill="rgba(251,191,36,0.12)" stroke={color} strokeWidth="6" />
        <RuleTag x={500} y={mode === 'cost' ? 222 : 40} label={revealDecision ? 'fʼ = 0 kapısı' : 'düz eğim kapısı'} color={color} />
      </g>
    );
  }

  if (tool === 'increasing') {
    const rightRising = mode === 'descent';

    return (
      <g filter={`url(#terrain-glow-${missionId})`}>
        <path
          d={rightRising ? 'M670 252 L778 144 L758 140 M778 144 L772 168' : 'M186 242 L286 136 L266 132 M286 136 L282 160'}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <RuleTag x={rightRising ? 748 : 218} y={rightRising ? 112 : 104} label={revealDecision ? 'fʼ > 0' : 'artan iz'} color={color} />
      </g>
    );
  }

  return (
    <g filter={`url(#terrain-glow-${missionId})`}>
      <path d="M382 126 L494 220 L474 226 M494 220 L488 196" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M510 230 L604 264 L584 274 M604 264 L598 240" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <RuleTag x={506} y={150} label={revealDecision ? 'fʼ < 0' : 'azalan iz'} color={color} />
    </g>
  );
}

function capacityPeakPoint(mode: TerrainMode) {
  if (mode === 'capacity') {
    return { x: 500, y: 94 };
  }

  if (isAnalysisTerrain(mode)) {
    return { x: 336, y: 100 };
  }

  return { x: 500, y: 94 };
}

function PeakVolumeMarker({ x, y, label, color, missionId }: { x: number; y: number; label: string; color: string; missionId: string }) {
  return (
    <g transform={`translate(${x} ${y})`} filter={`url(#terrain-glow-${missionId})`}>
      <line x1="-72" x2="72" y1="0" y2="0" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.78" />
      <line x1="0" x2="0" y1="18" y2="74" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" opacity="0.52" />
      <motion.circle
        r="34"
        fill="rgba(0,229,255,0.08)"
        stroke={color}
        strokeWidth="4"
        animate={{ scale: [0.96, 1.08, 0.96], opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <circle r="13" fill="rgba(0,229,255,0.28)" stroke="#FFFFFF" strokeOpacity="0.62" strokeWidth="2" />
      <path d="M-20 -16 L0 -34 L20 -16" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <RuleTag x={0} y={-44} label={label} color={color} />
    </g>
  );
}

function Rover({ point, accent, solved, missionId }: { point: { x: number; y: number }; accent: string; solved: boolean; missionId: string }) {
  return (
    <g
      transform={`translate(${point.x} ${point.y})`}
      filter={`url(#terrain-glow-${missionId})`}
    >
      <motion.g
        animate={{ y: solved ? [0, -7, 0] : 0 }}
        transition={{ duration: 1.6, repeat: solved ? Infinity : 0 }}
      >
        <circle r="34" fill="rgba(3,17,27,0.94)" stroke={accent} strokeWidth="5" />
        <rect x="-26" y="-12" width="52" height="24" rx="12" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.32)" />
        <circle cx="-13" cy="0" r="5" fill="#00E5FF" />
        <circle cx="13" cy="0" r="5" fill="#00FF88" />
        <text x="0" y="54" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">araç</text>
      </motion.g>
    </g>
  );
}

function OutputCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-122" y="-38" width="244" height="76" rx="30" fill="rgba(2,7,13,0.90)" stroke={color} strokeOpacity="0.70" strokeWidth="3" />
      <text x="0" y="8" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}

function RuleTag({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-82" y="-18" width="164" height="36" rx="18" fill="rgba(2,7,13,0.86)" stroke={color} strokeOpacity="0.65" strokeWidth="2" />
      <text x="0" y="6" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}
