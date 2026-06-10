export type GardenMission = {
  id: string;
  title: string;
  atomId: GardenAtomId;
  prompt: string;
  targetLabel: string;
  success: string;
  error: string;
  options: GardenOption[];
  correctId: string;
};

export type GardenOption = {
  id: string;
  width: number;
  height: number;
  label: string;
};

type GardenAtomId = 'MAT.5.4.3.1' | 'MAT.5.4.3.2';

export const GARDEN_ATOMS: GardenAtomId[] = ['MAT.5.4.3.1', 'MAT.5.4.3.2'];

type Pair = readonly [number, number];

type PerimeterPreset = {
  id: string;
  perimeter: number;
  pairs: Pair[];
};

type AreaPreset = {
  id: string;
  area: number;
  pairs: Pair[];
};

const samePerimeterPresets: PerimeterPreset[] = [
  { id: 'p20', perimeter: 20, pairs: [[2, 8], [3, 7], [4, 6], [5, 5]] },
  { id: 'p24', perimeter: 24, pairs: [[3, 9], [4, 8], [5, 7], [6, 6]] },
  { id: 'p28', perimeter: 28, pairs: [[4, 10], [5, 9], [6, 8], [7, 7]] },
  { id: 'p32', perimeter: 32, pairs: [[5, 11], [6, 10], [7, 9], [8, 8]] },
];

const sameAreaPresets: AreaPreset[] = [
  { id: 'a24', area: 24, pairs: [[2, 12], [3, 8], [4, 6]] },
  { id: 'a36', area: 36, pairs: [[2, 18], [3, 12], [4, 9], [6, 6]] },
  { id: 'a40', area: 40, pairs: [[2, 20], [4, 10], [5, 8]] },
  { id: 'a48', area: 48, pairs: [[3, 16], [4, 12], [6, 8]] },
];

export function createGardenMissions(): GardenMission[] {
  const firstFence = pick(samePerimeterPresets);
  const secondFence = pickDifferent(samePerimeterPresets, firstFence.id);
  const usedCorrectIds = new Set([bestAreaPairId(firstFence.pairs), bestAreaPairId(secondFence.pairs)]);
  const sameArea = pickAreaWithDifferentCorrect(sameAreaPresets, usedCorrectIds);

  return [
    buildSamePerimeterMission({
      preset: firstFence,
      id: 'same-fence-max-area',
      title: 'Aynı çit, farklı alan',
      targetLabel: 'En geniş bahçeyi bul',
      prompt: `Çevresi ${firstFence.perimeter} birim olan bahçelerden alanı en büyük olanı seç.`,
    }),
    buildSameAreaMission(sameArea),
    buildSamePerimeterMission({
      preset: secondFence,
      id: 'same-fence-compare',
      title: 'Çit sabit kalınca',
      targetLabel: 'En büyük alanı kilitle',
      prompt: `Çevresi ${secondFence.perimeter} birim olan bahçelerde alanın değiştiğini kanıtla.`,
    }),
  ];
}

export function areaOf(option: GardenOption) {
  return option.width * option.height;
}

export function perimeterOf(option: GardenOption) {
  return 2 * (option.width + option.height);
}

function buildSamePerimeterMission({
  preset,
  id,
  title,
  targetLabel,
  prompt,
}: {
  preset: PerimeterPreset;
  id: string;
  title: string;
  targetLabel: string;
  prompt: string;
}): GardenMission {
  const options = buildOptions(preset.pairs);
  const correct = options.reduce((best, option) => (areaOf(option) > areaOf(best) ? option : best), options[0]);

  return {
    id: `${id}-${preset.id}`,
    title,
    atomId: 'MAT.5.4.3.1',
    prompt,
    targetLabel,
    success: `Doğru: çevre ${preset.perimeter} kaldı, ${correct.width} x ${correct.height} bahçe en büyük alanı verdi.`,
    error: 'Çit uzunluğu aynı ama alan daha küçük. Aynı çevrede kareye yaklaşınca alan büyür.',
    correctId: correct.id,
    options: shuffleItems(options),
  };
}

function buildSameAreaMission(preset: AreaPreset): GardenMission {
  const options = buildOptions(preset.pairs);
  const correct = options.reduce(
    (best, option) => (perimeterOf(option) < perimeterOf(best) ? option : best),
    options[0]
  );

  return {
    id: `same-area-short-fence-${preset.id}`,
    title: 'Aynı alan, farklı çit',
    atomId: 'MAT.5.4.3.2',
    prompt: `Alanı ${preset.area} birim kare olan bahçelerden çevresi en kısa olanı seç.`,
    targetLabel: 'En az çit isteyen bahçeyi bul',
    success: `Doğru: alan ${preset.area} kaldı, ${correct.width} x ${correct.height} bahçe daha az çit istedi.`,
    error: 'Alan aynı ama çit uzunluğu daha fazla. Kenarlar birbirine yaklaşınca çevre azalır.',
    correctId: correct.id,
    options: shuffleItems(options),
  };
}

function buildOptions(pairs: Pair[]): GardenOption[] {
  return pairs.map(([width, height]) => ({
    id: `${width}x${height}`,
    width,
    height,
    label: labelFor(width, height),
  }));
}

function labelFor(width: number, height: number) {
  if (width === height) return 'Kare bahçe';

  const ratio = Math.max(width, height) / Math.min(width, height);
  if (ratio >= 6) return 'Çok uzun bahçe';
  if (ratio >= 3) return 'Uzun dar bahçe';
  if (ratio >= 2) return 'Dar bahçe';
  return 'Dengeli bahçe';
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickDifferent<T extends { id: string }>(items: T[], excludedId: string) {
  const candidates = items.filter((item) => item.id !== excludedId);
  return pick(candidates.length > 0 ? candidates : items);
}

function pickAreaWithDifferentCorrect(items: AreaPreset[], usedCorrectIds: Set<string>) {
  const candidates = items.filter((item) => !usedCorrectIds.has(shortestFencePairId(item.pairs)));
  return pick(candidates.length > 0 ? candidates : items);
}

function shuffleItems<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function bestAreaPairId(pairs: Pair[]) {
  return pairId(pairs.reduce((best, pair) => (pair[0] * pair[1] > best[0] * best[1] ? pair : best), pairs[0]));
}

function shortestFencePairId(pairs: Pair[]) {
  return pairId(
    pairs.reduce((best, pair) => (2 * (pair[0] + pair[1]) < 2 * (best[0] + best[1]) ? pair : best), pairs[0])
  );
}

function pairId([width, height]: Pair) {
  return `${width}x${height}`;
}
