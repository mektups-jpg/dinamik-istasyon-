export type CountingMode = 'product' | 'sum' | 'seal';

export interface CountingState {
  beltProgress: number;
  selectedMode: CountingMode | null;
  selectedToken: number | null;
  sealArmed: boolean;
}

export interface CountingTarget {
  id: CountingMode;
  title: string;
  shortLabel: string;
  atomId: string;
  expression: string;
  expected: number;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface CountingMeasure {
  expression: string;
  expected: number;
  selectedModeLabel: string;
  selectedTokenLabel: string;
  targetLabel: string;
}
