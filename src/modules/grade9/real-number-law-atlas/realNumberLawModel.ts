import { AtlasMission, LawBuild } from './types';

export const MODULE_ID = 'real-number-law-atlas';

export const atomIds = ['MAT.9.1.4.1', 'MAT.9.1.4.2', 'MAT.9.1.5.1', 'MAT.9.1.5.2'];

interface AtlasExampleSet {
  integerValue: string;
  rationalValue: string;
  radicalValue: number;
  factor: number;
  constant: number;
}

const atlasExampleSets: AtlasExampleSet[] = [
  { integerValue: '−3', rationalValue: '3/4', radicalValue: 2, factor: 3, constant: 2 },
  { integerValue: '−5', rationalValue: '5/2', radicalValue: 3, factor: 2, constant: 4 },
  { integerValue: '−1', rationalValue: '7/3', radicalValue: 5, factor: 5, constant: 1 },
  { integerValue: '−7', rationalValue: '1/6', radicalValue: 7, factor: 4, constant: 3 },
  { integerValue: '−9', rationalValue: '2/5', radicalValue: 6, factor: 6, constant: 2 },
  { integerValue: '−11', rationalValue: '4/9', radicalValue: 10, factor: 7, constant: 1 },
  { integerValue: '−13', rationalValue: '9/4', radicalValue: 11, factor: 2, constant: 5 },
  { integerValue: '−15', rationalValue: '5/8', radicalValue: 13, factor: 3, constant: 4 },
];

export const atlasExampleSetCount = atlasExampleSets.length;

export const initialBuild: LawBuild = {
  naturalGate: false,
  integerGate: false,
  rationalGate: false,
  irrationalGate: false,
  realUmbrella: false,
  leftGroup: false,
  rightGroup: false,
  xArm: false,
  constantArm: false,
};

export const atlasMissions = createAtlasMissions(0);

export function pickAtlasExampleSetIndex(excludedIndexes: readonly number[] = []) {
  if (atlasExampleSets.length <= 1) return 0;

  const allIndexes = atlasExampleSets.map((_, index) => index);
  const excludedSet = new Set(excludedIndexes.filter((index) => index >= 0 && index < atlasExampleSets.length));
  const freshCandidates = allIndexes.filter((index) => !excludedSet.has(index));
  const previousIndex = excludedIndexes[excludedIndexes.length - 1];
  const rolloverCandidates = allIndexes.filter((index) => index !== previousIndex);
  const candidates = freshCandidates.length > 0 ? freshCandidates : rolloverCandidates;

  return candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
}

export function createAtlasMissions(exampleSetIndex = 0): AtlasMission[] {
  const example = atlasExampleSets[exampleSetIndex] ?? atlasExampleSets[0];
  const product = example.factor * example.constant;
  const distributiveExpression = `${example.factor}(x + ${example.constant})`;
  const distributiveResult = `${example.factor}x + ${product}`;

  return [
  {
    id: 'negative-integer',
    title: 'Negatif Kapı Ayrımı',
    atomId: 'MAT.9.1.4.1',
    kind: 'natural-integer',
    prompt: `${example.integerValue} kapsülünü doğal sayı kapısının dışında bırak; tam sayı kapısını yak.`,
    sceneLabel: `${example.integerValue} sayısı hangi kümeye girer?`,
    targetText: `${example.integerValue} ∈ Z, ${example.integerValue} ∉ N`,
    success: `Negatiflik ayrımı doğru: ${example.integerValue} tam sayıdır ama doğal sayı değildir.`,
    error: `${example.integerValue} negatif olduğu için doğal sayı kapısı yanmamalı; tam sayı katmanı açık kalmalı.`,
    examples: { integerValue: example.integerValue },
  },
  {
    id: 'real-umbrella',
    title: 'Gerçek Sayı Şemsiyesi',
    atomId: 'MAT.9.1.4.2',
    kind: 'real-umbrella',
    prompt: `${example.rationalValue} rasyonel ışını ve √${example.radicalValue} irrasyonel ışını aynı gerçek sayı şemsiyesinde buluştur.`,
    sceneLabel: 'Rasyonel + irrasyonel hangi büyük kümeyi kurar?',
    targetText: 'Q ∪ I = R',
    success: 'Rasyonel ve irrasyonel ışınlar gerçek sayı şemsiyesinde birleşti.',
    error: 'Gerçek sayı şemsiyesi için hem rasyonel hem irrasyonel ışın açık olmalı.',
    examples: { rationalValue: example.rationalValue, radicalValue: example.radicalValue },
  },
  {
    id: 'associative-addition',
    title: 'Toplamda Birleşme',
    atomId: 'MAT.9.1.5.1',
    kind: 'associative',
    prompt: '(a + b) + c ile a + (b + c) yollarını aynı toplam çekirdeğine bağla.',
    sceneLabel: 'Toplamda grup yeri sonucu değiştirir mi?',
    targetText: '(a + b) + c = a + (b + c)',
    success: 'Birleşme yasası kuruldu: toplamada grup yeri sonucu değiştirmez.',
    error: 'İki grup yolu da aynı çekirdeğe bağlanmadan birleşme yasası görülmez.',
  },
  {
    id: 'distributive-multiplication',
    title: 'Çarpmanın Dağılması',
    atomId: 'MAT.9.1.5.2',
    kind: 'distributive',
    prompt: `${example.factor} çarpanını parantezdeki her terime dağıt: ${example.factor}·x ve ${example.factor}·${example.constant} kollarını kur.`,
    sceneLabel: `${distributiveExpression} parantezi nasıl açılır?`,
    targetText: `${distributiveExpression} = ${distributiveResult}`,
    success: `Dağılma yasası kilitlendi: ${distributiveExpression} = ${distributiveResult}.`,
    error: `Dağılma için ${example.factor} çarpanı hem x terimiyle hem ${example.constant} terimiyle çarpılmalı.`,
    examples: {
      factor: example.factor,
      constant: example.constant,
      product,
      distributiveExpression,
      distributiveResult,
    },
  },
  ];
}

export function buildMatches(build: LawBuild, mission: AtlasMission) {
  if (mission.kind === 'natural-integer') return !build.naturalGate && build.integerGate;
  if (mission.kind === 'real-umbrella') return build.rationalGate && build.irrationalGate && build.realUmbrella;
  if (mission.kind === 'associative') return build.leftGroup && build.rightGroup;
  return build.xArm && build.constantArm;
}

export function nextBuild(build: LawBuild, key: keyof LawBuild) {
  return {
    ...build,
    [key]: !build[key],
  };
}

export function autoBuildFor(mission: AtlasMission): LawBuild {
  if (mission.kind === 'natural-integer') return { ...initialBuild, integerGate: true };
  if (mission.kind === 'real-umbrella') {
    return { ...initialBuild, rationalGate: true, irrationalGate: true, realUmbrella: true };
  }
  if (mission.kind === 'associative') return { ...initialBuild, leftGroup: true, rightGroup: true };
  return { ...initialBuild, xArm: true, constantArm: true };
}

export function activeSignalCount(build: LawBuild, mission: AtlasMission) {
  if (mission.kind === 'natural-integer') return Number(build.naturalGate) + Number(build.integerGate);
  if (mission.kind === 'real-umbrella') {
    return Number(build.rationalGate) + Number(build.irrationalGate) + Number(build.realUmbrella);
  }
  if (mission.kind === 'associative') return Number(build.leftGroup) + Number(build.rightGroup);
  return Number(build.xArm) + Number(build.constantArm);
}
