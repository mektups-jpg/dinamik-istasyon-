import { Check, RotateCcw, Sprout } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { ExponentialMeasure, ExponentialTarget } from './types';
import { formatBase, formatValue } from './exponentialModel';

interface ExponentialGrowthControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: ExponentialTarget;
  measure: ExponentialMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

const modeLabel = {
  growth: 'Artan',
  decay: 'Azalan',
  neutral: 'Nötr',
};

export function ExponentialGrowthControls({ mission, activeIndex, target, measure, missionOk, onCheck, onReset }: ExponentialGrowthControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">üstel reaktör {activeIndex + 1}/2</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">hedef davranış</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Taban doğru bölgede; grafik beklenen yönde akıyor.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="taban" value={`a=${formatBase(measure.base)}`} />
        <Metric label="mod" value={modeLabel[measure.mode]} />
        <Metric label="f(-2)" value={formatValue(measure.leftValue)} />
        <Metric label="f(2)" value={formatValue(measure.rightValue)} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">kural</p>
        <p className="mt-1 font-mono text-sm font-black text-white">{measure.mode === 'growth' ? 'a>1 ise x artarken a^x artar.' : measure.mode === 'decay' ? '0<a<1 ise x artarken a^x azalır.' : 'a=1 çevresi grafiği neredeyse düz tutar.'}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="exponential-growth-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Grafiği Onayla
        </SciFiButton>
        <SciFiButton data-testid="exponential-growth-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek fikir</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Taban 1'in hangi tarafındaysa eğrinin yönü de oradan belirlenir.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="font-mono text-sm font-black text-white">{value}</p>
    </div>
  );
}
