import type { ReactNode } from 'react';
import { ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { MODULE_ID, modeCopy, SequenceMission, WheelMode } from './sequenceWheelModel';

interface SequenceWheelControlsProps {
  mission: SequenceMission;
  missionIndex: number;
  missionCount: number;
  mode: WheelMode | null;
  solved: boolean;
  onModeChange: (mode: WheelMode) => void;
  onNudge: (direction: -1 | 1) => void;
  onCheck: () => void;
  onNext: () => void;
}

export function SequenceWheelControls({
  mission,
  missionIndex,
  missionCount,
  mode,
  solved,
  onModeChange,
  onNudge,
  onCheck,
  onNext,
}: SequenceWheelControlsProps) {
  const checkLabel = mode === null ? 'Önce Kural Seç' : 'Seçimi Kontrol Et';
  const checkButtonClass = mode === null
    ? 'border-white/12 bg-white/[0.055] text-white/58 hover:border-[#00E5FF]/34 hover:text-cyan-100'
    : 'border-[#00FF88]/24 bg-[#00FF88]/12 text-emerald-100 hover:border-[#00FF88]/42';

  return (
    <div className="flex h-full min-w-0 flex-col gap-3 overflow-hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/66">görev {missionIndex + 1}/{missionCount}</p>
          <div className="flex gap-1">
            {Array.from({ length: missionCount }, (_, index) => (
              <span
                key={index}
                className={`h-2 w-6 rounded-full ${index <= missionIndex ? 'bg-[#00E5FF]' : 'bg-white/12'}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm font-black text-white">{mission.title}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/62">{mission.prompt}</p>
      </div>

      <div className="space-y-2">
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42 lg:block">Bu ray hangi kuralla çalışıyor?</p>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {(Object.keys(modeCopy) as WheelMode[]).map((key) => (
            <motion.button
              key={key}
              type="button"
              data-testid={`${MODULE_ID}-${key}`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onModeChange(key)}
              className={`min-h-11 rounded-2xl border px-3 text-sm font-black transition lg:min-h-12 ${
                mode === key
                  ? 'border-[#00E5FF]/72 bg-[linear-gradient(180deg,rgba(0,229,255,0.26),rgba(0,229,255,0.12))] text-white shadow-[0_0_34px_rgba(0,229,255,0.28)]'
                  : 'border-white/10 bg-white/[0.055] text-white/66 hover:border-white/24 hover:text-white'
              }`}
            >
              {modeCopy[key].label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[44px_44px_minmax(120px,1fr)] gap-2">
        <DockIconButton label="Rayı sola al" onClick={() => onNudge(-1)}>
          <Minus className="h-5 w-5" />
        </DockIconButton>
        <DockIconButton label="Rayı sağa al" onClick={() => onNudge(1)}>
          <Plus className="h-5 w-5" />
        </DockIconButton>
        {solved ? (
          <motion.button
            type="button"
            data-testid={`${MODULE_ID}-check`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#00FF88]/24 bg-[#00FF88]/14 px-4 text-sm font-black text-emerald-100 transition hover:border-[#00FF88]/42"
          >
            <ArrowRight className="h-4 w-4" />
            {missionIndex === missionCount - 1 ? 'Bitir' : 'Sonraki'}
          </motion.button>
        ) : (
          <motion.button
            type="button"
            data-testid={`${MODULE_ID}-check`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCheck}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${checkButtonClass}`}
          >
            <Check className="h-4 w-4" />
            {checkLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function DockIconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="grid min-h-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-white/74 transition hover:border-[#00E5FF]/36 hover:text-[#00E5FF]"
    >
      {children}
    </motion.button>
  );
}
