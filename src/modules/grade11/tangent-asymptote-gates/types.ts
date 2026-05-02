import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export type AsymptoteChannel = 'tan' | 'cot';
export type GateId = 'tanA' | 'tanB' | 'cotA' | 'cotB' | 'cotC';

export interface AsymptoteState {
  gates: Record<GateId, number>;
  scannerAngle: number;
}

export interface AsymptoteTarget {
  id: string;
  atomId: string;
  channel: AsymptoteChannel;
  activeGates: GateId[];
  gateTargets: Partial<Record<GateId, number>>;
  scannerTarget?: number;
  label: string;
  hint: string;
}

export interface AsymptoteMeasure {
  channel: AsymptoteChannel;
  scannerAngle: number;
  scannerValue: number | null;
  intensity: number;
}

export type AsymptotePointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type AsymptoteKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
