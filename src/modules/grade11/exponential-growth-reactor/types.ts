import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export type ExponentialMode = 'growth' | 'decay' | 'neutral';

export interface ExponentialState {
  base: number;
}

export interface ExponentialTarget {
  id: string;
  atomId: string;
  mode: ExponentialMode;
  targetBase: number;
  label: string;
  hint: string;
}

export interface ExponentialMeasure {
  base: number;
  mode: ExponentialMode;
  leftValue: number;
  midValue: number;
  rightValue: number;
}

export type BasePointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type BaseKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
