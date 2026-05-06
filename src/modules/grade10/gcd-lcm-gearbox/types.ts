export type GearMissionMode = 'gcd' | 'lcm' | 'seal';
export type GcdGear = '2' | '3';
export type LcmGear = '4' | '9';

export interface GearState {
  axleProgress: number;
  selectedGcdGears: GcdGear[];
  selectedLcmGears: LcmGear[];
  sealArmed: boolean;
}

export interface GearMissionTarget {
  id: GearMissionMode;
  title: string;
  shortLabel: string;
  atomId: string;
  targetProgress: number;
  accent: string;
  hint: string;
  success: string;
}

export interface GearMeasure {
  inputA: number;
  inputB: number;
  factorA: string;
  factorB: string;
  gcdProduct: number;
  lcmProduct: number;
  selectedGcdLabel: string;
  selectedLcmLabel: string;
  targetLabel: string;
}
