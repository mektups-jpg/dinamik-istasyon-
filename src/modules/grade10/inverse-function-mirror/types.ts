export type InverseDragTarget = 'mirror-arm' | 'input-capsule' | 'output-capsule' | 'branch-gate';

export type InverseSeal = 'linear' | 'branch' | 'rational';

export interface InverseMirrorState {
  mirrorArm: number;
  inputCapsule: number;
  outputCapsule: number;
  branchGate: number;
  selectedSeal: InverseSeal | null;
}

export interface InverseMissionTarget {
  id: string;
  title: string;
  shortLabel: string;
  accent: string;
  correctSeal: InverseSeal;
  hint: string;
  success: string;
}

export interface InverseMeasure {
  mirrorLabel: string;
  inputLabel: string;
  outputLabel: string;
  branchLabel: string;
  selectedLabel: string;
  equation: string;
}
