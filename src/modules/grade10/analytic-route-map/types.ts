import type { PointerEvent as ReactPointerEvent } from 'react';

export interface GraphPoint {
  x: number;
  y: number;
}

export interface RouteState {
  a: GraphPoint;
  b: GraphPoint;
  transferT: number;
}

export type RouteDragTarget = 'a' | 'b' | 'transfer';

export interface RouteMeasure {
  dx: number;
  dy: number;
  distance: number;
  slope: number | null;
  transfer: GraphPoint;
  equation: string;
}

export interface RouteTarget {
  id: string;
  atomId: string;
  label: string;
  hint: string;
  a: GraphPoint;
  b: GraphPoint;
  transferT?: number;
}

export type RoutePointerHandler = (event: ReactPointerEvent<SVGElement>, target: RouteDragTarget) => void;
