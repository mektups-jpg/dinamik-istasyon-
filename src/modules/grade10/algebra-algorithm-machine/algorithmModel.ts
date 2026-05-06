import { AlgorithmChoice, AlgorithmMeasure, AlgorithmState, AlgorithmTarget } from './types';

export const algorithmFrame = {
  width: 900,
  height: 640,
  rail: { x1: 122, x2: 778, y: 548 },
};

export const algorithmTargets: AlgorithmTarget[] = [
  {
    id: 'input',
    title: 'Girdi Portu',
    shortLabel: 'x = 3',
    atomId: 'MAT.10.3.2.1',
    targetProgress: 0.18,
    accent: '#22D3EE',
    hint: 'Aksı sol giriş portuna getir ve x=3 bloğunu seç.',
    success: 'Girdi portu açıldı: algoritma x=3 kapsülüyle başlıyor.',
  },
  {
    id: 'pipeline',
    title: 'İşlem Boru Hattı',
    shortLabel: '((x+2)²-4)/3',
    atomId: 'MAT.10.3.2.1',
    targetProgress: 0.52,
    accent: '#A78BFA',
    hint: 'Aksı işlem hattına getir, boru hattını ve 7 çıktı tokenını kilitle.',
    success: 'İşlem sırası doğru aktı: 3 -> 5 -> 25 -> 21 -> 7.',
  },
  {
    id: 'seal',
    title: 'Kod Mührü',
    shortLabel: 'çıktı = 7',
    atomId: 'MAT.10.3.2.1',
    targetProgress: 0.82,
    accent: '#FBBF24',
    hint: 'Aksı sözde kod satırına getir ve algoritma mührünü aç.',
    success: 'Cebirsel işlem algoritmik girdi-çıktı akışına kodlandı.',
  },
];

export const initialAlgorithmState: AlgorithmState = {
  railProgress: 0.06,
  selectedChoice: null,
  selectedOutput: null,
  codeSealed: false,
};

export function resetForAlgorithmMission(activeIndex: number): AlgorithmState {
  if (activeIndex === 0) return initialAlgorithmState;
  if (activeIndex === 1) return { railProgress: 0.36, selectedChoice: null, selectedOutput: null, codeSealed: false };
  return { railProgress: 0.7, selectedChoice: null, selectedOutput: null, codeSealed: false };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function railXFromProgress(progress: number) {
  return algorithmFrame.rail.x1 + clamp(progress) * (algorithmFrame.rail.x2 - algorithmFrame.rail.x1);
}

export function progressFromX(x: number) {
  return roundProgress((x - algorithmFrame.rail.x1) / (algorithmFrame.rail.x2 - algorithmFrame.rail.x1));
}

export function choiceLabel(choice: AlgorithmChoice | null) {
  if (choice === 'input') return 'x=3 girdi';
  if (choice === 'pipeline') return 'işlem hattı';
  if (choice === 'seal') return 'kod mührü';
  return 'seçilmedi';
}

export function measureAlgorithm(state: AlgorithmState, target: AlgorithmTarget): AlgorithmMeasure {
  return {
    expression: '((x + 2)^2 - 4) / 3',
    selectedChoiceLabel: choiceLabel(state.selectedChoice),
    selectedOutputLabel: state.selectedOutput === null ? 'seçilmedi' : String(state.selectedOutput),
    targetLabel: `${Math.round(target.targetProgress * 100)}% algoritma rayı`,
  };
}

export function isAlgorithmMissionMatched(state: AlgorithmState, target: AlgorithmTarget) {
  const aligned = Math.abs(state.railProgress - target.targetProgress) <= 0.045;
  if (target.id === 'input') return aligned && state.selectedChoice === 'input';
  if (target.id === 'pipeline') return aligned && state.selectedChoice === 'pipeline' && state.selectedOutput === 7;
  return aligned && state.codeSealed;
}
