export type CanteenTaskKind = 'make-total' | 'change';

export interface CanteenTask {
  id: string;
  kind: CanteenTaskKind;
  title: string;
  prompt: string;
  product: string;
  price: number;
  paidValues?: number[];
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
}

interface ExactScenario {
  product: string;
  price: number;
  answerValues: number[];
  wrongValues: number[][];
}

interface ChangeScenario {
  product: string;
  price: number;
  paidValues: number[];
  change: number;
  wrongs: number[];
}

export const CANTEEN_CASH_ATOMS = [
  { id: 'MAT.2.1.8.1', label: 'Farklı paraları birleştirerek hedef tutarı oluşturur.' },
  { id: 'MAT.2.1.8.2', label: 'Fiyata uygun parayı seçer ve para üstünü bulur.' },
];

const EXACT_SCENARIOS: ExactScenario[] = [
  {
    product: 'Süt kapsülü',
    price: 16,
    answerValues: [10, 5, 1],
    wrongValues: [[10, 5], [20], [10, 1, 1, 1]],
  },
  {
    product: 'Meyve kutusu',
    price: 25,
    answerValues: [20, 5],
    wrongValues: [[10, 10, 1], [20, 1], [10, 5, 5]],
  },
  {
    product: 'Sandviç paketi',
    price: 31,
    answerValues: [20, 10, 1],
    wrongValues: [[20, 5, 1], [20, 10], [50]],
  },
  {
    product: 'Su ve kek seti',
    price: 36,
    answerValues: [20, 10, 5, 1],
    wrongValues: [[20, 10, 5], [20, 10, 1], [50]],
  },
];

const CHANGE_SCENARIOS: ChangeScenario[] = [
  { product: 'Mavi tost', price: 15, paidValues: [20], change: 5, wrongs: [4, 6] },
  { product: 'Meyve tabağı', price: 24, paidValues: [20, 10], change: 6, wrongs: [4, 8] },
  { product: 'Kargo sandığı', price: 28, paidValues: [20, 10], change: 2, wrongs: [1, 3] },
  { product: 'Robot menü', price: 34, paidValues: [50], change: 16, wrongs: [14, 18] },
];

export function createCanteenCashTasks(): CanteenTask[] {
  const exactScenarios = shuffle(EXACT_SCENARIOS).slice(0, 3);
  const changeScenarios = shuffle(CHANGE_SCENARIOS).slice(0, 2);
  const taskList: CanteenTask[] = [
    makeExactTask(exactScenarios[0], 1),
    makeChangeTask(changeScenarios[0], 1),
    makeExactTask(exactScenarios[1], 2),
    makeChangeTask(changeScenarios[1], 2),
    makeExactTask(exactScenarios[2], 3),
  ];

  return taskList;
}

function makeExactTask(scenario: ExactScenario, order: number): CanteenTask {
  const answer = formatMoney(scenario.answerValues);
  return {
    id: `exact-${order}-${scenario.price}`,
    kind: 'make-total',
    title: 'Paraları birleştir',
    prompt: `${scenario.price} TL yapan cüzdanı seç.`,
    product: scenario.product,
    price: scenario.price,
    choices: shuffle(unique([answer, ...scenario.wrongValues.map(formatMoney)])),
    answer,
    hint: 'Paraların üzerindeki sayıları topla.',
    successText: 'Hedef tutarı doğru paralarla kurdun.',
    atomIds: ['MAT.2.1.8.1'],
  };
}

function makeChangeTask(scenario: ChangeScenario, order: number): CanteenTask {
  const answer = `${scenario.change} TL`;
  return {
    id: `change-${order}-${scenario.price}-${scenario.change}`,
    kind: 'change',
    title: 'Para üstünü bul',
    prompt: `${formatMoney(scenario.paidValues)} verdin. Para üstü kaç TL?`,
    product: scenario.product,
    price: scenario.price,
    paidValues: scenario.paidValues,
    choices: shuffle(unique([answer, ...scenario.wrongs.map((value) => `${value} TL`)])),
    answer,
    hint: 'Ödenen paradan ürün fiyatını çıkar.',
    successText: 'Para üstünü doğru buldun.',
    atomIds: ['MAT.2.1.8.2'],
  };
}

export function formatMoney(values: readonly number[]): string {
  return values.map((value) => `${value} TL`).join(' + ');
}

function randomOrderKey() {
  return Math.random() - 0.5;
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(randomOrderKey);
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}
