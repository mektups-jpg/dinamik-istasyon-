import type { Quantifier, QuantifierMission, RadarBuild, RadarElementId } from './types';

export const MODULE_ID = 'quantifier-radar-hunt';

export const atomIds = ['MAT.9.3.3.1', 'MAT.9.3.3.2'];

export const quantifierLabels: Record<Quantifier, { symbol: string; label: string; short: string }> = {
  all: { symbol: '∀', label: 'Her', short: 'evrensel' },
  some: { symbol: '∃', label: 'Bazı', short: 'varlıksal' },
};

export const radarMissions: QuantifierMission[] = [
  {
    id: 'all-even',
    title: 'Çift Sayı Kümesi',
    atomId: 'MAT.9.3.3.1',
    setLabel: 'A = {2, 4, 6, 8}',
    condition: '2 ile tam bölünür',
    prompt: 'Kümedeki bütün elemanların aynı koşulu sağladığını sınayan niceleyiciyi kur.',
    quantifier: 'all',
    elements: [
      { id: 'even-2', label: '2', detail: '2 ile bölünür', matches: true, x: 24, y: 34 },
      { id: 'even-4', label: '4', detail: '2 ile bölünür', matches: true, x: 45, y: 66 },
      { id: 'even-6', label: '6', detail: '2 ile bölünür', matches: true, x: 66, y: 32 },
      { id: 'even-8', label: '8', detail: '2 ile bölünür', matches: true, x: 76, y: 68 },
    ],
    resultLabel: 'Her eleman koşulu sağladı',
    success: 'Evrensel tarama tamam: kümedeki her eleman koşuldan geçti.',
    error: 'Her niceleyicisi için bütün küme elemanları tek tek taranmalı.',
    hint: 'Her deniyorsa geride kontrol edilmemiş eleman kalmaz.',
  },
  {
    id: 'some-prime',
    title: 'Asal Kanıtı',
    atomId: 'MAT.9.3.3.2',
    setLabel: 'B = {4, 6, 7, 9}',
    condition: 'asal sayıdır',
    prompt: 'Kümede en az bir elemanın koşulu sağladığını gösteren niceleyiciyi kur.',
    quantifier: 'some',
    elements: [
      { id: 'prime-4', label: '4', detail: 'asal değil', matches: false, x: 25, y: 62 },
      { id: 'prime-6', label: '6', detail: 'asal değil', matches: false, x: 42, y: 32 },
      { id: 'prime-7', label: '7', detail: 'asal', matches: true, x: 62, y: 58 },
      { id: 'prime-9', label: '9', detail: 'asal değil', matches: false, x: 78, y: 35 },
    ],
    resultLabel: 'Bazı elemanlar koşulu sağladı',
    success: 'Varlıksal kanıt yakalandı: en az bir uygun eleman bulundu.',
    error: 'Bazı için koşulu sağlayan en az bir gerçek kanıt seçilmeli.',
    hint: 'Bazı deniyorsa tek doğru kanıt bile cümleyi doğru yapar.',
  },
  {
    id: 'all-angle-sum',
    title: 'Üçgen Açı Kontrolü',
    atomId: 'MAT.9.3.3.1',
    setLabel: 'T = {Üçgen A, Üçgen B, Üçgen C}',
    condition: 'iç açı toplamı 180°',
    prompt: 'Aynı koşulu her üçgen modeli üzerinde doğrulayan niceleyiciyi kur.',
    quantifier: 'all',
    elements: [
      { id: 'angle-a', label: 'A', detail: '180°', matches: true, x: 28, y: 37 },
      { id: 'angle-b', label: 'B', detail: '180°', matches: true, x: 50, y: 67 },
      { id: 'angle-c', label: 'C', detail: '180°', matches: true, x: 72, y: 37 },
    ],
    resultLabel: 'Her üçgen 180° verdi',
    success: 'Bütün üçgen modelleri geçti; evrensel niceleyici doğru çalıştı.',
    error: 'Her cümlesi için yalnız bir örnek yetmez; bütün modeller taranmalı.',
    hint: 'Her koşulu kanıtlamak için setin tüm üyeleri işaretlenir.',
  },
  {
    id: 'some-quadrilateral',
    title: 'Dörtgen Avı',
    atomId: 'MAT.9.3.3.2',
    setLabel: 'C = {üçgen, kare, beşgen, dikdörtgen}',
    condition: 'dörtgendir',
    prompt: 'Kümede bu koşulu sağlayan en az bir şekil olduğunu gösteren niceleyiciyi kur.',
    quantifier: 'some',
    elements: [
      { id: 'shape-triangle', label: '△', detail: '3 kenar', matches: false, x: 24, y: 58 },
      { id: 'shape-square', label: '□', detail: '4 kenar', matches: true, x: 44, y: 34 },
      { id: 'shape-pentagon', label: '⬠', detail: '5 kenar', matches: false, x: 63, y: 66 },
      { id: 'shape-rectangle', label: '▭', detail: '4 kenar', matches: true, x: 78, y: 36 },
    ],
    resultLabel: 'Bazı şekiller dörtgendir',
    success: 'Kanıt bulundu: kümede dörtgen olan en az bir şekil var.',
    error: 'Kanıt dörtgen olmalı; üçgen veya beşgen varlıksal cümleyi taşımaz.',
    hint: 'Bazı için tüm seti değil, doğru kanıt elemanını yakalaman yeter.',
  },
];

export function initialBuild(): RadarBuild {
  return {
    quantifier: null,
    selectedIds: [],
  };
}

export function matchingElementIds(mission: QuantifierMission): RadarElementId[] {
  return mission.elements.filter((element) => element.matches).map((element) => element.id);
}

export function toggleElement(build: RadarBuild, elementId: RadarElementId): RadarBuild {
  const selected = build.selectedIds.includes(elementId);
  return {
    ...build,
    selectedIds: selected
      ? build.selectedIds.filter((id) => id !== elementId)
      : [...build.selectedIds, elementId],
  };
}

export function autoBuildFor(mission: QuantifierMission): RadarBuild {
  const matches = matchingElementIds(mission);
  return {
    quantifier: mission.quantifier,
    selectedIds: mission.quantifier === 'all' ? matches : matches.slice(0, 1),
  };
}

export function buildMatches(build: RadarBuild, mission: QuantifierMission): boolean {
  if (build.quantifier !== mission.quantifier) return false;
  const matches = matchingElementIds(mission);
  const selectedAreValid = build.selectedIds.every((id) => matches.includes(id));
  if (!selectedAreValid) return false;

  if (mission.quantifier === 'all') {
    return matches.length === build.selectedIds.length && matches.every((id) => build.selectedIds.includes(id));
  }

  return build.selectedIds.some((id) => matches.includes(id));
}

export function evidenceLabel(build: RadarBuild, mission: QuantifierMission): string {
  const matches = matchingElementIds(mission);
  if (mission.quantifier === 'all') return `${build.selectedIds.length}/${matches.length} eleman`;
  return build.selectedIds.length > 0 ? `${build.selectedIds.length} kanıt` : 'kanıt yok';
}

export function quantifierText(quantifier: Quantifier | null): string {
  if (!quantifier) return 'seçilmedi';
  const item = quantifierLabels[quantifier];
  return `${item.symbol} ${item.label}`;
}
