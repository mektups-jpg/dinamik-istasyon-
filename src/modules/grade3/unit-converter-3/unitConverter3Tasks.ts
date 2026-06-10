export type UnitConverterKind =
  | 'clock'
  | 'time'
  | 'duration'
  | 'length'
  | 'mass'
  | 'money'
  | 'liquid';

export interface UnitConverterTask {
  id: string;
  kind: UnitConverterKind;
  title: string;
  prompt: string;
  inputLabel: string;
  inputValue: string;
  outputLabel: string;
  answer: string;
  choices: string[];
  hint: string;
  successText: string;
  atomIds: string[];
  color: string;
  tokens: string[];
  visualItems: string[];
  clock?: { hour: number; minute: number };
}

export interface UnitConverterAtom {
  id: string;
  label: string;
}

export const CLOCK_READER_3_ATOMS: UnitConverterAtom[] = [
  { id: 'MAT.3.1.12.1', label: 'Analog saatteki zamanı dakikası dakikasına okur.' },
  { id: 'MAT.3.1.12.2', label: 'Analog saate göre dijital saat kodunu yazar.' },
];

export const TIME_CONVERSION_3_ATOMS: UnitConverterAtom[] = [
  { id: 'MAT.3.1.13.1', label: '1 saatin 60 dakika olduğunu dönüşümde kullanır.' },
  { id: 'MAT.3.1.13.2', label: '1 dakikanın 60 saniye olduğunu dönüşümde kullanır.' },
];

export const DURATION_ESTIMATE_3_ATOMS: UnitConverterAtom[] = [
  { id: 'MAT.3.1.14.1', label: 'Günlük olayların süresini makul ölçekte tahmin eder.' },
];

export const LENGTH_MASS_CONVERTER_3_ATOMS: UnitConverterAtom[] = [
  { id: 'MAT.3.1.15.1', label: 'Metre ve santimetre arasındaki dönüşümü hesaplar.' },
  { id: 'MAT.3.1.15.2', label: 'Kilogram ve gram arasındaki ana dönüşümü kavrar.' },
];

export const MONEY_VALUE_WORKSHOP_3_ATOMS: UnitConverterAtom[] = [
  { id: 'MAT.3.1.16.1', label: '100 kuruşun 1 TL yaptığını gösterir.' },
  { id: 'MAT.3.1.16.2', label: 'Farklı para cinslerini toplayarak bütçeyi bulur.' },
];

export const LIQUID_MEASURE_WORKSHOP_3_ATOMS: UnitConverterAtom[] = [
  { id: 'MAT.3.3.5.1', label: 'Sıvıları standart litre kaplarıyla ölçer.' },
  { id: 'MAT.3.3.5.2', label: 'Sıvıları mililitre kaplarıyla ölçer.' },
  { id: 'MAT.3.3.5.3', label: '1 litre içindeki artış-azalış miktarını tahmin eder.' },
];

export const UNIT_CONVERTER_3_ATOMS: UnitConverterAtom[] = [
  ...CLOCK_READER_3_ATOMS,
  ...TIME_CONVERSION_3_ATOMS,
  ...DURATION_ESTIMATE_3_ATOMS,
  ...LENGTH_MASS_CONVERTER_3_ATOMS,
  ...MONEY_VALUE_WORKSHOP_3_ATOMS,
  ...LIQUID_MEASURE_WORKSHOP_3_ATOMS,
];

const COLORS = ['#22D3EE', '#34D399', '#FACC15', '#FB7185', '#A78BFA', '#60A5FA'];

function clockCase(hour: number, minute: number): { hour: number; minute: number; answer: string; wrong: string[] } {
  const answer = formatClockAnswer(hour, minute);
  const nextHour = normalizeClockHour(hour + 1);
  const minuteMarker = minute === 0 ? 5 : minute / 5;
  const wrong = unique([
    formatClockAnswer(hour, minuteMarker),
    formatClockAnswer(nextHour, minute),
    formatClockAnswer(hour, (minute + 10) % 60),
  ])
    .filter((choice) => choice !== answer)
    .slice(0, 2);

  return { hour, minute, answer, wrong };
}

