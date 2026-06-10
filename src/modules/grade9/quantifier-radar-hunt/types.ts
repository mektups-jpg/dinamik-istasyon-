export type Quantifier = 'all' | 'some';

export type RadarElementId =
  | 'even-2'
  | 'even-4'
  | 'even-6'
  | 'even-8'
  | 'prime-4'
  | 'prime-6'
  | 'prime-7'
  | 'prime-9'
  | 'angle-a'
  | 'angle-b'
  | 'angle-c'
  | 'shape-triangle'
  | 'shape-square'
  | 'shape-pentagon'
  | 'shape-rectangle';

export interface RadarElement {
  id: RadarElementId;
  label: string;
  detail: string;
  matches: boolean;
  x: number;
  y: number;
}

export interface QuantifierMission {
  id: string;
  title: string;
  atomId: string;
  setLabel: string;
  condition: string;
  prompt: string;
  quantifier: Quantifier;
  elements: RadarElement[];
  resultLabel: string;
  success: string;
  error: string;
  hint: string;
}

export interface RadarBuild {
  quantifier: Quantifier | null;
  selectedIds: RadarElementId[];
}
