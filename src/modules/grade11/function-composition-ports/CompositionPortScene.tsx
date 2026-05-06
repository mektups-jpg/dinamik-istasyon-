import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { CompositionMeasure, CompositionState } from './types';
import { compositionFrame } from './compositionModel';

interface CompositionPortSceneProps {
  state: CompositionState;
  measure: CompositionMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (kind: 'input' | 'output', event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (kind: 'input' | 'output', event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function CompositionPortScene({
  state,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: CompositionPortSceneProps) {
  const showOutput = state.phase !== 'input-ready';
  const linked = state.phase === 'linked-to-f';

  return (
    <section
      data-testid="composition-port-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.06] p-4 shadow-[0_26px_84px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_74%_24%,rgba(167,139,250,0.18),transparent_34%),radial-gradient(circle_at_72%_86%,rgba(52,211,153,0.13),transparent_36%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">bileşke deney hattı</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Fonksiyon Port İstasyonu</h2>
        </div>
        <div className={`min-w-0 max-w-full basis-full rounded-2xl border px-4 py-2 text-left font-mono text-xs font-black leading-relaxed sm:basis-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/14 bg-black/28 text-white/82'}`}>
          {measure.nextAction}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${compositionFrame.width} ${compositionFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#041120]/90 sm:h-[430px] xl:h-[500px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="composition-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
          <filter id="composition-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="composition-cable" x1="0" x2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        <rect width={compositionFrame.width} height={compositionFrame.height} fill="url(#composition-grid)" />
        <rect x="38" y="58" width="824" height="382" rx="34" fill="rgba(0,0,0,0.23)" stroke="rgba(255,255,255,0.10)" />

        <CablePath active={state.phase !== 'input-ready'} linked={linked} />
        <Machine id="composition-g-machine" x={244} y={138} label="g" formula="g(x)=2x+1" portLabel="önce" color="#22D3EE" active={state.phase !== 'input-ready'} />
        <Machine id="composition-f-machine" x={604} y={138} label="f" formula="f(u)=u²-4" portLabel="sonra" color="#A78BFA" active={linked} />

        <Port x={compositionFrame.gInput.x} y={compositionFrame.gInput.y} label="g girişi" active={state.phase === 'input-ready'} color="#22D3EE" />
        <Port x={compositionFrame.fInput.x} y={compositionFrame.fInput.y} label="f girişi" active={showOutput && !linked} color="#A78BFA" />
        <Port x={compositionFrame.finalOutput.x} y={compositionFrame.finalOutput.y} label="sonuç" active={linked} color="#34D399" />

        <InputCapsule state={state} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
        {showOutput ? <OutputCapsule state={state} onPointerDown={onPointerDown} onKeyDown={onKeyDown} /> : null}

        <ResultPanel measure={measure} linked={linked} />
      </svg>
    </section>
  );
}

function CablePath({ active, linked }: { active: boolean; linked: boolean }) {
  return (
    <g data-testid="composition-link-cable" pointerEvents="none">
      <path
        d={`M ${compositionFrame.inputHome.x + 54} ${compositionFrame.inputHome.y} C 178 228, 206 228, ${compositionFrame.gInput.x - 6} ${compositionFrame.gInput.y}`}
        fill="none"
        stroke={active ? '#22D3EE' : 'rgba(255,255,255,0.16)'}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={active ? '0' : '12 14'}
        opacity={active ? 0.82 : 0.48}
      />
      <path
        d={`M ${compositionFrame.gOutput.x} ${compositionFrame.gOutput.y} C 540 222, 568 222, ${compositionFrame.fInput.x - 8} ${compositionFrame.fInput.y}`}
        fill="none"
        stroke={linked ? 'url(#composition-cable)' : 'rgba(255,255,255,0.18)'}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={linked ? '0' : '10 14'}
        opacity={linked ? 0.92 : 0.54}
      />
      {linked ? (
        <motion.path
          d={`M ${compositionFrame.fInput.x + 10} ${compositionFrame.fInput.y} C 690 230, 730 232, ${compositionFrame.finalOutput.x - 34} ${compositionFrame.finalOutput.y}`}
          fill="none"
          stroke="#34D399"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#composition-glow)"
          animate={{ opacity: [0.42, 0.95, 0.42] }}
          transition={{ duration: 1.25, repeat: Infinity }}
        />
      ) : null}
    </g>
  );
}

function Machine({ id, x, y, label, formula, portLabel, color, active }: { id: string; x: number; y: number; label: string; formula: string; portLabel: string; color: string; active: boolean }) {
  return (
    <g data-testid={id} pointerEvents="none">
      <rect x={x} y={y} width="196" height="244" rx="34" fill={active ? `${color}18` : 'rgba(255,255,255,0.052)'} stroke={active ? color : 'rgba(255,255,255,0.14)'} strokeWidth={active ? 3 : 2} />
      <circle cx={x + 98} cy={y + 84} r="54" fill={`${color}22`} stroke={color} strokeWidth="3" filter={active ? 'url(#composition-glow)' : undefined} />
      <text x={x + 98} y={y + 101} textAnchor="middle" fill="#fff" fontSize="58" fontWeight="950">{label}</text>
      <text x={x + 98} y={y + 168} textAnchor="middle" fill={color} fontSize="22" fontWeight="950">{formula}</text>
      <text x={x + 98} y={y + 202} textAnchor="middle" fill="rgba(255,255,255,0.56)" fontSize="14" fontWeight="900">{portLabel} çalışır</text>
    </g>
  );
}

function Port({ x, y, label, active, color }: { x: number; y: number; label: string; active: boolean; color: string }) {
  return (
    <g pointerEvents="none">
      <circle cx={x} cy={y} r="27" fill={active ? `${color}26` : 'rgba(255,255,255,0.07)'} stroke={active ? color : 'rgba(255,255,255,0.18)'} strokeWidth="4" strokeDasharray={active ? '0' : '7 8'} />
      <text x={x} y={y + 56} textAnchor="middle" fill="rgba(255,255,255,0.60)" fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}

function InputCapsule({ state, onPointerDown, onKeyDown }: { state: CompositionState; onPointerDown: (kind: 'input' | 'output', event: ReactPointerEvent<SVGElement>) => void; onKeyDown: (kind: 'input' | 'output', event: ReactKeyboardEvent<SVGGElement>) => void }) {
  const locked = state.phase !== 'input-ready';
  const point = locked ? compositionFrame.gInput : state.input;
  return (
    <g
      data-testid="composition-input-capsule"
      role="slider"
      tabIndex={0}
      aria-label="x giriş kapsülü"
      aria-roledescription="sürüklenebilir fonksiyon girdisi"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={locked ? 100 : 0}
      aria-valuetext={locked ? 'x kapsülü g makinesine takıldı' : 'x kapsülü g portuna taşınmayı bekliyor'}
      aria-keyshortcuts="Home"
      onPointerDown={(event) => {
        if (!locked) onPointerDown('input', event);
      }}
      onKeyDown={(event) => onKeyDown('input', event)}
      style={{ cursor: locked ? 'default' : 'grab', touchAction: 'none' }}
    >
      <title>Home ile x kapsülünü g portuna hizala.</title>
      <Capsule x={point.x} y={point.y} label="x=3" color="#22D3EE" locked={locked} />
    </g>
  );
}

function OutputCapsule({ state, onPointerDown, onKeyDown }: { state: CompositionState; onPointerDown: (kind: 'input' | 'output', event: ReactPointerEvent<SVGElement>) => void; onKeyDown: (kind: 'input' | 'output', event: ReactKeyboardEvent<SVGGElement>) => void }) {
  const locked = state.phase === 'linked-to-f';
  const point = locked ? compositionFrame.fInput : state.output;
  return (
    <g
      data-testid="composition-output-capsule"
      role="slider"
      tabIndex={0}
      aria-label="g x ara çıktı kapsülü"
      aria-roledescription="sürüklenebilir bileşke ara çıktısı"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={locked ? 100 : 45}
      aria-valuetext={locked ? 'g(x) çıktısı f portuna bağlandı' : 'g(x) çıktısı f portuna taşınmayı bekliyor'}
      aria-keyshortcuts="Home"
      onPointerDown={(event) => {
        if (!locked) onPointerDown('output', event);
      }}
      onKeyDown={(event) => onKeyDown('output', event)}
      style={{ cursor: locked ? 'default' : 'grab', touchAction: 'none' }}
    >
      <title>Home ile g(x)=7 kapsülünü f portuna hizala.</title>
      <Capsule x={point.x} y={point.y} label="g(x)=7" color="#A78BFA" locked={locked} />
    </g>
  );
}

function Capsule({ x, y, label, color, locked }: { x: number; y: number; label: string; color: string; locked: boolean }) {
  return (
    <g>
      <rect x={x - 54} y={y - 28} width="108" height="56" rx="28" fill={locked ? `${color}30` : '#071828'} stroke={color} strokeWidth="4" filter="url(#composition-glow)" />
      <text x={x} y={y + 7} textAnchor="middle" fill="#fff" fontSize="19" fontWeight="950">{label}</text>
    </g>
  );
}

function ResultPanel({ measure, linked }: { measure: CompositionMeasure; linked: boolean }) {
  return (
    <g pointerEvents="none">
      <rect x="122" y="414" width="656" height="70" rx="26" fill={linked ? 'rgba(52,211,153,0.17)' : 'rgba(255,255,255,0.078)'} stroke={linked ? 'rgba(52,211,153,0.58)' : 'rgba(255,255,255,0.18)'} />
      <text x="450" y="445" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="13" fontWeight="950">zincir okuması</text>
      <text x="450" y="472" textAnchor="middle" fill={linked ? '#C8FDDC' : '#fff'} fontSize="25" fontWeight="950">{measure.chainLabel}</text>
    </g>
  );
}
