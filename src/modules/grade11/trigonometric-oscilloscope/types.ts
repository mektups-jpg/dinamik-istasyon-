import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export type WaveChannel = 'sin' | 'cos';

export interface OscilloscopeState {
  angle: number;
}

export interface OscilloscopeTarget {
  id: string;
  atomId: string;
  channel: WaveChannel;
  targetAngle: number;
  label: string;
  hint: string;
}

export interface OscilloscopeMeasure {
  angle: number;
  sin: number;
  cos: number;
}

export type PhasePointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
export type PhaseKeyboardHandler = (event: ReactKeyboardEvent<SVGGElement>) => void;
