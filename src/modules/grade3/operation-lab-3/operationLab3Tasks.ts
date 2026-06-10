import { formatTurkishDistributiveNumber } from '../../../lib/turkishText';

export type OperationLabKind =
  | 'estimate-sum'
  | 'mental-add'
  | 'mental-subtract'
  | 'carry'
  | 'borrow'
  | 'estimate-multiply'
  | 'multiply'
  | 'remainder'
  | 'instruction'
  | 'problem-first'
  | 'problem-result'
  | 'story'
  | 'equality';

export interface OperationLabTask {
  id: string;
  kind: OperationLabKind;
  title: string;
  prompt: string;
  expression: string;
  answer: string;
  choices: string[];
  hint: string;
  successText: string;
  atomIds: string[];
  color: string;
  chips: string[];
}

export const OPERATION_LAB_3_ATOMS = [
  { id: 'MAT.3.2.1.1', label: 'Üç basamaklı toplamayı yuvarlayarak tahmin eder.' },
  { id: 'MAT.3.2.1.2', label: 'Zihinden stratejik toplama yapar.' },
  { id: 'MAT.3.2.1.3', label: 'Zihinden stratejik çıkarma yapar.' },
  { id: 'MAT.3.2.2.1', label: 'Eldeli toplamada onluğu taşıma kuralını simüle eder.' },
  { id: 'MAT.3.2.2.2', label: 'Çıkarmada onluk/yüzlük bozma mekaniğini simüle eder.' },
  { id: 'MAT.3.2.3.1', label: 'Çarpma veya bölme sonucunu önceden tahmin eder.' },
  { id: 'MAT.3.2.4.1', label: 'İki basamaklı sayıyı tek basamaklı sayıyla çarpar.' },
  { id: 'MAT.3.2.4.2', label: 'Kalanlı bölmede artan nesnenin kaldığını görür.' },
  { id: 'MAT.3.2.5.1', label: 'Ardışık yönergeleri doğru işleme çevirir.' },
  { id: 'MAT.3.2.6.1', label: 'Çok işlemli hikaye problemini parçalara ayırır.' },
  { id: 'MAT.3.2.6.2', label: 'Parçalara ayrılan problemi işlem sırasıyla çözer.' },
  { id: 'MAT.3.2.7.1', label: 'Verilen sayılar ve işlemle mantıklı hikaye kurar.' },
  { id: 'MAT.3.2.8.1', label: 'Eşittir sembolünü iki taraflı işlem dengesi olarak kanıtlar.' },
];

const COLORS = ['#22D3EE', '#34D399', '#FACC15', '#FB7185', '#A78BFA'];

const ESTIMATE_CASES = [
  { a: 238, b: 156 },
  { a: 326, b: 171 },
  { a: 418, b: 276 },
  { a: 187, b: 241 },
  { a: 452, b: 319 },
];

const MENTAL_ADD_CASES = [
  { expression: '240 + 50 + 6', answer: '296' },
  { expression: '320 + 40 + 8', answer: '368' },
  { expression: '150 + 70 + 9', answer: '229' },
  { expression: '410 + 30 + 7', answer: '447' },
  { expression: '260 + 90 + 4', answer: '354' },
];

const MENTAL_SUBTRACT_CASES = [
  { expression: '460 - 80 - 5', answer: '375' },
  { expression: '530 - 60 - 4', answer: '466' },
  { expression: '740 - 90 - 8', answer: '642' },
  { expression: '620 - 70 - 6', answer: '544' },
  { expression: '350 - 40 - 9', answer: '301' },
];

const CARRY_CASES = [
  { a: 47, b: 38 },
  { a: 56, b: 27 },
  { a: 68, b: 25 },
  { a: 39, b: 46 },
  { a: 74, b: 19 },
];

const BORROW_CASES = [
  { minuend: 52, subtrahend: 18 },
  { minuend: 64, subtrahend: 27 },
  { minuend: 73, subtrahend: 45 },
  { minuend: 81, subtrahend: 36 },
  { minuend: 92, subtrahend: 58 },
];

const ESTIMATE_MULTIPLY_CASES = [
  { a: 29, b: 3 },
  { a: 41, b: 2 },
  { a: 38, b: 4 },
  { a: 62, b: 3 },
  { a: 51, b: 5 },
];

const MULTIPLY_CASES = [
  { a: 24, b: 3 },
  { a: 32, b: 4 },
  { a: 43, b: 2 },
  { a: 21, b: 5 },
  { a: 16, b: 6 },
];

