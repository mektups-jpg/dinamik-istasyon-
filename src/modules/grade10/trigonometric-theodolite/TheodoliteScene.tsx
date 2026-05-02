import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { AnglePointerHandler, RatioSide, RatioTarget, SideSelection, TriangleMeasure } from './types';
import { basePoint, maxHypotenuse, sideLabel, sideTestId, sideTone } from './theodoliteModel';

interface TheodoliteSceneProps {
  target: RatioTarget;
  measure: TriangleMeasure;
  selection: SideSelection;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onAngleDown: AnglePointerHandler;
  onAngleMove: (event: ReactPointerEvent<SVGElement>) => void;
  onAngleUp: () => void;
  onAngleStep: (delta: number) => void;
  onSelectSide: (side: RatioSide) => void;
}

export function TheodoliteScene({
  target,
  measure,
  selection,
  missionOk,
  svgRef,
  onAngleDown,
  onAngleMove,
  onAngleUp,
  onAngleStep,
  onSelectSide,
}: TheodoliteSceneProps) {
  const angleRad = (measure.angle * Math.PI) / 180;
  const adjacent = maxHypotenuse * Math.cos(angleRad);
  const opposite = maxHypotenuse * Math.sin(angleRad);
  const foot = { x: basePoint.x + adjacent, y: basePoint.y };
  const tip = { x: foot.x, y: basePoint.y - opposite };

  return (
    <section
      data-testid="trig-theodolite-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-200/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_76%_20%,rgba(251,191,36,0.14),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.4.1.x</p>
          <h2 className="text-2xl font-black text-white">Dijital Teodolit Ölçüm Masası</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.label}: {sideLabel[target.numerator]}/{sideLabel[target.denominator]}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="trig-theodolite-svg"
        viewBox="0 0 720 520"
        className="relative h-[360px] w-full touch-none rounded-[28px] border border-white/12 bg-[#03101a]/86 sm:h-[430px] xl:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onAngleMove}
        onPointerUp={onAngleUp}
        onPointerCancel={onAngleUp}
      >
        <defs>
          <pattern id="theodolite-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="1" />
          </pattern>
          <filter id="theodolite-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="720" height="520" fill="url(#theodolite-grid)" />
        <rect x="60" y="64" width="600" height="390" rx="30" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.10)" />
        <path d={`M ${basePoint.x} ${basePoint.y} L ${foot.x} ${foot.y} L ${tip.x} ${tip.y} Z`} fill="rgba(56,189,248,0.08)" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
        <path d={`M ${basePoint.x + 28} ${basePoint.y} L ${basePoint.x + 28} ${basePoint.y - 28} L ${basePoint.x + 56} ${basePoint.y - 28}`} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />

        <path d={`M ${basePoint.x + 70} ${basePoint.y} A 70 70 0 0 0 ${basePoint.x + 70 * Math.cos(angleRad)} ${basePoint.y - 70 * Math.sin(angleRad)}`} fill="none" stroke="#A78BFA" strokeWidth="5" strokeLinecap="round" />
        <text x={basePoint.x + 82} y={basePoint.y - 22} fill="#DDD6FE" fontSize="16" fontWeight="900">{measure.angle}°</text>

        <line x1={basePoint.x} y1={basePoint.y} x2={tip.x} y2={tip.y} stroke="rgba(251,191,36,0.25)" strokeWidth="18" strokeLinecap="round" filter="url(#theodolite-glow)" pointerEvents="none" />
        <motion.line x1={basePoint.x} y1={basePoint.y} x2={tip.x} y2={tip.y} stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" pointerEvents="none" animate={{ opacity: [0.72, 1, 0.72] }} transition={{ duration: 0.9, repeat: Infinity }} />

        <SideButton side="adjacent" x1={basePoint.x} y1={basePoint.y} x2={foot.x} y2={foot.y} selected={isSelected(selection, 'adjacent')} onSelect={onSelectSide} />
        <SideButton side="opposite" x1={foot.x} y1={foot.y} x2={tip.x} y2={tip.y} selected={isSelected(selection, 'opposite')} onSelect={onSelectSide} />
        <SideButton side="hypotenuse" x1={basePoint.x} y1={basePoint.y} x2={tip.x} y2={tip.y} selected={isSelected(selection, 'hypotenuse')} onSelect={onSelectSide} />

        <g
          data-testid="theodolite-angle-handle"
          role="slider"
          tabIndex={0}
          aria-label="Teodolit açı kolu"
          onPointerDown={onAngleDown}
          onKeyDown={(event) => handleAngleKey(event, onAngleStep)}
          style={{ cursor: 'grab', touchAction: 'none' }}
        >
          <circle cx={basePoint.x} cy={basePoint.y} r="30" fill="rgba(251,191,36,0.18)" stroke="#FBBF24" strokeWidth="4" />
          <circle cx={tip.x} cy={tip.y} r="34" fill="transparent" />
          <circle cx={tip.x} cy={tip.y} r="20" fill="rgba(251,191,36,0.22)" stroke="#FBBF24" strokeWidth="4" />
          <text x={tip.x + 14} y={tip.y - 22} fill="#FDE68A" fontSize="13" fontWeight="900">hedef kolu</text>
        </g>
      </svg>
    </section>
  );
}

function SideButton({ side, x1, y1, x2, y2, selected, onSelect }: { side: RatioSide; x1: number; y1: number; x2: number; y2: number; selected: boolean; onSelect: (side: RatioSide) => void }) {
  const color = sideTone[side];
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g data-testid={sideTestId(side)} role="button" tabIndex={0} aria-label={sideLabel[side]} onClick={() => onSelect(side)} onKeyDown={(event) => event.key === 'Enter' && onSelect(side)} style={{ cursor: 'pointer' }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={selected ? 17 : 11} strokeLinecap="round" opacity={selected ? 0.72 : 0.44} filter="url(#theodolite-glow)" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />
      <rect x={midX - 56} y={midY - 20} width="112" height="40" rx="16" fill={selected ? `${color}33` : 'rgba(0,0,0,0.48)'} stroke={color} strokeWidth="2" />
      <text x={midX} y={midY + 5} textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">{sideLabel[side]}</text>
    </g>
  );
}

function isSelected(selection: SideSelection, side: RatioSide) {
  return selection.numerator === side || selection.denominator === side;
}

function handleAngleKey(event: ReactKeyboardEvent<SVGGElement>, onAngleStep: (delta: number) => void) {
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
  event.preventDefault();
  onAngleStep(event.key === 'ArrowUp' ? 2 : -2);
}
