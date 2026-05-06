export type VaultMode = 'prime' | 'divisor';

export interface PrimeVaultState {
  scannerProgress: number;
  selectedPrimes: number[];
  selectedDivisors: number[];
}

export interface PrimeVaultTarget {
  id: VaultMode;
  title: string;
  shortLabel: string;
  atomId: string;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface PrimeVaultMeasure {
  number: number;
  primeProduct: string;
  divisorCount: number;
  selectedPrimeLabel: string;
  selectedDivisorLabel: string;
  targetLabel: string;
}
