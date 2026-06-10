import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ClipboardCopy, Download, ExternalLink, Filter, RefreshCcw, Search, X } from 'lucide-react';
import { modules, type GradeRange, type ModuleMeta } from '../registry/moduleRegistry';
import { ReviewModuleCard } from './review-workbench/ReviewModuleCard';
import { parseWorkflowBand, useWorkflowScope, workflowScopeToQueryValue } from './workflowScope';
import {
  STORAGE_KEY,
  bandCopy,
  bands,
  emptyEntry,
  getBand,
  hasReviewSignal,
  normalizeEntry,
  priorityCopy,
  type ExportItem,
  type ReviewEntry,
} from './review-workbench/reviewWorkbenchModel';

export default function ReviewWorkbench() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setScope } = useWorkflowScope();
  const initialBand = parseWorkflowBand(searchParams.get('band'));
  const [selectedBand, setSelectedBand] = useState<GradeRange>(initialBand && initialBand !== 'all' ? initialBand : 'Lise');
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<Record<string, ReviewEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [previewModuleId, setPreviewModuleId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);

  useEffect(() => {
    const bandParam = parseWorkflowBand(searchParams.get('band'));
    if (bandParam && bandParam !== 'all') {
      setSelectedBand(bandParam);
      setScope(bandParam);
    }
  }, [searchParams, setScope]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        setEntries(Object.fromEntries(Object.entries(parsed).map(([moduleId, value]) => [moduleId, normalizeEntry(value)])));
      }
    } catch (error) {
      console.warn('Review workbench storage okunamadı:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, isLoaded]);

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');
    return modules
      .filter((module) => getBand(module.grade) === selectedBand)
      .filter((module) => {
        if (!normalizedQuery) return true;
        return `${module.title} ${module.id} ${module.description} ${module.grade}. sınıf`
          .toLocaleLowerCase('tr-TR')
          .includes(normalizedQuery);
      })
      .sort((a, b) => a.grade - b.grade || a.title.localeCompare(b.title, 'tr-TR'));
  }, [query, selectedBand]);

  const reviewedItems = useMemo<ExportItem[]>(() => {
    return modules
      .map((module) => {
        const entry = entries[module.id];
        if (!hasReviewSignal(entry)) return null;
        return {
          ...entry,
          moduleId: module.id,
          title: module.title,
          grade: module.grade,
          band: getBand(module.grade),
          path: module.path,
          status: module.status ?? 'active',
        };
      })
      .filter((item): item is ExportItem => item !== null)
      .sort((a, b) => {
        const priorityDelta = priorityCopy[a.priority].order - priorityCopy[b.priority].order;
        return priorityDelta || b.grade - a.grade || a.title.localeCompare(b.title, 'tr-TR');
      });
  }, [entries]);

  const previewModule = useMemo(() => {
    if (!previewModuleId) return null;
    return filteredModules.find((module) => module.id === previewModuleId) ?? null;
  }, [filteredModules, previewModuleId]);

  const exportPayload = useMemo(() => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        workflow: '3 audit hattı + 1 tek üretim hattı',
        workflowScope: selectedBand,
        productionPriority: [
          'Kaptan Must Fix',
          'Vitrin Adayı',
          '12. sınıf kalan polish',
          '9-11 kalite farkları',
          'Ortaokul/İlkokul cila',
        ],
        items: reviewedItems,
      },
      null,
      2
    );
  }, [reviewedItems]);

  const bandStats = bands.map((band) => {
    const bandModules = modules.filter((module) => getBand(module.grade) === band);
    const reviewedCount = bandModules.filter((module) => hasReviewSignal(entries[module.id])).length;
    return { band, moduleCount: bandModules.length, reviewedCount };
  });

  const updateEntry = (moduleId: string, patch: Partial<ReviewEntry>) => {
    setEntries((current) => ({
      ...current,
      [moduleId]: {
        ...(current[moduleId] ?? emptyEntry),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const clearEntry = (moduleId: string) => {
    setEntries((current) => {
      const next = { ...current };
      delete next[moduleId];
      return next;
    });
  };

  const selectBand = (band: GradeRange) => {
    setSelectedBand(band);
    setScope(band);
    setIsPreviewOpen(false);
    setPreviewModuleId(null);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('band', workflowScopeToQueryValue(band));
      return next;
    });
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(exportPayload);
    setCopyState('copied');
    window.setTimeout(() => setCopyState('idle'), 1400);
  };

  const downloadJson = () => {
    const blob = new Blob([exportPayload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `kaptan-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_24%_10%,rgba(0,229,255,0.16),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(179,136,255,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_36%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-5 py-5 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62 transition hover:border-[#00E5FF]/45 hover:text-[#00E5FF]"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana laboratuvar
            </Link>
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.26em] text-[#00E5FF]">
              Kaptan çalışma yüzeyi
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">İnceleme Paneli</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58 md:text-base">
              Sen modülleri gezerken kısa not bırak; üç audit hattı raporu ayrı toplar, tek üretim hattı sırayla düzeltir.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
            {bandStats.map((stat) => (
              <button
                key={stat.band}
                onClick={() => selectBand(stat.band)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  selectedBand === stat.band
                    ? 'border-[#00E5FF]/60 bg-[#00E5FF]/12 shadow-[0_0_34px_rgba(0,229,255,0.10)]'
                    : 'border-white/10 bg-white/[0.035] hover:border-white/22'
                }`}
              >
                <p className="text-sm font-black">{stat.band}</p>
                <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/44">
                  {bandCopy[stat.band].range}. sınıf
                </p>
                <p className="mt-2 text-xs text-white/54">
                  {stat.reviewedCount}/{stat.moduleCount} notlu
                </p>
              </button>
            ))}
          </div>
        </header>

        <section
          data-testid="workflow-scope-banner"
          className="mt-5 rounded-3xl border border-[#00E5FF]/24 bg-[#00E5FF]/8 px-5 py-4 shadow-[0_0_42px_rgba(0,229,255,0.08)]"
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#00E5FF]">
            Workflow Scope
          </p>
          <p className="mt-1 text-sm font-black text-white">{selectedBand} hattı açık</p>
        </section>

        <main className="flex-1 py-5">
          <section className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/24 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#00E5FF]" />
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#00E5FF]">
                    {bandCopy[selectedBand].auditId}
                  </p>
                </div>
                <p className="mt-2 text-sm text-white/62">{bandCopy[selectedBand].brief}</p>
              </div>
              <label className="relative block w-full lg:w-[360px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/34" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Modül, sınıf veya konu ara"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#050812] pl-11 pr-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#00E5FF]/60"
                />
              </label>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {filteredModules.map((module) => (
                <ReviewModuleCard
                  key={module.id}
                  module={module}
                  entry={entries[module.id]}
                  isPreviewed={isPreviewOpen && previewModule?.id === module.id}
                  onUpdate={(patch) => updateEntry(module.id, patch)}
                  onClear={() => clearEntry(module.id)}
                  onPreview={() => {
                    setPreviewModuleId(module.id);
                    setIsPreviewOpen(true);
                  }}
                />
              ))}
            </div>
          </section>

          <aside className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <ProductionQueue items={reviewedItems} />
            <JsonExportPanel
              exportPayload={exportPayload}
              itemCount={reviewedItems.length}
              copyState={copyState}
              onCopy={copyJson}
              onDownload={downloadJson}
            />
          </aside>
        </main>
      </div>

      {isPreviewOpen && (
        <ModulePreviewPanel
          module={previewModule}
          version={previewVersion}
          onRefresh={() => setPreviewVersion((current) => current + 1)}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
}

function ModulePreviewPanel({
  module,
  version,
  onRefresh,
  onClose,
}: {
  module: ModuleMeta | null;
  version: number;
  onRefresh: () => void;
  onClose: () => void;
}) {
  const previewSrc = module ? withReviewQuery(module.path, version) : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-md md:p-6" onClick={onClose}>
      <section
        className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#00E5FF]/28 bg-[#06101e] shadow-[0_24px_120px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
      <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]">
            Canlı modül önizleme
          </p>
          <h2 className="mt-1 truncate text-xl font-black text-white">{module?.title ?? 'Modül seç'}</h2>
          {module && (
            <p className="mt-1 text-xs font-bold text-white/46">
              {module.grade}. sınıf · {module.category}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={!module}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-[#00E5FF]/45 hover:text-[#00E5FF] disabled:opacity-40"
            title="Önizlemeyi yenile"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-rose-300/45 hover:text-rose-100"
            title="Önizlemeyi kapat"
          >
            <X className="h-4 w-4" />
          </button>
          {module && (
            <Link
              to={module.path}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-[#00E5FF]/45 hover:text-[#00E5FF]"
              title="Yeni sekmede aç"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 bg-black/42 p-3">
        {module ? (
          <iframe
            key={previewSrc}
            src={previewSrc}
            title={`${module.title} önizleme`}
            className="h-full min-h-[520px] w-full rounded-2xl border border-white/10 bg-[#050812]"
          />
        ) : (
          <div className="grid h-[520px] place-items-center rounded-2xl border border-dashed border-white/12 text-sm font-bold text-white/42">
            Soldan bir modül seçince burada açılacak.
          </div>
        )}
      </div>
    </section>
    </div>
  );
}

function ProductionQueue({ items }: { items: ExportItem[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#07101d]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]">
        Tek üretim kuyruğu
      </p>
      <h2 className="mt-2 text-xl font-black">Düzeltme sırası</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/12 p-4 text-sm leading-relaxed text-white/48">
            Henüz Kaptan notu yok. Bir modüle puan, etiket veya not ekleyince burada üretim sırası oluşacak.
          </p>
        ) : (
          items.slice(0, 10).map((item) => (
            <div key={item.moduleId} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-white/44">
                    {item.grade}. sınıf · {item.band}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black ${priorityCopy[item.priority].tone}`}>
                  {priorityCopy[item.priority].label}
                </span>
              </div>
              {item.note && <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/64">{item.note}</p>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function JsonExportPanel({
  exportPayload,
  itemCount,
  copyState,
  onCopy,
  onDownload,
}: {
  exportPayload: string;
  itemCount: number;
  copyState: 'idle' | 'copied';
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/42">
            Kaptan Feedback JSON
          </p>
          <p className="mt-1 text-sm text-white/58">{itemCount} kayıt dışa aktarılabilir.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            aria-label="Kaptan Feedback JSON kopyala"
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-[#00E5FF]/45 hover:text-[#00E5FF]"
            title="JSON kopyala"
          >
            <ClipboardCopy className="h-4 w-4" />
          </button>
          <button
            onClick={onDownload}
            aria-label="Kaptan Feedback JSON indir"
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-[#00E5FF]/45 hover:text-[#00E5FF]"
            title="JSON indir"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      <textarea
        readOnly
        value={exportPayload}
        className="mt-4 h-56 w-full resize-none rounded-2xl border border-white/10 bg-[#03060d] p-3 font-mono text-[11px] leading-relaxed text-white/46 outline-none"
      />
      <p className="mt-3 text-xs font-bold text-emerald-200/80">
        {copyState === 'copied' ? 'JSON kopyalandı.' : 'Bu çıktı benim üretim kuyruğuna çevireceğim ham kaptan notudur.'}
      </p>
    </section>
  );
}

function withReviewQuery(path: string, version: number) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}review-workbench=1&v=${version}`;
}
