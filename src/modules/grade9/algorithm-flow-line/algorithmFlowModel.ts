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
    label: 'sonuç cümlesi kur',
    shortLabel: 'sonuç',
    detail: 'İşlemden çıkan sayıyı cümleye çevir.',
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
    label: 'sonuç cümlesi kur',
    shortLabel: 'sonuç',
    detail: 'Kalan parayı cümleye çevir.',
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
    label: 'öğrenci biletlerini hesapla',
    shortLabel: 'öğrenci',
    detail: '12 x 15 TL maliyetini bul.',
    tone: 'cyan',
  },
  'teacher-ticket': {
    id: 'teacher-ticket',
    label: 'öğretmen biletlerini hesapla',
    shortLabel: 'öğretmen',
    detail: '2 x 20 TL maliyetini bul.',
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
    label: '250 TL bütçeyle karşılaştır',
    shortLabel: 'karar',
    detail: 'Toplam maliyet bütçeyi aşıyor mu?',
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
    label: 'tüm sayıları topla',
    shortLabel: 'sayıları topla',
    detail: 'Fiyat, adet ve bütçeyi ayırmadan toplar.',
    tone: 'pink',
  },
};

export function getFlowBlock(blockId: FlowBlockId, mission?: FlowMission): FlowBlock {
  return {
    ...flowBlocks[blockId],
    ...mission?.blockOverrides?.[blockId],
  };
}

interface TeamCase {
  firstClass: string;
  firstCount: number;
  secondClass: string;
  secondCount: number;
  teamSize: number;
}

interface MoneyCase {
  name: string;
  budget: number;
  count: number;
  item: string;
  itemPossessive: string;
  price: number;
}

interface AverageCase {
  scores: number[];
  threshold: number;
}

interface TicketCase {
  studentCount: number;
  teacherCount: number;
  studentPrice: number;
  teacherPrice: number;
  budget: number;
}

interface PracticeSet {
  team: TeamCase;
  money: MoneyCase;
  average: AverageCase;
  ticket: TicketCase;
}

const practiceSets: PracticeSet[] = [
  {
    team: { firstClass: '9-A', firstCount: 18, secondClass: '9-B', secondCount: 24, teamSize: 6 },
    money: { name: 'Elif', budget: 80, count: 3, item: 'kitap', itemPossessive: 'kitabın', price: 18 },
    average: { scores: [64, 72, 80, 76], threshold: 70 },
    ticket: { studentCount: 12, teacherCount: 2, studentPrice: 15, teacherPrice: 20, budget: 250 },
  },
  {
    team: { firstClass: '9-C', firstCount: 16, secondClass: '9-D', secondCount: 20, teamSize: 4 },
    money: { name: 'Mert', budget: 100, count: 4, item: 'defter', itemPossessive: 'defterin', price: 15 },
    average: { scores: [58, 66, 70, 74], threshold: 70 },
    ticket: { studentCount: 10, teacherCount: 3, studentPrice: 18, teacherPrice: 25, budget: 240 },
  },
  {
    team: { firstClass: '9-E', firstCount: 21, secondClass: '9-F', secondCount: 27, teamSize: 6 },
    money: { name: 'Zeynep', budget: 90, count: 2, item: 'sözlük', itemPossessive: 'sözlüğün', price: 24 },
    average: { scores: [72, 78, 84, 86], threshold: 75 },
    ticket: { studentCount: 14, teacherCount: 2, studentPrice: 12, teacherPrice: 30, budget: 230 },
  },
  {
    team: { firstClass: '9-G', firstCount: 15, secondClass: '9-H', secondCount: 30, teamSize: 5 },
    money: { name: 'Deniz', budget: 120, count: 5, item: 'kalem seti', itemPossessive: 'kalem setinin', price: 16 },
    average: { scores: [60, 64, 68, 72], threshold: 68 },
    ticket: { studentCount: 8, teacherCount: 2, studentPrice: 20, teacherPrice: 35, budget: 240 },
  },
];

export const FLOW_MISSION_SET_COUNT = practiceSets.length;

function buildTeamMission(team: TeamCase): FlowMission {
  const totalStudents = team.firstCount + team.secondCount;
  const result = totalStudents / team.teamSize;

  return {
    id: 'team-flow',
    title: 'Takım Sayısı Akışı',
    atomId: 'MAT.9.3.1.1',
    story: `${team.firstClass} sınıfında ${team.firstCount}, ${team.secondClass} sınıfında ${team.secondCount} öğrenci var. Her takım ${team.teamSize} kişilik olacak.`,
    question: 'Kaç takım kurulur?',
    target: ['add-students', 'divide-teams'],
    available: ['add-students', 'divide-teams', 'guess-result'],
    success: 'Akış doğru: önce toplam öğrenci bulundu, sonra eşit takımlara ayrıldı.',
    error: 'Akış sırası karıştı. Problem önce verilenleri birleştirir, sonra işlem uygular.',
    resultLabel: `${result} takım`,
    hint: 'Veriler aynı türdeyse önce birleştir, sonra hedefe göre böl.',
    blockOverrides: {
      'add-students': {
        label: `${team.firstCount} + ${team.secondCount} topla`,
        detail: 'Toplam öğrenci sayısını bul.',
      },
      'divide-teams': {
        label: `${team.teamSize} kişiye böl`,
        detail: `Takım başına ${team.teamSize} kişi düşsün.`,
      },
    },
  };
}

