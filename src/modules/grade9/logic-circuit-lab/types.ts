export type Gate = 'and' | 'or' | 'implies' | 'xor';

export interface CircuitInputs {
  a: boolean;
  b: boolean;
}

export interface GateMissionTarget {
  gate: Gate;
  inputs: CircuitInputs;
  output: boolean;
  atomId: string;
  label: string;
  rule: string;
}
