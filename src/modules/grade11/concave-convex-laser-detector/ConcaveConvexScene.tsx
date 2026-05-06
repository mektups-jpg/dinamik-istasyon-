import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import {
  detectorFrame,
  getScanPoint,
  kindLabels,
  polygonPoints,
  polygonProfiles,
  progressToRailX,
} from './detectorModel';
import { DetectorDragTarget, DetectorMeasure, DetectorState, DetectorTarget, PolygonKind, PolygonProfile } from './types';

interface ConcaveConvexSceneProps {
  state: DetectorState;
  target: DetectorTarget;
  measure: DetectorMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: DetectorDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: DetectorDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
  onSelectKind: (kind: PolygonKind) => void;
}

const lockKinds: PolygonKind[] = ['convex', 'concave'];

const lockTestIds: Record<PolygonKind, string> = {
  convex: 'concave-convex-lock-convex',
  concave: 'concave-convex-lock-concave',
};

export function ConcaveConvexScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onSelectKind,
}: ConcaveConvexSceneProps) {
  const profile = polygonProfiles[target.profile];
  const probeX = progressToRailX(measure.scanProgress);
  const scanPoint = getScanPoint(measure.scanProgress, profile);
  const accent = target.profile === 'convex' ? '#22D3EE' : '#FB7185';

  return (
    <section
      data-testid="concave-convex-laser-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-100/16 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(251,113,133,0.12),transparent_31%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.2.3</p>
          <h2 className="text-2xl font-black text-white">Konkav-Konveks Lazer Dedektörü</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="concave-convex-table-screen"
        viewBox={`0 0 ${detectorFrame.width} ${detectorFrame.height}`}
        className="relative h-[400px] w-full touch-none rounded-[28px] border border-white/12 bg-[#041018]/88 sm:h-[450px] xl:h-[560px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="concave-convex-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
          </pattern>
          <filter id="concave-convex-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="concave-convex-beam" x1="0%" x2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.05" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <rect width={detectorFrame.width} height={detectorFrame.height} fill="url(#concave-convex-grid)" />
        <rect x="72" y="58" width="756" height="388" rx="34" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.13)" />

        <g transform="translate(92 82)">
          <rect width="202" height="118" rx="24" fill="rgba(0,0,0,0.34)" stroke="rgba(255,255,255,0.12)" />
          <text x="20" y="32" fill="rgba(255,255,255,0.52)" fontSize="11" fontWeight="900">NUMUNE</text>
          <text x="20" y="66" fill="#E0F2FE" fontSize="24" fontWeight="900">{profile.label}</text>
          <text x="20" y="96" fill={accent} fontSize="13" fontWeight="900">180° lazer eşiği</text>
        </g>

        <PolygonLayer profile={profile} scan={measure.scanProgress} alarmActive={measure.alarmActive} />
        <FactPanel profile={profile} scan={measure.scanProgress} alarmActive={measure.alarmActive} />

        <motion.line
          x1={probeX}
          y1={detectorFrame.railY - 4}
          x2={scanPoint.x}
          y2={scanPoint.y}
          stroke="url(#concave-convex-beam)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#concave-convex-glow)"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
        <circle cx={scanPoint.x} cy={scanPoint.y} r="13" fill="#06111d" stroke={accent} strokeWidth="4" filter="url(#concave-convex-glow)" />
        <circle cx={scanPoint.x} cy={scanPoint.y} r="4" fill="#fff" />

        <g data-testid="concave-convex-classification-locks" transform="translate(316 404)">
          {lockKinds.map((kind, index) => (
            <LockPad
              key={kind}
              kind={kind}
              x={index * 144}
              selected={state.selectedKind === kind}
              correct={target.correctKind === kind && missionOk}
              onSelectKind={onSelectKind}
            />
          ))}
        </g>

        <RailLabel x={detectorFrame.railX} y={detectorFrame.railY - 28} label="açı probu" />
        <line x1={detectorFrame.railX} y1={detectorFrame.railY} x2={detectorFrame.railX + detectorFrame.railWidth} y2={detectorFrame.railY} stroke="rgba(255,255,255,0.2)" strokeWidth="15" strokeLinecap="round" />
        <line x1={detectorFrame.railX} y1={detectorFrame.railY} x2={probeX} y2={detectorFrame.railY} stroke={accent} strokeWidth="8" strokeLinecap="round" />
        <ProbeHandle
          x={probeX}
          y={detectorFrame.railY}
          color={accent}
          label={`${Math.round(measure.scanProgress * 100)}%`}
          value={Math.round(measure.scanProgress * 100)}
          onPointerDown={(event) => onPointerDown('angle-probe', event)}
          onKeyDown={(event) => onKeyDown('angle-probe', event)}
        />
      </svg>
    </section>
  );
}

