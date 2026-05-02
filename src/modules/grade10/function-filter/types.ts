import type { PointerEvent as ReactPointerEvent } from 'react';

export interface GraphPoint {
  x: number;
  y: number;
}

export interface RelationPoint extends GraphPoint {
  id: string;
  label: string;
}

export interface RelationScenario {
  id: string;
  title: string;
  verdict: 'function' | 'not-function';
  targetX: number;
  points: RelationPoint[];
}

export interface MappingPair {
  input: number;
  output: number;
}

export type MappingState = Record<number, number | null>;

export type FunctionMissionKind = 'reject-relation' | 'accept-function' | 'map-domain';

export interface FunctionTarget {
  label: string;
  atomId: string;
  kind: FunctionMissionKind;
  targetX?: number;
  hint: string;
}

export type ScannerPointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
