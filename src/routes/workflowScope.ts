import type { GradeRange } from '../registry/moduleRegistry';

export type WorkflowScope = GradeRange | 'all';

export const DEFAULT_WORKFLOW_SCOPE: WorkflowScope = 'Lise';
export const WORKFLOW_SCOPE_STORAGE_KEY = 'dinamik-istasyon:lise-workflow-scope:v1';
export const WORKFLOW_SCOPE_EVENT = 'dinamik-istasyon:workflow-scope-change';

export const workflowScopeCopy: Record<WorkflowScope, { label: string; doorHint: string; range: string }> = {
  all: {
    label: 'Tüm sınıflar',
    doorHint: '1-12',
    range: '1-12',
  },
  İlkokul: {
    label: 'İlkokul hattı açık',
    doorHint: '1-4 aktif',
    range: '1-4',
  },
  Ortaokul: {
    label: 'Ortaokul hattı açık',
    doorHint: '5-8 aktif',
    range: '5-8',
  },
  Lise: {
    label: 'Lise hattı açık',
    doorHint: '9-12 aktif',
    range: '9-12',
  },
};

export function getBandForGrade(grade: number): GradeRange {
  if (grade <= 4) return 'İlkokul';
  if (grade <= 8) return 'Ortaokul';
  return 'Lise';
}

export function isGradeInWorkflowScope(grade: number, scope: WorkflowScope) {
  return getBandForGrade(grade) === normalizeLiseWorkflowScope(scope);
}

export function parseWorkflowScope(value: string | null): WorkflowScope | null {
  const normalized = value?.trim().toLocaleLowerCase('tr-TR');
  if (!normalized) return null;
  if (normalized === 'lise' || normalized === 'highschool') return 'Lise';
  if (
    normalized === 'all' ||
    normalized === 'tum' ||
    normalized === 'tüm' ||
    normalized === 'ortaokul' ||
    normalized === 'middle' ||
    normalized === 'ilkokul' ||
    normalized === 'primary'
  ) {
    return DEFAULT_WORKFLOW_SCOPE;
  }
  return null;
}

export function getStoredWorkflowScope(): WorkflowScope {
  if (typeof window === 'undefined') return DEFAULT_WORKFLOW_SCOPE;
  return normalizeLiseWorkflowScope(window.localStorage.getItem(WORKFLOW_SCOPE_STORAGE_KEY));
}

export function setStoredWorkflowScope(scope: WorkflowScope) {
  if (typeof window === 'undefined') return;
  const normalizedScope = normalizeLiseWorkflowScope(scope);
  window.localStorage.setItem(WORKFLOW_SCOPE_STORAGE_KEY, normalizedScope);
  window.dispatchEvent(new CustomEvent(WORKFLOW_SCOPE_EVENT, { detail: { scope: normalizedScope } }));
}

function normalizeLiseWorkflowScope(value: unknown): WorkflowScope {
  const scope = typeof value === 'string' ? parseWorkflowScope(value) : null;
  return scope === 'Lise' ? scope : DEFAULT_WORKFLOW_SCOPE;
}
