import { Ruler, RotateCcw, TestTube2 } from 'lucide-react';
import { evidenceLabel } from './similarityScaleModel';
import type { SimilarityBuild, SimilarityMission } from './types';

interface SimilarityScaleControlsProps {
  mission: SimilarityMission;
  build: SimilarityBuild;
  activeIndex: number;
  totalMissions: number;
  matched: boolean;
  locked: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function SimilarityScaleControls({
  mission,
  build,
  activeIndex,
  totalMissions,
  matched,
  locked,
  onCheck,
  onReset,
}: SimilarityScaleControlsProps) {
  return (
    <aside
      data-testid="similarity-scale-studio-controls"
      className="rounded-[1.75rem] border border-teal-200/18 bg-black/42 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-teal-100/70">görev {activeIndex + 1}/{totalMissions}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{mission.title}</h2>
        </div>
        <button
          type="button"
          data-testid="similarity-scale-studio-reset"
          onClick={onReset}
          className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-teal-200/35 hover:text-teal-100"
          aria-label="Stüdyoyu sıfırla"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <p className="text-sm font-bold leading-relaxed text-white/70">{mission.prompt}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatusBox label="kanıt" value={evidenceLabel(build, mission)} active={build.selectedPairs.length > 0} />
          <StatusBox label="mühür" value={locked ? 'açıldı' : matched ? 'hazır' : 'bekler'} active={locked || matched} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-300/16 bg-cyan-300/[0.045] p-4">
        <div className="flex items-start gap-2">
          <Ruler className="mt-0.5 h-4 w-4 flex-none text-cyan-100" />
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">stüdyo ipucu</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/64">{mission.hint}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        data-testid="similarity-scale-studio-check"
        onClick={onCheck}
        className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${
          matched || locked
            ? 'border-emerald-300/30 bg-emerald-300/14 text-emerald-100 hover:border-emerald-300/60'
            : 'border-teal-200/24 bg-teal-200/[0.08] text-teal-100 hover:border-teal-200/50'
        }`}
      >
        <TestTube2 className="h-4 w-4" />
        {locked ? 'Sıradaki Kanıta Geç' : 'Stüdyoyu Test Et'}
      </button>
    </aside>
  );
}

function StatusBox({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 ${active ? 'border-teal-200/28 bg-teal-300/[0.08]' : 'border-white/10 bg-black/20'}`}>
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/48">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}
