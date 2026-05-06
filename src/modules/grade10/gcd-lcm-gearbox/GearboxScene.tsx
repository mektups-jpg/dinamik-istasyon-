import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { axleXFromProgress, gearboxFrame, gearTargets } from './gearboxModel';
import { GcdGear, GearMeasure, GearMissionTarget, GearState, LcmGear } from './types';

interface GearboxSceneProps {
  state: GearState;
  activeIndex: number;
  target: GearMissionTarget;
  measure: GearMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onToggleGcdGear: (gear: GcdGear) => void;
  onToggleLcmGear: (gear: LcmGear) => void;
  onToggleSeal: () => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function GearboxScene({
  state,
  activeIndex,
  target,
  measure,
  missionOk,
  svgRef,
  onToggleGcdGear,
  onToggleLcmGear,
  onToggleSeal,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: GearboxSceneProps) {
  const axleX = axleXFromProgress(state.axleProgress);
  const targetX = axleXFromProgress(target.targetProgress);

  return (
    <section
      data-testid="gcd-lcm-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.13),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.1.2</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">EBOB/EKOK Dişli Kutusu</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${gearboxFrame.width} ${gearboxFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#071018]/92 sm:h-[560px] xl:h-[640px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="gcd-lcm-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="gcd-lcm-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={gearboxFrame.width} height={gearboxFrame.height} fill="url(#gcd-lcm-grid)" />
        <rect x="62" y="52" width="776" height="536" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="94" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15" fontWeight="900">
          12 ve 18 aynı asal dişlilerden geçer: ortak küçük kuvvet EBOB, birleşik büyük kuvvet EKOK
        </text>

        <NumberMotor x={210} y={168} number={measure.inputA} factor={measure.factorA} color="#22D3EE" label="1. giriş motoru" />
        <NumberMotor x={690} y={168} number={measure.inputB} factor={measure.factorB} color="#A78BFA" label="2. giriş motoru" />

        <line x1="210" y1="238" x2="690" y2="238" stroke="rgba(255,255,255,0.14)" strokeWidth="8" strokeLinecap="round" />
        <line x1="250" y1="316" x2="650" y2="316" stroke="rgba(34,211,238,0.22)" strokeWidth="8" strokeLinecap="round" />
        <line x1="250" y1="426" x2="650" y2="426" stroke="rgba(167,139,250,0.22)" strokeWidth="8" strokeLinecap="round" />

        <text x="116" y="320" fill="#BAE6FD" fontSize="15" fontWeight="950">EBOB ortak</text>
        <text x="112" y="430" fill="#DDD6FE" fontSize="15" fontWeight="950">EKOK birleşik</text>

        <GearChip
          testId="gcd-gear-2"
          x={314}
          y={316}
          label="2"
          subLabel="min(2¹, 2¹)"
          color="#22D3EE"
          active={state.selectedGcdGears.includes('2')}
          disabled={activeIndex > 0}
          onClick={() => onToggleGcdGear('2')}
        />
        <GearChip
          testId="gcd-gear-3"
          x={486}
          y={316}
          label="3"
          subLabel="min(3¹, 3¹)"
          color="#22D3EE"
          active={state.selectedGcdGears.includes('3')}
          disabled={activeIndex > 0}
          onClick={() => onToggleGcdGear('3')}
        />
        <GearChip
          testId="lcm-gear-4"
          x={314}
          y={426}
          label="2² = 4"
          subLabel="max(2², 2¹)"
          color="#A78BFA"
          active={state.selectedLcmGears.includes('4')}
          disabled={activeIndex === 0 || activeIndex > 1}
          onClick={() => onToggleLcmGear('4')}
        />
        <GearChip
          testId="lcm-gear-9"
          x={486}
          y={426}
          label="3² = 9"
          subLabel="max(3¹, 3²)"
          color="#A78BFA"
          active={state.selectedLcmGears.includes('9')}
          disabled={activeIndex === 0 || activeIndex > 1}
          onClick={() => onToggleLcmGear('9')}
        />

        <SealCore active={state.sealArmed} missionOk={missionOk} activeIndex={activeIndex} onClick={onToggleSeal} />
        <FormulaPanel activeIndex={activeIndex} measure={measure} missionOk={missionOk} />

        {gearTargets.map((item) => (
          <TargetMarker key={item.id} x={axleXFromProgress(item.targetProgress)} y={gearboxFrame.rail.y} color={item.accent} active={item.id === target.id} label={item.shortLabel} />
        ))}
        <line x1={gearboxFrame.rail.x1} y1={gearboxFrame.rail.y} x2={gearboxFrame.rail.x2} y2={gearboxFrame.rail.y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
        <line x1={targetX} y1={gearboxFrame.rail.y - 34} x2={targetX} y2={gearboxFrame.rail.y + 34} stroke={target.accent} strokeWidth="5" strokeLinecap="round" filter="url(#gcd-lcm-glow)" />
        <GearHandle x={axleX} y={gearboxFrame.rail.y} progress={state.axleProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      </svg>
    </section>
  );
}

function NumberMotor({ x, y, number, factor, color, label }: { x: number; y: number; number: number; factor: string; color: string; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="62" fill="rgba(0,0,0,0.3)" stroke={color} strokeWidth="5" filter="url(#gcd-lcm-glow)" />
      <text x={x} y={y - 12} textAnchor="middle" fill="#fff" fontSize="32" fontWeight="950">{number}</text>
      <text x={x} y={y + 20} textAnchor="middle" fill={color} fontSize="16" fontWeight="950">{factor}</text>
      <text x={x} y={y + 86} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}

function GearChip({ testId, x, y, label, subLabel, color, active, disabled, onClick }: {
  testId: string;
  x: number;
  y: number;
  label: string;
  subLabel: string;
  color: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const opacity = disabled && !active ? 0.42 : 1;
  return (
    <g
      data-testid={testId}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => { if (!disabled) onClick(); }}
      onKeyDown={(event) => { if (!disabled && (event.key === 'Enter' || event.key === ' ')) onClick(); }}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity }}
    >
      <motion.circle
        cx={x}
        cy={y}
        r={active ? 46 : 40}
        fill={active ? `${color}2E` : 'rgba(0,0,0,0.25)'}
        stroke={active ? color : 'rgba(255,255,255,0.16)'}
        strokeWidth="4"
        animate={{ rotate: active ? 360 : 0 }}
        transition={{ duration: 6, repeat: active ? Infinity : 0, ease: 'linear' }}
        style={{ transformOrigin: `${x}px ${y}px` }}
        filter={active ? 'url(#gcd-lcm-glow)' : undefined}
      />
      <text x={x} y={y - 3} textAnchor="middle" fill={active ? '#fff' : color} fontSize="17" fontWeight="950">{label}</text>
      <text x={x} y={y + 20} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize="11" fontWeight="900">{subLabel}</text>
    </g>
  );
}

function SealCore({ active, missionOk, activeIndex, onClick }: { active: boolean; missionOk: boolean; activeIndex: number; onClick: () => void }) {
  const disabled = activeIndex < 2;
  return (
    <g
      data-testid="gcd-lcm-seal"
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => { if (!disabled) onClick(); }}
      onKeyDown={(event) => { if (!disabled && (event.key === 'Enter' || event.key === ' ')) onClick(); }}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled && !active ? 0.42 : 1 }}
    >
      <rect x="596" y="276" width="180" height="96" rx="28" fill={active ? 'rgba(251,191,36,0.18)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#gcd-lcm-glow)' : undefined} />
      <text x="686" y="314" textAnchor="middle" fill="#FEF3C7" fontSize="15" fontWeight="950">rapor mührü</text>
      <text x="686" y="342" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#fff'} fontSize="15" fontWeight="950">EBOB 6</text>
      <text x="686" y="362" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#fff'} fontSize="15" fontWeight="950">EKOK 36</text>
    </g>
  );
}

function FormulaPanel({ activeIndex, measure, missionOk }: { activeIndex: number; measure: GearMeasure; missionOk: boolean }) {
  const line = activeIndex === 0 ? `EBOB seçimi: ${measure.selectedGcdLabel}` : activeIndex === 1 ? `EKOK seçimi: ${measure.selectedLcmLabel}` : `EBOB ${measure.gcdProduct}, EKOK ${measure.lcmProduct}`;
  return (
    <g>
      <rect x="238" y="116" width="424" height="54" rx="22" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="139" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="900">dişli kutusu {activeIndex + 1}/3</text>
      <text x="450" y="160" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="16" fontWeight="950">{line}</text>
    </g>
  );
}

function TargetMarker({ x, y, color, active, label }: { x: number; y: number; color: string; active: boolean; label: string }) {
  return (
    <g className="pointer-events-none" opacity={active ? 1 : 0.6}>
      <circle cx={x} cy={y} r={active ? 18 : 12} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" filter={active ? 'url(#gcd-lcm-glow)' : undefined} />
      <text x={x} y={y + 50} textAnchor="middle" fill={color} fontSize="11" fontWeight="950">{label}</text>
    </g>
  );
}

function GearHandle({ x, y, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="gcd-lcm-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="EBOB EKOK aks tutamacı"
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
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#gcd-lcm-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">aks</text>
    </g>
  );
}
