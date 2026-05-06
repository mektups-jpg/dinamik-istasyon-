import { Check, CircleDot, RotateCcw, ShieldCheck } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { lockLabel } from './identityShieldModel';
import { ShieldLock, ShieldMeasure, ShieldMissionTarget } from './types';

interface IdentityShieldControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: ShieldMissionTarget;
  measure: ShieldMeasure;
  selectedLock: ShieldLock | null;
  missionOk: boolean;
  onSelectLock: (lock: ShieldLock) => void;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'cos² plakası yatay izdüşümün kare enerjisidir.',
  'sin² plakası dikey izdüşümün kare enerjisidir.',
  'İki kare plaka birlikte yarıçap karesini, yani 1 değerini üretir.',
];

export function IdentityShieldControls({
  mission,
  activeIndex,
  target,
  measure,
  selectedLock,
  missionOk,
  onSelectLock,
  onCheck,
  onReset,
}: IdentityShieldControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">kalkan {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? target.success : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="sin x" value={measure.sinValue.toFixed(2)} />
        <Metric label="cos x" value={measure.cosValue.toFixed(2)} />
        <Metric label="sin²" value={measure.sinSquare.toFixed(2)} />
        <Metric label="cos²" value={measure.cosSquare.toFixed(2)} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">seçilen plaka</p>
        <p className="mt-1 text-sm font-black text-white/88">{lockLabel(selectedLock)}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <MiniLock label="cos²" active={selectedLock === 'cos'} expected={target.lock === 'cos'} onClick={() => onSelectLock('cos')} />
        <MiniLock label="sin²" active={selectedLock === 'sin'} expected={target.lock === 'sin'} onClick={() => onSelectLock('sin')} />
        <MiniLock label="1 çekirdeği" active={selectedLock === 'identity'} expected={target.lock === 'identity'} onClick={() => onSelectLock('identity')} />
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="unit-shield-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Kalkanı Onayla
        </SciFiButton>
        <SciFiButton data-testid="unit-shield-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function MiniLock({ label, active, expected, onClick }: { label: string; active: boolean; expected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[42px] items-center justify-between rounded-2xl border px-3 text-left transition ${active ? 'border-cyan-300/45 bg-cyan-300/14 text-white' : 'border-white/10 bg-white/[0.045] text-white/72 hover:bg-white/[0.08]'}`}
    >
      <span className="flex items-center gap-2 text-sm font-black">
        {label === '1 çekirdeği' ? <ShieldCheck className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
        {label}
      </span>
      <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${expected ? 'bg-emerald-300/12 text-emerald-100' : 'bg-white/5 text-white/42'}`}>
        {expected ? 'hedef' : 'bekle'}
      </span>
    </button>
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
