import { Check, FileCheck2, Ruler, RotateCcw, Waves } from 'lucide-react';
import type { ReactNode } from 'react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { TerrainLock, TerrainMeasure, TerrainMissionTarget } from './types';

interface TerrainSurveyorControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: TerrainMissionTarget;
  measure: TerrainMeasure;
  selectedLock: TerrainLock | null;
  missionOk: boolean;
  onSelectLock: (lock: TerrainLock) => void;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Kosinüs teoremi iki kenar ve aradaki açıdan üçüncü kenarı verir.',
  'Sinüs teoremi bilinen açı-kenar çiftini ikinci açıyla orana bağlar.',
  'Arazi raporu teoremi veriye göre seçer: kenar için kosinüs, açı için sinüs.',
];

export function TerrainSurveyorControls({
  mission,
  activeIndex,
  target,
  measure,
  selectedLock,
  missionOk,
  onSelectLock,
  onCheck,
  onReset,
}: TerrainSurveyorControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">ölçüm {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className="mt-4 grid gap-2">
        <LockButton
          testId="terrain-cosine-lock"
          lock="cosine"
          label="Kosinüs"
          detail="kenar"
          active={selectedLock === 'cosine'}
          expected={target.lock === 'cosine'}
          onSelect={onSelectLock}
          icon={<Ruler className="h-4 w-4" />}
        />
        <LockButton
          testId="terrain-sine-lock"
          lock="sine"
          label="Sinüs"
          detail="açı"
          active={selectedLock === 'sine'}
          expected={target.lock === 'sine'}
          onSelect={onSelectLock}
          icon={<Waves className="h-4 w-4" />}
        />
        <LockButton
          testId="terrain-report-lock"
          lock="report"
          label="Rapor"
          detail="seçim"
          active={selectedLock === 'report'}
          expected={target.lock === 'report'}
          onSelect={onSelectLock}
          icon={<FileCheck2 className="h-4 w-4" />}
        />
      </div>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{target.shortLabel}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? target.success : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="AB" value={`${measure.sideAB.toFixed(1)} br`} />
        <Metric label="AC" value={`${measure.sideAC.toFixed(1)} br`} />
        <Metric label="BC" value={`${measure.sideBC.toFixed(1)} br`} />
        <Metric label="hedef" value={measure.targetLabel} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">aktif formül</p>
        <p className="mt-1 text-sm font-black text-white/88">{measure.formulaLine}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="terrain-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Ölçümü Onayla
        </SciFiButton>
        <SciFiButton data-testid="terrain-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function LockButton({ testId, lock, label, detail, active, expected, onSelect, icon }: {
  testId: string;
  lock: TerrainLock;
  label: string;
  detail: string;
  active: boolean;
  expected: boolean;
  onSelect: (lock: TerrainLock) => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={() => onSelect(lock)}
      className={`flex min-h-[48px] items-center justify-between rounded-2xl border px-3 text-left transition ${active ? 'border-cyan-300/45 bg-cyan-300/14 text-white' : 'border-white/10 bg-white/[0.045] text-white/72 hover:bg-white/[0.08]'}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className={`rounded-xl border p-2 ${active ? 'border-cyan-200/45 bg-cyan-200/12 text-cyan-100' : 'border-white/10 bg-black/18 text-white/58'}`}>{icon}</span>
        <span>
          <span className="block text-sm font-black">{label}</span>
          <span className="block text-[10px] font-black uppercase tracking-[0.18em] opacity-50">{detail}</span>
        </span>
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
