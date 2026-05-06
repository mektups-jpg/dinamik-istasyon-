import { Check, CircleDot, RotateCcw, ShieldCheck } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { modeLabel } from './countingModel';
import { CountingMeasure, CountingMode, CountingState, CountingTarget } from './types';

interface CountingLineControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: CountingTarget;
  measure: CountingMeasure;
  state: CountingState;
  missionOk: boolean;
  onSelectMode: (mode: CountingMode) => void;
  onSelectToken: (value: number) => void;
  onToggleSeal: () => void;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Aynı ürün için renk ve rozet birlikte seçiliyorsa seçenekler çarpılır.',
  'Drone veya rover gibi ayrık hatlar varsa seçenekler toplanır.',
  'Önce durumun birlikte mi ayrık mı olduğunu ayır; işlem sonra gelir.',
];

export function CountingLineControls({
  mission,
  activeIndex,
  target,
  measure,
  state,
  missionOk,
  onSelectMode,
  onSelectToken,
  onToggleSeal,
  onCheck,
  onReset,
}: CountingLineControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">sayma {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? target.success : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="ifade" value={measure.expression} />
        <Metric label="sonuç" value={target.id === 'seal' ? 'kural' : String(measure.expected)} />
        <Metric label="mod" value={modeLabel(state.selectedMode)} />
        <Metric label="token" value={measure.selectedTokenLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">sayma kuralı</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <MiniChoice label="çarpma bandı" active={state.selectedMode === 'product'} expected={target.id === 'product'} onClick={() => onSelectMode('product')} />
        <MiniChoice label="toplama bandı" active={state.selectedMode === 'sum'} expected={target.id === 'sum'} onClick={() => onSelectMode('sum')} />
        <MiniChoice label="sayma mührü" active={state.sealArmed} expected={target.id === 'seal'} onClick={onToggleSeal} seal />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniChoice label="6 tokenı" active={state.selectedToken === 6} expected={target.expected === 6} onClick={() => onSelectToken(6)} />
        <MiniChoice label="7 tokenı" active={state.selectedToken === 7} expected={target.expected === 7} onClick={() => onSelectToken(7)} />
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="counting-line-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Bandı Onayla
        </SciFiButton>
        <SciFiButton data-testid="counting-line-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function MiniChoice({ label, active, expected, onClick, seal = false }: { label: string; active: boolean; expected: boolean; onClick: () => void; seal?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[42px] items-center justify-between rounded-2xl border px-3 text-left transition ${active ? 'border-cyan-300/45 bg-cyan-300/14 text-white' : 'border-white/10 bg-white/[0.045] text-white/72 hover:bg-white/[0.08]'}`}
    >
      <span className="flex items-center gap-2 text-sm font-black">
        {seal ? <ShieldCheck className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
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
      <p className="font-mono text-[11px] font-black text-white">{value}</p>
    </div>
  );
}
