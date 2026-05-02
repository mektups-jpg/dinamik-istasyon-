import { GraphPoint, RouteMeasure, RouteState, RouteTarget } from './types';

export const graphBounds = { minX: -6, maxX: 6, minY: -4, maxY: 5 };
export const svgFrame = { width: 720, height: 520, originX: 360, originY: 300, scale: 42 };

export const initialRoute: RouteState = {
  a: { x: -4, y: -2 },
  b: { x: 2, y: 2 },
  transferT: 0.5,
};

export const routeTargets: RouteTarget[] = [
  {
    id: 'distance',
    atomId: 'MAT.10.5.1.1',
    label: '5 birim rota',
    hint: 'A ve B istasyonlarını 3-4-5 üçgeni oluşturacak hedeflere taşı.',
    a: { x: -3, y: -1 },
    b: { x: 1, y: 2 },
  },
  {
    id: 'slope',
    atomId: 'MAT.10.5.2.1',
    label: 'm = 1/2',
    hint: 'Eğim dikey değişimin yatay değişime bölümüdür: m = Δy / Δx.',
    a: { x: -4, y: -2 },
    b: { x: 2, y: 1 },
  },
  {
    id: 'equation',
    atomId: 'MAT.10.5.2.2',
    label: 'y + 1 = 1(x + 2)',
    hint: 'Nokta-eğim formunda A noktasını ve canlı eğimi aynı denklemde gör.',
    a: { x: -2, y: -1 },
    b: { x: 2, y: 3 },
  },
  {
    id: 'division',
    atomId: 'MAT.10.5.1.2',
    label: 'AP:PB = 1:3',
    hint: 'Transfer istasyonunu A noktasından rotanın dörtte biri kadar ilerlet.',
    a: { x: -4, y: -2 },
    b: { x: 4, y: 2 },
    transferT: 0.25,
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const snap = (value: number) => Math.round(value * 2) / 2;

export const round = (value: number, precision = 1) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const graphToSvg = (point: GraphPoint) => ({
  x: svgFrame.originX + point.x * svgFrame.scale,
  y: svgFrame.originY - point.y * svgFrame.scale,
});

export const svgToGraph = (point: { x: number; y: number }): GraphPoint => ({
  x: snap(clamp((point.x - svgFrame.originX) / svgFrame.scale, graphBounds.minX, graphBounds.maxX)),
  y: snap(clamp((svgFrame.originY - point.y) / svgFrame.scale, graphBounds.minY, graphBounds.maxY)),
});

export const interpolate = (a: GraphPoint, b: GraphPoint, t: number): GraphPoint => ({
  x: round(a.x + (b.x - a.x) * t, 2),
  y: round(a.y + (b.y - a.y) * t, 2),
});

export const measureRoute = (state: RouteState): RouteMeasure => {
  const dx = round(state.b.x - state.a.x, 2);
  const dy = round(state.b.y - state.a.y, 2);
  const distance = round(Math.hypot(dx, dy), 2);
  const slope = Math.abs(dx) < 0.01 ? null : round(dy / dx, 2);
  return {
    dx,
    dy,
    distance,
    slope,
    transfer: interpolate(state.a, state.b, state.transferT),
    equation: makeEquation(state.a, slope),
  };
};

export const projectToRoute = (state: RouteState, point: GraphPoint) => {
  const vx = state.b.x - state.a.x;
  const vy = state.b.y - state.a.y;
  const lengthSq = vx * vx + vy * vy;
  if (lengthSq < 0.01) return state.transferT;
  const t = ((point.x - state.a.x) * vx + (point.y - state.a.y) * vy) / lengthSq;
  return round(clamp(t, 0, 1), 2);
};

export const isTargetMatched = (state: RouteState, target: RouteTarget) => {
  const pointsOk = isPointClose(state.a, target.a) && isPointClose(state.b, target.b);
  if (!pointsOk) return false;
  if (typeof target.transferT === 'number') return Math.abs(state.transferT - target.transferT) <= 0.04;
  return true;
};

export const isPointClose = (a: GraphPoint, b: GraphPoint) => Math.abs(a.x - b.x) <= 0.25 && Math.abs(a.y - b.y) <= 0.25;

export const pointText = (point: GraphPoint) => `(${formatNumber(point.x)}, ${formatNumber(point.y)})`;

export const formatNumber = (value: number | null) => {
  if (value === null) return 'tanımsız';
  if (Number.isInteger(value)) return String(value);
  return String(round(value, 2));
};

export const formatSlope = (value: number | null) => (value === null ? 'dikey' : formatNumber(value));

function makeEquation(point: GraphPoint, slope: number | null) {
  if (slope === null) return `x = ${formatNumber(point.x)}`;
  const yPart = point.y < 0 ? `y + ${formatNumber(Math.abs(point.y))}` : point.y > 0 ? `y - ${formatNumber(point.y)}` : 'y';
  const xPart = point.x < 0 ? `(x + ${formatNumber(Math.abs(point.x))})` : point.x > 0 ? `(x - ${formatNumber(point.x)})` : 'x';
  return `${yPart} = ${formatSlope(slope)}${xPart}`;
}
