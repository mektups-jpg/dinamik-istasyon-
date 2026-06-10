export type CargoTaskKind = 'shortcut' | 'multiply' | 'share' | 'subtract' | 'swap';

export interface CargoTask {
  id: string;
  kind: CargoTaskKind;
  title: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
  successText: string;
  atomIds: string[];
  groups: number;
  perGroup: number;
  total: number;
  color: string;
  helperLabel: string;
}

export const CARGO_GROUPING_ATOMS = [
  { id: 'MAT.2.2.4.1', label: 'Tekrarlı toplamanın çarpma kısa yolu olduğunu onaylar.' },
  { id: 'MAT.2.2.4.2', label: '1-5 arası çarpım işlemlerini yapar.' },
  { id: 'MAT.2.2.4.3', label: 'Nesneleri eşit gruplara paylaştırarak bölmeyi simüle eder.' },
  { id: 'MAT.2.2.4.4', label: 'Ardışık çıkarma adımlarının bölme kısa yolu olduğunu kanıtlar.' },
  { id: 'MAT.2.2.5.1', label: 'Çarpmada yer değişse de sonucun aynı kaldığını test eder.' },
];

const GROUP_CASES = [
  { groups: 3, perGroup: 4 },
  { groups: 4, perGroup: 3 },
  { groups: 2, perGroup: 5 },
  { groups: 5, perGroup: 2 },
];

const SHARE_CASES = [
  { groups: 3, perGroup: 4 },
  { groups: 4, perGroup: 5 },
  { groups: 5, perGroup: 3 },
  { groups: 2, perGroup: 5 },
];

const COLORS = ['#22D3EE', '#34D399', '#FACC15', '#FB7185', '#A78BFA'];

