export interface ScatterPoint {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface ScatterMissionTarget {
  id: string;
  atomId: string;
  kind: 'place' | 'positive' | 'negative';
  label: string;
  hint: string;
  targetPoints: ScatterPoint[];
}

export interface ScatterMeasure {
  slope: number;
  direction: 'pozitif' | 'negatif' | 'zayıf';
  placedCount: number;
  averageError: number;
  strength: number;
}

export type ScatterDragTarget = string;
