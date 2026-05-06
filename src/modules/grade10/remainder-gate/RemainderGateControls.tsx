import { Check, CircleDot, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { lensLabel } from './remainderModel';
import { RemainderLens, RemainderMeasure, RemainderState, RemainderTarget } from './types';

interface RemainderGateControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: RemainderTarget;
  measure: RemainderMeasure;
  state: RemainderState;
  missionOk: boolean;
  onSelectLens: (lens: RemainderLens) => void;
  onSelectRemainder: (value: number) => void;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Mod 9 kapısı bütün sayıyı rakam toplamına indirir.',
  'Mod 5 kapısı yalnız son basamağı okur.',
  'Mod 4 kapısı yalnız son iki basamağı okur.',
];

export function RemainderGateControls({
  mission,
  activeIndex,
  target,
  measure,
  state,
  missionOk,
  onSelectLens,
  onSelectRemainder,
  onCheck,
  onReset,
}: RemainderGateControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">kapı {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? target.success : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="sayı" value={String(measure.number)} />
        <Metric label="mod" value={String(measure.modulus)} />
        <Metric label="lens" value={lensLabel(state.selectedLens)} />
        <Metric label="kalan" value={measure.selectedRemainderLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">kural izi</p>
        <p className="mt-1 text-sm font-black text-white/88">{measure.trace}: {measure.traceValue}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <MiniChoice label="rakam toplamı" active={state.selectedLens === 'sum'} expected={target.id === 'sum'} onClick={() => onSelectLens('sum')} />
        <MiniChoice label="son basamak" active={state.selectedLens === 'last-digit'} expected={target.id === 'last-digit'} onClick={() => onSelectLens('last-digit')} />
        <MiniChoice label="son iki basamak" active={state.selectedLens === 'last-two'} expected={target.id === 'last-two'} onClick={() => onSelectLens('last-two')} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniChoice label="kalan 2" active={state.selectedRemainder === 2} expected={target.expectedRemainder === 2} onClick={() => onSelectRemainder(2)} />
        <MiniChoice label="kalan 3" active={state.selectedRemainder === 3} expected={target.expectedRemainder === 3} onClick={() => onSelectRemainder(3)} />
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="remainder-gate-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Kapıyı Onayla
        </SciFiButton>
        <SciFiButton data-testid="remainder-gate-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function MiniChoice({ label, active, expected, onClick }: { label: string; active: boolean; expected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[42px] items-center justify-between rounded-2xl border px-3 text-left transition ${active ? 'border-cyan-300/45 bg-cyan-300/14 text-white' : 'border-white/10 bg-white/[0.045] text-white/72 hover:bg-white/[0.08]'}`}
    >
      <span className="flex items-center gap-2 text-sm font-black">
        <CircleDot className="h-4 w-4" />
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
