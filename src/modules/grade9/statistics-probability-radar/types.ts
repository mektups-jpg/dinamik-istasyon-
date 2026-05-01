import type { PointerEvent as ReactPointerEvent } from 'react';

export type GroupKey = 'A' | 'B' | 'C';
export type DragTarget = { kind: 'scanner' } | { kind: 'median' };

export interface Point {
  x: number;
  y: number;
}

export interface GroupData {
  key: GroupKey;
  x: number;
  values: number[];
  color: string;
}

export interface BoxPlotModel {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export type StatsPointerHandler = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;
