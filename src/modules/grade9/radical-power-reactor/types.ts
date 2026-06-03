import type { PointerEvent as ReactPointerEvent } from 'react';

export type PowerKey = 'cube' | 'square';
export type RootKey = 'square' | 'remainder';
export type DragTarget = { kind: 'power'; key: PowerKey } | { kind: 'root'; key: RootKey };

export interface PowerChallenge {
  base: number;
  leftExponent: number;
  rightExponent: number;
  totalExponent: number;
  value: number;
}

export interface RootChallenge {
  radicand: number;
  squareFactor: number;
  outsideFactor: number;
  remainder: number;
}

export interface Point {
  x: number;
  y: number;
}

export type PowerPositions = Record<PowerKey, Point>;
export type RootPositions = Record<RootKey, Point>;
export type PowerPlaced = Record<PowerKey, boolean>;
export type RootPlaced = Record<RootKey, boolean>;
export type ReactorPointerHandler = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;
