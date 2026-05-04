import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { RootHunterMeasure, RootHunterState, RootHunterTarget, RootMarkerId } from './types';
import {
  createRootGraphSegments,
  formatValue,
  isMarkerNearRoot,
  rootFrame,
  trigValue,
  xFromAngle,
  yFromValue,
} from './rootHunterModel';

const markerTestIds: Record<RootMarkerId, string> = {
  a: 'root-marker-a',
  b: 'root-marker-b',
};

interface RootHunterSceneProps {
  state: RootHunterState;
  target: RootHunterTarget;
  measure: RootHunterMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onMarkerPointerDown: (marker: RootMarkerId, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onMarkerKeyDown: (marker: RootMarkerId, event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function RootHunterScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onMarkerPointerDown,
  onPointerMove,
  onPointerUp,
  onMarkerKeyDown,
}: RootHunterSceneProps) {
  const graphColor = target.channel === 'sin' ? '#22D3EE' : target.channel === 'cos' ? '#34D399' : target.channel === 'tan' ? '#F472B6' : '#A78BFA';
  const targetY = yFromValue(target.targetValue);
  const graphSegments = createRootGraphSegments(target.channel);

  return (
    <section
      data-testid="trigonometric-root-scene"
      className="relative mx-auto min-w-0 max-w-full overflow-hidden rounded-[32px] border border-cyan-100/15 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
      style={{ width: 'min(100%, calc(100vw - 4rem))' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(167,139,250,0.15),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.1.2</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Trigonometrik Kök Avcısı</h2>
        </div>
        <div className={`w-full max-w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="root-wave-screen"
        viewBox={`0 0 ${rootFrame.width} ${rootFrame.height}`}
        className="relative block h-[230px] w-full max-w-full touch-none rounded-[28px] border border-white/12 bg-[#040915]/90 sm:h-[430px] xl:h-[500px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="root-grid" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="1" />
          </pattern>
          <filter id="root-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={rootFrame.width} height={rootFrame.height} fill="url(#root-grid)" />
        <rect x={rootFrame.plotX} y={rootFrame.plotY} width={rootFrame.plotWidth} height={rootFrame.plotHeight} rx="30" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.12)" />
        <line x1={rootFrame.plotX} y1={rootFrame.axisY} x2={rootFrame.plotX + rootFrame.plotWidth} y2={rootFrame.axisY} stroke="rgba(255,255,255,0.24)" strokeWidth="2" />

        {[0, 90, 180, 270, 360].map((angle) => (
          <g key={angle} pointerEvents="none">
            <line x1={xFromAngle(angle)} y1={rootFrame.plotY + 14} x2={xFromAngle(angle)} y2={rootFrame.plotY + rootFrame.plotHeight - 14} stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
            <text x={xFromAngle(angle)} y={rootFrame.plotY + rootFrame.plotHeight + 32} textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="13" fontWeight="900">{angle}°</text>
          </g>
        ))}

        {[1, 0, -1].map((value) => (
          <g key={value} pointerEvents="none">
            <line x1={rootFrame.plotX - 8} y1={yFromValue(value)} x2={rootFrame.plotX + rootFrame.plotWidth} y2={yFromValue(value)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x={rootFrame.plotX - 15} y={yFromValue(value) + 4} textAnchor="end" fill="rgba(255,255,255,0.58)" fontSize="12" fontWeight="900">{value}</text>
          </g>
        ))}

        {target.forbiddenAngles.map((angle) => (
          <ForbiddenWall key={`${target.id}-${angle}`} angle={angle} />
        ))}

        <rect
          x={rootFrame.plotX + 8}
          y={targetY - 9}
          width={rootFrame.plotWidth - 16}
          height="18"
          rx="9"
          fill="rgba(253,224,71,0.13)"
          pointerEvents="none"
        />
        <line
          data-testid="root-target-line"
          x1={rootFrame.plotX + 8}
          y1={targetY}
          x2={rootFrame.plotX + rootFrame.plotWidth - 8}
          y2={targetY}
          stroke="#FDE047"
          strokeWidth="8"
          strokeDasharray="18 8"
          opacity="1"
          filter="url(#root-glow)"
        />
        <text className="hidden sm:block" x={rootFrame.plotX + rootFrame.plotWidth - 18} y={targetY - 14} textAnchor="end" fill="#FDE68A" fontSize="14" fontWeight="900">hedef: {formatValue(target.targetValue)}</text>

        {graphSegments.map((segment, index) => (
          <polyline key={`${target.channel}-${index}`} points={segment.join(' ')} fill="none" stroke={graphColor} strokeWidth="7" opacity="0.9" filter="url(#root-glow)" pointerEvents="none" />
        ))}

        {target.roots.map((rootAngle) => (
          <RootHalo key={`${target.id}-${rootAngle}`} angle={rootAngle} targetY={targetY} active={isRootCurrentlyMarked(rootAngle, state)} />
        ))}

        {(['a', 'b'] as RootMarkerId[]).map((marker) => (
          <RootMarker
            key={marker}
            marker={marker}
            angle={state.markers[marker]}
            value={measure.markerValues[marker]}
            target={target}
            targetY={targetY}
            matched={isMarkerNearRoot(state.markers[marker], target.roots)}
            onPointerDown={(event) => onMarkerPointerDown(marker, event)}
            onKeyDown={(event) => onMarkerKeyDown(marker, event)}
          />
        ))}

        <HudTag className="hidden lg:block" x={144} y={106} label={target.equation} fill={graphColor} />
        <HudTag className="hidden lg:block" x={144} y={148} label={`${measure.lockedCount}/2 kök kilitli`} fill={missionOk ? '#34D399' : '#FBBF24'} />
        <HudTag className="hidden lg:block" x={144} y={190} label="kök = kesişim açısı" fill="#22D3EE" />
      </svg>

      <div className="relative mt-3 rounded-2xl border border-cyan-100/10 bg-black/24 p-3 sm:hidden">
        <div className="grid gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-white/62">
          <span>x: açı (derece)</span>
          <span>y: {target.channel}(x)</span>
          <span className="min-w-0 text-amber-200">hedef ışın: {formatValue(target.targetValue)}</span>
        </div>
      </div>
    </section>
  );
}

function isRootCurrentlyMarked(rootAngle: number, state: RootHunterState) {
  return Object.values(state.markers).some((angle) => Math.abs(angle - rootAngle) <= 7);
}

function ForbiddenWall({ angle }: { angle: number }) {
  const x = xFromAngle(angle);

  return (
    <g pointerEvents="none">
      <line x1={x} y1={rootFrame.plotY + 14} x2={x} y2={rootFrame.plotY + rootFrame.plotHeight - 14} stroke="#FB7185" strokeWidth="3" strokeDasharray="9 8" opacity="0.44" />
      <rect className="hidden sm:block" x={x - 34} y={rootFrame.plotY + 20} width="68" height="34" rx="14" fill="rgba(0,0,0,0.48)" stroke="#FB7185" opacity="0.82" />
      <text className="hidden sm:block" x={x} y={rootFrame.plotY + 42} textAnchor="middle" fill="#FECACA" fontSize="12" fontWeight="900">duvar</text>
    </g>
  );
}

function RootHalo({ angle, targetY, active }: { angle: number; targetY: number; active: boolean }) {
  const x = xFromAngle(angle);

  return (
    <g pointerEvents="none">
      <motion.circle
        cx={x}
        cy={targetY}
        r={active ? 26 : 18}
        fill={active ? 'rgba(52,211,153,0.18)' : 'rgba(251,191,36,0.08)'}
        stroke={active ? '#34D399' : '#FBBF24'}
        strokeWidth="3"
        opacity={active ? 0.92 : 0.45}
        filter="url(#root-glow)"
        animate={{ scale: active ? [1, 1.08, 1] : 1 }}
        transition={{ duration: 0.9, repeat: active ? Infinity : 0 }}
      />
      {active && (
        <text className="hidden sm:block" x={x} y={targetY - 35} textAnchor="middle" fill="#D1FAE5" fontSize="14" fontWeight="900">{angle}°</text>
      )}
    </g>
  );
}

function RootMarker({ marker, angle, value, target, targetY, matched, onPointerDown, onKeyDown }: {
  marker: RootMarkerId;
  angle: number;
  value: number | null;
  target: RootHunterTarget;
  targetY: number;
  matched: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const x = xFromAngle(angle);
  const valueY = value === null ? rootFrame.axisY : yFromValue(value);
  const stroke = matched ? '#34D399' : marker === 'a' ? '#22D3EE' : '#A78BFA';

  return (
    <g
      data-testid={markerTestIds[marker]}
      role="slider"
      tabIndex={0}
      aria-label={`${marker.toUpperCase()} kök işaretçisi`}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(angle)}
      aria-valuetext={`${marker.toUpperCase()} işaretçisi ${Math.round(angle)} derece konumunda`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${marker.toUpperCase()} kök işaretçisi. Sürükle veya Home ile ${target.roots[marker === 'a' ? 0 : 1]} derece köküne hizala.`}</title>
      <line x1={x} y1={valueY} x2={x} y2={targetY} stroke={stroke} strokeWidth="4" strokeDasharray="7 7" opacity="0.72" />
      <circle cx={x} cy={valueY} r="11" fill="#fff" stroke={stroke} strokeWidth="3" />
      <motion.circle cx={x} cy={targetY} r="31" fill={`${stroke}22`} stroke={stroke} strokeWidth="5" filter="url(#root-glow)" animate={{ scale: matched ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.8, repeat: matched ? Infinity : 0 }} />
      <circle cx={x} cy={targetY} r="13" fill="#06111d" stroke={stroke} strokeWidth="5" />
      <rect className="hidden sm:block" x={x - 48} y={targetY + 30} width="96" height="34" rx="14" fill="rgba(0,0,0,0.55)" stroke={stroke} strokeWidth="1.5" />
      <text className="hidden sm:block" x={x} y={targetY + 52} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">{marker.toUpperCase()} {Math.round(angle)}°</text>
    </g>
  );
}

function HudTag({ x, y, label, fill, className = '' }: { x: number; y: number; label: string; fill: string; className?: string }) {
  return (
    <g className={className} pointerEvents="none">
      <rect x={x - 84} y={y - 18} width="168" height="36" rx="14" fill="rgba(0,0,0,0.48)" stroke={fill} strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}
