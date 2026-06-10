import { formatTurkishDistributiveNumber } from '../../../lib/turkishText';

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
  guideText: string;
  actionLabel: string;
}

export const CARGO_GROUPING_ATOMS = [
  { id: 'MAT.2.2.4.1', label: 'Eş grupları toplama ve çarpma ile anlatır.' },
  { id: 'MAT.2.2.4.2', label: 'Küçük çarpma işlemlerini çözer.' },
  { id: 'MAT.2.2.4.3', label: 'Kargoları eşit gruplara paylaştırır.' },
  { id: 'MAT.2.2.4.4', label: 'Aynı sayıda çıkararak kaç tur olduğunu bulur.' },
  { id: 'MAT.2.2.5.1', label: 'Çarpmada yer değişse de toplamın korunduğunu görür.' },
];

const GROUP_CASES = [
  { groups: 2, perGroup: 3 },
  { groups: 3, perGroup: 2 },
  { groups: 2, perGroup: 4 },
  { groups: 4, perGroup: 2 },
  { groups: 2, perGroup: 5 },
  { groups: 5, perGroup: 2 },
  { groups: 3, perGroup: 3 },
  { groups: 3, perGroup: 4 },
  { groups: 4, perGroup: 3 },
  { groups: 3, perGroup: 5 },
  { groups: 5, perGroup: 3 },
  { groups: 4, perGroup: 4 },
  { groups: 4, perGroup: 5 },
  { groups: 5, perGroup: 4 },
  { groups: 5, perGroup: 5 },
];

const SHARE_CASES = [
  { groups: 2, perGroup: 3 },
  { groups: 3, perGroup: 2 },
  { groups: 2, perGroup: 4 },
  { groups: 4, perGroup: 2 },
  { groups: 2, perGroup: 5 },
  { groups: 5, perGroup: 2 },
  { groups: 3, perGroup: 3 },
  { groups: 3, perGroup: 4 },
  { groups: 4, perGroup: 3 },
  { groups: 3, perGroup: 5 },
  { groups: 5, perGroup: 3 },
  { groups: 4, perGroup: 4 },
  { groups: 4, perGroup: 5 },
  { groups: 5, perGroup: 4 },
  { groups: 5, perGroup: 5 },
];

const SWAP_CASES = [
  { groups: 2, perGroup: 3 },
  { groups: 3, perGroup: 2 },
  { groups: 2, perGroup: 4 },
  { groups: 4, perGroup: 2 },
  { groups: 2, perGroup: 5 },
  { groups: 5, perGroup: 2 },
  { groups: 3, perGroup: 4 },
  { groups: 4, perGroup: 3 },
  { groups: 3, perGroup: 5 },
  { groups: 5, perGroup: 3 },
  { groups: 4, perGroup: 5 },
  { groups: 5, perGroup: 4 },
];

const COLORS = ['#22D3EE', '#34D399', '#FACC15', '#FB7185', '#A78BFA'];

