import { RotateCcw, TestTube2 } from 'lucide-react';
import { completedSlotCount, flowLabel } from './algorithmFlowModel';
import type { FlowBuild, FlowMission } from './types';

interface AlgorithmFlowControlsProps {
  mission: FlowMission;
  build: FlowBuild;
  activeIndex: number;
  totalMissions: number;
  matched: boolean;
  locked: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function AlgorithmFlowControls({
  mission,
  build,
  activeIndex,
  totalMissions,
  matched,
  locked,
  onCheck,
  onReset,
}: AlgorithmFlowControlsProps) {
  const filled = completedSlotCount(build);

  return (
    <aside
      data-testid="algorithm-flow-line-controls"
      className="rounded-[1.75rem] border border-cyan-300/18 bg-black/42 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200/70">görev {activeIndex + 1}/{totalMissions}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{mission.title}</h2>
        </div>
        <button
          type="button"
          data-testid="algorithm-flow-line-reset"
          onClick={onReset}
          className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:border-cyan-300/35 hover:text-cyan-100"
          aria-label="Akışı sıfırla"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <p className="text-sm font-bold leading-relaxed text-white/70">{mission.question}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-cyan-300/16 bg-cyan-300/[0.055] p-3">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/64">akış</p>
            <p className="mt-1 text-sm font-black text-white">{flowLabel(build)}</p>
          </div>
          <div className={`rounded-2xl border p-3 ${locked ? 'border-emerald-300/28 bg-emerald-300/[0.08]' : matched ? 'border-amber-300/28 bg-amber-300/[0.08]' : 'border-white/10 bg-white/[0.035]'}`}>
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/48">mühür</p>
            <p className="mt-1 text-sm font-black text-white">{locked ? 'açıldı' : matched ? 'hazır' : 'bekler'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-300/16 bg-emerald-300/[0.045] p-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/70">akış ipucu</p>
        <p className="mt-2 text-sm font-bold leading-relaxed text-white/64">{mission.hint}</p>
      </div>

      <button
        type="button"
        data-testid="algorithm-flow-line-check"
        onClick={onCheck}
        className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${
          filled === build.slots.length
            ? 'border-emerald-300/30 bg-emerald-300/14 text-emerald-100 hover:border-emerald-300/60'
            : 'border-cyan-300/22 bg-cyan-300/[0.08] text-cyan-100 hover:border-cyan-300/48'
        }`}
      >
        <TestTube2 className="h-4 w-4" />
        {locked ? 'Sıradaki Akışa Geç' : 'Akışı Test Et'}
      </button>
    </aside>
  );
}
