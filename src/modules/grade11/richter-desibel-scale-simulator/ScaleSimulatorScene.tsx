import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { ScaleMeasure, ScaleMode, ScaleState, ScaleTarget } from './types';
import { compressionY, dialToRailX, modeCopy, scaleFrame, scaleTargets } from './scaleSimulatorModel';

interface ScaleSimulatorSceneProps {
  state: ScaleState;
  target: ScaleTarget;
  measure: ScaleMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

const modeTestIds: Record<ScaleMode, string> = {
  growth: 'scale-mode-growth',
  desibel: 'scale-mode-desibel',
  richter: 'scale-mode-richter',
};

export function ScaleSimulatorScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: ScaleSimulatorSceneProps) {
  const active = modeCopy[target.mode];
  const railX = dialToRailX(state.dial);
  const targetX = dialToRailX(target.targetDial);
  const meterY = compressionY(measure.compression);

  return (
    <section
      data-testid="scale-simulator-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_26px_84px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(52,211,153,0.16),transparent_33%),radial-gradient(circle_at_82%_24%,rgba(34,211,238,0.16),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.1.6.x</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Ölçek Sıkıştırma Simülatörü</h2>
        </div>
        <div className={`basis-full rounded-2xl border px-4 py-2 text-left font-mono text-xs font-black leading-relaxed sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/14 bg-black/28 text-white/82'}`}>
          {target.label}
        </div>
      </div>

      <div className="relative mb-3 grid grid-cols-3 gap-2">
        {scaleTargets.map((item) => {
          const mode = modeCopy[item.mode];
          const activeMode = item.mode === target.mode;
          return (
            <div
              key={item.mode}
              data-testid={modeTestIds[item.mode]}
              className={`rounded-2xl border px-3 py-2 text-center text-xs font-black uppercase tracking-[0.12em] ${activeMode ? 'border-white/24 bg-white/12 text-white' : 'border-white/10 bg-black/18 text-white/40'}`}
              style={activeMode ? { boxShadow: `0 0 22px ${mode.glow}` } : undefined}
            >
              {mode.short}
            </div>
          );
        })}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${scaleFrame.width} ${scaleFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#03111b]/88 sm:h-[440px] xl:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="scale-grid" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="1" />
          </pattern>
          <filter id="scale-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="scale-meter-fill" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="rgba(52,211,153,0.18)" />
            <stop offset="48%" stopColor="rgba(34,211,238,0.30)" />
            <stop offset="100%" stopColor="rgba(244,114,182,0.38)" />
          </linearGradient>
        </defs>

        <rect width={scaleFrame.width} height={scaleFrame.height} fill="url(#scale-grid)" />
        <rect x="42" y="48" width="776" height="432" rx="34" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.10)" />
        <RawMagnitudeChamber measure={measure} color={active.color} />
        <CompressionMeter measure={measure} color={active.color} markerY={meterY} />

        <g pointerEvents="none">
          <text x={scaleFrame.railX} y={scaleFrame.railY - 50} fill="rgba(255,255,255,0.68)" fontSize="16" fontWeight="950">HAM ORAN KADRANI</text>
          <line x1={scaleFrame.railX} y1={scaleFrame.railY} x2={scaleFrame.railX + scaleFrame.railWidth} y2={scaleFrame.railY} stroke="rgba(255,255,255,0.20)" strokeWidth="18" strokeLinecap="round" />
          <line x1={scaleFrame.railX} y1={scaleFrame.railY} x2={railX} y2={scaleFrame.railY} stroke={active.color} strokeWidth="10" strokeLinecap="round" opacity="0.72" />
          <line x1={targetX} y1={scaleFrame.railY - 34} x2={targetX} y2={scaleFrame.railY + 34} stroke="rgba(255,255,255,0.74)" strokeWidth="3" strokeDasharray="7 8" />
          <circle cx={targetX} cy={scaleFrame.railY} r="26" fill="none" stroke="rgba(255,255,255,0.52)" strokeDasharray="8 8" strokeWidth="2" />
          <text x={targetX} y={scaleFrame.railY + 62} textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="900">hedef</text>
        </g>

        <ScaleDial
          x={railX}
          y={scaleFrame.railY}
          color={active.color}
          target={target}
          measure={measure}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        />
      </svg>
    </section>
  );
}

