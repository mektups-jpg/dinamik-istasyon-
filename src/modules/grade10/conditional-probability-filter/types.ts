export type ConditionalChoice = 'condition' | 'target' | 'fraction' | 'seal';

export interface ConditionalState {
  railProgress: number;
  conditionOn: boolean;
  targetOn: boolean;
  selectedFraction: string | null;
  reportSealed: boolean;
}

export interface ConditionalTarget {
  id: 'condition' | 'target' | 'fraction';
  title: string;
  shortLabel: string;
  atomId: string;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface ConditionalMeasure {
  universe: string;
  favorable: string;
  selectedFractionLabel: string;
  targetLabel: string;
}
