import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { algorithmFrame, algorithmTargets, railXFromProgress } from './algorithmModel';
import { AlgorithmChoice, AlgorithmMeasure, AlgorithmState, AlgorithmTarget } from './types';

interface AlgorithmMachineSceneProps {
  state: AlgorithmState;
  activeIndex: number;
  target: AlgorithmTarget;
  measure: AlgorithmMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onSelectChoice: (choice: AlgorithmChoice) => void;
  onSelectOutput: (value: number) => void;
  onToggleSeal: () => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function AlgorithmMachineScene({
  state,
  activeIndex,
  target,
  measure,
  missionOk,
  svgRef,
  onSelectChoice,
  onSelectOutput,
  onToggleSeal,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: AlgorithmMachineSceneProps) {
  const handleX = railXFromProgress(state.railProgress);
  const targetX = railXFromProgress(target.targetProgress);

  return (
    <section
      data-testid="algorithm-machine-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.16),transparent_31%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.12),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.3.2</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Cebir Algoritma Makinesi</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${algorithmFrame.width} ${algorithmFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#06101a]/92 sm:h-[560px] xl:h-[640px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="algorithm-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="algorithm-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={algorithmFrame.width} height={algorithmFrame.height} fill="url(#algorithm-grid)" />
        <rect x="56" y="54" width="788" height="532" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="94" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15" fontWeight="900">
          cebirsel ifade, girdi portundan çıktı portuna akan sıralı komuttur
        </text>

        <InputBlock active={state.selectedChoice === 'input'} onClick={() => onSelectChoice('input')} />
        <PipelineBlock active={state.selectedChoice === 'pipeline'} activeIndex={activeIndex} onClick={() => onSelectChoice('pipeline')} />
        <OutputToken active={state.selectedOutput === 7} expected={target.id === 'pipeline'} onClick={() => onSelectOutput(7)} />
        <CodeSeal active={state.codeSealed} missionOk={missionOk} onClick={onToggleSeal} />
        <FormulaPanel activeIndex={activeIndex} measure={measure} missionOk={missionOk} />

        {algorithmTargets.map((item) => (
          <TargetMarker key={item.id} x={railXFromProgress(item.targetProgress)} y={algorithmFrame.rail.y} color={item.accent} active={item.id === target.id} label={item.shortLabel} />
        ))}
        <line x1={algorithmFrame.rail.x1} y1={algorithmFrame.rail.y} x2={algorithmFrame.rail.x2} y2={algorithmFrame.rail.y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
        <line x1={targetX} y1={algorithmFrame.rail.y - 34} x2={targetX} y2={algorithmFrame.rail.y + 34} stroke={target.accent} strokeWidth="5" strokeLinecap="round" filter="url(#algorithm-glow)" />
        <AlgorithmHandle x={handleX} y={algorithmFrame.rail.y} progress={state.railProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      </svg>
    </section>
  );
}

function InputBlock({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <g data-testid="algorithm-input-block" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="100" y="170" width="158" height="164" rx="32" fill={active ? 'rgba(34,211,238,0.16)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#22D3EE' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#algorithm-glow)' : undefined} />
      <text x="179" y="206" textAnchor="middle" fill="#BAE6FD" fontSize="16" fontWeight="950">GİRDİ</text>
      <text x="179" y="262" textAnchor="middle" fill="#fff" fontSize="38" fontWeight="950">x = 3</text>
      <text x="179" y="302" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="14" fontWeight="900">başlangıç verisi</text>
    </g>
  );
}

function PipelineBlock({ active, activeIndex, onClick }: { active: boolean; activeIndex: number; onClick: () => void }) {
  const steps = [
    { x: 306, label: '+2', value: '5' },
    { x: 420, label: 'kare', value: '25' },
    { x: 534, label: '-4', value: '21' },
    { x: 648, label: '/3', value: '7' },
  ];

  return (
    <g data-testid="algorithm-operation-chain" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="286" y="162" width="392" height="184" rx="34" fill={active ? 'rgba(167,139,250,0.16)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#A78BFA' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#algorithm-glow)' : undefined} />
      <text x="482" y="197" textAnchor="middle" fill="#DDD6FE" fontSize="16" fontWeight="950">İŞLEM BORU HATTI</text>
      <line x1="324" y1="254" x2="636" y2="254" stroke="rgba(255,255,255,0.18)" strokeWidth="8" strokeLinecap="round" />
      {steps.map((step, index) => (
        <g key={step.label}>
          <circle cx={step.x} cy="254" r={active || activeIndex > 0 ? 31 : 25} fill={active ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.06)'} stroke={index === 3 ? '#6EE7B7' : '#A78BFA'} strokeWidth="4" />
          <text x={step.x} y="247" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="950">{step.label}</text>
          <text x={step.x} y="273" textAnchor="middle" fill="#E0F2FE" fontSize="13" fontWeight="950">{step.value}</text>
        </g>
      ))}
    </g>
  );
}

function OutputToken({ active, expected, onClick }: { active: boolean; expected: boolean; onClick: () => void }) {
  return (
    <g data-testid="algorithm-output-token-7" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="706" y="176" width="102" height="144" rx="32" fill={active ? 'rgba(110,231,183,0.16)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#6EE7B7' : expected ? '#6EE7B7' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#algorithm-glow)' : undefined} />
      <text x="757" y="212" textAnchor="middle" fill="#D1FAE5" fontSize="14" fontWeight="950">ÇIKTI</text>
      <text x="757" y="270" textAnchor="middle" fill="#fff" fontSize="46" fontWeight="950">7</text>
    </g>
  );
}

function CodeSeal({ active, missionOk, onClick }: { active: boolean; missionOk: boolean; onClick: () => void }) {
  return (
    <g data-testid="algorithm-code-seal" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x="230" y="382" width="440" height="72" rx="28" fill={active ? 'rgba(251,191,36,0.18)' : 'rgba(0,0,0,0.25)'} stroke={active ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#algorithm-glow)' : undefined} />
      <text x="450" y="412" textAnchor="middle" fill="#FEF3C7" fontSize="15" fontWeight="950">sözde kod mührü</text>
      <text x="450" y="438" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#fff'} fontSize="16" fontWeight="950">oku x; uygula +2, kare, -4, /3; yaz 7</text>
    </g>
  );
}

function FormulaPanel({ activeIndex, measure, missionOk }: { activeIndex: number; measure: AlgorithmMeasure; missionOk: boolean }) {
  const line = activeIndex === 0 ? 'girdi x=3' : activeIndex === 1 ? '3 -> 5 -> 25 -> 21 -> 7' : measure.expression;
  return (
    <g>
      <rect x="232" y="480" width="436" height="42" rx="20" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="507" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="15" fontWeight="950">{line}</text>
    </g>
  );
}

function TargetMarker({ x, y, color, active, label }: { x: number; y: number; color: string; active: boolean; label: string }) {
  return (
    <g className="pointer-events-none" opacity={active ? 1 : 0.58}>
      <circle cx={x} cy={y} r={active ? 18 : 12} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" filter={active ? 'url(#algorithm-glow)' : undefined} />
      <text x={x} y={y + 50} textAnchor="middle" fill={color} fontSize="11" fontWeight="950">{label}</text>
    </g>
  );
}

function AlgorithmHandle({ x, y, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="algorithm-machine-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Algoritma rayı aksı"
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
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#algorithm-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">akış</text>
    </g>
  );
}
