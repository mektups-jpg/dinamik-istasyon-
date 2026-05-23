import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import {
  isOptimizationCorrect,
  MODULE_ID,
  OptimizationMission,
  OptimizationTool,
  previewOutput,
  TerrainMode,
  toolCopy,
} from './optimizationTerrainModel';

interface OptimizationTerrainSceneProps {
  mission: OptimizationMission;
  tool: OptimizationTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function OptimizationTerrainScene({ mission, tool, solved, status, onHome }: OptimizationTerrainSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const toolMatches = isOptimizationCorrect(mission, tool);
  const checked = status === 'success' || status === 'error';
  const checkedCorrect = checked && toolMatches;
  const accent = selected?.accent ?? neutralAccent;
  const statusLabel = solved
    ? 'Karar kilitlendi'
    : tool === null
      ? 'Arazi bekliyor'
      : checkedCorrect
        ? 'Doğru karar çalışıyor'
        : status === 'error'
          ? 'Yanlış karar alarmı'
          : 'Karar önizlemede';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_28%,rgba(0,229,255,0.14),transparent_42%),radial-gradient(circle_at_72%_66%,rgba(0,255,136,0.10),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.045)_0_1px,transparent_1px_96px)] opacity-50" />

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
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif arazi</p>
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

          <div className="absolute inset-x-[1%] top-[7%] h-[88%] rounded-[60px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(7,24,43,0.96),rgba(2,10,18,0.78)_58%,rgba(1,4,10,0.94))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />

          <div className="absolute left-1/2 top-[11%] z-20 -translate-x-1/2 rounded-[24px] border border-[#00E5FF]/20 bg-[#03111b]/92 px-5 py-2.5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">
              {solved ? 'optimizasyon kanıtı' : 'sensör okuması'}
            </p>
            <p className="mt-1 text-lg font-black tracking-tight text-white lg:text-xl">{solved ? mission.formula : mission.sensor}</p>
          </div>

          <TerrainMachine mission={mission} tool={tool} solved={solved} status={status} accent={accent} checkedCorrect={checkedCorrect} />

          {tool !== null && (
            <motion.div
              className="absolute left-1/2 top-[79%] z-50 flex w-[min(66%,720px)] -translate-x-1/2 items-center justify-between gap-4 rounded-[28px] border bg-[#041725]/98 px-5 py-3 shadow-[0_22px_58px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
              style={{ borderColor: status === 'error' ? '#FF4FA355' : `${accent}66` }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: status === 'error' ? '#FF8ABB' : accent }}>
                  {status === 'error' ? 'alarm' : solved ? 'arazi kanıtı' : 'seçilen karar'}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white/95 lg:text-base">
                  {status === 'error' ? mission.failure[tool] : solved ? mission.success : toolCopy[tool].hint}
                </p>
              </div>
              <div
                className="grid h-[64px] w-[96px] shrink-0 place-items-center rounded-[24px] border bg-[#050b13]/78 px-2 text-center font-mono text-base font-black leading-tight text-white"
                style={{ borderColor: status === 'error' ? '#FF4FA366' : `${accent}77`, boxShadow: `0 0 32px ${status === 'error' ? '#FF4FA3' : accent}33` }}
              >
                {status === 'error' ? '!' : solved ? mission.badge : toolCopy[tool].short}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function TerrainMachine({ mission, tool, solved, status, accent, checkedCorrect }: { mission: OptimizationMission; tool: OptimizationTool | null; solved: boolean; status: Grade12StageStatus; accent: string; checkedCorrect: boolean }) {
  const active = tool !== null;
  const alarm = status === 'error';
  const glow = alarm ? '#FF4FA3' : checkedCorrect ? accent : active ? accent : '#00E5FF';
  const outputLabel = solved ? mission.output : tool ? previewOutput(tool) : 'karar ?';
  const outputBadge = solved ? mission.badge : tool ? toolCopy[tool].label : 'Karar bekliyor';

  return (
    <div className="absolute inset-x-[5%] top-[23%] z-20 h-[54%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.60))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />
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

        <path d={terrainPath(mission.mode)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="32" strokeLinecap="round" />
        <motion.path
          d={terrainPath(mission.mode)}
          fill="none"
          stroke={`url(#terrain-line-${mission.id})`}
          strokeWidth="24"
          strokeLinecap="round"
          filter={`url(#terrain-glow-${mission.id})`}
          animate={{ pathLength: active ? [0.84, 1, 0.84] : 1 }}
          transition={{ duration: 2.2, repeat: active ? Infinity : 0 }}
        />

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
  const paths: Record<TerrainMode, string> = {
    climb: 'M112 272 C270 246 366 214 478 172 C620 118 734 98 900 92',
    descent: 'M112 96 C282 104 396 132 514 178 C654 234 766 266 900 284',
    peak: 'M112 246 C262 150 368 82 500 100 C636 120 706 238 900 252',
    capacity: 'M112 286 C282 276 372 150 500 94 C630 150 724 274 900 286',
    cost: 'M112 94 C282 114 374 268 500 292 C628 268 724 116 900 94',
  };

  return paths[mode];
}

function DerivativeSignStrip({ mode, activeTool, active, accent, alarm }: { mode: TerrainMode; activeTool: OptimizationTool | null; active: boolean; accent: string; alarm: boolean }) {
  const label = active ? toolCopy[activeTool ?? 'increasing'].short : '?';
  const color = alarm ? '#FF4FA3' : active ? accent : '#00E5FF';
  const signs = mode === 'climb'
    ? ['+', '+', '+']
    : mode === 'descent'
      ? ['-', '-', '-']
      : mode === 'peak' || mode === 'capacity'
        ? ['+', '0', '-']
        : ['-', '0', '+'];

  return (
    <g>
      <rect x="190" y="300" width="620" height="38" rx="19" fill="rgba(2,7,13,0.78)" stroke="rgba(255,255,255,0.14)" />
      {signs.map((sign, index) => (
        <g key={`${sign}-${index}`} transform={`translate(${290 + index * 210} 319)`}>
          <circle r="17" fill={sign === '0' ? 'rgba(251,191,36,0.14)' : sign === '+' ? 'rgba(0,255,136,0.12)' : 'rgba(255,79,163,0.12)'} stroke={sign === '0' ? '#FBBF24' : sign === '+' ? '#00FF88' : '#FF4FA3'} strokeOpacity="0.7" />
          <text x="0" y="6" fill="#FFFFFF" fontSize="20" fontWeight="900" textAnchor="middle">{sign}</text>
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
    return (
      <g filter={`url(#terrain-glow-${missionId})`}>
        <rect x="430" y="106" width="140" height="88" rx="18" fill="rgba(0,229,255,0.12)" stroke={color} strokeWidth="4" />
        <path d="M430 106 L470 72 H610 L570 106" fill="rgba(0,229,255,0.12)" stroke={color} strokeWidth="4" />
        <path d="M570 106 L610 72 V158 L570 194" fill="rgba(0,229,255,0.08)" stroke={color} strokeWidth="4" />
        <motion.rect
          x="448"
          y="132"
          width="104"
          height="46"
          rx="10"
          fill="#00E5FF"
          fillOpacity="0.38"
          animate={{ opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <RuleTag x={500} y={58} label={revealDecision ? 'V maksimum' : 'kapasite kutusu'} color={color} />
      </g>
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
    return (
      <g filter={`url(#terrain-glow-${missionId})`}>
        <line x1="392" x2="608" y1={mode === 'cost' ? 290 : 102} y2={mode === 'cost' ? 290 : 102} stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx="500" cy={mode === 'cost' ? 290 : 102} r="54" fill="rgba(251,191,36,0.12)" stroke={color} strokeWidth="6" />
        <RuleTag x={500} y={mode === 'cost' ? 222 : 40} label={revealDecision ? 'fʼ = 0 kapısı' : 'düz eğim kapısı'} color={color} />
      </g>
    );
  }

  if (tool === 'increasing') {
    return (
      <g filter={`url(#terrain-glow-${missionId})`}>
        <path d="M310 230 L410 184 L392 176 M410 184 L402 206" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M440 180 L540 136 L522 128 M540 136 L532 158" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        <RuleTag x={438} y={100} label={revealDecision ? 'fʼ > 0' : 'yükseliş okları'} color={color} />
      </g>
    );
  }

  return (
    <g filter={`url(#terrain-glow-${missionId})`}>
      <path d="M410 122 L512 176 L494 184 M512 176 L502 154" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M542 184 L646 236 L628 246 M646 236 L636 214" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <RuleTag x={546} y={104} label={revealDecision ? 'fʼ < 0' : 'iniş frenleri'} color={color} />
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
