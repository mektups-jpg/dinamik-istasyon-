import { Check, Hexagon, RotateCcw, Sparkles } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { PolygonMissionTarget, PolygonWorkshopMeasure } from './types';

interface PolygonWorkshopControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: PolygonMissionTarget;
  measure: PolygonWorkshopMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Dışbükey n-gen içinde her köşe kendisi ve iki komşusu dışında n-3 köşeye lazer yollar. Çift sayımı bölünce n(n-3)/2 kalır.',
  'Dış açı yürüyüşünde robot her köşede yön değiştirir. Tam çevreyi dolaşınca yön değişimleri bir tam tur, yani 360° yapar.',
  'Düzgün altıgende her köşe ve her kenar ortası aynalanabilir. Toplam simetri ekseni sayısı kenar sayısıyla eşleşir.',
];

export function PolygonWorkshopControls({
  mission,
  activeIndex,
  target,
  measure,
  missionOk,
  onCheck,
  onReset,
}: PolygonWorkshopControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">çokgen {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif kilit</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Çokgen masası doğru sayı ve doğru tarama ile eşleşti.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="n" value={`${measure.points.length}`} />
        <Metric label="köşegen" value={`${measure.diagonalCount}`} />
        <Metric label="dış açı" value={`${Math.round(measure.exteriorAngle)}°`} />
        <Metric label="seçim" value={measure.selectedLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">sahnenin söylediği kural</p>
        <p className="mt-1 text-sm leading-relaxed text-white/82">{ruleCopy[activeIndex]}</p>
        <p className="mt-2 font-mono text-xs font-black text-white/62">
          {activeIndex === 0 ? measure.formulaLabel : activeIndex === 1 ? measure.exteriorTotalLabel : `simetri ekseni = n = ${measure.symmetryAxes}`}
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="polygon-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Masayı Onayla
        </SciFiButton>
        <SciFiButton data-testid="polygon-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            {activeIndex === 2 ? <Sparkles className="h-5 w-5" /> : <Hexagon className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek masa</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Kenar sayısı, köşegen, dış açı ve simetri aynı çokgen üzerinden okunur.</p>
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
