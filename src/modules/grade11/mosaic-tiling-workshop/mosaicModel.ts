import { MosaicMissionTarget, MosaicSeal, MosaicWorkshopMeasure, MosaicWorkshopState, Point } from './types';

export const mosaicFrame = {
  width: 900,
  height: 700,
  railX: 164,
  railY: 590,
  railWidth: 572,
};

export const mosaicTargets: MosaicMissionTarget[] = [
  {
    id: 'gapless-mosaic',
    title: 'Boşluksuz Mozaik',
    shortLabel: 'boşluk yok',
    correctSeal: 'gapless',
    hint: 'Altıgen fayans yuvasına tam oturmadan boşluk alarmı sönmez.',
    success: 'Altıgen fayans boşluksuz oturdu. Şimdi bir köşede açıların 360° kapanmasını kur.',
    accent: '#22D3EE',
  },
  {
    id: 'angle-ring',
    title: '360° Açı Halkası',
    shortLabel: '360°',
    correctSeal: 'angle360',
    hint: 'Üçgen parçalar ve döndürme kadranı 360° halkayı tamamlamalı.',
    success: 'Açı halkası tam tur oldu. Şimdi desen hizasını ray üzerinde kilitle.',
    accent: '#FBBF24',
  },
  {
    id: 'tile-alignment',
    title: 'Fayans Hizası',
    shortLabel: 'hizalı desen',
    correctSeal: 'aligned',
    hint: 'Desen rayı hedef hizaya gelmeden üst üste binme alarmı kalır.',
    success: 'Kaplama deseni boşluksuz ve hizalı.',
    accent: '#A78BFA',
  },
];

export const sealLabels: Record<MosaicSeal, string> = {
  gapless: 'Boşluksuz',
  angle360: '360°',
  aligned: 'Hizalı',
};

export const sealOptions: MosaicSeal[] = ['gapless', 'angle360', 'aligned'];

export const initialMosaicState: MosaicWorkshopState = {
  hexagonFit: 0.12,
  triangleFit: 0.12,
  rotationDial: 0.08,
  selectedSeal: null,
};

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function railXToProgress(x: number) {
  return roundProgress((x - mosaicFrame.railX) / mosaicFrame.railWidth);
}

export function progressToRailX(progress: number) {
  return mosaicFrame.railX + mosaicFrame.railWidth * clamp(progress);
}

export function hexagonPoints(center: Point, radius: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 6 + (index * Math.PI * 2) / 6;
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });
}

export function trianglePoints(center: Point, radius: number, rotationDegrees = -90) {
  return Array.from({ length: 3 }, (_, index) => {
    const angle = ((rotationDegrees + index * 120) * Math.PI) / 180;
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });
}

export function pointsToString(points: Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

export function measureMosaic(state: MosaicWorkshopState, activeIndex: number): MosaicWorkshopMeasure {
  const activeProgress = activeIndex === 0
    ? state.hexagonFit
    : activeIndex === 1
      ? state.triangleFit
      : state.rotationDial;
  const rotationDegrees = Math.round(state.rotationDial * 120);
  const angleTotal = Math.round(180 + state.triangleFit * 120 + state.rotationDial * 60);
  const gapLevel = activeIndex === 0
    ? Math.round((1 - state.hexagonFit) * 100)
    : activeIndex === 1
      ? Math.max(0, Math.abs(360 - angleTotal))
      : Math.round((1 - state.rotationDial) * 100);

  return {
    activeProgress,
    rotationDegrees,
    angleTotal,
    gapLevel,
    selectedLabel: state.selectedSeal ? sealLabels[state.selectedSeal] : 'mühür yok',
    alarmLabel: gapLevel <= 8 ? 'alarm söndü' : 'boşluk alarmı',
  };
}

export function isMosaicMissionMatched(state: MosaicWorkshopState, activeIndex: number) {
  const target = mosaicTargets[activeIndex];
  if (state.selectedSeal !== target.correctSeal) return false;

  if (activeIndex === 0) {
    return state.hexagonFit >= 0.9;
  }

  if (activeIndex === 1) {
    return state.triangleFit >= 0.9 && state.rotationDial >= 0.9;
  }

  return state.rotationDial >= 0.9;
}

export function resetForMission(activeIndex: number): MosaicWorkshopState {
  if (activeIndex === 0) {
    return initialMosaicState;
  }

  if (activeIndex === 1) {
    return { hexagonFit: 1, triangleFit: 0.12, rotationDial: 0.08, selectedSeal: null };
  }

  return { hexagonFit: 1, triangleFit: 1, rotationDial: 0.08, selectedSeal: null };
}
