import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface DetectorPoint {
  x: number;
  y: number;
}

export type PolygonKind = 'convex' | 'concave';

export type DetectorDragTarget = 'angle-probe';

export interface DetectorState {
  convexScan: number;
  concaveScan: number;
  selectedKind: PolygonKind | null;
}

export interface PolygonProfile {
  kind: PolygonKind;
  label: string;
  points: DetectorPoint[];
  angles: number[];
  reflexIndex: number | null;
  facts: string[];
}

export interface DetectorTarget {
  id: string;
  atomId: string;
  profile: PolygonKind;
  correctKind: PolygonKind;
  title: string;
  label: string;
  hint: string;
}

export interface DetectorMeasure {
  scanProgress: number;
  scannedCount: number;
  selectedLabel: string;
  activeAngleLabel: string;
  alarmActive: boolean;
}

export type DetectorPointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type DetectorKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
