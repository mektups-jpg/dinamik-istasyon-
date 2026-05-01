import { AxisChoice, GraphPoint } from './types';

export const graphConfig = {
  originX: 360,
  originY: 260,
  scale: 44,
  minX: -5.4,
  maxX: 5.4,
  minY: -4.8,
  maxY: 4.8,
};

export const rotationBase: GraphPoint[] = [
  { x: 1.1, y: 0.7 },
  { x: 3.4, y: 0.7 },
  { x: 2.35, y: 2.45 },
];

export const reflectionBase: GraphPoint[] = [
  { x: 1.15, y: -0.65 },
  { x: 3.35, y: -0.9 },
  { x: 2.05, y: -2.55 },
];

export const initialCenter: GraphPoint = { x: 2.2, y: -1.1 };
export const targetCenter: GraphPoint = { x: 0, y: 0 };
export const initialAngle = 180;
export const targetAngle = 90;
export const initialAxis: AxisChoice = 'x-axis';
export const targetAxis: AxisChoice = 'y-axis';

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundToTenth = (value: number) => Math.round(value * 10) / 10;

export const graphToSvg = (point: GraphPoint): GraphPoint => ({
  x: graphConfig.originX + point.x * graphConfig.scale,
  y: graphConfig.originY - point.y * graphConfig.scale,
});

export const svgToGraph = (point: GraphPoint): GraphPoint => ({
  x: roundToTenth(clamp((point.x - graphConfig.originX) / graphConfig.scale, graphConfig.minX, graphConfig.maxX)),
  y: roundToTenth(clamp((graphConfig.originY - point.y) / graphConfig.scale, graphConfig.minY, graphConfig.maxY)),
});

export const rotatePoint = (point: GraphPoint, center: GraphPoint, degrees: number): GraphPoint => {
  const radians = (degrees * Math.PI) / 180;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(radians) - dy * Math.sin(radians),
    y: center.y + dx * Math.sin(radians) + dy * Math.cos(radians),
  };
};

export const reflectPoint = (point: GraphPoint, axis: AxisChoice): GraphPoint => {
  if (axis === 'y-axis') return { x: -point.x, y: point.y };
  if (axis === 'x-axis') return { x: point.x, y: -point.y };
  return { x: point.y, y: point.x };
};

export const polygonToSvgPoints = (points: GraphPoint[]) => (
  points.map((point) => {
    const svg = graphToSvg(point);
    return `${svg.x},${svg.y}`;
  }).join(' ')
);

export const distance = (first: GraphPoint, second: GraphPoint) => (
  Math.hypot(first.x - second.x, first.y - second.y)
);

export const normalizeDegrees = (degrees: number) => ((degrees % 360) + 360) % 360;

export const angleDelta = (current: number, target: number) => {
  const delta = Math.abs(normalizeDegrees(current - target));
  return Math.min(delta, 360 - delta);
};

export const angleFromGraphPoint = (point: GraphPoint) => {
  const raw = (Math.atan2(point.y, point.x) * 180) / Math.PI;
  return normalizeDegrees(Math.round(raw / 5) * 5);
};

export const angleHandlePoint = (degrees: number, radius = 2.85) => {
  const radians = (degrees * Math.PI) / 180;
  return graphToSvg({ x: Math.cos(radians) * radius, y: Math.sin(radians) * radius });
};

export const axisLabel = (axis: AxisChoice): string => {
  if (axis === 'y-axis') return 'Y ekseni';
  if (axis === 'x-axis') return 'X ekseni';
  return 'y = x';
};

export const axisLinePoints = (axis: AxisChoice) => {
  if (axis === 'y-axis') {
    return { start: graphToSvg({ x: 0, y: -4.1 }), end: graphToSvg({ x: 0, y: 4.1 }) };
  }
  if (axis === 'x-axis') {
    return { start: graphToSvg({ x: -4.45, y: 0 }), end: graphToSvg({ x: 4.45, y: 0 }) };
  }
  return { start: graphToSvg({ x: -3.7, y: -3.7 }), end: graphToSvg({ x: 3.7, y: 3.7 }) };
};

export const formatPoint = (point: GraphPoint) => `(${roundToTenth(point.x)}, ${roundToTenth(point.y)})`;
