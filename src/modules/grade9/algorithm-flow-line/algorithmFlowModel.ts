import type { FlowBlock, FlowBlockId, FlowBuild, FlowMission } from './types';

export const MODULE_ID = 'algorithm-flow-line';
export const atomIds = ['MAT.9.3.1.1'];
export const maxSlotCount = 4;

export const flowBlocks: Record<FlowBlockId, FlowBlock> = {
  'add-students': {
    id: 'add-students',
    label: '18 + 24 topla',
    shortLabel: 'topla',
    detail: 'Toplam öğrenci sayısını bul.',
    tone: 'cyan',
  },
  'divide-teams': {
    id: 'divide-teams',
    label: '6 kişiye böl',
    shortLabel: 'böl',
    detail: 'Takım başına 6 kişi düşsün.',
    tone: 'green',
  },
  'seal-teams': {
    id: 'seal-teams',
    label: 'takım sayısını yaz',
    shortLabel: 'mühür',
    detail: 'Sonucu problem cümlesine çevir.',
    tone: 'purple',
  },
  'multiply-books': {
    id: 'multiply-books',
    label: '3 x 18 hesapla',
    shortLabel: 'çarp',
    detail: 'Üç kitabın toplam fiyatını bul.',
    tone: 'cyan',
  },
  'subtract-budget': {
    id: 'subtract-budget',
    label: '80 TL’den çıkar',
    shortLabel: 'çıkar',
    detail: 'Harcamayı bütçeden düş.',
    tone: 'green',
  },
  'seal-money': {
    id: 'seal-money',
    label: 'kalan parayı yaz',
    shortLabel: 'mühür',
    detail: 'Kalan miktarı sonuçlandır.',
    tone: 'purple',
  },
  'add-scores': {
    id: 'add-scores',
    label: 'puanları topla',
    shortLabel: 'topla',
    detail: 'Tüm deneme puanlarını birleştir.',
    tone: 'cyan',
  },
  'divide-average': {
    id: 'divide-average',
    label: '4 denemeye böl',
    shortLabel: 'ortalama',
    detail: 'Aritmetik ortalamayı üret.',
    tone: 'green',
  },
  'compare-threshold': {
    id: 'compare-threshold',
    label: '70 barajıyla karşılaştır',
    shortLabel: 'karşılaştır',
    detail: 'Ortalama hedefi geçiyor mu?',
    tone: 'amber',
  },
  'student-ticket': {
    id: 'student-ticket',
    label: '12 öğrenci biletini hesapla',
    shortLabel: 'öğrenci',
    detail: 'Öğrenci maliyetini ayrı bul.',
    tone: 'cyan',
  },
  'teacher-ticket': {
    id: 'teacher-ticket',
    label: '2 öğretmen biletini hesapla',
    shortLabel: 'öğretmen',
    detail: 'Öğretmen maliyetini ayrı bul.',
    tone: 'green',
  },
  'add-cost': {
    id: 'add-cost',
    label: 'iki maliyeti topla',
    shortLabel: 'toplam',
    detail: 'Toplam bilet maliyetini oluştur.',
    tone: 'purple',
  },
  'budget-decision': {
    id: 'budget-decision',
    label: '250 TL bütçeyle karar ver',
    shortLabel: 'karar',
    detail: 'Bütçe yetiyor mu?',
    tone: 'amber',
  },
  'guess-result': {
    id: 'guess-result',
    label: 'doğrudan tahmin et',
    shortLabel: 'tahmin',
    detail: 'İşlem sırasını kurmadan sonuca atlar.',
    tone: 'pink',
  },
  'skip-model': {
    id: 'skip-model',
    label: 'modeli atla',
    shortLabel: 'atla',
    detail: 'Verilenleri akışa dönüştürmez.',
    tone: 'pink',
  },
  'mix-units': {
    id: 'mix-units',
    label: 'birimleri karıştır',
    shortLabel: 'karıştır',
    detail: 'Kişi, TL ve puanı aynı hatta koyar.',
    tone: 'pink',
  },
};

