import { Check, Grid3X3, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { MosaicMissionTarget, MosaicWorkshopMeasure } from './types';

interface MosaicControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: MosaicMissionTarget;
  measure: MosaicWorkshopMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Boşluksuz kaplamada aynı fayans yuvaları ne açık boşluk ne de üst üste binme bırakır.',
  'Bir noktada birleşen çokgen açıları 360° tam turu doldurursa mozaik kapanır.',
  'Fayans hizasında aynı desen ray boyunca kaydığında kenarlar çakışır ve alarm söner.',
];

export function MosaicControls({
  mission,
  activeIndex,
  target,
  measure,
  missionOk,
  onCheck,
  onReset,
}: MosaicControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">mozaik {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Kaplama masası doğru geometri izini verdi.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="alarm" value={measure.alarmLabel} />
        <Metric label="sapma" value={`${measure.gapLevel}`} />
        <Metric label="açı" value={`${measure.angleTotal}°`} />
        <Metric label="mühür" value={measure.selectedLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">kaplama kuralı</p>
        <p className="mt-1 text-sm leading-relaxed text-white/82">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="mosaic-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Kaplamayı Onayla
        </SciFiButton>
        <SciFiButton data-testid="mosaic-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <Grid3X3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek ölçüt</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Boşluk, açı ve hizalama aynı kaplama alarmını etkiler.</p>
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
