import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { AxisChoice, ForensicsPointerHandler, GraphPoint } from './types';
import {
  angleHandlePoint,
  axisLabel,
  axisLinePoints,
  formatPoint,
  graphConfig,
  graphToSvg,
  polygonToSvgPoints,
  reflectPoint,
  reflectionBase,
  rotatePoint,
  rotationBase,
  targetAngle,
  targetAxis,
  targetCenter,
} from './forensicsModel';

interface ForensicsSceneProps {
  activeIndex: number;
  center: GraphPoint;
  angle: number;
  axis: AxisChoice;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: ForensicsPointerHandler;
  onSurfacePointerDown: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onSurfaceClick: (event: ReactMouseEvent<SVGSVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
  onCenterTargetSelect: () => void;
  onAngleTargetSelect: () => void;
  onAxisSelect: (axis: AxisChoice) => void;
}

export function ForensicsScene(props: ForensicsSceneProps) {
  const {
    activeIndex,
    center,
    angle,
    axis,
    missionOk,
    svgRef,
    onPointerDown,
    onSurfacePointerDown,
    onSurfaceClick,
    onPointerMove,
    onPointerUp,
    onCenterTargetSelect,
    onAngleTargetSelect,
    onAxisSelect,
  } = props;
  const isReflection = activeIndex === 2;

  return (
    <section
      data-testid="transform-scene"
      className="relative overflow-hidden rounded-[36px] border border-white/12 bg-white/[0.055] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-violet-300/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-cyan-200/10 blur-3xl" />
      <div className="relative mb-4 grid gap-3 md:flex md:flex-wrap md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/40">makro atom: MAT.9.5.1.x</p>
          <h2 className="text-2xl font-black tracking-tight text-white">İzi Yakala, Dönüşümü Bul</h2>
        </div>
        <div className={`rounded-full border px-4 py-2 font-mono text-sm font-black shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl ${missionOk ? 'border-emerald-300/28 bg-emerald-200/12 text-emerald-50' : 'border-white/12 bg-white/[0.08] text-white/82'}`}>
          {missionOk ? 'Hayalet kilitlendi' : isReflection ? `Eksen: ${axisLabel(axis)}` : activeIndex === 0 ? `Merkez: ${formatPoint(center)}` : `Açı: ${Math.round(angle)}°`}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="transform-svg"
        viewBox="0 0 720 500"
        className="relative h-[500px] w-full touch-none rounded-[32px] border border-white/10 bg-[#070913]/86 shadow-inner shadow-black/55 sm:h-[520px]"
        style={{ touchAction: 'none' }}
        onPointerDown={onSurfacePointerDown}
        onClick={onSurfaceClick}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="forensics-v4-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.038)" strokeWidth="1" />
          </pattern>
          <filter id="forensics-v4-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="forensics-v5-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="rgba(0,0,0,0.50)" />
          </filter>
          <linearGradient id="forensics-v5-origin" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(103,232,249,0.28)" />
            <stop offset="100%" stopColor="rgba(103,232,249,0.07)" />
          </linearGradient>
          <linearGradient id="forensics-v5-ghost" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(216,180,254,0.36)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0.12)" />
          </linearGradient>
          <linearGradient id="forensics-v5-lock" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(134,239,172,0.36)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.13)" />
          </linearGradient>
          <radialGradient id="forensics-v5-stage-light" cx="50%" cy="44%" r="62%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.055)" />
            <stop offset="55%" stopColor="rgba(103,232,249,0.026)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="720" height="500" fill="rgba(5,7,16,0.92)" />
        <rect width="720" height="500" fill="url(#forensics-v4-grid)" />
        <rect width="720" height="500" fill="url(#forensics-v5-stage-light)" />
        <circle cx="360" cy="245" r="235" fill="rgba(255,255,255,0.018)" />
        <circle cx="360" cy="245" r="154" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <Axes />
        {isReflection ? (
          <ReflectionStage axis={axis} missionOk={missionOk} onAxisSelect={onAxisSelect} />
        ) : (
          <RotationStage
            activeIndex={activeIndex}
            center={center}
            angle={angle}
            missionOk={missionOk}
            onPointerDown={onPointerDown}
            onCenterTargetSelect={onCenterTargetSelect}
            onAngleTargetSelect={onAngleTargetSelect}
          />
        )}
      </svg>
    </section>
  );
}

