import { SignMeasure, SignMissionTarget, SignScannerState } from './types';

export const signFrame = {
  width: 900,
  height: 650,
  railX: 132,
  railWidth: 636,
  numberLineY: 372,
};

export const signTargets: SignMissionTarget[] = [
  {
    id: 'root-stops',
    title: 'Kök Durakları',
    shortLabel: 'kökler 2 ve 3',
    accent: '#22D3EE',
    hint: 'İki kök durağını 2 ve 3 lazer çizgilerine taşı.',
    success: 'Kök durakları doğru. Sayı doğrusu üç işaret bölgesine ayrıldı.',
  },
  {
    id: 'positive-band',
    title: 'Büyüklük Bandı',
    shortLabel: 'dış bölgeler > 0',
    accent: '#6EE7B7',
    hint: 'Parabol yukarı baktığı için köklerin dışındaki bölgeler pozitiftir.',
    success: 'Pozitif dış bölgeler kilitlendi. >0 çözümü iki dış aralık oldu.',
  },
  {
    id: 'negative-band',
    title: 'Küçüklük Bandı',
    shortLabel: 'iç bölge < 0',
    accent: '#FBBF24',
    hint: 'Köklerin arasında parabol x ekseninin altında kalır.',
    success: 'Negatif iç bölge kilitlendi. <0 çözümü köklerin arasıdır.',
  },
];

export const initialSignState: SignScannerState = {
  rootLeft: 0.14,
  rootRight: 0.84,
  positiveBand: 0.1,
  negativeBand: 0.1,
};

export function resetForMission(activeIndex: number): SignScannerState {
  if (activeIndex === 0) return initialSignState;
  return {
    rootLeft: 1,
    rootRight: 1,
    positiveBand: activeIndex === 1 ? 0.12 : 1,
    negativeBand: activeIndex === 2 ? 0.12 : 0.1,
  };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function progressToRailX(progress: number) {
  return signFrame.railX + clamp(progress) * signFrame.railWidth;
}

export function railXToProgress(x: number) {
  return clamp((x - signFrame.railX) / signFrame.railWidth);
}

export function rootLeftX(progress: number) {
  return lerp(210, 360, progress);
}

export function rootRightX(progress: number) {
  return lerp(690, 540, progress);
}

export function rootLeftProgressFromX(x: number) {
  return clamp((x - 210) / (360 - 210));
}

export function rootRightProgressFromX(x: number) {
  return clamp((690 - x) / (690 - 540));
}

export function measureSign(state: SignScannerState, activeIndex: number): SignMeasure {
  const rootsOk = areRootsMatched(state);
  const positiveOk = state.positiveBand >= 0.9;
  const negativeOk = state.negativeBand >= 0.9;
  return {
    leftRootLabel: rootsOk ? 'x=2' : 'sol kök açık',
    rightRootLabel: rootsOk ? 'x=3' : 'sağ kök açık',
    positiveLabel: positiveOk ? 'dış aralıklar' : 'bekliyor',
    negativeLabel: negativeOk ? 'iç aralık' : 'bekliyor',
    expression: activeIndex === 2 ? 'x² - 5x + 6 < 0' : activeIndex === 1 ? 'x² - 5x + 6 > 0' : 'x² - 5x + 6 = 0',
  };
}

export function isSignMissionMatched(state: SignScannerState, activeIndex: number) {
  if (activeIndex === 0) return areRootsMatched(state);
  if (activeIndex === 1) return areRootsMatched(state) && state.positiveBand >= 0.9;
  return areRootsMatched(state) && state.negativeBand >= 0.9;
}

export function areRootsMatched(state: SignScannerState) {
  return state.rootLeft >= 0.9 && state.rootRight >= 0.9;
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}
