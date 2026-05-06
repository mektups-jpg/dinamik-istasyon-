import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export type OperationKind = 'add' | 'subtract' | 'multiply' | 'divide';

export interface ValuePoint {
  x: number;
  f: number;
  g: number;
}

export interface OutputValue {
  x: number;
  f: number;
  g: number;
  resultLabel: string;
  blocked: boolean;
}

export interface OperationTarget {
  id: string;
  atomId: string;
  operation: OperationKind;
  title: string;
  hint: string;
  success: string;
  formula: string;
}

export interface OperationMeta {
  label: string;
  short: string;
  symbol: string;
  color: string;
  glow: string;
  phrase: string;
}

export interface OperationState {
  selected: OperationKind | null;
}

export interface OperationMeasure {
  outputs: OutputValue[];
  operationLabel: string;
  operationSymbol: string;
  formulaLabel: string;
  nextAction: string;
  safetyLabel: string;
}

export type OperationKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