function PolygonLayer({ profile, scan, alarmActive }: { profile: PolygonProfile; scan: number; alarmActive: boolean }) {
  return (
    <g>
      <motion.polygon
        points={polygonPoints(profile.points)}
        fill={profile.kind === 'convex' ? 'rgba(34,211,238,0.13)' : 'rgba(251,113,133,0.12)'}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        animate={{ opacity: [0.82, 1, 0.82] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />

      {profile.points.map((point, index) => {
        const revealed = scan > index * 0.18 + 0.12;
        const isReflex = profile.reflexIndex === index;
        const color = isReflex && revealed ? '#FB7185' : '#67E8F9';
        const labelPoint = getAngleLabelPoint(point, profile);
        return (
          <g key={`${profile.kind}-vertex-${index}`} opacity={revealed ? 1 : 0.34}>
            <circle cx={point.x} cy={point.y} r={isReflex && alarmActive ? 33 : 25} fill={`${color}22`} stroke={color} strokeWidth={isReflex && alarmActive ? 5 : 3} filter={revealed ? 'url(#concave-convex-glow)' : undefined} />
            <circle cx={point.x} cy={point.y} r="8" fill="#fff" />
            <text x={point.x} y={point.y - 38} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="900">{String.fromCharCode(65 + index)}</text>
            {revealed && (
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" fill={color} fontSize="14" fontWeight="900">
                {isReflex ? '>180°' : '<180°'}
              </text>
            )}
          </g>
        );
      })}

      {alarmActive && profile.reflexIndex !== null && (
        <g transform={`translate(${profile.points[profile.reflexIndex].x + 52} ${profile.points[profile.reflexIndex].y - 44})`}>
          <rect width="132" height="58" rx="18" fill="rgba(127,29,29,0.72)" stroke="#FB7185" strokeWidth="2" />
          <text x="66" y="24" textAnchor="middle" fill="#FFE4E6" fontSize="12" fontWeight="900">İÇERİ GÖÇÜK</text>
          <text x="66" y="43" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="900">KONKAV</text>
        </g>
      )}
    </g>
  );
}

function getAngleLabelPoint(point: { x: number; y: number }, profile: PolygonProfile) {
  const center = profile.points.reduce(
    (acc, current) => ({ x: acc.x + current.x / profile.points.length, y: acc.y + current.y / profile.points.length }),
    { x: 0, y: 0 },
  );
  const dx = center.x - point.x;
  const dy = center.y - point.y;
  const length = Math.max(1, Math.hypot(dx, dy));

  return {
    x: point.x + (dx / length) * 44,
    y: point.y + (dy / length) * 44 + 5,
  };
}

function FactPanel({ profile, scan, alarmActive }: { profile: PolygonProfile; scan: number; alarmActive: boolean }) {
  const color = profile.kind === 'convex' ? '#22D3EE' : '#FB7185';
  return (
    <g transform="translate(612 92)">
      <rect width="188" height="174" rx="24" fill="rgba(0,0,0,0.38)" stroke="rgba(255,255,255,0.12)" />
      <text x="20" y="30" fill="rgba(255,255,255,0.52)" fontSize="11" fontWeight="900">LAZER RAPORU</text>
      {profile.facts.map((fact, index) => (
        <g key={fact} opacity={scan > index * 0.22 + 0.14 ? 1 : 0.28}>
          <circle cx="24" cy={60 + index * 32} r="5" fill={color} />
          <text x="40" y={65 + index * 32} fill="#fff" fontSize="13" fontWeight="900">{fact}</text>
        </g>
      ))}
      <rect x="20" y="146" width="148" height="16" rx="8" fill={alarmActive ? 'rgba(251,113,133,0.8)' : 'rgba(34,211,238,0.46)'} />
    </g>
  );
}

function LockPad({ kind, x, selected, correct, onSelectKind }: { kind: PolygonKind; x: number; selected: boolean; correct: boolean; onSelectKind: (kind: PolygonKind) => void }) {
  const color = correct ? '#6EE7B7' : selected ? '#22D3EE' : 'rgba(255,255,255,0.36)';

  return (
    <g
      data-testid={lockTestIds[kind]}
      role="button"
      tabIndex={0}
      focusable="true"
      onClick={() => onSelectKind(kind)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectKind(kind);
        }
      }}
      transform={`translate(${x} 0)`}
      style={{ cursor: 'pointer' }}
    >
      <rect width="126" height="58" rx="18" fill={selected ? 'rgba(34,211,238,0.16)' : 'rgba(255,255,255,0.055)'} stroke={color} strokeWidth={selected || correct ? 3 : 1.5} />
      <text x="63" y="36" textAnchor="middle" fill={selected || correct ? '#fff' : 'rgba(255,255,255,0.68)'} fontSize="14" fontWeight="900">{kindLabels[kind]}</text>
    </g>
  );
}

function ProbeHandle({ x, y, color, label, value, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  color: string;
  label: string;
  value: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="concave-convex-angle-probe"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="açı probu"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${label}. Ok tuşlarıyla kaydır, Home ile taramayı tamamla.`}</title>
      <circle cx={x} cy={y} r="31" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#concave-convex-glow)" />
      <circle cx={x} cy={y} r="15" fill="#06111d" stroke={color} strokeWidth="5" />
      <text x={x} y={y + 48} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}

function RailLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x} y={y} fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="900">{label}</text>
  );
}
