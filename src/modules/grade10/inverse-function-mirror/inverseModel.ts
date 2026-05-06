import { InverseMeasure, InverseMirrorState, InverseMissionTarget, InverseSeal } from './types';

export const inverseFrame = {
  width: 900,
  height: 650,
  railX: 170,
  railWidth: 560,
  railY: 570,
};

export const inverseTargets: InverseMissionTarget[] = [
  {
    id: 'linear-inverse',
    title: 'Doğrusal Ters',
    shortLabel: 'f⁻¹(x)=(x-1)/2',
    accent: '#22D3EE',
    correctSeal: 'linear',
    hint: 'Aynayı kapat, giriş ve çıkış kapsüllerini rol değişimine taşı.',
    success: 'Doğrusal makine ters bağlandı. x ve y rolleri yer değiştirdi.',
  },
  {
    id: 'branch-gate',
    title: 'Dal Kapısı',
    shortLabel: 'tek dal seç',
    accent: '#FBBF24',
    correctSeal: 'branch',
    hint: 'Karesel grafik tek dala kilitlenmeden tersi fonksiyon olmaz.',
    success: 'Dal seçildi. Karekök tersliği güvenli bölgede fonksiyon oldu.',
  },
  {
    id: 'rational-inverse',
    title: 'Rasyonel Ayna',
    shortLabel: 'yasak duvar korunur',
    accent: '#A78BFA',
    correctSeal: 'rational',
    hint: 'Ayna ve iki kapsül ters makine portlarına oturmalı.',
    success: 'Rasyonel tersleme kilitlendi. Yasak duvar aynada da kaldı.',
  },
];

export const inverseSealLabels: Record<InverseSeal, string> = {
  linear: 'Doğrusal',
  branch: 'Dal',
  rational: 'Rasyonel',
};

export const inverseSealOptions: InverseSeal[] = ['linear', 'branch', 'rational'];

export const initialInverseState: InverseMirrorState = {
  mirrorArm: 0.18,
  inputCapsule: 0.16,
  outputCapsule: 0.14,
  branchGate: 0.1,
  selectedSeal: null,
};

export function resetForMission(activeIndex: number): InverseMirrorState {
  if (activeIndex === 1) {
    return { mirrorArm: 0.22, inputCapsule: 0.86, outputCapsule: 0.82, branchGate: 0.12, selectedSeal: null };
  }
  if (activeIndex === 2) {
    return { mirrorArm: 0.18, inputCapsule: 0.22, outputCapsule: 0.18, branchGate: 1, selectedSeal: null };
  }
  return initialInverseState;
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function progressToRailX(progress: number) {
  return inverseFrame.railX + clamp(progress) * inverseFrame.railWidth;
}

export function railXToProgress(x: number) {
  return clamp((x - inverseFrame.railX) / inverseFrame.railWidth);
}

export function measureInverse(state: InverseMirrorState, activeIndex: number): InverseMeasure {
  const target = inverseTargets[activeIndex];
  const mirrorOn = state.mirrorArm >= 0.9;
  const inputOn = state.inputCapsule >= 0.85;
  const outputOn = state.outputCapsule >= 0.85;
  const branchOn = state.branchGate >= 0.9;
  return {
    mirrorLabel: mirrorOn ? 'ayna açık' : 'ayna kapalı',
    inputLabel: inputOn ? 'giriş rol değiştirdi' : 'giriş bekliyor',
    outputLabel: outputOn ? 'çıkış geri döndü' : 'çıkış bekliyor',
    branchLabel: branchOn ? 'tek dal' : 'çift dal alarmı',
    selectedLabel: state.selectedSeal ? inverseSealLabels[state.selectedSeal] : 'mühür yok',
    equation: target.id === 'linear-inverse'
      ? 'y=2x+1 → x=(y-1)/2'
      : target.id === 'branch-gate'
        ? 'y=x² → x=√y'
        : 'y=1/x → x=1/y',
  };
}

export function isInverseMissionMatched(state: InverseMirrorState, activeIndex: number) {
  const sealOk = state.selectedSeal === inverseTargets[activeIndex].correctSeal;
  if (activeIndex === 0) return sealOk && state.mirrorArm >= 0.9 && state.inputCapsule >= 0.85 && state.outputCapsule >= 0.85;
  if (activeIndex === 1) return sealOk && state.mirrorArm >= 0.9 && state.branchGate >= 0.9;
  return sealOk && state.mirrorArm >= 0.9 && state.inputCapsule >= 0.85 && state.outputCapsule >= 0.85;
}
