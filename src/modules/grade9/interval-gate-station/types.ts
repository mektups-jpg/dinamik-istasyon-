import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

export type GateMode = 'closed' | 'open';
export type GateSide = 'left' | 'right';
export type MissionKind = 'single' | 'intersection' | 'union';

export interface IntervalEndpoint {
  value: number;
  mode: GateMode;
}

export interface IntervalBuild {
  left: IntervalEndpoint;
  right: IntervalEndpoint;
}

export interface LabeledInterval {
  id: string;
  label: string;
  build: IntervalBuild;
  tone: 'cyan' | 'purple';
}

export interface IntervalMission {
  id: string;
  title: string;
  atomId: string;
  prompt: string;
  kind: MissionKind;
  target: IntervalBuild;
  shortRule: string;
  mechanic: string;
  given?: LabeledInterval[];
}

export interface Point {
  x: number;
  y: number;
}

export type IntervalPointerHandler = (
  event: ReactPointerEvent<SVGElement>,
  side: GateSide
) => void;

export interface IntervalSceneHandlers {
  onPointerDown: IntervalPointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
  onToggleGate: (side: GateSide) => void;
}

export type IntervalSvgRef = RefObject<SVGSVGElement | null>;
