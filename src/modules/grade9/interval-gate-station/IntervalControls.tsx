import { ChoiceButton, MetricPill } from '../shared/Grade9LabShell';
import { intervalLabel } from './intervalModel';
import { GateSide, IntervalBuild, IntervalMission } from './types';

interface IntervalControlsProps {
  mission: IntervalMission;
  build: IntervalBuild;
  matched: boolean;
  activeIndex: number;
  totalMissions: number;
  onToggleGate: (side: GateSide) => void;
  onCheck: () => void;
  onReset: () => void;
}

export function IntervalControls({
  mission,
  build,
  matched,
  activeIndex,
  totalMissions,
  onToggleGate,
  onCheck,
  onReset,
}: IntervalControlsProps) {
  return (
    <aside data-testid="interval-controls" className="min-w-0 rounded-[28px] border border-white/10 bg-black/40 p-4 shadow-[0_0_55px_rgba(0,0,0,0.30)] backdrop-blur-xl xl:p-5">
      <div className="mb-5">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/55">kapı kontrolü</p>
        <h3 className="mt-1 text-xl font-black leading-tight text-white xl:text-2xl">{mission.title}</h3>
        <p className="mt-2 text-xs font-bold leading-relaxed text-white/62 xl:text-sm">{mission.prompt}</p>
      </div>

      <div className="grid gap-3">
        <MetricPill label="Görev" value={`${activeIndex + 1}/${totalMissions}`} tone="cyan" />
        <MetricPill label="Kurulan aralık" value={intervalLabel(build)} tone={matched ? 'green' : 'purple'} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/42">kapı tipi</p>
        <p className="mt-2 text-sm font-bold leading-relaxed text-white/68">{mission.shortRule}</p>
        <div className="mt-4 grid gap-3">
          <GateToggle label="Sol Kapı" included={build.left.mode === 'closed'} onClick={() => onToggleGate('left')} />
          <GateToggle label="Sağ Kapı" included={build.right.mode === 'closed'} onClick={() => onToggleGate('right')} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={onCheck}
          data-testid="interval-check"
          className="min-h-[52px] rounded-2xl border border-emerald-300/25 bg-emerald-300/12 px-4 text-sm font-black text-emerald-100 transition hover:border-emerald-300/55 hover:bg-emerald-300/18"
        >
          ✓ Aralığı Kilitle
        </button>
        <button
          type="button"
          onClick={onReset}
          data-testid="interval-reset"
          className="min-h-[48px] rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm font-black text-white/62 transition hover:border-white/24 hover:text-white"
        >
          Sıfırla
        </button>
      </div>
    </aside>
  );
}

function GateToggle({ label, included, onClick }: { label: string; included: boolean; onClick: () => void }) {
  return (
    <ChoiceButton
      selected={included}
      label={`${label}: ${included ? 'Dahil' : 'Hariç'}`}
      detail={included ? 'Sınır noktası aralığın parçası' : 'Sınır noktası sadece kapı'}
      onClick={onClick}
      tone={included ? 'green' : 'cyan'}
      variant="holo"
    />
  );
}
