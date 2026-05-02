import { Check, Radar, RotateCcw, Waypoints } from 'lucide-react';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { FunctionTarget } from './types';
import { formatValue } from './filterModel';

interface FunctionFilterControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: FunctionTarget;
  scannerX: number;
  hitCount: number;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function FunctionFilterControls({
  mission,
  activeIndex,
  target,
  scannerX,
  hitCount,
  missionOk,
  onCheck,
  onReset,
}: FunctionFilterControlsProps) {
  const isMapping = target.kind === 'map-domain';

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">fonksiyon filtresi {activeIndex + 1}/3</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{isMapping ? 'aktif kural' : 'canlı tarama'}</p>
        <p className="mt-1 font-mono text-3xl font-black text-white">{isMapping ? '2x+1' : `x=${formatValue(scannerX)}`}</p>
        <p className="mt-1 text-xs font-bold text-sky-100/55">{isMapping ? 'tanım kümesini çıkışa bağla' : `${hitCount} çıktı yakalandı`}</p>
      </div>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-amber-300/20 bg-amber-300/[0.07] text-amber-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">hedef</p>
        <p className="mt-1 text-lg font-black">{target.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? 'Filtre doğru matematiksel durumu yakaladı.' : target.hint}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="function-filter-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Filtreyi Onayla
        </SciFiButton>
        <SciFiButton data-testid="function-filter-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-3 text-sky-100">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Dikey doğru testi</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Bir x iki farklı y değerine gidiyorsa bağıntı fonksiyon değildir.</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-2xl border border-violet-300/20 bg-violet-300/10 p-3 text-violet-100">
            <Waypoints className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Tanım kümesi</p>
            <p className="mt-1 text-xs leading-relaxed text-white/58">Her giriş, kurala göre tek bir çıkış portuna bağlanır.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
