import type { KeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';

export type SafetyDirection = 'left' | 'right';

export interface SafetyBuild {
  boundary: number;
  direction: SafetyDirection | null;
}

export interface SafetyMission {
  id: string;
  title: string;
  atomId: string;
  story: string;
  model: string;
  unit: string;
  target: SafetyBuild;
  mechanic: string;
  ruleHint: string;
  solutionSteps: string;
  success: string;
  error: string;
  resultLabel: string;
}

export interface TrackPoint {
  x: number;
  y: number;
}

export type BoundaryPointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type BoundaryKeyboardHandler = (event: KeyboardEvent<SVGElement>) => void;

export interface SafetySceneRefs {
  svgRef: RefObject<SVGSVGElement | null>;
}