function Axes() {
  return (
    <g>
      <line x1="48" y1={graphConfig.originY} x2="672" y2={graphConfig.originY} stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <line x1={graphConfig.originX} y1="44" x2={graphConfig.originX} y2="456" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <circle cx={graphConfig.originX} cy={graphConfig.originY} r="5" fill="rgba(255,255,255,0.42)" />
      <text x="654" y={graphConfig.originY + 24} fill="rgba(255,255,255,0.42)" fontSize="14" fontWeight="900">x</text>
      <text x={graphConfig.originX + 16} y="64" fill="rgba(255,255,255,0.42)" fontSize="14" fontWeight="900">y</text>
    </g>
  );
}

function RotationStage({
  activeIndex,
  center,
  angle,
  missionOk,
  onPointerDown,
  onCenterTargetSelect,
  onAngleTargetSelect,
}: {
  activeIndex: number;
  center: GraphPoint;
  angle: number;
  missionOk: boolean;
  onPointerDown: ForensicsPointerHandler;
  onCenterTargetSelect: () => void;
  onAngleTargetSelect: () => void;
}) {
  const effectiveCenter = activeIndex === 0 ? center : targetCenter;
  const effectiveAngle = activeIndex === 0 ? targetAngle : angle;
  const targetPolygon = polygonToSvgPoints(rotationBase.map((point) => rotatePoint(point, targetCenter, targetAngle)));
  const selectedPolygon = polygonToSvgPoints(rotationBase.map((point) => rotatePoint(point, effectiveCenter, effectiveAngle)));
  const basePolygon = polygonToSvgPoints(rotationBase);
  const centerSvg = graphToSvg(effectiveCenter);
  const targetCenterSvg = graphToSvg(targetCenter);
  const handle = angleHandlePoint(effectiveAngle);
  const targetHandle = angleHandlePoint(targetAngle);
  const ringRadius = 2.85 * graphConfig.scale;
  const start = angleHandlePoint(0);
  const largeArc = effectiveAngle > 180 ? 1 : 0;

  return (
    <g>
      <rect x="66" y="62" width="588" height="374" rx="30" fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.07)" />
      <polygon
        points={basePolygon}
        fill="url(#forensics-v5-origin)"
        stroke="#67E8F9"
        strokeWidth="3"
        strokeLinejoin="round"
        filter="url(#forensics-v5-soft-shadow)"
      />
      <polygon
        points={targetPolygon}
        fill="rgba(251,191,36,0.055)"
        stroke="#FDE68A"
        strokeWidth="4"
        strokeDasharray="11 9"
        strokeLinejoin="round"
      />
      <motion.polygon
        points={selectedPolygon}
        fill={missionOk ? 'url(#forensics-v5-lock)' : 'url(#forensics-v5-ghost)'}
        stroke={missionOk ? '#86EFAC' : '#C4B5FD'}
        strokeWidth="4"
        strokeLinejoin="round"
        filter="url(#forensics-v4-glow)"
        animate={{ opacity: missionOk ? [0.9, 1, 0.9] : [0.58, 0.95, 0.58] }}
        transition={{ duration: missionOk ? 0.75 : 1.35, repeat: Infinity }}
      />

      <g
        data-testid="transform-center-target"
        role="button"
        aria-label="Orijin hedefini seç"
        onClick={(event) => {
          event.stopPropagation();
          if (activeIndex === 0) onCenterTargetSelect();
        }}
        style={{ cursor: activeIndex === 0 ? 'pointer' : 'default' }}
      >
        <circle cx={targetCenterSvg.x} cy={targetCenterSvg.y} r="31" fill="transparent" />
        <circle cx={targetCenterSvg.x} cy={targetCenterSvg.y} r="27" fill="rgba(251,191,36,0.06)" stroke="#FDE68A" strokeWidth="3" strokeDasharray="7 8" />
        <circle cx={targetCenterSvg.x} cy={targetCenterSvg.y} r="4" fill="#FDE68A" />
      </g>
      <text x={targetCenterSvg.x + 34} y={targetCenterSvg.y - 16} fill="#FEF3C7" fontSize="14" fontWeight="900">orijin</text>

      {activeIndex === 1 ? <AngleRing start={start} handle={handle} targetHandle={targetHandle} ringRadius={ringRadius} largeArc={largeArc} angle={effectiveAngle} onPointerDown={onPointerDown} onTargetSelect={onAngleTargetSelect} /> : null}
      <CenterHandle active={activeIndex === 0} point={centerSvg} locked={activeIndex > 0 || missionOk} onPointerDown={onPointerDown} />

      <Legend x={86} y={88} items={[['orijinal', '#67E8F9'], ['hedef iz', '#FDE68A'], ['hayalet', missionOk ? '#86EFAC' : '#C4B5FD']]} />
      <text x="360" y="460" textAnchor="middle" fill={missionOk ? '#DCFCE7' : '#EDE9FE'} fontSize="18" fontWeight="900">
        {activeIndex === 0 ? 'Merkez doğruysa hayalet iz hedefe oturur' : 'Açı kolunu sarı 90° izine çevir'}
      </text>
    </g>
  );
}

