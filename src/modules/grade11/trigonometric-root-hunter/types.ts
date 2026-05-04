import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export type RootChannel = 'sin' | 'cos' | 'tan' | 'cot';
export type RootMarkerId = 'a' | 'b';

export interface RootHunterState {
  markers: Record<RootMarkerId, number>;
}

export interface RootHunterTarget {
  id: string;
  atomId: string;
  channel: RootChannel;
  equation: string;
  targetValue: number;
  roots: [number, number];
  forbiddenAngles: number[];
  label: string;
  hint: string;
}

export interface RootHunterMeasure {
  channel: RootChannel;
  markerAngles: Record<RootMarkerId, number>;
  markerValues: Record<RootMarkerId, number | null>;
  targetValue: number;
  lockedCount: number;
}

export type RootPointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type RootKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
