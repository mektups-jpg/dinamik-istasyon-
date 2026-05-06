import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { dependentDrawFrame, dependentDrawTargets, railXFromProgress } from './dependentDrawModel';
import { DependentDrawMeasure, DependentDrawState, DependentDrawTarget } from './types';

interface DependentDrawSceneProps {
  state: DependentDrawState;
  target: DependentDrawTarget;
  measure: DependentDrawMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onToggleFirstRed: () => void;
  onToggleSpaceUpdate: () => void;
  onSelectProbability: () => void;
  onToggleSeal: () => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function DependentDrawScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onToggleFirstRed,
  onToggleSpaceUpdate,
  onSelectProbability,
  onToggleSeal,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: DependentDrawSceneProps) {
  const handleX = railXFromProgress(state.railProgress);
  const targetX = railXFromProgress(target.targetProgress);

  return (
    <section
      data-testid="dependent-draw-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(248,113,113,0.16),transparent_31%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.12),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.7.2</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Bağımlı Çekiliş Makinesi</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${dependentDrawFrame.width} ${dependentDrawFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[640px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="dependent-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="dependent-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={dependentDrawFrame.width} height={dependentDrawFrame.height} fill="url(#dependent-grid)" />
        <rect x="54" y="54" width="792" height="532" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="94" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15" fontWeight="900">
          geri koymadan çekilişte ikinci olasılık yeni torbadan hesaplanır
        </text>

        <BagVisual firstRedRemoved={state.firstRedRemoved} />
        <FirstDrawButton active={state.firstRedRemoved} onClick={onToggleFirstRed} />
        <SpaceUpdateButton active={state.spaceUpdated} onClick={onToggleSpaceUpdate} />
        <ProbabilitySeal probabilityActive={state.selectedProbability === '1/2'} reportSealed={state.reportSealed} missionOk={missionOk} onSelectProbability={onSelectProbability} onToggleSeal={onToggleSeal} />
        <FormulaPanel measure={measure} missionOk={missionOk} />

        {dependentDrawTargets.map((item) => (
          <TargetMarker key={item.id} x={railXFromProgress(item.targetProgress)} y={dependentDrawFrame.rail.y} color={item.accent} active={item.id === target.id} label={item.shortLabel} />
        ))}
        <line x1={dependentDrawFrame.rail.x1} y1={dependentDrawFrame.rail.y} x2={dependentDrawFrame.rail.x2} y2={dependentDrawFrame.rail.y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
        <line x1={targetX} y1={dependentDrawFrame.rail.y - 34} x2={targetX} y2={dependentDrawFrame.rail.y + 34} stroke={target.accent} strokeWidth="5" strokeLinecap="round" filter="url(#dependent-glow)" />
        <DependentHandle x={handleX} y={dependentDrawFrame.rail.y} progress={state.railProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      </svg>
    </section>
  );
}

function BagVisual({ firstRedRemoved }: { firstRedRemoved: boolean }) {
  const balls = [
    { x: 238, y: 252, color: '#F87171', visible: !firstRedRemoved },
    { x: 300, y: 230, color: '#F87171', visible: true },
    { x: 332, y: 292, color: '#F87171', visible: true },
    { x: 260, y: 316, color: '#60A5FA', visible: true },
    { x: 356, y: 250, color: '#60A5FA', visible: true },
  ];
  return (
    <g>
      <path d="M196 160 C218 126 378 126 400 160 L444 390 C456 448 166 448 178 390 Z" fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.16)" strokeWidth="5" />
      <text x="310" y="178" textAnchor="middle" fill="#E0F2FE" fontSize="16" fontWeight="950">TORBA</text>
      {balls.map((ball, index) => (
        <circle key={index} cx={ball.x} cy={ball.y} r="27" fill={ball.visible ? ball.color : 'rgba(248,113,113,0.12)'} stroke={ball.visible ? '#fff' : 'rgba(248,113,113,0.35)'} strokeWidth="4" opacity={ball.visible ? 1 : 0.34} />
      ))}
      {firstRedRemoved ? (
        <g>
          <line x1="206" y1="118" x2="468" y2="118" stroke="#F87171" strokeWidth="7" strokeLinecap="round" filter="url(#dependent-glow)" />
          <circle cx="500" cy="118" r="29" fill="#F87171" stroke="#fff" strokeWidth="4" />
          <text x="500" y="168" textAnchor="middle" fill="#FECACA" fontSize="13" fontWeight="950">geri koyma yok</text>
        </g>
      ) : null}
    </g>
  );
}

function FirstDrawButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <g data-testid="dependent-first-red" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="510" y="170" width="146" height="76" rx="28" fill={active ? 'rgba(248,113,113,0.18)' : 'rgba(0,0,0,0.25)'} stroke={active ? '#F87171' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#dependent-glow)' : undefined} />
      <text x="583" y="202" textAnchor="middle" fill="#FECACA" fontSize="15" fontWeight="950">ilk kırmızı</text>
      <text x="583" y="225" textAnchor="middle" fill={active ? '#D1FAE5' : 'rgba(255,255,255,0.62)'} fontSize="12" fontWeight="900">{active ? 'çıktı' : 'bekliyor'}</text>
    </g>
  );
}

function SpaceUpdateButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <g data-testid="dependent-space-update" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="510" y="270" width="146" height="86" rx="28" fill={active ? 'rgba(34,211,238,0.17)' : 'rgba(0,0,0,0.25)'} stroke={active ? '#22D3EE' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#dependent-glow)' : undefined} />
      <text x="583" y="302" textAnchor="middle" fill="#BAE6FD" fontSize="15" fontWeight="950">örnek uzay</text>
      <text x="583" y="333" textAnchor="middle" fill="#fff" fontSize="21" fontWeight="950">2 / 4</text>
    </g>
  );
}

