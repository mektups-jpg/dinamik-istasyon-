import { DependentDrawMeasure, DependentDrawState, DependentDrawTarget } from './types';

export const dependentDrawFrame = {
  width: 900,
  height: 640,
  rail: { x1: 126, x2: 774, y: 552 },
};

export const dependentDrawTargets: DependentDrawTarget[] = [
  {
    id: 'first',
    title: 'İlk Çekiliş',
    shortLabel: 'kırmızı çıktı',
    atomId: 'MAT.10.7.2.1',
    targetProgress: 0.2,
    accent: '#F87171',
    hint: 'Aksı ilk çekiliş kanalına getir ve kırmızı topu geri koymadan çıkar.',
    success: 'İlk kırmızı top çıktı ve torbaya geri dönmedi.',
  },
  {
    id: 'space',
    title: 'Evren Güncelle',
    shortLabel: '2/4 kaldı',
    atomId: 'MAT.10.7.2.1',
    targetProgress: 0.52,
    accent: '#22D3EE',
    hint: 'Aksı sayaç paneline getir ve kalan örnek uzayı 2 kırmızı / 4 toplam olarak güncelle.',
    success: 'Örnek uzay değişti: torbada 2 kırmızı ve toplam 4 top kaldı.',
  },
  {
    id: 'probability',
    title: 'Olasılık Mührü',
    shortLabel: '1/2',
    atomId: 'MAT.10.7.2.1',
    targetProgress: 0.82,
    accent: '#FBBF24',
    hint: 'Aksı sonuç portuna getir, 1/2 tokenını ve rapor mührünü kilitle.',
    success: 'Bağımlı çekiliş mühürlendi: ikinci kırmızı olasılığı 2/4 = 1/2.',
  },
];

export const initialDependentDrawState: DependentDrawState = {
  railProgress: 0.06,
  firstRedRemoved: false,
  spaceUpdated: false,
  selectedProbability: null,
  reportSealed: false,
};

export function resetForDependentDrawMission(activeIndex: number): DependentDrawState {
  if (activeIndex === 0) return initialDependentDrawState;
  if (activeIndex === 1) return { railProgress: 0.36, firstRedRemoved: true, spaceUpdated: false, selectedProbability: null, reportSealed: false };
  return { railProgress: 0.68, firstRedRemoved: true, spaceUpdated: true, selectedProbability: null, reportSealed: false };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function railXFromProgress(progress: number) {
  return dependentDrawFrame.rail.x1 + clamp(progress) * (dependentDrawFrame.rail.x2 - dependentDrawFrame.rail.x1);
}

export function progressFromX(x: number) {
  return roundProgress((x - dependentDrawFrame.rail.x1) / (dependentDrawFrame.rail.x2 - dependentDrawFrame.rail.x1));
}

export function measureDependentDraw(state: DependentDrawState, target: DependentDrawTarget): DependentDrawMeasure {
  const bagState = state.spaceUpdated ? '2 kırmızı / 4 toplam' : state.firstRedRemoved ? '1 kırmızı çıktı, sayaç bekliyor' : '3 kırmızı / 5 toplam';
  const probability = state.spaceUpdated ? '2/4 = 1/2' : 'ilk çekiliş bekliyor';
  return {
    bagState,
    probability,
    selectedProbabilityLabel: state.selectedProbability ?? 'seçilmedi',
    targetLabel: `${Math.round(target.targetProgress * 100)}% çekiliş rayı`,
  };
}

export function isDependentDrawMissionMatched(state: DependentDrawState, target: DependentDrawTarget) {
  const aligned = Math.abs(state.railProgress - target.targetProgress) <= 0.045;
  if (target.id === 'first') return aligned && state.firstRedRemoved;
  if (target.id === 'space') return aligned && state.firstRedRemoved && state.spaceUpdated;
  return aligned && state.firstRedRemoved && state.spaceUpdated && state.selectedProbability === '1/2' && state.reportSealed;
}
