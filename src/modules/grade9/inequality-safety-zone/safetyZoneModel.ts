import { SafetyBuild, SafetyDirection, SafetyMission, TrackPoint } from './types';

export const MODULE_ID = 'inequality-safety-zone';
export const atomIds = ['MAT.9.2.3.2'];

export const trackConfig = {
  min: 0,
  max: 10,
  left: 92,
  right: 628,
  y: 286,
};

export const initialBuild: SafetyBuild = {
  boundary: 3,
  direction: null,
};

interface SafetyMissionSet {
  canteenPrice: number;
  canteenBudget: number;
  cargoBox: number;
  cargoBook: number;
  cargoLimit: number;
  scoreStart: number;
  scoreGain: number;
  scoreTarget: number;
  donationStart: number;
  donationGain: number;
  donationTarget: number;
}

const safetyMissionSets: SafetyMissionSet[] = [
  { canteenPrice: 5, canteenBudget: 25, cargoBox: 12, cargoBook: 8, cargoLimit: 60, scoreStart: 10, scoreGain: 3, scoreTarget: 25, donationStart: 8, donationGain: 4, donationTarget: 32 },
  { canteenPrice: 4, canteenBudget: 28, cargoBox: 18, cargoBook: 6, cargoLimit: 48, scoreStart: 12, scoreGain: 4, scoreTarget: 40, donationStart: 6, donationGain: 3, donationTarget: 24 },
  { canteenPrice: 6, canteenBudget: 24, cargoBox: 14, cargoBook: 7, cargoLimit: 56, scoreStart: 5, scoreGain: 5, scoreTarget: 30, donationStart: 10, donationGain: 5, donationTarget: 45 },
  { canteenPrice: 3, canteenBudget: 18, cargoBox: 10, cargoBook: 5, cargoLimit: 45, scoreStart: 14, scoreGain: 2, scoreTarget: 28, donationStart: 6, donationGain: 6, donationTarget: 42 },
  { canteenPrice: 7, canteenBudget: 35, cargoBox: 16, cargoBook: 4, cargoLimit: 40, scoreStart: 8, scoreGain: 6, scoreTarget: 44, donationStart: 8, donationGain: 2, donationTarget: 24 },
  { canteenPrice: 2, canteenBudget: 16, cargoBox: 9, cargoBook: 9, cargoLimit: 54, scoreStart: 4, scoreGain: 7, scoreTarget: 32, donationStart: 12, donationGain: 4, donationTarget: 40 },
  { canteenPrice: 9, canteenBudget: 27, cargoBox: 12, cargoBook: 3, cargoLimit: 36, scoreStart: 6, scoreGain: 3, scoreTarget: 30, donationStart: 7, donationGain: 7, donationTarget: 35 },
  { canteenPrice: 6, canteenBudget: 42, cargoBox: 8, cargoBook: 8, cargoLimit: 64, scoreStart: 10, scoreGain: 5, scoreTarget: 45, donationStart: 5, donationGain: 5, donationTarget: 30 },
];

export const safetyMissionSetCount = safetyMissionSets.length;

export const safetyMissions = createSafetyMissions(0);

export function pickSafetyMissionSetIndex(excludedIndexes: readonly number[] = []): number {
  if (safetyMissionSets.length <= 1) return 0;

  const allIndexes = safetyMissionSets.map((_, index) => index);
  const excludedSet = new Set(excludedIndexes.filter((index) => index >= 0 && index < safetyMissionSets.length));
  const freshCandidates = allIndexes.filter((index) => !excludedSet.has(index));
  const previousIndex = excludedIndexes[excludedIndexes.length - 1];
  const rolloverCandidates = allIndexes.filter((index) => index !== previousIndex);
  const candidates = freshCandidates.length > 0 ? freshCandidates : rolloverCandidates;

  return candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
}