function normalizeClockHour(hour: number): number {
  const wrapped = ((hour - 1) % 12) + 1;
  return wrapped <= 0 ? wrapped + 12 : wrapped;
}

function formatClockAnswer(hour: number, minute: number): string {
  return `${String(normalizeClockHour(hour)).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function hourCase(count: number): { count: number; input: string; answer: string; wrong: string[] } {
  const answer = `${count * 60} dakika`;
  const wrong = unique([
    `${count * 10} dakika`,
    `${Math.max(1, count - 1) * 60} dakika`,
    `${count * 100} dakika`,
  ])
    .filter((choice) => choice !== answer)
    .slice(0, 2);

  return { count, input: `${count} saat`, answer, wrong };
}

function minuteCase(count: number): { count: number; input: string; answer: string; wrong: string[] } {
  const answer = `${count * 60} saniye`;
  const wrong = unique([
    `${count * 10} saniye`,
    `${Math.max(1, count - 1) * 60} saniye`,
    `${count * 100} saniye`,
  ])
    .filter((choice) => choice !== answer)
    .slice(0, 2);

  return { count, input: `${count} dakika`, answer, wrong };
}

const CLOCK_CASES = [
  clockCase(8, 15),
  clockCase(3, 40),
  clockCase(11, 25),
  clockCase(6, 10),
  clockCase(2, 30),
  clockCase(9, 45),
  clockCase(4, 5),
  clockCase(7, 20),
  clockCase(10, 50),
  clockCase(1, 35),
  clockCase(12, 0),
  clockCase(5, 55),
];

const HOUR_CASES = [
  hourCase(1),
  hourCase(2),
  hourCase(3),
  hourCase(4),
  hourCase(5),
  hourCase(6),
  hourCase(7),
  hourCase(8),
];

const MINUTE_CASES = [
  minuteCase(1),
  minuteCase(2),
  minuteCase(3),
  minuteCase(4),
  minuteCase(5),
  minuteCase(6),
  minuteCase(7),
  minuteCase(8),
];

const DURATION_UNIT_SCALE = ['saniye', 'dakika', 'saat'];

function durationCase(event: string, answer: string, wrong: [string, string]) {
  return { event, answer, wrong, visualItems: DURATION_UNIT_SCALE };
}

const DURATION_CASES = [
  durationCase('Bir el çırpma', '1 saniye', ['1 dakika', '1 saat']),
  durationCase('Kapıyı kapatma', '3 saniye', ['3 dakika', '3 saat']),
  durationCase('Ayakkabı bağlama', '1 dakika', ['1 saniye', '1 saat']),
  durationCase('Diş fırçalama', '2 dakika', ['2 saniye', '2 saat']),
  durationCase('Kısa bir şarkı dinleme', '3 dakika', ['3 saniye', '3 saat']),
  durationCase('Teneffüs', '10 dakika', ['10 saniye', '10 saat']),
  durationCase('Bir ders saati', '40 dakika', ['40 saniye', '4 saat']),
  durationCase('Bir film izleme', '2 saat', ['2 saniye', '2 dakika']),
  durationCase('Okulda geçen bir sabah', '4 saat', ['4 saniye', '4 dakika']),
];

const LENGTH_CASES = [
  { count: 2, input: '2 m', answer: '200 cm', wrong: ['20 cm', '120 cm'] },
  { count: 3, input: '3 m', answer: '300 cm', wrong: ['30 cm', '130 cm'] },
  { count: 5, input: '5 m', answer: '500 cm', wrong: ['50 cm', '150 cm'] },
];

const MASS_CASES = [
  { count: 2, input: '2 kg', answer: '2000 g', wrong: ['200 g', '20 g'] },
  { count: 3, input: '3 kg', answer: '3000 g', wrong: ['300 g', '30 g'] },
  { count: 5, input: '5 kg', answer: '5000 g', wrong: ['500 g', '50 g'] },
];

const COIN_CASES = [
  { input: '50 kr + 50 kr', answer: '1 TL', wrong: ['50 kr', '2 TL'], visualItems: ['50 kr', '50 kr'] },
  { input: '25 kr + 25 kr + 25 kr + 25 kr', answer: '1 TL', wrong: ['25 kr', '4 TL'], visualItems: ['25 kr', '25 kr', '25 kr', '25 kr'] },
  { input: '10 tane 10 kr', answer: '1 TL', wrong: ['10 TL', '10 kr'], visualItems: ['10 kr', '10 kr', '10 kr', '10 kr', '10 kr'] },
];

const MONEY_CASES = [
  { input: '10 TL + 5 TL + 50 kr', answer: '15 TL 50 kr', wrong: ['15 TL', '10 TL 50 kr'], visualItems: ['10 TL', '5 TL', '50 kr'] },
  { input: '20 TL + 2 TL + 25 kr', answer: '22 TL 25 kr', wrong: ['20 TL 25 kr', '22 TL'], visualItems: ['20 TL', '2 TL', '25 kr'] },
  { input: '5 TL + 1 TL + 75 kr', answer: '6 TL 75 kr', wrong: ['5 TL 75 kr', '7 TL'], visualItems: ['5 TL', '1 TL', '75 kr'] },
];

const LITER_CASES = [
  { count: 2, input: '2 x 1 L', prompt: '2 tane 1 litrelik kap toplam kaç litre eder?', answer: '2 litre', wrong: ['1 litre', '3 litre'] },
  { count: 3, input: '3 x 1 L', prompt: '3 tane 1 litrelik kap toplam kaç litre eder?', answer: '3 litre', wrong: ['1 litre', '4 litre'] },
  { count: 4, input: '4 x 1 L', prompt: '4 tane 1 litrelik kap toplam kaç litre eder?', answer: '4 litre', wrong: ['2 litre', '5 litre'] },
];

const MILLILITER_CASES = [
  { input: '500 mL + 500 mL', answer: '1 litre', wrong: ['500 mL', '2 litre'], visualItems: ['500 mL', '500 mL'] },
  { input: '250 mL + 750 mL', answer: '1 litre', wrong: ['750 mL', '2 litre'], visualItems: ['250 mL', '750 mL'] },
  { input: '400 mL + 600 mL', answer: '1 litre', wrong: ['400 mL', '600 mL'], visualItems: ['400 mL', '600 mL'] },
];

const LITER_ESTIMATE_CASES = [
  { filled: '750 mL', answer: '250 mL eksik', wrong: ['750 mL eksik', '1 L eksik'], visualItems: ['1 L hedef', '750 mL dolu', 'eksik ?'] },
  { filled: '600 mL', answer: '400 mL eksik', wrong: ['600 mL eksik', '100 mL eksik'], visualItems: ['1 L hedef', '600 mL dolu', 'eksik ?'] },
  { filled: '250 mL', answer: '750 mL eksik', wrong: ['250 mL eksik', '1 L eksik'], visualItems: ['1 L hedef', '250 mL dolu', 'eksik ?'] },
];

export function createUnitConverter3Tasks(seed = Math.floor(Math.random() * 1000)): UnitConverterTask[] {
  const clock = pickBySeed(CLOCK_CASES, seed);
  const clockWrite = pickBySeed(CLOCK_CASES, seed + 1);
  const hour = pickBySeed(HOUR_CASES, seed + 2);
  const minute = pickBySeed(MINUTE_CASES, seed + 3);
  const duration = pickBySeed(DURATION_CASES, seed + 4);
  const length = pickBySeed(LENGTH_CASES, seed + 5);
  const mass = pickBySeed(MASS_CASES, seed + 6);
  const coin = pickBySeed(COIN_CASES, seed + 7);
  const money = pickBySeed(MONEY_CASES, seed + 8);
  const liter = pickBySeed(LITER_CASES, seed + 9);
  const milliliter = pickBySeed(MILLILITER_CASES, seed + 10);
  const literEstimate = pickBySeed(LITER_ESTIMATE_CASES, seed + 11);

  return [
    {
      id: `clock-read-${clock.answer}`,
      kind: 'clock',
      title: 'Saati oku',
      prompt: 'Analog saatte gösterilen zamanı seç.',
      inputLabel: 'Saat kadranı',
      inputValue: 'Saate bak',
      outputLabel: 'Dijital saat',
      answer: clock.answer,
      choices: shuffleBySeed(unique([clock.answer, ...clock.wrong]), seed + 20),
      hint: 'Yelkovan dakikayı, akrep saati gösterir.',
      successText: 'Saatteki zamanı doğru okudun.',
      atomIds: ['MAT.3.1.12.1'],
      color: COLORS[0],
      tokens: ['akrep', 'yelkovan'],
      visualItems: ['akrep', 'yelkovan', 'saat yüzü'],
      clock,
    },
    {
      id: `clock-write-${clockWrite.answer}`,
      kind: 'clock',
      title: 'Dijital koda çevir',
      prompt: 'Bu analog saat dijital ekranda nasıl yazılır?',
      inputLabel: 'Analog saat',
      inputValue: 'Saate bak',
      outputLabel: 'Dijital kod',
      answer: clockWrite.answer,
      choices: shuffleBySeed(unique([clockWrite.answer, ...clockWrite.wrong]), seed + 21),
      hint: 'Önce akrebin gösterdiği saati, sonra yelkovanın gösterdiği dakikayı yaz.',
      successText: 'Analog saati dijital koda çevirdin.',
      atomIds: ['MAT.3.1.12.2'],
      color: COLORS[1],
      tokens: ['akrep', 'yelkovan'],
      visualItems: ['akrep', 'yelkovan', 'dijital kod'],
      clock: clockWrite,
    },
    {
      id: `hour-minute-${hour.answer}`,
      kind: 'time',
      title: 'Saati dakikaya çevir',
      prompt: `${hour.input} kaç dakika eder?`,
      inputLabel: 'Giriş',
      inputValue: hour.input,
      outputLabel: 'Dakika',
      answer: hour.answer,
      choices: shuffleBySeed(unique([hour.answer, ...hour.wrong]), seed + 22),
      hint: '1 saat 60 dakikadır.',
      successText: 'Saatleri dakikaya doğru çevirdin.',
      atomIds: ['MAT.3.1.13.1'],
      color: COLORS[2],
      tokens: ['1 saat = 60 dakika', 'çarp'],
      visualItems: repeatItem('60 dk', hour.count),
    },
    {
      id: `minute-second-${minute.answer}`,
      kind: 'time',
      title: 'Dakikayı saniyeye çevir',
      prompt: `${minute.input} kaç saniye eder?`,
      inputLabel: 'Giriş',
      inputValue: minute.input,
      outputLabel: 'Saniye',
      answer: minute.answer,
      choices: shuffleBySeed(unique([minute.answer, ...minute.wrong]), seed + 23),
      hint: '1 dakika 60 saniyedir.',
      successText: 'Dakikaları saniyeye doğru çevirdin.',
      atomIds: ['MAT.3.1.13.2'],
      color: COLORS[3],
      tokens: ['1 dakika = 60 saniye', 'çarp'],
      visualItems: repeatItem('60 sn', minute.count),
    },
    {
      id: `duration-${duration.answer}-${duration.event}`,
      kind: 'duration',
      title: 'Süreyi tahmin et',
      prompt: `${duration.event} için en uygun süre hangisi?`,
      inputLabel: 'Günlük olay',
      inputValue: duration.event,
      outputLabel: 'Makul süre',
      answer: duration.answer,
      choices: shuffleBySeed(unique([duration.answer, ...duration.wrong]), seed + 24),
      hint: 'Çok kısa ya da çok uzun olmayan günlük süreyi seç.',
      successText: 'Günlük süreyi makul ölçekte tahmin ettin.',
      atomIds: ['MAT.3.1.14.1'],
      color: COLORS[4],
      tokens: ['günlük olay', 'makul süre'],
      visualItems: duration.visualItems,
    },
    {
      id: `length-${length.answer}`,
      kind: 'length',
      title: 'Metreyi santimetreye çevir',
      prompt: `${length.input} kaç santimetre eder?`,
      inputLabel: 'Uzunluk',
      inputValue: length.input,
      outputLabel: 'Santimetre',
      answer: length.answer,
      choices: shuffleBySeed(unique([length.answer, ...length.wrong]), seed + 25),
      hint: '1 metre 100 santimetredir.',
      successText: 'Metreyi santimetreye çevirdin.',
      atomIds: ['MAT.3.1.15.1'],
      color: COLORS[5],
      tokens: ['1 m = 100 cm', 'uzunluk rayı'],
      visualItems: repeatItem('100 cm', length.count),
    },
    {
      id: `mass-${mass.answer}`,
      kind: 'mass',
      title: 'Kilogramı grama çevir',
      prompt: `${mass.input} kaç gram eder?`,
      inputLabel: 'Kütle',
      inputValue: mass.input,
      outputLabel: 'Gram',
      answer: mass.answer,
      choices: shuffleBySeed(unique([mass.answer, ...mass.wrong]), seed + 26),
      hint: '1 kilogram 1000 gramdır.',
      successText: 'Kilogramı grama çevirdin.',
      atomIds: ['MAT.3.1.15.2'],
      color: COLORS[0],
      tokens: ['1 kg = 1000 g', 'tartı'],
      visualItems: repeatItem('1000 g', mass.count),
    },
    {
      id: `coin-${coin.input}`,
      kind: 'money',
      title: 'Kuruşları TL yap',
      prompt: `${coin.input} birleşince kaç TL olur?`,
      inputLabel: 'Para havuzu',
      inputValue: coin.input,
      outputLabel: 'TL',
      answer: coin.answer,
      choices: shuffleBySeed(unique([coin.answer, ...coin.wrong]), seed + 27),
      hint: '100 kuruş, 1 TL eder.',
      successText: 'Kuruşları TL’ye doğru çevirdin.',
      atomIds: ['MAT.3.1.16.1'],
      color: COLORS[1],
      tokens: ['100 kr', '1 TL'],
      visualItems: coin.visualItems,
    },
    {
      id: `money-${money.answer}`,
      kind: 'money',
      title: 'Bütçeyi topla',
      prompt: `${money.input} toplam kaç eder?`,
      inputLabel: 'Cüzdan',
      inputValue: money.input,
      outputLabel: 'Toplam',
      answer: money.answer,
      choices: shuffleBySeed(unique([money.answer, ...money.wrong]), seed + 28),
      hint: 'Önce TL’leri topla, sonra kuruşu ekle.',
      successText: 'Farklı para cinslerini doğru topladın.',
      atomIds: ['MAT.3.1.16.2'],
      color: COLORS[2],
      tokens: ['TL', 'kuruş'],
      visualItems: money.visualItems,
    },
    {
      id: `liter-cups-${liter.answer}`,
      kind: 'liquid',
      title: 'Litre kaplarını say',
      prompt: liter.prompt,
      inputLabel: 'Kaplar',
      inputValue: liter.input,
      outputLabel: 'Litre',
      answer: liter.answer,
      choices: shuffleBySeed(unique([liter.answer, ...liter.wrong]), seed + 29),
      hint: 'Her kap 1 litre; kap sayısını say.',
      successText: 'Sıvıyı litre kaplarıyla ölçtün.',
      atomIds: ['MAT.3.3.5.1'],
      color: COLORS[3],
      tokens: ['1 L kap'],
      visualItems: repeatItem('1 L', liter.count),
    },
    {
      id: `milliliter-${milliliter.input}`,
      kind: 'liquid',
      title: 'Mililitreyi birleştir',
      prompt: `${milliliter.input} kaç litre eder?`,
      inputLabel: 'Ölçü kapları',
      inputValue: milliliter.input,
      outputLabel: 'Litre',
      answer: milliliter.answer,
      choices: shuffleBySeed(unique([milliliter.answer, ...milliliter.wrong]), seed + 30),
      hint: '1000 mL, 1 litre eder.',
      successText: 'Mililitre kaplarını litreye tamamladın.',
      atomIds: ['MAT.3.3.5.2'],
      color: COLORS[4],
      tokens: ['1000 mL = 1 L'],
      visualItems: milliliter.visualItems,
    },
    {
      id: `liter-estimate-${literEstimate.filled}`,
      kind: 'liquid',
      title: 'Eksik sıvıyı tahmin et',
      prompt: `1 litrelik şişede ${literEstimate.filled} varsa ne kadar eksik?`,
      inputLabel: 'Şişe',
      inputValue: `${literEstimate.filled} / 1 L`,
      outputLabel: 'Eksik',
      answer: literEstimate.answer,
      choices: shuffleBySeed(unique([literEstimate.answer, ...literEstimate.wrong]), seed + 31),
      hint: '1 litre 1000 mL; dolu miktarı 1000’den çıkar.',
      successText: '1 litre içindeki eksik miktarı doğru tahmin ettin.',
      atomIds: ['MAT.3.3.5.3'],
      color: COLORS[5],
      tokens: ['1000 mL hedef'],
      visualItems: literEstimate.visualItems,
    },
  ];
}

export function createClockReader3Tasks(seed = Math.floor(Math.random() * 1000)): UnitConverterTask[] {
  return createTasksForAtoms(seed, CLOCK_READER_3_ATOMS, 4);
}

export function createTimeConversion3Tasks(seed = Math.floor(Math.random() * 1000)): UnitConverterTask[] {
  return createTasksForAtoms(seed, TIME_CONVERSION_3_ATOMS, 4);
}

export function createDurationEstimate3Tasks(seed = Math.floor(Math.random() * 1000)): UnitConverterTask[] {
  return createTasksForAtoms(seed, DURATION_ESTIMATE_3_ATOMS, 3);
}

export function createLengthMassConverter3Tasks(seed = Math.floor(Math.random() * 1000)): UnitConverterTask[] {
  return createTasksForAtoms(seed, LENGTH_MASS_CONVERTER_3_ATOMS, 4);
}

export function createMoneyValueWorkshop3Tasks(seed = Math.floor(Math.random() * 1000)): UnitConverterTask[] {
  return createTasksForAtoms(seed, MONEY_VALUE_WORKSHOP_3_ATOMS, 4);
}

export function createLiquidMeasureWorkshop3Tasks(seed = Math.floor(Math.random() * 1000)): UnitConverterTask[] {
  return createTasksForAtoms(seed, LIQUID_MEASURE_WORKSHOP_3_ATOMS, 5);
}

function createTasksForAtoms(seed: number, atoms: readonly UnitConverterAtom[], targetCount: number): UnitConverterTask[] {
  const atomIds = atoms.map((atom) => atom.id);
  const collected: UnitConverterTask[] = [];
  const usedIds = new Set<string>();

  for (let round = 0; collected.length < targetCount && round < 12; round += 1) {
    const tasks = createUnitConverter3Tasks(seed + round * 17).filter((task) =>
      task.atomIds.some((atomId) => atomIds.includes(atomId)),
    );

    for (const task of tasks) {
      if (collected.length >= targetCount) break;
      if (usedIds.has(task.id)) continue;
      usedIds.add(task.id);
      collected.push(task);
    }
  }

  return collected;
}

function pickBySeed<T>(items: readonly T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function repeatItem(item: string, count: number): string[] {
  return Array.from({ length: count }, () => item);
}

function shuffleBySeed<T>(items: readonly T[], seed: number): T[] {
  return [...items]
    .map((item, index) => ({ item, rank: seededSortValue(seed, index) }))
    .sort((left, right) => left.rank - right.rank)
    .map(({ item }) => item);
}

function seededSortValue(seed: number, index: number): number {
  const value = Math.sin(seed * 9301 + index * 49297) * 233280;
  return value - Math.floor(value);
}