const REMAINDER_CASES = [
  { total: 17, groupSize: 5 },
  { total: 19, groupSize: 4 },
  { total: 26, groupSize: 5 },
  { total: 29, groupSize: 6 },
  { total: 22, groupSize: 6 },
];

const INSTRUCTION_CASES = [
  { baseText: "8'in", base: 8, multiplier: 2, change: 3, operation: 'subtract' },
  { baseText: "7'nin", base: 7, multiplier: 3, change: 4, operation: 'subtract' },
  { baseText: "6'nın", base: 6, multiplier: 4, change: 5, operation: 'add' },
  { baseText: "9'un", base: 9, multiplier: 2, change: 6, operation: 'add' },
  { baseText: "5'in", base: 5, multiplier: 5, change: 7, operation: 'subtract' },
] as const;

const PROBLEM_CASES = [
  { boxes: 3, perBox: 4, added: 5 },
  { boxes: 4, perBox: 6, added: 8 },
  { boxes: 5, perBox: 3, added: 7 },
  { boxes: 6, perBox: 4, added: 9 },
  { boxes: 2, perBox: 8, added: 6 },
];

const STORY_CASES = [
  { total: 20, groups: 5, addedEach: 2, item: 'kurabiye', containerDative: 'tabağa', containerPlural: 'tabak' },
  { total: 24, groups: 6, addedEach: 3, item: 'boncuk', containerDative: 'kutuya', containerPlural: 'kutu' },
  { total: 18, groups: 3, addedEach: 4, item: 'çilek', containerDative: 'kaseye', containerPlural: 'kase' },
  { total: 30, groups: 5, addedEach: 1, item: 'bilye', containerDative: 'torbaya', containerPlural: 'torba' },
  { total: 28, groups: 4, addedEach: 2, item: 'kart', containerDative: 'zarfa', containerPlural: 'zarf' },
];

const EQUALITY_CASES = [
  { leftA: 3, leftB: 4, rightFactor: 6 },
  { leftA: 4, leftB: 5, rightFactor: 10 },
  { leftA: 6, leftB: 3, rightFactor: 9 },
  { leftA: 5, leftB: 6, rightFactor: 10 },
  { leftA: 7, leftB: 4, rightFactor: 14 },
];

