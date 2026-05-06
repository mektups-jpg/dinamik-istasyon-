export type SignDragTarget = 'root-left' | 'root-right' | 'positive-band' | 'negative-band';

export interface SignScannerState {
  rootLeft: number;
  rootRight: number;
  positiveBand: number;
  negativeBand: number;
}

export interface SignMissionTarget {
  id: string;
  title: string;
  shortLabel: string;
  accent: string;
  hint: string;
  success: string;
}

export interface SignMeasure {
  leftRootLabel: string;
  rightRootLabel: string;
  positiveLabel: string;
  negativeLabel: string;
  expression: string;
}
