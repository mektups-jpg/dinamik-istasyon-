import { Check, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { MissionStep } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { PowerPlaced, RootPlaced } from './types';

interface RadicalControlsProps {
  mission: MissionStep;
  activeIndex: number;
  powerPlaced: PowerPlaced;
  rootPlaced: RootPlaced;
  onCheck: () => void;
  onReset: () => void;
}

export function RadicalControls({ mission, activeIndex, powerPlaced, rootPlaced, onCheck, onReset }: RadicalControlsProps) {
  const stageComplete = activeIndex === 0 ? powerPlaced.cube && powerPlaced.square : rootPlaced.square && rootPlaced.remainder;

  return (
    <aside data-testid="radical-control-panel" className="relative min-w-0 max-w-full overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.075] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-4 xl:p-5">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      <div className="pointer-events-none absolute -right-16 top-8 h-44 w-44 rounded-full bg-emerald-200/10 blur-3xl" />

      <div className="relative">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/45">reaktör görevi {activeIndex + 1}/2</p>
        <h3 className="mt-1 text-xl font-black tracking-tight text-white xl:text-2xl">{mission.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/62">{mission.prompt}</p>
        <StageProgress activeIndex={activeIndex} />
      </div>

      <div className="relative mt-4 grid gap-2 rounded-[24px] border border-white/10 bg-black/18 p-3 shadow-inner shadow-black/20">
        <p className="px-1 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/48">
          {activeIndex === 0 ? 'füzyon sensörleri' : 'ayrıştırma sensörleri'}
        </p>
        <div className="grid gap-3">
          {activeIndex === 0 ? (
            <>
              <StatusLine label="2³ çekirdeği" active={powerPlaced.cube} />
              <StatusLine label="2² çekirdeği" active={powerPlaced.square} />
            </>
          ) : (
            <>
              <StatusLine label="√36 dışarı çıktı" active={rootPlaced.square} />
              <StatusLine label="√2 kökte kaldı" active={rootPlaced.remainder} />
            </>
          )}
        </div>
        <motion.div
          layout
          className={`rounded-[20px] border px-4 py-3 text-sm font-black leading-snug ${
            stageComplete
              ? 'border-emerald-300/28 bg-emerald-300/[0.105] text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.14)]'
              : 'border-white/10 bg-white/[0.055] text-white/76'
          }`}
        >
          {stageComplete ? (activeIndex === 0 ? 'Füzyon kilitlendi: 2⁵ = 32.' : 'Kristal ayrıldı: 6√2.') : instruction(activeIndex)}
        </motion.div>
      </div>

      <div className="relative mt-4 hidden rounded-[22px] border border-amber-100/12 bg-amber-50/[0.055] p-4 text-xs leading-relaxed text-amber-50/68 xl:block">
        {activeIndex === 0 ? <Zap className="mb-2 h-4 w-4 text-amber-200" /> : <Sparkles className="mb-2 h-4 w-4 text-amber-200" />}
        {activeIndex === 0
          ? 'Aynı taban reaktörde ortak gövde gibi kalır; çarpma sadece üst enerji katmanlarını birleştirir.'
          : 'Kök içindeki tam kare dışarı sayı olarak çıkar; tam kare olmayan parça kök odasında kalır.'}
      </div>

      <div className="relative mt-4 grid gap-3">
        <SciFiButton data-testid="radical-check" onClick={onCheck} className="min-h-[48px] rounded-[18px] shadow-[0_18px_42px_rgba(52,211,153,0.16)]" icon={<Check className="h-4 w-4" />}>
          {stageComplete ? 'Deney Kilitlendi' : 'Deneyi Onayla'}
        </SciFiButton>
        <SciFiButton data-testid="radical-reset" variant="secondary" onClick={onReset} className="min-h-[46px] rounded-[18px] border-white/10 bg-white/[0.055] text-white/82 hover:bg-white/[0.09]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
    </aside>
  );
}

function StatusLine({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex min-h-[40px] items-center justify-between gap-2 rounded-[18px] border px-3 font-mono text-xs xl:text-sm ${active ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-black/20 text-white/58'}`}>
      <span>{label}</span>
      <span className="font-black">{active ? 'kilitli' : 'bekliyor'}</span>
    </div>
  );
}

function StageProgress({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {[0, 1].map((step) => (
        <div
          key={step}
          className={`h-1.5 rounded-full transition-colors ${step <= activeIndex ? 'bg-emerald-200 shadow-[0_0_16px_rgba(167,243,208,0.32)]' : 'bg-white/12'}`}
        />
      ))}
    </div>
  );
}

function instruction(activeIndex: number) {
  if (activeIndex === 0) return 'İki çekirdeği merkezdeki yuvalara taşı.';
  return '√36 bloğunu dış hazneye, √2 bloğunu kök haznesine ayır.';
}
