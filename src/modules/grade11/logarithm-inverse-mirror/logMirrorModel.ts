import { LogMirrorMeasure, LogMirrorState, LogMirrorTarget, LogMode } from './types';

export const logFrame = {
  width: 860,
  height: 560,
  plotX: 88,
  plotY: 58,
  plotWidth: 672,
  plotHeight: 354,
  minAxis: -3,
  maxAxis: 6,
  baseRailX: 132,
  baseRailY: 486,
  baseRailWidth: 286,
  mirrorRailX: 486,
  mirrorRailY: 486,
  mirrorRailWidth: 236,
  minBase: 0.25,
  maxBase: 3,
};

export const initialLogMirrorState: LogMirrorState = {
  base: 2,
  mirrorPower: 0,
};

export const logMirrorTargets: LogMirrorTarget[] = [
  {
    id: 'inverse-mirror',
    atomId: 'MAT.11.1.4.1',
    kind: 'inverse',
    targetBase: 2,
    targetMirror: 1,
    label: 'y=x aynası: ters dönüşüm',
    hint: 'Ayna sürgüsünü %100 konumuna getir; üstel eğrinin x ve y rolleri yer değiştirsin.',
  },
  {
    id: 'log-growth',
    atomId: 'MAT.11.1.5.1',
    kind: 'log-growth',
    targetBase: 2.2,
    targetMirror: 1,
    label: 'a>1: artan logaritma',
    hint: 'Ayna açık kalmalı ve taban 1 kapısının sağında olmalı.',
  },
  {
    id: 'log-decay',
    atomId: 'MAT.11.1.5.2',
    kind: 'log-decay',
    targetBase: 0.5,
    targetMirror: 1,
    label: '0<a<1: azalan logaritma',
    hint: 'Ayna açık kalmalı ve taban 0 ile 1 arasında olmalı.',
  },
];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundBase = (base: number) => Math.round(base * 100) / 100;

export const roundMirror = (value: number) => Math.round(value * 100) / 100;

export const modeFromBase = (base: number): LogMode => {
  if (base > 1.08) return 'growth';
  if (base < 0.92) return 'decay';
  return 'neutral';
};

export const valueToPlotX = (value: number) => {
  const { plotX, plotWidth, minAxis, maxAxis } = logFrame;
  return plotX + ((clamp(value, minAxis, maxAxis) - minAxis) / (maxAxis - minAxis)) * plotWidth;
};

export const valueToPlotY = (value: number) => {
  const { plotY, plotHeight, minAxis, maxAxis } = logFrame;
  return plotY + plotHeight - ((clamp(value, minAxis, maxAxis) - minAxis) / (maxAxis - minAxis)) * plotHeight;
};

export const baseToRailX = (base: number) => {
  const { baseRailX, baseRailWidth, minBase, maxBase } = logFrame;
  return baseRailX + ((clamp(base, minBase, maxBase) - minBase) / (maxBase - minBase)) * baseRailWidth;
};

export const railXToBase = (x: number) => {
  const { baseRailX, baseRailWidth, minBase, maxBase } = logFrame;
  const ratio = (clamp(x, baseRailX, baseRailX + baseRailWidth) - baseRailX) / baseRailWidth;
  return roundBase(minBase + ratio * (maxBase - minBase));
};

export const mirrorToRailX = (mirrorPower: number) => logFrame.mirrorRailX + clamp(mirrorPower, 0, 1) * logFrame.mirrorRailWidth;

export const railXToMirror = (x: number) => {
  const ratio = (clamp(x, logFrame.mirrorRailX, logFrame.mirrorRailX + logFrame.mirrorRailWidth) - logFrame.mirrorRailX) / logFrame.mirrorRailWidth;
  return roundMirror(ratio);
};

export const expValue = (base: number, x: number) => Math.pow(base, x);

export const logValue = (base: number, x: number) => Math.log(x) / Math.log(base);

const blend = (from: number, to: number, power: number) => from + (to - from) * power;

export const createMirrorCurve = (base: number, mirrorPower: number) => {
  const points: string[] = [];
  for (let step = 0; step <= 124; step += 1) {
    const t = -2.2 + (step / 124) * 4.4;
    const y = expValue(base, t);
    const xLogical = blend(t, y, mirrorPower);
    const yLogical = blend(y, t, mirrorPower);
    points.push(`${valueToPlotX(xLogical).toFixed(1)},${valueToPlotY(yLogical).toFixed(1)}`);
  }
  return points.join(' ');
};

export const createExpGhostCurve = (base: number) => createMirrorCurve(base, 0);

export const createLogGhostCurve = (base: number) => createMirrorCurve(base, 1);

export const formatBase = (base: number) => base.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');

export const formatPercent = (power: number) => `${Math.round(power * 100)}%`;

export const formatValue = (value: number) => {
  if (!Number.isFinite(value)) return 'tanımsız';
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
};

export const measureLogMirror = (state: LogMirrorState): LogMirrorMeasure => ({
  base: state.base,
  mirrorPower: state.mirrorPower,
  mode: modeFromBase(state.base),
  sampleLeft: logValue(state.base, 0.5),
  sampleOne: logValue(state.base, 1),
  sampleRight: logValue(state.base, 2),
});

export const isTargetMatched = (state: LogMirrorState, target: LogMirrorTarget) => {
  const mirrorOk = state.mirrorPower >= 0.94;
  if (target.kind === 'inverse') return mirrorOk;
  if (target.kind === 'log-growth') return mirrorOk && modeFromBase(state.base) === 'growth' && state.base >= 1.65;
  if (target.kind === 'log-decay') return mirrorOk && modeFromBase(state.base) === 'decay' && state.base <= 0.72;
  return false;
};
