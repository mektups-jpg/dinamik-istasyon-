import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { DomainParams, DomainPointerHandler, DomainTarget } from './types';
import { createRationalBranch, createRootPoints, deltaLabel, formatValue, getXValue, graphToSvg } from './domainModel';

interface DomainGatesSceneProps {
  params: DomainParams;
  target: DomainTarget;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: DomainPointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
  onSnapTarget: () => void;
  onKeyboardStep: (target: DomainTarget['dragTarget'], delta: number) => void;
  onKeyboardSnap: (target: DomainTarget['dragTarget']) => void;
}

export function DomainGatesScene({
  params,
  target,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onSnapTarget,
  onKeyboardStep,
  onKeyboardSnap,
}: DomainGatesSceneProps) {
  const activeX = getXValue(params, target.dragTarget);
  const rootStart = graphToSvg({ x: params.rootStartX, y: 0 });
  const safeGate = graphToSvg({ x: params.safeGateX, y: 0 });
  const asymptote = graphToSvg({ x: params.asymptoteX, y: 0 });
  const forbidden = graphToSvg({ x: params.forbiddenX, y: 0 });
  const targetLine = graphToSvg({ x: target.targetX, y: 0 });
  const rootMode = target.dragTarget === 'rootStart' || target.dragTarget === 'safeGate';

  return (
    <section
      data-testid="domain-gates-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-200/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_20%,rgba(34,211,238,0.18),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.10),transparent_40%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.2.3.x / MAT.10.2.4.x</p>
          <h2 className="text-2xl font-black text-white">Tanım Kapısını Doğru Çizgiye Kilitle</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {missionOk ? 'Kapı kilitlendi' : deltaLabel(params, target)}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="domain-gates-svg"
        viewBox="0 0 720 520"
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#03101a]/82 sm:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="domain-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <filter id="domain-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="domain-root-line" x1="0" x2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
          <linearGradient id="domain-rational-line" x1="0" x2="1">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        <rect width="720" height="520" fill="url(#domain-grid)" />
        <ForbiddenZone x={rootMode ? safeGate.x : asymptote.x} mode={rootMode ? 'root' : 'rational'} />
        <g opacity="0.88">
          <line x1="48" y1="270" x2="680" y2="270" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
          <line x1="360" y1="54" x2="360" y2="464" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
          <text x="666" y="294" fill="rgba(255,255,255,0.55)" fontSize="14" fontWeight="900">x</text>
          <text x="376" y="72" fill="rgba(255,255,255,0.55)" fontSize="14" fontWeight="900">y</text>
        </g>

        <line x1={targetLine.x} y1="74" x2={targetLine.x} y2="458" stroke="#FBBF24" strokeWidth="5" strokeDasharray="12 12" opacity="0.68" />
        <text x={targetLine.x + 12} y="96" fill="#FDE68A" fontSize="13" fontWeight="900">hedef x=0</text>

        {rootMode ? (
          <>
            <motion.polyline
              points={createRootPoints(params.rootStartX)}
              fill="none"
              stroke="url(#domain-root-line)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#domain-glow)"
              animate={{ opacity: missionOk ? [0.9, 1, 0.9] : [0.62, 0.94, 0.62] }}
              transition={{ duration: missionOk ? 0.75 : 1.4, repeat: Infinity }}
            />
            <GateHandle testId="domain-root-start-handle" label="√ başlangıç" point={rootStart} color="#22D3EE" onPointerDown={(event) => onPointerDown(event, 'rootStart')} onDoubleClick={target.dragTarget === 'rootStart' ? onSnapTarget : undefined} onKeyDown={(event) => handleKeyStep(event, 'rootStart', onKeyboardStep, onKeyboardSnap)} />
            <VerticalHandle testId="domain-safe-gate-handle" label="x≥0 kapısı" x={safeGate.x} color="#34D399" onPointerDown={(event) => onPointerDown(event, 'safeGate')} onDoubleClick={target.dragTarget === 'safeGate' ? onSnapTarget : undefined} onKeyDown={(event) => handleKeyStep(event, 'safeGate', onKeyboardStep, onKeyboardSnap)} />
          </>
        ) : (
          <>
            <motion.polyline points={createRationalBranch(params.asymptoteX, 'left')} fill="none" stroke="url(#domain-rational-line)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" filter="url(#domain-glow)" />
            <motion.polyline points={createRationalBranch(params.asymptoteX, 'right')} fill="none" stroke="url(#domain-rational-line)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" filter="url(#domain-glow)" />
            <VerticalHandle testId="domain-asymptote-handle" label="asimptot" x={asymptote.x} color="#FB7185" onPointerDown={(event) => onPointerDown(event, 'asymptote')} onDoubleClick={target.dragTarget === 'asymptote' ? onSnapTarget : undefined} onKeyDown={(event) => handleKeyStep(event, 'asymptote', onKeyboardStep, onKeyboardSnap)} />
            <GateHandle testId="domain-forbidden-handle" label="x≠0" point={forbidden} color="#F97316" onPointerDown={(event) => onPointerDown(event, 'forbidden')} onDoubleClick={target.dragTarget === 'forbidden' ? onSnapTarget : undefined} onKeyDown={(event) => handleKeyStep(event, 'forbidden', onKeyboardStep, onKeyboardSnap)} />
          </>
        )}

        <g className="pointer-events-none">
          <rect x="54" y="54" width="320" height="92" rx="24" fill="rgba(0,0,0,0.42)" stroke="rgba(255,255,255,0.12)" />
          <text x="76" y="88" fill="#CFFAFE" fontSize="15" fontWeight="900">Canlı kapı</text>
          <text x="76" y="118" fill="#FFFFFF" fontSize="20" fontWeight="900">{target.label} · x={formatValue(activeX)}</text>
          <text x="360" y="480" textAnchor="middle" fill="#FDE68A" fontSize="18" fontWeight="900">Sarı çizgiye kilitle: x=0</text>
          <text x="360" y="504" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="800">Karekök solda doğmaz, rasyonel grafik asimptotu geçmez</text>
        </g>
      </svg>
    </section>
  );
}

