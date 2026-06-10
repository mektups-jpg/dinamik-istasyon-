export type CalibrationKind = 'clock-read' | 'clock-set' | 'tool' | 'liquid' | 'length';

export interface CalibrationTask {
  id: string;
  kind: CalibrationKind;
  title: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
  hour?: number;
  minute?: number;
  cups?: number;
  lengthCm?: number;
}

export const CALIBRATION_TOWER_ATOMS = [
  { id: 'MAT.2.1.9.1', label: 'Analog saatte tam saatleri okur.' },
  { id: 'MAT.2.1.9.2', label: 'Analog saatte buçuk saatleri okur.' },
  { id: 'MAT.2.1.9.3', label: 'Analog saatte çeyrek saatleri okur.' },
  { id: 'MAT.2.1.9.4', label: 'Dijital saati analog akrep-yelkovanla kurar.' },
  { id: 'MAT.2.1.10.1', label: 'Standart olmayan ölçünün değişebileceğini test eder.' },
  { id: 'MAT.2.1.10.2', label: 'Ortak ölçüm için standart aracı seçer.' },
  { id: 'MAT.2.1.11.1', label: 'Uzunluğu santimetre cinsinden tahmin eder.' },
  { id: 'MAT.2.1.11.2', label: 'Tahminini standart araçla kontrol eder.' },
  { id: 'MAT.2.3.5.1', label: 'Sıvının kaç kap dolduracağını tahmin eder.' },
  { id: 'MAT.2.3.5.2', label: 'Sıvıyı aktararak tahminini doğrular.' },
];

const FULL_HOURS = [2, 4, 8];
const HALF_HOURS = [3, 6, 9];
const QUARTER_HOURS = [1, 7, 10];
const LENGTHS = [9, 12, 15];
const LIQUID_CUPS = [3, 4, 5];

export function createCalibrationTasks(): CalibrationTask[] {
  const fullHour = randomItem(FULL_HOURS);
  const halfHour = randomItem(HALF_HOURS);
  const quarterHour = randomItem(QUARTER_HOURS);
  const setHour = randomItem([4, 5, 8]);
  const cups = randomItem(LIQUID_CUPS);
  const lengthCm = randomItem(LENGTHS);

  return [
    clockReadTask('tam', fullHour, 0, ['MAT.2.1.9.1']),
    clockReadTask('buçuk', halfHour, 30, ['MAT.2.1.9.2']),
    clockReadTask('çeyrek', quarterHour, 15, ['MAT.2.1.9.3']),
    {
      id: `clock-set-${setHour}-30`,
      kind: 'clock-set',
      title: 'Dijital saati kur',
      prompt: `${formatTime(setHour, 30)} için yelkovan nereye gelmeli?`,
      choices: shuffle(["12'ye", "3'e", "6'ya"]),
      answer: "6'ya",
      hint: 'Buçuk saatlerde yelkovan 6 üzerindedir.',
      successText: 'Dijital saati analog saate doğru kurdun.',
      atomIds: ['MAT.2.1.9.4'],
      hour: setHour,
      minute: 30,
    },
    {
      id: 'tool-ruler',
      kind: 'tool',
      title: 'Doğru aracı seç',
      prompt: 'Kitabın uzunluğunu herkes aynı bulsun. Hangi araç gerekir?',
      choices: shuffle(['Cetvel', 'Karış', 'Adım']),
      answer: 'Cetvel',
      hint: 'Karış ve adım kişiye göre değişir; cetvel herkes için aynıdır.',
      successText: 'Standart ölçme aracını seçtin.',
      atomIds: ['MAT.2.1.10.1', 'MAT.2.1.10.2'],
    },
    {
      id: `liquid-${cups}`,
      kind: 'liquid',
      title: 'Sıvıyı tahmin et',
      prompt: `Tank kaç bardak suyla dolar?`,
      choices: makeNumberChoices(cups).map((value) => `${value} bardak`),
      answer: `${cups} bardak`,
      hint: 'Parlayan bardak izlerini say.',
      successText: 'Sıvı miktarını doğru tahmin ettin.',
      atomIds: ['MAT.2.3.5.1', 'MAT.2.3.5.2'],
      cups,
    },
    {
      id: `length-${lengthCm}`,
      kind: 'length',
      title: 'Uzunluğu tahmin et',
      prompt: 'Kalem yaklaşık kaç santimetre?',
      choices: makeNumberChoices(lengthCm).map((value) => `${value} cm`),
      answer: `${lengthCm} cm`,
      hint: 'Kalemin ucu cetveldeki son işarete yakındır.',
      successText: 'Santimetre tahminini cetvelle kontrol ettin.',
      atomIds: ['MAT.2.1.11.1', 'MAT.2.1.11.2'],
      lengthCm,
    },
  ];
}

function clockReadTask(label: string, hour: number, minute: number, atomIds: string[]): CalibrationTask {
  const answer = formatTime(hour, minute);
  const choices = shuffle(unique([answer, formatTime(hour + 1, minute), formatTime(hour, minute === 0 ? 30 : 0)]));
  return {
    id: `clock-${label}-${hour}-${minute}`,
    kind: 'clock-read',
    title: label === 'tam' ? 'Tam saati oku' : label === 'buçuk' ? 'Buçuk saati oku' : 'Çeyrek saati oku',
    prompt: 'Saat kaç?',
    choices,
    answer,
    hint: minute === 0 ? 'Yelkovan 12 üzerindeyse tam saattir.' : minute === 30 ? 'Yelkovan 6 üzerindeyse buçuktur.' : 'Yelkovan 3 üzerindeyse çeyrek geçer.',
    successText: 'Saati doğru okudun.',
    atomIds,
    hour,
    minute,
  };
}

function formatTime(hour: number, minute: number): string {
  return `${String(((hour - 1) % 12) + 1).padStart(2, '0')}.${String(minute).padStart(2, '0')}`;
}

function makeNumberChoices(answer: number): number[] {
  return shuffle(unique([answer, Math.max(1, answer - 1), answer + 1]));
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
