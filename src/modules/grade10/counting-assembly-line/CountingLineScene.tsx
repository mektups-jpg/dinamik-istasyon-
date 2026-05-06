import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { beltXFromProgress, countingFrame, countingTargets } from './countingModel';
import { CountingMeasure, CountingMode, CountingState, CountingTarget } from './types';

interface CountingLineSceneProps {
  state: CountingState;
  activeIndex: number;
  target: CountingTarget;
  measure: CountingMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onSelectMode: (mode: CountingMode) => void;
  onSelectToken: (value: number) => void;
  onToggleSeal: () => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function CountingLineScene({
  state,
  activeIndex,
  target,
  measure,
  missionOk,
  svgRef,
  onSelectMode,
  onSelectToken,
  onToggleSeal,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: CountingLineSceneProps) {
  const carrierX = beltXFromProgress(state.beltProgress);
  const targetX = beltXFromProgress(target.targetProgress);

  return (
    <section
      data-testid="counting-line-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.13),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.3.1</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Sayma Montaj Hattı</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${countingFrame.width} ${countingFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#071018]/92 sm:h-[560px] xl:h-[640px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="counting-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="counting-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={countingFrame.width} height={countingFrame.height} fill="url(#counting-grid)" />
        <rect x="62" y="52" width="776" height="536" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="94" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15" fontWeight="900">
          aynı ürüne bağlanan bağımsız seçimler çarpılır; ayrık hat seçenekleri toplanır
        </text>

        <ProductLine active={state.selectedMode === 'product'} onClick={() => onSelectMode('product')} />
        <SumLine active={state.selectedMode === 'sum'} onClick={() => onSelectMode('sum')} />
        <ReportSeal active={state.sealArmed} activeIndex={activeIndex} missionOk={missionOk} onClick={onToggleSeal} />
        <Token testId="counting-token-6" x={344} y={444} value={6} active={state.selectedToken === 6} expected={target.expected === 6} onClick={() => onSelectToken(6)} />
        <Token testId="counting-token-7" x={528} y={444} value={7} active={state.selectedToken === 7} expected={target.expected === 7} onClick={() => onSelectToken(7)} />
        <FormulaPanel activeIndex={activeIndex} measure={measure} missionOk={missionOk} />

        {countingTargets.map((item) => (
          <TargetMarker key={item.id} x={beltXFromProgress(item.targetProgress)} y={countingFrame.rail.y} color={item.accent} active={item.id === target.id} label={item.shortLabel} />
        ))}
        <line x1={countingFrame.rail.x1} y1={countingFrame.rail.y} x2={countingFrame.rail.x2} y2={countingFrame.rail.y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
        <line x1={targetX} y1={countingFrame.rail.y - 34} x2={targetX} y2={countingFrame.rail.y + 34} stroke={target.accent} strokeWidth="5" strokeLinecap="round" filter="url(#counting-glow)" />
        <CountingHandle x={carrierX} y={countingFrame.rail.y} progress={state.beltProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      </svg>
    </section>
  );
}

function ProductLine({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <g data-testid="counting-mode-product" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="126" y="138" width="310" height="148" rx="30" fill={active ? 'rgba(34,211,238,0.16)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#22D3EE' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#counting-glow)' : undefined} />
      <text x="281" y="170" textAnchor="middle" fill="#BAE6FD" fontSize="18" fontWeight="950">Çarpma Bandı</text>
      <text x="208" y="216" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="950">3 renk</text>
      <text x="354" y="216" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="950">2 rozet</text>
      <text x="281" y="257" textAnchor="middle" fill="#22D3EE" fontSize="24" fontWeight="950">3 × 2 = 6</text>
    </g>
  );
}

function SumLine({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <g data-testid="counting-mode-sum" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="464" y="138" width="310" height="148" rx="30" fill={active ? 'rgba(167,139,250,0.16)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#A78BFA' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#counting-glow)' : undefined} />
      <text x="619" y="170" textAnchor="middle" fill="#DDD6FE" fontSize="18" fontWeight="950">Toplama Bandı</text>
      <text x="546" y="216" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="950">4 drone</text>
      <text x="692" y="216" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="950">3 rover</text>
      <text x="619" y="257" textAnchor="middle" fill="#A78BFA" fontSize="24" fontWeight="950">4 + 3 = 7</text>
    </g>
  );
}

function ReportSeal({ active, activeIndex, missionOk, onClick }: { active: boolean; activeIndex: number; missionOk: boolean; onClick: () => void }) {
  const disabled = activeIndex < 2;
  return (
    <g data-testid="counting-report-seal" role="button" tabIndex={disabled ? -1 : 0} onClick={() => { if (!disabled) onClick(); }} onKeyDown={(event) => { if (!disabled && (event.key === 'Enter' || event.key === ' ')) onClick(); }} style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled && !active ? 0.44 : 1 }}>
      <rect x="354" y="314" width="192" height="78" rx="26" fill={active ? 'rgba(251,191,36,0.18)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#counting-glow)' : undefined} />
      <text x="450" y="346" textAnchor="middle" fill="#FEF3C7" fontSize="16" fontWeight="950">sayma mührü</text>
      <text x="450" y="371" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#fff'} fontSize="18" fontWeight="950">× veya +</text>
    </g>
  );
}

function Token({ testId, x, y, value, active, expected, onClick }: { testId: string; x: number; y: number; value: number; active: boolean; expected: boolean; onClick: () => void }) {
  return (
    <g data-testid={testId} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={y} r={active ? 43 : 37} fill={active ? 'rgba(34,211,238,0.18)' : 'rgba(0,0,0,0.25)'} stroke={active ? '#22D3EE' : expected ? '#6EE7B7' : 'rgba(255,255,255,0.16)'} strokeWidth="4" filter={active ? 'url(#counting-glow)' : undefined} />
      <text x={x} y={y + 8} textAnchor="middle" fill="#fff" fontSize="28" fontWeight="950">{value}</text>
    </g>
  );
}

function FormulaPanel({ activeIndex, measure, missionOk }: { activeIndex: number; measure: CountingMeasure; missionOk: boolean }) {
  const line = activeIndex === 2 ? 'beraber seçim: ×, ayrık seçim: +' : measure.expression;
  return (
    <g>
      <rect x="230" y="492" width="440" height="42" rx="20" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="519" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="15" fontWeight="950">{line}</text>
    </g>
  );
}

function TargetMarker({ x, y, color, active, label }: { x: number; y: number; color: string; active: boolean; label: string }) {
  return (
    <g className="pointer-events-none" opacity={active ? 1 : 0.58}>
      <circle cx={x} cy={y} r={active ? 18 : 12} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" filter={active ? 'url(#counting-glow)' : undefined} />
      <text x={x} y={y + 50} textAnchor="middle" fill={active ? '#fff' : color} fontSize="12" fontWeight="950">{label}</text>
    </g>
  );
}

function CountingHandle({ x, y, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="counting-line-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Sayma montaj aksı"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      transform={`translate(${x} ${y})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
    >
      <circle r="36" fill="transparent" />
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#counting-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">aks</text>
    </g>
  );
}
