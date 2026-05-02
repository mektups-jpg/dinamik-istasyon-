import { Check, Crosshair, RotateCcw, Triangle } from 'lucide-react';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { RatioTarget, SideSelection, TriangleMeasure } from './types';
import { getSideValue, ratioValue, sideLabel } from './theodoliteModel';

interface TheodoliteControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: RatioTarget;
  measure: TriangleMeasure;
  selection: SideSelection;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function TheodoliteControls({ mission, activeIndex, target, measure, selection, missionOk, onCheck, onReset }: TheodoliteControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">teodolit oranı {activeIndex + 1}/4</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/72">{mission.prompt}</p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">aktif oran</p>
        <p className="mt-1 font-mono text-4xl font-black text-white">{target.label}</p>
        <p className="mt-1 text-xs font-bold text-cyan-100/55">açı {measure.angle}°</p>
      </div>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-amber-300/20 bg-amber-300/[0.07] text-amber-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">oran okuyucu</p>
        <p className="mt-1 text-lg font-black">
          {selection.numerator ? sideLabel[selection.numerator] : 'Pay seç'} / {selection.denominator ? sideLabel[selection.denominator] : 'Payda seç'}
        </p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? `${target.label} = ${ratioValue(measure, target)}` : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {(['opposite', 'adjacent', 'hypotenuse'] as const).map((side) => (
          <div key={side} className="rounded-2xl border border-white/10 bg-white/[0.045] p-2">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">{sideLabel[side]}</p>
            <p className="font-mono text-sm font-black text-white">{getSideValue(measure, side)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="trig-theodolite-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Oranı Onayla
        </SciFiButton>
        <SciFiButton data-testid="trig-theodolite-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <Crosshair className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Açı kolu</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Hedef ışın döndükçe karşı ve komşu uzunluklar canlı değişir.</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
            <Triangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Oran seçimi</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Önce pay olacak kenarı, sonra payda olacak kenarı seç.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
