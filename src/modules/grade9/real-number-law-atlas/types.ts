export type MissionKind = 'natural-integer' | 'real-umbrella' | 'associative' | 'distributive';

export interface LawBuild {
  naturalGate: boolean;
  integerGate: boolean;
  rationalGate: boolean;
  irrationalGate: boolean;
  realUmbrella: boolean;
  leftGroup: boolean;
  rightGroup: boolean;
  xArm: boolean;
  constantArm: boolean;
}

export interface AtlasMission {
  id: string;
  title: string;
  atomId: string;
  kind: MissionKind;
  prompt: string;
  sceneLabel: string;
  targetText: string;
  success: string;
  error: string;
  examples?: {
    integerValue?: string;
    rationalValue?: string;
    radicalValue?: number;
    factor?: number;
    constant?: number;
    product?: number;
    distributiveExpression?: string;
    distributiveResult?: string;
  };
}

export type BuildKey = keyof LawBuild;
