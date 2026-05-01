import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { Point, TriangleMeasurements, TrianglePointerHandler, TokenPositions, TrianglePoints, VertexKey } from './types';
import { midpoint, oppositeSide, proofRail, proofSlotPoint, round, sideName, unitPoint } from './triangleGeometry';

const tokenColors: Record<VertexKey, { fill: string; stroke: string; text: string }> = {
  A: { fill: 'rgba(251,191,36,0.18)', stroke: '#FBBF24', text: '#FDE68A' },
  B: { fill: 'rgba(0,229,255,0.15)', stroke: '#00E5FF', text: '#A5F3FC' },
  C: { fill: 'rgba(179,136,255,0.16)', stroke: '#B388FF', text: '#DDD6FE' },
};

interface TriangleSceneProps {
  activeIndex: number;
  points: TrianglePoints;
  tokens: TokenPositions;
  placedOrder: VertexKey[];
  measurements: TriangleMeasurements;
  missionOneOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: TrianglePointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
}

export function TriangleScene(props: TriangleSceneProps) {
  const { activeIndex, points, tokens, placedOrder, measurements, missionOneOk, svgRef, onPointerDown, onPointerMove, onPointerUp } = props;
  const polygon = `${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`;
  const sideColor = (side: 'a' | 'b' | 'c') => measurements.longestSide === side ? '#FBBF24' : 'rgba(45,212,191,0.72)';
  const angleColor = (key: VertexKey) => measurements.largestAngle === key ? '#FBBF24' : '#A7F3D0';

  return (
    <section data-testid="triangle-scene" className="relative overflow-hidden rounded-[32px] border border-teal-200/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(45,212,191,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(45,212,191,0.13),transparent_52%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-teal-100/55">makro atom: MAT.9.4.1.x</p>
          <h2 className="text-2xl font-black text-white">Üçgeni Tut, İlişkiyi Gör</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOneOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-teal-200/25 bg-teal-200/10 text-teal-100'}`}>
          {missionOneOk ? 'A ↔ BC kilitlendi' : `${measurements.largestAngle} ↔ ${sideName(oppositeSide(measurements.largestAngle))}`}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 720 500"
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/10 bg-[#020605]/70 sm:h-[520px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <filter id="triangle-v4-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {activeIndex === 0 ? (
          <>
            <rect x="70" y="82" width="580" height="365" rx="28" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" />
            <motion.circle cx="580" cy="385" r="30" fill="none" stroke="#FBBF24" strokeWidth="4" strokeDasharray="7 9" animate={{ opacity: [0.35, 0.9, 0.35] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <text x="580" y="438" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="900">C hedef bölgesi</text>
            <polygon points={polygon} fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.20)" strokeWidth="2" />
            <line x1={points.B.x} y1={points.B.y} x2={points.C.x} y2={points.C.y} stroke={sideColor('a')} strokeWidth={measurements.longestSide === 'a' ? 9 : 5} strokeLinecap="round" filter={measurements.longestSide === 'a' ? 'url(#triangle-v4-glow)' : undefined} />
            <line x1={points.A.x} y1={points.A.y} x2={points.C.x} y2={points.C.y} stroke={sideColor('b')} strokeWidth={measurements.longestSide === 'b' ? 9 : 5} strokeLinecap="round" filter={measurements.longestSide === 'b' ? 'url(#triangle-v4-glow)' : undefined} />
            <line x1={points.A.x} y1={points.A.y} x2={points.B.x} y2={points.B.y} stroke={sideColor('c')} strokeWidth={measurements.longestSide === 'c' ? 9 : 5} strokeLinecap="round" filter={measurements.longestSide === 'c' ? 'url(#triangle-v4-glow)' : undefined} />
            <AngleArc origin={points.A} start={points.B} end={points.C} label="A" value={measurements.angles.A} color={angleColor('A')} />
            <AngleArc origin={points.B} start={points.A} end={points.C} label="B" value={measurements.angles.B} color={angleColor('B')} />
            <AngleArc origin={points.C} start={points.A} end={points.B} label="C" value={measurements.angles.C} color={angleColor('C')} />
            <SideLabel first={points.B} second={points.C} label={`a=BC ${round(measurements.sides.a)}`} color={sideColor('a')} dy={24} />
            <SideLabel first={points.A} second={points.C} label={`b=AC ${round(measurements.sides.b)}`} color={sideColor('b')} dy={-16} />
            <SideLabel first={points.A} second={points.B} label={`c=AB ${round(measurements.sides.c)}`} color={sideColor('c')} dy={-16} />
            {(Object.keys(points) as VertexKey[]).map((key) => (
              <VertexHandle key={key} vertexKey={key} point={points[key]} onPointerDown={onPointerDown} />
            ))}
          </>
        ) : (
          <AngleUnfoldingTable points={points} tokens={tokens} placedOrder={placedOrder} measurements={measurements} onPointerDown={onPointerDown} />
        )}
      </svg>
    </section>
  );
}