export function createOperationLab3Tasks(seed = Math.floor(Math.random() * 1_000_000)): OperationLabTask[] {
  const estimate = pickBySeed(ESTIMATE_CASES, seed);
  const mentalAdd = pickBySeed(MENTAL_ADD_CASES, seed + 1);
  const mentalSubtract = pickBySeed(MENTAL_SUBTRACT_CASES, seed + 2);
  const carry = pickBySeed(CARRY_CASES, seed + 3);
  const borrow = pickBySeed(BORROW_CASES, seed + 4);
  const estimateMultiply = pickBySeed(ESTIMATE_MULTIPLY_CASES, seed + 5);
  const multiply = pickBySeed(MULTIPLY_CASES, seed + 6);
  const remainder = pickBySeed(REMAINDER_CASES, seed + 7);
  const instruction = pickBySeed(INSTRUCTION_CASES, seed + 8);
  const problem = pickBySeed(PROBLEM_CASES, seed + 9);
  const story = pickBySeed(STORY_CASES, seed + 10);
  const equality = pickBySeed(EQUALITY_CASES, seed + 11);

  const estimateAnswerValue = roundToNearestHundred(estimate.a) + roundToNearestHundred(estimate.b);
  const estimateAnswer = approximateChoice(estimateAnswerValue);
  const carryOnes = (carry.a % 10) + (carry.b % 10);
  const borrowOnes = borrow.minuend % 10;
  const borrowSubtrahendOnes = borrow.subtrahend % 10;
  const estimateMultiplyRounded = roundToNearestTen(estimateMultiply.a);
  const estimateMultiplyAnswer = approximateChoice(estimateMultiplyRounded * estimateMultiply.b);
  const multiplyAnswer = multiply.a * multiply.b;
  const multiplyTens = Math.floor(multiply.a / 10) * 10;
  const multiplyOnes = multiply.a % 10;
  const remainderAnswer = remainder.total % remainder.groupSize;
  const instructionProduct = instruction.base * instruction.multiplier;
  const instructionAnswer = instruction.operation === 'add'
    ? instructionProduct + instruction.change
    : instructionProduct - instruction.change;
  const instructionSign = instruction.operation === 'add' ? '+' : '-';
  const instructionWord = instruction.operation === 'add' ? 'fazlası' : 'eksiği';
  const instructionHint = instruction.operation === 'add'
    ? `Önce ${instruction.multiplier} katını bul, sonra ${instruction.change} ekle.`
    : `Önce ${instruction.multiplier} katını bul, sonra ${instruction.change} eksilt.`;
  const problemStartText = `${problem.boxes} kutuda ${formatTurkishDistributiveNumber(problem.perBox)} kalem var.`;
  const problemBoxTotal = problem.boxes * problem.perBox;
  const problemTotal = problemBoxTotal + problem.added;
  const equalityLeftValue = equality.leftA * equality.leftB;
  const equalityAnswer = equalityLeftValue / equality.rightFactor;

  const tasks: OperationLabTask[] = [
    {
      id: `estimate-${estimate.a}-${estimate.b}`,
      kind: 'estimate-sum',
      title: 'Yaklaşık sonucu seç',
      prompt: `${estimate.a} + ${estimate.b} işlemini yuvarlayınca sonuç yaklaşık kaç olur?`,
      expression: `${estimate.a} + ${estimate.b}`,
      answer: estimateAnswer,
      choices: approximateChoices(estimateAnswerValue, seed + 20),
      hint: 'Yuvarlanan sayıları zihninde topla, sonra kartı seç.',
      successText: 'Toplamı yuvarlayarak doğru tahmin ettin.',
      atomIds: ['MAT.3.2.1.1'],
      color: COLORS[0],
      chips: ['yuvarla', 'tahmin et'],
    },
    {
      id: `mental-add-${mentalAdd.answer}`,
      kind: 'mental-add',
      title: 'Zihinden topla',
      prompt: `${mentalAdd.expression} işleminin sonucu kaç?`,
      expression: mentalAdd.expression,
      answer: mentalAdd.answer,
      choices: numberChoices(Number(mentalAdd.answer), 10, seed + 21),
      hint: 'Yüzlük, onluk ve birlik parçalarını sırayla birleştir.',
      successText: 'Zihinden toplama stratejisi çalıştı.',
      atomIds: ['MAT.3.2.1.2'],
      color: COLORS[1],
      chips: ['parçala', 'birleştir'],
    },
    {
      id: `mental-subtract-${mentalSubtract.answer}`,
      kind: 'mental-subtract',
      title: 'Zihinden çıkar',
      prompt: `${mentalSubtract.expression} işleminin sonucu kaç?`,
      expression: mentalSubtract.expression,
      answer: mentalSubtract.answer,
      choices: numberChoices(Number(mentalSubtract.answer), 10, seed + 22),
      hint: 'Önce onlukları, sonra birlikleri azalt.',
      successText: 'Zihinden çıkarma stratejisini kullandın.',
      atomIds: ['MAT.3.2.1.3'],
      color: COLORS[2],
      chips: ['azalt', 'kontrol et'],
    },
    {
      id: `carry-${carry.a}-${carry.b}`,
      kind: 'carry',
      title: 'Onluğu taşı',
      prompt: `${carry.a} + ${carry.b} toplarken birlikler ${carryOnes} eder. Kaç onluk taşınır?`,
      expression: `${carry.a} + ${carry.b}`,
      answer: '1 onluk taşınır',
      choices: shuffle(['1 onluk taşınır', `${carryOnes - 10} birlik taşınır`, 'Hiç taşıma yok'], seed + 23),
      hint: `${carryOnes} birlik, 1 onluk ve ${carryOnes - 10} birlik demektir.`,
      successText: 'Eldeli toplamada onluğu taşıdın.',
      atomIds: ['MAT.3.2.2.1'],
      color: COLORS[3],
      chips: [`${carryOnes} birlik`, '1 onluk'],
    },
    {
      id: `borrow-${borrow.minuend}-${borrow.subtrahend}`,
      kind: 'borrow',
      title: 'Birlik yetmiyor',
      prompt: `${borrow.minuend} - ${borrow.subtrahend} çıkarırken ${borrowOnes} birlikten ${borrowSubtrahendOnes} çıkmaz. Ne yapalım?`,
      expression: `${borrow.minuend} - ${borrow.subtrahend}`,
      answer: '1 onluk boz',
      choices: shuffle(['1 onluk boz', `${borrowOnes} birlik ekle`, 'İşlemi bitir'], seed + 24),
      hint: 'Birlik kutusunda yeterli parça yok. Onluk kutusundan destek almayı düşün.',
      successText: 'Bozmalı çıkarma adımını doğru seçtin.',
      atomIds: ['MAT.3.2.2.2'],
      color: COLORS[4],
      chips: [`${borrowOnes} < ${borrowSubtrahendOnes}`, 'onluklara bak'],
    },
    {
      id: `estimate-multiply-${estimateMultiply.a}-${estimateMultiply.b}`,
      kind: 'estimate-multiply',
      title: 'Çarpımı tahmin et',
      prompt: `${estimateMultiply.a} x ${estimateMultiply.b} işlemini önce tahmin et. Yaklaşık kaç eder?`,
      expression: `${estimateMultiply.a} x ${estimateMultiply.b}`,
      answer: estimateMultiplyAnswer,
      choices: approximateChoices(estimateMultiplyRounded * estimateMultiply.b, seed + 25),
      hint: `${estimateMultiply.a} sayısını ${estimateMultiplyRounded} gibi düşün, sonra ${estimateMultiply.b} ile çarp.`,
      successText: 'Çarpma sonucunu önceden tahmin ettin.',
      atomIds: ['MAT.3.2.3.1'],
      color: COLORS[0],
      chips: [`${estimateMultiplyRounded} x ${estimateMultiply.b}`, 'tahmin'],
    },
    {
      id: `multiply-${multiply.a}-${multiply.b}`,
      kind: 'multiply',
      title: 'Alt alta çarp',
      prompt: `${multiply.a} x ${multiply.b} işleminin sonucu kaç?`,
      expression: `${multiply.a} x ${multiply.b}`,
      answer: String(multiplyAnswer),
      choices: numberChoices(multiplyAnswer, multiply.b * 2, seed + 26),
      hint: `${multiply.b} tane ${multiply.a} düşün: ${multiplyTens} x ${multiply.b} ve ${multiplyOnes} x ${multiply.b}.`,
      successText: 'İki basamaklı sayıyı tek basamaklı sayıyla çarptın.',
      atomIds: ['MAT.3.2.4.1'],
      color: COLORS[1],
      chips: [`${multiplyTens} x ${multiply.b}`, `${multiplyOnes} x ${multiply.b}`],
    },
    {
      id: `remainder-${remainder.total}-${remainder.groupSize}`,
      kind: 'remainder',
      title: 'Kalanı bul',
      prompt: `${remainder.total} nesne ${remainder.groupSize}'li gruplara ayrılınca kaç nesne artar?`,
      expression: `${remainder.total} / ${remainder.groupSize}`,
      answer: `${remainderAnswer} artar`,
      choices: remainderChoices(remainderAnswer, remainder.groupSize, seed + 27),
      hint: "5'li grupları tamamla. Tam gruba giremeyen nesneleri say.",
      successText: 'Kalanlı bölmede artanı buldun.',
      atomIds: ['MAT.3.2.4.2'],
      color: COLORS[2],
      chips: [`${remainder.groupSize}'li gruplar`, 'dışarıda kalan'],
    },
    {
      id: `instruction-${instruction.base}x${instruction.multiplier}${instructionSign}${instruction.change}`,
      kind: 'instruction',
      title: 'Yönergeyi sırala',
      prompt: `${instruction.baseText} ${instruction.multiplier} katının ${instruction.change} ${instructionWord} kaçtır?`,
      expression: `${instruction.base} x ${instruction.multiplier} ${instructionSign} ${instruction.change}`,
      answer: String(instructionAnswer),
      choices: numberChoices(instructionAnswer, instruction.change, seed + 28),
      hint: instructionHint,
      successText: 'Ardışık yönergeyi doğru işleme çevirdin.',
      atomIds: ['MAT.3.2.5.1'],
      color: COLORS[3],
      chips: [`önce x${instruction.multiplier}`, `sonra ${instructionSign}${instruction.change}`],
    },
    {
      id: `problem-first-${problem.boxes}x${problem.perBox}+${problem.added}`,
      kind: 'problem-first',
      title: 'İlk adımı seç',
      prompt: `${problemStartText} ${problem.added} kalem daha eklendi. Önce hangi işlem yapılır?`,
      expression: `${problem.boxes} kutu x ${problem.perBox}, sonra +${problem.added}`,
      answer: `${problem.boxes} x ${problem.perBox}`,
      choices: shuffle([`${problem.boxes} x ${problem.perBox}`, `${problem.perBox} + ${problem.added}`, `${problem.added} - ${problem.boxes}`], seed + 29),
      hint: 'Önce kutulardaki kalem sayısını bul.',
      successText: 'Hikaye problemini doğru parçaya ayırdın.',
      atomIds: ['MAT.3.2.6.1'],
      color: COLORS[4],
      chips: ['parça 1', 'parça 2'],
    },
    {
      id: `problem-result-${problem.boxes}x${problem.perBox}+${problem.added}`,
      kind: 'problem-result',
      title: 'Sonucu tamamla',
      prompt: `${problemStartText} ${problem.added} kalem daha eklendi. Toplam kaç kalem oldu?`,
      expression: `${problem.boxes} x ${problem.perBox} + ${problem.added}`,
      answer: String(problemTotal),
      choices: numberChoices(problemTotal, problem.added, seed + 30),
      hint: `Önce ${problemBoxTotal} kalemi bul, sonra ${problem.added} ekle.`,
      successText: 'Çok adımlı problemi sırayla çözdün.',
      atomIds: ['MAT.3.2.6.2'],
      color: COLORS[0],
      chips: [String(problemBoxTotal), `+${problem.added}`],
    },
    {
      id: `story-${story.total}-${story.groups}`,
      kind: 'story',
      title: 'Hikayeyi seç',
      prompt: `${story.total}, ${story.groups}, bölme ve toplama için hangi hikaye mantıklı?`,
      expression: `${story.total} / ${story.groups}, sonra +${story.addedEach}`,
      answer: `${story.total} ${story.item} ${story.groups} ${story.containerDative} paylaşıldı, her ${story.containerDative} ${story.addedEach} daha eklendi.`,
      choices: shuffle([
        `${story.total} ${story.item} ${story.groups} ${story.containerDative} paylaşıldı, her ${story.containerDative} ${story.addedEach} daha eklendi.`,
        `${story.total} ${story.item} ${story.groups} ${story.containerPlural} yerine tek yere kondu.`,
        `${story.groups} ${story.containerPlural} boşaltıldı, paylaşma yapılmadı.`,
      ], seed + 31),
      hint: 'Bölme, eşit paylaştırma hikayesidir.',
      successText: 'Sayı ve işleme uygun hikaye kurdun.',
      atomIds: ['MAT.3.2.7.1'],
      color: COLORS[1],
      chips: [`${story.total} / ${story.groups}`, `+${story.addedEach}`],
    },
    {
      id: `equality-${equality.leftA}x${equality.leftB}-${equality.rightFactor}x`,
      kind: 'equality',
      title: 'İki tarafı dengele',
      prompt: `${equality.leftA} x ${equality.leftB} = ${equality.rightFactor} x ? eşitliğinde boş kutu kaçtır?`,
      expression: `${equality.leftA} x ${equality.leftB} = ${equality.rightFactor} x ?`,
      answer: String(equalityAnswer),
      choices: numberChoices(equalityAnswer, 1, seed + 32),
      hint: `Sol taraf ${equalityLeftValue} eder. Sağda ${equality.rightFactor} ile hangi sayı ${equalityLeftValue} eder?`,
      successText: 'Eşittir işaretini iki taraflı denge olarak kullandın.',
      atomIds: ['MAT.3.2.8.1'],
      color: COLORS[2],
      chips: [String(equalityLeftValue), 'denge'],
    },
  ];

  return tasks;
}

