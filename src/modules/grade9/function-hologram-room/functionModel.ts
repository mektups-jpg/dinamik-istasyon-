import { CalibrationTarget, FunctionParams, GraphPoint } from './types';

export const graphConfig = {
  originX: 360,
  originY: 260,
  scale: 32,
  minX: -8,
  maxX: 8,
  minY: -5.4,
  maxY: 6.4,
};

export const initialParams: FunctionParams = {
  a: 0.7,
  r: -1.4,
  k: -1.2,
};

export const calibrationTargets: CalibrationTarget[] = [
  {
    label: 'f(x)=x',
    atomId: 'MAT.9.2.1.1',
    params: { a: 1, r: 0, k: 0 },
    hint: 'Kaynak noktasını orijine taşı, eğim kolunu 45 dereceye getir.',
  },
  {
    label: 'f(x)=x+2',
    atomId: 'MAT.9.2.1.2',
    params: { a: 1, r: 0, k: 2 },
    hint: 'Sadece kaynak noktasını yukarı taşı. Doğru paralel kalmalı.',
  },
  {
    label: 'f(x)=x-2+2',
    atomId: 'MAT.9.2.1.3',
    params: { a: 1, r: 2, k: 2 },
    hint: 'Kaynak noktasını sağdaki hedef düğüme sürükle.',
  },
  {
    label: 'f(x)=2(x-2)+2',
    atomId: 'MAT.9.2.1.4',
    params: { a: 2, r: 2, k: 2 },
    hint: 'Kaynak sabit kalsın; eğim kolunu yukarı çekerek lazeri dikleştir.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundToTenth = (value: number) => Math.round(value * 10) / 10;

export const formatValue = (value: number) => {
  const rounded = roundToTenth(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

export const functionY = (x: number, params: FunctionParams) => params.a * (x - params.r) + params.k;

export const graphToSvg = (point: GraphPoint): GraphPoint => ({
  x: graphConfig.originX + point.x * graphConfig.scale,
  y: graphConfig.originY - point.y * graphConfig.scale,
});

export const svgToGraph = (point: GraphPoint): GraphPoint => ({
  x: roundToTenth(clamp((point.x - graphConfig.originX) / graphConfig.scale, graphConfig.minX, graphConfig.maxX)),
  y: roundToTenth(clamp((graphConfig.originY - point.y) / graphConfig.scale, graphConfig.minY, graphConfig.maxY)),
});

export const getAnchorPoint = (params: FunctionParams) => graphToSvg({ x: params.r, y: params.k });

export const getTiltPoint = (params: FunctionParams) => graphToSvg({ x: params.r + 2, y: params.k + params.a * 2 });

export const createLinePoints = (params: FunctionParams) => {
  const points: string[] = [];
  for (let x = graphConfig.minX; x <= graphConfig.maxX + 0.001; x += 0.25) {
    const svg = graphToSvg({ x, y: functionY(x, params) });
    points.push(`${svg.x},${svg.y}`);
  }
  return points.join(' ');
};

export const isTargetMatched = (current: FunctionParams, target: FunctionParams) => (
  Math.abs(current.a - target.a) <= 0.16
  && Math.abs(current.r - target.r) <= 0.25
  && Math.abs(current.k - target.k) <= 0.25
);

export const formulaLabel = ({ a, r, k }: FunctionParams) => {
  const slope = formatValue(a);
  const shift = r === 0 ? 'x' : `x${r > 0 ? '-' : '+'}${formatValue(Math.abs(r))}`;
  const vertical = k === 0 ? '' : `${k > 0 ? '+' : '-'}${formatValue(Math.abs(k))}`;
  return `f(x)=${slope}(${shift})${vertical}`;
};

export const calibrationDeltaLabel = (current: FunctionParams, target: FunctionParams) => (
  `Δa ${formatValue(target.a - current.a)} · Δr ${formatValue(target.r - current.r)} · Δk ${formatValue(target.k - current.k)}`
);
