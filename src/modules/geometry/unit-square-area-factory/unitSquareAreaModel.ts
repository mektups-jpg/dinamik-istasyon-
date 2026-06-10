export type Stage = {
  id: string;
  width: number;
  height: number;
  title: string;
  prompt: string;
  choices: number[];
};

type AreaPattern = {
  width: number;
  height: number;
  title: string;
};

const EASY_PATTERNS: AreaPattern[] = [
  { width: 3, height: 2, title: 'Robot iniş alanı' },
  { width: 4, height: 2, title: 'Dikdörtgen alan zemini' },
  { width: 3, height: 3, title: 'Kare bakım zemini' },
  { width: 5, height: 2, title: 'Güneş paneli zemini' },
  { width: 2, height: 4, title: 'Servis asansörü zemini' },
];

const MEDIUM_PATTERNS: AreaPattern[] = [
  { width: 4, height: 3, title: 'Kargo platformu' },
  { width: 5, height: 3, title: 'Araç park zemini' },
  { width: 6, height: 2, title: 'Uzay koridoru' },
  { width: 4, height: 4, title: 'Bakım atölyesi' },
  { width: 3, height: 5, title: 'Dikey sera zemini' },
];

const CHALLENGE_PATTERNS: AreaPattern[] = [
  { width: 6, height: 3, title: 'Ana depo zemini' },
  { width: 5, height: 4, title: 'Hidroponik bahçe' },
  { width: 6, height: 4, title: 'Kargo hangarı' },
  { width: 5, height: 5, title: 'Merkez modül zemini' },
  { width: 4, height: 5, title: 'Uydu bakım alanı' },
];

const STAGE_POOLS = [EASY_PATTERNS, MEDIUM_PATTERNS, CHALLENGE_PATTERNS];
const RUN_COUNTER_KEY = 'unit-square-area-factory-run';

export const makeCellId = (row: number, column: number) => `${row}-${column}`;

export function createStageSequence(): Stage[] {
  const runSeed = nextRunSeed();
  return STAGE_POOLS.map((pool, index) => {
    const pattern = pool[(runSeed + index * 2) % pool.length];
    return createStage(pattern, index);
  });
}

function createStage(pattern: AreaPattern, index: number): Stage {
  return {
    id: `${index + 1}-${pattern.width}x${pattern.height}`,
    width: pattern.width,
    height: pattern.height,
    title: pattern.title,
    prompt: `${pattern.width} sütun ve ${pattern.height} satırlık zemini birim karelerle kapla.`,
    choices: createAreaChoices(pattern.width, pattern.height),
  };
}

function createAreaChoices(width: number, height: number): number[] {
  const area = width * height;
  const distractors = unique([
    area + width,
    area + height,
    area - width,
    area - height,
    width + height,
    area + 2,
  ]).filter((value) => value > 0 && value !== area);
  return shuffle([area, ...shuffle(distractors).slice(0, 2)]);
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function unique(items: number[]): number[] {
  return [...new Set(items)];
}

function nextRunSeed(): number {
  if (typeof window === 'undefined') return Math.floor(Math.random() * 1000);

  try {
    const current = Number(window.sessionStorage.getItem(RUN_COUNTER_KEY) ?? '0');
    const next = Number.isFinite(current) ? current + 1 : 1;
    window.sessionStorage.setItem(RUN_COUNTER_KEY, String(next));
    return next;
  } catch {
    return Math.floor(Math.random() * 1000);
  }
}
