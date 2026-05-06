import { OperationKind, OperationMeasure, OperationMeta, OperationState, OperationTarget, OutputValue, ValuePoint } from './types';

export const operationFrame = {
  width: 900,
  height: 520,
  dial: { x: 450, y: 250 },
  outputX: 690,
};

export const operationPoints: ValuePoint[] = [
  { x: 1, f: 4, g: -1 },
  { x: 2, f: 5, g: 0 },
  { x: 3, f: 6, g: 1 },
];

export const operationMeta: Record<OperationKind, OperationMeta> = {
  add: {
    label: 'Toplama',
    short: 'topla',
    symbol: '+',
    color: '#22D3EE',
    glow: 'rgba(34,211,238,0.34)',
    phrase: 'iki akış birleşir',
  },
  subtract: {
    label: 'Çıkarma',
    short: 'çıkar',
    symbol: '-',
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.32)',
    phrase: 'g akışı f kanalından ayrılır',
  },
  multiply: {
    label: 'Çarpma',
    short: 'çarp',
    symbol: '×',
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.32)',
    phrase: 'iki akış enerji çarpanı olur',
  },
  divide: {
    label: 'Bölme',
    short: 'böl',
    symbol: '÷',
    color: '#34D399',
    glow: 'rgba(52,211,153,0.30)',
    phrase: 'payda sıfırsa kapı kapanır',
  },
};

export const operationTargets: OperationTarget[] = [
  {
    id: 'add-streams',
    atomId: 'MAT.11.1.8.1',
    operation: 'add',
    title: 'Toplama Kanalı',
    hint: '+ kapısını kilitle; iki fonksiyon aynı x değerinde toplanmalı.',
    success: 'Toplama kanalı açıldı. f ve g değerleri aynı x hattında birleşti.',
    formula: '(f+g)(x)=f(x)+g(x)',
  },
  {
    id: 'subtract-streams',
    atomId: 'MAT.11.1.8.2',
    operation: 'subtract',
    title: 'Çıkarma Kanalı',
    hint: '- kapısını kilitle; g akışı f kanalından çıkarılmalı.',
    success: 'Çıkarma kanalı açıldı. f değerlerinden g değerleri ayrıldı.',
    formula: '(f-g)(x)=f(x)-g(x)',
  },
  {
    id: 'multiply-streams',
    atomId: 'MAT.11.1.8.3',
    operation: 'multiply',
    title: 'Çarpma Kanalı',
    hint: '× kapısını kilitle; iki fonksiyon değeri çarpan gibi birleşmeli.',
    success: 'Çarpma kanalı açıldı. İki değer akışı enerji çarpanına dönüştü.',
    formula: '(f·g)(x)=f(x)·g(x)',
  },
  {
    id: 'divide-streams',
    atomId: 'MAT.11.1.8.4',
    operation: 'divide',
    title: 'Bölme Güvenliği',
    hint: '÷ kapısını kilitle; g(x)=0 olan istasyonda güvenlik kapağı kapanmalı.',
    success: 'Bölme kanalı açıldı. Payda sıfır olan istasyon güvenle kilitlendi.',
    formula: '(f/g)(x)=f(x)/g(x), g(x)≠0',
  },
];

export const initialOperationState: OperationState = {
  selected: null,
};

export const operationOrder: OperationKind[] = ['add', 'subtract', 'multiply', 'divide'];

export const measureOperation = (state: OperationState, target: OperationTarget): OperationMeasure => {
  const selected = state.selected;
  const meta = selected ? operationMeta[selected] : operationMeta[target.operation];
  const outputs = selected ? calculateOutputs(selected) : emptyOutputs();

  return {
    outputs,
    operationLabel: selected ? meta.label : 'Kapı seçilmedi',
    operationSymbol: selected ? meta.symbol : '?',
    formulaLabel: selected ? operationTargets.find((item) => item.operation === selected)?.formula ?? target.formula : target.formula,
    nextAction: selected ? `${meta.symbol} kapısı seçildi` : `${operationMeta[target.operation].symbol} kapısını seç`,
    safetyLabel: selected === 'divide' ? 'g(x)=0 hattı kilitlenir' : meta.phrase,
  };
};

export const isTargetMatched = (state: OperationState, target: OperationTarget) => state.selected === target.operation;

export const nextOperation = (current: OperationKind | null, direction: 1 | -1): OperationKind => {
  if (!current) return direction === 1 ? operationOrder[0] : operationOrder[operationOrder.length - 1];
  const index = operationOrder.indexOf(current);
  return operationOrder[(index + direction + operationOrder.length) % operationOrder.length];
};

const calculateOutputs = (operation: OperationKind): OutputValue[] =>
  operationPoints.map((point) => {
    if (operation === 'divide' && point.g === 0) {
      return { ...point, resultLabel: 'kilit', blocked: true };
    }

    const value = calculateValue(operation, point);
    return { ...point, resultLabel: Number.isInteger(value) ? String(value) : value.toFixed(1), blocked: false };
  });

const calculateValue = (operation: OperationKind, point: ValuePoint) => {
  if (operation === 'add') return point.f + point.g;
  if (operation === 'subtract') return point.f - point.g;
  if (operation === 'multiply') return point.f * point.g;
  return point.f / point.g;
};

const emptyOutputs = (): OutputValue[] => operationPoints.map((point) => ({ ...point, resultLabel: '?', blocked: false }));
