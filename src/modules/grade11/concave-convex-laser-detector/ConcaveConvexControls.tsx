import { Check, RotateCcw, ScanLine } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { DetectorMeasure, DetectorTarget } from './types';

interface ConcaveConvexControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: DetectorTarget;
  measure: DetectorMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function ConcaveConvexControls({
  mission,
  activeIndex,
  target,
  measure,
  missionOk,
  onCheck,
  onReset,
}: ConcaveConvexControlsProps) {
  const ruleCopy = target.profile === 'convex'
    ? 'Konveks çokgende bütün iç açılar 180° altındadır; lazer kırmızı alarm yakalamaz.'
    : 'Konkav çokgende içeri göçen en az bir köşe 180° üstü alarm üretir.';

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">dedektör {activeIndex + 1}/2</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-sky-300/20 bg-sky-300/[0.07] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">sınıflandırma kilidi</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Tarama ve seçilen kilit aynı matematik işaretini gösteriyor.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="tarama" value={`%${Math.round(measure.scanProgress * 100)}`} />
        <Metric label="açı" value={measure.activeAngleLabel} />
        <Metric label="köşe" value={`${measure.scannedCount}/5`} />
        <Metric label="seçim" value={measure.selectedLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">kural</p>
        <p className="mt-1 text-sm leading-relaxed text-white/82">{ruleCopy}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="concave-convex-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Dedektörü Onayla
        </SciFiButton>
        <SciFiButton data-testid="concave-convex-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek işaret</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">180° eşiği geçerse şekil içbükeydir.</p>
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