function buildMoneyMission(money: MoneyCase): FlowMission {
  const totalCost = money.count * money.price;
  const remaining = money.budget - totalCost;

  return {
    id: 'money-flow',
    title: 'Kalan Para Akışı',
    atomId: 'MAT.9.3.1.1',
    story: `${money.name}’in ${money.budget} TL’si var. Tanesi ${money.price} TL olan ${money.count} ${money.item} alıyor.`,
    question: `${money.name}’in kaç TL’si kalır?`,
    target: ['multiply-books', 'subtract-budget', 'seal-money'],
    available: ['subtract-budget', 'mix-units', 'multiply-books', 'seal-money'],
    success: 'Akış doğru: önce harcama üretildi, sonra bütçeden çıkarıldı.',
    error: 'Harcama belli olmadan bütçeden doğru çıkarma yapılamaz.',
    resultLabel: `${remaining} TL`,
    hint: 'Önce tekrar eden fiyatı toplam harcamaya dönüştür.',
    blockOverrides: {
      'multiply-books': {
        label: `${money.count} x ${money.price} hesapla`,
        detail: `${money.count} ${money.itemPossessive} toplam fiyatını bul.`,
      },
      'subtract-budget': {
        label: `${money.budget} TL’den çıkar`,
        detail: 'Harcamayı bütçeden düş.',
      },
    },
  };
}

function buildAverageMission(averageCase: AverageCase): FlowMission {
  const totalScore = averageCase.scores.reduce((total, score) => total + score, 0);
  const average = totalScore / averageCase.scores.length;
  const passes = average >= averageCase.threshold;

  return {
    id: 'average-flow',
    title: 'Ortalama Puan Akışı',
    atomId: 'MAT.9.3.1.1',
    story: `Deneme puanları ${averageCase.scores.join(', ')}. Hedef ortalama en az ${averageCase.threshold}.`,
    question: 'Hedef aşılıyor mu?',
    target: ['add-scores', 'divide-average', 'compare-threshold'],
    available: ['divide-average', 'add-scores', 'compare-threshold', 'skip-model'],
    success: 'Akış doğru: toplam puan ortalamaya döndü, sonra barajla karşılaştırıldı.',
    error: 'Karşılaştırma son adımdır; ortalama üretilmeden baraj okunamaz.',
    resultLabel: `${average}; hedef ${passes ? 'aşılır' : 'aşılmaz'}`,
    hint: 'Ortalama için önce bütün puanlar toplanır.',
    blockOverrides: {
      'divide-average': {
        label: `${averageCase.scores.length} denemeye böl`,
        detail: 'Aritmetik ortalamayı üret.',
      },
      'compare-threshold': {
        label: `${averageCase.threshold} barajıyla karşılaştır`,
        detail: 'Ortalama hedefi geçiyor mu?',
      },
    },
  };
}

function buildTicketMission(ticket: TicketCase): FlowMission {
  const studentCost = ticket.studentCount * ticket.studentPrice;
  const teacherCost = ticket.teacherCount * ticket.teacherPrice;
  const totalCost = studentCost + teacherCost;
  const enough = totalCost <= ticket.budget;

  return {
    id: 'ticket-flow',
    title: 'Gezi Bütçesi Akışı',
    atomId: 'MAT.9.3.1.1',
    story: `Geziye ${ticket.studentCount} öğrenci ve ${ticket.teacherCount} öğretmen katılıyor. Öğrenci bileti ${ticket.studentPrice} TL, öğretmen bileti ${ticket.teacherPrice} TL. Toplam bütçe ${ticket.budget} TL.`,
    question: 'Bütçe geziye yeter mi?',
    target: ['student-ticket', 'teacher-ticket', 'add-cost', 'budget-decision'],
    available: ['teacher-ticket', 'budget-decision', 'student-ticket', 'add-cost', 'guess-result'],
    success: 'Akış doğru: iki maliyet ayrı kuruldu, toplandı ve bütçeyle karşılaştırıldı.',
    error: 'Bütçe kararı en sonda gelir; önce iki maliyetin toplamı kurulmalı.',
    resultLabel: `${totalCost} TL; bütçe ${enough ? 'yeter' : 'yetmez'}`,
    hint: 'Farklı bilet türleri önce ayrı hesaplanır.',
    blockOverrides: {
      'student-ticket': {
        label: `${ticket.studentCount} öğrenci biletini hesapla`,
        detail: `${ticket.studentCount} x ${ticket.studentPrice} TL maliyetini bul.`,
      },
      'teacher-ticket': {
        label: `${ticket.teacherCount} öğretmen biletini hesapla`,
        detail: `${ticket.teacherCount} x ${ticket.teacherPrice} TL maliyetini bul.`,
      },
      'budget-decision': {
        label: `${ticket.budget} TL bütçeyle karşılaştır`,
        detail: 'Toplam maliyet bütçeyi aşıyor mu?',
      },
    },
  };
}

export const flowMissionSets: FlowMission[][] = practiceSets.map((practiceSet) => [
  buildTeamMission(practiceSet.team),
  buildMoneyMission(practiceSet.money),
  buildAverageMission(practiceSet.average),
  buildTicketMission(practiceSet.ticket),
]);

export const flowMissions = flowMissionSets[0];

export function getFlowMissions(missionSetIndex: number): FlowMission[] {
  return flowMissionSets[((missionSetIndex % FLOW_MISSION_SET_COUNT) + FLOW_MISSION_SET_COUNT) % FLOW_MISSION_SET_COUNT];
}

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
  return {
    slots: build.slots.map((slot, slotIndex) => (slotIndex >= index ? null : slot)),
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
