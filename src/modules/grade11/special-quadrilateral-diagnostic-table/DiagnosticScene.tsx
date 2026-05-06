import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import {
  diagnosticFrame,
  edgeMidpoint,
  polygonPoints,
  progressToRailX,
  shapeLabels,
  shapeProfiles,
} from './diagnosticModel';
import { DiagnosticDragTarget, DiagnosticMeasure, DiagnosticState, DiagnosticTarget, ShapeProfile, SpecialQuadKind } from './types';

interface DiagnosticSceneProps {
  state: DiagnosticState;
  target: DiagnosticTarget;
  measure: DiagnosticMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: DiagnosticDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: DiagnosticDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
  onSelectKind: (kind: SpecialQuadKind) => void;
}

const lockKinds: SpecialQuadKind[] = ['square', 'rectangle', 'rhombus', 'trapezoid'];

const lockTestIds: Record<SpecialQuadKind, string> = {
  square: 'special-quad-lock-square',
  rectangle: 'special-quad-lock-rectangle',
  rhombus: 'special-quad-lock-rhombus',
  trapezoid: 'special-quad-lock-trapezoid',
};

export function DiagnosticScene({
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
}: DiagnosticSceneProps) {
  const profile = shapeProfiles[target.specimen];
  const isSideMission = target.kind === 'sides';
  const activeScan = measure.scanProgress;
  const scannerX = progressToRailX(activeScan);
  const scannerTestId = isSideMission ? 'special-quad-side-scanner' : 'special-quad-diagonal-scanner';
  const scannerLabel = isSideMission ? 'kenar tarayıcı' : 'köşegen tarayıcı';

  return (
    <section
      data-testid="special-quadrilateral-diagnostic-scene"
      className="relative overflow-hidden rounded-[32px] border border-sky-100/16 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(56,189,248,0.15),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(167,139,250,0.13),transparent_31%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/58">makro atom: MAT.11.2.2</p>
          <h2 className="text-2xl font-black text-white">Özel Dörtgen Tanı Masası</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-sky-300/25 bg-sky-300/10 text-sky-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="special-quad-table-screen"
        viewBox={`0 0 ${diagnosticFrame.width} ${diagnosticFrame.height}`}
        className="relative h-[400px] w-full touch-none rounded-[28px] border border-white/12 bg-[#041018]/88 sm:h-[450px] xl:h-[560px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="special-quad-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
          <filter id="special-quad-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={diagnosticFrame.width} height={diagnosticFrame.height} fill="url(#special-quad-grid)" />
        <rect x="70" y="58" width="760" height="388" rx="34" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.13)" />

        <ShapeDiagnosticLayer profile={profile} scan={activeScan} isSideMission={isSideMission} />

        <g transform="translate(92 82)">
          <rect width="190" height="122" rx="24" fill="rgba(0,0,0,0.34)" stroke="rgba(255,255,255,0.12)" />
          <text x="20" y="32" fill="rgba(255,255,255,0.52)" fontSize="11" fontWeight="900">NUMUNE</text>
          <text x="20" y="66" fill="#E0F2FE" fontSize="25" fontWeight="900">{profile.label}</text>
          <text x="20" y="97" fill={isSideMission ? '#38BDF8' : '#C4B5FD'} fontSize="13" fontWeight="900">{scannerLabel}</text>
        </g>

        <FactPanel
          x={610}
          y={92}
          title={isSideMission ? 'kenar izi' : 'köşegen izi'}
          facts={isSideMission ? profile.sideFacts : profile.diagonalFacts}
          scan={activeScan}
          color={isSideMission ? '#38BDF8' : '#C4B5FD'}
        />

        <g data-testid="special-quad-classification-lock" transform="translate(118 382)">
          {lockKinds.map((kind, index) => (
            <LockPad
              key={kind}
              kind={kind}
              x={index * 166}
              selected={state.selectedKind === kind}
              correct={target.correctKind === kind && missionOk}
              onSelectKind={onSelectKind}
            />
          ))}
        </g>

        <RailLabel x={diagnosticFrame.railX} y={diagnosticFrame.railY - 26} label={scannerLabel} />
        <line x1={diagnosticFrame.railX} y1={diagnosticFrame.railY} x2={diagnosticFrame.railX + diagnosticFrame.railWidth} y2={diagnosticFrame.railY} stroke="rgba(255,255,255,0.2)" strokeWidth="15" strokeLinecap="round" />
        <line x1={diagnosticFrame.railX} y1={diagnosticFrame.railY} x2={scannerX} y2={diagnosticFrame.railY} stroke={isSideMission ? 'rgba(56,189,248,0.65)' : 'rgba(196,181,253,0.65)'} strokeWidth="8" strokeLinecap="round" />
        <ScannerHandle
          testId={scannerTestId}
          x={scannerX}
          y={diagnosticFrame.railY}
          color={isSideMission ? '#38BDF8' : '#C4B5FD'}
          label={`${Math.round(activeScan * 100)}%`}
          ariaLabel={scannerLabel}
          value={Math.round(activeScan * 100)}
          onPointerDown={(event) => onPointerDown(isSideMission ? 'side-scanner' : 'diagonal-scanner', event)}
          onKeyDown={(event) => onKeyDown(isSideMission ? 'side-scanner' : 'diagonal-scanner', event)}
        />
      </svg>
    </section>
  );
}

