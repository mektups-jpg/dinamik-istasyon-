import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface Point {
  x: number;
  y: number;
}

export type CapsuleKind = 'input' | 'output';

export type CompositionPhase = 'input-ready' | 'g-output-ready' | 'linked-to-f';

export interface CompositionState {
  phase: CompositionPhase;
  input: Point;
  output: Point;
}

export interface CompositionMeasure {
  x: number;
  gx: number;
  final: number;
  phaseLabel: string;
  chainLabel: string;
  nextAction: string;
}

export interface CompositionTarget {
  id: string;
  atomId: string;
  title: string;
  hint: string;
  success: string;
  requiredPhase: CompositionPhase;
}

export type CompositionPointerHandler = (kind: CapsuleKind, event: ReactPointerEvent<SVGElement>) => void;
export type CompositionKeyboardHandler = (kind: CapsuleKind, event: ReactKeyboardEvent<SVGGElement>) => void;
