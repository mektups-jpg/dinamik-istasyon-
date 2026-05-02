import type { PointerEvent as ReactPointerEvent } from 'react';

export interface GraphPoint {
  x: number;
  y: number;
}

export interface ParabolaParams {
  a: number;
  h: number;
  k: number;
}

export type DragTarget = 'vertex' | 'width';

export interface ParabolaTarget {
  label: string;
  atomId: string;
  params: ParabolaParams;
  hint: string;
}

export type ParabolaPointerHandler = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;
