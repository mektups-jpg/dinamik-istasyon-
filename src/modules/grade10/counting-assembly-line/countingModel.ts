import { CountingMeasure, CountingMode, CountingState, CountingTarget } from './types';

export const countingFrame = {
  width: 900,
  height: 640,
  rail: { x1: 132, x2: 768, y: 550 },
};

export const countingTargets: CountingTarget[] = [
  {
    id: 'product',
    title: 'Çarpma Bandı',
    shortLabel: '3 × 2 = 6',
    atomId: 'MAT.10.3.1.1',
    expression: '3 renk × 2 rozet',
    expected: 6,
    targetProgress: 0.28,
    accent: '#22D3EE',
    hint: 'Aksı çarpma bandına getir, çarpma modunu ve 6 tokenını seç.',
    success: 'Bağımsız seçimler aynı üründe birleşti: 3 × 2 = 6.',
  },
  {
    id: 'sum',
    title: 'Toplama Bandı',
    shortLabel: '4 + 3 = 7',
    atomId: 'MAT.10.3.1.2',
    expression: '4 drone + 3 rover',
    expected: 7,
    targetProgress: 0.72,
    accent: '#A78BFA',
    hint: 'Aksı toplama bandına getir, toplama modunu ve 7 tokenını seç.',
    success: 'Ayrık hatlar birbiriyle yarışmadı; seçenekler toplandı: 4 + 3 = 7.',
  },
  {
    id: 'seal',
    title: 'Sayma Mührü',
    shortLabel: 'kural ayrımı',
    atomId: 'MAT.10.3.1.2',
    expression: 'çarpma mı toplama mı?',
    expected: 0,
    targetProgress: 0.5,
    accent: '#FBBF24',
    hint: 'Aksı rapor çizgisine getir ve sayma mührünü seç.',
    success: 'Sayma raporu mühürlendi: birlikte kurulan seçim çarpılır, ayrık seçenekler toplanır.',
  },
];

export const initialCountingState: CountingState = {
  beltProgress: 0.08,
  selectedMode: null,
  selectedToken: null,
  sealArmed: false,
};

export function resetForCountingMission(activeIndex: number): CountingState {
  if (activeIndex === 0) return initialCountingState;
  if (activeIndex === 1) return { beltProgress: 0.88, selectedMode: null, selectedToken: null, sealArmed: false };
  return { beltProgress: 0.5, selectedMode: null, selectedToken: null, sealArmed: false };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function beltXFromProgress(progress: number) {
  return countingFrame.rail.x1 + clamp(progress) * (countingFrame.rail.x2 - countingFrame.rail.x1);
}

export function progressFromX(x: number) {
  return roundProgress((x - countingFrame.rail.x1) / (countingFrame.rail.x2 - countingFrame.rail.x1));
}

export function measureCounting(state: CountingState, target: CountingTarget): CountingMeasure {
  return {
    expression: target.expression,
    expected: target.expected,
    selectedModeLabel: modeLabel(state.selectedMode),
    selectedTokenLabel: state.selectedToken === null ? 'seçilmedi' : String(state.selectedToken),
    targetLabel: `${Math.round(target.targetProgress * 100)}% band hedefi`,
  };
}

export function isCountingMissionMatched(state: CountingState, target: CountingTarget) {
  const aligned = Math.abs(state.beltProgress - target.targetProgress) <= 0.045;
  if (target.id === 'seal') return aligned && state.sealArmed;
  return aligned && state.selectedMode === target.id && state.selectedToken === target.expected;
}

export function modeLabel(mode: CountingMode | null) {
  if (mode === 'product') return 'çarpma bandı';
  if (mode === 'sum') return 'toplama bandı';
  if (mode === 'seal') return 'sayma mührü';
  return 'seçilmedi';
}
