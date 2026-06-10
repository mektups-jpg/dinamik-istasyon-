export type ZeroEngineKind = 'zero-add' | 'zero-multiply' | 'zero-divide' | 'estimate' | 'column-add' | 'column-sub' | 'balance';

export interface ZeroEngineTask {
  id: string;
  kind: ZeroEngineKind;
  title: string;
  prompt: string;
  expression: string;
  visualParts: string[];
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  accent: string;
  atomIds: string[];
}

export const ZERO_ENGINE_ATOMS = [
  { id: 'MAT.4.2.1.1', label: 'Üç basamaklı sıfırlı sayıları zihinden toplar.' },
  { id: 'MAT.4.2.1.2', label: 'Dört basamaklı sıfırlı sayıları zihinden toplar.' },
  { id: 'MAT.4.2.2.1', label: 'Dört basamaklı sayılarda elde kuralıyla toplar.' },
  { id: 'MAT.4.2.2.2', label: 'Dört basamaklı sayılarda onluk/yüzlük bozarak çıkarır.' },
  { id: 'MAT.4.2.3.1', label: 'Çarpma sonucunu yuvarlayarak tahmin eder.' },
  { id: 'MAT.4.2.4.1', label: 'Bir sayıyı 10 ile kısa yoldan çarpar.' },
  { id: 'MAT.4.2.4.2', label: 'Bir sayıyı 100 ile kısa yoldan çarpar.' },
  { id: 'MAT.4.2.4.3', label: 'Bir sayıyı 1000 ile kısa yoldan çarpar.' },
  { id: 'MAT.4.2.4.4', label: 'Sonu sıfırlı sayıları 10, 100, 1000 ile kısa yoldan böler.' },
  { id: 'MAT.4.2.6.1', label: 'Ardışık işlem yönergelerini takip eder.' },
  { id: 'MAT.4.2.9.1', label: 'Eşitlikte verilmeyen ögeyi bulur.' },
];

export function createZeroEngineTasks(): ZeroEngineTask[] {
  return [
    createZeroAddTask(),
    createZeroMultiplyTask(),
    createZeroDivideTask(),
    createEstimateTask(),
    createColumnAddTask(),
    createColumnSubTask(),
    createBalanceTask(),
  ];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value);
}

function createZeroAddTask(): ZeroEngineTask {
  const thousands = randomItem([2000, 3000, 4000, 5000, 6000, 7000]);
  const hundreds = randomItem([100, 200, 300, 400, 500, 600, 700, 800]);
  const tens = randomItem([20, 30, 40, 50, 60, 70, 80, 90]);
  const ones = randomItem([3, 4, 5, 6, 7, 8, 9]);
  const answerValue = thousands + hundreds + tens + ones;

  return {
    id: `zero-add-${answerValue}`,
    kind: 'zero-add',
    title: 'Parçaları birleştir',
    prompt: 'Sıfırlı sayı parçalarını hızlıca topla.',
    expression: `${formatNumber(thousands)} + ${formatNumber(hundreds)} + ${tens} + ${ones}`,
    visualParts: [formatNumber(thousands), formatNumber(hundreds), String(tens), String(ones)],
    choices: makeNumberChoices(answerValue, [answerValue + 100, answerValue - 10]),
    answer: formatNumber(answerValue),
    hint: 'Büyük parçadan başla, sonra yüzlük, onluk ve birlik ekle.',
    successText: 'Sayı parçalarını doğru birleştirdin.',
    accent: '#2EE7FF',
    atomIds: ['MAT.4.2.1.1', 'MAT.4.2.1.2'],
  };
}

function createZeroMultiplyTask(): ZeroEngineTask {
  const base = randomItem([18, 24, 35, 42, 57, 68, 79]);
  const multiplier = randomItem([10, 100, 1000]);
  const zeroCount = String(multiplier).length - 1;
  const answerValue = base * multiplier;

  return {
    id: `zero-multiply-${base}-${multiplier}`,
    kind: 'zero-multiply',
    title: 'Sıfırları ekle',
    prompt: `${base} sayısını ${multiplier} ile çarp.`,
    expression: `${base} × ${formatNumber(multiplier)}`,
    visualParts: [String(base), ...Array.from({ length: zeroCount }, () => '0')],
    choices: makeNumberChoices(answerValue, [base * (multiplier / 10), answerValue + multiplier]),
    answer: formatNumber(answerValue),
    hint: `${formatNumber(multiplier)} çarpanı ${zeroCount} sıfır taşır. Bu sıfırları sayının sonuna ekle.`,
    successText: 'Sıfırları sayının sonuna doğru ekledin.',
    accent: '#B388FF',
    atomIds: zeroCount === 1 ? ['MAT.4.2.4.1'] : zeroCount === 2 ? ['MAT.4.2.4.2'] : ['MAT.4.2.4.3'],
  };
}

