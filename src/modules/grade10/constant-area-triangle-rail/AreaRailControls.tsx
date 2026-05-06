import { Check, MoveHorizontal, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { AreaMeasure, AreaMissionTarget } from './types';

interface AreaRailControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: AreaMissionTarget;
  measure: AreaMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'C tepesi tabana paralel bir doğru üzerinde kaldığında yükseklik değişmez.',
  'Üçgen sola veya sağa eğilse bile taban AB ve yükseklik aynıysa alan aynıdır.',
  'Alan mührü yalnız taban ve yükseklik sabit kaldığında kilitlenir.',
];

export function AreaRailControls({
  mission,
  activeIndex,
  target,
  measure,
  missionOk,
  onCheck,
  onReset,
}: AreaRailControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">alan {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Tepe ray hedefinde. Alan mührü sabit kaldı.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="taban" value={`${measure.base} br`} />
        <Metric label="yükseklik" value={`${measure.height} br`} />
        <Metric label="alan" value={`${measure.area} br²`} />
        <Metric label="hedef" value={measure.targetLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">alan kuralı</p>
        <p className="mt-1 text-sm font-black text-white/88">A = taban · yükseklik / 2</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="constant-area-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Alanı Onayla
        </SciFiButton>
        <SciFiButton data-testid="constant-area-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <MoveHorizontal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Paralel ray</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Tepe aynı yükseklik çizgisinde kaldıkça alan değeri sabit kalır.</p>
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
      <p className="font-mono text-xs font-black text-white">{value}</p>
    </div>
  );
}