function ReflectionStage({ axis, missionOk, onAxisSelect }: { axis: AxisChoice; missionOk: boolean; onAxisSelect: (axis: AxisChoice) => void }) {
  const basePolygon = polygonToSvgPoints(reflectionBase);
  const targetPolygon = polygonToSvgPoints(reflectionBase.map((point) => reflectPoint(point, targetAxis)));
  const selectedPolygon = polygonToSvgPoints(reflectionBase.map((point) => reflectPoint(point, axis)));
  const axes: AxisChoice[] = ['x-axis', 'y-axis', 'y-equals-x'];

  return (
    <g>
      <rect x="66" y="62" width="588" height="374" rx="30" fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.07)" />
      {axes.map((choice) => (
        <AxisCandidate key={choice} axis={choice} selected={axis === choice} target={choice === targetAxis} onSelect={() => onAxisSelect(choice)} />
      ))}
      <polygon points={basePolygon} fill="url(#forensics-v5-origin)" stroke="#67E8F9" strokeWidth="3" strokeLinejoin="round" filter="url(#forensics-v5-soft-shadow)" />
      <polygon points={targetPolygon} fill="rgba(251,191,36,0.055)" stroke="#FDE68A" strokeWidth="4" strokeDasharray="11 9" strokeLinejoin="round" />
      <motion.polygon
        points={selectedPolygon}
        fill={missionOk ? 'url(#forensics-v5-lock)' : 'url(#forensics-v5-ghost)'}
        stroke={missionOk ? '#86EFAC' : '#C4B5FD'}
        strokeWidth="4"
        strokeLinejoin="round"
        filter="url(#forensics-v4-glow)"
        animate={{ opacity: missionOk ? [0.9, 1, 0.9] : [0.58, 0.95, 0.58] }}
        transition={{ duration: missionOk ? 0.75 : 1.35, repeat: Infinity }}
      />
      <Legend x={86} y={88} items={[['orijinal', '#67E8F9'], ['hedef iz', '#FDE68A'], ['yansıyan hayalet', missionOk ? '#86EFAC' : '#C4B5FD']]} />
      <text x="360" y="460" textAnchor="middle" fill={missionOk ? '#DCFCE7' : '#EDE9FE'} fontSize="18" fontWeight="900">
        Sahnedeki ayna çizgilerinden doğru ekseni seç
      </text>
    </g>
  );
}

function CenterHandle({ point, active, locked, onPointerDown }: { point: GraphPoint; active: boolean; locked: boolean; onPointerDown: ForensicsPointerHandler }) {
  return (
    <g
      data-testid="transform-center-handle"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (active) onPointerDown(event, 'center');
      }}
      style={{ cursor: active ? 'grab' : 'default', touchAction: 'none' }}
    >
      <circle cx={point.x} cy={point.y} r="34" fill="transparent" />
      <motion.circle cx={point.x} cy={point.y} r="26" fill="rgba(251,191,36,0.12)" stroke={locked ? '#86EFAC' : '#FDE68A'} strokeWidth="3" filter="url(#forensics-v4-glow)" animate={active ? { r: [23, 29, 23] } : undefined} transition={{ duration: 1.2, repeat: Infinity }} />
      <circle cx={point.x} cy={point.y} r="9" fill={locked ? '#86EFAC' : '#FDE68A'} stroke="rgba(255,255,255,0.92)" strokeWidth="3" />
      <text x={point.x} y={point.y + 48} textAnchor="middle" fill="#FEF3C7" fontSize="14" fontWeight="900">merkez</text>
    </g>
  );
}

