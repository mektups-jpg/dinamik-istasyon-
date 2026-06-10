export type DataCapsuleKind = 'place-digit' | 'place-value' | 'expand' | 'order' | 'pattern';

export interface DataCapsuleTask {
  id: string;
  kind: DataCapsuleKind;
  title: string;
  prompt: string;
  number?: number;
  focusIndex?: number;
  displayNumbers?: number[];
  sequence?: Array<number | null>;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  accent: string;
  atomIds: string[];
}

const PLACE_LABELS = ['Yüz binler', 'On binler', 'Binler', 'Yüzler', 'Onlar', 'Birler'] as const;
const PLACE_VALUES = [100000, 10000, 1000, 100, 10, 1] as const;

export const DATA_CAPSULE_ATOMS = [
  { id: 'MAT.4.1.1.1', label: "100.000'lere kadar sayıları görselleştirir." },
  { id: 'MAT.4.1.1.2', label: '6 basamaklı sayıları okur ve yazar.' },
  { id: 'MAT.4.1.2.1', label: 'Binler basamağını dijital kümelerle gruplar.' },
  { id: 'MAT.4.1.2.2', label: 'On binler basamağını dijital kümelerle gruplar.' },
  { id: 'MAT.4.1.2.3', label: 'Yüz binler basamağını dijital kümelerle gruplar.' },
  { id: 'MAT.4.1.2.4', label: '6 basamaklı sayıyı basamak değerlerine ayırır.' },
  { id: 'MAT.4.1.3.1', label: '6 basamaklı sayıları büyükten küçüğe sıralar.' },
  { id: 'MAT.4.1.3.2', label: '6 basamaklı sayıları küçükten büyüğe sıralar.' },
  { id: 'MAT.4.1.4.1', label: 'İleri ritmik sayma zinciri kurar.' },
  { id: 'MAT.4.1.4.2', label: 'Geriye doğru ritmik sayma zinciri kurar.' },
  { id: 'MAT.4.1.5.1', label: 'Sayı örüntüsünün kuralını açıklar.' },
];

export function createDataCapsuleTasks(): DataCapsuleTask[] {
  const first = createPlaceDigitTask();
  const second = createPlaceValueTask();
  const third = createExpandTask();
  const fourth = createOrderTask();
  const fifth = createPatternTask();
  return [first, second, third, fourth, fifth];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value);
}

export function digitsOf(value: number): number[] {
  return String(value).padStart(6, '0').split('').map(Number);
}

export function expandNumber(value: number): string {
  return digitsOf(value)
    .map((digit, index) => digit * PLACE_VALUES[index])
    .filter((part) => part > 0)
    .map(formatNumber)
    .join(' + ');
}

export function placeLabel(index: number): string {
  return PLACE_LABELS[index] ?? '';
}

function createPlaceDigitTask(): DataCapsuleTask {
  const number = randomSixDigit();
  const digits = digitsOf(number);
  const focusIndex = randomItem([0, 1, 2]);
  const answer = String(digits[focusIndex]);

  return {
    id: `place-digit-${number}-${focusIndex}`,
    kind: 'place-digit',
    title: 'Basamağı bul',
    prompt: `${PLACE_LABELS[focusIndex]} basamağındaki rakama dokun.`,
    number,
    focusIndex,
    choices: makeDigitChoices(Number(answer)),
    answer,
    hint: `${PLACE_LABELS[focusIndex]} kutusu parlıyor. Parlayan kutudaki rakama bak.`,
    successText: `${PLACE_LABELS[focusIndex]} basamağını doğru okudun.`,
    accent: '#2EE7FF',
    atomIds: ['MAT.4.1.1.2', upperPlaceAtom(focusIndex)],
  };
}

function createPlaceValueTask(): DataCapsuleTask {
  const number = randomSixDigit();
  const digits = digitsOf(number);
  const focusIndex = randomItem([0, 1, 2]);
  const answerValue = digits[focusIndex] * PLACE_VALUES[focusIndex];

  return {
    id: `place-value-${number}-${focusIndex}`,
    kind: 'place-value',
    title: 'Değeri seç',
    prompt: `${PLACE_LABELS[focusIndex]} basamağının değeri hangisi?`,
    number,
    focusIndex,
    choices: makeNumberChoices(answerValue, PLACE_VALUES[focusIndex]),
    answer: formatNumber(answerValue),
    hint: `Rakam ${digits[focusIndex]}. Bulunduğu yer onu ${formatNumber(PLACE_VALUES[focusIndex])} ile büyütür.`,
    successText: 'Basamak değerini doğru seçtin.',
    accent: '#B388FF',
    atomIds: [upperPlaceAtom(focusIndex), 'MAT.4.1.2.4'],
  };
}

