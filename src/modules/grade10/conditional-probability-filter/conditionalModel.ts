import { ConditionalMeasure, ConditionalState, ConditionalTarget } from './types';

export const conditionalFrame = {
  width: 900,
  height: 640,
  rail: { x1: 126, x2: 774, y: 552 },
};

export const conditionalTargets: ConditionalTarget[] = [
  {
    id: 'condition',
    title: 'Koşul Kapısı',
    shortLabel: 'çift geldi',
    atomId: 'MAT.10.7.1.1',
    targetProgress: 0.2,
    accent: '#22D3EE',
    hint: 'Aksı koşul kapısına getir ve çift geldi filtresini aç.',
    success: 'Evrensel küme daraldı: artık yalnız 2, 4 ve 6 dikkate alınır.',
  },
  {
    id: 'target',
    title: 'Hedef Olay',
    shortLabel: "4'ten büyük",
    atomId: 'MAT.10.7.1.1',
    targetProgress: 0.52,
    accent: '#A78BFA',
    hint: "Aksı hedef portuna getir ve 4'ten büyük filtresini aç.",
    success: "Dar evrende 4'ten büyük yalnız 6 kaldı.",
  },
  {
    id: 'fraction',
    title: 'Kesir Mührü',
    shortLabel: '1/3',
    atomId: 'MAT.10.7.1.1',
    targetProgress: 0.82,
    accent: '#FBBF24',
    hint: 'Aksı sonuç portuna getir, 1/3 tokenını ve rapor mührünü kilitle.',
    success: 'Koşullu olasılık kilitlendi: P(>4 | çift) = 1/3.',
  },
];

export const initialConditionalState: ConditionalState = {
  railProgress: 0.06,
  conditionOn: false,
  targetOn: false,
  selectedFraction: null,
  reportSealed: false,
};

export function resetForConditionalMission(activeIndex: number): ConditionalState {
  if (activeIndex === 0) return initialConditionalState;
  if (activeIndex === 1) return { railProgress: 0.36, conditionOn: true, targetOn: false, selectedFraction: null, reportSealed: false };
  return { railProgress: 0.68, conditionOn: true, targetOn: true, selectedFraction: null, reportSealed: false };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function railXFromProgress(progress: number) {
  return conditionalFrame.rail.x1 + clamp(progress) * (conditionalFrame.rail.x2 - conditionalFrame.rail.x1);
}

export function progressFromX(x: number) {
  return roundProgress((x - conditionalFrame.rail.x1) / (conditionalFrame.rail.x2 - conditionalFrame.rail.x1));
}

export function measureConditional(state: ConditionalState, target: ConditionalTarget): ConditionalMeasure {
  const universe = state.conditionOn ? '{2,4,6}' : '{1,2,3,4,5,6}';
  const favorable = state.targetOn ? '{6}' : target.id === 'condition' ? 'koşul bekliyor' : '>4 filtresi bekliyor';
  return {
    universe,
    favorable,
    selectedFractionLabel: state.selectedFraction ?? 'seçilmedi',
    targetLabel: `${Math.round(target.targetProgress * 100)}% koşul rayı`,
  };
}

export function isConditionalMissionMatched(state: ConditionalState, target: ConditionalTarget) {
  const aligned = Math.abs(state.railProgress - target.targetProgress) <= 0.045;
  if (target.id === 'condition') return aligned && state.conditionOn;
  if (target.id === 'target') return aligned && state.conditionOn && state.targetOn;
  return aligned && state.conditionOn && state.targetOn && state.selectedFraction === '1/3' && state.reportSealed;
}
