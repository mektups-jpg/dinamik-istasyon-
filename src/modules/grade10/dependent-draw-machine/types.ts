export interface DependentDrawState {
  railProgress: number;
  firstRedRemoved: boolean;
  spaceUpdated: boolean;
  selectedProbability: string | null;
  reportSealed: boolean;
}

export interface DependentDrawTarget {
  id: 'first' | 'space' | 'probability';
  title: string;
  shortLabel: string;
  atomId: string;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface DependentDrawMeasure {
  bagState: string;
  probability: string;
  selectedProbabilityLabel: string;
  targetLabel: string;
}