export function createCargoGroupingTasks(seed = Math.floor(Math.random() * 1000)): CargoTask[] {
  const shortcut = pickBySeed(GROUP_CASES, seed);
  const multiply = pickBySeed(GROUP_CASES, seed + 1);
  const share = pickBySeed(SHARE_CASES, seed + 2);
  const subtract = pickBySeed(SHARE_CASES, seed + 3);
  const swap = pickBySeed(SWAP_CASES, seed + 4);

  const tasks: CargoTask[] = [
    {
      id: `shortcut-${shortcut.groups}-${shortcut.perGroup}`,
      kind: 'shortcut',
      title: 'Çarpma kartını seç',
      prompt: `${shortcut.groups} kutu var. Her kutuda ${shortcut.perGroup} kargo var. Hangi çarpma işlemi bunu anlatır?`,
      choices: unique([
        `${shortcut.groups} x ${shortcut.perGroup}`,
        `${shortcut.groups} + ${shortcut.perGroup}`,
        `${shortcut.perGroup} + ${shortcut.perGroup}`,
        `${shortcut.groups} + ${shortcut.groups}`,
      ]),
      answer: `${shortcut.groups} x ${shortcut.perGroup}`,
      hint: 'Önce kutu sayısını, sonra her kutudaki kargo sayısını düşün.',
      successText: 'Eş grupları çarpma işlemiyle anlattın.',
      atomIds: ['MAT.2.2.4.1'],
      groups: shortcut.groups,
      perGroup: shortcut.perGroup,
      total: shortcut.groups * shortcut.perGroup,
      color: COLORS[0],
      helperLabel: repeatedAddition(shortcut.groups, shortcut.perGroup),
      guideText: 'Her kutuda aynı sayıda kargo varsa çarpma işlemi kullanılır.',
      actionLabel: 'Kutuları say',
    },
    {
      id: `multiply-${multiply.groups}-${multiply.perGroup}`,
      kind: 'multiply',
      title: 'Toplam kargoyu bul',
      prompt: `${multiply.groups} kutuda ${formatTurkishDistributiveNumber(multiply.perGroup)} kargo var. Toplam kaç kargo var?`,
      choices: makeCargoChoices(multiply.groups * multiply.perGroup, multiply.groups),
      answer: `${multiply.groups * multiply.perGroup} kargo`,
      hint: `${multiply.groups} kutu var ve her kutuda ${multiply.perGroup} kargo duruyor.`,
      successText: 'Kargo toplamını doğru buldun.',
      atomIds: ['MAT.2.2.4.2'],
      groups: multiply.groups,
      perGroup: multiply.perGroup,
      total: multiply.groups * multiply.perGroup,
      color: COLORS[1],
      helperLabel: `${multiply.groups} x ${multiply.perGroup}`,
      guideText: 'Kutu sayısı ile bir kutudaki kargo sayısını birlikte düşün.',
      actionLabel: 'Toplamı bul',
    },
    {
      id: `share-${share.groups}-${share.perGroup}`,
      kind: 'share',
      title: 'Eşit paylaştır',
      prompt: `${share.groups * share.perGroup} kargoyu ${share.groups} robota eşit paylaştır. Her robota kaç kargo düşer?`,
      choices: makeCargoChoices(share.perGroup, 1),
      answer: `${share.perGroup} kargo`,
      hint: 'Her robotun kutusu aynı dolmalı.',
      successText: 'Kargoları eşit paylaştırdın.',
      atomIds: ['MAT.2.2.4.3'],
      groups: share.groups,
      perGroup: share.perGroup,
      total: share.groups * share.perGroup,
      color: COLORS[2],
      helperLabel: `${share.groups * share.perGroup} kargo, ${share.groups} robot`,
      guideText: 'Paylaştırırken her robotta aynı sayıda kargo olmalı.',
      actionLabel: 'Eşit paylaştır',
    },
    {
      id: `subtract-${subtract.groups}-${subtract.perGroup}`,
      kind: 'subtract',
      title: 'Kaç turda biter?',
      prompt: `${subtract.groups * subtract.perGroup} kargo var. Her turda ${subtract.perGroup} kargo çıkarırsak kaç tur gerekir?`,
      choices: makeRoundChoices(subtract.groups),
      answer: `${subtract.groups} tur`,
      hint: `Her turda aynı sayı, yani ${subtract.perGroup} kargo azalır.`,
      successText: 'Aynı sayıda çıkararak tur sayısını buldun.',
      atomIds: ['MAT.2.2.4.4'],
      groups: subtract.groups,
      perGroup: subtract.perGroup,
      total: subtract.groups * subtract.perGroup,
      color: COLORS[3],
      helperLabel: subtractionTrail(subtract.groups, subtract.perGroup),
      guideText: 'Her turda aynı kadar çıkar; kaç tur yaptığını say.',
      actionLabel: 'Turları say',
    },
    {
      id: `swap-${swap.groups}-${swap.perGroup}`,
      kind: 'swap',
      title: 'Dizilişi çevir',
      prompt: `${swap.groups} x ${swap.perGroup} ile ${swap.perGroup} x ${swap.groups} aynı sayıda kargo verir mi?`,
      choices: unique([
        `Evet, ikisi de ${swap.groups * swap.perGroup} kargo`,
        `Hayır, ilki ${swap.groups + swap.perGroup} kargo`,
        `Hayır, ikincisi ${Math.max(1, swap.groups * swap.perGroup - swap.groups)} kargo`,
      ]),
      answer: `Evet, ikisi de ${swap.groups * swap.perGroup} kargo`,
      hint: 'Diziliş değişir ama kargo sayısı değişmez.',
      successText: 'Diziliş değişse de toplamın değişmediğini gördün.',
      atomIds: ['MAT.2.2.5.1'],
      groups: swap.groups,
      perGroup: swap.perGroup,
      total: swap.groups * swap.perGroup,
      color: COLORS[4],
      helperLabel: `${swap.groups} x ${swap.perGroup} = ${swap.perGroup} x ${swap.groups}`,
      guideText: 'Diziliş değiştiğinde kargo sayısı değişiyor mu, modeli karşılaştır.',
      actionLabel: 'İki modeli karşılaştır',
    },
  ];

  return tasks.map((task) => ({ ...task, choices: shuffle(task.choices) }));
}

function repeatedAddition(groups: number, perGroup: number): string {
  return Array.from({ length: groups }, () => String(perGroup)).join(' + ');
}

function subtractionTrail(groups: number, perGroup: number): string {
  const total = groups * perGroup;
  return Array.from({ length: groups + 1 }, (_, index) => total - index * perGroup).join(' -> ');
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
