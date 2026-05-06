export type AreaDragTarget = 'apex';

export interface AreaRailState {
  apexProgress: number;
}

export interface AreaMissionTarget {
  id: string;
  title: string;
  shortLabel: string;
  atomId: string;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface AreaMeasure {
  base: number;
  height: number;
  area: number;
  xOffset: number;
  targetLabel: string;
}
