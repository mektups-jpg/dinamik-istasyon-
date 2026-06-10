import type { GradeRange, ModuleMeta } from '../registry/moduleRegistry';

export type WorkflowScope = GradeRange | 'all';

export const DEFAULT_WORKFLOW_SCOPE: WorkflowScope = 'İlkokul';
export const WORKFLOW_SCOPE_STORAGE_KEY = 'dinamik-istasyon:ilkokul-workflow-scope:v2';

const bandBySlug: Record<string, GradeRange> = {
  ilkokul: 'İlkokul',
  ılkokul: 'İlkokul',
  elementary: 'İlkokul',
  ortaokul: 'Ortaokul',
  middle: 'Ortaokul',
  lise: 'Lise',
  high: 'Lise',
};

export function getBandForGrade(grade: number): GradeRange {
  if (grade <= 4) return 'İlkokul';
  if (grade <= 8) return 'Ortaokul';
  return 'Lise';
}

export function isGradeAllowedInScope(grade: number, scope: WorkflowScope) {
  return scope === 'all' || getBandForGrade(grade) === scope;
}

export function isModuleAllowedInScope(module: ModuleMeta, scope: WorkflowScope) {
  return isGradeAllowedInScope(module.grade, scope);
}

export function parseBandParam(value: string | null): GradeRange | null {
  if (!value) return null;
  const normalized = value.trim().toLocaleLowerCase('tr-TR');
  return bandBySlug[normalized] ?? null;
}

export function normalizeWorkflowScope(value: unknown): WorkflowScope {
  if (value === 'all' || value === 'İlkokul' || value === 'Ortaokul' || value === 'Lise') return value;
  if (typeof value === 'string') return parseBandParam(value) ?? DEFAULT_WORKFLOW_SCOPE;
  return DEFAULT_WORKFLOW_SCOPE;
}

function normalizeElementaryWorkflowScope(value: unknown): WorkflowScope {
  const scope = normalizeWorkflowScope(value);
  return scope === 'all' || scope === 'İlkokul' ? scope : DEFAULT_WORKFLOW_SCOPE;
}

export function readWorkflowScope(): WorkflowScope {
  if (typeof window === 'undefined') return DEFAULT_WORKFLOW_SCOPE;
  try {
    return normalizeElementaryWorkflowScope(window.localStorage.getItem(WORKFLOW_SCOPE_STORAGE_KEY));
  } catch {
    return DEFAULT_WORKFLOW_SCOPE;
  }
}

export function writeWorkflowScope(scope: WorkflowScope) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WORKFLOW_SCOPE_STORAGE_KEY, normalizeElementaryWorkflowScope(scope));
  } catch {
    // Scope memory is a convenience guard; failing storage should not block the app.
  }
}

export function getWorkflowScopeLabel(scope: WorkflowScope) {
  return scope === 'all' ? 'Tüm sınıflar' : `${scope} hattı`;
}
