import type { PointerEvent as ReactPointerEvent } from 'react';

export interface GraphPoint {
  x: number;
  y: number;
}

export interface DomainParams {
  rootStartX: number;
  safeGateX: number;
  asymptoteX: number;
  forbiddenX: number;
}

export type DragTarget = 'rootStart' | 'safeGate' | 'asymptote' | 'forbidden';

export interface DomainTarget {
  label: string;
  atomId: string;
  dragTarget: DragTarget;
  targetX: number;
  hint: string;
}

export type DomainPointerHandler = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;
