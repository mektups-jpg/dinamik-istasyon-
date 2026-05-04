import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { ScatterMissionTarget, ScatterPoint, ScatterMeasure } from './types';
import { dataToSvg, scatterFrame, targetForPoint, trendBeamEndpoints } from './correlationModel';

interface CorrelationSceneProps {
  points: ScatterPoint[];
  target: ScatterMissionTarget;
  measure: ScatterMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (pointId: string, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (pointId: string, event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function CorrelationScene({
  points,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: CorrelationSceneProps) {
  const beam = trendBeamEndpoints(points);
  const beamColor = measure.direction === 'negatif' ? '#F472B6' : measure.direction === 'pozitif' ? '#34D399' : '#67E8F9';
  const beamOpacity = 0.48 + measure.strength * 0.4;

  return (
    <section
      data-testid="correlation-scatter-scene"
      className="relative overflow-hidden rounded-[32px] border border-sky-100/16 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_76%_18%,rgba(52,211,153,0.12),transparent_30%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/58">makro atom: MAT.11.3.1</p>
          <h2 className="text-2xl font-black text-white">Korelasyon Serpilme Radarı</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-sky-300/25 bg-sky-300/10 text-sky-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="scatter-radar-screen"
        viewBox={`0 0 ${scatterFrame.width} ${scatterFrame.height}`}
        className="relative h-[400px] w-full touch-none rounded-[28px] border border-white/12 bg-[#041018]/88 sm:h-[450px] xl:h-[560px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="scatter-grid" width="62" height="39.2" patternUnits="userSpaceOnUse">
            <path d="M 62 0 L 0 0 0 39.2" fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="1" />
          </pattern>
          <filter id="scatter-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="trend-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor={beamColor} stopOpacity="0" />
            <stop offset="45%" stopColor={beamColor} stopOpacity="0.82" />
            <stop offset="100%" stopColor={beamColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={scatterFrame.width} height={scatterFrame.height} fill="rgba(2,6,23,0.34)" />
        <rect
          x={scatterFrame.plotX}
          y={scatterFrame.plotY}
          width={scatterFrame.plotWidth}
          height={scatterFrame.plotHeight}
          rx="30"
          fill="url(#scatter-grid)"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="2"
        />

        <AxisLabels />
        <TargetRings target={target} />

        <motion.line
          data-testid="trend-beam"
          x1={beam.start.x}
          y1={beam.start.y}
          x2={beam.end.x}
          y2={beam.end.y}
          stroke="url(#trend-gradient)"
          strokeWidth={30 + measure.strength * 14}
          strokeLinecap="round"
          opacity={beamOpacity}
          filter="url(#scatter-glow)"
          animate={{ opacity: [beamOpacity * 0.72, beamOpacity, beamOpacity * 0.72] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />

        {points.map((point) => {
          const svgPoint = dataToSvg(point);
          const targetPoint = dataToSvg(targetForPoint(target, point.id));
          const closeToTarget = Math.hypot(point.x - targetForPoint(target, point.id).x, point.y - targetForPoint(target, point.id).y) <= 0.45;
          return (
            <g key={point.id}>
              <line x1={svgPoint.x} y1={svgPoint.y} x2={targetPoint.x} y2={targetPoint.y} stroke="rgba(255,255,255,0.11)" strokeWidth="2" strokeDasharray="5 9" />
              <ScatterPointNode
                point={point}
                color={closeToTarget ? '#34D399' : '#67E8F9'}
                onPointerDown={onPointerDown}
                onKeyDown={onKeyDown}
              />
            </g>
          );
        })}

        <RadarReadout measure={measure} />
      </svg>
    </section>
  );
}

function AxisLabels() {
  return (
    <g>
      <line x1={scatterFrame.plotX} y1={scatterFrame.plotY + scatterFrame.plotHeight} x2={scatterFrame.plotX + scatterFrame.plotWidth + 28} y2={scatterFrame.plotY + scatterFrame.plotHeight} stroke="rgba(255,255,255,0.48)" strokeWidth="3" strokeLinecap="round" />
      <line x1={scatterFrame.plotX} y1={scatterFrame.plotY + scatterFrame.plotHeight} x2={scatterFrame.plotX} y2={scatterFrame.plotY - 26} stroke="rgba(255,255,255,0.48)" strokeWidth="3" strokeLinecap="round" />
      <text x={scatterFrame.plotX + scatterFrame.plotWidth + 42} y={scatterFrame.plotY + scatterFrame.plotHeight + 7} fill="#E0F2FE" fontSize="16" fontWeight="900">x değişkeni</text>
      <text x={scatterFrame.plotX - 50} y={scatterFrame.plotY - 36} fill="#E0F2FE" fontSize="16" fontWeight="900">y değişkeni</text>
      {[0, 2, 4, 6, 8, 10].map((tick) => {
        const x = dataToSvg({ x: tick, y: 0 }).x;
        const y = dataToSvg({ x: 0, y: tick }).y;
        return (
          <g key={tick}>
            <text x={x} y={scatterFrame.plotY + scatterFrame.plotHeight + 27} textAnchor="middle" fill="rgba(226,232,240,0.9)" fontSize="13" fontWeight="900">{tick}</text>
            <text x={scatterFrame.plotX - 17} y={y} textAnchor="end" dominantBaseline="middle" fill="rgba(226,232,240,0.9)" fontSize="13" fontWeight="900">{tick}</text>
          </g>
        );
      })}
    </g>
  );
}

function TargetRings({ target }: { target: ScatterMissionTarget }) {
  return (
    <g>
      {target.targetPoints.map((point) => {
        const svgPoint = dataToSvg(point);
        return (
          <motion.g key={point.id} opacity={target.kind === 'place' ? 0.95 : 0.68}>
            <circle cx={svgPoint.x} cy={svgPoint.y} r="24" fill="rgba(56,189,248,0.08)" stroke="rgba(125,211,252,0.4)" strokeWidth="2" strokeDasharray="6 7" />
            <circle cx={svgPoint.x} cy={svgPoint.y} r="6" fill="rgba(255,255,255,0.52)" />
          </motion.g>
        );
      })}
    </g>
  );
}

function ScatterPointNode({ point, color, onPointerDown, onKeyDown }: {
  point: ScatterPoint;
  color: string;
  onPointerDown: (pointId: string, event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (pointId: string, event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const svgPoint = dataToSvg(point);

  return (
    <g
      data-testid={`scatter-point-${point.id}`}
      role="slider"
      tabIndex={0}
      aria-label={`${point.label} veri noktası`}
      aria-valuetext={`${point.label}: x ${point.x.toFixed(1)}, y ${point.y.toFixed(1)}`}
      aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home"
      onPointerDown={(event) => onPointerDown(point.id, event)}
      onKeyDown={(event) => onKeyDown(point.id, event)}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${point.label} noktası. Ok tuşlarıyla taşı, Home ile göreve hizala.`}</title>
      <circle cx={svgPoint.x} cy={svgPoint.y} r="32" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#scatter-glow)" />
      <circle cx={svgPoint.x} cy={svgPoint.y} r="15" fill="#07111c" stroke={color} strokeWidth="5" />
      <text x={svgPoint.x} y={svgPoint.y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{point.label}</text>
      <rect x={svgPoint.x - 43} y={svgPoint.y + 32} width="86" height="24" rx="10" fill="rgba(2,6,23,0.78)" stroke="rgba(255,255,255,0.16)" />
      <text x={svgPoint.x} y={svgPoint.y + 50} textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14" fontWeight="900">{point.x.toFixed(1)}, {point.y.toFixed(1)}</text>
    </g>
  );
}

function RadarReadout({ measure }: { measure: ScatterMeasure }) {
  const color = measure.direction === 'negatif' ? '#F9A8D4' : measure.direction === 'pozitif' ? '#A7F3D0' : '#BAE6FD';
  return (
    <g>
      <rect x="742" y="108" width="112" height="96" rx="28" fill="rgba(0,0,0,0.42)" stroke="rgba(255,255,255,0.18)" />
      <text x="798" y="140" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="11" fontWeight="900">EĞİLİM</text>
      <text x="798" y="168" textAnchor="middle" fill={color} fontSize="16" fontWeight="900">{measure.direction.toUpperCase()}</text>
      <text x="798" y="190" textAnchor="middle" fill="rgba(255,255,255,0.64)" fontSize="12" fontWeight="900">m={measure.slope.toFixed(2)}</text>
    </g>
  );
}