function ProbabilitySeal({ probabilityActive, reportSealed, missionOk, onSelectProbability, onToggleSeal }: {
  probabilityActive: boolean;
  reportSealed: boolean;
  missionOk: boolean;
  onSelectProbability: () => void;
  onToggleSeal: () => void;
}) {
  return (
    <g>
      <g data-testid="dependent-probability-1-2" role="button" tabIndex={0} onClick={onSelectProbability} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelectProbability(); }} style={{ cursor: 'pointer' }}>
        <rect x="694" y="176" width="98" height="82" rx="28" fill={probabilityActive ? 'rgba(251,191,36,0.2)' : 'rgba(0,0,0,0.25)'} stroke={probabilityActive ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={probabilityActive ? 'url(#dependent-glow)' : undefined} />
        <text x="743" y="211" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="950">1/2</text>
        <text x="743" y="236" textAnchor="middle" fill="#FEF3C7" fontSize="12" fontWeight="950">olasılık</text>
      </g>
      <g data-testid="dependent-report-seal" role="button" tabIndex={0} onClick={onToggleSeal} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onToggleSeal(); }} style={{ cursor: 'pointer' }}>
        <rect x="694" y="284" width="98" height="72" rx="26" fill={reportSealed ? 'rgba(110,231,183,0.18)' : 'rgba(0,0,0,0.25)'} stroke={reportSealed ? '#6EE7B7' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={reportSealed ? 'url(#dependent-glow)' : undefined} />
        <text x="743" y="313" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#fff'} fontSize="14" fontWeight="950">rapor</text>
        <text x="743" y="337" textAnchor="middle" fill="#D1FAE5" fontSize="12" fontWeight="950">mühür</text>
      </g>
    </g>
  );
}

function FormulaPanel({ measure, missionOk }: { measure: DependentDrawMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="220" y="458" width="460" height="50" rx="22" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="488" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="15" fontWeight="950">{measure.bagState} / {measure.probability}</text>
    </g>
  );
}

function TargetMarker({ x, y, color, active, label }: { x: number; y: number; color: string; active: boolean; label: string }) {
  return (
    <g className="pointer-events-none" opacity={active ? 1 : 0.58}>
      <circle cx={x} cy={y} r={active ? 18 : 12} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" filter={active ? 'url(#dependent-glow)' : undefined} />
      <text x={x} y={y + 50} textAnchor="middle" fill={active ? '#fff' : color} fontSize="12" fontWeight="950">{label}</text>
    </g>
  );
}

function DependentHandle({ x, y, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="dependent-draw-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Bağımlı çekiliş aksı"
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
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#dependent-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">çek</text>
    </g>
  );
}
