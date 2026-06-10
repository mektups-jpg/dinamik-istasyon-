import { CircuitInputs, Gate, GateMissionTarget } from './types';

export const gateTargets: GateMissionTarget[] = [
  {
    gate: 'and',
    inputs: { a: true, b: true },
    output: true,
    atomId: 'MAT.9.3.2.1',
    label: 'VE kapısı',
    rule: 'VE yalnız iki giriş de 1 olduğunda çıkış verir.',
    shortRule: 'VE: 1 ve 1 olursa çıkış 1',
    truth: (inputs) => inputs.a && inputs.b,
  },
  {
    gate: 'or',
    inputs: { a: false, b: false },
    output: false,
    atomId: 'MAT.9.3.2.2',
    label: 'VEYA kapısı',
    rule: 'VEYA kapısının söndüğü tek durum 0-0 durumudur.',
    shortRule: 'VEYA: yalnız 0 ve 0 olursa çıkış 0',
    truth: (inputs) => inputs.a || inputs.b,
  },
  {
    gate: 'implies',
    inputs: { a: true, b: false },
    output: false,
    atomId: 'MAT.9.3.2.3',
    label: 'İSE kapısı',
    rule: 'İSE kapısını çökerten tek durum 1=>0 durumudur.',
    shortRule: 'İSE: yalnız 1=>0 durumunda çıkış 0',
    truth: (inputs) => !(inputs.a && !inputs.b),
  },
  {
    gate: 'xor',
    inputs: { a: true, b: false },
    output: true,
    atomId: 'MAT.9.3.2.4',
    label: 'YA DA kapısı',
    rule: 'YA DA sadece girişlerden biri 1 iken çıkış verir.',
    shortRule: 'YA DA: girişler farklıysa çıkış 1',
    truth: (inputs) => inputs.a !== inputs.b,
  },
];

export const evaluateGate = (gate: Gate, inputs: CircuitInputs): boolean => {
  if (gate === 'and') return inputs.a && inputs.b;
  if (gate === 'or') return inputs.a || inputs.b;
  if (gate === 'xor') return inputs.a !== inputs.b;
  return !(inputs.a && !inputs.b);
};

export const gateSymbol = (gate: Gate): string => {
  if (gate === 'and') return '∧';
  if (gate === 'or') return '∨';
  if (gate === 'xor') return '⊻';
  return '=>';
};

export const gateName = (gate: Gate): string => {
  if (gate === 'and') return 'VE';
  if (gate === 'or') return 'VEYA';
  if (gate === 'xor') return 'YA DA';
  return 'İSE';
};

export const isTargetMatched = (target: GateMissionTarget, inputs: CircuitInputs) => (
  target.inputs.a === inputs.a
  && target.inputs.b === inputs.b
  && target.output === evaluateGate(target.gate, inputs)
);

export const truthRows: CircuitInputs[] = [
  { a: false, b: false },
  { a: false, b: true },
  { a: true, b: false },
  { a: true, b: true },
];
