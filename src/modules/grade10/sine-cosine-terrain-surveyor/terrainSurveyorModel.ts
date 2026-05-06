import { TerrainLock, TerrainMeasure, TerrainMissionTarget, TerrainPoint, TerrainState } from './types';

const DEG = Math.PI / 180;

const COSINE_MIN_ANGLE = 38;
const COSINE_MAX_ANGLE = 76;
const COSINE_TARGET_ANGLE = 60;

const SINE_MIN_ANGLE = 18;
const SINE_MAX_ANGLE = 48;
const SINE_KNOWN_ANGLE_A = 44;
const SINE_SIDE_BC = 8;
const SINE_SIDE_AC = 5.5;

const sineTargetAngleB = radiansToDegrees(Math.asin((SINE_SIDE_AC * Math.sin(SINE_KNOWN_ANGLE_A * DEG)) / SINE_SIDE_BC));

export const terrainFrame = {
  width: 900,
  height: 650,
  cosineA: { x: 218, y: 462 },
  cosineB: { x: 634, y: 462 },
  cosineScale: 52,
  sineA: { x: 238, y: 462 },
  sineScale: 40,
  sineRayLength: 168,
};

export const terrainTargets: TerrainMissionTarget[] = [
  {
    id: 'cosine-distance',
    title: 'Kosinüs Mesafe Kablosu',
    shortLabel: 'BC kenarı',
    atomId: 'MAT.10.4.4.1',
    lock: 'cosine',
    targetProgress: progressFromAngle(COSINE_TARGET_ANGLE, COSINE_MIN_ANGLE, COSINE_MAX_ANGLE),
    accent: '#22D3EE',
    hint: 'Kosinüs kilidini seç ve C istasyonunu hedef açı halkasına getir.',
    success: 'Kosinüs teoremi eksik BC mesafe kablosunu verdi.',
  },
  {
    id: 'sine-angle',
    title: 'Sinüs Açı Vizörü',
    shortLabel: 'B açısı',
    atomId: 'MAT.10.4.4.2',
    lock: 'sine',
    targetProgress: progressFromAngle(sineTargetAngleB, SINE_MIN_ANGLE, SINE_MAX_ANGLE),
    accent: '#A78BFA',
    hint: 'Sinüs kilidini seç ve B açı vizörünü oran eşitlenene kadar hedefe taşı.',
    success: 'Sinüs teoremi bilinmeyen B açısını oranla buldu.',
  },
  {
    id: 'terrain-report',
    title: 'Arazi Raporu',
    shortLabel: 'rapor mührü',
    atomId: 'MAT.10.4.4.2',
    lock: 'report',
    targetProgress: 0.5,
    accent: '#FBBF24',
    hint: 'Rapor kilidini seç ve ölçüm kolunu orta mühür çizgisine getir.',
    success: 'Arazi raporu kilitlendi: kenar için kosinüs, açı için sinüs teoremi seçilir.',
  },
];

export const initialTerrainState: TerrainState = {
  cursorProgress: 0.24,
  selectedLock: null,
};

