export type PacketColor = 'blue' | 'pink' | 'yellow' | 'green';
export type TaskKind = 'table' | 'tally' | 'most' | 'least';

export interface DataRow {
  color: PacketColor;
  count: number;
}

export interface DataTask {
  id: string;
  kind: TaskKind;
  title: string;
  prompt: string;
  rows: DataRow[];
  targetColor?: PacketColor;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
}

export const COLOR_INFO: Record<PacketColor, { label: string; soft: string; strong: string }> = {
  blue: { label: 'Mavi', soft: '#2EE7FF22', strong: '#2EE7FF' },
  pink: { label: 'Pembe', soft: '#F472B622', strong: '#F472B6' },
  yellow: { label: 'Sarı', soft: '#FACC1522', strong: '#FACC15' },
  green: { label: 'Yeşil', soft: '#34D39922', strong: '#34D399' },
};

export const DATA_FLOW_SCREEN_ATOMS = [
  { id: 'MAT.1.4.1.1', label: 'Nesneleri özelliğine göre tabloya çizer.' },
  { id: 'MAT.1.4.1.2', label: 'Nesneleri özelliğine göre çeteleye çizer.' },
  { id: 'MAT.1.4.1.3', label: 'Tablodan en çok ve en az olanı bulur.' },
];

const DATA_SETS: DataRow[][] = [
  [
    { color: 'blue', count: 5 },
    { color: 'pink', count: 3 },
    { color: 'yellow', count: 2 },
  ],
  [
    { color: 'green', count: 4 },
    { color: 'blue', count: 6 },
    { color: 'pink', count: 2 },
  ],
  [
    { color: 'yellow', count: 3 },
    { color: 'green', count: 5 },
    { color: 'blue', count: 1 },
  ],
];

export function createDataFlowTasks(): DataTask[] {
  const rows = randomItem(DATA_SETS);
  const [first, second] = rows;
  const tallyTarget = maxRow(rows);
  const choices = rows.map((row) => COLOR_INFO[row.color].label);

  return [
    createTableTask(rows, first.color),
    createTableTask(rows, second.color),
    createTallyTask(rows, tallyTarget.color),
    createCompareTask(rows, choices, 'most'),
    createCompareTask(rows, choices, 'least'),
  ].map((task) => ({ ...task, choices: shuffle(task.choices) }));

  function createTableTask(currentRows: DataRow[], color: PacketColor): DataTask {
    const label = COLOR_INFO[color].label;
    return {
      id: `table-${color}`,
      kind: 'table',
      title: 'Renk kutusunu seç',
      prompt: `${label} paketleri hangi kutuya koyarsın?`,
      rows: currentRows,
      targetColor: color,
      choices,
      answer: label,
      hint: `Rengine bak. ${label} paketler ${label.toLocaleLowerCase('tr-TR')} kutuya gider.`,
      successText: `${label} paketleri doğru renk kutusuna koydun.`,
      atomIds: ['MAT.1.4.1.1'],
    };
  }

  function createTallyTask(currentRows: DataRow[], color: PacketColor): DataTask {
    const row = currentRows.find((item) => item.color === color) ?? currentRows[0];
    const label = COLOR_INFO[row.color].label;
    const answer = `${row.count} çizgi`;
    return {
      id: `tally-${row.color}-${row.count}`,
      kind: 'tally',
      title: 'Çizgileri say',
      prompt: `${label} paketleri say. Kaç çizgi çizersin?`,
      rows: currentRows,
      targetColor: row.color,
      choices: makeCountChoices(row.count).map((count) => `${count} çizgi`),
      answer,
      hint: `${label} paketleri tek tek say. Her paket için bir çizgi çiz.`,
      successText: 'Çetele çizgilerini doğru saydın.',
      atomIds: ['MAT.1.4.1.2'],
    };
  }
}

function createCompareTask(currentRows: DataRow[], choices: string[], kind: 'most' | 'least'): DataTask {
  const row = kind === 'most' ? maxRow(currentRows) : minRow(currentRows);
  return {
    id: `${kind}-${row.color}`,
    kind,
    title: kind === 'most' ? 'En çoğu bul' : 'En azı bul',
    prompt: kind === 'most' ? 'En çok paket hangi renkte?' : 'En az paket hangi renkte?',
    rows: currentRows,
    choices,
    answer: COLOR_INFO[row.color].label,
    hint: kind === 'most' ? 'En çok dolu renk kutusuna bak.' : 'En az dolu renk kutusuna bak.',
    successText: kind === 'most' ? 'En çok olan rengi buldun.' : 'En az olan rengi buldun.',
    atomIds: ['MAT.1.4.1.3'],
  };
}

export function getCount(rows: DataRow[], color: PacketColor): number {
  return rows.find((row) => row.color === color)?.count ?? 0;
}

export function isCompareTask(kind: TaskKind): boolean {
  return kind === 'most' || kind === 'least';
}

function maxRow(rows: DataRow[]): DataRow {
  return rows.reduce((max, row) => (row.count > max.count ? row : max), rows[0]);
}

function minRow(rows: DataRow[]): DataRow {
  return rows.reduce((min, row) => (row.count < min.count ? row : min), rows[0]);
}

function makeCountChoices(answer: number): number[] {
  return unique([answer, Math.max(1, answer - 1), answer + 1]).slice(0, 3);
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
