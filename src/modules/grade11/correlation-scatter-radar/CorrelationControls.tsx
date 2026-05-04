import { Check, RotateCcw, ScanSearch } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { ScatterMeasure, ScatterMissionTarget } from './types';

interface CorrelationControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: ScatterMissionTarget;
  measure: ScatterMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function CorrelationControls({ mission, activeIndex, target, measure, missionOk, onCheck, onReset }: CorrelationControlsProps) {
  const ruleCopy = target.kind === 'place'
    ? 'Serpilme grafiğinde her veri çifti bir noktadır: (x, y).'
    : target.kind === 'positive'
      ? 'Noktalar genel olarak yukarı gidiyorsa pozitif doğrusal ilişki vardır.'
      : 'Noktalar genel olarak aşağı iniyorsa negatif doğrusal ilişki vardır.';

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">radar {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-sky-300/20 bg-sky-300/[0.07] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">hedef kilit</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Radar doğru veri ilişkisini gösteriyor.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="yerleşen" value={`${measure.placedCount}/4`} />
        <Metric label="eğim" value={measure.slope.toFixed(2)} />
        <Metric label="yön" value={measure.direction} />
        <Metric label="hata" value={measure.averageError.toFixed(1)} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">kural</p>
        <p className="mt-1 font-mono text-sm font-black text-white">{ruleCopy}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="correlation-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Radarı Onayla
        </SciFiButton>
        <SciFiButton data-testid="correlation-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
            <ScanSearch className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek fikir</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Korelasyon, noktaların birlikte hangi yöne aktığını gösterir; neden-sonuç kanıtı değildir.</p>
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
