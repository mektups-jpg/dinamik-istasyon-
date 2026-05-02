import { Check, DoorOpen, RotateCcw, ShieldAlert } from 'lucide-react';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { DomainParams, DomainTarget } from './types';
import { formatValue, getXValue } from './domainModel';

interface DomainGatesControlsProps {
  mission: MissionStep;
  activeIndex: number;
  params: DomainParams;
  target: DomainTarget;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function DomainGatesControls({
  mission,
  activeIndex,
  params,
  target,
  missionOk,
  onCheck,
  onReset,
}: DomainGatesControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">kapı kalibrasyonu {activeIndex + 1}/4</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/72">{mission.prompt}</p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">aktif kapı konumu</p>
        <p className="mt-1 font-mono text-3xl font-black text-white">x={formatValue(getXValue(params, target.dragTarget))}</p>
        <p className="mt-1 text-xs font-bold text-cyan-100/55">hedef x={formatValue(target.targetX)}</p>
      </div>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-amber-300/20 bg-amber-300/[0.07] text-amber-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">hedef</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Kapı x=0 çizgisine kilitlendi.' : target.hint}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="domain-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Kapıyı Onayla
        </SciFiButton>
        <SciFiButton data-testid="domain-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <DoorOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Karekök kapısı</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Karekök eğrisi başlangıç çizgisinin solunda gerçek değer üretmez.</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-rose-100">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Asimptot duvarı</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Rasyonel grafik paydayı sıfır yapan çizgiye yaklaşır ama oradan geçmez.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
