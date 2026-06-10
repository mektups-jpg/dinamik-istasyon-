import { formatNumberWithTurkishDative } from '../../../lib/turkishText';
import { type OperationAtom, type OperationTask } from '../shared/Grade4OperationMissionApp';

export const DIVISION_ESTIMATE_4_ATOMS = [
  { id: 'MAT.4.2.3.2', label: 'Bölme sonucunu işlemden önce tahmin eder.' },
] as const satisfies readonly OperationAtom[];

export function createDivisionEstimate4Tasks(): OperationTask[] {
  return [
    createEstimateDivisionTask(1),
    createEstimateDivisionTask(2),
    createEstimateDivisionTask(3),
  ];
}

function createEstimateDivisionTask(step: number): OperationTask {
  const roundedQuotient = step === 1 ? randomItem([40, 50, 60, 70]) : randomItem([25, 35, 45, 55]);
  const divisor = randomItem([4, 5, 6, 8]);
  const roundedDividend = divisor * roundedQuotient;
  const dividend = roundedDividend + randomItem([-9, -7, 6, 8]);
  const answer = `Yaklaşık ${roundedQuotient}`;

  return {
    id: `division-estimate-${step}-${dividend}-${divisor}`,
    kind: 'division',
    title: 'Yaklaşık bölümü bul',
    prompt: `${dividend} ÷ ${divisor} işleminin sonucunu işlem yapmadan tahmin et.`,
    expression: `${dividend} ÷ ${divisor} ≈ ${roundedDividend} ÷ ${divisor}`,
    visualParts: [`${dividend} sayısını ${roundedDividend} gibi düşün`, `${roundedDividend} ÷ ${divisor}`, `Sonuç ${formatNumberWithTurkishDative(roundedQuotient)} yakın`],
    chips: ['Yakın sayıyı seç', 'Sonra böl', 'Yaklaşık cevap'],
    choices: createEstimateChoices(roundedQuotient),
    answer,
    hint: `Önce ${dividend} sayısını ${roundedDividend} gibi kolay bölünen bir sayıya yaklaştır.`,
    successText: 'Bölme tahminini doğru kurdun.',
    accent: '#2EE7FF',
    atomIds: ['MAT.4.2.3.2'],
  };
}

function createEstimateChoices(answer: number): string[] {
  const lower = answer % 10 === 0 ? answer - 10 : answer - 5;
  const higher = answer % 10 === 0 ? answer + 10 : answer + 5;
  return shuffle([answer, Math.max(10, lower), higher].map((choice) => `Yaklaşık ${choice}`));
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
