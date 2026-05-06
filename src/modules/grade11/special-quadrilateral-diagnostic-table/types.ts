import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface DiagnosticPoint {
  x: number;
  y: number;
}

export type SpecialQuadKind = 'square' | 'rectangle' | 'rhombus' | 'trapezoid';

export type DiagnosticMissionKind = 'sides' | 'diagonals';

export type DiagnosticDragTarget = 'side-scanner' | 'diagonal-scanner';

export interface DiagnosticState {
  sideScan: number;
  diagonalScan: number;
  selectedKind: SpecialQuadKind | null;
}

export interface ShapeProfile {
  kind: SpecialQuadKind;
  label: string;
  points: DiagnosticPoint[];
  sideFacts: string[];
  diagonalFacts: string[];
}

export interface DiagnosticTarget {
  id: string;
  atomId: string;
  kind: DiagnosticMissionKind;
  specimen: SpecialQuadKind;
  correctKind: SpecialQuadKind;
  label: string;
  hint: string;
}

export interface DiagnosticMeasure {
  scanProgress: number;
  selectedLabel: string;
  sideSignature: string;
  diagonalSignature: string;
}

export type DiagnosticPointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type DiagnosticKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
