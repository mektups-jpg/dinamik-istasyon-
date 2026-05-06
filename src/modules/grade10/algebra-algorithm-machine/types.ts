export type AlgorithmChoice = 'input' | 'pipeline' | 'seal';

export interface AlgorithmState {
  railProgress: number;
  selectedChoice: AlgorithmChoice | null;
  selectedOutput: number | null;
  codeSealed: boolean;
}

export interface AlgorithmTarget {
  id: AlgorithmChoice;
  title: string;
  shortLabel: string;
  atomId: string;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface AlgorithmMeasure {
  expression: string;
  selectedChoiceLabel: string;
  selectedOutputLabel: string;
  targetLabel: string;
}
