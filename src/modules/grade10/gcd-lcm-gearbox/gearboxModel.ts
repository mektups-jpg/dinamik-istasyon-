import { GcdGear, GearMeasure, GearMissionTarget, GearState, LcmGear } from './types';

export const gearboxFrame = {
  width: 900,
  height: 640,
  rail: { x1: 136, x2: 764, y: 560 },
};

const gcdGearValues: Record<GcdGear, number> = {
  '2': 2,
  '3': 3,
};

const lcmGearValues: Record<LcmGear, number> = {
  '4': 4,
  '9': 9,
};

export const gearTargets: GearMissionTarget[] = [
  {
    id: 'gcd',
    title: 'EBOB Ortak Aksı',
    shortLabel: 'EBOB = 6',
    atomId: 'MAT.10.1.2.1',
    targetProgress: 0.26,
    accent: '#22D3EE',
    hint: 'Aksı ortak diş çizgisine getir ve iki sayıda da bulunan küçük kuvvetleri seç: 2 ve 3.',
    success: 'Ortak küçük dişler kilitlendi: EBOB = 2 · 3 = 6.',
  },
  {
    id: 'lcm',
    title: 'EKOK Birleşik Aksı',
    shortLabel: 'EKOK = 36',
    atomId: 'MAT.10.1.2.2',
    targetProgress: 0.74,
    accent: '#A78BFA',
    hint: 'Aksı birleşik diş çizgisine getir ve büyük kuvvetleri seç: 2² = 4 ve 3² = 9.',
    success: 'Birleşik büyük dişler kilitlendi: EKOK = 4 · 9 = 36.',
  },
  {
    id: 'seal',
    title: 'Karar Mührü',
    shortLabel: '6 ve 36 ayrımı',
    atomId: 'MAT.10.1.2.2',
    targetProgress: 0.5,
    accent: '#FBBF24',
    hint: 'Aksı rapor çizgisine getir ve EBOB/EKOK mühür çekirdeğini seç.',
    success: 'Rapor mühürlendi: ortak küçük kuvvetler EBOB, birleşik büyük kuvvetler EKOK üretir.',
  },
];

export const initialGearState: GearState = {
  axleProgress: 0.1,
  selectedGcdGears: [],
  selectedLcmGears: [],
  sealArmed: false,
};

export function resetForGearMission(activeIndex: number): GearState {
  if (activeIndex === 0) return initialGearState;
  if (activeIndex === 1) {
    return {
      axleProgress: 0.88,
      selectedGcdGears: ['2', '3'],
      selectedLcmGears: [],
      sealArmed: false,
    };
  }
  return {
    axleProgress: 0.5,
    selectedGcdGears: ['2', '3'],
    selectedLcmGears: ['4', '9'],
    sealArmed: false,
  };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function axleXFromProgress(progress: number) {
  return gearboxFrame.rail.x1 + clamp(progress) * (gearboxFrame.rail.x2 - gearboxFrame.rail.x1);
}

export function progressFromX(x: number) {
  return roundProgress((x - gearboxFrame.rail.x1) / (gearboxFrame.rail.x2 - gearboxFrame.rail.x1));
}

export function toggleGcdGear(gears: GcdGear[], value: GcdGear) {
  return gears.includes(value) ? gears.filter((gear) => gear !== value) : [...gears, value].sort();
}

export function toggleLcmGear(gears: LcmGear[], value: LcmGear) {
  return gears.includes(value) ? gears.filter((gear) => gear !== value) : [...gears, value].sort();
}

export function measureGearbox(state: GearState, target: GearMissionTarget): GearMeasure {
  const gcdProduct = state.selectedGcdGears.reduce((product, gear) => product * gcdGearValues[gear], 1);
  const lcmProduct = state.selectedLcmGears.reduce((product, gear) => product * lcmGearValues[gear], 1);
  return {
    inputA: 12,
    inputB: 18,
    factorA: '2² · 3',
    factorB: '2 · 3²',
    gcdProduct,
    lcmProduct,
    selectedGcdLabel: state.selectedGcdGears.length > 0 ? state.selectedGcdGears.join(' · ') : 'seçilmedi',
    selectedLcmLabel: state.selectedLcmGears.length > 0 ? state.selectedLcmGears.join(' · ') : 'seçilmedi',
    targetLabel: `${Math.round(target.targetProgress * 100)}% aks hedefi`,
  };
}

export function isGearMissionMatched(state: GearState, target: GearMissionTarget) {
  const aligned = Math.abs(state.axleProgress - target.targetProgress) <= 0.045;
  if (target.id === 'gcd') return aligned && sameSet(state.selectedGcdGears, ['2', '3']) && state.selectedLcmGears.length === 0;
  if (target.id === 'lcm') return aligned && sameSet(state.selectedLcmGears, ['4', '9']);
  return aligned && state.sealArmed && sameSet(state.selectedGcdGears, ['2', '3']) && sameSet(state.selectedLcmGears, ['4', '9']);
}

export function gearModeLabel(target: GearMissionTarget) {
  if (target.id === 'gcd') return 'ortak küçük kuvvetler';
  if (target.id === 'lcm') return 'birleşik büyük kuvvetler';
  return 'son karşılaştırma mührü';
}

function sameSet<T extends string>(actual: T[], expected: T[]) {
  return actual.length === expected.length && expected.every((value) => actual.includes(value));
}
