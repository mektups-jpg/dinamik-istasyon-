export interface Point {
  x: number;
  y: number;
}

export type PolygonDragTarget = 'vertex-dial' | 'diagonal-burst' | 'exterior-walker' | 'symmetry-mirror';

export type PolygonMissionId = 'diagonal-counter' | 'exterior-walk' | 'symmetry-mirror';

export interface PolygonWorkshopState {
  sides: number;
  diagonalScan: number;
  exteriorWalk: number;
  symmetryScan: number;
  selectedAnswer: number | null;
}

export interface PolygonMissionTarget {
  id: PolygonMissionId;
  title: string;
  shortLabel: string;
  correctAnswer: number;
  answerUnit: string;
  hint: string;
  success: string;
  accent: string;
}

export interface PolygonWorkshopMeasure {
  points: Point[];
  diagonals: [Point, Point][];
  diagonalCount: number;
  exteriorAngle: number;
  activeProgress: number;
  selectedLabel: string;
  formulaLabel: string;
  exteriorTotalLabel: string;
  symmetryAxes: number;
}
