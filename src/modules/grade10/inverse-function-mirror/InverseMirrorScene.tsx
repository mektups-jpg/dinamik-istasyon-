import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import {
  inverseFrame,
  inverseSealLabels,
  inverseSealOptions,
  inverseTargets,
  progressToRailX,
} from './inverseModel';
import { InverseDragTarget, InverseMeasure, InverseMirrorState, InverseSeal } from './types';

interface InverseMirrorSceneProps {
  state: InverseMirrorState;
  activeIndex: number;
  measure: InverseMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: InverseDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: InverseDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
  onSelectSeal: (seal: InverseSeal) => void;
}

export function InverseMirrorScene({
  state,
  activeIndex,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onSelectSeal,
}: InverseMirrorSceneProps) {
  const target = inverseTargets[activeIndex];
  const mirrorOpacity = 0.18 + state.mirrorArm * 0.82;
  const inputX = lerp(160, 318, state.inputCapsule);
  const outputX = lerp(740, 582, state.outputCapsule);

  return (
    <section
      data-testid="inverse-mirror-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(34,211,238,0.17),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(167,139,250,0.15),transparent_34%),radial-gradient(circle_at_50%_78%,rgba(251,191,36,0.11),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.2.5</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Ters Fonksiyon Ayna Odası</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${inverseFrame.width} ${inverseFrame.height}`}
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="inverse-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="inverse-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="inverse-mirror-beam" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>

        <rect width={inverseFrame.width} height={inverseFrame.height} fill="url(#inverse-grid)" />
        <rect x="62" y="52" width="776" height="560" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <GraphStage activeIndex={activeIndex} mirrorOpacity={mirrorOpacity} branchOpen={state.branchGate >= 0.9} />
        <MachinePorts inputX={inputX} outputX={outputX} activeIndex={activeIndex} />
        <BranchGate progress={state.branchGate} active={activeIndex === 1} onPointerDown={(event) => onPointerDown('branch-gate', event)} onKeyDown={(event) => onKeyDown('branch-gate', event)} />

        <Capsule
          testId="inverse-input-capsule"
          x={inputX}
          y={488}
          label="x"
          value={activeIndex === 2 ? '2' : '3'}
          color="#22D3EE"
          onPointerDown={(event) => onPointerDown('input-capsule', event)}
          onKeyDown={(event) => onKeyDown('input-capsule', event)}
        />
        <Capsule
          testId="inverse-output-capsule"
          x={outputX}
          y={488}
          label="f(x)"
          value={activeIndex === 0 ? '7' : activeIndex === 1 ? '9' : '1/2'}
          color="#A78BFA"
          onPointerDown={(event) => onPointerDown('output-capsule', event)}
          onKeyDown={(event) => onKeyDown('output-capsule', event)}
        />
        <MirrorArm
          progress={state.mirrorArm}
          onPointerDown={(event) => onPointerDown('mirror-arm', event)}
          onKeyDown={(event) => onKeyDown('mirror-arm', event)}
        />
        <SealPads selectedSeal={state.selectedSeal} missionOk={missionOk} accent={target.accent} onSelectSeal={onSelectSeal} />
        <ControlRail
          label={activeIndex === 1 ? 'dal seçimi' : 'ayna gücü'}
          valueLabel={activeIndex === 1 ? `%${Math.round(state.branchGate * 100)}` : `%${Math.round(state.mirrorArm * 100)}`}
          progress={activeIndex === 1 ? state.branchGate : state.mirrorArm}
          color={target.accent}
        />

        <text x="450" y="628" textAnchor="middle" fill="rgba(255,255,255,0.64)" fontSize="14" fontWeight="900">{measure.equation}</text>
      </svg>
    </section>
  );
}

