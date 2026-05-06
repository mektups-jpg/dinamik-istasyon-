import { RemainderLens, RemainderMeasure, RemainderState, RemainderTarget } from './types';

export const remainderFrame = {
  width: 900,
  height: 640,
  rail: { x1: 132, x2: 768, y: 548 },
};

export const remainderTargets: RemainderTarget[] = [
  {
    id: 'sum',
    title: 'Rakam Toplamı Kapısı',
    shortLabel: 'mod 9 kalan 2',
    atomId: 'MAT.10.1.3.1',
    number: 758,
    modulus: 9,
    trace: '7 + 5 + 8',
    traceValue: '20',
    expectedRemainder: 2,
    targetProgress: 0.24,
    accent: '#22D3EE',
    hint: 'Kapsülü rakam toplamı kapısına getir, mod 9 lensini ve kalan 2 tokenını seç.',
    success: 'Rakam toplamı izi kilitlendi: 758 mod 9 ile 20 mod 9 aynı kalan 2 verir.',
  },
  {
    id: 'last-digit',
    title: 'Son Basamak Kapısı',
    shortLabel: 'mod 5 kalan 3',
    atomId: 'MAT.10.1.3.1',
    number: 748,
    modulus: 5,
    trace: 'son basamak',
    traceValue: '8',
    expectedRemainder: 3,
    targetProgress: 0.52,
    accent: '#A78BFA',
    hint: 'Kapsülü son basamak kapısına getir, mod 5 lensini ve kalan 3 tokenını seç.',
    success: 'Son basamak izi kilitlendi: 748 mod 5 ile 8 mod 5 aynı kalan 3 verir.',
  },
  {
    id: 'last-two',
    title: 'Son İki Basamak Kapısı',
    shortLabel: 'mod 4 kalan 2',
    atomId: 'MAT.10.1.3.1',
    number: 3714,
    modulus: 4,
    trace: 'son iki basamak',
    traceValue: '14',
    expectedRemainder: 2,
    targetProgress: 0.8,
    accent: '#FBBF24',
    hint: 'Kapsülü son iki basamak kapısına getir, mod 4 lensini ve kalan 2 tokenını seç.',
    success: 'Son iki basamak izi kilitlendi: 3714 mod 4 ile 14 mod 4 aynı kalan 2 verir.',
  },
];

export const initialRemainderState: RemainderState = {
  gateProgress: 0.08,
  selectedLens: null,
  selectedRemainder: null,
};

export function resetForRemainderMission(activeIndex: number): RemainderState {
  if (activeIndex === 0) return initialRemainderState;
  if (activeIndex === 1) return { gateProgress: 0.38, selectedLens: null, selectedRemainder: null };
  return { gateProgress: 0.66, selectedLens: null, selectedRemainder: null };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function gateXFromProgress(progress: number) {
  return remainderFrame.rail.x1 + clamp(progress) * (remainderFrame.rail.x2 - remainderFrame.rail.x1);
}

export function progressFromX(x: number) {
  return roundProgress((x - remainderFrame.rail.x1) / (remainderFrame.rail.x2 - remainderFrame.rail.x1));
}

export function measureRemainder(state: RemainderState, target: RemainderTarget): RemainderMeasure {
  return {
    number: target.number,
    modulus: target.modulus,
    trace: target.trace,
    traceValue: target.traceValue,
    selectedLensLabel: lensLabel(state.selectedLens),
    selectedRemainderLabel: state.selectedRemainder === null ? 'seçilmedi' : String(state.selectedRemainder),
    resultLabel: `${target.number} mod ${target.modulus} = ${target.expectedRemainder}`,
    targetLabel: `${Math.round(target.targetProgress * 100)}% kapı hedefi`,
  };
}

export function isRemainderMissionMatched(state: RemainderState, target: RemainderTarget) {
  return (
    state.selectedLens === target.id &&
    state.selectedRemainder === target.expectedRemainder &&
    Math.abs(state.gateProgress - target.targetProgress) <= 0.045
  );
}

export function lensLabel(lens: RemainderLens | null) {
  if (lens === 'sum') return 'rakam toplamı';
  if (lens === 'last-digit') return 'son basamak';
  if (lens === 'last-two') return 'son iki basamak';
  return 'seçilmedi';
}
