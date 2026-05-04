import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export type ScaleMode = 'growth' | 'desibel' | 'richter';

export interface ScaleState {
  dial: number;
}

export interface ScaleTarget {
  id: string;
  atomId: string;
  mode: ScaleMode;
  targetDial: number;
  label: string;
  hint: string;
  formula: string;
  unit: string;
}

export interface ScaleMeasure {
  dial: number;
  mode: ScaleMode;
  exponent: number;
  ratio: number;
  output: number;
  compression: number;
  rawLabel: string;
  outputLabel: string;
  detailLabel: string;
  formulaLabel: string;
}

export type ScalePointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type ScaleKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
