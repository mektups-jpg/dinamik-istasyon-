export type SimilarityMode = 'angles' | 'ratio';

export type AnglePairId =
  | 'a-d'
  | 'b-e'
  | 'c-f'
  | 'a-e'
  | 'b-d'
  | 'c-e'
  | 'b-f'
  | 'c-d'
  | 'a-f';

export type SidePairId =
  | 'ab-de'
  | 'ac-df'
  | 'bc-ef'
  | 'ab-df'
  | 'ac-de'
  | 'bc-de'
  | 'ab-ef'
  | 'ac-ef'
  | 'bc-df';

export type SimilarityPairId = AnglePairId | SidePairId;

export interface TrianglePoint {
  x: number;
  y: number;
}

export interface TriangleModel {
  labels: [string, string, string];
  points: [TrianglePoint, TrianglePoint, TrianglePoint];
  angles: [number, number, number];
  sides: [number, number, number];
}

export interface PairOption {
  id: SimilarityPairId;
  label: string;
  detail: string;
}

export interface SimilarityMission {
  id: string;
  title: string;
  atomId: string;
  mode: SimilarityMode;
  prompt: string;
  source: TriangleModel;
  target: TriangleModel;
  targetPairs: SimilarityPairId[];
  availablePairs: PairOption[];
  scaleOptions?: number[];
  targetScale?: number;
  resultLabel: string;
  success: string;
  error: string;
  hint: string;
}

export interface SimilarityBuild {
  selectedPairs: SimilarityPairId[];
  scale: number | null;
}
