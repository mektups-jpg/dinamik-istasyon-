import { ScaleMeasure, ScaleMode, ScaleState, ScaleTarget } from './types';

export const scaleFrame = {
  width: 860,
  height: 540,
  railX: 108,
  railY: 456,
  railWidth: 640,
  chamberX: 82,
  chamberY: 86,
  chamberWidth: 464,
  chamberHeight: 292,
  meterX: 590,
  meterY: 112,
  meterWidth: 178,
  meterHeight: 266,
};

export const scaleTargets: ScaleTarget[] = [
  {
    id: 'growth-problem',
    atomId: 'MAT.11.1.6.1',
    mode: 'growth',
    targetDial: 0.75,
    label: '6 saatlik üstel büyüme',
    hint: 'Zaman kadranını 6 saat eşiğine getir; koloni 1000 bandını aşmalı.',
    formula: 'N(t)=120·1.55^t',
    unit: 'koloni',
  },
  {
    id: 'desibel-compressor',
    atomId: 'MAT.11.1.6.2',
    mode: 'desibel',
    targetDial: 0.667,
    label: '40 dB ses oranı',
    hint: 'Ses oranını 10^4 civarına sıkıştır; desibel göstergesi 40 dB okumalı.',
    formula: 'β=10·log(I/I0)',
    unit: 'dB',
  },
  {
    id: 'richter-seismograph',
    atomId: 'MAT.11.1.6.3',
    mode: 'richter',
    targetDial: 0.6,
    label: 'Richter +3 farkı',
    hint: 'Genlik oranını 1000 kata yaklaştır; Richter farkı 3 olmalı.',
    formula: 'ΔR=log(A/A0)',
    unit: 'ΔR',
  },
];

export const initialScaleState: ScaleState = {
  dial: 0.22,
};

export const modeCopy: Record<ScaleMode, { title: string; short: string; color: string; glow: string }> = {
  growth: {
    title: 'Üstel büyüme',
    short: 'Büyüme',
    color: '#34D399',
    glow: 'rgba(52,211,153,0.28)',
  },
  desibel: {
    title: 'Desibel kompresörü',
    short: 'Desibel',
    color: '#22D3EE',
    glow: 'rgba(34,211,238,0.28)',
  },
  richter: {
    title: 'Richter sismografı',
    short: 'Richter',
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.26)',
  },
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const roundDial = (dial: number) => Math.round(clamp(dial, 0, 1) * 1000) / 1000;

export const dialToRailX = (dial: number) => scaleFrame.railX + roundDial(dial) * scaleFrame.railWidth;

export const railXToDial = (x: number) => {
  const ratio = (clamp(x, scaleFrame.railX, scaleFrame.railX + scaleFrame.railWidth) - scaleFrame.railX) / scaleFrame.railWidth;
  return roundDial(ratio);
};

export const formatRatio = (ratio: number) => {
  if (ratio >= 1_000_000) return `${(ratio / 1_000_000).toFixed(1)}M kat`;
  if (ratio >= 10_000) return `${Math.round(ratio / 1000)}K kat`;
  if (ratio >= 1000) return `${(ratio / 1000).toFixed(1)}K kat`;
  if (ratio >= 100) return `${Math.round(ratio)} kat`;
  return `${ratio.toFixed(1)} kat`;
};

export const formatOutput = (value: number, mode: ScaleMode) => {
  if (mode === 'growth') return `${Math.round(value)} koloni`;
  if (mode === 'desibel') return `${Math.round(value)} dB`;
  return `ΔR=${value.toFixed(1)}`;
};

export const measureScale = (state: ScaleState, target: ScaleTarget): ScaleMeasure => {
  if (target.mode === 'growth') {
    const time = state.dial * 8;
    const ratio = Math.pow(1.55, time);
    const colony = 120 * ratio;
    return {
      dial: state.dial,
      mode: target.mode,
      exponent: time,
      ratio,
      output: colony,
      compression: clamp(colony / 1800, 0, 1),
      rawLabel: `${time.toFixed(1)} saat`,
      outputLabel: formatOutput(colony, target.mode),
      detailLabel: formatRatio(ratio),
      formulaLabel: `N=120·1.55^${time.toFixed(1)}`,
    };
  }

  if (target.mode === 'desibel') {
    const exponent = state.dial * 6;
    const ratio = Math.pow(10, exponent);
    const desibel = 10 * exponent;
    return {
      dial: state.dial,
      mode: target.mode,
      exponent,
      ratio,
      output: desibel,
      compression: clamp(desibel / 60, 0, 1),
      rawLabel: formatRatio(ratio),
      outputLabel: formatOutput(desibel, target.mode),
      detailLabel: `10^${exponent.toFixed(1)} oran`,
      formulaLabel: `10·log(${formatRatio(ratio)})`,
    };
  }

  const exponent = state.dial * 5;
  const ratio = Math.pow(10, exponent);
  return {
    dial: state.dial,
    mode: target.mode,
    exponent,
    ratio,
    output: exponent,
    compression: clamp(exponent / 5, 0, 1),
    rawLabel: formatRatio(ratio),
    outputLabel: formatOutput(exponent, target.mode),
    detailLabel: `10^${exponent.toFixed(1)} genlik`,
    formulaLabel: `log(${formatRatio(ratio)})`,
  };
};

export const isTargetMatched = (state: ScaleState, target: ScaleTarget) => {
  const measure = measureScale(state, target);
  if (target.mode === 'growth') return Math.abs(state.dial - target.targetDial) <= 0.045 && measure.output >= 1000;
  return Math.abs(state.dial - target.targetDial) <= 0.04;
};

export const prepareScaleMission = (target: ScaleTarget): ScaleState => {
  if (target.mode === 'growth') return { dial: 0.2 };
  if (target.mode === 'desibel') return { dial: 0.28 };
  return { dial: 0.24 };
};

export const compressionY = (compression: number) => {
  const bottom = scaleFrame.meterY + scaleFrame.meterHeight - 24;
  const top = scaleFrame.meterY + 28;
  return bottom - clamp(compression, 0, 1) * (bottom - top);
};
