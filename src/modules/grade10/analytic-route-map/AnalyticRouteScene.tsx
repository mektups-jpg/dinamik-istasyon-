import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { RouteDragTarget, RouteMeasure, RoutePointerHandler, RouteState, RouteTarget } from './types';
import { formatNumber, formatSlope, graphToSvg, graphBounds, pointText, svgFrame } from './routeModel';

interface AnalyticRouteSceneProps {
  state: RouteState;
  target: RouteTarget;
  measure: RouteMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: RoutePointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyStep: (target: RouteDragTarget, dx: number, dy: number) => void;
  onHome: (target: RouteDragTarget) => void;
}

export function AnalyticRouteScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyStep,
  onHome,
}: AnalyticRouteSceneProps) {
  const a = graphToSvg(state.a);
  const b = graphToSvg(state.b);
  const transfer = graphToSvg(measure.transfer);
  const targetA = graphToSvg(target.a);
  const targetB = graphToSvg(target.b);
  const showTransfer = typeof target.transferT === 'number';

  return (
    <section
      data-testid="analytic-route-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-200/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_82%_24%,rgba(52,211,153,0.13),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.5.x</p>
          <h2 className="text-2xl font-black text-white">Analitik Navigasyon Haritası</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="analytic-route-svg"
        viewBox={`0 0 ${svgFrame.width} ${svgFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#03101a]/86 sm:h-[440px] xl:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="route-grid" width={svgFrame.scale} height={svgFrame.scale} patternUnits="userSpaceOnUse">
            <path d={`M ${svgFrame.scale} 0 L 0 0 0 ${svgFrame.scale}`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <filter id="route-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={svgFrame.width} height={svgFrame.height} fill="url(#route-grid)" />
        <line x1="0" y1={svgFrame.originY} x2={svgFrame.width} y2={svgFrame.originY} stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        <line x1={svgFrame.originX} y1="0" x2={svgFrame.originX} y2={svgFrame.height} stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        {axisLabels()}

        <TargetMarker x={targetA.x} y={targetA.y} label="A hedef" />
        <TargetMarker x={targetB.x} y={targetB.y} label="B hedef" />

        <line x1={a.x} y1={a.y} x2={b.x} y2={a.y} stroke="#34D399" strokeWidth="7" strokeLinecap="round" opacity="0.55" />
        <line x1={b.x} y1={a.y} x2={b.x} y2={b.y} stroke="#38BDF8" strokeWidth="7" strokeLinecap="round" opacity="0.55" />
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(251,191,36,0.28)" strokeWidth="18" strokeLinecap="round" filter="url(#route-glow)" />
        <motion.line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" animate={{ opacity: [0.72, 1, 0.72] }} transition={{ duration: 1.1, repeat: Infinity }} />

        <MeasureTag x={(a.x + b.x) / 2} y={a.y + 28} fill="#34D399" label={`Δx=${formatNumber(measure.dx)}`} />
        <MeasureTag x={b.x + 54} y={(a.y + b.y) / 2} fill="#38BDF8" label={`Δy=${formatNumber(measure.dy)}`} />
        <MeasureTag x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 24} fill="#FBBF24" label={`d=${formatNumber(measure.distance)}`} />
        <MeasureTag x={svgFrame.width - 150} y="72" fill="#C4B5FD" label={`m=${formatSlope(measure.slope)}`} />
        <MeasureTag x={svgFrame.width - 208} y="112" fill="#A7F3D0" label={measure.equation} wide />

        <RoutePoint id="route-point-a" label="A" x={a.x} y={a.y} color="#38BDF8" text={pointText(state.a)} onPointerDown={(event) => onPointerDown(event, 'a')} onKeyDown={(event) => handleKey(event, 'a', onKeyStep, onHome)} />
        <RoutePoint id="route-point-b" label="B" x={b.x} y={b.y} color="#F472B6" text={pointText(state.b)} onPointerDown={(event) => onPointerDown(event, 'b')} onKeyDown={(event) => handleKey(event, 'b', onKeyStep, onHome)} />
        {showTransfer ? (
          <RoutePoint id="route-transfer-node" label="P" x={transfer.x} y={transfer.y} color="#A78BFA" text={pointText(measure.transfer)} onPointerDown={(event) => onPointerDown(event, 'transfer')} onKeyDown={(event) => handleTransferKey(event, onKeyStep, onHome)} small />
        ) : null}
      </svg>
    </section>
  );
}

function RoutePoint({ id, label, x, y, color, text, small = false, onPointerDown, onKeyDown }: {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  text: string;
  small?: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const radius = small ? 18 : 24;
  const labelAbove = y + radius + 46 > svgFrame.height;
  const labelY = labelAbove ? y - radius - 42 : y + radius + 12;
  const labelTextY = labelY + 20;
  return (
    <g
      data-testid={id}
      role="slider"
      tabIndex={0}
      aria-label={`${label} istasyonu`}
      aria-roledescription="sürüklenebilir koordinat noktası"
      aria-valuetext={text}
      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${label} istasyonu ${text}. Ok tuşlarıyla taşı, Home ile hedefe hizala.`}</title>
      <circle cx={x} cy={y} r={radius + 12} fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#route-glow)" />
      <circle cx={x} cy={y} r={radius} fill="#06131c" stroke={color} strokeWidth="4" />
      <text x={x} y={y + 6} textAnchor="middle" fill="#fff" fontSize={small ? 15 : 18} fontWeight="900">{label}</text>
      <rect x={x - 52} y={labelY} width="104" height="30" rx="13" fill="rgba(0,0,0,0.52)" stroke={color} strokeWidth="1.5" />
      <text x={x} y={labelTextY} textAnchor="middle" fill="#E0F2FE" fontSize="12" fontWeight="900">{text}</text>
    </g>
  );
}

