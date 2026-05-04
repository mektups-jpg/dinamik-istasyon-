import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export type LogMode = 'growth' | 'decay' | 'neutral';
export type LogDragTarget = 'base' | 'mirror';

export interface LogMirrorState {
  base: number;
  mirrorPower: number;
}

export interface LogMirrorTarget {
  id: string;
  atomId: string;
  kind: 'inverse' | 'log-growth' | 'log-decay';
  targetBase: number;
  targetMirror: number;
  label: string;
  hint: string;
}

export interface LogMirrorMeasure {
  base: number;
  mirrorPower: number;
  mode: LogMode;
  sampleLeft: number;
  sampleOne: number;
  sampleRight: number;
}

export type LogPointerHandler = (target: LogDragTarget, event: ReactPointerEvent<SVGElement>) => void;
export type LogKeyboardHandler = (target: LogDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
