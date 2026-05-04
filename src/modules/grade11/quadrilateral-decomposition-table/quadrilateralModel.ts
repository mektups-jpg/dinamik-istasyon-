import { QuadMeasure, QuadrilateralState, QuadTarget, TablePoint } from './types';

export const quadFrame = {
  width: 900,
  height: 560,
  minProgress: 0,
  maxProgress: 1,
  bladeRailX: 150,
  bladeRailY: 500,
  bladeRailWidth: 600,
  areaRailX: 150,
  areaRailY: 456,
  areaRailWidth: 600,
};

export const quadPoints: Record<'A' | 'B' | 'C' | 'D', TablePoint> = {
  A: { x: 220, y: 160 },
  B: { x: 650, y: 120 },
  C: { x: 720, y: 390 },
  D: { x: 175, y: 430 },
};

export const initialQuadrilateralState: QuadrilateralState = {
  cutProgress: 0.2,
  mergeProgress: 0,
};

export const quadTargets: QuadTarget[] = [
  {
    id: 'angle-split',
    atomId: 'MAT.11.2.1.1',
    kind: 'angle',
    label: '180° + 180° = 360°',
    hint: 'Köşegen bıçağını sona kadar çek; dörtgen iki üçgen açı toplamına ayrılsın.',
  },
  {
    id: 'area-merge',
    atomId: 'MAT.11.2.1.2',
    kind: 'area',
    label: 'Alan = üçgen 1 + üçgen 2',
    hint: 'Kesim açık kalsın ve alan birleştiriciyi sağdaki toplam haznesine taşı.',
  },
];

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const roundProgress = (value: number) => Math.round(clamp(value) * 100) / 100;

export const progressToRailX = (progress: number, railX: number, railWidth: number) => railX + clamp(progress) * railWidth;

export const railXToProgress = (x: number, railX: number, railWidth: number) => roundProgress((x - railX) / railWidth);

export const pointOnDiagonal = (progress: number) => ({
  x: quadPoints.A.x + (quadPoints.C.x - quadPoints.A.x) * clamp(progress),
  y: quadPoints.A.y + (quadPoints.C.y - quadPoints.A.y) * clamp(progress),
});

export const polygonPoints = (points: TablePoint[]) => points.map((point) => `${point.x},${point.y}`).join(' ');

export const translatedPolygonPoints = (points: TablePoint[], dx: number, dy: number) => points.map((point) => `${point.x + dx},${point.y + dy}`).join(' ');

export const polygonArea = (points: TablePoint[]) => {
  const sum = points.reduce((total, point, index) => {
    const next = points[(index + 1) % points.length];
    return total + point.x * next.y - next.x * point.y;
  }, 0);
  return Math.abs(sum) / 2;
};

export const formatArea = (area: number) => Math.round(area / 100).toString();

export const formatAreaSum = (triangleOneArea: number, triangleTwoArea: number) => {
  const first = Number(formatArea(triangleOneArea));
  const second = Number(formatArea(triangleTwoArea));
  return String(first + second);
};

export const formatAreaUnit = (value: string) => `${value} br²`;

export const formatAreaWithUnit = (area: number) => formatAreaUnit(formatArea(area));

export const formatAreaSumWithUnit = (triangleOneArea: number, triangleTwoArea: number) =>
  formatAreaUnit(formatAreaSum(triangleOneArea, triangleTwoArea));

export const measureQuadrilateral = (state: QuadrilateralState): QuadMeasure => {
  const triangleOneArea = polygonArea([quadPoints.A, quadPoints.B, quadPoints.C]);
  const triangleTwoArea = polygonArea([quadPoints.A, quadPoints.C, quadPoints.D]);

  return {
    cutProgress: state.cutProgress,
    mergeProgress: state.mergeProgress,
    triangleOneArea,
    triangleTwoArea,
    totalArea: triangleOneArea + triangleTwoArea,
    angleSum: 360,
  };
};

export const isTargetMatched = (state: QuadrilateralState, target: QuadTarget) => {
  if (target.kind === 'angle') return state.cutProgress >= 0.94;
  return state.cutProgress >= 0.94 && state.mergeProgress >= 0.9;
};
