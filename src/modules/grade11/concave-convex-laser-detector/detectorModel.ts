import { DetectorMeasure, DetectorPoint, DetectorState, DetectorTarget, PolygonKind, PolygonProfile } from './types';

export const detectorFrame = {
  width: 900,
  height: 560,
  railX: 150,
  railY: 502,
  railWidth: 600,
};

export const initialDetectorState: DetectorState = {
  convexScan: 0.12,
  concaveScan: 0.1,
  selectedKind: null,
};

export const polygonProfiles: Record<PolygonKind, PolygonProfile> = {
  convex: {
    kind: 'convex',
    label: 'Konveks Numune',
    points: [
      { x: 438, y: 112 },
      { x: 572, y: 205 },
      { x: 522, y: 356 },
      { x: 354, y: 356 },
      { x: 304, y: 205 },
    ],
    angles: [112, 108, 96, 112, 112],
    reflexIndex: null,
    facts: ['bütün açılar <180°', 'içeri göçen köşe yok', 'dışbükey kilit yanar'],
  },
  concave: {
    kind: 'concave',
    label: 'Konkav Numune',
    points: [
      { x: 306, y: 132 },
      { x: 572, y: 132 },
      { x: 468, y: 248 },
      { x: 572, y: 372 },
      { x: 306, y: 372 },
    ],
    angles: [90, 47, 266, 47, 90],
    reflexIndex: 2,
    facts: ['en az bir açı >180°', 'içeri göçen köşe var', 'içbükey kilit yanar'],
  },
};

export const detectorTargets: DetectorTarget[] = [
  {
    id: 'convex-scan',
    atomId: 'MAT.11.2.3.1',
    profile: 'convex',
    correctKind: 'convex',
    title: 'Konveks Tarama',
    label: 'tüm açılar 180° altında -> konveks',
    hint: 'Lazer probunu sona taşı; >180° alarmı yoksa Konveks kilidi gerekir.',
  },
  {
    id: 'concave-alarm',
    atomId: 'MAT.11.2.3.2',
    profile: 'concave',
    correctKind: 'concave',
    title: 'Konkav Alarm',
    label: 'en az bir açı 180° üstünde -> konkav',
    hint: 'İçeri göçen köşedeki >180° alarmını yakala ve Konkav kilidini seç.',
  },
];

export const kindLabels: Record<PolygonKind, string> = {
  convex: 'Konveks',
  concave: 'Konkav',
};

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const roundProgress = (value: number) => Math.round(clamp(value) * 100) / 100;

export const progressToRailX = (progress: number) => detectorFrame.railX + clamp(progress) * detectorFrame.railWidth;

export const railXToProgress = (x: number) => roundProgress((x - detectorFrame.railX) / detectorFrame.railWidth);

export const polygonPoints = (points: DetectorPoint[]) => points.map((point) => `${point.x},${point.y}`).join(' ');

export const getActiveScan = (state: DetectorState, target: DetectorTarget) =>
  target.profile === 'convex' ? state.convexScan : state.concaveScan;

export const getScannedCount = (scan: number, profile: PolygonProfile) =>
  Math.min(profile.points.length, Math.max(0, Math.floor(scan * profile.points.length + 0.12)));

export const getActiveVertexIndex = (scan: number, profile: PolygonProfile) =>
  Math.min(profile.points.length - 1, Math.max(0, Math.round(clamp(scan) * (profile.points.length - 1))));

export const getScanPoint = (scan: number, profile: PolygonProfile): DetectorPoint => {
  const pathPosition = clamp(scan) * (profile.points.length - 1);
  const startIndex = Math.min(profile.points.length - 2, Math.max(0, Math.floor(pathPosition)));
  const endIndex = startIndex + 1;
  const localProgress = pathPosition - startIndex;
  const start = profile.points[startIndex];
  const end = profile.points[endIndex];

  return {
    x: start.x + (end.x - start.x) * localProgress,
    y: start.y + (end.y - start.y) * localProgress,
  };
};

export const isTargetMatched = (state: DetectorState, target: DetectorTarget) =>
  getActiveScan(state, target) >= 0.9 && state.selectedKind === target.correctKind;

export const measureDetector = (state: DetectorState, target: DetectorTarget): DetectorMeasure => {
  const profile = polygonProfiles[target.profile];
  const scanProgress = getActiveScan(state, target);
  const activeIndex = getActiveVertexIndex(scanProgress, profile);
  const alarmActive = profile.reflexIndex !== null && scanProgress > 0.56;
  const displayedAngleIndex = alarmActive && profile.reflexIndex !== null ? profile.reflexIndex : activeIndex;

  return {
    scanProgress,
    scannedCount: getScannedCount(scanProgress, profile),
    selectedLabel: state.selectedKind ? kindLabels[state.selectedKind] : 'seçilmedi',
    activeAngleLabel: `${profile.angles[displayedAngleIndex]}°`,
    alarmActive,
  };
};