function TargetMarker({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g pointerEvents="none" opacity="0.65">
      <circle cx={x} cy={y} r="30" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="2" strokeDasharray="7 8" />
      <text x={x + 24} y={y - 22} fill="rgba(255,255,255,0.72)" fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}

function MeasureTag({ x, y, fill, label, wide = false }: { x: number | string; y: number | string; fill: string; label: string; wide?: boolean }) {
  const width = wide ? 230 : 118;
  const xNum = typeof x === 'number' ? x : Number(x);
  const yNum = typeof y === 'number' ? y : Number(y);
  const safeX = Math.min(svgFrame.width - width / 2 - 8, Math.max(width / 2 + 8, xNum));
  const safeY = Math.min(svgFrame.height - 26, Math.max(26, yNum));
  return (
    <g pointerEvents="none">
      <rect x={safeX - width / 2} y={safeY - 18} width={width} height="36" rx="14" fill="rgba(0,0,0,0.48)" stroke={fill} strokeWidth="1.5" />
      <text x={safeX} y={safeY + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}

function axisLabels() {
  const labels = [];
  for (let x = graphBounds.minX; x <= graphBounds.maxX; x += 2) {
    const p = graphToSvg({ x, y: 0 });
    labels.push(<text key={`x-${x}`} x={p.x} y={svgFrame.originY + 22} textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="11">{x}</text>);
  }
  for (let y = graphBounds.minY; y <= graphBounds.maxY; y += 2) {
    const p = graphToSvg({ x: 0, y });
    labels.push(<text key={`y-${y}`} x={svgFrame.originX + 14} y={p.y + 4} fill="rgba(255,255,255,0.38)" fontSize="11">{y}</text>);
  }
  return labels;
}

function handleKey(event: ReactKeyboardEvent<SVGGElement>, target: 'a' | 'b', onKeyStep: (target: RouteDragTarget, dx: number, dy: number) => void, onHome: (target: RouteDragTarget) => void) {
  const delta = event.shiftKey ? 1 : 0.5;
  if (event.key === 'Home') {
    event.preventDefault();
    onHome(target);
    return;
  }
  const map: Record<string, [number, number]> = {
    ArrowLeft: [-delta, 0],
    ArrowRight: [delta, 0],
    ArrowUp: [0, delta],
    ArrowDown: [0, -delta],
  };
  const next = map[event.key];
  if (!next) return;
  event.preventDefault();
  onKeyStep(target, next[0], next[1]);
}

function handleTransferKey(event: ReactKeyboardEvent<SVGGElement>, onKeyStep: (target: RouteDragTarget, dx: number, dy: number) => void, onHome: (target: RouteDragTarget) => void) {
  if (event.key === 'Home') {
    event.preventDefault();
    onHome('transfer');
    return;
  }
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  onKeyStep('transfer', event.key === 'ArrowRight' ? 0.05 : -0.05, 0);
}
