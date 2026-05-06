export type ShieldLock = 'cos' | 'sin' | 'identity';

export interface ShieldState {
  angleProgress: number;
  selectedLock: ShieldLock | null;
}

export interface ShieldMissionTarget {
  id: string;
  title: string;
  shortLabel: string;
  atomId: string;
  lock: ShieldLock;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface ShieldMeasure {
  angle: number;
  sinValue: number;
  cosValue: number;
  sinSquare: number;
  cosSquare: number;
  sum: number;
  resultLabel: string;
  targetLabel: string;
}

export interface ShieldPoint {
  x: number;
  y: number;
}