export function createSafetyMissions(missionSetIndex = 0): SafetyMission[] {
  const values = safetyMissionSets[missionSetIndex] ?? safetyMissionSets[0];
  const canteenBoundary = values.canteenBudget / values.canteenPrice;
  const cargoRemaining = values.cargoLimit - values.cargoBox;
  const cargoBoundary = cargoRemaining / values.cargoBook;
  const scoreNeeded = values.scoreTarget - values.scoreStart;
  const scoreBoundary = scoreNeeded / values.scoreGain;
  const donationNeeded = values.donationTarget - values.donationStart;
  const donationBoundary = donationNeeded / values.donationGain;

  return [
    {
      id: 'canteen-budget',
      title: 'Kantin Bütçesi',
      atomId: 'MAT.9.2.3.2',
      story: `Her sandviç ${values.canteenPrice} TL. Cüzdanda ${values.canteenBudget} TL var. Bütçeyi aşmadan en fazla kaç sandviç alınabilir?`,
      model: `${values.canteenPrice}x ≤ ${values.canteenBudget}`,
      unit: 'sandviç',
      target: { boundary: canteenBoundary, direction: 'left' },
      mechanic: 'Eşitlik sınırı bulunur; bütçeyi aşmamak "en fazla" anlamına gelir.',
      ruleHint: 'En fazla durumlarında sınır dahil kalır ve çözüm bölgesi sola açılır.',
      solutionSteps: `${values.canteenPrice}x ≤ ${values.canteenBudget} ⇒ x ≤ ${canteenBoundary}`,
      success: `Bütçe alanı doğru kuruldu; ${canteenBoundary} ve daha az sandviç güvenli.`,
      error: 'Bütçe aşılmamalı; güvenli alan sınırın solunda ve sınır dahil olmalı.',
      resultLabel: `x ≤ ${canteenBoundary}`,
    },
    {
      id: 'cargo-limit',
      title: 'Kutuya En Fazla Kitap',
      atomId: 'MAT.9.2.3.2',
      story: `Boş kutu ${values.cargoBox} kg, her kitap ${values.cargoBook} kg. Toplam yük ${values.cargoLimit} kg'ı geçmeyecek. Kutuya en fazla kaç kitap konabilir?`,
      model: `${values.cargoBook}x + ${values.cargoBox} ≤ ${values.cargoLimit}`,
      unit: 'kitap',
      target: { boundary: cargoBoundary, direction: 'left' },
      mechanic: 'Önce boş kutunun ağırlığı çıkarılır; kalan ağırlık bir kitabın ağırlığına bölünür.',
      ruleHint: 'Sınırı eşitlik gibi bul; "aşmamak" dediği için çözüm bölgesi sola açılır.',
      solutionSteps: `${values.cargoBook}x + ${values.cargoBox} ≤ ${values.cargoLimit} ⇒ ${values.cargoBook}x ≤ ${cargoRemaining} ⇒ x ≤ ${cargoBoundary}`,
      success: `Kutu sınırı doğru okundu; ${cargoBoundary} ve daha az kitap güvenli.`,
      error: `Toplam yük en fazla ${values.cargoLimit} kg olmalı; bu yüzden alan sınırdan sola açılmalı.`,
      resultLabel: `x ≤ ${cargoBoundary}`,
    },
    {
      id: 'score-target',
      title: 'Puan Hedefi',
      atomId: 'MAT.9.2.3.2',
      story: `Başlangıç puanı ${values.scoreStart}. Her görev ${values.scoreGain} puan getiriyor. En az ${values.scoreTarget} puana ulaşmak için kaç görev gerekir?`,
      model: `${values.scoreGain}x + ${values.scoreStart} ≥ ${values.scoreTarget}`,
      unit: 'görev',
      target: { boundary: scoreBoundary, direction: 'right' },
      mechanic: 'Eşitlik sınırı bulunur; hedefi karşılayan daha büyük değerler de kabul edilir.',
      ruleHint: 'En az durumlarında sınır dahil kalır ve çözüm bölgesi sağa açılır.',
      solutionSteps: `${values.scoreGain}x + ${values.scoreStart} ≥ ${values.scoreTarget} ⇒ ${values.scoreGain}x ≥ ${scoreNeeded} ⇒ x ≥ ${scoreBoundary}`,
      success: `Hedef alanı doğru açıldı; ${scoreBoundary} ve daha fazla görev yeterli.`,
      error: 'En az hedeflerde güvenli alan sınırdan sağa doğru açılır.',
      resultLabel: `x ≥ ${scoreBoundary}`,
    },
    {
      id: 'donation-target',
      title: 'Bağış Hedefi',
      atomId: 'MAT.9.2.3.2',
      story: `Kasada ${values.donationStart} paket var. Her tur ${values.donationGain} paket daha geliyor. En az ${values.donationTarget} pakete ulaşmak için kaç tur gerekir?`,
      model: `${values.donationGain}x + ${values.donationStart} ≥ ${values.donationTarget}`,
      unit: 'tur',
      target: { boundary: donationBoundary, direction: 'right' },
      mechanic: 'Sabit paketler çıkarılır; kalan hedef tur başına gelen paket sayısına bölünür.',
      ruleHint: 'Sınırı eşitlik gibi bul; "en az" dediği için çözüm bölgesi sağa açılır.',
      solutionSteps: `${values.donationGain}x + ${values.donationStart} ≥ ${values.donationTarget} ⇒ ${values.donationGain}x ≥ ${donationNeeded} ⇒ x ≥ ${donationBoundary}`,
      success: `Bağış hedefi doğru kuruldu; ${donationBoundary} ve daha fazla tur yeterli.`,
      error: `En az ${values.donationTarget} paket için sınırı bulmalı ve kabul alanını sağa açmalısın.`,
      resultLabel: `x ≥ ${donationBoundary}`,
    },
  ];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function valueToX(value: number): number {
  const ratio = (value - trackConfig.min) / (trackConfig.max - trackConfig.min);
  return trackConfig.left + ratio * (trackConfig.right - trackConfig.left);
}

export function xToValue(x: number): number {
  const ratio = (clamp(x, trackConfig.left, trackConfig.right) - trackConfig.left) / (trackConfig.right - trackConfig.left);
  return Math.round(trackConfig.min + ratio * (trackConfig.max - trackConfig.min));
}

export function nudgeBoundary(build: SafetyBuild, delta: number): SafetyBuild {
  return {
    ...build,
    boundary: clamp(build.boundary + delta, trackConfig.min, trackConfig.max),
  };
}

export function buildMatches(build: SafetyBuild, target: SafetyBuild): boolean {
  return build.boundary === target.boundary && build.direction === target.direction;
}

export function getBoundaryPoint(build: SafetyBuild): TrackPoint {
  return {
    x: valueToX(build.boundary),
    y: trackConfig.y,
  };
}

export function directionSymbol(direction: SafetyDirection): string {
  return direction === 'left' ? '≤' : '≥';
}

export function directionText(direction: SafetyBuild['direction']): string {
  if (!direction) return 'yön seçilmedi';
  return direction === 'left' ? 'sol çözüm bölgesi' : 'sağ çözüm bölgesi';
}

export function buildInequalityLabel(build: SafetyBuild): string {
  if (!build.direction) return 'seçim yok';
  return `x ${directionSymbol(build.direction)} ${build.boundary}`;
}

export function zoneBounds(build: SafetyBuild): { x: number; width: number } {
  const boundaryX = valueToX(build.boundary);

  if (!build.direction) {
    return {
      x: boundaryX,
      width: 0,
    };
  }

  if (build.direction === 'left') {
    return {
      x: trackConfig.left,
      width: boundaryX - trackConfig.left,
    };
  }

  return {
    x: boundaryX,
    width: trackConfig.right - boundaryX,
  };
}
