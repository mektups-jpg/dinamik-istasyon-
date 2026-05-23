import type { GradeRange, ModuleStatus } from '../../registry/moduleRegistry';

export type IssueTag = 'görsel' | 'matematik' | 'etkileşim' | 'metin' | 'taşma';
export type ReviewPriority = 'none' | 'must-fix' | 'showcase-candidate' | 'should-fix';

export interface ReviewEntry {
  rating: number;
  tags: IssueTag[];
  note: string;
  priority: ReviewPriority;
  updatedAt?: string;
}

export interface ExportItem extends ReviewEntry {
  moduleId: string;
  title: string;
  grade: number;
  band: GradeRange;
  path: string;
  status: ModuleStatus | 'active';
}

export const STORAGE_KEY = 'dinamik-istasyon:kaptan-review-workbench:v1';
export const issueTags: IssueTag[] = ['görsel', 'matematik', 'etkileşim', 'metin', 'taşma'];
export const bands: GradeRange[] = ['Lise', 'Ortaokul', 'İlkokul'];

export const bandCopy: Record<GradeRange, { range: string; brief: string; auditId: string }> = {
  İlkokul: {
    range: '1-4',
    brief: 'Hızlı anlaşılır mı, oyun hissi var mı, temel kavram sade mi?',
    auditId: 'audit-ilkokul',
  },
  Ortaokul: {
    range: '5-8',
    brief: 'Ana oyuncak güçlü mü, 3D/geometri/oran etkileşimi gerçek mi?',
    auditId: 'audit-ortaokul',
  },
  Lise: {
    range: '9-12',
    brief: 'MEB atomu, sınav dili, teknoloji değeri ve cevap sızıntısı temiz mi?',
    auditId: 'audit-lise',
  },
};

export const priorityCopy: Record<ReviewPriority, { label: string; tone: string; order: number }> = {
  'must-fix': { label: 'Must Fix', tone: 'border-rose-300/45 bg-rose-300/12 text-rose-100', order: 0 },
  'showcase-candidate': { label: 'Vitrin Adayı', tone: 'border-emerald-300/45 bg-emerald-300/12 text-emerald-100', order: 1 },
  'should-fix': { label: 'Should Fix', tone: 'border-amber-300/45 bg-amber-300/12 text-amber-100', order: 2 },
  none: { label: 'İzle', tone: 'border-white/12 bg-white/[0.04] text-white/58', order: 3 },
};

export const statusCopy: Record<ModuleStatus | 'active', string> = {
  active: 'Aktif',
  archived: 'Arşiv',
  draft: 'Taslak',
  'review-needed': 'Görüş Gerekli',
  'showcase-ready': 'Vitrin Hazır',
};

export const emptyEntry: ReviewEntry = {
  rating: 0,
  tags: [],
  note: '',
  priority: 'none',
};

export function getBand(grade: number): GradeRange {
  if (grade <= 4) return 'İlkokul';
  if (grade <= 8) return 'Ortaokul';
  return 'Lise';
}

export function normalizeEntry(value: unknown): ReviewEntry {
  if (!value || typeof value !== 'object') return emptyEntry;
  const source = value as Partial<ReviewEntry>;
  return {
    rating: typeof source.rating === 'number' && source.rating >= 0 && source.rating <= 5 ? source.rating : 0,
    tags: Array.isArray(source.tags)
      ? source.tags.filter((tag): tag is IssueTag => issueTags.includes(tag as IssueTag))
      : [],
    note: typeof source.note === 'string' ? source.note : '',
    priority: source.priority && source.priority in priorityCopy ? source.priority : 'none',
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : undefined,
  };
}

export function hasReviewSignal(entry?: ReviewEntry) {
  if (!entry) return false;
  return entry.rating > 0 || entry.tags.length > 0 || entry.note.trim().length > 0 || entry.priority !== 'none';
}

export function formatDate(value?: string) {
  if (!value) return 'Henüz kaydedilmedi';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
