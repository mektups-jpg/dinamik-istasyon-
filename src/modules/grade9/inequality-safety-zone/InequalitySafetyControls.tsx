import { Check, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../shared/Grade9LabShell';
import { buildInequalityLabel, directionText } from './safetyZoneModel';
import { SafetyBuild, SafetyMission } from './types';

interface InequalitySafetyControlsProps {
  missionStep: MissionStep;
  mission: SafetyMission;
  build: SafetyBuild;
  activeIndex: number;
  totalMissions: number;
  matched: boolean;
  locked: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function InequalitySafetyControls({
  missionStep,
  mission,
  build,
  activeIndex,
  totalMissions,
  matched,
  locked,
  onCheck,
  onReset,
}: InequalitySafetyControlsProps) {
  const primaryLabel = locked ? (activeIndex >= totalMissions - 1 ? 'Laboratuvarı Bitir' : 'Sonraki Görev') : 'Alanı Test Et';

  return (
    <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/38 p-4 shadow-[0_0_44px_rgba(0,229,255,0.08)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,229,255,0.10),transparent_45%,rgba(0,255,136,0.08))]" />
      <div className="relative space-y-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/60">
            Güvenlik görevi {activeIndex + 1}/{totalMissions}
          </p>
          <h3 className="mt-1 text-2xl font-black text-white">{mission.title}</h3>
          <div className="relative mt-3 overflow-hidden rounded-2xl border border-amber-300/42 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(0,229,255,0.10)_62%,rgba(0,0,0,0.18))] p-4 shadow-[0_0_34px_rgba(251,191,36,0.16)]">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.85)]" />
            <div className="relative flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/85">Çözmen gereken soru</p>
            </div>
            <p className="relative mt-2 text-[15px] font-black leading-relaxed text-white">{mission.story}</p>
          </div>
        </div>

        <PanelCard label="Sahne modeli" value={mission.model} detail={mission.mechanic} />
        <PanelCard label="Seçimin" value={buildInequalityLabel(build)} detail={directionText(build.direction)} tone={matched ? 'green' : 'cyan'} />
        {locked ? (
          <>
            <PanelCard label="Cebir adımı" value={mission.solutionSteps} detail="Sınır buradan gelir; sayı doğrusunda aynı sınırı boyadın." tone="green" />
            <PanelCard label="Sonuç" value={mission.resultLabel} detail="Sınır dahil; çünkü modelde ≤ veya ≥ var." tone="green" />
          </>
        ) : null}

        <div className="grid gap-2">
          <SciFiButton data-testid="inequality-safety-zone-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
            {primaryLabel}
          </SciFiButton>
          <SciFiButton data-testid="inequality-safety-zone-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
            Sıfırla
          </SciFiButton>
        </div>

        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/8 p-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-200/65">Kısa kural</p>
          <p className="mt-2 text-sm font-bold leading-relaxed text-white/72">{missionStep.prompt}</p>
        </div>
      </div>
    </aside>
  );
}

function PanelCard({ label, value, detail, tone = 'cyan' }: { label: string; value: string; detail: string; tone?: 'cyan' | 'green' }) {
  const toneClass = tone === 'green'
    ? 'border-emerald-300/24 bg-emerald-300/10 text-emerald-100'
    : 'border-cyan-300/18 bg-cyan-300/8 text-cyan-100';
  const valueClass = value.length > 18 ? 'text-base leading-snug' : 'text-xl';

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] opacity-65">{label}</p>
      <p className={`mt-1 font-black text-white ${valueClass}`}>{value}</p>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-white/62">{detail}</p>
    </div>
  );
}
