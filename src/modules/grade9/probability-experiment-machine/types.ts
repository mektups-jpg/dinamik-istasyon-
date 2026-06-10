import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export type ProbabilityMissionId = 'observed-ratio' | 'inductive-projection';
export type DragTarget = 'observed' | 'projection';

export interface ProbabilityMission {
  id: ProbabilityMissionId;
  title: string;
  prompt: string;
  atomId: string;
}

export interface Point {
  x: number;
  y: number;
}

export type ProbabilityPointerDown = (event: ReactPointerEvent<SVGElement>, target: DragTarget) => void;
export type ProbabilityPointerMove = (event: ReactPointerEvent<SVGElement>) => void;
export type ProbabilityPointerUp = (event: ReactPointerEvent<SVGElement>) => void;
export type ProbabilityKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>, target: DragTarget) => void;
