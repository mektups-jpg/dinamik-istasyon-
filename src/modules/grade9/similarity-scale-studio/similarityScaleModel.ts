import type { PairOption, SimilarityBuild, SimilarityMission, SimilarityPairId, TriangleModel } from './types';

export const MODULE_ID = 'similarity-scale-studio';

export const atomIds = ['MAT.9.5.2.1', 'MAT.9.5.2.2'];

const sourceWide: TriangleModel = {
  labels: ['A', 'B', 'C'],
  points: [
    { x: 110, y: 335 },
    { x: 315, y: 335 },
    { x: 192, y: 145 },
  ],
  angles: [50, 60, 70],
  sides: [3, 4, 5],
};

const targetWide: TriangleModel = {
  labels: ['D', 'E', 'F'],
  points: [
    { x: 415, y: 365 },
    { x: 650, y: 365 },
    { x: 510, y: 145 },
  ],
  angles: [50, 60, 70],
  sides: [6, 8, 10],
};

const sourceFlip: TriangleModel = {
  labels: ['A', 'B', 'C'],
  points: [
    { x: 115, y: 345 },
    { x: 320, y: 345 },
    { x: 242, y: 130 },
  ],
  angles: [45, 65, 70],
  sides: [5, 7, 8],
};

const targetFlip: TriangleModel = {
  labels: ['D', 'E', 'F'],
  points: [
    { x: 420, y: 355 },
    { x: 655, y: 355 },
    { x: 475, y: 130 },
  ],
  angles: [45, 70, 65],
  sides: [7.5, 12, 10.5],
};

const sourceRatio: TriangleModel = {
  labels: ['A', 'B', 'C'],
  points: [
    { x: 120, y: 330 },
    { x: 320, y: 330 },
    { x: 210, y: 150 },
  ],
  angles: [53, 67, 60],
  sides: [3, 4, 5],
};

const targetRatio: TriangleModel = {
  labels: ['D', 'E', 'F'],
  points: [
    { x: 420, y: 365 },
    { x: 660, y: 365 },
    { x: 528, y: 150 },
  ],
  angles: [53, 67, 60],
  sides: [6, 8, 10],
};

const sourceRatioSmall: TriangleModel = {
  labels: ['A', 'B', 'C'],
  points: [
    { x: 120, y: 325 },
    { x: 315, y: 325 },
    { x: 205, y: 155 },
  ],
  angles: [48, 72, 60],
  sides: [4, 5, 6],
};

const targetRatioSmall: TriangleModel = {
  labels: ['D', 'E', 'F'],
  points: [
    { x: 420, y: 350 },
    { x: 620, y: 350 },
    { x: 507, y: 125 },
  ],
  angles: [48, 72, 60],
  sides: [6, 7.5, 9],
};

