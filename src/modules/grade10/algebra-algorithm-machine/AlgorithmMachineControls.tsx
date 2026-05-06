import { Check, CircleDot, Code2, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { choiceLabel } from './algorithmModel';
import { AlgorithmChoice, AlgorithmMeasure, AlgorithmState, AlgorithmTarget } from './types';

interface AlgorithmMachineControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: AlgorithmTarget;
  measure: AlgorithmMeasure;
  state: AlgorithmState;
  missionOk: boolean;
  onSelectChoice: (choice: AlgorithmChoice) => void;
  onSelectOutput: (value: number) => void;
  onToggleSeal: () => void;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Algoritma önce hangi verinin makineye girdiğini bilmelidir.',
  'İşlem sırası değişirse çıktı değişir; bloklar soldan sağa okunur.',
  'Sözde kod, cebirsel işlem zincirini tekrar edilebilir komuta çevirir.',
];

export function AlgorithmMachineControls({
  mission,
  activeIndex,
  target,
  measure,
  state,
  missionOk,
  onSelectChoice,
  onSelectOutput,
  onToggleSeal,
  onCheck,
  onReset,
}: AlgorithmMachineControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">algoritma {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? target.success : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="ifade" value={measure.expression} />
        <Metric label="seçim" value={choiceLabel(state.selectedChoice)} />
        <Metric label="çıktı" value={measure.selectedOutputLabel} />
        <Metric label="ray" value={measure.targetLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">algoritma kuralı</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <MiniChoice label="x=3 girdi bloğu" active={state.selectedChoice === 'input'} expected={target.id === 'input'} onClick={() => onSelectChoice('input')} />
        <MiniChoice label="işlem boru hattı" active={state.selectedChoice === 'pipeline'} expected={target.id === 'pipeline'} onClick={() => onSelectChoice('pipeline')} />
        <MiniChoice label="kod mührü" active={state.codeSealed} expected={target.id === 'seal'} onClick={onToggleSeal} seal />
      </div>

      <div className="mt-4">
        <MiniChoice label="çıktı tokenı 7" active={state.selectedOutput === 7} expected={target.id === 'pipeline'} onClick={() => onSelectOutput(7)} />
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="algorithm-machine-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Akışı Onayla
        </SciFiButton>
        <SciFiButton data-testid="algorithm-machine-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
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
        {seal ? <Code2 className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
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