export function createCargoGroupingTasks(seed = Math.floor(Math.random() * 1000)): CargoTask[] {
  const shortcut = pickBySeed(GROUP_CASES, seed);
  const multiply = pickBySeed(GROUP_CASES, seed + 1);
  const share = pickBySeed(SHARE_CASES, seed + 2);
  const subtract = pickBySeed(SHARE_CASES, seed + 3);
  const swap = pickBySeed(GROUP_CASES, seed + 4);

  const tasks: CargoTask[] = [
    {
      id: `shortcut-${shortcut.groups}-${shortcut.perGroup}`,
      kind: 'shortcut',
      title: 'Kısa yolu seç',
      prompt: `${shortcut.groups} dronun her birinde ${shortcut.perGroup} kargo var. Bu hangi kısa işlem?`,
      choices: unique([
        `${shortcut.groups} x ${shortcut.perGroup}`,
        `${shortcut.groups} + ${shortcut.perGroup}`,
        `${shortcut.perGroup} + ${shortcut.perGroup}`,
        `${shortcut.groups} + ${shortcut.groups}`,
      ]),
      answer: `${shortcut.groups} x ${shortcut.perGroup}`,
      hint: 'Aynı sayı tekrar ediyorsa grup sayısı ile bir gruptaki sayıyı çarparız.',
      successText: 'Tekrarlı toplamayı çarpma kısa yoluna çevirdin.',
      atomIds: ['MAT.2.2.4.1'],
      groups: shortcut.groups,
      perGroup: shortcut.perGroup,
      total: shortcut.groups * shortcut.perGroup,
      color: COLORS[0],
      helperLabel: repeatedAddition(shortcut.groups, shortcut.perGroup),
    },
    {
      id: `multiply-${multiply.groups}-${multiply.perGroup}`,
      kind: 'multiply',
      title: 'Toplam kargoyu bul',
      prompt: `${multiply.groups} sıra var. Her sırada ${multiply.perGroup} kargo duruyor. Toplam kaç kargo?`,
      choices: makeCargoChoices(multiply.groups * multiply.perGroup, multiply.groups),
      answer: `${multiply.groups * multiply.perGroup} kargo`,
      hint: `${multiply.groups} grup ve her grupta ${multiply.perGroup} kargo var.`,
      successText: 'Kargo toplamını doğru buldun.',
      atomIds: ['MAT.2.2.4.2'],
      groups: multiply.groups,
      perGroup: multiply.perGroup,
      total: multiply.groups * multiply.perGroup,
      color: COLORS[1],
      helperLabel: `${multiply.groups} x ${multiply.perGroup}`,
    },
    {
      id: `share-${share.groups}-${share.perGroup}`,
      kind: 'share',
      title: 'Eşit paylaştır',
      prompt: `${share.groups * share.perGroup} kargoyu ${share.groups} robota eşit paylaştır. Her robot kaç kargo alır?`,
      choices: makeCargoChoices(share.perGroup, 1),
      answer: `${share.perGroup} kargo`,
      hint: 'Her robotun kutusu aynı dolmalı.',
      successText: 'Kargoları eşit paylaştırdın.',
      atomIds: ['MAT.2.2.4.3'],
      groups: share.groups,
      perGroup: share.perGroup,
      total: share.groups * share.perGroup,
      color: COLORS[2],
      helperLabel: `${share.groups * share.perGroup} kargo -> ${share.groups} robot`,
    },
    {
      id: `subtract-${subtract.groups}-${subtract.perGroup}`,
      kind: 'subtract',
      title: 'Kaç turda biter?',
      prompt: `${subtract.groups * subtract.perGroup} kargo var. Her turda ${subtract.perGroup} kargo indirilirse kaç tur sürer?`,
      choices: makeRoundChoices(subtract.groups),
      answer: `${subtract.groups} tur`,
      hint: `Her turda ${subtract.perGroup} kargo azalır.`,
      successText: 'Ardışık çıkarmanın bölme olduğunu gördün.',
      atomIds: ['MAT.2.2.4.4'],
      groups: subtract.groups,
      perGroup: subtract.perGroup,
      total: subtract.groups * subtract.perGroup,
      color: COLORS[3],
      helperLabel: subtractionTrail(subtract.groups, subtract.perGroup),
    },
    {
      id: `swap-${swap.groups}-${swap.perGroup}`,
      kind: 'swap',
      title: 'Yer değiştir, toplamı koru',
      prompt: `${swap.groups} x ${swap.perGroup} ile ${swap.perGroup} x ${swap.groups} aynı toplamı verir mi?`,
      choices: unique([
        `İkisi de ${swap.groups * swap.perGroup} kargo`,
        `İlki ${swap.groups + swap.perGroup} kargo`,
        `İkincisi ${Math.max(1, swap.groups * swap.perGroup - swap.groups)} kargo`,
      ]),
      answer: `İkisi de ${swap.groups * swap.perGroup} kargo`,
      hint: 'Diziliş değişir ama kargo sayısı değişmez.',
      successText: 'Yer değişse de toplamın korunduğunu test ettin.',
      atomIds: ['MAT.2.2.5.1'],
      groups: swap.groups,
      perGroup: swap.perGroup,
      total: swap.groups * swap.perGroup,
      color: COLORS[4],
      helperLabel: `${swap.groups} x ${swap.perGroup} = ${swap.perGroup} x ${swap.groups}`,
    },
  ];

  return tasks.map((task) => ({ ...task, choices: shuffle(task.choices) }));
}

function repeatedAddition(groups: number, perGroup: number): string {
  return Array.from({ length: groups }, () => String(perGroup)).join(' + ');
}

function subtractionTrail(groups: number, perGroup: number): string {
  const total = groups * perGroup;
  return `${total} - ${perGroup} - ${perGroup} ...`;
}

function makeCargoChoices(answer: number, gap: number): string[] {
  return shuffle(unique([
    answer,
    Math.max(1, answer - gap),
    answer + gap,
  ])).map((value) => `${value} kargo`);
}

function makeRoundChoices(answer: number): string[] {
  return shuffle(unique([
    answer,
    Math.max(1, answer - 1),
    answer + 1,
  ])).map((value) => `${value} tur`);
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
