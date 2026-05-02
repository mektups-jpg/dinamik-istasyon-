import { GraphPoint, ParabolaParams, ParabolaTarget } from './types';

export const graphConfig = {
  originX: 360,
  originY: 390,
  scale: 42,
  minX: -7.4,
  maxX: 7.4,
  minY: -2.5,
  maxY: 8.2,
};

export const initialParams: ParabolaParams = {
  a: 0.65,
  h: -1.6,
  k: 0.8,
};

export const parabolaTargets: ParabolaTarget[] = [
  {
    label: 'f(x)=x²',
    atomId: 'MAT.10.2.2.1',
    params: { a: 1, h: 0, k: 0 },
    hint: 'Tepe noktasını orijine getir, genişlik kolunu referans kasedeki hedefe oturt.',
  },
  {
    label: 'Dar kase: a=1.8',
    atomId: 'MAT.10.2.2.2',
    params: { a: 1.8, h: 0, k: 0 },
    hint: 'Tepe sabit kalsın. Pembe genişlik kolunu yukarı çekerek parabolü incelt.',
  },
  {
    label: 'Geniş kase: a=0.45',
    atomId: 'MAT.10.2.2.3',
    params: { a: 0.45, h: 0, k: 0 },
    hint: 'Pembe kolu aşağı indir. Kase yayvanlaştıkça a katsayısı küçülür.',
  },
  {
    label: 'Tepe kaydı: (2, 1.5)',
    atomId: 'MAT.10.2.2.4',
    params: { a: 0.75, h: 2, k: 1.5 },
    hint: 'Mavi tepe düğümünü sağ-yukarı taşı, sonra genişliği hedef kasenin açıklığına yaklaştır.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundToStep = (value: number, step = 0.05) => Math.round(value / step) * step;

export const roundToTenth = (value: number) => Math.round(value * 10) / 10;

export const formatValue = (value: number) => {
  const rounded = roundToTenth(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

export const parabolaY = (x: number, params: ParabolaParams) => params.a * (x - params.h) ** 2 + params.k;

export const graphToSvg = (point: GraphPoint): GraphPoint => ({
  x: graphConfig.originX + point.x * graphConfig.scale,
  y: graphConfig.originY - point.y * graphConfig.scale,
});

export const svgToGraph = (point: GraphPoint): GraphPoint => ({
  x: roundToTenth(clamp((point.x - graphConfig.originX) / graphConfig.scale, graphConfig.minX, graphConfig.maxX)),
  y: roundToTenth(clamp((graphConfig.originY - point.y) / graphConfig.scale, graphConfig.minY, graphConfig.maxY)),
});

export const getVertexPoint = (params: ParabolaParams) => graphToSvg({ x: params.h, y: params.k });

export const getWidthPoint = (params: ParabolaParams) => {
  const x = params.h + 1.8;
  return graphToSvg({ x, y: parabolaY(x, params) });
};

export const createParabolaPoints = (params: ParabolaParams) => {
  const points: string[] = [];
  for (let x = graphConfig.minX; x <= graphConfig.maxX + 0.001; x += 0.12) {
    const svg = graphToSvg({ x, y: parabolaY(x, params) });
    points.push(`${svg.x.toFixed(1)},${svg.y.toFixed(1)}`);
  }
  return points.join(' ');
};

export const updateWidthFromPoint = (current: ParabolaParams, point: GraphPoint): ParabolaParams => {
  const dx = clamp(Math.abs(point.x - current.h), 0.85, 3.2);
  const rise = clamp(point.y - current.k, 0.25, 7.2);
  return {
    ...current,
    a: roundToStep(clamp(rise / (dx * dx), 0.25, 2.25), 0.05),
  };
};

export const isTargetMatched = (current: ParabolaParams, target: ParabolaParams) => (
  Math.abs(current.a - target.a) <= 0.14
  && Math.abs(current.h - target.h) <= 0.24
  && Math.abs(current.k - target.k) <= 0.24
);

export const formulaLabel = ({ a, h, k }: ParabolaParams) => {
  const width = formatValue(a);
  const horizontal = h === 0 ? 'x' : `x${h > 0 ? '-' : '+'}${formatValue(Math.abs(h))}`;
  const vertical = k === 0 ? '' : `${k > 0 ? '+' : '-'}${formatValue(Math.abs(k))}`;
  return `f(x)=${width}(${horizontal})²${vertical}`;
};

export const deltaLabel = (current: ParabolaParams, target: ParabolaParams) => (
  `Δa ${formatValue(target.a - current.a)} · Δh ${formatValue(target.h - current.h)} · Δk ${formatValue(target.k - current.k)}`
);
