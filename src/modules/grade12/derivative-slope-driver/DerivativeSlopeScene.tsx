import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { SlopeMission, SlopeTool, isToolCorrect, lineAngle, MODULE_ID, toolCopy } from './derivativeSlopeModel';
import {
  Car,
  SlopeCapsule,
  TrackPath,
  clamp,
  liveProbePoint,
  probeLabelForMission,
  tangentEndpoints,
} from './DerivativeSlopePrimitives';
import { SlopeExpressionText, SlopeLabelText } from './DerivativeSlopeNotation';

interface DerivativeSlopeSceneProps {
  mission: SlopeMission;
  tool: SlopeTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
  probeProgress: number;
  onProbeChange: (progress: number) => void;
  onProbeCommit: (progress: number) => void;
}

const neutralAccent = '#00E5FF';

export function DerivativeSlopeScene({
  mission,
  tool,
  solved,
  status,
  onHome,
  probeProgress,
  onProbeChange,
  onProbeCommit,
}: DerivativeSlopeSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const toolMatches = isToolCorrect(mission, tool);
  const checked = status === 'success' || status === 'error';
  const checkedCorrect = checked && toolMatches;
  const accent = selected?.accent ?? neutralAccent;
  const statusLabel = solved
    ? 'Eğim kilitlendi'
    : tool === null
      ? 'Pisti oku'
      : checkedCorrect
        ? 'Doğru parça çalışıyor'
        : status === 'error'
          ? 'Yanlış parça alarmı'
          : 'Parça seçildi';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_44%_34%,rgba(0,229,255,0.12),transparent_42%),radial-gradient(circle_at_72%_64%,rgba(0,255,136,0.09),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.04)_0_1px,transparent_1px_94px)] opacity-55" />

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
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif pist</p>
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

          <div className="absolute inset-x-[1%] top-[7%] h-[88%] rounded-[60px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(8,30,48,0.96),rgba(3,8,18,0.78)_55%,rgba(1,4,10,0.94))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />
          <div className="absolute inset-x-[12%] top-[83%] h-[7%] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(0,0,0,0.38))] shadow-[0_22px_50px_rgba(0,0,0,0.30),inset_0_8px_16px_rgba(255,255,255,0.035)]" />

          <div className="absolute left-1/2 top-[11%] z-20 -translate-x-1/2 rounded-[24px] border border-[#00E5FF]/20 bg-[#03111b]/92 px-5 py-2.5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">eğim kanıtı</p>
            <p className="mt-1 text-lg font-black tracking-tight text-white lg:text-xl">
              <SlopeExpressionText expression={mission.expression} />
            </p>
          </div>

          <SlopeMechanism
            mission={mission}
            tool={tool}
            solved={solved}
            status={status}
            accent={accent}
            toolMatches={toolMatches}
            probeProgress={probeProgress}
            onProbeChange={onProbeChange}
            onProbeCommit={onProbeCommit}
          />

        </motion.div>
      </div>
    </div>
  );
}

