import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { shieldFrame, shieldHandlePoint, shieldTargets } from './identityShieldModel';
import { ShieldLock, ShieldMeasure, ShieldMissionTarget, ShieldState } from './types';

interface IdentityShieldSceneProps {
  state: ShieldState;
  activeIndex: number;
  target: ShieldMissionTarget;
  measure: ShieldMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onSelectLock: (lock: ShieldLock) => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function IdentityShieldScene({
  state,
  activeIndex,
  target,
  measure,
  missionOk,
  svgRef,
  onSelectLock,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: IdentityShieldSceneProps) {
  const handle = shieldHandlePoint(state.angleProgress);
  const targetPoint = shieldHandlePoint(target.targetProgress);
  const center = shieldFrame.center;
  const cosWidth = Math.max(18, measure.cosSquare * 180);
  const sinWidth = Math.max(18, measure.sinSquare * 180);

  return (
    <section
      data-testid="unit-shield-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.17),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.14),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.4.2</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Birim Çember Kalkanı</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${shieldFrame.width} ${shieldFrame.height}`}
        className="relative h-[370px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="unit-shield-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="unit-shield-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={shieldFrame.width} height={shieldFrame.height} fill="url(#unit-shield-grid)" />
        <rect x="62" y="52" width="776" height="560" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <text x="450" y="112" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="15" fontWeight="900">
          yarıçap 1 ise yatay ve dikey izdüşüm kareleri toplamı hep 1 kalır
        </text>

        <line x1={center.x - 210} y1={center.y} x2={center.x + 210} y2={center.y} stroke="rgba(34,211,238,0.22)" strokeWidth="5" />
        <line x1={center.x} y1={center.y + 190} x2={center.x} y2={center.y - 210} stroke="rgba(167,139,250,0.22)" strokeWidth="5" />
        <circle cx={center.x} cy={center.y} r={shieldFrame.radius} fill="rgba(34,211,238,0.06)" stroke="#E0F2FE" strokeWidth="5" filter="url(#unit-shield-glow)" />
        <line x1={center.x} y1={center.y} x2={handle.x} y2={handle.y} stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" filter="url(#unit-shield-glow)" />
        <line x1={handle.x} y1={handle.y} x2={handle.x} y2={center.y} stroke="#A78BFA" strokeWidth="5" strokeDasharray="9 8" />
        <line x1={center.x} y1={center.y} x2={handle.x} y2={center.y} stroke="#22D3EE" strokeWidth="5" strokeDasharray="9 8" />
        <TargetRing x={targetPoint.x} y={targetPoint.y} color={target.accent} label={target.shortLabel} />
        <ShieldHandle x={handle.x} y={handle.y} progress={state.angleProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
        <text x={handle.x + 18} y={handle.y - 18} fill="#FEF3C7" fontSize="14" fontWeight="950">{measure.angle.toFixed(0)}°</text>
        <text x={(center.x + handle.x) / 2} y={center.y + 32} textAnchor="middle" fill="#BAE6FD" fontSize="14" fontWeight="950">cos x = {measure.cosValue.toFixed(2)}</text>
        <text x={handle.x + 20} y={(center.y + handle.y) / 2} fill="#DDD6FE" fontSize="14" fontWeight="950">sin x = {measure.sinValue.toFixed(2)}</text>

        <EnergyPlate
          testId="unit-shield-cos-square"
          x={122}
          y={504}
          width={cosWidth}
          color="#22D3EE"
          label="cos²x"
          value={measure.cosSquare}
          active={state.selectedLock === 'cos'}
          onClick={() => onSelectLock('cos')}
        />
        <EnergyPlate
          testId="unit-shield-sin-square"
          x={348}
          y={504}
          width={sinWidth}
          color="#A78BFA"
          label="sin²x"
          value={measure.sinSquare}
          active={state.selectedLock === 'sin'}
          onClick={() => onSelectLock('sin')}
        />
        <IdentityCore
          active={state.selectedLock === 'identity'}
          missionOk={missionOk}
          measure={measure}
          onClick={() => onSelectLock('identity')}
        />
        <FormulaReadout activeIndex={activeIndex} measure={measure} missionOk={missionOk} />
      </svg>
    </section>
  );
}

function ShieldHandle({ x, y, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="unit-shield-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Birim çember açı düğümü"
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
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#unit-shield-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">x</text>
    </g>
  );
}

function TargetRing({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g className="pointer-events-none">
      <circle cx={x} cy={y} r="34" fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="4" opacity="0.95" filter="url(#unit-shield-glow)" />
      <text x={x} y={y + 58} textAnchor="middle" fill={color} fontSize="12" fontWeight="950">{label}</text>
    </g>
  );
}

function EnergyPlate({ testId, x, y, width, color, label, value, active, onClick }: {
  testId: string;
  x: number;
  y: number;
  width: number;
  color: string;
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <g data-testid={testId} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width="190" height="72" rx="22" fill={active ? `${color}2E` : 'rgba(0,0,0,0.26)'} stroke={active ? color : 'rgba(255,255,255,0.14)'} strokeWidth="3" />
      <rect x={x + 14} y={y + 42} width={width} height="14" rx="7" fill={color} opacity="0.82" />
      <text x={x + 95} y={y + 28} textAnchor="middle" fill={color} fontSize="15" fontWeight="950">{label} = {value.toFixed(2)}</text>
    </g>
  );
}

function IdentityCore({ active, missionOk, measure, onClick }: { active: boolean; missionOk: boolean; measure: ShieldMeasure; onClick: () => void }) {
  return (
    <g data-testid="unit-shield-identity-core" role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <circle cx="680" cy="540" r="50" fill={active ? 'rgba(251,191,36,0.18)' : 'rgba(0,0,0,0.24)'} stroke={active ? '#FBBF24' : 'rgba(255,255,255,0.14)'} strokeWidth="4" filter={active ? 'url(#unit-shield-glow)' : undefined} />
      <text x="680" y="533" textAnchor="middle" fill="#FEF3C7" fontSize="16" fontWeight="950">toplam</text>
      <motion.text
        x="680"
        y="558"
        textAnchor="middle"
        fill={missionOk ? '#D1FAE5' : '#fff'}
        fontSize="24"
        fontWeight="950"
        animate={{ opacity: missionOk ? [0.58, 1, 0.58] : 1 }}
        transition={{ duration: 1.2, repeat: missionOk ? Infinity : 0 }}
      >
        {measure.sum.toFixed(0)}
      </motion.text>
    </g>
  );
}

function FormulaReadout({ activeIndex, measure, missionOk }: { activeIndex: number; measure: ShieldMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="220" y="142" width="460" height="50" rx="22" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="164" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="900">kalkan {activeIndex + 1}/3</text>
      <text x="450" y="184" textAnchor="middle" fill={missionOk ? '#D1FAE5' : '#E0F2FE'} fontSize="17" fontWeight="950">
        {measure.resultLabel}
      </text>
    </g>
  );
}