function GraphStage({ activeIndex, mirrorOpacity, branchOpen }: { activeIndex: number; mirrorOpacity: number; branchOpen: boolean }) {
  const accent = inverseTargets[activeIndex].accent;
  return (
    <g transform="translate(122 88)">
      <rect width="656" height="382" rx="28" fill="rgba(0,0,0,0.24)" stroke="rgba(255,255,255,0.11)" />
      <line x1="72" y1="310" x2="584" y2="54" stroke="url(#inverse-mirror-beam)" strokeWidth="5" opacity={mirrorOpacity} filter="url(#inverse-glow)" />
      <rect x="532" y="24" width="104" height="32" rx="14" fill="rgba(0,0,0,0.42)" stroke="rgba(196,181,253,0.35)" />
      <text x="584" y="45" textAnchor="middle" fill="#E9D5FF" fontSize="13" fontWeight="900">y=x aynası</text>
      <path d={activePath(activeIndex, false)} fill="none" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" filter="url(#inverse-glow)" />
      <path d={activePath(activeIndex, true)} fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" opacity={mirrorOpacity} strokeDasharray={mirrorOpacity < 0.9 ? '10 10' : undefined} filter="url(#inverse-glow)" />
      {activeIndex === 1 && !branchOpen && (
        <g>
          <rect x="100" y="60" width="176" height="252" rx="24" fill="rgba(244,63,94,0.14)" stroke="#FB7185" strokeWidth="2" strokeDasharray="8 8" />
          <text x="188" y="194" textAnchor="middle" fill="#FFE4E6" fontSize="16" fontWeight="900">çift dal alarmı</text>
        </g>
      )}
      <circle cx="328" cy="191" r="70" fill="rgba(255,255,255,0.04)" stroke={accent} strokeWidth="2" opacity="0.55" />
    </g>
  );
}

function activePath(activeIndex: number, inverse: boolean) {
  if (activeIndex === 0) {
    return inverse ? 'M 142 298 C 248 246, 400 170, 520 110' : 'M 150 282 C 266 222, 382 164, 506 102';
  }
  if (activeIndex === 1) {
    return inverse ? 'M 334 304 C 404 300, 486 246, 548 128' : 'M 150 108 C 240 256, 330 306, 506 306';
  }
  return inverse ? 'M 158 110 C 248 184, 402 218, 528 300' : 'M 162 300 C 288 218, 402 184, 526 110';
}

function MachinePorts({ inputX, outputX, activeIndex }: { inputX: number; outputX: number; activeIndex: number }) {
  return (
    <g>
      <line x1={inputX + 52} y1="488" x2="384" y2="488" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
      <line x1="516" y1="488" x2={outputX - 52} y2="488" stroke="#A78BFA" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
      <rect x="384" y="448" width="132" height="80" rx="24" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" />
      <text x="450" y="481" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900">{activeIndex === 0 ? 'f(x)=2x+1' : activeIndex === 1 ? 'f(x)=x²' : 'f(x)=1/x'}</text>
      <text x="450" y="506" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="12" fontWeight="900">ters port</text>
    </g>
  );
}

function Capsule({ testId, x, y, label, value, color, onPointerDown, onKeyDown }: {
  testId: string;
  x: number;
  y: number;
  label: string;
  value: string;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid={testId}
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      transform={`translate(${x} ${y})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
    >
      <rect x="-52" y="-28" width="104" height="56" rx="22" fill={`${color}24`} stroke={color} strokeWidth="4" filter="url(#inverse-glow)" />
      <text x="0" y="-5" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
      <text x="0" y="16" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">{value}</text>
    </g>
  );
}

function BranchGate({ progress, active, onPointerDown, onKeyDown }: {
  progress: number;
  active: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const y = lerp(174, 90, progress);
  return (
    <g
      data-testid="inverse-branch-gate"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Dal seçimi kapısı"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      transform={`translate(260 ${y})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: active ? 'grab' : 'default' }}
      opacity={active ? 1 : 0.1}
      pointerEvents={active ? 'auto' : 'none'}
    >
      <rect x="-70" y="-26" width="140" height="52" rx="18" fill="rgba(251,191,36,0.18)" stroke="#FBBF24" strokeWidth="4" filter="url(#inverse-glow)" />
      <text x="0" y="6" textAnchor="middle" fill="#FEF3C7" fontSize="14" fontWeight="900">TEK DAL</text>
    </g>
  );
}

function MirrorArm({ progress, onPointerDown, onKeyDown }: {
  progress: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const x = progressToRailX(progress);
  return (
    <g>
      <line x1={inverseFrame.railX} y1={inverseFrame.railY} x2={inverseFrame.railX + inverseFrame.railWidth} y2={inverseFrame.railY} stroke="rgba(255,255,255,0.18)" strokeWidth="14" strokeLinecap="round" />
      <line x1={inverseFrame.railX} y1={inverseFrame.railY} x2={x} y2={inverseFrame.railY} stroke="#22D3EE" strokeWidth="7" strokeLinecap="round" />
      <g
        data-testid="inverse-mirror-arm"
        role="slider"
        tabIndex={0}
        focusable="true"
        aria-label="Ayna kolu"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        transform={`translate(${x} ${inverseFrame.railY})`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        style={{ cursor: 'grab' }}
      >
        <circle r="28" fill="transparent" />
        <circle r="20" fill="#07111c" stroke="#22D3EE" strokeWidth="4" filter="url(#inverse-glow)" />
        <circle r="6" fill="#fff" />
      </g>
    </g>
  );
}

function SealPads({ selectedSeal, missionOk, accent, onSelectSeal }: { selectedSeal: InverseSeal | null; missionOk: boolean; accent: string; onSelectSeal: (seal: InverseSeal) => void }) {
  return (
    <g transform="translate(252 532)">
      {inverseSealOptions.map((seal, index) => {
        const selected = selectedSeal === seal;
        return (
          <g
            key={seal}
            data-testid={`inverse-seal-${seal}`}
            role="button"
            tabIndex={0}
            focusable="true"
            transform={`translate(${index * 132} 0)`}
            onClick={() => onSelectSeal(seal)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectSeal(seal);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <rect width="116" height="58" rx="18" fill={selected ? `${accent}26` : 'rgba(255,255,255,0.055)'} stroke={selected ? (missionOk ? '#6EE7B7' : accent) : 'rgba(255,255,255,0.28)'} strokeWidth={selected ? 3 : 1.5} />
            <text x="58" y="22" textAnchor="middle" fill={selected ? '#fff' : 'rgba(255,255,255,0.46)'} fontSize="9" fontWeight="900" letterSpacing="2">MÜHÜR</text>
            <text x="58" y="42" textAnchor="middle" fill={selected ? '#fff' : 'rgba(255,255,255,0.72)'} fontSize="13" fontWeight="900">{inverseSealLabels[seal]}</text>
            {selected && <circle cx="102" cy="14" r="6" fill={missionOk ? '#6EE7B7' : accent} />}
          </g>
        );
      })}
    </g>
  );
}

function ControlRail({ label, valueLabel, progress, color }: { label: string; valueLabel: string; progress: number; color: string }) {
  return (
    <g pointerEvents="none">
      <text x={inverseFrame.railX - 16} y={inverseFrame.railY + 5} textAnchor="end" fill="rgba(255,255,255,0.64)" fontSize="12" fontWeight="900">{label}</text>
      <text x={inverseFrame.railX + inverseFrame.railWidth + 18} y={inverseFrame.railY + 5} fill={color} fontSize="12" fontWeight="900">{valueLabel}</text>
      <motion.circle
        cx={progressToRailX(progress)}
        cy={inverseFrame.railY}
        r="31"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.44"
        animate={{ r: [28, 35, 28] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </g>
  );
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}
