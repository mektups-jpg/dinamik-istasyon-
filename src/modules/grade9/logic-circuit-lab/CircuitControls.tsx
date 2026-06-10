import { Check, Power, RotateCcw, Zap } from 'lucide-react';
import { MissionStep } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { CircuitInputs, GateMissionTarget } from './types';
import { gateName, gateSymbol } from './circuitModel';

interface CircuitControlsProps {
  mission: MissionStep;
  activeIndex: number;
  inputs: CircuitInputs;
  target: GateMissionTarget;
  output: boolean;
  verdict: 'wrong' | null;
  setInput: (key: keyof CircuitInputs, value: boolean) => void;
  onCheck: () => void;
  onReset: () => void;
}

export function CircuitControls(props: CircuitControlsProps) {
  const { mission, activeIndex, inputs, target, output, verdict, setInput, onCheck, onReset } = props;
  const hasWrongCheck = verdict === 'wrong';

  return (
    <aside className="min-w-0 rounded-[26px] border border-sky-300/22 bg-black/45 p-4 backdrop-blur-xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">kapı testi {activeIndex + 1}/4</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/70">{mission.prompt}</p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3 xl:p-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-300/18 bg-sky-300/[0.07] px-4 py-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-100/55">aktif kartuş</p>
            <p className="mt-1 text-lg font-black text-white">{gateName(target.gate)} <span className="text-sky-200">{gateSymbol(target.gate)}</span></p>
          </div>
          <Zap className="h-6 w-6 text-[#00E5FF]" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <ToggleSwitch label="A" value={inputs.a} testId="logic-input-a" onClick={() => setInput('a', !inputs.a)} />
          <ToggleSwitch label="B" value={inputs.b} testId="logic-input-b" onClick={() => setInput('b', !inputs.b)} />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="logic-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Devreyi Test Et
        </SciFiButton>
        <SciFiButton data-testid="logic-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${hasWrongCheck ? 'border-pink-300/25 bg-pink-300/10 text-pink-100' : 'border-amber-300/20 bg-amber-300/[0.07] text-amber-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">canlı okuma</p>
        <p className="mt-1 text-lg font-black">
          A={Number(inputs.a)} · B={Number(inputs.b)} · Y={Number(output)}
        </p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{hasWrongCheck ? 'Bu satır hedefe uymadı; sahnedeki A/B anahtarlarını değiştir.' : target.rule}</p>
      </div>
    </aside>
  );
}

function ToggleSwitch({ label, value, testId, onClick }: { label: string; value: boolean; testId: string; onClick: () => void }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`min-h-[76px] rounded-2xl border p-4 text-left transition ${value ? 'border-[#00FF88]/40 bg-[#00FF88]/12 text-[#00FF88] shadow-[0_0_24px_rgba(0,255,136,0.12)]' : 'border-slate-400/30 bg-slate-400/10 text-slate-300'}`}
    >
      <Power className="mb-1 h-4 w-4" />
      <p className="font-mono text-3xl font-black">{label}={Number(value)}</p>
    </button>
  );
}
