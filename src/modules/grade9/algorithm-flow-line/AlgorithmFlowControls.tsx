import { RotateCcw } from 'lucide-react';
import { completedSlotCount, flowLabel } from './algorithmFlowModel';
import type { FlowBuild, FlowMission } from './types';

interface AlgorithmFlowControlsProps {
  mission: FlowMission;
  build: FlowBuild;
  activeIndex: number;
  totalMissions: number;
  matched: boolean;
  locked: boolean;
  orderWarning: boolean;
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
  orderWarning,
  onCheck,
  onReset,
}: AlgorithmFlowControlsProps) {
  const filled = completedSlotCount(build);
  const readyToCheck = filled === build.slots.length;
  const disabledCheck = !locked && !readyToCheck;

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

      <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/[0.10] p-4 shadow-[0_0_28px_rgba(251,191,36,0.08)]">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-100/72">ana soru</p>
        <p className="mt-2 text-base font-black leading-relaxed text-white">{mission.question}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-cyan-300/16 bg-cyan-300/[0.055] p-3">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/64">akış</p>
            <p className="mt-1 text-sm font-black text-white">{flowLabel(build)}</p>
          </div>
          <div className={`rounded-2xl border p-3 ${locked ? 'border-emerald-300/28 bg-emerald-300/[0.08]' : orderWarning ? 'border-rose-300/30 bg-rose-300/[0.08]' : matched ? 'border-amber-300/28 bg-amber-300/[0.08]' : 'border-white/10 bg-white/[0.035]'}`}>
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/48">sonuç</p>
            <p className="mt-1 text-sm font-black text-white">{locked ? 'açıldı' : orderWarning ? 'sıra düzelt' : matched ? 'kontrol et' : 'bekler'}</p>
          </div>
        </div>
      </div>

      <div className={`mt-4 rounded-2xl border p-4 ${orderWarning ? 'border-rose-300/22 bg-rose-300/[0.055]' : 'border-emerald-300/16 bg-emerald-300/[0.045]'}`}>
        <p className={`font-mono text-[10px] font-black uppercase tracking-[0.22em] ${orderWarning ? 'text-rose-100/78' : 'text-emerald-200/70'}`}>
          {orderWarning ? 'düzeltme ipucu' : 'akış ipucu'}
        </p>
        <p className="mt-2 text-sm font-bold leading-relaxed text-white/64">
          {orderWarning ? 'İlk hatalı kutuya dokun; o adımdan sonrası temizlenir, sonra doğru adımı seç.' : mission.hint}
        </p>
      </div>

      {readyToCheck || locked ? (
        <div className="mt-4 rounded-2xl border border-emerald-300/16 bg-emerald-300/[0.055] p-3">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-emerald-100/70">sonraki dokunuş</p>
          <p className="mt-1 text-sm font-black leading-snug text-white/72">Sahnedeki sonuç alanını kullan.</p>
        </div>
      ) : (
        <button
          type="button"
          data-testid="algorithm-flow-line-check"
          disabled={disabledCheck}
          onClick={onCheck}
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm font-black text-white/38"
        >
          Önce Blokları Yerleştir
        </button>
      )}
    </aside>
  );
}