export function resetForTerrainMission(activeIndex: number): TerrainState {
  if (activeIndex === 0) return initialTerrainState;
  if (activeIndex === 1) return { cursorProgress: 0.74, selectedLock: null };
  return { cursorProgress: 0.18, selectedLock: null };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function measureTerrain(state: TerrainState, target: TerrainMissionTarget): TerrainMeasure {
  if (target.lock === 'cosine') return measureCosine(state.cursorProgress);
  if (target.lock === 'sine') return measureSine(state.cursorProgress);

  const cosine = measureCosine(terrainTargets[0].targetProgress);
  const sine = measureSine(terrainTargets[1].targetProgress);
  return {
    mode: 'report',
    angleA: COSINE_TARGET_ANGLE,
    angleB: sine.angleB,
    sideAB: cosine.sideAB,
    sideAC: cosine.sideAC,
    sideBC: cosine.sideBC,
    cursorRatio: sine.cursorRatio,
    fixedRatio: sine.fixedRatio,
    formulaLine: 'Kenar eksikse kosinüs; açı eksikse sinüs teoremi.',
    resultLabel: `BC = ${cosine.sideBC.toFixed(1)} br, B = ${sine.angleB.toFixed(0)}°`,
    targetLabel: 'rapor mühür çizgisi',
  };
}

export function isTerrainMissionMatched(state: TerrainState, target: TerrainMissionTarget) {
  return state.selectedLock === target.lock && Math.abs(state.cursorProgress - target.targetProgress) <= 0.045;
}

export function progressFromSurveyPoint(lock: TerrainLock, point: TerrainPoint) {
  if (lock === 'cosine') {
    const angle = radiansToDegrees(Math.atan2(terrainFrame.cosineA.y - point.y, point.x - terrainFrame.cosineA.x));
    return roundProgress(progressFromAngle(angle, COSINE_MIN_ANGLE, COSINE_MAX_ANGLE));
  }

  if (lock === 'sine') {
    const stationB = sineStationB();
    const angle = radiansToDegrees(Math.atan2(stationB.y - point.y, stationB.x - point.x));
    return roundProgress(progressFromAngle(angle, SINE_MIN_ANGLE, SINE_MAX_ANGLE));
  }

  return roundProgress((point.x - 240) / 420);
}

export function cosineAngleFromProgress(progress: number) {
  return COSINE_MIN_ANGLE + clamp(progress) * (COSINE_MAX_ANGLE - COSINE_MIN_ANGLE);
}

export function sineAngleFromProgress(progress: number) {
  return SINE_MIN_ANGLE + clamp(progress) * (SINE_MAX_ANGLE - SINE_MIN_ANGLE);
}

export function cosineStationC(progress: number): TerrainPoint {
  const angle = cosineAngleFromProgress(progress);
  const radius = 6 * terrainFrame.cosineScale;
  return {
    x: terrainFrame.cosineA.x + Math.cos(angle * DEG) * radius,
    y: terrainFrame.cosineA.y - Math.sin(angle * DEG) * radius,
  };
}

export function sineStationB(): TerrainPoint {
  const sideC = sineSideAB();
  return {
    x: terrainFrame.sineA.x + sideC * terrainFrame.sineScale,
    y: terrainFrame.sineA.y,
  };
}

export function sineStationC(): TerrainPoint {
  return {
    x: terrainFrame.sineA.x + Math.cos(SINE_KNOWN_ANGLE_A * DEG) * SINE_SIDE_AC * terrainFrame.sineScale,
    y: terrainFrame.sineA.y - Math.sin(SINE_KNOWN_ANGLE_A * DEG) * SINE_SIDE_AC * terrainFrame.sineScale,
  };
}

export function sineVisorPoint(progress: number): TerrainPoint {
  const stationB = sineStationB();
  const angle = sineAngleFromProgress(progress);
  return {
    x: stationB.x - Math.cos(angle * DEG) * terrainFrame.sineRayLength,
    y: stationB.y - Math.sin(angle * DEG) * terrainFrame.sineRayLength,
  };
}

function measureCosine(progress: number): TerrainMeasure {
  const sideAB = 8;
  const sideAC = 6;
  const angleA = cosineAngleFromProgress(progress);
  const sideBC = Math.sqrt(sideAB ** 2 + sideAC ** 2 - 2 * sideAB * sideAC * Math.cos(angleA * DEG));
  return {
    mode: 'cosine',
    angleA,
    angleB: 0,
    sideAB,
    sideAC,
    sideBC,
    cursorRatio: 0,
    fixedRatio: 0,
    formulaLine: 'BC² = AB² + AC² - 2AB x AC x cos(A)',
    resultLabel: `BC = ${sideBC.toFixed(1)} br`,
    targetLabel: `${Math.round(COSINE_TARGET_ANGLE)}° hedef açısı`,
  };
}

function measureSine(progress: number): TerrainMeasure {
  const angleB = sineAngleFromProgress(progress);
  const fixedRatio = Math.sin(SINE_KNOWN_ANGLE_A * DEG) / SINE_SIDE_BC;
  const cursorRatio = Math.sin(angleB * DEG) / SINE_SIDE_AC;
  return {
    mode: 'sine',
    angleA: SINE_KNOWN_ANGLE_A,
    angleB,
    sideAB: sineSideAB(),
    sideAC: SINE_SIDE_AC,
    sideBC: SINE_SIDE_BC,
    cursorRatio,
    fixedRatio,
    formulaLine: 'sin(B) / AC = sin(A) / BC',
    resultLabel: `B = ${angleB.toFixed(0)}°`,
    targetLabel: `${sineTargetAngleB.toFixed(0)}° hedef açısı`,
  };
}

function sineSideAB() {
  const angleC = 180 - SINE_KNOWN_ANGLE_A - sineTargetAngleB;
  return (SINE_SIDE_BC * Math.sin(angleC * DEG)) / Math.sin(SINE_KNOWN_ANGLE_A * DEG);
}

function progressFromAngle(angle: number, min: number, max: number) {
  return clamp((angle - min) / (max - min));
}

function radiansToDegrees(value: number) {
  return value / DEG;
}
