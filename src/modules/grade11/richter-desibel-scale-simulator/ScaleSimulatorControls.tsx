import { Activity, Check, Gauge, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { ScaleMeasure, ScaleTarget } from './types';
import { modeCopy } from './scaleSimulatorModel';

interface ScaleSimulatorControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: ScaleTarget;
  measure: ScaleMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function ScaleSimulatorControls({ mission, activeIndex, target, measure, missionOk, onCheck, onReset }: ScaleSimulatorControlsProps) {
  const mode = modeCopy[target.mode];

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">ölçek simülatörü {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.045] text-white/78'}`}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-3" style={{ color: mode.color }}>
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif gerçek yaşam ölçeği</p>
            <p className="mt-1 text-lg font-black">{mode.title}</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed opacity-76">{missionOk ? 'Ham oran ve okunabilir ölçek eşleşti.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="ham giriş" value={measure.rawLabel} />
        <Metric label="sıkışmış" value={measure.outputLabel} />
        <Metric label="oran" value={measure.detailLabel} />
        <Metric label="hedef" value={target.label} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">denklem okuması</p>
        <p className="mt-1 font-mono text-sm font-black text-white">{target.formula}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/56">Büyük oran ekranda büyür; ölçek ölçeri onu öğrencinin okuyabileceği sayıya dönüştürür.</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="scale-simulator-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Ölçeği Onayla
        </SciFiButton>
        <SciFiButton data-testid="scale-simulator-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tek fikir</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Üstel dünya çok hızlı büyür; log ölçek büyük oranı okunabilir ölçüye sıkıştırır.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="font-mono text-xs font-black text-white xl:text-sm">{value}</p>
    </div>
  );
}
