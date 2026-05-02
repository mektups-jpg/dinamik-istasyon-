import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { ParabolaParams, ParabolaPointerHandler, ParabolaTarget } from './types';
import { createParabolaPoints, deltaLabel, formulaLabel, getVertexPoint, getWidthPoint } from './parabolaModel';

interface ParabolaSceneProps {
  params: ParabolaParams;
  target: ParabolaTarget;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: ParabolaPointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
}

export function ParabolaScene({
  params,
  target,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: ParabolaSceneProps) {
  const actualCurve = createParabolaPoints(params);
  const targetCurve = createParabolaPoints(target.params);
  const vertex = getVertexPoint(params);
  const width = getWidthPoint(params);
  const targetVertex = getVertexPoint(target.params);
  const targetWidth = getWidthPoint(target.params);

  return (
    <section
      data-testid="parabola-scene"
      className="relative overflow-hidden rounded-[32px] border border-sky-200/20 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_22%,rgba(125,211,252,0.18),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.10),transparent_40%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/58">makro atom: MAT.10.2.2.x</p>
          <h2 className="text-2xl font-black text-white">Parabol Kasesini Elle Şekillendir</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-sky-300/25 bg-sky-300/10 text-sky-100'}`}>
          {missionOk ? 'Hologram çakıştı' : deltaLabel(params, target.params)}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="parabola-svg"
        viewBox="0 0 720 520"
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#050814]/82 sm:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="parabola-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <filter id="parabola-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="parabola-line" x1="0" x2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#F9A8D4" />
          </linearGradient>
        </defs>

        <rect width="720" height="520" fill="url(#parabola-grid)" />
        <g opacity="0.88">
          <line x1="48" y1="390" x2="680" y2="390" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
          <line x1="360" y1="48" x2="360" y2="462" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
          <text x="666" y="414" fill="rgba(255,255,255,0.55)" fontSize="14" fontWeight="900">x</text>
          <text x="376" y="66" fill="rgba(255,255,255,0.55)" fontSize="14" fontWeight="900">y</text>
        </g>

        <polyline points={targetCurve} fill="none" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 13" opacity="0.62" />
        <TargetRing point={targetVertex} label="tepe hedefi" />
        <TargetRing point={targetWidth} small label="a hedefi" />

        <line x1={vertex.x} y1={vertex.y} x2={width.x} y2={width.y} stroke="rgba(255,255,255,0.28)" strokeWidth="7" strokeLinecap="round" />
        <motion.polyline
          points={actualCurve}
          fill="none"
          stroke="url(#parabola-line)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#parabola-glow)"
          animate={{ opacity: missionOk ? [0.9, 1, 0.9] : [0.66, 0.96, 0.66] }}
          transition={{ duration: missionOk ? 0.75 : 1.5, repeat: Infinity }}
        />

        <DragHandle
          testId="parabola-vertex-handle"
          label="tepe"
          point={vertex}
          color="#7DD3FC"
          onPointerDown={(event) => onPointerDown(event, 'vertex')}
        />
        <DragHandle
          testId="parabola-width-handle"
          label="genişlik"
          point={width}
          color="#F472B6"
          onPointerDown={(event) => onPointerDown(event, 'width')}
        />

        <g className="pointer-events-none">
          <rect x="54" y="54" width="312" height="92" rx="24" fill="rgba(0,0,0,0.42)" stroke="rgba(255,255,255,0.12)" />
          <text x="76" y="88" fill="#BAE6FD" fontSize="15" fontWeight="900">Canlı parabol</text>
          <text x="76" y="118" fill="#FFFFFF" fontSize="20" fontWeight="900">{formulaLabel(params)}</text>
          <text x="360" y="474" textAnchor="middle" fill="#FDE68A" fontSize="18" fontWeight="900">Hedef hologram: {target.label}</text>
          <text x="360" y="500" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="800">Mavi tepeyi ve pembe açıklık kolunu sarı hedefe oturt</text>
        </g>
      </svg>
    </section>
  );
}

function TargetRing({ point, small = false, label }: { point: { x: number; y: number }; small?: boolean; label: string }) {
  return (
    <g className="pointer-events-none">
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={small ? 18 : 26}
        fill="rgba(251,191,36,0.08)"
        stroke="#FBBF24"
        strokeWidth="4"
        strokeDasharray="7 8"
        animate={{ opacity: [0.42, 0.92, 0.42] }}
        transition={{ duration: 1.35, repeat: Infinity }}
      />
      <text x={point.x} y={point.y - (small ? 24 : 34)} textAnchor="middle" fill="#FDE68A" fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}

function DragHandle({ testId, label, point, color, onPointerDown }: { testId: string; label: string; point: { x: number; y: number }; color: string; onPointerDown: (event: ReactPointerEvent<SVGElement>) => void }) {
  return (
    <g data-testid={testId} onPointerDown={onPointerDown} style={{ cursor: 'grab', touchAction: 'none' }}>
      <circle cx={point.x} cy={point.y} r="36" fill="transparent" />
      <circle cx={point.x} cy={point.y} r="24" fill={`${color}24`} stroke={color} strokeWidth="4" />
      <circle cx={point.x} cy={point.y} r="10" fill={color} stroke="#FFFFFF" strokeWidth="3" />
      <text x={point.x} y={point.y - 36} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900">{label}</text>
    </g>
  );
}
