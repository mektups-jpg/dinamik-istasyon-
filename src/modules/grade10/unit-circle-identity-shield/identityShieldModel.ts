import { ShieldLock, ShieldMeasure, ShieldMissionTarget, ShieldPoint, ShieldState } from './types';

const DEG = Math.PI / 180;
const MIN_ANGLE = 18;
const MAX_ANGLE = 72;

export const shieldFrame = {
  width: 900,
  height: 650,
  center: { x: 450, y: 306 },
  radius: 166,
};

export const shieldTargets: ShieldMissionTarget[] = [
  {
    id: 'cos-square',
    title: 'Kosinüs Kare Plakası',
    shortLabel: 'cos² plakası',
    atomId: 'MAT.10.4.2.1',
    lock: 'cos',
    targetProgress: progressFromAngle(34),
    accent: '#22D3EE',
    hint: 'Açı düğümünü hedef ışına getir ve yatay cos² plakasını seç.',
    success: 'cos² plakası yatay izdüşümün karesini kalkan enerjisine ekledi.',
  },
  {
    id: 'sin-square',
    title: 'Sinüs Kare Plakası',
    shortLabel: 'sin² plakası',
    atomId: 'MAT.10.4.2.1',
    lock: 'sin',
    targetProgress: progressFromAngle(62),
    accent: '#A78BFA',
    hint: 'Açı düğümünü ikinci hedefe getir ve dikey sin² plakasını seç.',
    success: 'sin² plakası dikey izdüşümün karesini tamamladı.',
  },
  {
    id: 'identity-core',
    title: 'Kalkan Mührü',
    shortLabel: '1 çekirdeği',
    atomId: 'MAT.10.4.2.1',
    lock: 'identity',
    targetProgress: progressFromAngle(48),
    accent: '#FBBF24',
    hint: 'Açı düğümünü mühür çizgisine getir ve merkez kalkan çekirdeğini seç.',
    success: 'Kalkan kilitlendi: sin²x + cos²x toplamı her zaman 1.',
  },
];

export const initialShieldState: ShieldState = {
  angleProgress: 0.18,
  selectedLock: null,
};

export function resetForShieldMission(activeIndex: number): ShieldState {
  if (activeIndex === 0) return initialShieldState;
  if (activeIndex === 1) return { angleProgress: 0.34, selectedLock: null };
  return { angleProgress: 0.76, selectedLock: null };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function roundProgress(value: number) {
  return Math.round(clamp(value) * 100) / 100;
}

export function angleFromProgress(progress: number) {
  return MIN_ANGLE + clamp(progress) * (MAX_ANGLE - MIN_ANGLE);
}

export function progressFromPoint(point: ShieldPoint) {
  const angle = Math.atan2(shieldFrame.center.y - point.y, point.x - shieldFrame.center.x) / DEG;
  return roundProgress(progressFromAngle(angle));
}

export function shieldHandlePoint(progress: number): ShieldPoint {
  const angle = angleFromProgress(progress);
  return {
    x: shieldFrame.center.x + Math.cos(angle * DEG) * shieldFrame.radius,
    y: shieldFrame.center.y - Math.sin(angle * DEG) * shieldFrame.radius,
  };
}

export function measureShield(state: ShieldState, target: ShieldMissionTarget): ShieldMeasure {
  const angle = angleFromProgress(state.angleProgress);
  const sinValue = Math.sin(angle * DEG);
  const cosValue = Math.cos(angle * DEG);
  const sinSquare = sinValue ** 2;
  const cosSquare = cosValue ** 2;
  const sum = sinSquare + cosSquare;
  return {
    angle,
    sinValue,
    cosValue,
    sinSquare,
    cosSquare,
    sum,
    resultLabel: `sin² + cos² = ${sum.toFixed(2)}`,
    targetLabel: `${Math.round(angleFromProgress(target.targetProgress))}° hedef`,
  };
}

export function isShieldMissionMatched(state: ShieldState, target: ShieldMissionTarget) {
  return state.selectedLock === target.lock && Math.abs(state.angleProgress - target.targetProgress) <= 0.045;
}

export function lockLabel(lock: ShieldLock | null) {
  if (lock === 'cos') return 'cos²';
  if (lock === 'sin') return 'sin²';
  if (lock === 'identity') return '1 çekirdeği';
  return 'seçilmedi';
}

function progressFromAngle(angle: number) {
  return clamp((angle - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE));
}
