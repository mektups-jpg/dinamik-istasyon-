import { EvidencePoint, MediaAuditMeasure, MediaAuditState, MediaAuditTarget } from './types';

export const mediaAuditFrame = {
  width: 900,
  height: 560,
  chartX: 422,
  chartY: 96,
  chartWidth: 336,
  chartHeight: 238,
  railX: 432,
  railY: 386,
  railWidth: 306,
  sealX: 432,
  sealY: 488,
  sealWidth: 306,
};

export const evidencePoints: EvidencePoint[] = [
  { id: 'p1', x: 1.4, y: 8.1 },
  { id: 'p2', x: 2.8, y: 6.9 },
  { id: 'p3', x: 4.1, y: 6.2 },
  { id: 'p4', x: 5.8, y: 4.7 },
  { id: 'p5', x: 7.3, y: 3.4 },
  { id: 'p6', x: 8.6, y: 2.8 },
];

export const mediaAuditTargets: MediaAuditTarget[] = [
  {
    id: 'evidence-trace',
    atomId: 'MAT.11.3.2.1',
    kind: 'evidence',
    label: 'Veri izi: negatif ilişki',
    hint: 'Denetim merceğini veri izinin sonuna taşı; önce iddianın veri yönüyle uyumlu olup olmadığını gör.',
  },
  {
    id: 'causation-alarm',
    atomId: 'MAT.11.3.2.1',
    kind: 'language',
    label: 'Nedensellik alarmı',
    hint: 'İddia kartındaki fazla güçlü sebep-sonuç kelimesini işaretle.',
  },
  {
    id: 'safe-conclusion',
    atomId: 'MAT.11.3.2.1',
    kind: 'conclusion',
    label: 'Güvenli sonuç mührü',
    hint: 'Sonuç mührünü güvenli dile taşı: ilişki var, ama tek başına neden-sonuç kanıtı değil.',
  },
];

export const initialMediaAuditState: MediaAuditState = {
  lensProgress: 0.12,
  causationFlagged: false,
  conclusionProgress: 0.08,
};

export const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

export const roundProgress = (value: number) => Math.round(clampProgress(value) * 100) / 100;

export const progressToX = (progress: number, railX: number, railWidth: number) => railX + clampProgress(progress) * railWidth;

export const xToProgress = (x: number, railX: number, railWidth: number) => roundProgress((x - railX) / railWidth);

export const evidenceToSvg = (point: EvidencePoint) => ({
  x: mediaAuditFrame.chartX + (point.x / 10) * mediaAuditFrame.chartWidth,
  y: mediaAuditFrame.chartY + mediaAuditFrame.chartHeight - (point.y / 10) * mediaAuditFrame.chartHeight,
});

export const measureEvidence = (state: MediaAuditState): MediaAuditMeasure => {
  const meanX = evidencePoints.reduce((sum, point) => sum + point.x, 0) / evidencePoints.length;
  const meanY = evidencePoints.reduce((sum, point) => sum + point.y, 0) / evidencePoints.length;
  const numerator = evidencePoints.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
  const denominator = evidencePoints.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const direction = slope < -0.25 ? 'negatif' : slope > 0.25 ? 'pozitif' : 'zayıf';

  return {
    slope,
    direction,
    evidenceReady: state.lensProgress >= 0.9,
    safeLanguage: state.conclusionProgress >= 0.9,
  };
};

export const isMediaAuditTargetMatched = (state: MediaAuditState, target: MediaAuditTarget) => {
  if (target.kind === 'evidence') return measureEvidence(state).direction === 'negatif' && state.lensProgress >= 0.9;
  if (target.kind === 'language') return state.causationFlagged;
  return state.conclusionProgress >= 0.9;
};

export const prepareMediaMission = (target: MediaAuditTarget): MediaAuditState => {
  if (target.kind === 'language') return { lensProgress: 1, causationFlagged: false, conclusionProgress: 0.08 };
  if (target.kind === 'conclusion') return { lensProgress: 1, causationFlagged: true, conclusionProgress: 0.08 };
  return initialMediaAuditState;
};