function ShapeDiagnosticLayer({ profile, scan, isSideMission }: { profile: ShapeProfile; scan: number; isSideMission: boolean }) {
  const [a, b, c, d] = profile.points;
  const center = { x: 450, y: 280 };
  const diagonalOpacity = isSideMission ? 0.18 : 0.24 + scan * 0.74;
  const sideOpacity = isSideMission ? 0.32 + scan * 0.65 : 0.3;

  return (
    <g>
      <motion.polygon
        points={polygonPoints(profile.points)}
        fill={isSideMission ? 'rgba(56,189,248,0.14)' : 'rgba(196,181,253,0.14)'}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        animate={{ opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      {profile.points.map((point, index) => {
        const next = profile.points[(index + 1) % profile.points.length];
        const mid = edgeMidpoint(profile.points, index);
        return (
          <g key={`${profile.kind}-edge-${index}`} opacity={sideOpacity}>
            <line x1={point.x} y1={point.y} x2={next.x} y2={next.y} stroke="#38BDF8" strokeWidth="7" strokeLinecap="round" filter="url(#special-quad-glow)" />
            {isSideMission && scan > index * 0.19 + 0.18 && <text x={mid.x} y={mid.y - 10} textAnchor="middle" fill="#BAE6FD" fontSize="13" fontWeight="900">eşit</text>}
          </g>
        );
      })}
      <g opacity={diagonalOpacity}>
        <line x1={a.x} y1={a.y} x2={c.x} y2={c.y} stroke="#C4B5FD" strokeWidth="6" strokeLinecap="round" strokeDasharray="16 10" filter="url(#special-quad-glow)" />
        <line x1={b.x} y1={b.y} x2={d.x} y2={d.y} stroke="#C4B5FD" strokeWidth="6" strokeLinecap="round" strokeDasharray="16 10" filter="url(#special-quad-glow)" />
        {!isSideMission && scan > 0.72 && (
          <>
            <circle cx={center.x} cy={center.y} r="26" fill="rgba(196,181,253,0.18)" stroke="#C4B5FD" strokeWidth="4" />
            <text x={center.x} y={center.y + 50} textAnchor="middle" fill="#EDE9FE" fontSize="14" fontWeight="900">orta nokta</text>
          </>
        )}
      </g>
      {profile.points.map((point, index) => (
        <g key={`${profile.kind}-point-${index}`}>
          <circle cx={point.x} cy={point.y} r="10" fill="#fff" />
          <text x={point.x} y={point.y - 18} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="900">{String.fromCharCode(65 + index)}</text>
        </g>
      ))}
    </g>
  );
}

function FactPanel({ x, y, title, facts, scan, color }: { x: number; y: number; title: string; facts: string[]; scan: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="188" height="150" rx="24" fill="rgba(0,0,0,0.38)" stroke="rgba(255,255,255,0.12)" />
      <text x="20" y="30" fill="rgba(255,255,255,0.52)" fontSize="11" fontWeight="900">{title.toUpperCase()}</text>
      {facts.map((fact, index) => (
        <g key={fact} opacity={scan > index * 0.24 + 0.16 ? 1 : 0.28}>
          <circle cx="24" cy={58 + index * 32} r="5" fill={color} />
          <text x="40" y={63 + index * 32} fill="#fff" fontSize="13" fontWeight="900">{fact}</text>
        </g>
      ))}
    </g>
  );
}

function LockPad({ kind, x, selected, correct, onSelectKind }: { kind: SpecialQuadKind; x: number; selected: boolean; correct: boolean; onSelectKind: (kind: SpecialQuadKind) => void }) {
  const color = correct ? '#6EE7B7' : selected ? '#38BDF8' : 'rgba(255,255,255,0.34)';

  return (
    <g
      data-testid={lockTestIds[kind]}
      role="button"
      tabIndex={0}
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
      <rect width="150" height="58" rx="18" fill={selected ? 'rgba(56,189,248,0.16)' : 'rgba(255,255,255,0.055)'} stroke={color} strokeWidth={selected || correct ? 3 : 1.5} />
      <text x="75" y="36" textAnchor="middle" fill={selected || correct ? '#fff' : 'rgba(255,255,255,0.66)'} fontSize="13" fontWeight="900">{shapeLabels[kind]}</text>
    </g>
  );
}

function ScannerHandle({ testId, x, y, color, label, ariaLabel, value, onPointerDown, onKeyDown }: {
  testId: string;
  x: number;
  y: number;
  color: string;
  label: string;
  ariaLabel: string;
  value: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid={testId}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${label}. Ok tuşlarıyla kaydır, Home ile taramayı tamamla.`}</title>
      <circle cx={x} cy={y} r="31" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#special-quad-glow)" />
      <circle cx={x} cy={y} r="15" fill="#06111d" stroke={color} strokeWidth="5" />
      <text x={x} y={y + 48} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}

function RailLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <text x={x} y={y} fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}
