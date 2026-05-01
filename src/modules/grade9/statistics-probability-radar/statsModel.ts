import { BoxPlotModel, GroupData, GroupKey, Point } from './types';

export const groups: GroupData[] = [
  { key: 'A', x: 160, values: [42, 60, 72, 88, 96], color: '#B388FF' },
  { key: 'B', x: 360, values: [67, 70, 72, 73, 76], color: '#00FF88' },
  { key: 'C', x: 560, values: [35, 54, 78, 92, 99], color: '#FBBF24' },
];

export const boxPlot: BoxPlotModel = {
  min: 42,
  q1: 55,
  median: 70,
  q3: 82,
  max: 96,
};

export const initialScanner: Point = { x: 160, y: 250 };
export const initialMedianHandle: Point = { x: 230, y: 248 };

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function deviation(values: number[]) {
  const avg = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length);
}

export function nearestGroup(x: number): GroupKey {
  return groups.reduce((best, group) => Math.abs(group.x - x) < Math.abs(group.x - best.x) ? group : best, groups[0]).key;
}

export function isStableScanner(point: Point) {
  return Math.abs(point.x - 360) <= 58 && point.y >= 145 && point.y <= 355;
}

export function scaleBoxValue(value: number) {
  return 128 + ((value - boxPlot.min) / (boxPlot.max - boxPlot.min)) * 464;
}

export function isMedianLocked(point: Point) {
  return Math.abs(point.x - scaleBoxValue(boxPlot.median)) <= 26 && point.y >= 166 && point.y <= 334;
}
