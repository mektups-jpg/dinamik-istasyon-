import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { OscilloscopeMeasure, OscilloscopeState, OscilloscopeTarget } from './types';
import { channelValue, createWavePath, formatValue, oscFrame, phasePoint } from './oscilloscopeModel';

interface OscilloscopeSceneProps {
  state: OscilloscopeState;
  target: OscilloscopeTarget;
  measure: OscilloscopeMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function OscilloscopeScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: OscilloscopeSceneProps) {
  const phase = phasePoint(state.angle);
  const activeColor = target.channel === 'sin' ? '#38BDF8' : '#34D399';
  const activeValue = channelValue(measure, target.channel);
  const targetPhase = phasePoint(target.targetAngle);

  return (
    <section
      data-testid="trig-oscilloscope-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-200/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_82%_26%,rgba(52,211,153,0.13),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.1.1.x</p>
          <h2 className="text-2xl font-black text-white">Dijital Trigonometrik Osiloskop</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="oscilloscope-wave-screen"
        viewBox={`0 0 ${oscFrame.width} ${oscFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#03101a]/88 sm:h-[440px] xl:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="osc-grid" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <filter id="osc-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={oscFrame.width} height={oscFrame.height} fill="url(#osc-grid)" />
        <rect x="390" y="78" width="430" height="364" rx="28" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.12)" />
        <line x1={oscFrame.waveX} y1={oscFrame.waveY} x2={oscFrame.waveX + oscFrame.waveWidth} y2={oscFrame.waveY} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <line x1={oscFrame.waveX} y1={oscFrame.waveY - oscFrame.waveAmp} x2={oscFrame.waveX + oscFrame.waveWidth} y2={oscFrame.waveY - oscFrame.waveAmp} stroke="rgba(255,255,255,0.12)" strokeDasharray="7 8" />
        <line x1={oscFrame.waveX} y1={oscFrame.waveY + oscFrame.waveAmp} x2={oscFrame.waveX + oscFrame.waveWidth} y2={oscFrame.waveY + oscFrame.waveAmp} stroke="rgba(255,255,255,0.12)" strokeDasharray="7 8" />

        <circle cx={oscFrame.circleX} cy={oscFrame.circleY} r={oscFrame.radius} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.22)" strokeWidth="3" />
        <line x1={oscFrame.circleX - oscFrame.radius - 28} y1={oscFrame.circleY} x2={oscFrame.circleX + oscFrame.radius + 28} y2={oscFrame.circleY} stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1={oscFrame.circleX} y1={oscFrame.circleY - oscFrame.radius - 28} x2={oscFrame.circleX} y2={oscFrame.circleY + oscFrame.radius + 28} stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

        <circle cx={targetPhase.x} cy={targetPhase.y} r="24" fill="none" stroke="rgba(255,255,255,0.55)" strokeDasharray="7 7" strokeWidth="2" pointerEvents="none" />
        <line x1={oscFrame.circleX} y1={oscFrame.circleY} x2={phase.x} y2={phase.y} stroke="rgba(251,191,36,0.34)" strokeWidth="18" strokeLinecap="round" filter="url(#osc-glow)" pointerEvents="none" />
        <motion.line x1={oscFrame.circleX} y1={oscFrame.circleY} x2={phase.x} y2={phase.y} stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 1.1, repeat: Infinity }} pointerEvents="none" />
        <line x1={phase.x} y1={phase.y} x2={phase.x} y2={oscFrame.circleY} stroke="#38BDF8" strokeWidth="4" strokeDasharray="8 8" opacity="0.7" pointerEvents="none" />
        <line x1={phase.x} y1={phase.y} x2={oscFrame.circleX} y2={phase.y} stroke="#34D399" strokeWidth="4" strokeDasharray="8 8" opacity="0.7" pointerEvents="none" />

        <polyline points={createWavePath('sin', 360)} fill="none" stroke="#38BDF8" strokeWidth={target.channel === 'sin' ? 5 : 2} opacity={target.channel === 'sin' ? 0.92 : 0.28} />
        <polyline points={createWavePath('cos', 360)} fill="none" stroke="#34D399" strokeWidth={target.channel === 'cos' ? 5 : 2} opacity={target.channel === 'cos' ? 0.92 : 0.28} />
        <polyline points={createWavePath(target.channel, state.angle)} fill="none" stroke={activeColor} strokeWidth="8" opacity="0.28" filter="url(#osc-glow)" pointerEvents="none" />
        <circle cx={oscFrame.waveX + (state.angle / 360) * oscFrame.waveWidth} cy={oscFrame.waveY - activeValue * oscFrame.waveAmp} r="10" fill={activeColor} filter="url(#osc-glow)" pointerEvents="none" />

        <PhaseHandle x={phase.x} y={phase.y} angle={state.angle} value={activeValue} channel={target.channel} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
        <HudTag x={80} y={82} label={`θ=${Math.round(measure.angle)}°`} fill="#FBBF24" />
        <HudTag x={80} y={124} label={`sin=${formatValue(measure.sin)}`} fill="#38BDF8" />
        <HudTag x={80} y={166} label={`cos=${formatValue(measure.cos)}`} fill="#34D399" />
      </svg>
    </section>
  );
}

function PhaseHandle({ x, y, angle, value, channel, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  angle: number;
  value: number;
  channel: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="oscilloscope-phase-handle"
      role="slider"
      tabIndex={0}
      aria-label="faz kolu"
      aria-roledescription="döndürülebilir trigonometrik faz noktası"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(angle)}
      aria-valuetext={`${Math.round(angle)} derece, ${channel} değeri ${formatValue(value)}`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`Faz kolu ${Math.round(angle)} derece. Ok tuşlarıyla döndür, Home ile hedefe hizala.`}</title>
      <circle cx={x} cy={y} r="34" fill="rgba(251,191,36,0.15)" stroke="#FBBF24" strokeWidth="3" filter="url(#osc-glow)" />
      <circle cx={x} cy={y} r="18" fill="#07131d" stroke="#FBBF24" strokeWidth="4" />
    </g>
  );
}

function HudTag({ x, y, label, fill }: { x: number; y: number; label: string; fill: string }) {
  return (
    <g pointerEvents="none">
      <rect x={x - 55} y={y - 18} width="110" height="36" rx="14" fill="rgba(0,0,0,0.48)" stroke={fill} strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}
