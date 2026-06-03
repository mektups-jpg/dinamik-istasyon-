import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { MissionStep } from '../shared/Grade9LabShell';
import { mathTextWithRadicals } from './RealNumberLawMath';
import { activeSignalCount } from './realNumberLawModel';
import { AtlasMission, LawBuild } from './types';

interface RealNumberLawControlsProps {
  missionStep: MissionStep;
  mission: AtlasMission;
  build: LawBuild;
  activeIndex: number;
  matched: boolean;
  locked: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function RealNumberLawControls({ missionStep, mission, build, activeIndex, matched, locked, onCheck, onReset }: RealNumberLawControlsProps) {
  const signalCount = activeSignalCount(build, mission);

  return (
    <aside data-testid="real-number-law-atlas-controls" className="relative min-w-0 max-w-full overflow-hidden rounded-[28px] border border-cyan-200/18 bg-black/48 p-4 shadow-[0_24px_74px_rgba(0,0,0,0.34)] backdrop-blur-2xl xl:p-5">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/60 to-transparent" />
      <div className="pointer-events-none absolute -right-14 top-10 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/54">atlas görevi {activeIndex + 1}/4</p>
        <h3 className="mt-1 text-xl font-black tracking-tight text-white xl:text-2xl">{missionStep.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cyan-50/68">{mathTextWithRadicals(missionStep.prompt)}</p>
      </div>

      <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/44">mühür kilidi</p>
            <p className="mt-1 text-lg font-black text-white">{locked ? mission.targetText : lockedPromptFor(mission)}</p>
          </div>
          <Sparkles className={`h-5 w-5 ${matched ? 'text-emerald-200' : 'text-cyan-200/70'}`} />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((step) => (
            <div key={step} className={`h-1.5 rounded-full ${step <= activeIndex ? 'bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.28)]' : 'bg-white/12'}`} />
          ))}
        </div>
      </div>

      <div className={`relative mt-4 rounded-2xl border p-4 ${locked ? 'border-emerald-200/35 bg-emerald-300/12 text-emerald-50' : matched ? 'border-cyan-200/28 bg-cyan-300/10 text-cyan-50' : 'border-amber-200/18 bg-amber-300/[0.06] text-amber-50/82'}`}>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] opacity-68">canlı geri bildirim</p>
        <p className="mt-1 text-sm font-bold leading-relaxed">
          {locked
            ? mission.success
            : matched
              ? 'Sinyaller bağlandı; sonucu görmek için kontrol et.'
              : `${signalCount} sinyal açık. ${hintFor(mission)}`}
        </p>
      </div>

      <div className="relative mt-4 grid gap-3">
        <SciFiButton data-testid="real-number-law-atlas-check" onClick={onCheck} className="min-h-[50px] rounded-[18px] shadow-[0_18px_42px_rgba(34,211,238,0.14)]" icon={<Check className="h-4 w-4" />}>
          {locked ? 'Mühür Açıldı' : 'Kontrol Et'}
        </SciFiButton>
        <SciFiButton data-testid="real-number-law-atlas-reset" variant="secondary" onClick={onReset} className="min-h-[48px] rounded-[18px] border-white/10 bg-white/[0.055] text-white/82 hover:bg-white/[0.09]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function hintFor(mission: AtlasMission) {
  if (mission.kind === 'natural-integer') return 'Negatif sayı doğal kapıyı değil, tam sayı kapısını yakmalı.';
  if (mission.kind === 'real-umbrella') return 'Rasyonel ve irrasyonel iki ışın birlikte gerçek sayı şemsiyesine bağlanmalı.';
  if (mission.kind === 'associative') return 'İki farklı parantez yolu aynı toplam çekirdeğine bağlanmalı.';
  return 'Çarpan, parantezdeki her terimle ayrı ayrı çarpılmalı.';
}

function lockedPromptFor(mission: AtlasMission) {
  if (mission.kind === 'natural-integer') return 'küme kapısı kilitli';
  if (mission.kind === 'real-umbrella') return 'şemsiye kilitli';
  if (mission.kind === 'associative') return 'toplam mührü kilitli';
  return 'dağıtım mührü kilitli';
}