function handleKeyStep(
  event: ReactKeyboardEvent<SVGGElement>,
  target: DomainTarget['dragTarget'],
  onKeyboardStep: (target: DomainTarget['dragTarget'], delta: number) => void,
  onKeyboardSnap: (target: DomainTarget['dragTarget']) => void,
) {
  if (event.key === 'Home') {
    event.preventDefault();
    onKeyboardSnap(target);
    return;
  }
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  onKeyboardStep(target, event.key === 'ArrowRight' ? 0.2 : -0.2);
}

function ForbiddenZone({ x, mode }: { x: number; mode: 'root' | 'rational' }) {
  if (mode === 'root') {
    return <rect x="48" y="54" width={Math.max(0, x - 48)} height="410" fill="rgba(248,113,113,0.12)" stroke="rgba(248,113,113,0.24)" />;
  }
  return <rect x={x - 14} y="54" width="28" height="410" fill="rgba(248,113,113,0.16)" stroke="rgba(248,113,113,0.28)" />;
}

function VerticalHandle({ testId, label, x, color, onPointerDown, onDoubleClick, onKeyDown }: { testId: string; label: string; x: number; color: string; onPointerDown: (event: ReactPointerEvent<SVGElement>) => void; onDoubleClick?: () => void; onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void }) {
  return (
    <g data-testid={testId} role="slider" tabIndex={0} aria-label={label} onPointerDown={onPointerDown} onDoubleClick={onDoubleClick} onKeyDown={onKeyDown} style={{ cursor: 'ew-resize', touchAction: 'none' }}>
      <line x1={x} y1="80" x2={x} y2="450" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <circle cx={x} cy="270" r="34" fill="transparent" />
      <circle cx={x} cy="270" r="22" fill={`${color}24`} stroke={color} strokeWidth="4" />
      <text x={x} y="248" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}

function GateHandle({ testId, label, point, color, onPointerDown, onDoubleClick, onKeyDown }: { testId: string; label: string; point: { x: number; y: number }; color: string; onPointerDown: (event: ReactPointerEvent<SVGElement>) => void; onDoubleClick?: () => void; onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void }) {
  return (
    <g data-testid={testId} role="slider" tabIndex={0} aria-label={label} onPointerDown={onPointerDown} onDoubleClick={onDoubleClick} onKeyDown={onKeyDown} style={{ cursor: 'grab', touchAction: 'none' }}>
      <circle cx={point.x} cy={point.y} r="36" fill="transparent" />
      <circle cx={point.x} cy={point.y} r="24" fill={`${color}24`} stroke={color} strokeWidth="4" />
      <circle cx={point.x} cy={point.y} r="10" fill={color} stroke="#FFFFFF" strokeWidth="3" />
      <text x={point.x} y={point.y - 36} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900">{label}</text>
    </g>
  );
}