function VertexHandle({ vertexKey, point, onPointerDown }: { vertexKey: VertexKey; point: Point; onPointerDown: TrianglePointerHandler }) {
  return (
    <g data-testid={`triangle-drag-${vertexKey.toLowerCase()}`} onPointerDown={(event) => onPointerDown(event, { kind: 'vertex', key: vertexKey })} style={{ cursor: 'grab', touchAction: 'none' }}>
      <circle cx={point.x} cy={point.y} r="28" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="3" />
      <circle cx={point.x} cy={point.y} r="13" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="3" />
      <text x={point.x} y={point.y - 34} textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">{vertexKey}</text>
    </g>
  );
}

function AngleUnfoldingTable({ points, tokens, placedOrder, measurements, onPointerDown }: { points: TrianglePoints; tokens: TokenPositions; placedOrder: VertexKey[]; measurements: TriangleMeasurements; onPointerDown: TrianglePointerHandler }) {
  const proofSum = placedOrder.reduce((sum, key) => sum + round(measurements.angles[key]), 0);

  return (
    <>
      <rect x="34" y="48" width="652" height="402" rx="34" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" />
      <MiniTriangleReference points={points} measurements={measurements} />
      <text x="520" y="88" textAnchor="middle" fill="#FDE68A" fontSize="22" fontWeight="900">Açıları düz açı rayına taşı</text>
      {(Object.keys(tokens) as VertexKey[]).map((key) => {
        const placedIndex = placedOrder.indexOf(key);
        const point = placedIndex >= 0 ? proofSlotPoint(placedIndex) : tokens[key];
        return <AngleToken key={key} tokenKey={key} point={point} value={round(measurements.angles[key])} placed={placedIndex >= 0} onPointerDown={onPointerDown} />;
      })}
      <ProofRail placedOrder={placedOrder} measurements={measurements} proofSum={proofSum} />
    </>
  );
}

function MiniTriangleReference({ points, measurements }: { points: TrianglePoints; measurements: TriangleMeasurements }) {
  const scaled = scalePoints(points, { x: 194, y: 170 }, 0.44);
  const polygon = `${scaled.A.x},${scaled.A.y} ${scaled.B.x},${scaled.B.y} ${scaled.C.x},${scaled.C.y}`;
  return (
    <g opacity="0.78">
      <text x="178" y="76" textAnchor="middle" fill="rgba(255,255,255,0.64)" fontSize="15" fontWeight="900">Referans üçgen</text>
      <polygon points={polygon} fill="rgba(45,212,191,0.06)" stroke="rgba(45,212,191,0.42)" strokeWidth="4" />
      {(Object.keys(scaled) as VertexKey[]).map((key) => (
        <g key={key}>
          <circle cx={scaled[key].x} cy={scaled[key].y} r="9" fill={tokenColors[key].stroke} />
          <text x={scaled[key].x} y={scaled[key].y - 17} textAnchor="middle" fill={tokenColors[key].text} fontSize="14" fontWeight="900">{key}</text>
          <text x={scaled[key].x + 19} y={scaled[key].y + 5} fill={tokenColors[key].text} fontSize="13" fontWeight="900">{round(measurements.angles[key])}°</text>
        </g>
      ))}
      <path d="M98 258 C148 286 232 286 284 258" fill="none" stroke="rgba(251,191,36,0.28)" strokeWidth="5" strokeDasharray="8 9" />
      <text x="194" y="294" textAnchor="middle" fill="rgba(255,255,255,0.52)" fontSize="14" fontWeight="900">Üç iç açı rayda birleşir</text>
    </g>
  );
}

function AngleToken({ tokenKey, point, value, placed, onPointerDown }: { tokenKey: VertexKey; point: Point; value: number; placed: boolean; onPointerDown: TrianglePointerHandler }) {
  const colors = tokenColors[tokenKey];
  return (
    <g data-testid={`triangle-token-${tokenKey.toLowerCase()}`} onPointerDown={(event) => !placed && onPointerDown(event, { kind: 'token', key: tokenKey })} style={{ cursor: placed ? 'default' : 'grab', touchAction: 'none' }}>
      <circle cx={point.x} cy={point.y} r="44" fill="transparent" />
      <path d={anglePiecePath(point, value)} fill={placed ? 'rgba(0,255,136,0.16)' : colors.fill} stroke={placed ? '#00FF88' : colors.stroke} strokeWidth="4" filter="url(#triangle-v4-glow)" />
      <text x={point.x} y={point.y + 5} textAnchor="middle" fill={placed ? '#BBF7D0' : colors.text} fontSize="20" fontWeight="900">{tokenKey} {value}°</text>
    </g>
  );
}

