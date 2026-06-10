export type QuantumBalanceKind = 'missing-addend' | 'unknown-start' | 'unknown-takeaway' | 'two-additions' | 'mixed-equality';

export interface QuantumBalanceTask {
  id: string;
  kind: QuantumBalanceKind;
  title: string;
  prompt: string;
  leftExpression: string;
  rightExpression: string;
  leftLoad: number;
  rightLoad: number;
  answer: number;
  choices: number[];
  hint: string;
  successText: string;
  atomIds: string[];
  color: string;
  socketLabel: string;
  lean: number;
}

export const QUANTUM_BALANCE_2_ATOMS = [
  { id: 'MAT.2.2.3.1', label: 'Toplamada eksik toplananı çıkarma ile bulur.' },
  { id: 'MAT.2.2.3.2', label: 'Çıkarmada eksileni ters işlemle bulur.' },
  { id: 'MAT.2.2.3.3', label: 'Çıkarmada çıkanı ters işlemle bulur.' },
  { id: 'MAT.2.2.6.1', label: 'Toplama ve çıkarma içeren iki taraflı eşitliği dengeler.' },
];

const ADDEND_CASES = [
  { total: 13, known: 8 },
  { total: 16, known: 9 },
  { total: 12, known: 7 },
  { total: 18, known: 11 },
];

const UNKNOWN_START_CASES = [
  { removed: 4, result: 9 },
  { removed: 6, result: 8 },
  { removed: 5, result: 11 },
  { removed: 7, result: 10 },
];

const UNKNOWN_TAKEAWAY_CASES = [
  { start: 15, result: 8 },
  { start: 17, result: 9 },
  { start: 14, result: 6 },
  { start: 19, result: 12 },
];

const TWO_ADDITION_CASES = [
  { leftA: 6, leftB: 4, rightA: 7 },
  { leftA: 5, leftB: 8, rightA: 9 },
  { leftA: 9, leftB: 6, rightA: 10 },
  { leftA: 7, leftB: 5, rightA: 8 },
];

const MIXED_EQUALITY_CASES = [
  { start: 14, removed: 5, known: 4 },
  { start: 18, removed: 7, known: 6 },
  { start: 16, removed: 4, known: 7 },
  { start: 15, removed: 6, known: 3 },
];

const COLORS = ['#22D3EE', '#A78BFA', '#34D399', '#FACC15', '#FB7185'];

