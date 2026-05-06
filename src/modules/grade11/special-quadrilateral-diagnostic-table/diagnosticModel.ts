import { DiagnosticMeasure, DiagnosticPoint, DiagnosticState, DiagnosticTarget, ShapeProfile, SpecialQuadKind } from './types';

export const diagnosticFrame = {
  width: 900,
  height: 560,
  railX: 160,
  railY: 502,
  railWidth: 580,
};

export const initialDiagnosticState: DiagnosticState = {
  sideScan: 0.12,
  diagonalScan: 0.08,
  selectedKind: null,
};

export const shapeProfiles: Record<SpecialQuadKind, ShapeProfile> = {
  square: {
    kind: 'square',
    label: 'Kare',
    points: [
      { x: 320, y: 150 },
      { x: 580, y: 150 },
      { x: 580, y: 410 },
      { x: 320, y: 410 },
    ],
    sideFacts: ['4 kenar eşit', '4 açı dik', 'karşı kenarlar paralel'],
    diagonalFacts: ['köşegenler eşit', 'dik kesişir', 'birbirini ortalar'],
  },
  rectangle: {
    kind: 'rectangle',
    label: 'Dikdörtgen',
    points: [
      { x: 250, y: 175 },
      { x: 650, y: 175 },
      { x: 650, y: 385 },
      { x: 250, y: 385 },
    ],
    sideFacts: ['karşı kenarlar eşit', '4 açı dik', 'karşı kenarlar paralel'],
    diagonalFacts: ['köşegenler eşit', 'birbirini ortalar', 'dik kesişmez'],
  },
  rhombus: {
    kind: 'rhombus',
    label: 'Eşkenar Dörtgen',
    points: [
      { x: 450, y: 135 },
      { x: 640, y: 280 },
      { x: 450, y: 425 },
      { x: 260, y: 280 },
    ],
    sideFacts: ['4 kenar eşit', 'karşı kenarlar paralel', 'dik açı yok'],
    diagonalFacts: ['dik kesişir', 'birbirini ortalar', 'eşit olmak zorunda değil'],
  },
  trapezoid: {
    kind: 'trapezoid',
    label: 'Yamuk',
    points: [
      { x: 310, y: 175 },
      { x: 610, y: 175 },
      { x: 705, y: 390 },
      { x: 220, y: 390 },
    ],
    sideFacts: ['bir çift paralel kenar', 'yan kenarlar serbest', 'tabanlar farklı olabilir'],
    diagonalFacts: ['köşegenler serbest', 'orta kesişim zorunlu değil', 'dik şartı yok'],
  },
};

export const diagnosticTargets: DiagnosticTarget[] = [
  {
    id: 'side-signature',
    atomId: 'MAT.11.2.2.1',
    kind: 'sides',
    specimen: 'rhombus',
    correctKind: 'rhombus',
    label: '4 kenar eşit + dik açı yok -> eşkenar dörtgen',
    hint: 'Kenar tarayıcısını sona taşı; bu numunede 4 kenar eşit ama dik açı yok, bu yüzden eşkenar dörtgen kilidi gerekir.',
  },
  {
    id: 'diagonal-signature',
    atomId: 'MAT.11.2.2.2',
    kind: 'diagonals',
    specimen: 'rectangle',
    correctKind: 'rectangle',
    label: 'eşit köşegen -> dikdörtgen',
    hint: 'Köşegen tarayıcısını sona taşı ve eşit köşegen imzasını doğru kilide bağla.',
  },
];

export const shapeLabels: Record<SpecialQuadKind, string> = {
  square: 'Kare',
  rectangle: 'Dikdörtgen',
  rhombus: 'Eşkenar D.',
  trapezoid: 'Yamuk',
};

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const roundProgress = (value: number) => Math.round(clamp(value) * 100) / 100;

export const progressToRailX = (progress: number) => diagnosticFrame.railX + clamp(progress) * diagnosticFrame.railWidth;

export const railXToProgress = (x: number) => roundProgress((x - diagnosticFrame.railX) / diagnosticFrame.railWidth);

export const polygonPoints = (points: DiagnosticPoint[]) => points.map((point) => `${point.x},${point.y}`).join(' ');

export const midpoint = (first: DiagnosticPoint, second: DiagnosticPoint): DiagnosticPoint => ({
  x: (first.x + second.x) / 2,
  y: (first.y + second.y) / 2,
});

export const edgeMidpoint = (points: DiagnosticPoint[], index: number) => midpoint(points[index], points[(index + 1) % points.length]);

export const getActiveScan = (state: DiagnosticState, target: DiagnosticTarget) =>
  target.kind === 'sides' ? state.sideScan : state.diagonalScan;

export const isTargetMatched = (state: DiagnosticState, target: DiagnosticTarget) =>
  getActiveScan(state, target) >= 0.9 && state.selectedKind === target.correctKind;

export const measureDiagnostic = (state: DiagnosticState, target: DiagnosticTarget): DiagnosticMeasure => {
  const profile = shapeProfiles[target.specimen];

  return {
    scanProgress: getActiveScan(state, target),
    selectedLabel: state.selectedKind ? shapeLabels[state.selectedKind] : 'seçilmedi',
    sideSignature: profile.sideFacts.join(' / '),
    diagonalSignature: profile.diagonalFacts.join(' / '),
  };
};
