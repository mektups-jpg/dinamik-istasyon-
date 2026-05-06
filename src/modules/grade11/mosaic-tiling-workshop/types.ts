export interface Point {
  x: number;
  y: number;
}

export type MosaicDragTarget = 'hexagon-tile' | 'triangle-tile' | 'rotation-dial';

export type MosaicMissionId = 'gapless-mosaic' | 'angle-ring' | 'tile-alignment';

export type MosaicSeal = 'gapless' | 'angle360' | 'aligned';

export interface MosaicWorkshopState {
  hexagonFit: number;
  triangleFit: number;
  rotationDial: number;
  selectedSeal: MosaicSeal | null;
}

export interface MosaicMissionTarget {
  id: MosaicMissionId;
  title: string;
  shortLabel: string;
  correctSeal: MosaicSeal;
  hint: string;
  success: string;
  accent: string;
}

export interface MosaicWorkshopMeasure {
  activeProgress: number;
  rotationDegrees: number;
  angleTotal: number;
  gapLevel: number;
  selectedLabel: string;
  alarmLabel: string;
}
