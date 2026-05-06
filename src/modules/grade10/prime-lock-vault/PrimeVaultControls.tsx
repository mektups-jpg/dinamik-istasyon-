import { Check, KeyRound, RotateCcw } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../../high-school/shared/HighSchoolLabShell';
import { PrimeVaultMeasure, PrimeVaultTarget } from './types';

interface PrimeVaultControlsProps {
  mission: MissionStep;
  activeIndex: number;
  target: PrimeVaultTarget;
  measure: PrimeVaultMeasure;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

const ruleCopy = [
  'Asal çarpanlar, sayıyı kalansız bölen ve daha fazla parçalanmayan kilit ışınlarıdır.',
  'Tam bölen rafı, hedef sayıyı kalansız bölen bütün pozitif taşları içerir.',
];

export function PrimeVaultControls({ mission, activeIndex, target, measure, missionOk, onCheck, onReset }: PrimeVaultControlsProps) {
  const targetPreview = missionOk
    ? target.shortLabel
    : activeIndex === 0
      ? 'Asal çekirdek kilidi'
      : 'Bölen rafı kilidi';
  const rulePreview = missionOk
    ? activeIndex === 0
      ? '30 = 2 x 3 x 5'
      : 'Tam bölenler: 1, 2, 3, 5, 6, 10, 15, 30'
    : activeIndex === 0
      ? 'Kalansız bölen ve asal kalan ışınları seç.'
      : 'Çarpım eşleriyle bütün pozitif bölenleri kapat.';
  const primeCoreMetric = activeIndex === 0 && !missionOk ? 'kilitli' : measure.primeProduct;
  const divisorCountMetric = missionOk ? `${measure.divisorCount}` : 'aranıyor';

  return (
    <aside className="min-w-0 rounded-[30px] border border-white/14 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">kasa {activeIndex + 1}/2</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/72">{mission.prompt}</p>

      <div className={`mt-4 rounded-2xl border p-3 xl:p-4 ${missionOk ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/[0.055] text-sky-100'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">aktif hedef</p>
        <p className="mt-1 text-lg font-black">{targetPreview}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-75">{missionOk ? target.success : target.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="sayı" value={`${measure.number}`} />
        <Metric label="asal çekirdek" value={primeCoreMetric} />
        <Metric label="seçilen asal" value={measure.selectedPrimeLabel} />
        <Metric label="bölen adedi" value={divisorCountMetric} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">kasa kuralı</p>
        <p className="mt-1 text-sm font-black text-white/88">{rulePreview}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/58">{ruleCopy[activeIndex]}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="prime-vault-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Kasayı Onayla
        </SciFiButton>
        <SciFiButton data-testid="prime-vault-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Bu Görevi Sıfırla
        </SciFiButton>
      </div>

      <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-100">
            <KeyRound className="h-5 w-5" />
          </div>
          <p className="text-xs leading-relaxed text-white/58">Asal çarpanlar kasanın ana şifresi, tam bölenler ise o şifreden üretilen tüm geçerli kilit taşlarıdır.</p>
        </div>
      </div>
    </aside>
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
