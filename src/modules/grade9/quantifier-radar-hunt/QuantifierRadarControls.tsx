import { Radar, RotateCcw, TestTube2 } from 'lucide-react';
import { evidenceLabel, quantifierLabels, quantifierText } from './quantifierRadarModel';
import type { Quantifier, QuantifierMission, RadarBuild } from './types';

const quantifierTestIds: Record<Quantifier, string> = {
  all: 'quantifier-radar-hunt-quantifier-all',
  some: 'quantifier-radar-hunt-quantifier-some',
};

interface QuantifierRadarControlsProps {
  mission: QuantifierMission;
  build: RadarBuild;
  activeIndex: number;
  totalMissions: number;
  matched: boolean;
  locked: boolean;
  onSetQuantifier: (quantifier: Quantifier) => void;
  onCheck: () => void;
  onReset: () => void;
}

export function QuantifierRadarControls({
  mission,
  build,
  activeIndex,
  totalMissions,
  matched,
  locked,
  onSetQuantifier,
  onCheck,
  onReset,
}: QuantifierRadarControlsProps) {
  return (
    <aside
      data-testid="quantifier-radar-hunt-controls"
      className="rounded-[1.75rem] border border-lime-200/18 bg-black/42 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-lime-100/70">görev {activeIndex + 1}/{totalMissions}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{mission.title}</h2>
        </div>
        <button
          type="button"
          data-testid="quantifier-radar-hunt-reset"
          onClick={onReset}
          className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-lime-200/35 hover:text-lime-100"
          aria-label="Radarı sıfırla"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <p className="text-sm font-bold leading-relaxed text-white/70">{mission.prompt}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatusBox label="niceleyici" value={quantifierText(build.quantifier)} active={Boolean(build.quantifier)} />
          <StatusBox label="kanıt" value={evidenceLabel(build, mission)} active={build.selectedIds.length > 0} />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <QuantifierButton
          quantifier="all"
          selected={build.quantifier === 'all'}
          disabled={locked}
          onSetQuantifier={onSetQuantifier}
          detail="Bütün elemanlar koşuldan geçer."
        />
        <QuantifierButton
          quantifier="some"
          selected={build.quantifier === 'some'}
          disabled={locked}
          onSetQuantifier={onSetQuantifier}
          detail="En az bir eleman kanıt olur."
        />
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-300/16 bg-cyan-300/[0.045] p-4">
        <div className="flex items-start gap-2">
          <Radar className="mt-0.5 h-4 w-4 flex-none text-cyan-100" />
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">radar ipucu</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/64">{mission.hint}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        data-testid="quantifier-radar-hunt-check"
        onClick={onCheck}
        className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${
          matched || locked
            ? 'border-emerald-300/30 bg-emerald-300/14 text-emerald-100 hover:border-emerald-300/60'
            : 'border-lime-200/24 bg-lime-200/[0.08] text-lime-100 hover:border-lime-200/50'
        }`}
      >
        <TestTube2 className="h-4 w-4" />
        {locked ? 'Sıradaki Taramaya Geç' : 'Radarı Test Et'}
      </button>
    </aside>
  );
}

function QuantifierButton({
  quantifier,
  selected,
  disabled,
  detail,
  onSetQuantifier,
}: {
  quantifier: Quantifier;
  selected: boolean;
  disabled: boolean;
  detail: string;
  onSetQuantifier: (quantifier: Quantifier) => void;
}) {
  const item = quantifierLabels[quantifier];

  return (
    <button
      type="button"
      data-testid={quantifierTestIds[quantifier]}
      disabled={disabled}
      onClick={() => onSetQuantifier(quantifier)}
      className={`min-h-[72px] rounded-2xl border p-3 text-left transition ${
        selected
          ? 'border-lime-200/50 bg-lime-300/[0.13] text-lime-50 shadow-[0_0_28px_rgba(190,242,100,0.16)]'
          : 'border-white/10 bg-white/[0.035] text-white/68 hover:border-cyan-200/32 hover:bg-cyan-300/[0.055]'
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-black/30 text-2xl font-black">{item.symbol}</span>
        <span>
          <span className="block text-base font-black">{item.label}</span>
          <span className="block text-[11px] font-bold text-white/52">{item.short}</span>
        </span>
      </span>
      <span className="mt-2 block text-xs font-bold text-white/55">{detail}</span>
    </button>
  );
}

function StatusBox({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 ${active ? 'border-lime-200/28 bg-lime-300/[0.08]' : 'border-white/10 bg-black/20'}`}>
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/48">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}