function AngleRing({ start, handle, targetHandle, ringRadius, largeArc, angle, onPointerDown, onTargetSelect }: { start: GraphPoint; handle: GraphPoint; targetHandle: GraphPoint; ringRadius: number; largeArc: number; angle: number; onPointerDown: ForensicsPointerHandler; onTargetSelect: () => void }) {
  return (
    <g>
      <circle cx={graphConfig.originX} cy={graphConfig.originY} r={ringRadius} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" strokeDasharray="8 10" />
      <line x1={graphConfig.originX} y1={graphConfig.originY} x2={targetHandle.x} y2={targetHandle.y} stroke="rgba(253,230,138,0.32)" strokeWidth="3" strokeDasharray="8 8" />
      <path d={`M ${start.x} ${start.y} A ${ringRadius} ${ringRadius} 0 ${largeArc} 0 ${handle.x} ${handle.y}`} fill="none" stroke="#C4B5FD" strokeWidth="7" strokeLinecap="round" />
      <g
        data-testid="transform-angle-target"
        role="button"
        aria-label="90 derece hedefini seç"
        onClick={(event) => {
          event.stopPropagation();
          onTargetSelect();
        }}
        style={{ cursor: 'pointer' }}
      >
        <circle cx={targetHandle.x} cy={targetHandle.y} r="28" fill="transparent" />
        <circle cx={targetHandle.x} cy={targetHandle.y} r="18" fill="rgba(251,191,36,0.07)" stroke="#FDE68A" strokeWidth="3" strokeDasharray="6 7" />
      </g>
      <g
        data-testid="transform-angle-handle"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => {
          event.stopPropagation();
          onPointerDown(event, 'angle');
        }}
        style={{ cursor: 'grab', touchAction: 'none' }}
      >
        <circle cx={handle.x} cy={handle.y} r="32" fill="transparent" />
        <circle cx={handle.x} cy={handle.y} r="22" fill="rgba(196,181,253,0.16)" stroke="#C4B5FD" strokeWidth="4" filter="url(#forensics-v4-glow)" />
        <circle cx={handle.x} cy={handle.y} r="8" fill="#C4B5FD" stroke="rgba(255,255,255,0.92)" strokeWidth="3" />
      </g>
      <text x={graphConfig.originX + 44} y={graphConfig.originY + 72} fill="#EDE9FE" fontSize="18" fontWeight="900">{Math.round(angle)}°</text>
    </g>
  );
}

function AxisCandidate({ axis, selected, target, onSelect }: { axis: AxisChoice; selected: boolean; target: boolean; onSelect: () => void }) {
  const line = axisLinePoints(axis);
  const color = selected ? '#67E8F9' : target ? '#FDE68A' : 'rgba(255,255,255,0.26)';
  const halo = selected ? 'rgba(103,232,249,0.16)' : target ? 'rgba(251,191,36,0.10)' : 'rgba(255,255,255,0.045)';
  const testId = `transform-axis-${axis === 'y-equals-x' ? 'y-equals-x' : axis === 'y-axis' ? 'y' : 'x'}`;

  return (
    <g
      role="button"
      aria-label={`${axisLabel(axis)} seç`}
      onClick={onSelect}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      style={{ cursor: 'pointer' }}
    >
      <line x1={line.start.x} y1={line.start.y} x2={line.end.x} y2={line.end.y} stroke="transparent" strokeWidth="34" />
      <line x1={line.start.x} y1={line.start.y} x2={line.end.x} y2={line.end.y} stroke={color} strokeWidth={selected ? 7 : 4} strokeDasharray={selected ? '12 9' : target ? '6 10' : '3 11'} opacity={selected || target ? 0.92 : 0.58} />
      <g data-testid={testId}>
        <circle cx={line.end.x} cy={line.end.y} r="24" fill={halo} stroke={color} strokeWidth={selected ? 4 : 3} />
        <circle cx={line.end.x} cy={line.end.y} r="8" fill={color} stroke="rgba(255,255,255,0.92)" strokeWidth="2" />
      </g>
      <text x={(line.start.x + line.end.x) / 2 + 18} y={(line.start.y + line.end.y) / 2 - 16} fill={color} fontSize="15" fontWeight="900">{axisLabel(axis)}</text>
    </g>
  );
}

function Legend({ x, y, items }: { x: number; y: number; items: [string, string][] }) {
  return (
    <g>
      <rect x={x - 18} y={y - 34} width="190" height={items.length * 28 + 24} rx="18" fill="rgba(0,0,0,0.30)" stroke="rgba(255,255,255,0.09)" />
      {items.map(([label, color], index) => (
        <g key={label}>
          <circle cx={x} cy={y + index * 28} r="7" fill={color} />
          <text x={x + 18} y={y + index * 28 + 5} fill="rgba(255,255,255,0.74)" fontSize="13" fontWeight="900">{label}</text>
        </g>
      ))}
    </g>
  );
}
