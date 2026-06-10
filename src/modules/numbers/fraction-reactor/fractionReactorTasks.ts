export const DENOMINATOR_OPTIONS = [1, 2, 3, 4, 5, 6, 8];

export const COMPLETION_ATOM_IDS = [
  'MAT.3.1.9.1',
  'MAT.3.1.9.2',
  'MAT.3.1.9.3',
  'MAT.3.1.10.1',
  'MAT.3.1.11.1',
  'MAT.3.1.11.2',
];

export interface FractionTask {
  id: string;
  title: string;
  prompt: string;
  targetNum: number;
  targetDenom: number;
  hint: string;
  atomIds: string[];
}

export function createFractionTasks(previousTasks: FractionTask[] = []): FractionTask[] {
  const previousSignature = createTaskSignature(previousTasks);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const foundationTasks = shuffleItems([createWholeTask(), createHalfTask(), createQuarterTask()]);
    const nextTasks = [...foundationTasks, createUnitFractionTask(), createPayDenominatorTask()];

    if (createTaskSignature(nextTasks) !== previousSignature) return nextTasks;
  }

  return [
    createHalfTask(),
    createQuarterTask(),
    createWholeTask(),
    createUnitFractionTask(8),
    createPayDenominatorTask({ numerator: 5, denominator: 8 }),
  ];
}

function createWholeTask(): FractionTask {
  return {
    id: 'whole-1-1',
    title: 'Bir bütün tabak kur',
    prompt: 'Bütün için payda 1, dolu dilim 1 olur.',
    targetNum: 1,
    targetDenom: 1,
    hint: 'Bütün tabakta bir eş parça vardır ve o parça doludur.',
    atomIds: ['MAT.3.1.9.1'],
  };
}

function createHalfTask(): FractionTask {
  return {
    id: 'half-1-2',
    title: 'Yarım tabağı göster',
    prompt: 'Yarım için tabak iki eş parçaya ayrılır, bir dilim dolar.',
    targetNum: 1,
    targetDenom: 2,
    hint: 'Yarımda payda 2, pay 1 olur.',
    atomIds: ['MAT.3.1.9.2', 'MAT.3.1.11.1', 'MAT.3.1.11.2'],
  };
}

function createQuarterTask(): FractionTask {
  return {
    id: 'quarter-1-4',
    title: 'Çeyrek tabağı göster',
    prompt: 'Çeyrek için tabak dört eş parçaya ayrılır, bir dilim dolar.',
    targetNum: 1,
    targetDenom: 4,
    hint: 'Çeyrekte payda 4, pay 1 olur.',
    atomIds: ['MAT.3.1.9.3', 'MAT.3.1.11.1', 'MAT.3.1.11.2'],
  };
}

function createUnitFractionTask(forcedDenominator?: number): FractionTask {
  const denominator = forcedDenominator ?? pickRandom([3, 5, 6, 8]);

  return {
    id: `unit-1-${denominator}`,
    title: 'Birim kesri kur',
    prompt: `${denominator} eş parçadan 1 dolu dilim seç.`,
    targetNum: 1,
    targetDenom: denominator,
    hint: `Birim kesirde pay 1 olur; payda tabağın ${denominator} eş parçaya ayrıldığını gösterir.`,
    atomIds: ['MAT.3.1.10.1', 'MAT.3.1.11.1', 'MAT.3.1.11.2'],
  };
}

function createPayDenominatorTask(forcedFraction?: { numerator: number; denominator: number }): FractionTask {
  const fraction = forcedFraction ?? pickRandom([
    { numerator: 2, denominator: 3 },
    { numerator: 2, denominator: 5 },
    { numerator: 3, denominator: 5 },
    { numerator: 2, denominator: 6 },
    { numerator: 4, denominator: 6 },
    { numerator: 3, denominator: 8 },
    { numerator: 5, denominator: 8 },
  ]);

  return {
    id: `pay-den-${fraction.numerator}-${fraction.denominator}`,
    title: 'Pay ve paydayı birlikte kur',
    prompt: `${fraction.denominator} eş parçadan ${fraction.numerator} dolu dilim seç.`,
    targetNum: fraction.numerator,
    targetDenom: fraction.denominator,
    hint: `Payda ${fraction.denominator} eş parça demek; pay ${fraction.numerator} dolu dilim demek.`,
    atomIds: ['MAT.3.1.11.1', 'MAT.3.1.11.2'],
  };
}

function createTaskSignature(tasks: FractionTask[]): string {
  return tasks.map((task) => `${task.id}:${task.targetNum}/${task.targetDenom}`).join('|');
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
