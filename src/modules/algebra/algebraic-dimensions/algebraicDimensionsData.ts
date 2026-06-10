export type DimensionPower = 1 | 2 | 3;
export type MissionKind = 'multiply' | 'divide';

export type Mission = {
  title: string;
  prompt: string;
  expression: string;
  leftPower: DimensionPower;
  rightPower: DimensionPower;
  kind: MissionKind;
  answer: DimensionPower;
  atoms: string[];
  correctReason: string;
  wrongReason: string;
};

export const MODULE_ID = 'algebraic-dimensions';
export const ATOMS = ['MAT.8.1.1.2', 'MAT.8.1.1.3'];

export const MISSIONS: Mission[] = [
  {
    title: 'Alan kapısını aç',
    prompt: 'x ile x çarpılırsa hangi boyut oluşur?',
    expression: 'x¹ × x¹',
    leftPower: 1,
    rightPower: 1,
    kind: 'multiply',
    answer: 2,
    atoms: ['MAT.8.1.1.2'],
    correctReason: 'Tabanlar aynıysa çarpmada üsler toplanır: 1 + 1 = 2.',
    wrongReason: 'Çarpmada x tabanı aynı kaldığı için üsler toplanmalı.',
  },
  {
    title: 'Hacim çekirdeğini kur',
    prompt: 'x² alanına bir x daha eklenirse hangi boyut oluşur?',
    expression: 'x² × x¹',
    leftPower: 2,
    rightPower: 1,
    kind: 'multiply',
    answer: 3,
    atoms: ['MAT.8.1.1.2'],
    correctReason: '2 + 1 = 3; alan derinlik kazanıp hacme dönüşür.',
    wrongReason: 'Aynı tabanlı çarpmada üsler toplanır; 2 ile 1 birlikte 3 eder.',
  },
  {
    title: 'Küpü yüzeye indir',
    prompt: 'x³ hacminden bir x katmanı ayrılırsa hangi ifade kalır?',
    expression: 'x³ ÷ x¹',
    leftPower: 3,
    rightPower: 1,
    kind: 'divide',
    answer: 2,
    atoms: ['MAT.8.1.1.3'],
    correctReason: 'Tabanlar aynıysa bölmede üsler çıkarılır: 3 - 1 = 2.',
    wrongReason: 'Bölmede aynı taban korunur, üslerden çıkarma yapılır.',
  },
];

export const powerLabels: Record<DimensionPower, string> = {
  1: 'x¹ çizgi',
  2: 'x² alan',
  3: 'x³ hacim',
};
