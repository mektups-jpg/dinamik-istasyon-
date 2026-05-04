import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { QuadDragTarget, QuadMeasure, QuadrilateralState, QuadTarget } from './types';
import {
  formatAreaSumWithUnit,
  formatAreaWithUnit,
  pointOnDiagonal,
  polygonPoints,
  progressToRailX,
  quadFrame,
  quadPoints,
  translatedPolygonPoints,
} from './quadrilateralModel';

interface QuadrilateralSceneProps {
  state: QuadrilateralState;
  target: QuadTarget;
  measure: QuadMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: QuadDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: QuadDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
}

const triangleOne = [quadPoints.A, quadPoints.B, quadPoints.C];
const triangleTwo = [quadPoints.A, quadPoints.C, quadPoints.D];
const fullQuadrilateral = [quadPoints.A, quadPoints.B, quadPoints.C, quadPoints.D];

export function QuadrilateralScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: QuadrilateralSceneProps) {
  const bladeX = progressToRailX(state.cutProgress, quadFrame.bladeRailX, quadFrame.bladeRailWidth);
  const areaX = progressToRailX(state.mergeProgress, quadFrame.areaRailX, quadFrame.areaRailWidth);
  const bladePoint = pointOnDiagonal(state.cutProgress);
  const splitGap = 34 * state.cutProgress;
  const mergeGlow = state.mergeProgress;
  const showAreaLayer = target.kind === 'area' || state.mergeProgress > 0.05;
  const isAreaMission = target.kind === 'area';

  return (
    <section
      data-testid="quadrilateral-decomposition-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-100/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_80%_28%,rgba(251,191,36,0.13),transparent_31%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.2.1</p>
          <h2 className="text-2xl font-black text-white">Dörtgen Ayrıştırma Masası</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="quadrilateral-table-screen"
        viewBox={`0 0 ${quadFrame.width} ${quadFrame.height}`}
        className="relative h-[400px] w-full touch-none rounded-[28px] border border-white/12 bg-[#041018]/88 sm:h-[450px] xl:h-[560px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="quad-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="1" />
          </pattern>
          <filter id="quad-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={quadFrame.width} height={quadFrame.height} fill="url(#quad-grid)" />
        <rect x="74" y="58" width="752" height="370" rx="34" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.13)" />

        <polygon points={polygonPoints(fullQuadrilateral)} fill="rgba(34,211,238,0.09)" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
        <motion.polygon
          points={translatedPolygonPoints(triangleOne, splitGap, -splitGap * 0.58)}
          fill="rgba(34,211,238,0.32)"
          stroke="#22D3EE"
          strokeWidth="4"
          filter="url(#quad-glow)"
          animate={{ opacity: state.cutProgress > 0.9 ? [0.82, 1, 0.82] : 0.58 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <motion.polygon
          points={translatedPolygonPoints(triangleTwo, -splitGap, splitGap * 0.58)}
          fill="rgba(167,139,250,0.32)"
          stroke="#A78BFA"
          strokeWidth="4"
          filter="url(#quad-glow)"
          animate={{ opacity: state.cutProgress > 0.9 ? [0.82, 1, 0.82] : 0.58 }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
        />

        <line x1={quadPoints.A.x} y1={quadPoints.A.y} x2={quadPoints.C.x} y2={quadPoints.C.y} stroke="rgba(251,191,36,0.25)" strokeWidth="10" strokeLinecap="round" />
        <motion.line
          x1={quadPoints.A.x}
          y1={quadPoints.A.y}
          x2={bladePoint.x}
          y2={bladePoint.y}
          stroke="#FBBF24"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="14 9"
          filter="url(#quad-glow)"
          animate={{ opacity: [0.74, 1, 0.74] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />

        <VertexLabel x={quadPoints.A.x} y={quadPoints.A.y} label="A" />
        <VertexLabel x={quadPoints.B.x} y={quadPoints.B.y} label="B" />
        <VertexLabel x={quadPoints.C.x} y={quadPoints.C.y} label="C" />
        <VertexLabel x={quadPoints.D.x} y={quadPoints.D.y} label="D" />

        {!isAreaMission && (
          <>
            <AngleBadge x="308" y="244" color="#22D3EE" label="Üçgen 1" value="180°" opacity={state.cutProgress} />
            <AngleBadge x="290" y="354" color="#A78BFA" label="Üçgen 2" value="180°" opacity={state.cutProgress} />
            <motion.g opacity={state.cutProgress > 0.92 ? 1 : 0.2}>
              <rect x="560" y="242" width="176" height="82" rx="22" fill="rgba(0,0,0,0.45)" stroke="rgba(251,191,36,0.32)" />
              <text x="648" y="276" textAnchor="middle" fill="#FBBF24" fontSize="24" fontWeight="900">360°</text>
              <text x="648" y="304" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="13" fontWeight="900">iç açı toplamı</text>
            </motion.g>
          </>
        )}

        {showAreaLayer && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AreaChip
              x={lerp(382, 510, mergeGlow)}
              y={lerp(206, 256, mergeGlow)}
              color="#22D3EE"
              label="T1"
              value={formatAreaWithUnit(measure.triangleOneArea)}
            />
            <AreaChip
              x={lerp(300, 510, mergeGlow)}
              y={lerp(346, 308, mergeGlow)}
              color="#A78BFA"
              label="T2"
              value={formatAreaWithUnit(measure.triangleTwoArea)}
            />
            <text x="624" y="318" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="22" fontWeight="900">=</text>
            <rect x="650" y="250" width="156" height="116" rx="26" fill={`rgba(16,185,129,${0.12 + mergeGlow * 0.24})`} stroke="rgba(110,231,183,0.46)" />
            <text x="728" y="286" textAnchor="middle" fill="#D1FAE5" fontSize="12" fontWeight="900">DÖRTGEN ALANI</text>
            <text x="728" y="324" textAnchor="middle" fill="#6EE7B7" fontSize="25" fontWeight="900">{formatAreaSumWithUnit(measure.triangleOneArea, measure.triangleTwoArea)}</text>
            <text x="728" y="350" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="900">T1 + T2</text>
          </motion.g>
        )}

        {target.kind === 'area' && (
          <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <RailLabel x={quadFrame.areaRailX} y={quadFrame.areaRailY - 24} label="alan birleştirici" opacity={1} />
            <line x1={quadFrame.areaRailX} y1={quadFrame.areaRailY} x2={quadFrame.areaRailX + quadFrame.areaRailWidth} y2={quadFrame.areaRailY} stroke="rgba(255,255,255,0.2)" strokeWidth="15" strokeLinecap="round" />
            <line x1={quadFrame.areaRailX} y1={quadFrame.areaRailY} x2={areaX} y2={quadFrame.areaRailY} stroke="rgba(110,231,183,0.58)" strokeWidth="8" strokeLinecap="round" />
            <SliderHandle
              testId="quadrilateral-area-handle"
              x={areaX}
              y={quadFrame.areaRailY}
              color="#6EE7B7"
              label={`${Math.round(state.mergeProgress * 100)}%`}
              ariaLabel="alan birleştirici sürgüsü"
              value={Math.round(state.mergeProgress * 100)}
              onPointerDown={(event) => onPointerDown('area', event)}
              onKeyDown={(event) => onKeyDown('area', event)}
            />
          </motion.g>
        )}

        {!isAreaMission && (
          <>
            <RailLabel x={quadFrame.bladeRailX} y={quadFrame.bladeRailY - 24} label="köşegen bıçağı" opacity={1} />
            <line x1={quadFrame.bladeRailX} y1={quadFrame.bladeRailY} x2={quadFrame.bladeRailX + quadFrame.bladeRailWidth} y2={quadFrame.bladeRailY} stroke="rgba(255,255,255,0.2)" strokeWidth="15" strokeLinecap="round" />
            <line x1={quadFrame.bladeRailX} y1={quadFrame.bladeRailY} x2={bladeX} y2={quadFrame.bladeRailY} stroke="rgba(251,191,36,0.58)" strokeWidth="8" strokeLinecap="round" />
            <SliderHandle
              testId="quadrilateral-blade-handle"
              x={bladeX}
              y={quadFrame.bladeRailY}
              color="#FBBF24"
              label={`${Math.round(state.cutProgress * 100)}%`}
              ariaLabel="köşegen bıçağı sürgüsü"
              value={Math.round(state.cutProgress * 100)}
              onPointerDown={(event) => onPointerDown('blade', event)}
              onKeyDown={(event) => onKeyDown('blade', event)}
            />
          </>
        )}
      </svg>
    </section>
  );
}

const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

function SliderHandle({ testId, x, y, color, label, ariaLabel, value, onPointerDown, onKeyDown }: {
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
      <title>{`${label}. Ok tuşlarıyla kaydır, Home ile göreve hizala.`}</title>
      <circle cx={x} cy={y} r="31" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#quad-glow)" />
      <circle cx={x} cy={y} r="15" fill="#06111d" stroke={color} strokeWidth="5" />
      <text x={x} y={y + 48} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}

function VertexLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill="#fff" />
      <text x={x} y={y - 18} textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900">{label}</text>
    </g>
  );
}

function AngleBadge({ x, y, color, label, value, opacity }: { x: string; y: string; color: string; label: string; value: string; opacity: number }) {
  return (
    <g opacity={0.2 + opacity * 0.8}>
      <rect x={x} y={y} width="126" height="66" rx="20" fill="rgba(0,0,0,0.45)" stroke={`${color}88`} />
      <text x={Number(x) + 63} y={Number(y) + 26} textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="12" fontWeight="900">{label}</text>
      <text x={Number(x) + 63} y={Number(y) + 52} textAnchor="middle" fill={color} fontSize="22" fontWeight="900">{value}</text>
    </g>
  );
}

function AreaChip({ x, y, color, label, value }: { x: number; y: number; color: string; label: string; value: string }) {
  return (
    <g>
      <rect x={x} y={y} width="124" height="48" rx="18" fill="rgba(0,0,0,0.45)" stroke={`${color}88`} />
      <text x={x + 30} y={y + 30} textAnchor="middle" fill={color} fontSize="15" fontWeight="900">{label}</text>
      <text x={x + 82} y={y + 30} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">{value}</text>
    </g>
  );
}

function RailLabel({ x, y, label, opacity }: { x: number; y: number; label: string; opacity: number }) {
  return <text x={x} y={y} fill="rgba(255,255,255,0.62)" opacity={opacity} fontSize="12" fontWeight="900" letterSpacing="2">{label.toUpperCase()}</text>;
}
