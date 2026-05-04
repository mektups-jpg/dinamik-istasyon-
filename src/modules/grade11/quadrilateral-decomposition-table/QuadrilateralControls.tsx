import { Check, RotateCcw, ScissorsLineDashed } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { QuadMeasure, QuadTarget } from './types';
import { formatAreaSumWithUnit, formatAreaWithUnit } from './quadrilateralModel';

interface QuadrilateralControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: QuadTarget;
  measure: QuadMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function QuadrilateralControls({ mission, activeIndex, target, measure, missionOk, onCheck, onReset }: QuadrilateralControlsProps) {
  const ruleCopy = target.kind === 'angle'
    ? 'Bir köşegen dörtgeni iki üçgene ayırır: 180° + 180° = 360°.'
    : 'Dörtgenin alanı, köşegenin oluşturduğu iki üçgen alanının toplamıdır.';

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">ayrıştırma {activeIndex + 1}/2</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">hedef kilit</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Kesim masası hedef matematik ilişkiyi gösteriyor.' : target.hint}</p>
      </div>

      {target.kind === 'angle' ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Metric label="kesim" value={`%${Math.round(measure.cutProgress * 100)}`} />
          <Metric label="toplam" value={`${measure.angleSum}°`} />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Metric label="birleşim" value={`%${Math.round(measure.mergeProgress * 100)}`} />
          <Metric label="toplam" value={formatAreaSumWithUnit(measure.triangleOneArea, measure.triangleTwoArea)} />
          <Metric label="T1 alan" value={formatAreaWithUnit(measure.triangleOneArea)} />
          <Metric label="T2 alan" value={formatAreaWithUnit(measure.triangleTwoArea)} />
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">kural</p>
        <p className="mt-1 font-mono text-sm font-black text-white">{ruleCopy}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="quadrilateral-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Masayı Onayla
        </SciFiButton>
        <SciFiButton data-testid="quadrilateral-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-100">
            <ScissorsLineDashed className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek fikir</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Dörtgeni anlamak için onu iki tanıdık üçgene ayır.</p>
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
