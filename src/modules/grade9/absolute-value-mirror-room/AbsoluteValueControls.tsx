import { Check, RotateCcw } from 'lucide-react';
import { MissionStep } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { AbsoluteBuild, AbsoluteMission } from './types';
import { formatSigned, slopeLabel } from './absoluteValueModel';

interface AbsoluteValueControlsProps {
  missionStep: MissionStep;
  mission: AbsoluteMission;
  build: AbsoluteBuild;
  activeIndex: number;
  totalMissions: number;
  matched: boolean;
  locked: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function AbsoluteValueControls(props: AbsoluteValueControlsProps) {
  const { missionStep, mission, build, activeIndex, totalMissions, matched, locked, onCheck, onReset } = props;

  return (
    <aside className="min-w-0 rounded-[30px] border border-cyan-300/18 bg-black/45 p-4 backdrop-blur-xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">ayna görevi {activeIndex + 1}/{totalMissions}</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{missionStep.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/70">{missionStep.prompt}</p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">sahne okuması</p>
        <p className="mt-2 text-lg font-black text-white">{mission.expression}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{mission.mechanic}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <Metric label="Tepe adayı" value={`x=${formatSigned(build.vertexX)}`} tone={matched ? 'green' : 'cyan'} />
        <Metric label="Katlama" value={build.folded ? 'açık' : 'kapalı'} tone={build.folded ? 'green' : 'pink'} />
        <Metric label="Hedef diklik" value={slopeLabel(mission.target.slope)} tone={mission.target.slope === 2 ? 'amber' : 'cyan'} />
      </div>

      <div className={`mt-4 rounded-2xl border p-3 text-sm font-black ${locked ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100' : matched ? 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100' : 'border-amber-300/20 bg-amber-300/[0.07] text-amber-100'}`}>
        {locked ? mission.resultLabel : matched ? 'Ayna düzeni teste hazır.' : 'Ayna düzenini sahnede tamamla; sonucu testten sonra kilitle.'}
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="absolute-value-mirror-room-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Aynayı Test Et
        </SciFiButton>
        <SciFiButton data-testid="absolute-value-mirror-room-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm font-black text-white">Kısa kural</p>
        <p className="mt-1 text-xs leading-relaxed text-white/58">
          Mutlak değer grafiğinde tepe, iç ifadenin sıfır olduğu yerde durur; negatif çıkan kol x ekseninin üstüne katlanır.
        </p>
      </div>
    </aside>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: 'cyan' | 'green' | 'pink' | 'amber' }) {
  const toneClass = {
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
    green: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
    pink: 'border-pink-300/25 bg-pink-300/10 text-pink-100',
    amber: 'border-amber-300/25 bg-amber-300/10 text-amber-100',
  }[tone];

  return (
    <div className={`rounded-2xl border px-3 py-2 ${toneClass}`}>
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-65">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}
