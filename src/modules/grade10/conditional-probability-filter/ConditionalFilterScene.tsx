import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { conditionalFrame, conditionalTargets, railXFromProgress } from './conditionalModel';
import { ConditionalMeasure, ConditionalState, ConditionalTarget } from './types';

interface ConditionalFilterSceneProps {
  state: ConditionalState;
  target: ConditionalTarget;
  measure: ConditionalMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onToggleCondition: () => void;
  onToggleTarget: () => void;
  onSelectFraction: () => void;
  onToggleSeal: () => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

const faces = [
  { value: 1, x: 146, y: 204 },
  { value: 2, x: 258, y: 204 },
  { value: 3, x: 370, y: 204 },
  { value: 4, x: 482, y: 204 },
  { value: 5, x: 594, y: 204 },
  { value: 6, x: 706, y: 204 },
];

export function ConditionalFilterScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onToggleCondition,
  onToggleTarget,
  onSelectFraction,
  onToggleSeal,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: ConditionalFilterSceneProps) {
  const handleX = railXFromProgress(state.railProgress);
  const targetX = railXFromProgress(target.targetProgress);

  return (
    <section
      data-testid="conditional-filter-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.15),transparent_31%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.12),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.7.1</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Koşullu Olasılık Filtresi</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${conditionalFrame.width} ${conditionalFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[640px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="conditional-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="conditional-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={conditionalFrame.width} height={conditionalFrame.height} fill="url(#conditional-grid)" />
        <rect x="54" y="54" width="792" height="532" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="94" textAnchor="middle" fill="#E0F2FE" fontSize="15" fontWeight="900">
          koşul gelince evren küçülür; hedef olay bu yeni evrende sayılır
        </text>

        <g>
          {faces.map((face) => {
            const even = face.value % 2 === 0;
            const targetFace = face.value > 4 && even;
            const fadedByCondition = state.conditionOn && !even;
            const highlighted = state.targetOn ? targetFace : state.conditionOn && even;
            return <DieFace key={face.value} value={face.value} x={face.x} y={face.y} faded={fadedByCondition} active={highlighted} target={targetFace && state.targetOn} />;
          })}
        </g>

        <FilterButton testId="conditional-even-filter" x={158} y={356} label="çift geldi" active={state.conditionOn} accent="#22D3EE" onClick={onToggleCondition} />
        <FilterButton testId="conditional-target-filter" x={370} y={356} label="4'ten büyük" active={state.targetOn} accent="#A78BFA" onClick={onToggleTarget} />
        <FractionSeal fractionActive={state.selectedFraction === '1/3'} reportSealed={state.reportSealed} missionOk={missionOk} onSelectFraction={onSelectFraction} onToggleSeal={onToggleSeal} />
        <FormulaPanel measure={measure} missionOk={missionOk} />

        {conditionalTargets.map((item) => (
          <TargetMarker key={item.id} x={railXFromProgress(item.targetProgress)} y={conditionalFrame.rail.y} color={item.accent} active={item.id === target.id} label={item.shortLabel} />
        ))}
        <line x1={conditionalFrame.rail.x1} y1={conditionalFrame.rail.y} x2={conditionalFrame.rail.x2} y2={conditionalFrame.rail.y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
        <line x1={targetX} y1={conditionalFrame.rail.y - 34} x2={targetX} y2={conditionalFrame.rail.y + 34} stroke={target.accent} strokeWidth="5" strokeLinecap="round" filter="url(#conditional-glow)" />
        <ConditionalHandle x={handleX} y={conditionalFrame.rail.y} progress={state.railProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      </svg>
    </section>
  );
}

function DieFace({ value, x, y, faded, active, target }: { value: number; x: number; y: number; faded: boolean; active: boolean; target: boolean }) {
  return (
    <g opacity={faded ? 0.24 : 1}>
      <rect x={x} y={y} width="82" height="82" rx="24" fill={active ? 'rgba(34,211,238,0.17)' : 'rgba(255,255,255,0.07)'} stroke={target ? '#6EE7B7' : active ? '#22D3EE' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#conditional-glow)' : undefined} />
      <text x={x + 41} y={y + 53} textAnchor="middle" fill="#fff" fontSize="34" fontWeight="950">{value}</text>
    </g>
  );
}

function FilterButton({ testId, x, y, label, active, accent, onClick }: { testId: string; x: number; y: number; label: string; active: boolean; accent: string; onClick: () => void }) {
  return (
    <g data-testid={testId} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width="170" height="72" rx="28" fill={active ? `${accent}26` : 'rgba(0,0,0,0.25)'} stroke={active ? accent : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#conditional-glow)' : undefined} />
      <text x={x + 85} y={y + 31} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="950">{label}</text>
      <text x={x + 85} y={y + 54} textAnchor="middle" fill={active ? '#D1FAE5' : 'rgba(255,255,255,0.56)'} fontSize="12" fontWeight="900">{active ? 'açık' : 'bekliyor'}</text>
    </g>
  );
}

function FractionSeal({ fractionActive, reportSealed, missionOk, onSelectFraction, onToggleSeal }: {
  fractionActive: boolean;
  reportSealed: boolean;
  missionOk: boolean;
  onSelectFraction: () => void;
  onToggleSeal: () => void;
}) {
  return (
    <g>
      <g data-testid="conditional-fraction-1-3" role="button" tabIndex={0} onClick={onSelectFraction} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelectFraction(); }} style={{ cursor: 'pointer' }}>
        <rect x="582" y="350" width="104" height="84" rx="28" fill={fractionActive ? 'rgba(251,191,36,0.2)' : 'rgba(0,0,0,0.25)'} stroke={fractionActive ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={fractionActive ? 'url(#conditional-glow)' : undefined} />
        <text x="634" y="385" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="950">1/3</text>
        <text x="634" y="412" textAnchor="middle" fill="#FEF3C7" fontSize="12" fontWeight="950">sonuç</text>
      </g>
      <g data-testid="conditional-report-seal" role="button" tabIndex={0} onClick={onToggleSeal} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onToggleSeal(); }} style={{ cursor: 'pointer' }}>
        <rect x="706" y="350" width="86" height="84" rx="28" fill={reportSealed ? 'rgba(110,231,183,0.18)' : 'rgba(0,0,0,0.25)'} stroke={reportSealed ? '#6EE7B7' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={reportSealed ? 'url(#conditional-glow)' : undefined} />
        <text x="749" y="385" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#fff'} fontSize="14" fontWeight="950">rapor</text>
        <text x="749" y="412" textAnchor="middle" fill="#D1FAE5" fontSize="12" fontWeight="950">mühür</text>
      </g>
    </g>
  );
}

function FormulaPanel({ measure, missionOk }: { measure: ConditionalMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="220" y="466" width="460" height="46" rx="22" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="495" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="15" fontWeight="950">evren {measure.universe} / uygun {measure.favorable}</text>
    </g>
  );
}

function TargetMarker({ x, y, color, active, label }: { x: number; y: number; color: string; active: boolean; label: string }) {
  return (
    <g className="pointer-events-none" opacity={active ? 1 : 0.58}>
      <circle cx={x} cy={y} r={active ? 18 : 12} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" filter={active ? 'url(#conditional-glow)' : undefined} />
      <text x={x} y={y + 50} textAnchor="middle" fill={active ? '#fff' : color} fontSize="12" fontWeight="950">{label}</text>
    </g>
  );
}

function ConditionalHandle({ x, y, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="conditional-filter-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Koşullu olasılık filtresi aksı"
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
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#conditional-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">koşul</text>
    </g>
  );
}
