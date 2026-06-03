import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { getGatePoint, intervalLabel, TRACK_LEFT, TRACK_MAX, TRACK_MIN, TRACK_RIGHT, TRACK_Y, valueToX, formatNumber } from './intervalModel';
import { GateMode, GateSide, IntervalBuild, IntervalMission, IntervalSceneHandlers, IntervalSvgRef, LabeledInterval } from './types';

interface IntervalSceneProps extends IntervalSceneHandlers {
  mission: IntervalMission;
  build: IntervalBuild;
  matched: boolean;
  svgRef: IntervalSvgRef;
  onAutoAlign: () => void;
}

const ticks = Array.from({ length: TRACK_MAX - TRACK_MIN + 1 }, (_, index) => TRACK_MIN + index);

export function IntervalScene({
  mission,
  build,
  matched,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onToggleGate,
  onAutoAlign,
}: IntervalSceneProps) {
  const leftPoint = getGatePoint(build, 'left');
  const rightPoint = getGatePoint(build, 'right');

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onAutoAlign();
    }
  };

  return (
    <section
      data-testid="interval-scene"
      tabIndex={0}
      aria-keyshortcuts="Home"
      onKeyDown={handleKeyDown}
      className="relative overflow-hidden rounded-[32px] border border-cyan-300/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(0,229,255,0.10)] outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,229,255,0.12),transparent_54%)]" />
      <div className="relative mb-4 flex flex-col items-start gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">makro atom: MAT.9.1.3.1-4</p>
          <h2 className="text-2xl font-black text-white">Sayı Doğrusunda Kapıları Kur</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${matched ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {matched ? 'Kapı kilitlendi' : `Kurulan: ${intervalLabel(build)}`}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 720 500"
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/10 bg-[#020611]/78 sm:h-[520px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="interval-gate-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <filter id="interval-gate-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="interval-result-band" x1="0" x2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00FF88" />
          </linearGradient>
        </defs>
        <rect width="720" height="500" fill="url(#interval-gate-grid)" />

        <g className="pointer-events-none">
          <rect x="48" y="48" width="624" height="88" rx="24" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.10)" />
          <text x="72" y="82" fill="#A5F3FC" fontSize="14" fontWeight="900">{mission.title}</text>
          <text x="72" y="110" fill="#FFFFFF" fontSize="18" fontWeight="900">{mission.mechanic}</text>
        </g>

        {mission.given ? (
          <g className="pointer-events-none">
            <OperationLens mission={mission} />
            {mission.given.map((interval, index) => (
              <GivenBand key={interval.id} interval={interval} y={174 + index * 42} />
            ))}
          </g>
        ) : (
          <g className="pointer-events-none">
            <rect x="214" y="164" width="292" height="54" rx="20" fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.22)" />
            <text x="360" y="197" textAnchor="middle" fill="#E0F2FE" fontSize="18" fontWeight="900">
              Hedef kapıları sahnede sen kur
            </text>
          </g>
        )}

        <g className="pointer-events-none">
          <line x1={TRACK_LEFT - 34} y1={TRACK_Y} x2={TRACK_RIGHT + 34} y2={TRACK_Y} stroke="rgba(255,255,255,0.36)" strokeWidth="4" strokeLinecap="round" />
          <polygon points={`${TRACK_RIGHT + 44},${TRACK_Y} ${TRACK_RIGHT + 26},${TRACK_Y - 9} ${TRACK_RIGHT + 26},${TRACK_Y + 9}`} fill="rgba(255,255,255,0.38)" />
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={valueToX(tick)} y1={TRACK_Y - 16} x2={valueToX(tick)} y2={TRACK_Y + 16} stroke="rgba(255,255,255,0.24)" strokeWidth={tick === 0 ? 3 : 2} />
              <text x={valueToX(tick)} y={TRACK_Y + 43} textAnchor="middle" fill={tick === 0 ? '#FDE68A' : 'rgba(255,255,255,0.58)'} fontSize="14" fontWeight="900">
                {formatNumber(tick)}
              </text>
            </g>
          ))}
        </g>

        <motion.rect
          x={Math.min(leftPoint.x, rightPoint.x)}
          y={TRACK_Y - 15}
          width={Math.max(12, Math.abs(rightPoint.x - leftPoint.x))}
          height="30"
          rx="15"
          fill="url(#interval-result-band)"
          opacity={matched ? 0.64 : 0.36}
          filter="url(#interval-gate-glow)"
          animate={{ opacity: matched ? [0.62, 0.9, 0.62] : [0.28, 0.46, 0.28] }}
          transition={{ duration: matched ? 0.85 : 1.6, repeat: Infinity }}
        />

        {mission.given && <ResultReadLine mission={mission} build={build} matched={matched} />}

        <GateHandle
          side="left"
          point={leftPoint}
          mode={build.left.mode}
          value={build.left.value}
          showLabel={!mission.given}
          onPointerDown={onPointerDown}
          onToggleGate={onToggleGate}
        />
        <GateHandle
          side="right"
          point={rightPoint}
          mode={build.right.mode}
          value={build.right.value}
          showLabel={!mission.given}
          onPointerDown={onPointerDown}
          onToggleGate={onToggleGate}
        />

        <g className="pointer-events-none">
          <rect x="170" y="390" width="380" height="70" rx="24" fill="rgba(0,0,0,0.46)" stroke="rgba(0,229,255,0.20)" />
          <text x="360" y="421" textAnchor="middle" fill="#67E8F9" fontSize="12" fontWeight="900" letterSpacing="2">
            CANLI ARALIK
          </text>
          <text x="360" y="450" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900">
            {intervalLabel(build)}
          </text>
        </g>
      </svg>
    </section>
  );
}

