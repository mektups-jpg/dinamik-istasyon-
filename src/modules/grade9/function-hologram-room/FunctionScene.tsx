import type { KeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { CalibrationTarget, FunctionParams, FunctionPointerHandler } from './types';
import { calibrationDeltaLabel, createLinePoints, formulaLabel, getAnchorPoint, getTiltPoint } from './functionModel';

interface FunctionSceneProps {
  params: FunctionParams;
  target: CalibrationTarget;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: FunctionPointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
  onHandleKeyDown: (event: KeyboardEvent<SVGElement>, target: 'anchor' | 'tilt') => void;
}

export function FunctionScene(props: FunctionSceneProps) {
  const { params, target, missionOk, svgRef, onPointerDown, onPointerMove, onPointerUp, onHandleKeyDown } = props;
  const actualLine = createLinePoints(params);
  const targetLine = createLinePoints(target.params);
  const anchor = getAnchorPoint(params);
  const tilt = getTiltPoint(params);
  const targetAnchor = getAnchorPoint(target.params);
  const targetTilt = getTiltPoint(target.params);

  return (
    <section data-testid="function-hologram-room-scene" className="relative overflow-hidden rounded-[32px] border border-cyan-300/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(0,229,255,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,229,255,0.14),transparent_52%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">MEB · MAT.9.2.1.1-4</p>
          <h2 className="text-2xl font-black text-white">{target.sceneTitle}</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 text-right text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">{missionOk ? 'hedefle eşleşti' : 'kalan fark'}</p>
          <p className="mt-0.5 font-mono">{missionOk ? target.focus : calibrationDeltaLabel(params, target.params)}</p>
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
          <pattern id="function-v4-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.075)" strokeWidth="1" />
          </pattern>
          <filter id="function-v4-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="function-v4-line" x1="0" x2="1">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="55%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#B388FF" />
          </linearGradient>
        </defs>
        <rect width="720" height="500" fill="url(#function-v4-grid)" />
        <g opacity="0.9">
          <line x1="40" y1="260" x2="680" y2="260" stroke="rgba(255,255,255,0.32)" strokeWidth="2" />
          <line x1="360" y1="40" x2="360" y2="455" stroke="rgba(255,255,255,0.32)" strokeWidth="2" />
          <text x="666" y="282" fill="rgba(255,255,255,0.52)" fontSize="14" fontWeight="900">x</text>
          <text x="376" y="58" fill="rgba(255,255,255,0.52)" fontSize="14" fontWeight="900">y</text>
        </g>

        <polyline points={targetLine} fill="none" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 13" opacity="0.62" />
        <TargetHandle point={targetAnchor} />
        <TargetHandle point={targetTilt} small />

        <line x1={anchor.x} y1={anchor.y} x2={tilt.x} y2={tilt.y} stroke="rgba(255,255,255,0.26)" strokeWidth="7" strokeLinecap="round" />
        <motion.polyline
          points={actualLine}
          fill="none"
          stroke="url(#function-v4-line)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#function-v4-glow)"
          animate={{ opacity: missionOk ? [0.9, 1, 0.9] : [0.62, 0.92, 0.62] }}
          transition={{ duration: missionOk ? 0.75 : 1.4, repeat: Infinity }}
        />

        <DragHandle testId="function-anchor-handle" label="mavi nokta" point={anchor} color="#00E5FF" onPointerDown={(event) => onPointerDown(event, 'anchor')} onKeyDown={(event) => onHandleKeyDown(event, 'anchor')} />
        <DragHandle testId="function-tilt-handle" label="eğim noktası" point={tilt} color="#00FF88" onPointerDown={(event) => onPointerDown(event, 'tilt')} onKeyDown={(event) => onHandleKeyDown(event, 'tilt')} />

        <g className="pointer-events-none">
          <rect x="54" y="54" width="280" height="88" rx="22" fill="rgba(0,0,0,0.42)" stroke="rgba(255,255,255,0.10)" />
          <text x="76" y="88" fill="#A5F3FC" fontSize="15" fontWeight="900">Senin doğrun</text>
          <text x="76" y="116" fill="#FFFFFF" fontSize="20" fontWeight="900">{formulaLabel(params)}</text>
          <text x="360" y="438" textAnchor="middle" fill="#FDE68A" fontSize="18" fontWeight="900">Hedef doğru: {target.label}</text>
          <text x="360" y="464" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="800">Senin doğrunu sarı kesik hedefin üstüne taşı</text>
        </g>
      </svg>
    </section>
  );
}

function TargetHandle({ point, small = false }: { point: { x: number; y: number }; small?: boolean }) {
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
    </g>
  );
}

function DragHandle({
  testId,
  label,
  point,
  color,
  onPointerDown,
  onKeyDown,
}: {
  testId: string;
  label: string;
  point: { x: number; y: number };
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: KeyboardEvent<SVGElement>) => void;
}) {
  return (
    <g
      data-testid={testId}
      tabIndex={0}
      role="slider"
      aria-label={label}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none', outline: 'none' }}
    >
      <circle cx={point.x} cy={point.y} r="34" fill="transparent" />
      <circle cx={point.x} cy={point.y} r="23" fill={`${color}24`} stroke={color} strokeWidth="4" />
      <circle cx={point.x} cy={point.y} r="10" fill={color} stroke="#FFFFFF" strokeWidth="3" />
      <text x={point.x} y={point.y - 36} textAnchor="middle" fill="#FFFFFF" stroke="#020611" strokeWidth="4" paintOrder="stroke" fontSize="14" fontWeight="900">{label}</text>
    </g>
  );
}
