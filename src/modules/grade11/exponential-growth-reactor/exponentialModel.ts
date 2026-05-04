import { ExponentialMeasure, ExponentialMode, ExponentialState, ExponentialTarget } from './types';

export const exponentialFrame = {
  width: 860,
  height: 540,
  plotX: 86,
  plotY: 68,
  plotWidth: 680,
  plotHeight: 336,
  axisY: 332,
  railY: 472,
  railX: 118,
  railWidth: 624,
  minBase: 0.25,
  maxBase: 3,
  minX: -3,
  maxX: 3,
  maxY: 6,
};

export const initialExponentialState: ExponentialState = {
  base: 1.08,
};

export const exponentialTargets: ExponentialTarget[] = [
  {
    id: 'growth-curve',
    atomId: 'MAT.11.1.3.1',
    mode: 'growth',
    targetBase: 2.2,
    label: 'a > 1: artan grafik',
    hint: 'Taban 1 kapısının sağında olmalı; x arttıkça a^x büyür.',
  },
  {
    id: 'decay-curve',
    atomId: 'MAT.11.1.3.2',
    mode: 'decay',
    targetBase: 0.5,
    label: '0 < a < 1: azalan grafik',
    hint: 'Taban 1 kapısının solunda ama sıfırdan büyük kalmalı; x arttıkça a^x küçülür.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundBase = (base: number) => Math.round(base * 100) / 100;

export const modeFromBase = (base: number): ExponentialMode => {
  if (base > 1.08) return 'growth';
  if (base < 0.92) return 'decay';
  return 'neutral';
};

export const xToPlot = (x: number) => {
  const { plotX, plotWidth, minX, maxX } = exponentialFrame;
  return plotX + ((x - minX) / (maxX - minX)) * plotWidth;
};

export const yToPlot = (y: number) => {
  const clipped = clamp(y, 0, exponentialFrame.maxY);
  return exponentialFrame.axisY - (clipped / exponentialFrame.maxY) * (exponentialFrame.plotHeight - 42);
};

export const baseToRailX = (base: number) => {
  const { railX, railWidth, minBase, maxBase } = exponentialFrame;
  return railX + ((clamp(base, minBase, maxBase) - minBase) / (maxBase - minBase)) * railWidth;
};

export const railXToBase = (x: number) => {
  const { railX, railWidth, minBase, maxBase } = exponentialFrame;
  const ratio = (clamp(x, railX, railX + railWidth) - railX) / railWidth;
  return roundBase(minBase + ratio * (maxBase - minBase));
};

export const exponentialValue = (base: number, x: number) => Math.pow(base, x);

export const createCurvePath = (base: number) => {
  const points: string[] = [];
  for (let step = 0; step <= 120; step += 1) {
    const x = exponentialFrame.minX + (step / 120) * (exponentialFrame.maxX - exponentialFrame.minX);
    const y = exponentialValue(base, x);
    points.push(`${xToPlot(x).toFixed(1)},${yToPlot(y).toFixed(1)}`);
  }
  return points.join(' ');
};

export const createEnergyBars = (base: number) => [-2, -1, 0, 1, 2].map((x) => {
  const value = exponentialValue(base, x);
  const px = xToPlot(x);
  const py = yToPlot(value);
  return {
    x,
    value,
    px,
    py,
    height: exponentialFrame.axisY - py,
  };
});

export const formatBase = (base: number) => base.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');

export const formatValue = (value: number) => {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
};

export const measureExponential = (state: ExponentialState): ExponentialMeasure => ({
  base: state.base,
  mode: modeFromBase(state.base),
  leftValue: exponentialValue(state.base, -2),
  midValue: exponentialValue(state.base, 0),
  rightValue: exponentialValue(state.base, 2),
});

export const isTargetMatched = (state: ExponentialState, target: ExponentialTarget) => {
  const mode = modeFromBase(state.base);
  if (target.mode === 'growth') return mode === 'growth' && state.base >= 1.65;
  if (target.mode === 'decay') return mode === 'decay' && state.base <= 0.72;
  return mode === 'neutral';
};