function RawMagnitudeChamber({ measure, color }: { measure: ScaleMeasure; color: string }) {
  const pulse = 0.35 + measure.compression * 0.65;
  const label = measure.mode === 'growth' ? 'Koloni büyümesi' : measure.mode === 'desibel' ? 'Ses dalgası' : 'Sismik halka';
  return (
    <g pointerEvents="none">
      <rect x={scaleFrame.chamberX} y={scaleFrame.chamberY} width={scaleFrame.chamberWidth} height={scaleFrame.chamberHeight} rx="32" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.12)" />
      <text x={scaleFrame.chamberX + 30} y={scaleFrame.chamberY + 42} fill="rgba(255,255,255,0.58)" fontSize="13" fontWeight="900">{label}</text>
      <text x={scaleFrame.chamberX + 30} y={scaleFrame.chamberY + 74} fill="#fff" fontSize="25" fontWeight="950">{measure.rawLabel}</text>
      <text x={scaleFrame.chamberX + 30} y={scaleFrame.chamberY + 104} fill={color} fontSize="16" fontWeight="900">{measure.detailLabel}</text>
      <motion.circle
        cx={scaleFrame.chamberX + 300}
        cy={scaleFrame.chamberY + 168}
        r={56 + measure.compression * 66}
        fill={color}
        opacity="0.08"
        filter="url(#scale-glow)"
        animate={{ scale: [pulse, pulse + 0.08, pulse], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 1.35, repeat: Infinity }}
      />
      {[0, 1, 2, 3, 4].map((ring) => (
        <circle
          key={ring}
          cx={scaleFrame.chamberX + 300}
          cy={scaleFrame.chamberY + 168}
          r={34 + ring * (18 + measure.compression * 8)}
          fill="none"
          stroke={color}
          strokeWidth={ring === 0 ? 5 : 2}
          opacity={0.52 - ring * 0.08}
        />
      ))}
      <path
        d={`M ${scaleFrame.chamberX + 112} ${scaleFrame.chamberY + 244} C ${scaleFrame.chamberX + 186} ${scaleFrame.chamberY + 198 - measure.compression * 58}, ${scaleFrame.chamberX + 274} ${scaleFrame.chamberY + 292 - measure.compression * 82}, ${scaleFrame.chamberX + 398} ${scaleFrame.chamberY + 220 - measure.compression * 88}`}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.74"
      />
    </g>
  );
}

function CompressionMeter({ measure, color, markerY }: { measure: ScaleMeasure; color: string; markerY: number }) {
  const meterTitle = measure.mode === 'growth' ? 'HESAPLANAN MIKTAR' : measure.mode === 'desibel' ? 'DESIBEL ÖLÇEĞİ' : 'RICHTER FARKI';

  return (
    <g data-testid="scale-compression-meter" pointerEvents="none">
      <rect x={scaleFrame.meterX} y={scaleFrame.meterY} width={scaleFrame.meterWidth} height={scaleFrame.meterHeight} rx="30" fill="rgba(255,255,255,0.048)" stroke="rgba(255,255,255,0.13)" />
      <text x={scaleFrame.meterX + 22} y={scaleFrame.meterY + 40} fill="rgba(255,255,255,0.68)" fontSize="15" fontWeight="950">{meterTitle}</text>
      <rect x={scaleFrame.meterX + 66} y={scaleFrame.meterY + 66} width="46" height={scaleFrame.meterHeight - 100} rx="23" fill="rgba(255,255,255,0.09)" />
      <rect x={scaleFrame.meterX + 66} y={markerY} width="46" height={scaleFrame.meterY + scaleFrame.meterHeight - 34 - markerY} rx="23" fill="url(#scale-meter-fill)" />
      <line x1={scaleFrame.meterX + 50} y1={markerY} x2={scaleFrame.meterX + 128} y2={markerY} stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#scale-glow)" />
      <text x={scaleFrame.meterX + scaleFrame.meterWidth / 2} y={scaleFrame.meterY + 226} textAnchor="middle" fill="#fff" fontSize="23" fontWeight="950">{measure.outputLabel}</text>
      <text x={scaleFrame.meterX + scaleFrame.meterWidth / 2} y={scaleFrame.meterY + 252} textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="14" fontWeight="950">{measure.formulaLabel}</text>
    </g>
  );
}

function ScaleDial({
  x,
  y,
  color,
  target,
  measure,
  onPointerDown,
  onKeyDown,
}: {
  x: number;
  y: number;
  color: string;
  target: ScaleTarget;
  measure: ScaleMeasure;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="scale-ratio-dial"
      role="slider"
      tabIndex={0}
      aria-label="oran kadranı"
      aria-roledescription="sürüklenebilir üstel ve logaritmik oran kadranı"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(measure.dial * 100)}
      aria-valuetext={`${target.label}, ${measure.rawLabel}, ${measure.outputLabel}`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`Kadran: ${measure.rawLabel}. Ok tuşlarıyla kaydır, Home ile hedefe hizala.`}</title>
      <circle cx={x} cy={y} r="38" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#scale-glow)" />
      <circle cx={x} cy={y} r="20" fill="#04111b" stroke={color} strokeWidth="5" />
    </g>
  );
}
