export type CrossTableChoice = 'cell' | 'deviation' | 'bias' | 'seal';

export interface CrossTableState {
  railProgress: number;
  selectedChoice: CrossTableChoice | null;
  biasFlagged: boolean;
  reportSealed: boolean;
}

export interface CrossTableTarget {
  id: 'cell' | 'deviation' | 'media';
  title: string;
  shortLabel: string;
  atomId: string;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface CrossTableMeasure {
  observed: string;
  expected: string;
  selectedChoiceLabel: string;
  targetLabel: string;
}
