import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { ExponentialMeasure, ExponentialState, ExponentialTarget } from './types';
import {
  baseToRailX,
  createCurvePath,
  createEnergyBars,
  exponentialFrame,
  formatBase,
  formatValue,
} from './exponentialModel';

interface ExponentialGrowthSceneProps {
  state: ExponentialState;
  target: ExponentialTarget;
  measure: ExponentialMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

const modeCopy = {
  growth: 'Artan enerji',
  decay: 'Sönen enerji',
  neutral: 'Nötr kapı',
};

export function ExponentialGrowthScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: ExponentialGrowthSceneProps) {
  const railX = baseToRailX(state.base);
  const targetRailX = baseToRailX(target.targetBase);
  const neutralX = baseToRailX(1);
  const bars = createEnergyBars(state.base);
  const activeColor = measure.mode === 'decay' ? '#A78BFA' : measure.mode === 'growth' ? '#22D3EE' : '#FBBF24';

  return (
    <section
      data-testid="exponential-growth-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-100/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_82%_30%,rgba(167,139,250,0.16),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.1.3.x</p>
          <h2 className="text-2xl font-black text-white">Üstel Büyüme Reaktörü</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="exponential-graph-screen"
        viewBox={`0 0 ${exponentialFrame.width} ${exponentialFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#04101b]/88 sm:h-[440px] xl:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="exp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <linearGradient id="exp-growth-fill" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(167,139,250,0.16)" />
            <stop offset="52%" stopColor="rgba(251,191,36,0.08)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.18)" />
          </linearGradient>
          <filter id="exp-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={exponentialFrame.width} height={exponentialFrame.height} fill="url(#exp-grid)" />
        <rect x={exponentialFrame.plotX} y={exponentialFrame.plotY} width={exponentialFrame.plotWidth} height={exponentialFrame.plotHeight} rx="30" fill="url(#exp-growth-fill)" stroke="rgba(255,255,255,0.13)" />
        <line x1={exponentialFrame.plotX + 18} y1={exponentialFrame.axisY} x2={exponentialFrame.plotX + exponentialFrame.plotWidth - 18} y2={exponentialFrame.axisY} stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <line x1={exponentialFrame.plotX + exponentialFrame.plotWidth / 2} y1={exponentialFrame.plotY + 26} x2={exponentialFrame.plotX + exponentialFrame.plotWidth / 2} y2={exponentialFrame.axisY + 36} stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        <text x={exponentialFrame.plotX + exponentialFrame.plotWidth - 30} y={exponentialFrame.axisY + 34} fill="rgba(255,255,255,0.55)" fontSize="16" fontWeight="900">x</text>
        <text x={exponentialFrame.plotX + exponentialFrame.plotWidth / 2 + 14} y={exponentialFrame.plotY + 42} fill="rgba(255,255,255,0.55)" fontSize="16" fontWeight="900">f(x)</text>

        {bars.map((bar) => (
          <g key={bar.x} pointerEvents="none">
            <rect x={bar.px - 11} y={bar.py} width="22" height={Math.max(4, bar.height)} rx="9" fill={activeColor} opacity={0.22 + Math.min(0.52, bar.value / 8)} />
            <circle cx={bar.px} cy={bar.py} r="9" fill={activeColor} filter="url(#exp-glow)" />
            <text x={bar.px} y={exponentialFrame.axisY + 28} textAnchor="middle" fill="rgba(255,255,255,0.52)" fontSize="13" fontWeight="900">{bar.x}</text>
          </g>
        ))}

        <polyline points={createCurvePath(state.base)} fill="none" stroke={activeColor} strokeWidth="12" opacity="0.18" filter="url(#exp-glow)" pointerEvents="none" />
        <motion.polyline
          points={createCurvePath(state.base)}
          fill="none"
          stroke={activeColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: [0.74, 1, 0.74] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          pointerEvents="none"
        />

        <g pointerEvents="none">
          <rect x="102" y="88" width="178" height="86" rx="24" fill="rgba(0,0,0,0.42)" stroke="rgba(255,255,255,0.12)" />
          <text x="126" y="122" fill="#fff" fontSize="18" fontWeight="900">{`a = ${formatBase(state.base)}`}</text>
          <text x="126" y="151" fill={activeColor} fontSize="14" fontWeight="900">{modeCopy[measure.mode]}</text>
        </g>

        <g pointerEvents="none">
          <line x1={exponentialFrame.railX} y1={exponentialFrame.railY} x2={exponentialFrame.railX + exponentialFrame.railWidth} y2={exponentialFrame.railY} stroke="rgba(255,255,255,0.20)" strokeWidth="18" strokeLinecap="round" />
          <line x1={exponentialFrame.railX} y1={exponentialFrame.railY} x2={neutralX} y2={exponentialFrame.railY} stroke="rgba(167,139,250,0.42)" strokeWidth="10" strokeLinecap="round" />
          <line x1={neutralX} y1={exponentialFrame.railY} x2={exponentialFrame.railX + exponentialFrame.railWidth} y2={exponentialFrame.railY} stroke="rgba(34,211,238,0.44)" strokeWidth="10" strokeLinecap="round" />
          <line x1={neutralX} y1={exponentialFrame.railY - 42} x2={neutralX} y2={exponentialFrame.railY + 42} stroke="#FBBF24" strokeWidth="4" strokeDasharray="8 8" />
          <text x={neutralX} y={exponentialFrame.railY + 64} textAnchor="middle" fill="#FBBF24" fontSize="14" fontWeight="900">a=1</text>
          <circle cx={targetRailX} cy={exponentialFrame.railY} r="25" fill="none" stroke="rgba(255,255,255,0.64)" strokeDasharray="7 7" strokeWidth="2" />
        </g>

        <BaseHandle
          x={railX}
          y={exponentialFrame.railY}
          base={state.base}
          mode={measure.mode}
          color={activeColor}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        />

        <HudTag x={655} y={102} label={`f(-2)=${formatValue(measure.leftValue)}`} fill="#A78BFA" />
        <HudTag x={655} y={146} label={`f(0)=${formatValue(measure.midValue)}`} fill="#FBBF24" />
        <HudTag x={655} y={190} label={`f(2)=${formatValue(measure.rightValue)}`} fill="#22D3EE" />
      </svg>
    </section>
  );
}

function BaseHandle({ x, y, base, mode, color, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  base: number;
  mode: string;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="exponential-base-handle"
      role="slider"
      tabIndex={0}
      aria-label="üstel taban sürgüsü"
      aria-roledescription="sürüklenebilir üstel fonksiyon tabanı"
      aria-valuemin={0.25}
      aria-valuemax={3}
      aria-valuenow={Number(formatBase(base))}
      aria-valuetext={`a tabanı ${formatBase(base)}, ${mode}`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`Taban ${formatBase(base)}. Ok tuşlarıyla kaydır, Home ile göreve hizala.`}</title>
      <circle cx={x} cy={y} r="36" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#exp-glow)" />
      <circle cx={x} cy={y} r="19" fill="#06111d" stroke={color} strokeWidth="5" />
      <text x={x} y={y + 58} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="900">{`a=${formatBase(base)}`}</text>
    </g>
  );
}

function HudTag({ x, y, label, fill }: { x: number; y: number; label: string; fill: string }) {
  return (
    <g pointerEvents="none">
      <rect x={x - 72} y={y - 18} width="144" height="36" rx="14" fill="rgba(0,0,0,0.48)" stroke={fill} strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}
