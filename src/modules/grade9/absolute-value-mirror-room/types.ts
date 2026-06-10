import type { KeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';

export type MirrorSlope = 1 | 2;

export interface AbsoluteBuild {
  vertexX: number;
  folded: boolean;
  slope: MirrorSlope;
}

export interface AbsoluteMission {
  id: string;
  title: string;
  atomId: string;
  expression: string;
  prompt: string;
  target: AbsoluteBuild;
  mechanic: string;
  success: string;
  error: string;
  resultLabel: string;
}

export interface GraphPoint {
  x: number;
  y: number;
}

export type VertexPointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type VertexKeyboardHandler = (event: KeyboardEvent<SVGElement>) => void;

export interface AbsoluteSceneRefs {
  svgRef: RefObject<SVGSVGElement | null>;
}
