import { Check, GitBranch, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { InverseMeasure, InverseMissionTarget } from './types';

interface InverseMirrorControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: InverseMissionTarget;
  measure: InverseMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  '`y=2x+1` ters alınırken x ve y rolleri değişir; sonra y yalnız bırakılır.',
  'Karesel grafikte tek dal seçilmezse yatay test başarısız olur ve ters fonksiyon olmaz.',
  '`1/x` aynaya göre kendine benzer; x=0 yasak duvarı terslemede de korunur.',
];

export function InverseMirrorControls({
  mission,
  activeIndex,
  target,
  measure,
  missionOk,
  onCheck,
  onReset,
}: InverseMirrorControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">ters {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Ters fonksiyon aynası doğru kilide oturdu.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="ayna" value={measure.mirrorLabel} />
        <Metric label="giriş" value={measure.inputLabel} />
        <Metric label="çıkış" value={measure.outputLabel} />
        <Metric label="dal" value={measure.branchLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">rol değişimi</p>
        <p className="mt-1 text-sm leading-relaxed text-white/82">{measure.equation}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="inverse-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Tersi Onayla
        </SciFiButton>
        <SciFiButton data-testid="inverse-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek fikir</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Ters fonksiyon, giriş ve çıkış rollerini güvenli biçimde geri bağlar.</p>
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
