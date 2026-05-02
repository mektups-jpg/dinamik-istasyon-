import { RatioSide, RatioTarget, SideSelection, TriangleMeasure } from './types';

export const basePoint = { x: 150, y: 410 };
export const maxHypotenuse = 430;

export const ratioTargets: RatioTarget[] = [
  {
    id: 'sin',
    label: 'sin',
    atomId: 'MAT.10.4.1.1',
    numerator: 'opposite',
    denominator: 'hypotenuse',
    hint: 'Sinüs için karşı dik kenarı hipotenüse böl.',
  },
  {
    id: 'cos',
    label: 'cos',
    atomId: 'MAT.10.4.1.2',
    numerator: 'adjacent',
    denominator: 'hypotenuse',
    hint: 'Kosinüs için komşu dik kenarı hipotenüse böl.',
  },
  {
    id: 'tan',
    label: 'tan',
    atomId: 'MAT.10.4.1.3',
    numerator: 'opposite',
    denominator: 'adjacent',
    hint: 'Tanjant için karşı dik kenarı komşu dik kenara böl.',
  },
  {
    id: 'cot',
    label: 'cot',
    atomId: 'MAT.10.4.1.4',
    numerator: 'adjacent',
    denominator: 'opposite',
    hint: 'Kotanjant için komşu dik kenarı karşı dik kenara böl.',
  },
];

export const initialSelection = (): SideSelection => ({ numerator: null, denominator: null });

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const round = (value: number, precision = 1) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const measureTriangle = (angle: number): TriangleMeasure => ({
  angle,
  adjacent: round(maxHypotenuse * Math.cos((angle * Math.PI) / 180)),
  opposite: round(maxHypotenuse * Math.sin((angle * Math.PI) / 180)),
  hypotenuse: maxHypotenuse,
});

export const getSideValue = (measure: TriangleMeasure, side: RatioSide) => measure[side];

export const sideLabel: Record<RatioSide, string> = {
  opposite: 'Karşı',
  adjacent: 'Komşu',
  hypotenuse: 'Hipotenüs',
};

export const sideTone: Record<RatioSide, string> = {
  opposite: '#38BDF8',
  adjacent: '#34D399',
  hypotenuse: '#FBBF24',
};

export const sideTestId = (side: RatioSide) => `ratio-side-${side}`;

export const isSelectionCorrect = (selection: SideSelection, target: RatioTarget) => selection.numerator === target.numerator && selection.denominator === target.denominator;

export const ratioValue = (measure: TriangleMeasure, target: RatioTarget) => round(getSideValue(measure, target.numerator) / getSideValue(measure, target.denominator), 2);
