import { Check, Minus, Plus, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import type { ProbabilityMission } from './types';
import {
  OBSERVED_TOTAL,
  PROJECTION_TOTAL,
  SAMPLE_SUCCESS,
  SAMPLE_TOTAL,
  clamp,
} from './probabilityExperimentModel';

interface ProbabilityExperimentControlsProps {
  mission: ProbabilityMission;
  activeIndex: number;
  observedCount: number;
  projectionCount: number;
  observedLocked: boolean;
  projectionLocked: boolean;
  onObservedChange: (value: number) => void;
  onProjectionChange: (value: number) => void;
  onCheck: () => void;
  onReset: () => void;
}

export function ProbabilityExperimentControls({
  mission,
  activeIndex,
  observedCount,
  projectionCount,
  observedLocked,
  projectionLocked,
  onObservedChange,
  onProjectionChange,
  onCheck,
  onReset,
}: ProbabilityExperimentControlsProps) {
  const isProjection = mission.id === 'inductive-projection';
  const locked = isProjection ? projectionLocked : observedLocked;
  const current = isProjection ? projectionCount : observedCount;
  const total = isProjection ? PROJECTION_TOTAL : OBSERVED_TOTAL;
  const update = isProjection ? onProjectionChange : onObservedChange;
  const step = isProjection ? 5 : 1;

  return (
    <aside data-testid="probability-experiment-machine-controls" className="min-w-0 rounded-[34px] border border-cyan-200/18 bg-black/48 p-4 backdrop-blur-xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">olasılık görevi {activeIndex + 1}/2</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/70">{mission.prompt}</p>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.045] p-3 xl:p-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/48">
          {isProjection ? 'tümevarım paneli' : 'gözlem sayacı'}
        </p>
        <div className="mt-4 grid gap-3">
          <MetricLine label={isProjection ? 'Küçük örneklem' : 'Deney kaydı'} value={isProjection ? `${SAMPLE_SUCCESS}/${SAMPLE_TOTAL}` : `${OBSERVED_TOTAL} kayıt`} active />
          <MetricLine label={isProjection ? 'Kurulan tahmin' : 'Kurulan oran'} value={`${current}/${total}`} active={locked} />
          <MetricLine label="Durum" value={locked ? 'kilitli' : 'test bekliyor'} active={locked} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[48px_1fr_48px] gap-2">
        <button
          type="button"
          data-testid="probability-experiment-machine-minus"
          onClick={() => update(clamp(current - step, 0, total))}
          disabled={locked}
          className="grid min-h-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-white transition hover:border-cyan-200/35 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="rounded-2xl border border-cyan-200/18 bg-cyan-200/[0.07] px-3 py-2 text-center font-mono">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/52">sayaç kapağı</p>
          <p className="text-lg font-black text-white">{current}</p>
        </div>
        <button
          type="button"
          data-testid="probability-experiment-machine-plus"
          onClick={() => update(clamp(current + step, 0, total))}
          disabled={locked}
          className="grid min-h-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-white transition hover:border-cyan-200/35 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="probability-experiment-machine-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          {locked ? 'Sonraki Kilidi Aç' : 'Deneyi Test Et'}
        </SciFiButton>
        <SciFiButton data-testid="probability-experiment-machine-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-4 hidden rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4 text-xs leading-relaxed text-emerald-50/75 xl:block">
        {isProjection
          ? 'Küçük örneklem oranı korunur; büyük deneme sayısı aynı oranla tahmin edilir.'
          : 'Gözlemsel olasılık, yapılmış deney kayıtlarının oranından okunur.'}
      </div>
    </aside>
  );
}

function MetricLine({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`flex min-h-[46px] items-center justify-between rounded-xl border px-3 font-mono text-sm ${active ? 'border-cyan-200/35 bg-cyan-200/10 text-cyan-100' : 'border-white/10 bg-black/20 text-white/58'}`}>
      <span>{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}