function ProofRail({ placedOrder, measurements, proofSum }: { placedOrder: VertexKey[]; measurements: TriangleMeasurements; proofSum: number }) {
  return (
    <g data-testid="triangle-proof-rail">
      <rect x={proofRail.x} y={proofRail.y} width={proofRail.width} height={proofRail.height} rx="28" fill="rgba(255,255,255,0.055)" stroke="rgba(251,191,36,0.34)" strokeWidth="4" />
      <line x1={proofRail.x + 48} y1={proofRail.y + 56} x2={proofRail.x + proofRail.width - 48} y2={proofRail.y + 56} stroke={placedOrder.length === 3 ? '#00FF88' : '#FBBF24'} strokeWidth="10" strokeLinecap="round" />
      <text x={proofRail.x + 38} y={proofRail.y + 62} textAnchor="middle" fill="#FDE68A" fontSize="16" fontWeight="900">0°</text>
      <text x={proofRail.x + proofRail.width - 32} y={proofRail.y + 62} textAnchor="middle" fill="#FDE68A" fontSize="16" fontWeight="900">180°</text>
      {[0, 1, 2].map((slot) => {
        const point = proofSlotPoint(slot);
        return <circle key={slot} cx={point.x} cy={point.y} r="42" fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.16)" strokeWidth="3" strokeDasharray="7 9" />;
      })}
      <text x="360" y="448" textAnchor="middle" fill={placedOrder.length === 3 ? '#00FF88' : '#FBBF24'} fontSize="24" fontWeight="900">
        {placedOrder.length === 3 ? `A + B + C = ${round(measurements.angles.A + measurements.angles.B + measurements.angles.C)}°` : `Yerleşen toplam: ${proofSum}° / 180°`}
      </text>
    </g>
  );
}

function AngleArc({ origin, start, end, label, value, color }: { origin: Point; start: Point; end: Point; label: VertexKey; value: number; color: string }) {
  const radius = 42;
  const first = unitPoint(origin, start, radius);
  const second = unitPoint(origin, end, radius);
  const mid = midpoint(first, second);
  return (
    <g>
      <path d={`M ${first.x} ${first.y} A ${radius} ${radius} 0 ${value > 180 ? 1 : 0} 1 ${second.x} ${second.y}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <text x={mid.x} y={mid.y - 6} textAnchor="middle" fill={color} fontSize="15" fontWeight="900">{label} {round(value)}°</text>
    </g>
  );
}

function SideLabel({ first, second, label, color, dy }: { first: Point; second: Point; label: string; color: string; dy: number }) {
  const middle = midpoint(first, second);
  return <text x={middle.x} y={middle.y + dy} textAnchor="middle" fill={color} fontSize="14" fontWeight="900">{label}</text>;
}

function anglePiecePath(center: Point, degrees: number) {
  const radius = 58;
  const visualDegrees = Math.max(32, Math.min(112, degrees));
  const start = -visualDegrees / 2;
  const end = visualDegrees / 2;
  const startPoint = polarPoint(center, radius, start);
  const endPoint = polarPoint(center, radius, end);
  return `M ${center.x} ${center.y} L ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y} Z`;
}

function polarPoint(center: Point, radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return { x: center.x + Math.cos(radians) * radius, y: center.y + Math.sin(radians) * radius };
}

function scalePoints(points: TrianglePoints, center: Point, scale: number): TrianglePoints {
  const sourceCenter = {
    x: (points.A.x + points.B.x + points.C.x) / 3,
    y: (points.A.y + points.B.y + points.C.y) / 3,
  };
  return {
    A: scalePoint(points.A, sourceCenter, center, scale),
    B: scalePoint(points.B, sourceCenter, center, scale),
    C: scalePoint(points.C, sourceCenter, center, scale),
  };
}

function scalePoint(point: Point, sourceCenter: Point, targetCenter: Point, scale: number): Point {
  return {
    x: targetCenter.x + (point.x - sourceCenter.x) * scale,
    y: targetCenter.y + (point.y - sourceCenter.y) * scale,
  };
}
