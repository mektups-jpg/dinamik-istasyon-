export type DataCoreKind = 'estimate' | 'tally' | 'difference' | 'order-asc' | 'order-desc';

export interface TeamData {
  name: string;
  blue: number;
  yellow: number;
}

export interface DataCoreTask {
  id: string;
  kind: DataCoreKind;
  title: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
  teams?: TeamData[];
  targetTeam?: string;
  targetColor?: 'blue' | 'yellow';
  packetCount?: number;
  numbers?: number[];
}

export const DATA_CORE_2_ATOMS = [
  { id: 'MAT.2.4.1.1', label: 'İki veri grubunu aynı çetele tablosuna işler.' },
  { id: 'MAT.2.4.1.2', label: 'Grafikten iki grup arasındaki farkı bulur.' },
  { id: 'MAT.2.1.6.1', label: "50'ye kadar çokluğu tahmin eder." },
  { id: 'MAT.2.1.3.1', label: 'İki basamaklı sayıları büyükten küçüğe sıralar.' },
  { id: 'MAT.2.1.3.2', label: 'İki basamaklı sayıları küçükten büyüğe sıralar.' },
];

const TEAM_SETS: TeamData[][] = [
  [
    { name: 'Ay Takımı', blue: 7, yellow: 4 },
    { name: 'Güneş Takımı', blue: 5, yellow: 8 },
  ],
  [
    { name: 'Kuzey Takımı', blue: 6, yellow: 9 },
    { name: 'Güney Takımı', blue: 8, yellow: 3 },
  ],
  [
    { name: 'Mavi Sınıf', blue: 9, yellow: 5 },
    { name: 'Yeşil Sınıf', blue: 4, yellow: 7 },
  ],
];

const ESTIMATE_COUNTS = [24, 28, 32, 36];
const ORDER_SETS = [
  [18, 24, 37],
  [22, 35, 41],
  [16, 29, 44],
];

export function createDataCore2Tasks(): DataCoreTask[] {
  const teams = randomItem(TEAM_SETS);
  const estimate = randomItem(ESTIMATE_COUNTS);
  const orderNumbers = randomItem(ORDER_SETS);
  const targetTeam = teams[0];
  const difference = Math.abs(teams[0].yellow - teams[1].yellow);
  const asc = [...orderNumbers].sort((a, b) => a - b);
  const desc = [...orderNumbers].sort((a, b) => b - a);

  const taskList: DataCoreTask[] = [
    {
      id: `estimate-${estimate}`,
      kind: 'estimate',
      title: 'Çokluğu tahmin et',
      prompt: 'Ekranda yaklaşık kaç veri paketi var?',
      choices: makeNumberChoices(estimate, 4).map(String),
      answer: String(estimate),
      hint: 'Paketleri beşer gruplar halinde düşün.',
      successText: 'Çokluğu doğru tahmin ettin.',
      atomIds: ['MAT.2.1.6.1'],
      packetCount: estimate,
    },
    {
      id: `tally-${targetTeam.name}`,
      kind: 'tally',
      title: 'Çeteleyi işle',
      prompt: `${targetTeam.name} mavi rozetleri kaç çizgi eder?`,
      choices: makeNumberChoices(targetTeam.blue, 2).map((value) => `${value} çizgi`),
      answer: `${targetTeam.blue} çizgi`,
      hint: 'Mavi rozetleri tek tek say; her rozet bir çizgi.',
      successText: 'Çetele satırını doğru işledin.',
      atomIds: ['MAT.2.4.1.1'],
      teams,
      targetTeam: targetTeam.name,
      targetColor: 'blue',
    },
    {
      id: `difference-${difference}`,
      kind: 'difference',
      title: 'Grafikten farkı bul',
      prompt: 'Sarı rozetlerde iki takımın farkı kaç?',
      choices: makeNumberChoices(difference, 2).map(String),
      answer: String(difference),
      hint: 'Sarı sütunların yükseklik farkına bak.',
      successText: 'İki veri grubu arasındaki farkı buldun.',
      atomIds: ['MAT.2.4.1.2'],
      teams,
      targetColor: 'yellow',
    },
    {
      id: `asc-${asc.join('-')}`,
      kind: 'order-asc',
      title: 'Küçükten büyüğe diz',
      prompt: 'Veri kartlarını küçükten büyüğe sırala.',
      choices: makeOrderChoices(asc),
      answer: asc.join(' - '),
      hint: 'En küçük sayı solda başlar.',
      successText: 'Sayıları küçükten büyüğe dizdin.',
      atomIds: ['MAT.2.1.3.2'],
      numbers: orderNumbers,
    },
    {
      id: `desc-${desc.join('-')}`,
      kind: 'order-desc',
      title: 'Büyükten küçüğe diz',
      prompt: 'Veri kartlarını büyükten küçüğe sırala.',
      choices: makeOrderChoices(desc),
      answer: desc.join(' - '),
      hint: 'En büyük sayı solda başlar.',
      successText: 'Sayıları büyükten küçüğe dizdin.',
      atomIds: ['MAT.2.1.3.1'],
      numbers: orderNumbers,
    },
  ];

  return taskList.map((task) => ({ ...task, choices: shuffle(task.choices) }));
}

function makeNumberChoices(answer: number, gap: number): number[] {
  return shuffle(unique([answer, Math.max(1, answer - gap), answer + gap]));
}

function makeOrderChoices(answer: number[]): string[] {
  const firstWrong = [answer[1], answer[0], answer[2]].join(' - ');
  const secondWrong = [answer[0], answer[2], answer[1]].join(' - ');
  return unique([answer.join(' - '), firstWrong, secondWrong]);
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
