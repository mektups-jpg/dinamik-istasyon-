import { ScatterMeasure, ScatterMissionTarget, ScatterPoint } from './types';

export const scatterFrame = {
  width: 900,
  height: 560,
  plotX: 112,
  plotY: 70,
  plotWidth: 620,
  plotHeight: 392,
  minValue: 0,
  maxValue: 10,
};

export const initialScatterPoints: ScatterPoint[] = [
  { id: 'a', label: 'A', x: 2.1, y: 7.5 },
  { id: 'b', label: 'B', x: 4.2, y: 2.2 },
  { id: 'c', label: 'C', x: 6.5, y: 5.3 },
  { id: 'd', label: 'D', x: 8.1, y: 3.1 },
];

const coordinateTargets: ScatterPoint[] = [
  { id: 'a', label: 'A', x: 2, y: 3 },
  { id: 'b', label: 'B', x: 4, y: 4 },
  { id: 'c', label: 'C', x: 6, y: 6 },
  { id: 'd', label: 'D', x: 8, y: 7 },
];

const positiveTargets: ScatterPoint[] = [
  { id: 'a', label: 'A', x: 2, y: 2 },
  { id: 'b', label: 'B', x: 4, y: 3.4 },
  { id: 'c', label: 'C', x: 6, y: 5.8 },
  { id: 'd', label: 'D', x: 8, y: 7.6 },
];

const negativeTargets: ScatterPoint[] = [
  { id: 'a', label: 'A', x: 2, y: 8 },
  { id: 'b', label: 'B', x: 4, y: 6.4 },
  { id: 'c', label: 'C', x: 6, y: 4.2 },
  { id: 'd', label: 'D', x: 8, y: 2.1 },
];

export const scatterTargets: ScatterMissionTarget[] = [
  {
    id: 'place-points',
    atomId: 'MAT.11.3.1.1',
    kind: 'place',
    label: '4/4 koordinat kilidi',
    hint: 'Nokta kapsüllerini hedef halkalara oturt; her çift serpilme grafiğinde kendi koordinatına gelsin.',
    targetPoints: coordinateTargets,
  },
  {
    id: 'positive-trend',
    atomId: 'MAT.11.3.1.2',
    kind: 'positive',
    label: 'Pozitif eğilim ışını',
    hint: 'x arttıkça y de artsın; eğilim ışını sol alttan sağ üste kilitlenmeli.',
    targetPoints: positiveTargets,
  },
  {
    id: 'negative-trend',
    atomId: 'MAT.11.3.1.3',
    kind: 'negative',
    label: 'Negatif eğilim ışını',
    hint: 'x arttıkça y azalsın; eğilim ışını sol üstten sağ alta inmelidir.',
    targetPoints: negativeTargets,
  },
];

export const clampValue = (value: number) => Math.min(scatterFrame.maxValue, Math.max(scatterFrame.minValue, value));

export const roundValue = (value: number) => Math.round(clampValue(value) * 10) / 10;

export const dataToSvg = (point: Pick<ScatterPoint, 'x' | 'y'>) => ({
  x: scatterFrame.plotX + (clampValue(point.x) / scatterFrame.maxValue) * scatterFrame.plotWidth,
  y: scatterFrame.plotY + scatterFrame.plotHeight - (clampValue(point.y) / scatterFrame.maxValue) * scatterFrame.plotHeight,
});

export const svgToData = (x: number, y: number) => ({
  x: roundValue(((x - scatterFrame.plotX) / scatterFrame.plotWidth) * scatterFrame.maxValue),
  y: roundValue(((scatterFrame.plotY + scatterFrame.plotHeight - y) / scatterFrame.plotHeight) * scatterFrame.maxValue),
});

const distance = (first: Pick<ScatterPoint, 'x' | 'y'>, second: Pick<ScatterPoint, 'x' | 'y'>) =>
  Math.hypot(first.x - second.x, first.y - second.y);

export const targetForPoint = (target: ScatterMissionTarget, pointId: string) =>
  target.targetPoints.find((point) => point.id === pointId) ?? target.targetPoints[0];

export const alignToTarget = (target: ScatterMissionTarget) => target.targetPoints.map((point) => ({ ...point }));

export const prepareMissionStart = (target: ScatterMissionTarget) => {
  if (target.kind === 'positive') {
    return [
      { id: 'a', label: 'A', x: 2, y: 7.2 },
      { id: 'b', label: 'B', x: 4, y: 2.7 },
      { id: 'c', label: 'C', x: 6, y: 5.1 },
      { id: 'd', label: 'D', x: 8, y: 3.4 },
    ];
  }

  if (target.kind === 'negative') {
    return [
      { id: 'a', label: 'A', x: 2, y: 2.2 },
      { id: 'b', label: 'B', x: 4, y: 5.8 },
      { id: 'c', label: 'C', x: 6, y: 3.8 },
      { id: 'd', label: 'D', x: 8, y: 7.3 },
    ];
  }

  return initialScatterPoints.map((point) => ({ ...point }));
};

export const measureScatter = (points: ScatterPoint[], target: ScatterMissionTarget): ScatterMeasure => {
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const numerator = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
  const denominator = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const averageError = points.reduce((sum, point) => sum + distance(point, targetForPoint(target, point.id)), 0) / points.length;
  const placedCount = points.filter((point) => distance(point, targetForPoint(target, point.id)) <= 0.45).length;
  const strength = Math.min(1, Math.abs(slope) / 0.65);
  const direction = Math.abs(slope) < 0.18 ? 'zayıf' : slope > 0 ? 'pozitif' : 'negatif';

  return {
    slope,
    direction,
    placedCount,
    averageError,
    strength,
  };
};

export const isScatterTargetMatched = (points: ScatterPoint[], target: ScatterMissionTarget) => {
  const measure = measureScatter(points, target);
  if (target.kind === 'place') return measure.placedCount === target.targetPoints.length;
  if (target.kind === 'positive') return measure.direction === 'pozitif' && measure.slope >= 0.55 && measure.averageError <= 0.75;
  return measure.direction === 'negatif' && measure.slope <= -0.55 && measure.averageError <= 0.75;
};

export const movePoint = (points: ScatterPoint[], pointId: string, next: Pick<ScatterPoint, 'x' | 'y'>) =>
  points.map((point) => (point.id === pointId ? { ...point, x: roundValue(next.x), y: roundValue(next.y) } : point));

export const nudgePoint = (points: ScatterPoint[], pointId: string, dx: number, dy: number) =>
  points.map((point) => (point.id === pointId ? { ...point, x: roundValue(point.x + dx), y: roundValue(point.y + dy) } : point));

export const trendBeamEndpoints = (points: ScatterPoint[]) => {
  const measure = measureScatter(points, scatterTargets[0]);
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const startX = 1.1;
  const endX = 8.9;
  const startY = clampValue(meanY + measure.slope * (startX - meanX));
  const endY = clampValue(meanY + measure.slope * (endX - meanX));

  return {
    start: dataToSvg({ x: startX, y: startY }),
    end: dataToSvg({ x: endX, y: endY }),
  };
};