function SlopeMechanism({
  mission,
  tool,
  solved,
  status,
  accent,
  toolMatches,
  probeProgress,
  onProbeChange,
  onProbeCommit,
}: {
  mission: SlopeMission;
  tool: SlopeTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  accent: string;
  toolMatches: boolean;
  probeProgress: number;
  onProbeChange: (progress: number) => void;
  onProbeCommit: (progress: number) => void;
}) {
  const active = tool !== null;
  const alarm = status === 'error';
  const checkedCorrect = status === 'success' && toolMatches;
  const liveB = liveProbePoint(mission, probeProgress);
  const secantAngle = lineAngle(mission.a, liveB);
  const tangent = tangentEndpoints(mission.a.x, mission.a.y, mission.tangentAngle, mission.mode === 'tangent' ? 260 : 220);
  const showSecant = tool === 'secant' || mission.mode === 'average' || mission.mode === 'tangent';
  const showTangent = tool === 'tangent' || mission.mode === 'tangent';
  const showCorner = mission.mode === 'corner' || tool === 'corner';
  const showGap = mission.mode === 'gap' || tool === 'gap';
  const trackGlow = alarm ? '#FF4FA3' : checkedCorrect ? accent : '#00E5FF';
  const secantAccent = mission.mode === 'average'
    ? '#FBBF24'
    : tool === 'secant'
      ? accent
      : toolCopy.secant.accent;
  const isAverageWrongTangent = mission.mode === 'average' && tool === 'tangent';
  const tangentLabelX = isAverageWrongTangent
    ? mission.a.x - 10
    : mission.id === 'final-tangent-lock'
      ? mission.a.x + 92
      : mission.a.x + 72;
  const tangentLabelY = isAverageWrongTangent
    ? mission.a.y - 58
    : mission.id === 'final-tangent-lock'
      ? mission.a.y - 92
      : mission.a.y - 64;
  const tangentVisualLabel = isAverageWrongTangent ? 'tek nokta değil' : mission.tangentLabel;
  const leftEvidenceTitle = mission.mode === 'gap' ? 'pist' : 'kesen';
  const rightEvidenceTitle = mission.mode === 'gap' ? 'sonuç' : 'teğet';
  const isAverageSecant = mission.mode === 'average';
  const isSecantSelected = tool === 'secant';
  const dynamicSecantLabel = isAverageSecant ? `Δy / Δx ≈ ${formatAverageSlope(mission.a, liveB)}` : mission.secantLabel;
  return (
    <div className="absolute inset-x-[5%] top-[23%] z-20 h-[54%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.60))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" role="img" aria-label={`${mission.title} türev eğim pisti`}>
        <defs>
          <linearGradient id={`slope-track-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="54%" stopColor={trackGlow} stopOpacity="1" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.84" />
          </linearGradient>
          <filter id={`slope-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 9 }).map((_, index) => (
          <line key={`vx-${index}`} x1={118 + index * 94} x2={118 + index * 94} y1="42" y2="316" stroke="rgba(255,255,255,0.055)" />
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <line key={`hy-${index}`} x1="82" x2="930" y1={56 + index * 47} y2={56 + index * 47} stroke="rgba(255,255,255,0.06)" />
        ))}
        <line x1="92" x2="930" y1="294" y2="294" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="132" x2="132" y1="48" y2="318" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <text x="112" y="68" fill="rgba(255,255,255,0.42)" fontSize="18" fontWeight="800">y</text>
        <text x="904" y="318" fill="rgba(255,255,255,0.42)" fontSize="18" fontWeight="800">x</text>

        <TrackPath mission={mission} glow={trackGlow} />

        {showSecant && (
          <motion.g
            key={`${mission.id}-${tool ?? 'none'}-${status}-secant`}
            data-testid={`${MODULE_ID}-secant-visual`}
            initial={{ opacity: isAverageSecant && !isSecantSelected ? 0.64 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <line
              x1={mission.a.x}
              y1={mission.a.y}
              x2={liveB.x}
              y2={liveB.y}
              stroke={secantAccent}
              strokeWidth={isAverageSecant ? (isSecantSelected ? 7 : 4) : tool === 'secant' ? 8 : 5}
              strokeLinecap="round"
              strokeDasharray={mission.mode === 'tangent' ? '12 10' : undefined}
              filter={`url(#slope-glow-${mission.id})`}
            />
            <motion.g
              initial={isAverageSecant && isSecantSelected ? { opacity: 0, scale: 0.92 } : undefined}
              animate={{ opacity: 1, scale: solved && isAverageSecant ? [1, 1.04, 1] : 1 }}
              transition={{ delay: isAverageSecant && isSecantSelected ? 0.38 : 0, duration: 0.45, repeat: solved && isAverageSecant ? Infinity : 0, repeatDelay: 1.2 }}
            >
              <SlopeCapsule x={(mission.a.x + liveB.x) / 2} y={(mission.a.y + liveB.y) / 2 - 34} angle={secantAngle} label={dynamicSecantLabel} color={secantAccent} />
            </motion.g>
          </motion.g>
        )}

        {showTangent && (
          <motion.g
            data-testid={`${MODULE_ID}-tangent-visual`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: solved ? [1, 1.03, 1] : 1 }}
            transition={{ duration: 0.7, repeat: solved ? Infinity : 0 }}
          >
            <line
              x1={tangent.x1}
              y1={tangent.y1}
              x2={tangent.x2}
              y2={tangent.y2}
              stroke={tool === 'tangent' ? accent : '#00FF88'}
              strokeWidth={tool === 'tangent' || mission.mode === 'tangent' ? 9 : 5}
              strokeLinecap="round"
              filter={`url(#slope-glow-${mission.id})`}
            />
            <circle cx={mission.a.x} cy={mission.a.y} r="16" fill="#02070d" stroke={tool === 'tangent' ? accent : '#00FF88'} strokeWidth="5" />
            <SlopeCapsule x={tangentLabelX} y={tangentLabelY} angle={mission.tangentAngle} label={tangentVisualLabel} color={tool === 'tangent' ? accent : '#00FF88'} />
          </motion.g>
        )}

        {showCorner && (
          <g data-testid={`${MODULE_ID}-corner-visual`}>
            <line x1="342" y1="240" x2="502" y2="132" stroke={tool === 'corner' ? accent : '#FBBF24'} strokeWidth="8" strokeLinecap="round" filter={`url(#slope-glow-${mission.id})`} />
            <line x1="502" y1="132" x2="668" y2="244" stroke={tool === 'corner' ? accent : '#FF4FA3'} strokeWidth="8" strokeLinecap="round" filter={`url(#slope-glow-${mission.id})`} />
            <circle cx="502" cy="132" r="24" fill="rgba(251,191,36,0.12)" stroke="#FBBF24" strokeWidth="4" />
            <text x="388" y="122" fill="#FDE68A" fontSize="18" fontWeight="900">sol eğim</text>
            <text x="548" y="122" fill="#FF8ABB" fontSize="18" fontWeight="900">sağ eğim</text>
            <text x="440" y="92" fill="#FFFFFF" fontSize="18" fontWeight="900">tek teğet yok</text>
          </g>
        )}

        {showGap && (
          <g data-testid={`${MODULE_ID}-gap-visual`}>
            <rect x="476" y="122" width="96" height="150" rx="32" fill="rgba(255,79,163,0.12)" stroke="#FF4FA3" strokeWidth="4" strokeDasharray="10 8" />
            <text x="452" y="102" fill="#FF8ABB" fontSize="20" fontWeight="900">pist kopuk</text>
            <path d="M490 248 C518 220 552 206 592 174" fill="none" stroke="#FF4FA3" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 10" />
          </g>
        )}

        <Car x={mission.a.x} y={mission.a.y} label="A" color="#00FF88" active={tool === 'tangent' || tool === 'secant'} pulseDelay={0} />
        <Car x={liveB.x} y={liveB.y} label="B" color="#00E5FF" active={tool === 'secant'} pulseDelay={isAverageSecant && isSecantSelected ? 0.45 : 0} />

        {mission.mode === 'tangent' && (
          <g opacity="0.58">
            <circle cx={mission.a.x + 170} cy={mission.a.y - 44} r="8" fill="#00E5FF" />
            <circle cx={mission.a.x + 126} cy={mission.a.y - 34} r="7" fill="#00E5FF" />
            <circle cx={mission.a.x + 84} cy={mission.a.y - 22} r="6" fill="#00E5FF" />
            {mission.id === 'instant-tangent' && (
              <text x={mission.a.x + 148} y={mission.a.y - 92} fill="rgba(159,245,255,0.74)" fontSize="16" fontWeight="900">B yaklaşır</text>
            )}
          </g>
        )}
      </svg>

      <ProbeDock
        mission={mission}
        progress={probeProgress}
        accent={isAverageSecant ? toolCopy.secant.accent : accent}
        onProbeChange={onProbeChange}
        onProbeCommit={onProbeCommit}
      />

      <div className="sr-only">{mission.proof}</div>

      <div
        className="absolute left-[8%] bottom-[6%] z-30 rounded-[26px] border px-4 py-3 shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl"
        style={{
          borderColor: tool === 'secant' ? '#00E5FF66' : 'rgba(255,255,255,0.12)',
          background: tool === 'secant' ? 'rgba(0,229,255,0.11)' : 'rgba(255,255,255,0.045)',
        }}
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">{leftEvidenceTitle}</p>
        <p className="mt-1 text-xl font-black text-white">
          <SlopeLabelText label={dynamicSecantLabel} />
        </p>
      </div>

      <div
        className="absolute right-[2%] bottom-[6%] z-30 rounded-[26px] border px-4 py-3 text-right shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl"
        style={{
          borderColor: tool === 'tangent' ? '#00FF8866' : showGap ? '#FF4FA366' : 'rgba(255,255,255,0.12)',
          background: tool === 'tangent' ? 'rgba(0,255,136,0.11)' : showGap ? 'rgba(255,79,163,0.10)' : 'rgba(255,255,255,0.045)',
        }}
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">{rightEvidenceTitle}</p>
        <p className="mt-1 text-xl font-black text-white">{mission.tangentLabel}</p>
      </div>

      {active && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[28%] z-20 h-[42%] w-[42%] -translate-x-1/2 rounded-[999px] border"
          style={{
            borderColor: alarm ? '#FF4FA377' : `${accent}66`,
            background: alarm ? 'rgba(255,79,163,0.10)' : `${accent}10`,
            boxShadow: `0 0 44px ${alarm ? '#FF4FA3' : accent}26`,
          }}
          animate={{ scaleX: solved ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 1.8, repeat: solved ? Infinity : 0 }}
        />
      )}
    </div>
  );
}

