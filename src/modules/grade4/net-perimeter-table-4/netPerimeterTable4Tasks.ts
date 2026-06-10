import { CODE_PATTERNS } from './netPerimeterCodePatterns';

export type NetPerimeterKind = 'net' | 'edge' | 'perimeter' | 'area' | 'symmetry' | 'code';

export interface GridCell {
  x: number;
  y: number;
  label?: string;
  tone?: string;
}

export interface GridModel {
  columns: number;
  rows: number;
  cells: GridCell[];
  ghostCells?: GridCell[];
  axis?: 'vertical' | 'horizontal' | 'diagonal';
}

export interface DimensionModel {
  width: number;
  height: number;
}

export interface NetPerimeterTask {
  id: string;
  kind: NetPerimeterKind;
  title: string;
  prompt: string;
  chips: string[];
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  accent: string;
  atomIds: string[];
  grid?: GridModel;
  dimensions?: DimensionModel;
  codeBlocks?: string[];
}

export const NET_PERIMETER_ATOMS = [
  { id: 'MAT.4.3.1.1', label: 'Küp ve prizma açınımını tanır.' },
  { id: 'MAT.4.3.2.1', label: 'Açılmış şekillerde eş uzunlukları bulur.' },
  { id: 'MAT.4.3.2.2', label: 'Kapalı şekillerde eş uzunlukları yorumlar.' },
  { id: 'MAT.4.3.3.1', label: 'Sanal cetvelle çevreyi dolaşır.' },
  { id: 'MAT.4.3.4.1', label: 'Birim fayanslarla alanı tahmin eder.' },
  { id: 'MAT.4.3.8.1', label: 'Simetri çizgisini ayna gibi kullanır.' },
  { id: 'MAT.4.3.9.1', label: 'Simetrik şekli tamamlar.' },
  { id: 'MAT.4.3.10.1', label: 'Kod bloklarıyla şekil deseni kurar.' },
];

type CubeNetVariant = {
  id: string;
  columns: number;
  rows: number;
  cells: readonly GridCell[];
};

type SymmetryVariant = {
  id: string;
  axis: 'vertical' | 'horizontal';
  answer: string;
  distractor: string;
  columns: number;
  rows: number;
  cells: readonly GridCell[];
};

const CUBE_NET_VARIANTS: readonly CubeNetVariant[] = [
  {
    id: 'cross-column',
    columns: 6,
    rows: 4,
    cells: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
  },
  {
    id: 'long-row-center-tab',
    columns: 6,
    rows: 4,
    cells: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
    ],
  },
  {
    id: 'long-row-staggered-tabs',
    columns: 6,
    rows: 4,
    cells: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 2, y: 0 },
      { x: 3, y: 2 },
    ],
  },
  {
    id: 'long-row-edge-tab',
    columns: 6,
    rows: 4,
    cells: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 1, y: 0 },
      { x: 3, y: 2 },
    ],
  },
  {
    id: 'zigzag-steps',
    columns: 6,
    rows: 4,
    cells: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ],
  },
  {
    id: 'snake-row',
    columns: 6,
    rows: 4,
    cells: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ],
  },
];

