import { AreaMeasure, AreaMissionTarget, AreaRailState } from './types';

export const areaFrame = {
  width: 900,
  height: 650,
  baseLeft: 210,
  baseRight: 690,
  baseY: 456,
  railLeft: 178,
  railRight: 722,
  railY: 184,
};

export const areaTargets: AreaMissionTarget[] = [
  {
    id: 'left-slide',
    title: 'Sol Kaydırma',
    shortLabel: 'sol ray',
    atomId: 'MAT.10.4.3.1',
    targetProgress: 0.18,
    accent: '#22D3EE',
    hint: 'Tepe düğümünü sol hedef halkasına taşı. Taban ve yükseklik aynı kalmalı.',
    success: 'Tepe ray üzerinde hareket etti; yükseklik değişmedi ve alan büyüklüğü aynı kaldı.',
  },
  {
    id: 'right-slide',
    title: 'Sağ Kaydırma',
    shortLabel: 'sağ ray',
    atomId: 'MAT.10.4.3.1',
    targetProgress: 0.82,
    accent: '#A78BFA',
    hint: 'Tepeyi sağ hedef halkasına taşı. Şekil değişirken alan sabit kalır.',
    success: 'Tepe ray üzerinde hareket etti; üçgen eğildi ama taban-yükseklik alan büyüklüğü değişmedi.',
  },
  {
    id: 'area-seal',
    title: 'Alan Mührü',
    shortLabel: 'orta mühür',
    atomId: 'MAT.10.4.3.1',
    targetProgress: 0.5,
    accent: '#FBBF24',
    hint: 'Tepeyi orta mühür halkasına getir ve A = taban · yükseklik / 2 ilişkisini kilitle.',
    success: 'Alan mührü kilitlendi. Aynı taban ve aynı yükseklik aynı alanı üretir.',
  },
];

export const initialAreaState: AreaRailState = {
  apexProgress: 0.34,
};

export function resetForAreaMission(activeIndex: number): AreaRailState {
  if (activeIndex === 0) return initialAreaState;
  if (activeIndex === 1) return { apexProgress: 0.32 };
  return { apexProgress: 0.74 };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function apexX(progress: number) {
  return areaFrame.railLeft + clamp(progress) * (areaFrame.railRight - areaFrame.railLeft);
}

export function progressFromApexX(x: number) {
  return clamp((x - areaFrame.railLeft) / (areaFrame.railRight - areaFrame.railLeft));
}

export function measureArea(state: AreaRailState, target: AreaMissionTarget): AreaMeasure {
  const base = 12;
  const height = 7;
  const area = (base * height) / 2;
  return {
    base,
    height,
    area,
    xOffset: Math.round((state.apexProgress - 0.5) * 100),
    targetLabel: `${Math.round(target.targetProgress * 100)}% ray`,
  };
}

export function isAreaMissionMatched(state: AreaRailState, target: AreaMissionTarget) {
  return Math.abs(state.apexProgress - target.targetProgress) <= 0.045;
}
