export interface EvidencePoint {
  id: string;
  x: number;
  y: number;
}

export interface MediaAuditState {
  lensProgress: number;
  causationFlagged: boolean;
  conclusionProgress: number;
}

export interface MediaAuditMeasure {
  slope: number;
  direction: 'negatif' | 'pozitif' | 'zayıf';
  evidenceReady: boolean;
  safeLanguage: boolean;
}

export interface MediaAuditTarget {
  id: string;
  atomId: string;
  kind: 'evidence' | 'language' | 'conclusion';
  label: string;
  hint: string;
}

export type AuditDragTarget = 'lens' | 'conclusion';
