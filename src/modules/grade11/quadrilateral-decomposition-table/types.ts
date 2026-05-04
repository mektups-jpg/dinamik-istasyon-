import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface TablePoint {
  x: number;
  y: number;
}

export interface QuadrilateralState {
  cutProgress: number;
  mergeProgress: number;
}

export type QuadDragTarget = 'blade' | 'area';

export interface QuadMeasure {
  cutProgress: number;
  mergeProgress: number;
  triangleOneArea: number;
  triangleTwoArea: number;
  totalArea: number;
  angleSum: number;
}

export interface QuadTarget {
  id: string;
  atomId: string;
  label: string;
  kind: 'angle' | 'area';
  hint: string;
}

export type QuadPointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type QuadKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
