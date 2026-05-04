import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { LogDragTarget, LogMirrorMeasure, LogMirrorState, LogMirrorTarget } from './types';
import {
  baseToRailX,
  createExpGhostCurve,
  createLogGhostCurve,
  createMirrorCurve,
  formatBase,
  formatPercent,
  logFrame,
  mirrorToRailX,
  valueToPlotX,
  valueToPlotY,
} from './logMirrorModel';

interface LogMirrorSceneProps {
  state: LogMirrorState;
  target: LogMirrorTarget;
  measure: LogMirrorMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: LogDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: LogDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function LogMirrorScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: LogMirrorSceneProps) {
  const activeColor = measure.mode === 'decay' ? '#A78BFA' : '#22D3EE';
  const baseX = baseToRailX(state.base);
  const mirrorX = mirrorToRailX(state.mirrorPower);
  const neutralBaseX = baseToRailX(1);

  return (
    <section
      data-testid="logarithm-mirror-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-100/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_78%_30%,rgba(244,114,182,0.15),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.1.4-5</p>
          <h2 className="text-2xl font-black text-white">Logaritma Ters Ayna Odası</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="logarithm-graph-screen"
        viewBox={`0 0 ${logFrame.width} ${logFrame.height}`}
        className="relative h-[400px] w-full touch-none rounded-[28px] border border-white/12 bg-[#04101b]/88 sm:h-[450px] xl:h-[560px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="log-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <filter id="log-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={logFrame.width} height={logFrame.height} fill="url(#log-grid)" />
        <rect x={logFrame.plotX} y={logFrame.plotY} width={logFrame.plotWidth} height={logFrame.plotHeight} rx="30" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.13)" />
        <line x1={valueToPlotX(logFrame.minAxis)} y1={valueToPlotY(0)} x2={valueToPlotX(logFrame.maxAxis)} y2={valueToPlotY(0)} stroke="rgba(255,255,255,0.26)" strokeWidth="2" />
        <line x1={valueToPlotX(0)} y1={valueToPlotY(logFrame.minAxis)} x2={valueToPlotX(0)} y2={valueToPlotY(logFrame.maxAxis)} stroke="rgba(255,255,255,0.26)" strokeWidth="2" />
        <motion.line
          x1={valueToPlotX(logFrame.minAxis)}
          y1={valueToPlotY(logFrame.minAxis)}
          x2={valueToPlotX(logFrame.maxAxis)}
          y2={valueToPlotY(logFrame.maxAxis)}
          stroke="#FBBF24"
          strokeWidth="4"
          strokeDasharray="9 9"
          animate={{ opacity: state.mirrorPower > 0.9 ? [0.68, 1, 0.68] : 0.42 }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <text x={valueToPlotX(4.8)} y={valueToPlotY(4.6)} fill="#FBBF24" fontSize="15" fontWeight="900">y=x aynası</text>

        <polyline points={createExpGhostCurve(state.base)} fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.22" strokeDasharray="8 9" />
        <polyline points={createLogGhostCurve(state.base)} fill="none" stroke="#A78BFA" strokeWidth="3" opacity="0.22" strokeDasharray="7 8" />
        <polyline points={createMirrorCurve(state.base, state.mirrorPower)} fill="none" stroke={activeColor} strokeWidth="13" opacity="0.16" filter="url(#log-glow)" pointerEvents="none" />
        <motion.polyline
          points={createMirrorCurve(state.base, state.mirrorPower)}
          fill="none"
          stroke={activeColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: [0.76, 1, 0.76] }}
          transition={{ duration: 1.25, repeat: Infinity }}
          pointerEvents="none"
        />

        <g pointerEvents="none">
          <rect x="110" y="82" width="196" height="88" rx="24" fill="rgba(0,0,0,0.42)" stroke="rgba(255,255,255,0.12)" />
          <text x="132" y="116" fill="#fff" fontSize="17" fontWeight="900">{`a=${formatBase(state.base)}`}</text>
          <text x="132" y="146" fill={activeColor} fontSize="14" fontWeight="900">{state.mirrorPower > 0.9 ? 'log_a(x)' : 'a^x dönüşüyor'}</text>
        </g>

        <RailLabel x={logFrame.baseRailX} y={logFrame.baseRailY - 34} label="taban çekirdeği" />
        <line x1={logFrame.baseRailX} y1={logFrame.baseRailY} x2={logFrame.baseRailX + logFrame.baseRailWidth} y2={logFrame.baseRailY} stroke="rgba(255,255,255,0.2)" strokeWidth="16" strokeLinecap="round" />
        <line x1={logFrame.baseRailX} y1={logFrame.baseRailY} x2={neutralBaseX} y2={logFrame.baseRailY} stroke="rgba(167,139,250,0.42)" strokeWidth="9" strokeLinecap="round" />
        <line x1={neutralBaseX} y1={logFrame.baseRailY} x2={logFrame.baseRailX + logFrame.baseRailWidth} y2={logFrame.baseRailY} stroke="rgba(34,211,238,0.44)" strokeWidth="9" strokeLinecap="round" />
        <line x1={neutralBaseX} y1={logFrame.baseRailY - 30} x2={neutralBaseX} y2={logFrame.baseRailY + 30} stroke="#FBBF24" strokeWidth="3" strokeDasharray="7 7" />

        <RailLabel x={logFrame.mirrorRailX} y={logFrame.mirrorRailY - 34} label="ayna gücü" />
        <line x1={logFrame.mirrorRailX} y1={logFrame.mirrorRailY} x2={logFrame.mirrorRailX + logFrame.mirrorRailWidth} y2={logFrame.mirrorRailY} stroke="rgba(255,255,255,0.2)" strokeWidth="16" strokeLinecap="round" />
        <line x1={logFrame.mirrorRailX} y1={logFrame.mirrorRailY} x2={mirrorX} y2={logFrame.mirrorRailY} stroke="rgba(251,191,36,0.58)" strokeWidth="9" strokeLinecap="round" />

        <SliderHandle
          testId="logarithm-base-handle"
          x={baseX}
          y={logFrame.baseRailY}
          color={activeColor}
          label={`a=${formatBase(state.base)}`}
          ariaLabel="logaritma taban sürgüsü"
          value={state.base}
          min={0.25}
          max={3}
          onPointerDown={(event) => onPointerDown('base', event)}
          onKeyDown={(event) => onKeyDown('base', event)}
        />
        <SliderHandle
          testId="logarithm-mirror-handle"
          x={mirrorX}
          y={logFrame.mirrorRailY}
          color="#FBBF24"
          label={formatPercent(state.mirrorPower)}
          ariaLabel="ters ayna sürgüsü"
          value={Math.round(state.mirrorPower * 100)}
          min={0}
          max={100}
          onPointerDown={(event) => onPointerDown('mirror', event)}
          onKeyDown={(event) => onKeyDown('mirror', event)}
        />
      </svg>
    </section>
  );
}

function SliderHandle({ testId, x, y, color, label, ariaLabel, value, min, max, onPointerDown, onKeyDown }: {
  testId: string;
  x: number;
  y: number;
  color: string;
  label: string;
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid={testId}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${label}. Ok tuşlarıyla kaydır, Home ile göreve hizala.`}</title>
      <circle cx={x} cy={y} r="33" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#log-glow)" />
      <circle cx={x} cy={y} r="17" fill="#06111d" stroke={color} strokeWidth="5" />
      <text x={x} y={y + 54} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">{label}</text>
    </g>
  );
}

function RailLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return <text x={x} y={y} fill="rgba(255,255,255,0.55)" fontSize="12" fontWeight="900" letterSpacing="2">{label.toUpperCase()}</text>;
}
