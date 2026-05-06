import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { crossTableFrame, crossTableTargets, railXFromProgress } from './crossTableModel';
import { CrossTableChoice, CrossTableMeasure, CrossTableState, CrossTableTarget } from './types';

interface CrossTableSceneProps {
  state: CrossTableState;
  target: CrossTableTarget;
  measure: CrossTableMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onSelectChoice: (choice: CrossTableChoice) => void;
  onToggleBias: () => void;
  onToggleSeal: () => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function CrossTableScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onSelectChoice,
  onToggleBias,
  onToggleSeal,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: CrossTableSceneProps) {
  const handleX = railXFromProgress(state.railProgress);
  const targetX = railXFromProgress(target.targetProgress);

  return (
    <section
      data-testid="cross-table-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.15),transparent_31%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.12),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.6</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Çapraz Tablo Dedektifi</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${crossTableFrame.width} ${crossTableFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[640px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="cross-table-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="cross-table-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={crossTableFrame.width} height={crossTableFrame.height} fill="url(#cross-table-grid)" />
        <rect x="54" y="54" width="792" height="532" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="94" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15" fontWeight="900">
          çapraz tablo ilişki sinyali verir; medya iddiası ayrı denetlenir
        </text>

        <TablePanel selected={state.selectedChoice === 'cell'} onClick={() => onSelectChoice('cell')} />
        <DeviationPanel selected={state.selectedChoice === 'deviation'} onClick={() => onSelectChoice('deviation')} />
        <MediaPanel biasFlagged={state.biasFlagged} reportSealed={state.reportSealed} missionOk={missionOk} onToggleBias={onToggleBias} onToggleSeal={onToggleSeal} />
        <FormulaPanel measure={measure} missionOk={missionOk} />

        {crossTableTargets.map((item) => (
          <TargetMarker key={item.id} x={railXFromProgress(item.targetProgress)} y={crossTableFrame.rail.y} color={item.accent} active={item.id === target.id} label={item.shortLabel} />
        ))}
        <line x1={crossTableFrame.rail.x1} y1={crossTableFrame.rail.y} x2={crossTableFrame.rail.x2} y2={crossTableFrame.rail.y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
        <line x1={targetX} y1={crossTableFrame.rail.y - 34} x2={targetX} y2={crossTableFrame.rail.y + 34} stroke={target.accent} strokeWidth="5" strokeLinecap="round" filter="url(#cross-table-glow)" />
        <CrossTableHandle x={handleX} y={crossTableFrame.rail.y} progress={state.railProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      </svg>
    </section>
  );
}

function TablePanel({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <g>
      <rect x="88" y="142" width="332" height="222" rx="30" fill="rgba(0,0,0,0.25)" stroke={selected ? '#22D3EE' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={selected ? 'url(#cross-table-glow)' : undefined} />
      <text x="254" y="174" textAnchor="middle" fill="#BAE6FD" fontSize="16" fontWeight="950">ÇAPRAZ TABLO</text>
      <text x="210" y="213" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="12" fontWeight="900">yükseldi</text>
      <text x="318" y="213" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="12" fontWeight="900">sabit</text>
      <text x="118" y="258" fill="#E0F2FE" fontSize="12" fontWeight="900">planlı</text>
      <text x="118" y="318" fill="#E0F2FE" fontSize="12" fontWeight="900">dağınık</text>
      <Cell testId="cross-table-cell-28" x={170} y={230} value="28" active={selected} onClick={onClick} />
      <Cell x={278} y={230} value="12" active={false} onClick={() => {}} />
      <Cell x={170} y={290} value="10" active={false} onClick={() => {}} />
      <Cell x={278} y={290} value="30" active={false} onClick={() => {}} />
      <text x="254" y="346" textAnchor="middle" fill="#E0F2FE" fontSize="13" fontWeight="900">satır ve sütun birlikte okunur</text>
    </g>
  );
}

function Cell({ testId, x, y, value, active, onClick }: { testId?: string; x: number; y: number; value: string; active: boolean; onClick: () => void }) {
  return (
    <g data-testid={testId} role={testId ? 'button' : undefined} tabIndex={testId ? 0 : -1} onClick={onClick} onKeyDown={(event) => { if (testId && (event.key === 'Enter' || event.key === ' ')) onClick(); }} style={{ cursor: testId ? 'pointer' : 'default' }}>
      <rect x={x} y={y} width="76" height="48" rx="16" fill={active ? 'rgba(34,211,238,0.18)' : 'rgba(255,255,255,0.06)'} stroke={active ? '#22D3EE' : 'rgba(255,255,255,0.1)'} strokeWidth="3" />
      <text x={x + 38} y={y + 31} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="950">{value}</text>
    </g>
  );
}

function DeviationPanel({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <g data-testid="cross-table-deviation-signal" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="456" y="142" width="188" height="222" rx="30" fill={selected ? 'rgba(167,139,250,0.16)' : 'rgba(0,0,0,0.25)'} stroke={selected ? '#A78BFA' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={selected ? 'url(#cross-table-glow)' : undefined} />
      <text x="550" y="176" textAnchor="middle" fill="#DDD6FE" fontSize="16" fontWeight="950">SAPMA</text>
      <text x="550" y="228" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="950">28 - 19</text>
      <text x="550" y="278" textAnchor="middle" fill="#A78BFA" fontSize="40" fontWeight="950">+9</text>
      <text x="550" y="326" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="900">beklenenden yüksek</text>
    </g>
  );
}

function MediaPanel({ biasFlagged, reportSealed, missionOk, onToggleBias, onToggleSeal }: {
  biasFlagged: boolean;
  reportSealed: boolean;
  missionOk: boolean;
  onToggleBias: () => void;
  onToggleSeal: () => void;
}) {
  return (
    <g>
      <rect x="674" y="142" width="138" height="222" rx="30" fill="rgba(0,0,0,0.25)" stroke={biasFlagged || reportSealed ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={biasFlagged || reportSealed ? 'url(#cross-table-glow)' : undefined} />
      <text x="743" y="176" textAnchor="middle" fill="#FEF3C7" fontSize="15" fontWeight="950">MEDYA</text>
      <text x="743" y="214" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">herkes</text>
      <text x="743" y="236" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">yükselir?</text>
      <g data-testid="cross-table-bias-flag" role="button" tabIndex={0} onClick={onToggleBias} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onToggleBias(); }} style={{ cursor: 'pointer' }}>
        <rect x="696" y="260" width="94" height="38" rx="16" fill={biasFlagged ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)'} stroke={biasFlagged ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="3" />
        <text x="743" y="285" textAnchor="middle" fill="#FEF3C7" fontSize="12" fontWeight="950">yanlılık</text>
      </g>
      <g data-testid="cross-table-report-seal" role="button" tabIndex={0} onClick={onToggleSeal} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onToggleSeal(); }} style={{ cursor: 'pointer' }}>
        <rect x="696" y="310" width="94" height="38" rx="16" fill={reportSealed ? 'rgba(110,231,183,0.18)' : 'rgba(255,255,255,0.06)'} stroke={reportSealed ? '#6EE7B7' : 'rgba(255,255,255,0.14)'} strokeWidth="3" />
        <text x="743" y="335" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#fff'} fontSize="12" fontWeight="950">rapor</text>
      </g>
    </g>
  );
}

function FormulaPanel({ measure, missionOk }: { measure: CrossTableMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="222" y="456" width="456" height="48" rx="22" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="486" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="15" fontWeight="950">{measure.observed} / {measure.expected}</text>
    </g>
  );
}

function TargetMarker({ x, y, color, active, label }: { x: number; y: number; color: string; active: boolean; label: string }) {
  return (
    <g className="pointer-events-none" opacity={active ? 1 : 0.58}>
      <circle cx={x} cy={y} r={active ? 18 : 12} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" filter={active ? 'url(#cross-table-glow)' : undefined} />
      <text x={x} y={y + 50} textAnchor="middle" fill={active ? '#fff' : color} fontSize="12" fontWeight="950">{label}</text>
    </g>
  );
}

function CrossTableHandle({ x, y, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="cross-table-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Çapraz tablo dedektif aksı"
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
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#cross-table-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">iz</text>
    </g>
  );
}
