import { DomainParams, DomainTarget, DragTarget, GraphPoint } from './types';

export const graphConfig = {
  originX: 360,
  originY: 270,
  scale: 44,
  minX: -7,
  maxX: 7,
  minY: -4.8,
  maxY: 5.2,
};

export const initialParams: DomainParams = {
  rootStartX: -2,
  safeGateX: -1.6,
  asymptoteX: 1.8,
  forbiddenX: 1.4,
};

export const domainTargets: DomainTarget[] = [
  {
    label: '√x başlangıcı',
    atomId: 'MAT.10.2.3.1',
    dragTarget: 'rootStart',
    targetX: 0,
    hint: 'Karekök grafiğinin başlangıç düğümünü orijine taşı. Grafik sadece sağa doğru doğar.',
  },
  {
    label: 'x ≥ 0 güvenli bölgesi',
    atomId: 'MAT.10.2.3.2',
    dragTarget: 'safeGate',
    targetX: 0,
    hint: 'Güvenlik kapısını x=0 çizgisine getir. Sol taraf karekök için yasak bölgedir.',
  },
  {
    label: '1/x asimptotu',
    atomId: 'MAT.10.2.4.1',
    dragTarget: 'asymptote',
    targetX: 0,
    hint: 'Rasyonel grafiğin dikey asimptot duvarını y eksenine hizala.',
  },
  {
    label: 'Payda sıfır alarmı',
    atomId: 'MAT.10.2.4.2',
    dragTarget: 'forbidden',
    targetX: 0,
    hint: 'Kırmızı yasak işaretini x=0 noktasına kilitle. Payda sıfır yapan nokta atlanır.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundToTenth = (value: number) => Math.round(value * 10) / 10;

export const formatValue = (value: number) => {
  const rounded = roundToTenth(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

export const graphToSvg = (point: GraphPoint): GraphPoint => ({
  x: graphConfig.originX + point.x * graphConfig.scale,
  y: graphConfig.originY - point.y * graphConfig.scale,
});

export const svgToGraph = (point: GraphPoint): GraphPoint => ({
  x: roundToTenth(clamp((point.x - graphConfig.originX) / graphConfig.scale, graphConfig.minX, graphConfig.maxX)),
  y: roundToTenth(clamp((graphConfig.originY - point.y) / graphConfig.scale, graphConfig.minY, graphConfig.maxY)),
});

export const getXValue = (params: DomainParams, target: DragTarget) => params[target === 'rootStart' ? 'rootStartX' : target === 'safeGate' ? 'safeGateX' : target === 'asymptote' ? 'asymptoteX' : 'forbiddenX'];

export const setXValue = (params: DomainParams, target: DragTarget, value: number): DomainParams => {
  const x = roundToTenth(clamp(value, -4.5, 4.5));
  if (target === 'rootStart') return { ...params, rootStartX: x };
  if (target === 'safeGate') return { ...params, safeGateX: x };
  if (target === 'asymptote') return { ...params, asymptoteX: x };
  return { ...params, forbiddenX: x };
};

export const createRootPoints = (startX: number) => {
  const points: string[] = [];
  for (let x = startX; x <= graphConfig.maxX + 0.001; x += 0.12) {
    const y = Math.sqrt(Math.max(0, x - startX));
    const svg = graphToSvg({ x, y });
    points.push(`${svg.x.toFixed(1)},${svg.y.toFixed(1)}`);
  }
  return points.join(' ');
};

export const createRationalBranch = (asymptoteX: number, side: 'left' | 'right') => {
  const points: string[] = [];
  const start = side === 'left' ? graphConfig.minX : asymptoteX + 0.18;
  const end = side === 'left' ? asymptoteX - 0.18 : graphConfig.maxX;
  for (let x = start; x <= end + 0.001; x += 0.08) {
    const y = 1 / (x - asymptoteX);
    if (Math.abs(y) <= graphConfig.maxY) {
      const svg = graphToSvg({ x, y });
      points.push(`${svg.x.toFixed(1)},${svg.y.toFixed(1)}`);
    }
  }
  return points.join(' ');
};

export const isTargetMatched = (params: DomainParams, target: DomainTarget) => Math.abs(getXValue(params, target.dragTarget) - target.targetX) <= 0.18;

export const deltaLabel = (params: DomainParams, target: DomainTarget) => `Δx ${formatValue(target.targetX - getXValue(params, target.dragTarget))}`;