const SYMMETRY_VARIANTS: readonly SymmetryVariant[] = [
  {
    id: 'vertical-left-corner',
    axis: 'vertical',
    answer: 'Aynası sağda tamamlanır',
    distractor: 'Aynası solda kalır',
    columns: 6,
    rows: 5,
    cells: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  },
  {
    id: 'vertical-left-stairs',
    axis: 'vertical',
    answer: 'Aynası sağda tamamlanır',
    distractor: 'Aynası solda kalır',
    columns: 6,
    rows: 5,
    cells: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  },
  {
    id: 'vertical-right-hook',
    axis: 'vertical',
    answer: 'Aynası solda tamamlanır',
    distractor: 'Aynası sağda kalır',
    columns: 6,
    rows: 5,
    cells: [{ x: 3, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
  },
  {
    id: 'horizontal-top-corner',
    axis: 'horizontal',
    answer: 'Aynası altta tamamlanır',
    distractor: 'Aynası üstte kalır',
    columns: 5,
    rows: 6,
    cells: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  },
  {
    id: 'horizontal-top-stairs',
    axis: 'horizontal',
    answer: 'Aynası altta tamamlanır',
    distractor: 'Aynası üstte kalır',
    columns: 5,
    rows: 6,
    cells: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  },
  {
    id: 'horizontal-bottom-corner',
    axis: 'horizontal',
    answer: 'Aynası üstte tamamlanır',
    distractor: 'Aynası altta kalır',
    columns: 5,
    rows: 6,
    cells: [{ x: 2, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 5 }],
  },
];

let lastCubeNetVariantId: string | null = null;
let lastSymmetryVariantId: string | null = null;
let lastCodePatternId: string | null = null;

export function createNetPerimeterTasks(): NetPerimeterTask[] {
  return [
    createNetTask(),
    createEdgeTask(),
    createPerimeterTask(),
    createAreaTask(),
    createSymmetryTask(),
    createCodeTask(),
  ];
}

function createNetTask(): NetPerimeterTask {
  const variants = CUBE_NET_VARIANTS.filter((variant) => variant.id !== lastCubeNetVariantId);
  const variant = randomItem(variants.length > 0 ? variants : CUBE_NET_VARIANTS);
  lastCubeNetVariantId = variant.id;

  return {
    id: `net-${variant.id}`,
    kind: 'net',
    title: 'Kutuyu aç',
    prompt: '6 eş kareden oluşan bu açınım hangi cismin açınımıdır?',
    chips: ['6 kare yüz', 'Küpün 6 yüzü', 'Yüzler eş büyüklükte'],
    choices: shuffle(['Küp açınımı', 'Daire modeli', 'Üçgen piramit açınımı']),
    answer: 'Küp açınımı',
    hint: 'Küpün 6 tane eş kare yüzü vardır.',
    successText: 'Küp açınımını doğru tanıdın.',
    accent: '#2EE7FF',
    atomIds: ['MAT.4.3.1.1'],
    grid: {
      columns: variant.columns,
      rows: variant.rows,
      cells: variant.cells.map((cell, index) => ({ ...cell, label: String(index + 1) })),
    },
  };
}

function createEdgeTask(): NetPerimeterTask {
  const colorName = randomItem(['Mor', 'Mavi', 'Yeşil']);
  const accentByColor: Record<string, string> = {
    Mor: '#B388FF',
    Mavi: '#2EE7FF',
    Yeşil: '#34D399',
  };

  return {
    id: `edge-${colorName}`,
    kind: 'edge',
    title: 'Eş kenarı yakala',
    prompt: `${colorName} işaretli iki kenar için doğru cümleyi seç.`,
    chips: [`${colorName} kenar`, 'Aynı uzunluk', 'Katlanınca birleşir'],
    choices: shuffle([`${colorName} kenarlar eş`, `${colorName} kenar daha kısa`, `${colorName} kenar köşe değildir`]),
    answer: `${colorName} kenarlar eş`,
    hint: 'Aynı renkle parlayan iki kenar aynı uzunluktadır.',
    successText: 'Eş kenar işaretlerini doğru okudun.',
    accent: accentByColor[colorName],
    atomIds: ['MAT.4.3.2.1', 'MAT.4.3.2.2'],
    grid: {
      columns: 5,
      rows: 3,
      cells: [
        { x: 1, y: 1, tone: '#2EE7FF' },
        { x: 2, y: 1, tone: accentByColor[colorName], label: 'A' },
        { x: 3, y: 1, tone: '#2EE7FF' },
        { x: 2, y: 0, tone: accentByColor[colorName], label: 'B' },
        { x: 2, y: 2, tone: '#34D399' },
      ],
    },
  };
}

function createPerimeterTask(): NetPerimeterTask {
  const width = randomItem([4, 5, 6, 7]);
  const height = randomItem([2, 3, 4]);
  const answer = 2 * (width + height);

  return {
    id: `perimeter-${width}-${height}`,
    kind: 'perimeter',
    title: 'Çevreyi dolaş',
    prompt: `${width} birim uzun, ${height} birim kısa kenarlı dikdörtgenin dış yolu kaç birim?`,
    chips: [`Üst ${width}`, `Alt ${width}`, `Sağ-sol ${height}`],
    choices: makeNumberChoices(answer, [width + height, width * height], ' birim'),
    answer: `${answer} birim`,
    hint: 'Dış yolu dolaş: üst + sağ + alt + sol.',
    successText: 'Dış yolu doğru dolaştın.',
    accent: '#FFB020',
    atomIds: ['MAT.4.3.3.1'],
    dimensions: { width, height },
  };
}

function createAreaTask(): NetPerimeterTask {
  const variants: GridCell[][] = [
    [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  ];
  const cells = randomItem(variants);
  const answer = cells.length;

  return {
    id: `area-${answer}-${cells[0].x}`,
    kind: 'area',
    title: 'Fayansları say',
    prompt: 'Şeklin içini yaklaşık kaç kare fayans kaplar?',
    chips: ['İç bölge', 'Kare fayans', 'Tek tek say'],
    choices: makeNumberChoices(answer, [answer + 2, Math.max(1, answer - 1)], ' fayans'),
    answer: `${answer} fayans`,
    hint: 'Sadece içi dolu kare fayansları say.',
    successText: 'Fayansları doğru saydın.',
    accent: '#34D399',
    atomIds: ['MAT.4.3.4.1'],
    grid: { columns: 4, rows: 3, cells },
  };
}

function createSymmetryTask(): NetPerimeterTask {
  const variants = SYMMETRY_VARIANTS.filter((variant) => variant.id !== lastSymmetryVariantId);
  const variant = randomItem(variants.length > 0 ? variants : SYMMETRY_VARIANTS);
  lastSymmetryVariantId = variant.id;
  const ghostCells = variant.cells.map((cell) => (
    variant.axis === 'vertical'
      ? { ...cell, x: variant.columns - 1 - cell.x }
      : { ...cell, y: variant.rows - 1 - cell.y }
  ));

  return {
    id: `symmetry-${variant.id}`,
    kind: 'symmetry',
    title: 'Aynayı tamamla',
    prompt: 'Kat çizgisine göre şeklin aynası nereye gelir?',
    chips: [variant.axis === 'vertical' ? 'Dikey kat çizgisi' : 'Yatay kat çizgisi', 'Aynı uzaklık', 'Ters yönde eş şekil'],
    choices: shuffle([variant.answer, variant.distractor, 'Aynası kaybolur']),
    answer: variant.answer,
    hint: 'Simetri çizgisi ayna gibidir; şekil öbür tarafa aynı uzaklıkta geçer.',
    successText: 'Ayna tarafını doğru seçtin.',
    accent: '#69D0FF',
    atomIds: ['MAT.4.3.8.1', 'MAT.4.3.9.1'],
    grid: {
      columns: variant.columns,
      rows: variant.rows,
      axis: variant.axis,
      cells: variant.cells.map((cell) => ({ ...cell })),
      ghostCells,
    },
  };
}

function createCodeTask(): NetPerimeterTask {
  const patterns = CODE_PATTERNS.filter((candidate) => candidate.id !== lastCodePatternId);
  const pattern = randomItem(patterns.length > 0 ? patterns : CODE_PATTERNS);
  lastCodePatternId = pattern.id;

  return {
    id: `code-${pattern.id}`,
    kind: 'code',
    title: 'Kodla şekil yap',
    prompt: 'Kod blokları hangi deseni oluşturur?',
    chips: ['Kod sırası', 'Kare adımlar', 'Şekil deseni'],
    choices: shuffle([pattern.name, 'Daire deseni', 'Uzun dikdörtgen deseni']),
    answer: pattern.name,
    hint: 'Komutları sırayla izle; karelerin yolu deseni gösterir.',
    successText: 'Kod bloklarını doğru şekle çevirdin.',
    accent: '#FB7185',
    atomIds: ['MAT.4.3.10.1'],
    codeBlocks: [...pattern.blocks],
    grid: { columns: 4, rows: 3, cells: pattern.cells.map((cell) => ({ ...cell })) },
  };
}

function makeNumberChoices(answer: number, distractors: number[], suffix: string): string[] {
  const values = unique([answer, ...distractors]).filter((value) => value > 0);
  const backupOffsets = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 10, -10];

  for (const offset of backupOffsets) {
    if (values.length >= 3) break;
    const candidate = answer + offset;
    if (candidate > 0 && !values.includes(candidate)) {
      values.push(candidate);
    }
  }

  return shuffle(values).slice(0, 3).map((value) => `${value}${suffix}`);
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