function ProbeDock({
  mission,
  progress,
  accent,
  onProbeChange,
  onProbeCommit,
}: {
  mission: SlopeMission;
  progress: number;
  accent: string;
  onProbeChange: (progress: number) => void;
  onProbeCommit: (progress: number) => void;
}) {
  const label = probeLabelForMission(mission, progress);
  const percent = Math.round(progress * 100);
  const isAverage = mission.mode === 'average';
  const dockTitle = isAverage ? 'A-B aralığı' : 'eğim sürgüsü';
  const dockLabel = isAverage ? 'B noktasını gezdir' : label;
  const actionLabel = isAverage ? 'B noktasını eğri üzerinde gezdir' : 'Eğim sürgüsünü hareket ettir';
  const leftLabel = mission.mode === 'tangent' ? 'B, A’dan uzak' : mission.mode === 'corner' ? 'sol kanat' : mission.mode === 'gap' ? 'sol pist' : 'A sabit';
  const rightLabel = mission.mode === 'tangent' ? 'B -> A' : mission.mode === 'corner' ? 'sağ kanat' : mission.mode === 'gap' ? 'boşluğu tara' : 'B hareketli';
  const sliderMin = isAverage ? 30 : 0;
  const sliderMax = isAverage ? 95 : 100;
  const sliderValue = clamp(percent, sliderMin, sliderMax);
  const dockPositionClass = isAverage
    ? 'bottom-[3%] w-[min(34%,430px)]'
    : 'bottom-[-24%] w-[min(42%,520px)]';

  const update = (value: number, commit = false) => {
    const nextProgress = clamp(value, 0, 1);
    onProbeChange(nextProgress);
    if (commit && !isAverage) onProbeCommit(nextProgress);
  };

  return (
    <div
      className={`absolute left-1/2 z-50 -translate-x-1/2 rounded-[24px] border bg-[#03111b]/92 px-4 py-3 shadow-[0_20px_46px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl ${
        dockPositionClass
      }`}
      style={{ borderColor: `${accent}55`, boxShadow: `0 18px 48px rgba(0,0,0,0.42), 0 0 34px ${accent}22` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/46">{dockTitle}</p>
          <p className="text-sm font-black text-white">{dockLabel}</p>
        </div>
        <span
          className="rounded-full border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em]"
          style={{ borderColor: `${accent}55`, color: accent, backgroundColor: `${accent}12` }}
        >
          {isAverage ? label : `${percent}%`}
        </span>
      </div>

      <input
        data-testid={`${MODULE_ID}-probe-range`}
        aria-label={actionLabel}
        type="range"
        min={sliderMin}
        max={sliderMax}
        value={sliderValue}
        onChange={(event) => update(Number(event.currentTarget.value) / 100, true)}
        onPointerUp={(event) => update(Number(event.currentTarget.value) / 100, true)}
        onKeyUp={(event) => update(Number(event.currentTarget.value) / 100, true)}
        className="mt-2 h-8 w-full cursor-ew-resize appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:-mt-3 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:bg-[#061525] [&::-webkit-slider-thumb]:shadow-[0_0_24px_rgba(0,229,255,0.72)]"
        style={{
          accentColor: accent,
          WebkitAppearance: 'none',
          background: `linear-gradient(90deg, ${accent} 0%, ${accent} ${sliderValue}%, rgba(255,255,255,0.16) ${sliderValue}%, rgba(255,255,255,0.16) 100%)`,
          borderRadius: 999,
        }}
      />

      <div className="flex items-center justify-between font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/38">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function formatAverageSlope(a: { x: number; y: number }, b: { x: number; y: number }) {
  const run = Math.max(1, b.x - a.x);
  const rise = a.y - b.y;
  const visualScale = 0.8;
  return (rise / run * visualScale).toFixed(2);
}
