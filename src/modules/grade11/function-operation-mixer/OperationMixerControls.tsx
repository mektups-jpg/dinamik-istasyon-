import { Check, Divide, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { OperationMeasure, OperationTarget } from './types';
import { operationMeta } from './operationMixerModel';

interface OperationMixerControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: OperationTarget;
  measure: OperationMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function OperationMixerControls({ mission, activeIndex, target, measure, missionOk, onCheck, onReset }: OperationMixerControlsProps) {
  const targetMeta = operationMeta[target.operation];

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">işlem mikseri {activeIndex + 1}/4</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.045] text-white/78'}`}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-3" style={{ color: targetMeta.color }}>
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif işlem kapısı</p>
            <p className="mt-1 text-lg font-black">{measure.operationLabel}</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed opacity-76">{missionOk ? 'Kadran doğru işlem kapısına kilitlendi.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="hedef" value={targetMeta.symbol} />
        <Metric label="seçili" value={measure.operationSymbol} />
        <Metric label="formül" value={target.formula} />
        <Metric label="güvenlik" value={measure.safetyLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
            <Divide className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek fikir</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Aynı x hattındaki f ve g değerleri seçilen işlem kapısından geçer. Bölmede g(x)=0 hattı kapanır.</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="function-operation-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Mikseri Onayla
        </SciFiButton>
        <SciFiButton data-testid="function-operation-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="font-mono text-xs font-black text-white xl:text-sm">{value}</p>
    </div>
  );
}
