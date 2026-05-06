import { Check, RotateCcw, ScanLine } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { SignMeasure, SignMissionTarget } from './types';

interface SignTableControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: SignMissionTarget;
  measure: SignMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Kökler parabolün x eksenini kestiği duraklardır; işaret bölgeleri bu duraklarda değişir.',
  'Parabol yukarı bakıyorsa köklerin dışındaki iki bölgede ifade pozitiftir.',
  'Aynı parabolde köklerin arasında kalan bölge negatiftir.',
];

export function SignTableControls({
  mission,
  activeIndex,
  target,
  measure,
  missionOk,
  onCheck,
  onReset,
}: SignTableControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">işaret {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'İşaret bandı doğru aralığa kilitlendi.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="sol kök" value={measure.leftRootLabel} />
        <Metric label="sağ kök" value={measure.rightRootLabel} />
        <Metric label="pozitif" value={measure.positiveLabel} />
        <Metric label="negatif" value={measure.negativeLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">işaret kuralı</p>
        <p className="mt-1 text-xs font-black text-cyan-100/70">Önce kökler sınır olur; sonra eşitsizlik bantları bu sınırların dışını veya içini okur.</p>
        <p className="mt-1 text-sm font-black text-white/88">{measure.expression}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="sign-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Aralığı Onayla
        </SciFiButton>
        <SciFiButton data-testid="sign-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek tarama</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Kökler doğruysa işaret tablosu sayı doğrusunda canlı yanar.</p>
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