export const similarityMissions: SimilarityMission[] = [
  {
    id: 'same-angle-lock',
    title: 'Eş Açı Kilidi',
    atomId: 'MAT.9.5.2.1',
    mode: 'angles',
    prompt: 'İki üçgende karşılıklı açıları eşleştir; açı üçlüsü tamamlanınca benzerlik kapısı açılır.',
    source: sourceWide,
    target: targetWide,
    targetPairs: ['a-d', 'b-e', 'c-f'],
    availablePairs: [
      anglePair('a-d', 'A ↔ D', '50° ile 50°'),
      anglePair('a-e', 'A ↔ E', '50° ile 60°'),
      anglePair('b-e', 'B ↔ E', '60° ile 60°'),
      anglePair('c-f', 'C ↔ F', '70° ile 70°'),
      anglePair('b-d', 'B ↔ D', '60° ile 50°'),
    ],
    resultLabel: 'Eş açılar: A-D, B-E, C-F',
    success: 'Açı üçlüsü eşleşti; benzerlik için açı şartı kuruldu.',
    error: 'Açı kilidinde en az bir eşleşme yanlış veya eksik.',
    hint: 'Benzer üçgenlerde karşılıklı açılar eş olur.',
  },
  {
    id: 'mixed-correspondence',
    title: 'Karışık Eşleşme',
    atomId: 'MAT.9.5.2.1',
    mode: 'angles',
    prompt: 'Harf sırası değiştiğinde de eş açıları bul. Aynı derece aynı renge bağlanmalı.',
    source: sourceFlip,
    target: targetFlip,
    targetPairs: ['a-d', 'b-f', 'c-e'],
    availablePairs: [
      anglePair('a-d', 'A ↔ D', '45° ile 45°'),
      anglePair('b-e', 'B ↔ E', '65° ile 70°'),
      anglePair('b-f', 'B ↔ F', '65° ile 65°'),
      anglePair('c-e', 'C ↔ E', '70° ile 70°'),
      anglePair('c-d', 'C ↔ D', '70° ile 45°'),
    ],
    resultLabel: 'Harf sırası değil, açı eşliği',
    success: 'Karışık etiketlerde bile eş açılar doğru bağlandı.',
    error: 'Harf sırasına bakma; açı değerleri hangi köşelerin karşılık geldiğini söyler.',
    hint: 'Döndürülmüş/çevrilmiş üçgende isim değil açı değeri izlenir.',
  },
  {
    id: 'double-scale',
    title: 'İki Kat Ölçek',
    atomId: 'MAT.9.5.2.2',
    mode: 'ratio',
    prompt: 'Küçük üçgenin kenarları büyük üçgende aynı oranla büyüyor mu? Ölçeği ve kenar çiftlerini kur.',
    source: sourceRatio,
    target: targetRatio,
    targetPairs: ['ab-de', 'ac-df', 'bc-ef'],
    availablePairs: [
      sidePair('ab-de', 'AB ↔ DE', '3 → 6'),
      sidePair('ac-df', 'AC ↔ DF', '4 → 8'),
      sidePair('bc-ef', 'BC ↔ EF', '5 → 10'),
      sidePair('ab-df', 'AB ↔ DF', '3 → 8'),
      sidePair('bc-de', 'BC ↔ DE', '5 → 6'),
    ],
    scaleOptions: [1.5, 2, 3],
    targetScale: 2,
    resultLabel: 'Tüm oranlar k = 2',
    success: 'Kenarlar aynı ölçekle büyüdü; oran şartı tamam.',
    error: 'Kenar çiftleri aynı katsayıyı vermiyor veya ölçek yanlış.',
    hint: 'Benzerlikte tüm karşılıklı kenarlar aynı katsayıyla büyür.',
  },
  {
    id: 'one-half-scale',
    title: 'Bir Buçuk Kat Ölçek',
    atomId: 'MAT.9.5.2.2',
    mode: 'ratio',
    prompt: 'Bu kez büyüme iki kat değil. Ortak katsayıyı bul ve karşılıklı kenarları bağla.',
    source: sourceRatioSmall,
    target: targetRatioSmall,
    targetPairs: ['ab-de', 'ac-df', 'bc-ef'],
    availablePairs: [
      sidePair('ab-de', 'AB ↔ DE', '4 → 6'),
      sidePair('ac-df', 'AC ↔ DF', '5 → 7.5'),
      sidePair('bc-ef', 'BC ↔ EF', '6 → 9'),
      sidePair('ab-ef', 'AB ↔ EF', '4 → 9'),
      sidePair('ac-de', 'AC ↔ DE', '5 → 6'),
    ],
    scaleOptions: [1.25, 1.5, 2],
    targetScale: 1.5,
    resultLabel: 'Tüm oranlar k = 1.5',
    success: 'Ortak katsayı bulundu; kenarlar orantılı büyüyor.',
    error: 'Ortak katsayı aynı değil. Her kenar çifti aynı ölçeği vermeli.',
    hint: 'Bir çift doğru olsa bile tüm karşılıklı kenarlar aynı oranı vermeli.',
  },
];

export function initialBuild(): SimilarityBuild {
  return {
    selectedPairs: [],
    scale: null,
  };
}

export function togglePair(build: SimilarityBuild, pairId: SimilarityPairId): SimilarityBuild {
  const selected = build.selectedPairs.includes(pairId);
  return {
    ...build,
    selectedPairs: selected
      ? build.selectedPairs.filter((id) => id !== pairId)
      : [...build.selectedPairs, pairId],
  };
}

export function autoBuildFor(mission: SimilarityMission): SimilarityBuild {
  return {
    selectedPairs: [...mission.targetPairs],
    scale: mission.targetScale ?? null,
  };
}

export function buildMatches(build: SimilarityBuild, mission: SimilarityMission): boolean {
  const pairsMatch =
    build.selectedPairs.length === mission.targetPairs.length &&
    mission.targetPairs.every((pairId) => build.selectedPairs.includes(pairId));

  if (!pairsMatch) return false;
  if (mission.mode === 'ratio') return build.scale === mission.targetScale;
  return true;
}

export function evidenceLabel(build: SimilarityBuild, mission: SimilarityMission): string {
  const pairLabel = `${build.selectedPairs.length}/${mission.targetPairs.length} bağ`;
  if (mission.mode === 'ratio') return `${pairLabel}, k=${build.scale ?? '?'}`;
  return pairLabel;
}

export function isTargetPair(mission: SimilarityMission, pairId: SimilarityPairId): boolean {
  return mission.targetPairs.includes(pairId);
}

function anglePair(id: PairOption['id'], label: string, detail: string): PairOption {
  return { id, label, detail };
}

function sidePair(id: PairOption['id'], label: string, detail: string): PairOption {
  return { id, label, detail };
}
