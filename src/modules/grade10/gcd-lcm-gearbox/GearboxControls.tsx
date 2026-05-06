import { Check, CircleDot, RotateCcw, ShieldCheck } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { gearModeLabel } from './gearboxModel';
import { GcdGear, GearMeasure, GearMissionTarget, GearState, LcmGear } from './types';

interface GearboxControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: GearMissionTarget;
  measure: GearMeasure;
  state: GearState;
  missionOk: boolean;
  onToggleGcdGear: (gear: GcdGear) => void;
  onToggleLcmGear: (gear: LcmGear) => void;
  onToggleSeal: () => void;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'EBOB ortak olan asal kuvvetlerin küçük olanlarını alır: 2 ve 3.',
  'EKOK görünen asal kuvvetlerin büyük olanlarını alır: 2² ve 3².',
  'Aynı iki sayı için ortak küçük seçim 6, birleşik büyük seçim 36 üretir.',
];

export function GearboxControls({
  mission,
  activeIndex,
  target,
  measure,
  state,
  missionOk,
  onToggleGcdGear,
  onToggleLcmGear,
  onToggleSeal,
  onCheck,
  onReset,
}: GearboxControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">dişli {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? target.success : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="12" value={measure.factorA} />
        <Metric label="18" value={measure.factorB} />
        <Metric label="EBOB" value={state.selectedGcdGears.length === 2 ? String(measure.gcdProduct) : measure.selectedGcdLabel} />
        <Metric label="EKOK" value={state.selectedLcmGears.length === 2 ? String(measure.lcmProduct) : measure.selectedLcmLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">seçim kuralı</p>
        <p className="mt-1 text-sm font-black text-white/88">{gearModeLabel(target)}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <MiniGear label="EBOB dişleri: 2 ve 3" active={state.selectedGcdGears.length === 2} disabled={activeIndex > 0} onClick={() => { onToggleGcdGear('2'); onToggleGcdGear('3'); }} />
        <MiniGear label="EKOK dişleri: 4 ve 9" active={state.selectedLcmGears.length === 2} disabled={activeIndex !== 1} onClick={() => { onToggleLcmGear('4'); onToggleLcmGear('9'); }} />
        <MiniGear label="Rapor mührü" active={state.sealArmed} disabled={activeIndex !== 2} onClick={onToggleSeal} seal />
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="gcd-lcm-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Dişliyi Onayla
        </SciFiButton>
        <SciFiButton data-testid="gcd-lcm-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function MiniGear({ label, active, disabled, onClick, seal = false }: { label: string; active: boolean; disabled: boolean; onClick: () => void; seal?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-[42px] items-center justify-between rounded-2xl border px-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${active ? 'border-cyan-300/45 bg-cyan-300/14 text-white' : 'border-white/10 bg-white/[0.045] text-white/72 hover:bg-white/[0.08]'}`}
    >
      <span className="flex items-center gap-2 text-sm font-black">
        {seal ? <ShieldCheck className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
        {label}
      </span>
      <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${active ? 'bg-emerald-300/12 text-emerald-100' : 'bg-white/5 text-white/42'}`}>
        {active ? 'kilit' : 'bekle'}
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