function OperationLens({ mission }: { mission: IntervalMission }) {
  const copy = mission.kind === 'intersection'
    ? { title: 'ortak ışık', color: '#00E5FF' }
    : { title: 'tek köprü', color: '#00FF88' };

  return (
    <g>
      <rect x="250" y="126" width="220" height="36" rx="18" fill="rgba(0,0,0,0.56)" stroke={`${copy.color}55`} />
      <text x="360" y="149" textAnchor="middle" fill={copy.color} fontSize="13" fontWeight="900" letterSpacing="2">
        {copy.title.toUpperCase()}
      </text>
      <path d="M 360 168 C 360 190 360 215 360 250" fill="none" stroke={copy.color} strokeWidth="2" strokeDasharray="5 7" opacity="0.58" />
    </g>
  );
}

function GivenBand({ interval, y }: { interval: LabeledInterval; y: number }) {
  const color = interval.tone === 'cyan' ? '#00E5FF' : '#B388FF';
  const leftX = valueToX(interval.build.left.value);
  const rightX = valueToX(interval.build.right.value);

  return (
    <g>
      <rect x="58" y={y - 18} width="112" height="28" rx="14" fill="rgba(0,0,0,0.62)" stroke={`${color}66`} />
      <text x="72" y={y + 1} fill={color} fontSize="14" fontWeight="900">
        {interval.label}
      </text>
      <rect x={leftX} y={y - 9} width={rightX - leftX} height="18" rx="9" fill={color} opacity="0.32" />
      <line x1={leftX} y1={y} x2={rightX} y2={y} stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.76" />
      <EndpointMarker x={leftX} y={y} mode={interval.build.left.mode} color={color} />
      <EndpointMarker x={rightX} y={y} mode={interval.build.right.mode} color={color} />
    </g>
  );
}

function ResultReadLine({ mission, build, matched }: { mission: IntervalMission; build: IntervalBuild; matched: boolean }) {
  const leftPoint = getGatePoint(build, 'left');
  const rightPoint = getGatePoint(build, 'right');
  const color = mission.kind === 'intersection' ? '#00E5FF' : '#00FF88';
  const label = mission.kind === 'intersection' ? 'senin ortak bölümün' : 'senin birleşim köprün';

  return (
    <g className="pointer-events-none">
      <line x1={leftPoint.x} y1={238} x2={leftPoint.x} y2={TRACK_Y - 30} stroke={color} strokeWidth="2" strokeDasharray="5 7" opacity={matched ? 0.7 : 0.36} />
      <line x1={rightPoint.x} y1={238} x2={rightPoint.x} y2={TRACK_Y - 30} stroke={color} strokeWidth="2" strokeDasharray="5 7" opacity={matched ? 0.7 : 0.36} />
      <rect x={260} y={TRACK_Y - 82} width="200" height="34" rx="17" fill="rgba(0,0,0,0.58)" stroke={`${color}55`} />
      <text x="360" y={TRACK_Y - 60} textAnchor="middle" fill={matched ? color : 'rgba(255,255,255,0.72)'} fontSize="13" fontWeight="900">
        {label}
      </text>
    </g>
  );
}

function EndpointMarker({ x, y, mode, color }: { x: number; y: number; mode: GateMode; color: string }) {
  return (
    <circle
      cx={x}
      cy={y}
      r="12"
      fill={mode === 'closed' ? color : '#020611'}
      stroke={color}
      strokeWidth="4"
    />
  );
}

function GateHandle({
  side,
  point,
  mode,
  value,
  showLabel = true,
  onPointerDown,
  onToggleGate,
}: {
  side: GateSide;
  point: { x: number; y: number };
  mode: GateMode;
  value: number;
  showLabel?: boolean;
  onPointerDown: IntervalSceneHandlers['onPointerDown'];
  onToggleGate: (side: GateSide) => void;
}) {
  const label = side === 'left' ? 'sol kapı' : 'sağ kapı';
  const testId = side === 'left' ? 'interval-left-gate' : 'interval-right-gate';

  return (
    <g data-testid={testId} style={{ touchAction: 'none' }}>
      <circle
        cx={point.x}
        cy={point.y}
        r="42"
        fill="transparent"
        onPointerDown={(event) => onPointerDown(event, side)}
        style={{ cursor: 'grab' }}
      />
      <motion.circle
        cx={point.x}
        cy={point.y}
        r="28"
        fill={mode === 'closed' ? 'rgba(0,255,136,0.28)' : '#020611'}
        stroke={mode === 'closed' ? '#00FF88' : '#00E5FF'}
        strokeWidth="5"
        filter="url(#interval-gate-glow)"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        onPointerDown={(event) => onPointerDown(event, side)}
        style={{ cursor: 'grab' }}
      />
      <circle
        cx={point.x}
        cy={point.y}
        r="14"
        fill={mode === 'closed' ? '#00FF88' : 'transparent'}
        stroke="#FFFFFF"
        strokeWidth="3"
        onPointerDown={(event) => onPointerDown(event, side)}
        onClick={() => onToggleGate(side)}
        style={{ cursor: 'pointer' }}
      />
      {showLabel && (
        <text x={point.x} y={point.y - 48} textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">
          {label}
        </text>
      )}
      <text x={point.x} y={point.y + 60} textAnchor="middle" fill="#E0F2FE" fontSize="14" fontWeight="900">
        {formatNumber(value)} · {mode === 'closed' ? 'dahil' : 'hariç'}
      </text>
    </g>
  );
}