function createZeroDivideTask(): ZeroEngineTask {
  const divisor = randomItem([10, 100, 1000]);
  const base = randomItem([24, 36, 48, 65, 72, 84]);
  const dividend = base * divisor;

  return {
    id: `zero-divide-${dividend}-${divisor}`,
    kind: 'zero-divide',
    title: 'Sıfırları sil',
    prompt: `${formatNumber(dividend)} sayısını ${formatNumber(divisor)} ile böl.`,
    expression: `${formatNumber(dividend)} ÷ ${formatNumber(divisor)}`,
    visualParts: [formatNumber(dividend), `÷ ${formatNumber(divisor)}`],
    choices: makeNumberChoices(base, [base * 10, Math.max(1, base - 10)]),
    answer: formatNumber(base),
    hint: `Bölen sayıda ${String(divisor).length - 1} sıfır var. Bölünenden aynı kadar sıfır sil.`,
    successText: 'Bölme kısa yolunu doğru kullandın.',
    accent: '#34D399',
    atomIds: ['MAT.4.2.4.4'],
  };
}

function createEstimateTask(): ZeroEngineTask {
  const first = randomItem([28, 31, 42, 57, 63, 74]);
  const second = randomItem([19, 22, 38, 41, 59]);
  const roundedFirst = Math.round(first / 10) * 10;
  const roundedSecond = Math.round(second / 10) * 10;
  const answerValue = roundedFirst * roundedSecond;

  return {
    id: `estimate-${first}-${second}`,
    kind: 'estimate',
    title: 'Yaklaşık sonucu seç',
    prompt: 'Çarpmadan önce sayıları en yakın onluğa yuvarla.',
    expression: `${first} × ${second} ≈ ${roundedFirst} × ${roundedSecond}`,
    visualParts: [`${first} → ${roundedFirst}`, `${second} → ${roundedSecond}`],
    choices: makeNumberChoices(answerValue, [first * second, answerValue + 100]),
    answer: formatNumber(answerValue),
    hint: 'Önce iki sayıyı da en yakın onluğa götür, sonra çarp.',
    successText: 'Tahminin doğru oldu.',
    accent: '#FFB020',
    atomIds: ['MAT.4.2.3.1'],
  };
}

function createColumnAddTask(): ZeroEngineTask {
  const first = randomItem([2478, 3586, 4697, 5849, 6728]);
  const second = randomItem([1365, 2478, 3186, 4297]);
  const answerValue = first + second;

  return {
    id: `column-add-${first}-${second}`,
    kind: 'column-add',
    title: 'Elde ile topla',
    prompt: 'Alt alta toplamın doğru sonucunu seç.',
    expression: `${formatNumber(first)} + ${formatNumber(second)}`,
    visualParts: [formatNumber(first), `+ ${formatNumber(second)}`, 'elde varsa üst basamağa taşı'],
    choices: makeNumberChoices(answerValue, [answerValue - 100, answerValue + 10]),
    answer: formatNumber(answerValue),
    hint: 'Birler ve onlar basamağında 10 olursa eldeyi soldaki basamağa taşı.',
    successText: 'Eldeyi doğru basamağa taşıdın.',
    accent: '#69D0FF',
    atomIds: ['MAT.4.2.2.1'],
  };
}

function createColumnSubTask(): ZeroEngineTask {
  const first = randomItem([5324, 6412, 7503, 8621, 9305]);
  const second = randomItem([2187, 3268, 4379, 5186]);
  const answerValue = first - second;

  return {
    id: `column-sub-${first}-${second}`,
    kind: 'column-sub',
    title: 'Bozarak çıkar',
    prompt: 'Alt alta çıkarmanın doğru sonucunu seç.',
    expression: `${formatNumber(first)} - ${formatNumber(second)}`,
    visualParts: [formatNumber(first), `- ${formatNumber(second)}`, 'yetmezse soldan bir onluk/yüzlük al'],
    choices: makeNumberChoices(answerValue, [answerValue + 100, Math.max(0, answerValue - 10)]),
    answer: formatNumber(answerValue),
    hint: 'Üst basamak küçükse soldaki basamaktan bir tane boz.',
    successText: 'Bozma adımını doğru kullandın.',
    accent: '#FB7185',
    atomIds: ['MAT.4.2.2.2'],
  };
}

function createBalanceTask(): ZeroEngineTask {
  const start = randomItem([18, 24, 32, 40, 48]);
  const multiplier = randomItem([3, 4, 5]);
  const leftValue = (start / 2) * multiplier;
  const knownRight = randomItem([8, 10, 12, 15, 20]);
  const answerValue = leftValue - knownRight;

  return {
    id: `balance-${start}-${multiplier}-${knownRight}`,
    kind: 'balance',
    title: 'Dengeyi tamamla',
    prompt: 'İki taraf eşit olsun. Boş kutuya gelecek sayıyı seç.',
    expression: `${start} ÷ 2 × ${multiplier} = ${knownRight} + ?`,
    visualParts: [`Sol taraf: ${start} ÷ 2 × ${multiplier} = ${formatNumber(leftValue)}`, `Sağ taraf: ${knownRight} + ?`, 'Eksik sayı dengeyi kurar'],
    choices: makeNumberChoices(answerValue, [answerValue + multiplier, Math.max(0, answerValue - multiplier)]),
    answer: formatNumber(answerValue),
    hint: 'Önce sol tarafın değerini bul. Sonra sağdaki hazır sayıyı çıkar.',
    successText: 'Eşitliğin eksik parçasını buldun.',
    accent: '#F472B6',
    atomIds: ['MAT.4.2.6.1', 'MAT.4.2.9.1'],
  };
}

function makeNumberChoices(answer: number, distractors: number[]): string[] {
  return shuffle(unique([answer, ...distractors]).filter((value) => value >= 0)).slice(0, 3).map(formatNumber);
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}
