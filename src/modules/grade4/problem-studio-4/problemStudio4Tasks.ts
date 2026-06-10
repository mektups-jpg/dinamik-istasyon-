import { formatNumberWithTurkishDistributiveSuffix } from '../../../lib/turkishText';
import { type OperationAtom, type OperationTask } from '../shared/Grade4OperationMissionApp';

export const PROBLEM_STUDIO_4_ATOMS = [
  { id: 'MAT.4.2.7.1', label: 'Parantezli ve farklı dört işlemli metin problemini çözer.' },
  { id: 'MAT.4.2.8.1', label: 'Verilen sayılar ve işlemlerle mantıklı hikaye problemi tasarlar.' },
] as const satisfies readonly OperationAtom[];

export function createProblemStudio4Tasks(): OperationTask[] {
  return [
    createOrderTask(),
    createStorySolveTask(),
    createStoryDesignTask(),
  ];
}

function createOrderTask(): OperationTask {
  const scenario = randomItem([
    { firstGroup: 24, secondGroup: 16, divisor: 5 },
    { firstGroup: 32, secondGroup: 16, divisor: 8 },
    { firstGroup: 40, secondGroup: 20, divisor: 6 },
  ]);
  const { firstGroup, secondGroup, divisor } = scenario;
  const total = firstGroup + secondGroup;
  const answerValue = total / divisor;

  return {
    id: `problem-order-${firstGroup}-${secondGroup}-${divisor}`,
    kind: 'problem',
    title: 'Önce parantezi çöz',
    prompt: `(${firstGroup} + ${secondGroup}) ÷ ${divisor} işleminde ilk hangi adım yapılır?`,
    expression: `(${firstGroup} + ${secondGroup}) ÷ ${divisor}`,
    visualParts: [`Önce ${firstGroup} + ${secondGroup}`, `Sonra ${total} ÷ ${divisor}`, `Sonuç ${formatNumber(answerValue)}`],
    chips: ['Parantez önce', 'Sonra böl', 'İşlem sırası'],
    choices: shuffle([`Önce ${firstGroup} + ${secondGroup}`, `Önce ${secondGroup} ÷ ${divisor}`, `Önce ${firstGroup} ÷ ${divisor}`]),
    answer: `Önce ${firstGroup} + ${secondGroup}`,
    hint: 'Parantez içindeki toplama önce yapılır.',
    successText: 'İşlem sırasını doğru başlattın.',
    accent: '#2EE7FF',
    atomIds: ['MAT.4.2.7.1'],
  };
}

function createStorySolveTask(): OperationTask {
  const boxCount = randomItem([4, 5, 6]);
  const inEachBox = randomItem([6, 8, 9]);
  const extra = randomItem([12, 15, 18]);
  const sold = randomItem([10, 14, 16]);
  const answerValue = boxCount * inEachBox + extra - sold;
  const perBoxText = formatNumberWithTurkishDistributiveSuffix(inEachBox);

  return {
    id: `problem-solve-${boxCount}-${inEachBox}-${extra}-${sold}`,
    kind: 'problem',
    title: 'Hikayeyi işlemlere çevir',
    prompt: `${boxCount} kutuda ${perBoxText} kalem var. Kutulara ${extra} kalem daha kondu. ${sold} kalem dağıtıldı. Kaç kalem kaldı?`,
    expression: `${boxCount} × ${inEachBox} + ${extra} - ${sold}`,
    visualParts: [`${boxCount} kutu × ${inEachBox}`, `${extra} kalem ekle`, `${sold} kalem çıkar`],
    chips: ['Önce çarp', 'Sonra ekle', 'En son çıkar'],
    choices: makeNumberChoices(answerValue, [answerValue + sold, Math.max(0, answerValue - extra)]),
    answer: formatNumber(answerValue),
    hint: 'Kutulardaki kalemleri bulmak için önce çarpma yapılır.',
    successText: 'Hikaye problemini doğru işlemlere çevirdin.',
    accent: '#B388FF',
    atomIds: ['MAT.4.2.7.1'],
  };
}

function createStoryDesignTask(): OperationTask {
  const total = randomItem([36, 48, 60]);
  const group = randomItem([4, 6]);
  const extra = randomItem([7, 9, 12]);
  const expression = `${total} ÷ ${group} + ${extra}`;
  const answer = `${total} kitap ${group} rafa eşit olarak paylaştırılır, sonra ${extra} kitap eklenir.`;

  return {
    id: `problem-design-${total}-${group}-${extra}`,
    kind: 'problem',
    title: 'Problemi kendin kur',
    prompt: `${expression} işlemine uygun hikayeyi seç.`,
    expression,
    visualParts: [`${total} kitap eşit paylaşılır`, `${group} raf oluşur`, `${extra} kitap daha eklenir`],
    chips: ['Hikaye mantıklı olmalı', 'İşlem sırayla uyumlu', 'Tasarım görevi'],
    choices: shuffle([
      answer,
      `${total} kitap ${group} rafa eklenir, sonra ${extra} kitap çıkarılır.`,
      `${total} kitap ${extra} çocuğa paylaştırılır, sonra ${group} kitap eklenir.`,
    ]),
    answer,
    hint: `Hikayede önce ${total} kitap ${group} rafa eşit paylaştırılmalı, sonra ${extra} kitap eklenmeli.`,
    successText: 'İşleme uygun hikaye problemini doğru tasarladın.',
    accent: '#34D399',
    atomIds: ['MAT.4.2.8.1'],
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
