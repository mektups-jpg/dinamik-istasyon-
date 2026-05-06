import { Point, PolygonMissionTarget, PolygonWorkshopMeasure, PolygonWorkshopState } from './types';

export const workshopFrame = {
  width: 900,
  height: 760,
  railX: 168,
  railY: 580,
  railWidth: 564,
};

export const polygonTargets: PolygonMissionTarget[] = [
  {
    id: 'diagonal-counter',
    title: 'Köşegen Lazerleri',
    shortLabel: '9 köşegen',
    correctAnswer: 9,
    answerUnit: '',
    hint: 'Altıgeni seç, köşegen lazerlerini sona taşı ve toplam 9 kilidini seç.',
    success: 'Köşegen sayısı çizimden doğdu. Şimdi dış açı yürüyüşünü 360° halkaya kapat.',
    accent: '#22D3EE',
  },
  {
    id: 'exterior-walk',
    title: '360° Dış Açı Yürüyüşü',
    shortLabel: '360°',
    correctAnswer: 360,
    answerUnit: '°',
    hint: 'Yürüyüş halkası kapanmadan dış açı toplamı okunamaz.',
    success: 'Dış açı yürüyüşü tam tur oldu. Şimdi simetri aynasını eksenlere çevir.',
    accent: '#FBBF24',
  },
  {
    id: 'symmetry-mirror',
    title: 'Simetri Aynası',
    shortLabel: '6 eksen',
    correctAnswer: 6,
    answerUnit: '',
    hint: 'Ayna taraması tüm altıgen eksenlerini yakalamalı ve 6 kilidi seçilmeli.',
    success: 'Düzgün altıgenin simetri eksenleri kilitlendi.',
    accent: '#A78BFA',
  },
];

export const initialPolygonWorkshopState: PolygonWorkshopState = {
  sides: 5,
  diagonalScan: 0.12,
  exteriorWalk: 0.08,
  symmetryScan: 0.08,
  selectedAnswer: null,
};

export const answerOptions: Record<number, number[]> = {
  0: [6, 9, 12],
  1: [180, 360, 540],
  2: [3, 6, 12],
};

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function railXToProgress(x: number) {
  return roundProgress((x - workshopFrame.railX) / workshopFrame.railWidth);
}

export function progressToRailX(progress: number) {
  return workshopFrame.railX + workshopFrame.railWidth * clamp(progress);
}

export function progressToSides(progress: number) {
  return Math.round(5 + clamp(progress) * 3);
}

export function sidesToProgress(sides: number) {
  return (sides - 5) / 3;
}

export function diagonalCount(sides: number) {
  return (sides * (sides - 3)) / 2;
}

export function exteriorAngle(sides: number) {
  return 360 / sides;
}

export function regularPolygonPoints(sides: number, center: Point = { x: 448, y: 250 }, radius = 132): Point[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / sides;
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });
}

export function polygonPath(points: Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

export function getDiagonals(points: Point[]): [Point, Point][] {
  const diagonals: [Point, Point][] = [];
  const total = points.length;

  for (let from = 0; from < total; from += 1) {
    for (let to = from + 1; to < total; to += 1) {
      const distance = Math.abs(to - from);
      const adjacent = distance === 1 || distance === total - 1;
      if (!adjacent) {
        diagonals.push([points[from], points[to]]);
      }
    }
  }

  return diagonals;
}

export function measurePolygonWorkshop(state: PolygonWorkshopState, activeIndex: number): PolygonWorkshopMeasure {
  const points = regularPolygonPoints(state.sides);
  const diagonals = getDiagonals(points);
  const activeProgress = activeIndex === 0
    ? state.diagonalScan
    : activeIndex === 1
      ? state.exteriorWalk
      : state.symmetryScan;

  return {
    points,
    diagonals,
    diagonalCount: diagonalCount(state.sides),
    exteriorAngle: exteriorAngle(state.sides),
    activeProgress,
    selectedLabel: state.selectedAnswer === null ? 'kilit yok' : `${state.selectedAnswer}${polygonTargets[activeIndex].answerUnit}`,
    formulaLabel: `${state.sides}(${state.sides}-3)/2 = ${diagonalCount(state.sides)}`,
    exteriorTotalLabel: `${state.sides} x ${Math.round(exteriorAngle(state.sides))}° = 360°`,
    symmetryAxes: state.sides,
  };
}

export function isPolygonMissionMatched(state: PolygonWorkshopState, activeIndex: number) {
  const target = polygonTargets[activeIndex];
  const hexagonReady = state.sides === 6;

  if (activeIndex === 0) {
    return hexagonReady && state.diagonalScan >= 0.9 && state.selectedAnswer === target.correctAnswer;
  }

  if (activeIndex === 1) {
    return hexagonReady && state.exteriorWalk >= 0.9 && state.selectedAnswer === target.correctAnswer;
  }

  return hexagonReady && state.symmetryScan >= 0.9 && state.selectedAnswer === target.correctAnswer;
}

export function resetForMission(activeIndex: number): PolygonWorkshopState {
  if (activeIndex === 0) {
    return initialPolygonWorkshopState;
  }

  if (activeIndex === 1) {
    return { sides: 6, diagonalScan: 1, exteriorWalk: 0.08, symmetryScan: 0.08, selectedAnswer: null };
  }

  return { sides: 6, diagonalScan: 1, exteriorWalk: 1, symmetryScan: 0.08, selectedAnswer: null };
}