export function createQuantumBalance2Tasks(seed = Math.floor(Math.random() * 1000)): QuantumBalanceTask[] {
  const addend = pickBySeed(ADDEND_CASES, seed);
  const unknownStart = pickBySeed(UNKNOWN_START_CASES, seed + 1);
  const unknownTakeaway = pickBySeed(UNKNOWN_TAKEAWAY_CASES, seed + 2);
  const twoAdditions = pickBySeed(TWO_ADDITION_CASES, seed + 3);
  const mixed = pickBySeed(MIXED_EQUALITY_CASES, seed + 4);
  const addendAnswer = addend.total - addend.known;
  const startAnswer = unknownStart.removed + unknownStart.result;
  const takeawayAnswer = unknownTakeaway.start - unknownTakeaway.result;
  const twoAdditionsAnswer = twoAdditions.leftA + twoAdditions.leftB - twoAdditions.rightA;
  const mixedAnswer = mixed.start - mixed.removed - mixed.known;

  const tasks: QuantumBalanceTask[] = [
    {
      id: `missing-addend-${addend.total}-${addend.known}`,
      kind: 'missing-addend',
      title: 'Boş küpü ekle',
      prompt: `${addend.total} ile ${addend.known} + ? aynı olsun. Boş küp kaç?`,
      leftExpression: `${addend.total}`,
      rightExpression: `${addend.known} + ?`,
      leftLoad: addend.total,
      rightLoad: addend.known,
      answer: addendAnswer,
      choices: makeChoices(addendAnswer, 2),
      hint: `${addend.known} sayısından ${addend.total} sayısına tamamla.`,
      successText: 'Eksik toplananı buldun, terazi dengelendi.',
      atomIds: ['MAT.2.2.3.1'],
      color: COLORS[0],
      socketLabel: 'Eksik ek',
      lean: -6,
    },
    {
      id: `unknown-start-${unknownStart.removed}-${unknownStart.result}`,
      kind: 'unknown-start',
      title: 'Başlangıcı bul',
      prompt: `? - ${unknownStart.removed} sonucu ${unknownStart.result} olsun. Başta kaç vardı?`,
      leftExpression: `? - ${unknownStart.removed}`,
      rightExpression: `${unknownStart.result}`,
      leftLoad: unknownStart.removed,
      rightLoad: unknownStart.result,
      answer: startAnswer,
      choices: makeChoices(startAnswer, 3),
      hint: `Sonuca geri ekle: ${unknownStart.result} + ${unknownStart.removed}.`,
      successText: 'Eksileni ters işlemle buldun.',
      atomIds: ['MAT.2.2.3.2'],
      color: COLORS[1],
      socketLabel: 'Başlangıç',
      lean: 7,
    },
    {
      id: `unknown-takeaway-${unknownTakeaway.start}-${unknownTakeaway.result}`,
      kind: 'unknown-takeaway',
      title: 'Çıkanı bul',
      prompt: `${unknownTakeaway.start} - ? sonucu ${unknownTakeaway.result} olsun. Kaç çıkarıldı?`,
      leftExpression: `${unknownTakeaway.start} - ?`,
      rightExpression: `${unknownTakeaway.result}`,
      leftLoad: unknownTakeaway.start,
      rightLoad: unknownTakeaway.result,
      answer: takeawayAnswer,
      choices: makeChoices(takeawayAnswer, 2),
      hint: `Başlangıçtan kalan sayıyı çıkar: ${unknownTakeaway.start} - ${unknownTakeaway.result}.`,
      successText: 'Çıkanı doğru buldun.',
      atomIds: ['MAT.2.2.3.3'],
      color: COLORS[2],
      socketLabel: 'Çıkan',
      lean: -7,
    },
    {
      id: `two-additions-${twoAdditions.leftA}-${twoAdditions.leftB}-${twoAdditions.rightA}`,
      kind: 'two-additions',
      title: 'İki tarafı eşitle',
      prompt: `${twoAdditions.leftA} + ${twoAdditions.leftB} ile ${twoAdditions.rightA} + ? aynı olsun. Boş yer kaç?`,
      leftExpression: `${twoAdditions.leftA} + ${twoAdditions.leftB}`,
      rightExpression: `${twoAdditions.rightA} + ?`,
      leftLoad: twoAdditions.leftA + twoAdditions.leftB,
      rightLoad: twoAdditions.rightA,
      answer: twoAdditionsAnswer,
      choices: makeChoices(twoAdditionsAnswer, 2),
      hint: 'Önce sol tarafı topla, sonra sağ tarafı ona tamamla.',
      successText: 'İki işlemli eşitliği dengede tuttun.',
      atomIds: ['MAT.2.2.6.1'],
      color: COLORS[3],
      socketLabel: 'Denge küpü',
      lean: -5,
    },
    {
      id: `mixed-equality-${mixed.start}-${mixed.removed}-${mixed.known}`,
      kind: 'mixed-equality',
      title: 'Dengeyi tamamla',
      prompt: `${mixed.start} - ${mixed.removed} ile ? + ${mixed.known} aynı olsun. Boş yer kaç?`,
      leftExpression: `${mixed.start} - ${mixed.removed}`,
      rightExpression: `? + ${mixed.known}`,
      leftLoad: mixed.start - mixed.removed,
      rightLoad: mixed.known,
      answer: mixedAnswer,
      choices: makeChoices(mixedAnswer, 2),
      hint: 'Sol tarafın sonucunu bul, sağ tarafı o sonuca tamamla.',
      successText: 'Toplama ve çıkarmayı aynı terazide dengeledin.',
      atomIds: ['MAT.2.2.6.1', 'MAT.2.2.3.1'],
      color: COLORS[4],
      socketLabel: 'Boş kutu',
      lean: -6,
    },
  ];

  return tasks.map((task) => ({ ...task, choices: shuffle(task.choices) }));
}

function makeChoices(answer: number, gap: number): number[] {
  return shuffle(unique([
    answer,
    Math.max(1, answer - gap),
    answer + gap,
  ]));
}

function pickBySeed<T>(items: readonly T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}