function createExpandTask(): DataCapsuleTask {
  const number = randomSixDigit();
  const answer = expandNumber(number);
  const wrongA = expandNumber(number + 1000);
  const wrongB = expandNumber(number - 100);

  return {
    id: `expand-${number}`,
    kind: 'expand',
    title: 'Sayıyı parçala',
    prompt: `${formatNumber(number)} sayısının çözümlemesini seç.`,
    number,
    choices: shuffle(unique([answer, wrongA, wrongB])),
    answer,
    hint: 'Her rakamı kendi basamak evine gönder: yüz binlik, on binlik, binlik...',
    successText: 'Kapsül basamak değerlerine ayrıldı.',
    accent: '#34D399',
    atomIds: ['MAT.4.1.1.1', 'MAT.4.1.2.4'],
  };
}

function createOrderTask(): DataCapsuleTask {
  const direction = Math.random() > 0.5 ? 'desc' : 'asc';
  const base = randomSixDigit();
  const numbers = unique([
    base,
    base + randomItem([1200, 3400, 8200, 15000]),
    base - randomItem([1700, 5200, 9100, 18000]),
    base + randomItem([23000, 41000, 67000]),
  ]).filter((value) => value >= 100000 && value <= 999999).slice(0, 4);
  while (numbers.length < 4) numbers.push(randomSixDigit());

  const sorted = [...numbers].sort((a, b) => direction === 'desc' ? b - a : a - b);
  const arrow = direction === 'desc' ? '  >  ' : '  <  ';
  const answer = sorted.map(formatNumber).join(arrow);
  const reversed = [...sorted].reverse().map(formatNumber).join(arrow);
  const swapped = swapMiddle(sorted).map(formatNumber).join(arrow);

  return {
    id: `order-${direction}-${base}`,
    kind: 'order',
    title: 'Sayıları sırala',
    prompt: direction === 'desc' ? 'Kartları büyükten küçüğe diz.' : 'Kartları küçükten büyüğe diz.',
    displayNumbers: shuffle(numbers),
    choices: shuffle(unique([answer, reversed, swapped])),
    answer,
    hint: direction === 'desc' ? 'En büyük sayı ilk sırada olmalı.' : 'En küçük sayı ilk sırada olmalı.',
    successText: 'Sayı kapsülleri doğru sıraya girdi.',
    accent: '#FFB020',
    atomIds: direction === 'desc' ? ['MAT.4.1.3.1'] : ['MAT.4.1.3.2'],
  };
}

function createPatternTask(): DataCapsuleTask {
  const direction = Math.random() > 0.5 ? 'forward' : 'backward';
  const step = randomItem([1000, 2000, 5000, 10000]);
  const start = direction === 'forward'
    ? randomItem([120000, 240000, 360000, 480000])
    : randomItem([520000, 640000, 760000, 880000]);
  const sequence = Array.from({ length: 5 }, (_, index) => (
    direction === 'forward' ? start + index * step : start - index * step
  ));
  const missingIndex = randomItem([1, 2, 3]);
  const answerValue = sequence[missingIndex];
  const shown: Array<number | null> = [...sequence];
  shown[missingIndex] = null;

  return {
    id: `pattern-${direction}-${start}-${step}`,
    kind: 'pattern',
    title: 'Örüntüyü tamamla',
    prompt: `Her adımda ${formatNumber(step)} ${direction === 'forward' ? 'artar' : 'azalır'}. Eksik sayı hangisi?`,
    sequence: shown,
    choices: makeNumberChoices(answerValue, step),
    answer: formatNumber(answerValue),
    hint: direction === 'forward' ? 'Sağa giderken aynı miktar ekle.' : 'Sağa giderken aynı miktar çıkar.',
    successText: 'Sayı örüntüsü tamamlandı.',
    accent: '#FB7185',
    atomIds: direction === 'forward' ? ['MAT.4.1.4.1', 'MAT.4.1.5.1'] : ['MAT.4.1.4.2', 'MAT.4.1.5.1'],
  };
}

function randomSixDigit(): number {
  return 100000 + Math.floor(Math.random() * 850000);
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

function makeDigitChoices(answer: number): string[] {
  const values = unique([answer, (answer + 2) % 10, (answer + 5) % 10, (answer + 7) % 10]).slice(0, 3);
  return shuffle(values).map(String);
}

function makeNumberChoices(answer: number, step: number): string[] {
  return shuffle(unique([answer, answer + step, Math.max(1000, answer - step)])).map(formatNumber);
}

function swapMiddle(numbers: number[]): number[] {
  const copy = [...numbers];
  if (copy.length >= 4) {
    const second = copy[1];
    copy[1] = copy[2];
    copy[2] = second;
  }
  return copy;
}

function upperPlaceAtom(index: number): string {
  if (index === 0) return 'MAT.4.1.2.3';
  if (index === 1) return 'MAT.4.1.2.2';
  return 'MAT.4.1.2.1';
}
