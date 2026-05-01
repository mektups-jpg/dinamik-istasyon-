import type { PointerEvent as ReactPointerEvent } from 'react';

export interface GraphPoint {
  x: number;
  y: number;
}

export type AxisChoice = 'x-axis' | 'y-axis' | 'y-equals-x';

export type DragTarget = 'center' | 'angle';

export type ForensicsPointerHandler = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;

