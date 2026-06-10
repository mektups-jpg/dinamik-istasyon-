import { type OperationAtom, type OperationTask } from '../shared/Grade4OperationMissionApp';

export const LONG_MULTIPLICATION_FACTORY_4_ATOMS = [
  { id: 'MAT.4.2.5.1', label: 'Uzun çarpmada birler ve onlar adımlarını uygular.' },
] as const satisfies readonly OperationAtom[];

export function createLongMultiplicationFactory4Tasks(): OperationTask[] {
  const baseTask = createPartialProductTask();
  return [
    baseTask,
    createShiftTask(),
    createFinalProductTask(),
  ];
}

function createPartialProductTask(): OperationTask {
  const top = randomItem([124, 236, 318, 427]);
  const ones = randomItem([3, 4, 5]);
  const answerValue = top * ones;

  return {
    id: `long-multiply-ones-${top}-${ones}`,
    kind: 'multiplication',
    title: 'Birler sonucunu bul',
    prompt: `${top} × ${ones}: birler adımında hangi sonuç yazılır?`,
    expression: `${top} × ${ones}`,
    visualParts: [`İkinci çarpan olan ${ones} ile ${top} sayısını çarp`, `${top} × ${ones}`, 'Birler sonucunu yaz'],
    chips: ['Birler basamağı', 'Elde varsa taşı', 'Sonucu yaz'],
    choices: makeNumberChoices(answerValue, [answerValue + top, Math.max(0, answerValue - top)]),
    answer: formatNumber(answerValue),
    hint: 'Önce alttaki sayının birler basamağıyla çarp.',
    successText: 'Birler sonucunu doğru yazdın.',
    accent: '#2EE7FF',
    atomIds: ['MAT.4.2.5.1'],
  };
}

function createShiftTask(): OperationTask {
  const top = randomItem([132, 214, 326, 418]);
  const tensDigit = randomItem([2, 3, 4]);
  const answerValue = top * tensDigit * 10;

  return {
    id: `long-multiply-tens-${top}-${tensDigit}`,
    kind: 'multiplication',
    title: 'Onlar sonucunu bul',
    prompt: `${top} × ${tensDigit}0: onlar adımında hangi sonuç yazılır?`,
    expression: `${top} × ${tensDigit}0`,
    visualParts: [`İkinci çarpan burada ${tensDigit * 10} demektir`, `${top} × ${tensDigit * 10}`, 'Onlar sonucunu yaz'],
    chips: ['Onlar basamağı', 'Sola yaz', 'Yer değerini koru'],
    choices: makeNumberChoices(answerValue, [top * tensDigit, answerValue + 100]),
    answer: formatNumber(answerValue),
    hint: `Alttaki ${tensDigit}, onlar basamağında olduğu için ${tensDigit * 10} demektir. Sonucu bir basamak sola yaz.`,
    successText: 'Onlar sonucunu doğru yere yazdın.',
    accent: '#B388FF',
    atomIds: ['MAT.4.2.5.1'],
  };
}

function createFinalProductTask(): OperationTask {
  const top = randomItem([126, 238, 314, 426]);
  const bottom = randomItem([23, 34, 42]);
  const ones = bottom % 10;
  const tens = Math.floor(bottom / 10);
  const firstRow = top * ones;
  const secondRow = top * tens * 10;
  const answerValue = top * bottom;

  return {
    id: `long-multiply-final-${top}-${bottom}`,
    kind: 'multiplication',
    title: 'Sonucu tamamla',
    prompt: `${top} × ${bottom}: birler ve onlar sonuçlarını topla.`,
    expression: `${top} × ${bottom}`,
    visualParts: [`Birler sonucu: ${formatNumber(firstRow)}`, `Onlar sonucu: ${formatNumber(secondRow)}`, 'İki sonucu topla'],
    chips: ['Birler sonucu', 'Onlar sonucu', 'Toplam sonuç'],
    choices: makeNumberChoices(answerValue, [firstRow + top * tens, answerValue + 1000]),
    answer: formatNumber(answerValue),
    hint: 'Birler sonucu ile sola yazılmış onlar sonucunu topla.',
    successText: 'Uzun çarpma sonucunu doğru tamamladın.',
    accent: '#34D399',
    atomIds: ['MAT.4.2.5.1'],
  };
}

function makeNumberChoices(answer: number, distractors: number[]): string[] {
  return shuffle([...new Set([answer, ...distractors])].filter((value) => value >= 0)).slice(0, 3).map(formatNumber);
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
