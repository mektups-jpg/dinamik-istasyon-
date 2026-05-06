import { CrossTableChoice, CrossTableMeasure, CrossTableState, CrossTableTarget } from './types';

export const crossTableFrame = {
  width: 900,
  height: 640,
  rail: { x1: 126, x2: 774, y: 552 },
};

export const crossTableTargets: CrossTableTarget[] = [
  {
    id: 'cell',
    title: 'Kategori Hücresi',
    shortLabel: 'Planlı + yükseldi',
    atomId: 'MAT.10.6.1.1',
    targetProgress: 0.18,
    accent: '#22D3EE',
    hint: 'Aksı tablo tarayıcısına getir ve 28 hücresini seç.',
    success: 'İki kategorik değişken aynı hücrede eşleşti: planlı çalışma ve yükselen sonuç.',
  },
  {
    id: 'deviation',
    title: 'Sapma Sinyali',
    shortLabel: '+9 sapma',
    atomId: 'MAT.10.6.1.2',
    targetProgress: 0.5,
    accent: '#A78BFA',
    hint: 'Aksı sapma paneline getir ve +9 ilişki sinyalini kilitle.',
    success: 'Gözlenen 28, beklenen 19 değerinin üstünde; ilişki sinyali yakalandı.',
  },
  {
    id: 'media',
    title: 'Medya Denetimi',
    shortLabel: 'yanlılık bayrağı',
    atomId: 'MAT.10.6.2.1',
    targetProgress: 0.82,
    accent: '#FBBF24',
    hint: 'Aksı medya kartına getir, yanlılık bayrağını ve rapor mührünü aç.',
    success: 'Medya iddiası güvenli dile çekildi: ilişki var, nedensellik kanıtı yok.',
  },
];

export const initialCrossTableState: CrossTableState = {
  railProgress: 0.06,
  selectedChoice: null,
  biasFlagged: false,
  reportSealed: false,
};

export function resetForCrossTableMission(activeIndex: number): CrossTableState {
  if (activeIndex === 0) return initialCrossTableState;
  if (activeIndex === 1) return { railProgress: 0.34, selectedChoice: null, biasFlagged: false, reportSealed: false };
  return { railProgress: 0.68, selectedChoice: null, biasFlagged: false, reportSealed: false };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function railXFromProgress(progress: number) {
  return crossTableFrame.rail.x1 + clamp(progress) * (crossTableFrame.rail.x2 - crossTableFrame.rail.x1);
}

export function progressFromX(x: number) {
  return roundProgress((x - crossTableFrame.rail.x1) / (crossTableFrame.rail.x2 - crossTableFrame.rail.x1));
}

export function choiceLabel(choice: CrossTableChoice | null) {
  if (choice === 'cell') return '28 hücresi';
  if (choice === 'deviation') return '+9 sapma';
  if (choice === 'bias') return 'yanlılık bayrağı';
  if (choice === 'seal') return 'güvenli rapor';
  return 'seçilmedi';
}

export function measureCrossTable(state: CrossTableState, target: CrossTableTarget): CrossTableMeasure {
  return {
    observed: '28 gözlenen',
    expected: target.id === 'cell' ? 'kategori eşleşmesi' : '19 beklenen',
    selectedChoiceLabel: choiceLabel(state.selectedChoice),
    targetLabel: `${Math.round(target.targetProgress * 100)}% dedektif rayı`,
  };
}

export function isCrossTableMissionMatched(state: CrossTableState, target: CrossTableTarget) {
  const aligned = Math.abs(state.railProgress - target.targetProgress) <= 0.045;
  if (target.id === 'cell') return aligned && state.selectedChoice === 'cell';
  if (target.id === 'deviation') return aligned && state.selectedChoice === 'deviation';
  return aligned && state.biasFlagged && state.reportSealed;
}
