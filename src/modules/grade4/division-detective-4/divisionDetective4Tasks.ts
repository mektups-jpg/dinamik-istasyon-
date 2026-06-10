import { type OperationAtom, type OperationTask } from '../shared/Grade4OperationMissionApp';

export const DIVISION_DETECTIVE_4_ATOMS = [
  { id: 'MAT.4.2.5.2', label: 'Kalanlı bölme algoritmasını tamamlar.' },
  { id: 'MAT.4.2.5.3', label: 'Kalansız bölme algoritmasını tamamlar.' },
] as const satisfies readonly OperationAtom[];

export function createDivisionDetective4Tasks(): OperationTask[] {
  return [
    createExactDivisionTask(),
    createRemainderDivisionTask(),
  ];
}

function createExactDivisionTask(): OperationTask {
  const divisor = randomItem([3, 4, 6, 8]);
  const quotient = randomItem([124, 136, 152, 214]);
  const dividend = divisor * quotient;
  const answer = `${formatNumber(quotient)}, kalan yok`;

  return {
    id: `division-exact-${dividend}-${divisor}`,
    kind: 'division',
    title: 'Kalan yok mu?',
    prompt: `${formatNumber(dividend)} sayısını ${divisor} eş parçaya ayır.`,
    expression: `${formatNumber(dividend)} ÷ ${divisor}`,
    visualParts: ['Basamakları soldan indir', `${divisor} gruba eşit paylaştır`, 'Kalan kutusu boş kalır'],
    chips: [`Bölen: ${divisor}`, 'Kalan: 0', 'Eş paylaşım'],
    choices: shuffle([answer, `${formatNumber(quotient - 10)}, kalan ${divisor}`, `${formatNumber(quotient + 1)}, kalan yok`]),
    answer,
    hint: 'Bölme bittiğinde kalan kutusunda sayı kalmamalı.',
    successText: 'Kalansız bölme algoritmasını doğru tamamladın.',
    accent: '#34D399',
    atomIds: ['MAT.4.2.5.3'],
  };
}

function createRemainderDivisionTask(): OperationTask {
  const divisor = randomItem([4, 6, 7, 8]);
  const quotient = randomItem([83, 94, 126, 147]);
  const remainder = randomItem([1, 2, 3]);
  const safeRemainder = Math.min(remainder, divisor - 1);
  const dividend = divisor * quotient + safeRemainder;
  const answer = `${formatNumber(quotient)}, kalan ${safeRemainder}`;

  return {
    id: `division-remainder-${dividend}-${divisor}`,
    kind: 'division',
    title: 'Kalanı yakala',
    prompt: `${formatNumber(dividend)} sayısını ${divisor} gruba ayırınca bölüm ve kalan ne olur?`,
    expression: `${formatNumber(dividend)} ÷ ${divisor}`,
    visualParts: ['Bölüm kutusunu doldur', `${divisor} grup tamamlanır`, `${safeRemainder} sayı kalan kutusunda kalır`],
    chips: [`Bölen: ${divisor}`, `Kalan ${divisor}'dan küçük`, 'Kalanlı bölme'],
    choices: shuffle([answer, `${formatNumber(quotient)}, kalan 0`, `${formatNumber(quotient + 1)}, kalan ${safeRemainder}`]),
    answer,
    hint: `Kalan her zaman ${divisor} sayısından küçük olmalı.`,
    successText: 'Bölüm ve kalanı doğru ayırdın.',
    accent: '#B388FF',
    atomIds: ['MAT.4.2.5.2'],
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value);
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
