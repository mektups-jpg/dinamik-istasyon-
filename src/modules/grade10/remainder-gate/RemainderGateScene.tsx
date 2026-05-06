import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { gateXFromProgress, remainderFrame, remainderTargets } from './remainderModel';
import { RemainderLens, RemainderMeasure, RemainderState, RemainderTarget } from './types';

interface RemainderGateSceneProps {
  state: RemainderState;
  activeIndex: number;
  target: RemainderTarget;
  measure: RemainderMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onSelectLens: (lens: RemainderLens) => void;
  onSelectRemainder: (value: number) => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function RemainderGateScene({
  state,
  activeIndex,
  target,
  measure,
  missionOk,
  svgRef,
  onSelectLens,
  onSelectRemainder,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: RemainderGateSceneProps) {
  const capsuleX = gateXFromProgress(state.gateProgress);
  const targetX = gateXFromProgress(target.targetProgress);

  return (
    <section
      data-testid="remainder-gate-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.13),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.1.3</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Kalan Kapısı</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${remainderFrame.width} ${remainderFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#071018]/92 sm:h-[560px] xl:h-[640px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="remainder-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="remainder-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={remainderFrame.width} height={remainderFrame.height} fill="url(#remainder-grid)" />
        <rect x="62" y="52" width="776" height="536" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="94" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15" fontWeight="900">
          tam bölme yapmadan doğru izi oku ve kalan tokenını kapıya kilitle
        </text>

        <NumberReadout target={target} />
        <LensNode testId="remainder-gate-sum-lens" x={214} y={294} color="#22D3EE" title="mod 9" label="rakam toplamı" active={state.selectedLens === 'sum'} onClick={() => onSelectLens('sum')} />
        <LensNode testId="remainder-gate-last-digit-lens" x={450} y={294} color="#A78BFA" title="mod 5" label="son basamak" active={state.selectedLens === 'last-digit'} onClick={() => onSelectLens('last-digit')} />
        <LensNode testId="remainder-gate-last-two-lens" x={686} y={294} color="#FBBF24" title="mod 4" label="son iki basamak" active={state.selectedLens === 'last-two'} onClick={() => onSelectLens('last-two')} />

        <TracePanel activeIndex={activeIndex} measure={measure} missionOk={missionOk} />
        <RemainderToken testId="remainder-token-2" x={342} y={430} value={2} active={state.selectedRemainder === 2} expected={target.expectedRemainder === 2} onClick={() => onSelectRemainder(2)} />
        <RemainderToken testId="remainder-token-3" x={526} y={430} value={3} active={state.selectedRemainder === 3} expected={target.expectedRemainder === 3} onClick={() => onSelectRemainder(3)} />

        {remainderTargets.map((item) => (
          <TargetMarker key={item.id} x={gateXFromProgress(item.targetProgress)} y={remainderFrame.rail.y} color={item.accent} active={item.id === target.id} label={item.shortLabel} />
        ))}
        <line x1={remainderFrame.rail.x1} y1={remainderFrame.rail.y} x2={remainderFrame.rail.x2} y2={remainderFrame.rail.y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
        <line x1={targetX} y1={remainderFrame.rail.y - 34} x2={targetX} y2={remainderFrame.rail.y + 34} stroke={target.accent} strokeWidth="5" strokeLinecap="round" filter="url(#remainder-glow)" />
        <GateHandle x={capsuleX} y={remainderFrame.rail.y} progress={state.gateProgress} color={target.accent} number={target.number} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      </svg>
    </section>
  );
}

function NumberReadout({ target }: { target: RemainderTarget }) {
  return (
    <g>
      <rect x="300" y="124" width="300" height="72" rx="26" fill="rgba(0,0,0,0.28)" stroke={target.accent} strokeWidth="4" filter="url(#remainder-glow)" />
      <text x="450" y="153" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="12" fontWeight="900">sayı kapsülü</text>
      <text x="450" y="181" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="950">{target.number} mod {target.modulus}</text>
    </g>
  );
}

function LensNode({ testId, x, y, color, title, label, active, onClick }: {
  testId: string;
  x: number;
  y: number;
  color: string;
  title: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <g data-testid={testId} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x={x - 82} y={y - 44} width="164" height="88" rx="26" fill={active ? `${color}2E` : 'rgba(0,0,0,0.25)'} stroke={active ? color : 'rgba(255,255,255,0.16)'} strokeWidth="4" filter={active ? 'url(#remainder-glow)' : undefined} />
      <text x={x} y={y - 7} textAnchor="middle" fill={color} fontSize="18" fontWeight="950">{title}</text>
      <text x={x} y={y + 19} textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}

function TracePanel({ activeIndex, measure, missionOk }: { activeIndex: number; measure: RemainderMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="248" y="346" width="404" height="50" rx="22" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="367" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="13" fontWeight="900">kalan kapısı {activeIndex + 1}/3</text>
      <text x="450" y="389" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="18" fontWeight="950">
        {measure.trace}: {measure.traceValue}
      </text>
    </g>
  );
}

function RemainderToken({ testId, x, y, value, active, expected, onClick }: { testId: string; x: number; y: number; value: number; active: boolean; expected: boolean; onClick: () => void }) {
  return (
    <g data-testid={testId} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={y} r={active ? 45 : 38} fill={active ? 'rgba(34,211,238,0.18)' : 'rgba(0,0,0,0.25)'} stroke={active ? '#22D3EE' : expected ? '#6EE7B7' : 'rgba(255,255,255,0.16)'} strokeWidth="4" filter={active ? 'url(#remainder-glow)' : undefined} />
      <text x={x} y={y - 3} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="950">{value}</text>
      <text x={x} y={y + 23} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="10" fontWeight="900">kalan</text>
    </g>
  );
}

function TargetMarker({ x, y, color, active, label }: { x: number; y: number; color: string; active: boolean; label: string }) {
  return (
    <g className="pointer-events-none" opacity={active ? 1 : 0.58}>
      <circle cx={x} cy={y} r={active ? 18 : 12} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" filter={active ? 'url(#remainder-glow)' : undefined} />
      <text x={x} y={y + 50} textAnchor="middle" fill={color} fontSize="11" fontWeight="950">{label}</text>
    </g>
  );
}

function GateHandle({ x, y, progress, color, number, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  number: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="remainder-gate-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Kalan kapısı sayı kapsülü"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      transform={`translate(${x} ${y})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
    >
      <circle r="38" fill="transparent" />
      <rect x="-42" y="-25" width="84" height="50" rx="24" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#remainder-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="950">{number}</text>
    </g>
  );
}
