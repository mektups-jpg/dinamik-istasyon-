import { ExternalLink, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ModuleMeta } from '../../registry/moduleRegistry';
import {
  emptyEntry,
  formatDate,
  hasReviewSignal,
  issueTags,
  priorityCopy,
  statusCopy,
  type IssueTag,
  type ReviewEntry,
} from './reviewWorkbenchModel';

interface ReviewModuleCardProps {
  module: ModuleMeta;
  entry?: ReviewEntry;
  onUpdate: (patch: Partial<ReviewEntry>) => void;
  onClear: () => void;
}

export function ReviewModuleCard({ module, entry = emptyEntry, onUpdate, onClear }: ReviewModuleCardProps) {
  const status = module.status ?? 'active';
  const hasSignal = hasReviewSignal(entry);

  const toggleTag = (tag: IssueTag) => {
    const nextTags = entry.tags.includes(tag)
      ? entry.tags.filter((currentTag) => currentTag !== tag)
      : [...entry.tags, tag];
    onUpdate({ tags: nextTags });
  };

  return (
    <article
      className={`rounded-3xl border p-5 transition ${
        hasSignal
          ? 'border-[#00E5FF]/28 bg-[#061626]/88 shadow-[0_20px_70px_rgba(0,229,255,0.08)]'
          : 'border-white/10 bg-white/[0.035]'
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/56">
              {module.grade}. sınıf
            </span>
            <span className="rounded-full border border-[#00E5FF]/18 bg-[#00E5FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8DF4FF]">
              {module.category}
            </span>
            <span className="rounded-full border border-amber-200/16 bg-amber-200/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/78">
              {statusCopy[status]}
            </span>
          </div>
          <h3 className="text-xl font-black leading-tight text-white">
            <Link to={module.path} className="transition hover:text-[#8DF4FF]">
              {module.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">{module.description}</p>
        </div>

        <Link
          to={module.path}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/10 px-4 py-3 text-sm font-black text-[#8DF4FF] transition hover:border-[#00E5FF]/55 hover:bg-[#00E5FF]/16"
        >
          Modülü aç
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/42">
            Hızlı puan
          </p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onUpdate({ rating })}
                className={`flex h-10 items-center justify-center rounded-xl border transition ${
                  entry.rating === rating
                    ? 'border-[#00E5FF]/60 bg-[#00E5FF]/16 text-[#00E5FF]'
                    : 'border-white/10 bg-white/[0.04] text-white/42 hover:border-white/24'
                }`}
                title={`${rating}/5`}
              >
                <Star className={`h-4 w-4 ${entry.rating >= rating ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>

          <p className="mb-3 mt-5 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/42">
            Öncelik
          </p>
          <div className="grid gap-2">
            {(Object.keys(priorityCopy) as Array<keyof typeof priorityCopy>).map((priority) => (
              <button
                key={priority}
                onClick={() => onUpdate({ priority })}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-black transition ${
                  entry.priority === priority ? priorityCopy[priority].tone : 'border-white/10 bg-white/[0.035] text-white/46'
                }`}
              >
                {priorityCopy[priority].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/42">
              Hata etiketi
            </p>
            <div className="flex flex-wrap gap-2">
              {issueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                    entry.tags.includes(tag)
                      ? 'border-[#00E5FF]/60 bg-[#00E5FF]/14 text-[#8DF4FF]'
                      : 'border-white/10 bg-white/[0.035] text-white/44 hover:border-white/24'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/42">
              Kaptan notu
            </span>
            <textarea
              value={entry.note}
              onChange={(event) => onUpdate({ note: event.currentTarget.value })}
              placeholder="Örn: Sayılar küçük kalmış, sürükleme hissi yok, yanlış cevapta nedenini söylemiyor."
              className="h-24 w-full resize-none rounded-2xl border border-white/10 bg-[#03060d] p-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-[#00E5FF]/55"
            />
          </label>

          <div className="flex items-center justify-between gap-3 text-xs text-white/38">
            <span>Son kayıt: {formatDate(entry.updatedAt)}</span>
            {hasSignal && (
              <button
                onClick={onClear}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-bold text-white/52 transition hover:border-rose-300/40 hover:text-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Notu temizle
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
