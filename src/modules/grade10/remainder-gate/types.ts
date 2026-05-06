export type RemainderLens = 'sum' | 'last-digit' | 'last-two';

export interface RemainderState {
  gateProgress: number;
  selectedLens: RemainderLens | null;
  selectedRemainder: number | null;
}

export interface RemainderTarget {
  id: RemainderLens;
  title: string;
  shortLabel: string;
  atomId: string;
  number: number;
  modulus: number;
  trace: string;
  traceValue: string;
  expectedRemainder: number;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface RemainderMeasure {
  number: number;
  modulus: number;
  trace: string;
  traceValue: string;
  selectedLensLabel: string;
  selectedRemainderLabel: string;
  resultLabel: string;
  targetLabel: string;
}
