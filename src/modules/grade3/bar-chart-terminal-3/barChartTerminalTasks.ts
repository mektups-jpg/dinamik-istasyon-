export type BarChartTaskKind = 'table' | 'bar' | 'most' | 'least' | 'decision';

export interface ChartItem {
  name: string;
  count: number;
  color: string;
}

export interface BarChartTask {
  id: string;
  kind: BarChartTaskKind;
  title: string;
  prompt: string;
  dataTitle: string;
  items: ChartItem[];
  targetName?: string;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
}

interface DataSet {
  title: string;
  items: ChartItem[];
}

export const BAR_CHART_TERMINAL_ATOMS = [
  { id: 'MAT.3.4.1.1', label: 'Sayısal veri tablosu oluşturur.' },
  { id: 'MAT.3.4.1.2', label: 'Sayısal sütun grafiği oluşturur.' },
  { id: 'MAT.3.4.1.3', label: 'Grafikteki verilere göre karar verir.' },
];

const DATA_SETS: DataSet[] = [
  {
    title: 'Meyve oylaması',
    items: [
      { name: 'Elma', count: 12, color: '#22D3EE' },
      { name: 'Muz', count: 8, color: '#FACC15' },
      { name: 'Çilek', count: 15, color: '#F472B6' },
    ],
  },
  {
    title: 'Spor kulübü',
    items: [
      { name: 'Futbol', count: 14, color: '#34D399' },
      { name: 'Yüzme', count: 11, color: '#38BDF8' },
      { name: 'Basketbol', count: 17, color: '#B388FF' },
    ],
  },
  {
    title: 'Kitap türü',
    items: [
      { name: 'Masal', count: 18, color: '#F97316' },
      { name: 'Bilim', count: 13, color: '#22D3EE' },
      { name: 'Şiir', count: 9, color: '#A78BFA' },
    ],
  },
  {
    title: 'Atölye seçimi',
    items: [
      { name: 'Robot', count: 16, color: '#60A5FA' },
      { name: 'Resim', count: 10, color: '#FB7185' },
      { name: 'Müzik', count: 14, color: '#FACC15' },
    ],
  },
];

export function createBarChartTerminalTasks(): BarChartTask[] {
  const dataSet = randomItem(DATA_SETS);
  const tableTarget = randomItem(dataSet.items);
  const barTarget = randomItem(dataSet.items.filter((item) => item.name !== tableTarget.name));
  const most = dataSet.items.reduce((winner, item) => (item.count > winner.count ? item : winner), dataSet.items[0]);
  const least = dataSet.items.reduce((winner, item) => (item.count < winner.count ? item : winner), dataSet.items[0]);

  return [
    {
      id: `table-${tableTarget.name}-${tableTarget.count}`,
      kind: 'table',
      title: 'Tabloya işle',
      prompt: `${tableTarget.name} için doğru tablo satırını seç.`,
      dataTitle: dataSet.title,
      items: dataSet.items,
      targetName: tableTarget.name,
      choices: shuffle(makeTableChoices(tableTarget, dataSet.items)),
      answer: `${tableTarget.name}: ${tableTarget.count}`,
      hint: `${tableTarget.name} satırındaki sayıya bak.`,
      successText: 'Veri tablosunu doğru okudun.',
      atomIds: ['MAT.3.4.1.1'],
    },
    {
      id: `bar-${barTarget.name}-${barTarget.count}`,
      kind: 'bar',
      title: 'Sütunu yükselt',
      prompt: `${barTarget.name} sütunu kaç birim olmalı?`,
      dataTitle: dataSet.title,
      items: dataSet.items,
      targetName: barTarget.name,
      choices: shuffle(makeNumberChoices(barTarget.count, 2).map((value) => `${value} birim`)),
      answer: `${barTarget.count} birim`,
      hint: 'Tablodaki sayı sütunun yüksekliğidir.',
      successText: 'Sütun yüksekliğini doğru kurdun.',
      atomIds: ['MAT.3.4.1.2'],
    },
    {
      id: `most-${most.name}`,
      kind: 'most',
      title: 'En çoğu bul',
      prompt: 'Grafikte en yüksek sütun hangisi?',
      dataTitle: dataSet.title,
      items: dataSet.items,
      choices: shuffle(dataSet.items.map((item) => item.name)),
      answer: most.name,
      hint: 'En yüksek sütunun etiketine bak.',
      successText: 'En çok olan veriyi buldun.',
      atomIds: ['MAT.3.4.1.3'],
    },
    {
      id: `least-${least.name}`,
      kind: 'least',
      title: 'En azı bul',
      prompt: 'Grafikte en kısa sütun hangisi?',
      dataTitle: dataSet.title,
      items: dataSet.items,
      choices: shuffle(dataSet.items.map((item) => item.name)),
      answer: least.name,
      hint: 'En kısa sütunun etiketine bak.',
      successText: 'En az olan veriyi buldun.',
      atomIds: ['MAT.3.4.1.3'],
    },
    {
      id: `decision-${most.name}`,
      kind: 'decision',
      title: 'Karar ver',
      prompt: 'En çok seçilene yeni istasyon açılacak. Hangisi seçilmeli?',
      dataTitle: dataSet.title,
      items: dataSet.items,
      choices: shuffle(dataSet.items.map((item) => item.name)),
      answer: most.name,
      hint: 'Karar için en yüksek sütunu kullan.',
      successText: 'Grafikten doğru kararı verdin.',
      atomIds: ['MAT.3.4.1.3'],
    },
  ];
}

function makeTableChoices(target: ChartItem, items: ChartItem[]): string[] {
  const wrongCounts = items
    .filter((item) => item.name !== target.name)
    .map((item) => `${target.name}: ${item.count}`);
  return unique([`${target.name}: ${target.count}`, ...wrongCounts]);
}

function makeNumberChoices(answer: number, gap: number): number[] {
  return unique([answer, Math.max(1, answer - gap), answer + gap]);
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
