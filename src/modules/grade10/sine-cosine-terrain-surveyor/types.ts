export type TerrainLock = 'cosine' | 'sine' | 'report';

export type TerrainMissionId = 'cosine-distance' | 'sine-angle' | 'terrain-report';

export interface TerrainState {
  cursorProgress: number;
  selectedLock: TerrainLock | null;
}

export interface TerrainMissionTarget {
  id: TerrainMissionId;
  title: string;
  shortLabel: string;
  atomId: string;
  lock: TerrainLock;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface TerrainMeasure {
  mode: TerrainLock;
  angleA: number;
  angleB: number;
  sideAB: number;
  sideAC: number;
  sideBC: number;
  cursorRatio: number;
  fixedRatio: number;
  formulaLine: string;
  resultLabel: string;
  targetLabel: string;
}

export interface TerrainPoint {
  x: number;
  y: number;
}
