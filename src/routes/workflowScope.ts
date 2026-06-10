import { useCallback, useEffect, useState } from 'react';
import type { GradeRange, ModuleMeta } from '../registry/moduleRegistry';

export type WorkflowScope = GradeRange | 'all';

const WORKFLOW_SCOPE_KEY = 'dinamik-istasyon:workflow-scope:v1';
const WORKFLOW_SCOPE_EVENT = 'dinamik-istasyon:workflow-scope-change';

const scopeLabels: Record<WorkflowScope, string> = {
  all: 'Tüm sınıflar',
  İlkokul: 'İlkokul',
  Ortaokul: 'Ortaokul',
  Lise: 'Lise',
};

const scopeDescriptions: Record<WorkflowScope, string> = {
  all: 'Tüm sınıf kapıları açık.',
  İlkokul: '1-4. sınıf çalışma hattı açık.',
  Ortaokul: '5-8. sınıf çalışma hattı açık.',
  Lise: '9-12. sınıf çalışma hattı açık.',
};

export function getBandForGrade(grade: number): GradeRange {
  if (grade <= 4) return 'İlkokul';
  if (grade <= 8) return 'Ortaokul';
  return 'Lise';
}

export function isGradeInScope(grade: number, scope: WorkflowScope) {
  return scope === 'all' || getBandForGrade(grade) === scope;
}

export function isModuleInScope(module: ModuleMeta, scope: WorkflowScope) {
  return isGradeInScope(module.grade, scope);
}

export function getWorkflowScopeLabel(scope: WorkflowScope) {
  return scopeLabels[scope];
}

export function getWorkflowScopeDescription(scope: WorkflowScope) {
  return scopeDescriptions[scope];
}

export function parseWorkflowBand(value: string | null): WorkflowScope | null {
  const normalized = value?.trim().toLocaleLowerCase('tr-TR');
  if (!normalized) return null;
  if (normalized === 'all' || normalized === 'tum' || normalized === 'tüm') return 'all';
  if (normalized === 'ilkokul' || normalized === 'ilk') return 'İlkokul';
  if (normalized === 'ortaokul' || normalized === 'orta') return 'Ortaokul';
  if (normalized === 'lise') return 'Lise';
  return null;
}

export function workflowScopeToQueryValue(scope: WorkflowScope) {
  if (scope === 'all') return 'all';
  if (scope === 'İlkokul') return 'ilkokul';
  if (scope === 'Ortaokul') return 'ortaokul';
  return 'lise';
}

export function readWorkflowScope(): WorkflowScope {
  if (typeof window === 'undefined') return 'all';
  return parseWorkflowBand(window.localStorage.getItem(WORKFLOW_SCOPE_KEY)) ?? 'all';
}

export function writeWorkflowScope(scope: WorkflowScope) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WORKFLOW_SCOPE_KEY, workflowScopeToQueryValue(scope));
  window.dispatchEvent(new CustomEvent<WorkflowScope>(WORKFLOW_SCOPE_EVENT, { detail: scope }));
}

export function useWorkflowScope() {
  const [scope, setScopeState] = useState<WorkflowScope>(() => readWorkflowScope());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === WORKFLOW_SCOPE_KEY) setScopeState(readWorkflowScope());
    };

    const handleScopeEvent = (event: Event) => {
      setScopeState((event as CustomEvent<WorkflowScope>).detail ?? readWorkflowScope());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(WORKFLOW_SCOPE_EVENT, handleScopeEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(WORKFLOW_SCOPE_EVENT, handleScopeEvent);
    };
  }, []);

  const setScope = useCallback((nextScope: WorkflowScope) => {
    writeWorkflowScope(nextScope);
    setScopeState(nextScope);
  }, []);

  return { scope, setScope };
}
