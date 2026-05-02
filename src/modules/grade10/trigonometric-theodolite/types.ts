import type { PointerEvent as ReactPointerEvent } from 'react';

export type RatioSide = 'opposite' | 'adjacent' | 'hypotenuse';

export interface RatioTarget {
  id: string;
  label: string;
  atomId: string;
  numerator: RatioSide;
  denominator: RatioSide;
  hint: string;
}

export interface TriangleMeasure {
  angle: number;
  adjacent: number;
  opposite: number;
  hypotenuse: number;
}

export type SideSelection = {
  numerator: RatioSide | null;
  denominator: RatioSide | null;
};

export type AnglePointerHandler = (event: ReactPointerEvent<SVGElement>) => void;
