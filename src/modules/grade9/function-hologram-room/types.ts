import type { PointerEvent as ReactPointerEvent } from 'react';

export interface GraphPoint {
  x: number;
  y: number;
}

export interface FunctionParams {
  a: number;
  r: number;
  k: number;
}

export type DragTarget = 'anchor' | 'tilt';

export interface CalibrationTarget {
  label: string;
  atomId: string;
  params: FunctionParams;
  hint: string;
}

export type FunctionPointerHandler = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;