function numberChoices(answer: number, gap: number, seed: number): string[] {
  return shuffle(unique([answer, Math.max(1, answer - gap), answer + gap]), seed).map(String);
}

function approximateChoices(answer: number, seed: number): string[] {
  return shuffle(unique([answer, Math.max(10, answer - 100), answer + 100]).map(approximateChoice), seed);
}

function approximateChoice(value: number): string { return `Yaklaşık ${value}`; }

function remainderChoices(remainder: number, groupSize: number, seed: number): string[] {
  const wrongRemainder = remainder + 1 < groupSize ? remainder + 1 : Math.max(1, remainder - 1);
  return shuffle(unique([`${remainder} artar`, `${wrongRemainder} artar`, 'Hiç artmaz']), seed);
}

function pickBySeed<T>(items: readonly T[], seed: number): T {
  return items[positiveModulo(seed, items.length)];
}

function roundToNearestHundred(value: number): number { return Math.round(value / 100) * 100; }

function roundToNearestTen(value: number): number { return Math.round(value / 10) * 10; }

function positiveModulo(value: number, divisor: number): number { return ((value % divisor) + divisor) % divisor; }

function createSeededRandom(seed: number) {
  let state = positiveModulo(seed, 2147483646) + 1;
  return () => ((state = (state * 16807) % 2147483647) - 1) / 2147483646;
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const random = createSeededRandom(seed);
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function unique<T>(items: readonly T[]): T[] { return [...new Set(items)]; }
