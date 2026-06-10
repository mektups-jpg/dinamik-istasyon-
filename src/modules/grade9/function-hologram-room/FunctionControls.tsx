import { Check, Move, Orbit, RotateCcw } from 'lucide-react';
import { MissionStep } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { CalibrationTarget, FunctionParams } from './types';
import { formatValue } from './functionModel';

interface FunctionControlsProps {
  mission: MissionStep;
  activeIndex: number;
  params: FunctionParams;
  target: CalibrationTarget;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function FunctionControls(props: FunctionControlsProps) {
  const { mission, activeIndex, params, target, missionOk, onCheck, onReset } = props;

  return (
    <aside className="min-w-0 rounded-[30px] border border-cyan-300/18 bg-black/45 p-4 backdrop-blur-xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">görev {activeIndex + 1}/4</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/70">{mission.prompt}</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="eğim" value={formatValue(params.a)} />
        <Metric label="yatay" value={formatValue(params.r)} />
        <Metric label="dikey" value={formatValue(params.k)} />
      </div>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-amber-300/20 bg-amber-300/[0.07] text-amber-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">hedef doğru</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Senin doğrun hedefle üst üste geldi.' : target.hint}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="function-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          {missionOk ? 'Sonraki Göreve Geç' : 'Kontrol Et'}
        </SciFiButton>
        <SciFiButton data-testid="function-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <Move className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Mavi nokta</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Mavi noktayı sürükle: grafik sağa-sola ve yukarı-aşağı taşınır.</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
            <Orbit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Yeşil eğim noktası</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Yeşil noktayı yukarı/aşağı çek: doğru daha dik veya daha yatık olur.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-1 font-mono text-lg font-black text-white">{value}</p>
    </div>
  );
}
