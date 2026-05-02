import { Check, MapPinned, RotateCcw, Route } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { RouteMeasure, RouteState, RouteTarget } from './types';
import { formatNumber, formatSlope, pointText } from './routeModel';

interface AnalyticRouteControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: RouteTarget;
  state: RouteState;
  measure: RouteMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function AnalyticRouteControls({ mission, activeIndex, target, state, measure, missionOk, onCheck, onReset }: AnalyticRouteControlsProps) {
  const showTransfer = typeof target.transferT === 'number';

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">analitik rota {activeIndex + 1}/4</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">hedef kilit</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Rota hedef matematik imzasıyla çakıştı.' : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="A" value={pointText(state.a)} />
        <Metric label="B" value={pointText(state.b)} />
        <Metric label="Δx" value={formatNumber(measure.dx)} />
        <Metric label="Δy" value={formatNumber(measure.dy)} />
        <Metric label="m" value={formatSlope(measure.slope)} />
        <Metric label="d" value={formatNumber(measure.distance)} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">canlı denklem</p>
        <p className="mt-1 break-words font-mono text-sm font-black text-white">{measure.equation}</p>
        {showTransfer ? (
          <p className="mt-1 text-xs font-bold text-white/50">P = {pointText(measure.transfer)} · t={formatNumber(state.transferT)}</p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="analytic-route-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Rotayı Onayla
        </SciFiButton>
        <SciFiButton data-testid="analytic-route-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">İstasyonlar</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">A ve B noktalarını sürükle; hedef halkalar doğru konumu gösterir.</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
            <Route className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Rota ölçüleri</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Yeşil yatay değişim, mavi dikey değişim, sarı çizgi mesafedir.</p>
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
      <p className="font-mono text-sm font-black text-white">{value}</p>
    </div>
  );
}
