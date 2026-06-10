import type { ProbabilityMission } from './types';

export const MODULE_ID = 'probability-experiment-machine';

export const ATOM_IDS = ['MAT.9.7.1.1', 'MAT.9.7.2.1'];

export const MISSIONS: ProbabilityMission[] = [
  {
    id: 'observed-ratio',
    title: 'Gözlemsel Oranı Kur',
    atomId: 'MAT.9.7.1.1',
    prompt: 'Son 100 deney kaydındaki mavi sonuç oranını sayaç kapağıyla eşleştir.',
  },
  {
    id: 'inductive-projection',
    title: 'Oranı Büyük Evrene Taşı',
    atomId: 'MAT.9.7.2.1',
    prompt: '30 denemelik küçük örneklem oranını 200 denemelik tahmin rayına projekte et.',
  },
];

export const OBSERVED_TOTAL = 100;
export const OBSERVED_SUCCESS = 37;
export const SAMPLE_TOTAL = 30;
export const SAMPLE_SUCCESS = 12;
export const PROJECTION_TOTAL = 200;
export const PROJECTION_SUCCESS = 80;

export const observedMinX = 114;
export const observedMaxX = 606;
export const projectionMinX = 118;
export const projectionMaxX = 602;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function observedToX(value: number) {
  return observedMinX + (clamp(value, 0, OBSERVED_TOTAL) / OBSERVED_TOTAL) * (observedMaxX - observedMinX);
}

export function xToObserved(x: number) {
  const ratio = (clamp(x, observedMinX, observedMaxX) - observedMinX) / (observedMaxX - observedMinX);
  return Math.round(ratio * OBSERVED_TOTAL);
}

export function projectionToX(value: number) {
  return projectionMinX + (clamp(value, 0, PROJECTION_TOTAL) / PROJECTION_TOTAL) * (projectionMaxX - projectionMinX);
}

export function xToProjection(x: number) {
  const ratio = (clamp(x, projectionMinX, projectionMaxX) - projectionMinX) / (projectionMaxX - projectionMinX);
  return Math.round(ratio * PROJECTION_TOTAL);
}

export function isObservedCorrect(value: number) {
  return value === OBSERVED_SUCCESS;
}

export function isProjectionCorrect(value: number) {
  return value === PROJECTION_SUCCESS;
}