export const flowMissions: FlowMission[] = [
  {
    id: 'team-flow',
    title: 'Takım Sayısı Akışı',
    atomId: 'MAT.9.3.1.1',
    story: '9-A’da 18, 9-B’de 24 öğrenci var. Her takım 6 kişilik olacak.',
    question: 'Kaç takım kurulur?',
    target: ['add-students', 'divide-teams', 'seal-teams'],
    available: ['divide-teams', 'add-students', 'guess-result', 'seal-teams'],
    success: 'Akış doğru: önce toplam öğrenci, sonra takım bölmesi, en son sonuç cümlesi.',
    error: 'Akış sırası karıştı. Problem önce verilenleri birleştirir, sonra işlem uygular.',
    resultLabel: '7 takım',
    hint: 'Veriler aynı türdeyse önce birleştir, sonra hedefe göre böl.',
  },
  {
    id: 'money-flow',
    title: 'Kalan Para Akışı',
    atomId: 'MAT.9.3.1.1',
    story: 'Elif’in 80 TL’si var. Tanesi 18 TL olan 3 kitap alıyor.',
    question: 'Elif’in kaç TL’si kalır?',
    target: ['multiply-books', 'subtract-budget', 'seal-money'],
    available: ['subtract-budget', 'mix-units', 'multiply-books', 'seal-money'],
    success: 'Akış doğru: önce harcama üretildi, sonra bütçeden çıkarıldı.',
    error: 'Harcama belli olmadan bütçeden doğru çıkarma yapılamaz.',
    resultLabel: '26 TL',
    hint: 'Önce tekrar eden fiyatı toplam harcamaya dönüştür.',
  },
  {
    id: 'average-flow',
    title: 'Ortalama Puan Akışı',
    atomId: 'MAT.9.3.1.1',
    story: 'Deneme puanları 64, 72, 80 ve 76. Hedef ortalama en az 70.',
    question: 'Hedef aşılıyor mu?',
    target: ['add-scores', 'divide-average', 'compare-threshold'],
    available: ['divide-average', 'add-scores', 'compare-threshold', 'skip-model'],
    success: 'Akış doğru: toplam puan ortalamaya döndü, sonra barajla karşılaştırıldı.',
    error: 'Karşılaştırma son adımdır; ortalama üretilmeden baraj okunamaz.',
    resultLabel: '73; hedef aşılır',
    hint: 'Ortalama için önce bütün puanlar toplanır.',
  },
  {
    id: 'ticket-flow',
    title: 'Gezi Bütçesi Akışı',
    atomId: 'MAT.9.3.1.1',
    story: '12 öğrenci bileti 15 TL, 2 öğretmen bileti 20 TL. Toplam bütçe 250 TL.',
    question: 'Bütçe geziye yeter mi?',
    target: ['student-ticket', 'teacher-ticket', 'add-cost', 'budget-decision'],
    available: ['teacher-ticket', 'budget-decision', 'student-ticket', 'add-cost', 'guess-result'],
    success: 'Akış doğru: iki maliyet ayrı kuruldu, toplandı ve bütçeyle karşılaştırıldı.',
    error: 'Bütçe kararı en sonda gelir; önce iki maliyetin toplamı kurulmalı.',
    resultLabel: '220 TL; bütçe yeter',
    hint: 'Farklı bilet türleri önce ayrı hesaplanır.',
  },
];

export function initialBuildFor(mission: FlowMission): FlowBuild {
  return {
    slots: Array.from({ length: mission.target.length }, () => null),
  };
}

export function selectedBlockIds(build: FlowBuild): FlowBlockId[] {
  return build.slots.filter((slot): slot is FlowBlockId => slot !== null);
}

export function hasBlock(build: FlowBuild, blockId: FlowBlockId): boolean {
  return selectedBlockIds(build).includes(blockId);
}

export function placeBlock(build: FlowBuild, blockId: FlowBlockId): FlowBuild {
  if (hasBlock(build, blockId)) return build;
  const emptyIndex = build.slots.findIndex((slot) => slot === null);
  if (emptyIndex < 0) return build;
  return {
    slots: build.slots.map((slot, index) => (index === emptyIndex ? blockId : slot)),
  };
}

export function removeSlot(build: FlowBuild, index: number): FlowBuild {
  const nextSlots = [...build.slots];
  nextSlots[index] = null;
  const compacted = nextSlots.filter((slot): slot is FlowBlockId => slot !== null);
  const emptySlots: (FlowBlockId | null)[] = Array.from({ length: build.slots.length - compacted.length }, () => null);
  return {
    slots: [...compacted, ...emptySlots],
  };
}

export function buildMatches(build: FlowBuild, mission: FlowMission): boolean {
  return mission.target.every((blockId, index) => build.slots[index] === blockId);
}

export function completedSlotCount(build: FlowBuild): number {
  return build.slots.filter(Boolean).length;
}

export function flowLabel(build: FlowBuild): string {
  const count = completedSlotCount(build);
  return count === 0 ? 'akış bekliyor' : `${count}/${build.slots.length} blok`;
}
