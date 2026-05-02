import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { AsymptoteMeasure, AsymptoteState, AsymptoteTarget, GateId } from './types';
import { asymptoteFrame, createGraphSegments, formatValue, gateLabels, graphValue, visibleGatesByChannel, xFromAngle, yFromValue } from './asymptoteModel';

interface AsymptoteSceneProps {
  state: AsymptoteState;
  target: AsymptoteTarget;
  measure: AsymptoteMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onGatePointerDown: (gate: GateId, event: ReactPointerEvent<SVGElement>) => void;
  onScannerPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onGateKeyDown: (gate: GateId, event: ReactKeyboardEvent<SVGGElement>) => void;
  onScannerKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function AsymptoteScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onGatePointerDown,
  onScannerPointerDown,
  onPointerMove,
  onPointerUp,
  onGateKeyDown,
  onScannerKeyDown,
}: AsymptoteSceneProps) {
  const graphColor = target.channel === 'tan' ? '#38BDF8' : '#A78BFA';
  const visibleGates = visibleGatesByChannel[target.channel];
  const graphSegments = createGraphSegments(target.channel);
  const scannerValue = graphValue(target.channel, state.scannerAngle);
  const scannerX = xFromAngle(state.scannerAngle);
  const scannerY = scannerValue === null ? asymptoteFrame.axisY : yFromValue(scannerValue);

  return (
    <section
      data-testid="tangent-asymptote-scene"
      className="relative overflow-hidden rounded-[32px] border border-fuchsia-200/15 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.15),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(217,70,239,0.15),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-100/58">makro atom: MAT.11.1.1.3-4</p>
          <h2 className="text-2xl font-black text-white">Asimptot Kapı Tüneli</h2>
        </div>
        <div className={`w-full max-w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="asymptote-graph-screen"
        viewBox={`0 0 ${asymptoteFrame.width} ${asymptoteFrame.height}`}
        className="relative h-[280px] w-full touch-none rounded-[28px] border border-white/12 bg-[#050713]/90 sm:h-[420px] xl:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="asym-grid" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="1" />
          </pattern>
          <filter id="asym-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={asymptoteFrame.width} height={asymptoteFrame.height} fill="url(#asym-grid)" />
        <rect x={asymptoteFrame.plotX} y={asymptoteFrame.plotY} width={asymptoteFrame.plotWidth} height={asymptoteFrame.plotHeight} rx="30" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.12)" />
        <line x1={asymptoteFrame.plotX} y1={asymptoteFrame.axisY} x2={asymptoteFrame.plotX + asymptoteFrame.plotWidth} y2={asymptoteFrame.axisY} stroke="rgba(255,255,255,0.24)" strokeWidth="2" />
        {[0, 90, 180, 270, 360].map((angle) => (
          <g key={angle} pointerEvents="none">
            <line x1={xFromAngle(angle)} y1={asymptoteFrame.plotY + 16} x2={xFromAngle(angle)} y2={asymptoteFrame.plotY + asymptoteFrame.plotHeight - 16} stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
            <text x={xFromAngle(angle)} y={asymptoteFrame.plotY + asymptoteFrame.plotHeight + 30} textAnchor="middle" fill="rgba(255,255,255,0.52)" fontSize="12" fontWeight="800">{angle}°</text>
          </g>
        ))}

        {Object.values(target.gateTargets).map((angle) => (
          <TargetWall key={`${target.id}-${angle}`} angle={angle} channel={target.channel} />
        ))}

        {graphSegments.map((segment, index) => (
          <polyline key={`${target.channel}-${index}`} points={segment.join(' ')} fill="none" stroke={graphColor} strokeWidth="5" opacity="0.88" filter="url(#asym-glow)" pointerEvents="none" />
        ))}

        {visibleGates.map((gate) => (
          <AsymptoteGate
            key={gate}
            gate={gate}
            angle={state.gates[gate]}
            active={target.activeGates.includes(gate)}
            matched={isMatchedGate(state.gates[gate], target.gateTargets[gate])}
            onPointerDown={(event) => onGatePointerDown(gate, event)}
            onKeyDown={(event) => onGateKeyDown(gate, event)}
          />
        ))}

        <Scanner
          x={scannerX}
          y={scannerY}
          measure={measure}
          active={target.scannerTarget !== undefined}
          onPointerDown={onScannerPointerDown}
          onKeyDown={onScannerKeyDown}
        />

        <HudTag x={125} y={94} label={`${target.channel}(x)`} fill={graphColor} />
        <HudTag x={125} y={136} label={`x=${Math.round(state.scannerAngle)}°`} fill="#FBBF24" />
        <HudTag x={125} y={178} label={`değer=${formatValue(measure.scannerValue)}`} fill={measure.intensity > 0.72 ? '#FB7185' : '#34D399'} />
      </svg>
    </section>
  );
}

function TargetWall({ angle, channel }: { angle: number; channel: string }) {
  const x = xFromAngle(angle);
  const color = channel === 'tan' ? '#38BDF8' : '#A78BFA';

  return (
    <g pointerEvents="none">
      <line x1={x} y1={asymptoteFrame.plotY + 12} x2={x} y2={asymptoteFrame.plotY + asymptoteFrame.plotHeight - 12} stroke={color} strokeWidth="3" strokeDasharray="10 10" opacity="0.35" />
      <rect x={x - 26} y={asymptoteFrame.plotY + 20} width="52" height="32" rx="13" fill="rgba(0,0,0,0.44)" stroke={color} opacity="0.75" />
      <text x={x} y={asymptoteFrame.plotY + 41} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">{angle}°</text>
    </g>
  );
}

function isMatchedGate(current: number, target?: number) {
  return target !== undefined && Math.abs(current - target) <= 6;
}

function AsymptoteGate({ gate, angle, active, matched, onPointerDown, onKeyDown }: {
  gate: GateId;
  angle: number;
  active: boolean;
  matched: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const x = xFromAngle(angle);
  const stroke = matched ? '#34D399' : active ? '#FBBF24' : '#94A3B8';

  return (
    <g
      data-testid={`asymptote-gate-${gate.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
      role="slider"
      tabIndex={0}
      aria-label={`${gateLabels[gate]} asimptot kapısı`}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(angle)}
      aria-valuetext={`${gateLabels[gate]} kapısı ${Math.round(angle)} derece çizgisinde`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${gateLabels[gate]} kapısı. Sürükle veya Home ile hedef duvara hizala.`}</title>
      <motion.line x1={x} y1={asymptoteFrame.plotY + 10} x2={x} y2={asymptoteFrame.plotY + asymptoteFrame.plotHeight - 10} stroke={stroke} strokeWidth="9" strokeLinecap="round" opacity="0.35" filter="url(#asym-glow)" animate={{ opacity: active ? [0.3, 0.62, 0.3] : 0.22 }} transition={{ duration: 1.1, repeat: active ? Infinity : 0 }} />
      <line x1={x} y1={asymptoteFrame.plotY + 10} x2={x} y2={asymptoteFrame.plotY + asymptoteFrame.plotHeight - 10} stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <rect x={x - 39} y={asymptoteFrame.plotY + asymptoteFrame.plotHeight - 70} width="78" height="48" rx="18" fill="#070b13" stroke={stroke} strokeWidth="3" />
      <text x={x} y={asymptoteFrame.plotY + asymptoteFrame.plotHeight - 41} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">{Math.round(angle)}°</text>
    </g>
  );
}

function Scanner({ x, y, measure, active, onPointerDown, onKeyDown }: {
  x: number;
  y: number;
  measure: AsymptoteMeasure;
  active: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const color = measure.intensity > 0.72 ? '#FB7185' : '#FBBF24';

  return (
    <g
      data-testid="asymptote-scanner"
      role="slider"
      tabIndex={0}
      aria-label="grafik tarayıcısı"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(measure.scannerAngle)}
      aria-valuetext={`${Math.round(measure.scannerAngle)} derece, değer ${formatValue(measure.scannerValue)}`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`Tarayıcı ${Math.round(measure.scannerAngle)} derece. Kapıya yaklaşınca değer patlar.`}</title>
      <line x1={x} y1={asymptoteFrame.plotY + 26} x2={x} y2={asymptoteFrame.plotY + asymptoteFrame.plotHeight - 26} stroke={color} strokeWidth="2.5" strokeDasharray="8 7" opacity={active ? 0.85 : 0.44} />
      <circle cx={x} cy={y} r="14" fill={color} filter="url(#asym-glow)" />
      <circle cx={x} cy={y} r="29" fill="none" stroke={color} strokeWidth="3" opacity={active ? 0.72 : 0.35} />
    </g>
  );
}

function HudTag({ x, y, label, fill }: { x: number; y: number; label: string; fill: string }) {
  return (
    <g pointerEvents="none">
      <rect x={x - 68} y={y - 18} width="136" height="36" rx="14" fill="rgba(0,0,0,0.48)" stroke={fill} strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}
