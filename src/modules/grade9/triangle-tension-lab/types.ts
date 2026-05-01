import type { PointerEvent as ReactPointerEvent } from 'react';

export type VertexKey = 'A' | 'B' | 'C';
export type SideKey = 'a' | 'b' | 'c';

export interface Point {
  x: number;
  y: number;
}

export type TrianglePoints = Record<VertexKey, Point>;
export type TokenPositions = Record<VertexKey, Point>;

export type DragTarget = { kind: 'vertex'; key: VertexKey } | { kind: 'token'; key: VertexKey };

export interface TriangleMeasurements {
  sides: Record<SideKey, number>;
  angles: Record<VertexKey, number>;
  largestAngle: VertexKey;
  longestSide: SideKey;
}

export type TrianglePointerHandler = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;
