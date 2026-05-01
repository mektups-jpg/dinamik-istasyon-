import { BarChart3, Check, RotateCcw } from 'lucide-react';
import { MissionStep } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { GroupKey } from './types';

interface StatsControlsProps {
  mission: MissionStep;
  activeIndex: number;
  selectedGroup: GroupKey;
  scannerLocked: boolean;
  medianLocked: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function StatsControls({ mission, activeIndex, selectedGroup, scannerLocked, medianLocked, onCheck, onReset }: StatsControlsProps) {
  const complete = activeIndex === 0 ? scannerLocked : medianLocked;

  return (
    <aside className="min-w-0 rounded-[34px] border border-lime-200/18 bg-black/45 p-4 backdrop-blur-xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-lime-100/55">veri görevi {activeIndex + 1}/2</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-lime-50/70">{mission.prompt}</p>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.045] p-3 xl:p-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/48">
          {activeIndex === 0 ? 'dağılım kararı' : 'kutu-bıyık okuma'}
        </p>
        {activeIndex === 0 ? (
          <div className="mt-4 grid gap-3">
            <MetricLine label="Tarayıcı üstündeki grup" value={`Sınıf ${selectedGroup}`} active={scannerLocked} />
            <MetricLine label="Karar" value={scannerLocked ? 'istikrarlı' : 'henüz değil'} active={scannerLocked} />
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            <MetricLine label="Medyan çizgisi" value={medianLocked ? '70' : 'aranıyor'} active={medianLocked} />
            <MetricLine label="Anlam" value="iki yarı" active={medianLocked} />
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="stats-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          {complete ? 'Veri Kilitlendi' : 'Veriyi Onayla'}
        </SciFiButton>
        <SciFiButton data-testid="stats-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-4 hidden rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-xs leading-relaxed text-cyan-50/75 xl:block">
        <BarChart3 className="mb-2 h-4 w-4 text-cyan-200" />
        {activeIndex === 0
          ? 'En iyi grup en yüksek ortalama değil; en az dağılan, yani daha tutarlı olan gruptur.'
          : 'Kutu-bıyık grafiğinde medyan çizgisi veriyi iki eş sayıda parçaya ayırır.'}
      </div>
    </aside>
  );
}

function MetricLine({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`flex min-h-[46px] items-center justify-between rounded-xl border px-3 font-mono text-sm ${active ? 'border-lime-200/35 bg-lime-200/10 text-lime-100' : 'border-white/10 bg-black/20 text-white/58'}`}>
      <span>{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}
