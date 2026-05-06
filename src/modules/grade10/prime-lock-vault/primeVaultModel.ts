import { PrimeVaultMeasure, PrimeVaultState, PrimeVaultTarget } from './types';

export const vaultNumber = 30;
export const primeFactors = [2, 3, 5];
export const fullDivisors = [1, 2, 3, 5, 6, 10, 15, 30];
export const decoyDivisors = [4, 8, 9, 12, 20, 25];
export const primeLaserTestIds: Record<number, string> = {
  2: 'prime-laser-2',
  3: 'prime-laser-3',
  5: 'prime-laser-5',
};
export const divisorTileTestIds: Record<number, string> = {
  1: 'divisor-tile-1',
  2: 'divisor-tile-2',
  3: 'divisor-tile-3',
  5: 'divisor-tile-5',
  6: 'divisor-tile-6',
  10: 'divisor-tile-10',
  15: 'divisor-tile-15',
  30: 'divisor-tile-30',
};

export const vaultFrame = {
  width: 900,
  height: 650,
  railLeft: 190,
  railRight: 710,
  railY: 178,
};

export const vaultTargets: PrimeVaultTarget[] = [
  {
    id: 'prime',
    title: 'Asal Lazerler',
    shortLabel: '2 x 3 x 5',
    atomId: 'MAT.10.1.1.1',
    targetProgress: 0.28,
    accent: '#22D3EE',
    hint: 'Önce 30 sayısını kalansız bölen asal ışınları ayır, sonra tarayıcıyı asal çekirdeğe getir.',
    success: 'Asal çarpan çekirdeği izole edildi: 30 = 2 x 3 x 5.',
  },
  {
    id: 'divisor',
    title: 'Tam Bölen Rafı',
    shortLabel: '8 bölen',
    atomId: 'MAT.10.1.1.2',
    targetProgress: 0.74,
    accent: '#FBBF24',
    hint: 'Rafı uçlardan içeri doğru tara: her seçtiğin taş 30 ile kalansız eşleşmeli.',
    success: 'Tam bölen rafı eksiksiz kilitlendi.',
  },
];

export const initialPrimeVaultState: PrimeVaultState = {
  scannerProgress: 0.48,
  selectedPrimes: [],
  selectedDivisors: [],
};

export function resetForPrimeVaultMission(activeIndex: number): PrimeVaultState {
  if (activeIndex === 0) return initialPrimeVaultState;
  return { scannerProgress: 0.36, selectedPrimes: primeFactors, selectedDivisors: [] };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function scannerX(progress: number) {
  return vaultFrame.railLeft + clamp(progress) * (vaultFrame.railRight - vaultFrame.railLeft);
}

export function scannerProgressFromX(x: number) {
  return roundProgress((x - vaultFrame.railLeft) / (vaultFrame.railRight - vaultFrame.railLeft));
}

export function toggleValue(values: number[], value: number) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value].sort((a, b) => a - b);
}

export function measureVault(state: PrimeVaultState, target: PrimeVaultTarget): PrimeVaultMeasure {
  return {
    number: vaultNumber,
    primeProduct: primeFactors.join(' x '),
    divisorCount: fullDivisors.length,
    selectedPrimeLabel: state.selectedPrimes.length ? state.selectedPrimes.join(', ') : 'seçilmedi',
    selectedDivisorLabel: state.selectedDivisors.length ? state.selectedDivisors.join(', ') : 'seçilmedi',
    targetLabel: target.id === 'prime' ? 'asal çekirdek' : 'bölen rafı',
  };
}

export function isPrimeVaultMissionMatched(state: PrimeVaultState, target: PrimeVaultTarget) {
  const scannerOk = Math.abs(state.scannerProgress - target.targetProgress) <= 0.045;
  if (!scannerOk) return false;
  if (target.id === 'prime') return sameSet(state.selectedPrimes, primeFactors);
  return sameSet(state.selectedDivisors, fullDivisors);
}

function sameSet(left: number[], right: number[]) {
  if (left.length !== right.length) return false;
  return [...left].sort((a, b) => a - b).every((value, index) => value === [...right].sort((a, b) => a - b)[index]);
}
