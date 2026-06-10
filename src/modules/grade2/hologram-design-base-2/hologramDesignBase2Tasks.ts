export type HologramDesignKind = 'block-build' | 'shape-build';

export interface HologramDesignTask {
  id: string;
  kind: HologramDesignKind;
  title: string;
  prompt: string;
  target: string;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
  color: string;
  code: string;
}

export const HOLOGRAM_DESIGN_2_ATOMS = [
  { id: 'MAT.2.3.2.1', label: 'Geometrik cisimleri üst üste dizerek model oluşturur.' },
  { id: 'MAT.2.3.3.1', label: 'Düz şekilleri yan yana dizerek yeni model oluşturur.' },
];

const BLOCK_CASES = [
  { answer: 'Küp', code: 'küp + silindir + küre' },
  { answer: 'Silindir', code: 'küp + silindir + küre' },
  { answer: 'Küre', code: 'küp + silindir + küre' },
];

const SHAPE_CASES = [
  { answer: 'Üçgen', code: 'üçgen + kare + daire' },
  { answer: 'Daire', code: 'üçgen + kare + daire' },
  { answer: 'Kare', code: 'üçgen + kare + daire' },
];

const COLORS = ['#22D3EE', '#FACC15', '#A78BFA', '#34D399'];

export function createHologramDesignBase2Tasks(seed = Math.floor(Math.random() * 1000)): HologramDesignTask[] {
  const firstBlock = pickBySeed(BLOCK_CASES, seed);
  const secondBlock = pickBySeed(BLOCK_CASES, seed + 1);
  const firstShape = pickBySeed(SHAPE_CASES, seed + 2);
  const secondShape = pickBySeed(SHAPE_CASES, seed + 3);

  const tasks: HologramDesignTask[] = [
    makeBlockTask(firstBlock, 0, 'Robotu tamamla'),
    makeShapeTask(firstShape, 1, 'Aracı tamamla'),
    makeBlockTask(secondBlock, 2, 'Robotu tekrar tamamla'),
    makeShapeTask(secondShape, 3, 'Aracı tekrar tamamla'),
  ];

  return tasks.map((task) => ({ ...task, choices: shuffle(task.choices) }));
}

function makeBlockTask(block: (typeof BLOCK_CASES)[number], colorIndex: number, title: string): HologramDesignTask {
  return {
    id: `block-build-${block.answer}-${colorIndex}`,
    kind: 'block-build',
    title,
    prompt: 'Gölgedeki cismin adını seç.',
    target: 'Gölgedeki cisim',
    choices: makeChoices(block.answer, ['Küp', 'Silindir', 'Küre']),
    answer: block.answer,
    hint: 'Boş yuvadaki taslağa bak: küp, silindir veya küre.',
    successText: 'Cismin adını doğru seçtin.',
    atomIds: ['MAT.2.3.2.1'],
    color: COLORS[colorIndex],
    code: block.code,
  };
}

function makeShapeTask(shape: (typeof SHAPE_CASES)[number], colorIndex: number, title: string): HologramDesignTask {
  return {
    id: `shape-build-${shape.answer}-${colorIndex}`,
    kind: 'shape-build',
    title,
    prompt: 'Gölgedeki düz şeklin adını seç.',
    target: 'Gölgedeki düz şekil',
    choices: makeChoices(shape.answer, ['Üçgen', 'Daire', 'Kare']),
    answer: shape.answer,
    hint: 'Boş parçadaki taslağa bak: üçgen, kare veya daire.',
    successText: 'Düz şeklin adını doğru seçtin.',
    atomIds: ['MAT.2.3.3.1'],
    color: COLORS[colorIndex],
    code: shape.code,
  };
}

function makeChoices(answer: string, pool: string[]) {
  return shuffle(unique(pool.filter((choice) => choice !== answer).slice(0, 2).concat(answer)));
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
