import { CheckCircle2, ChevronRight, Circle, Cuboid, Droplets, Layers3, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import {
  MeasurementMode,
  modeCopy,
  SolidKind,
  SolidMission,
  solidCopy,
} from './solidMeasurementModel';

interface SolidMeasurementControlsProps {
  mission: SolidMission;
  missionIndex: number;
  missionCount: number;
  solid: SolidKind | null;
  mode: MeasurementMode | null;
  solved: boolean;
  onSolidChange: (solid: SolidKind) => void;
  onModeChange: (mode: MeasurementMode) => void;
  onCheck: () => void;
  onNext: () => void;
}

const solidOptions: Array<{ kind: SolidKind; testId: string }> = [
  { kind: 'prism', testId: 'solid-measurement-foundry-prism' },
  { kind: 'cylinder', testId: 'solid-measurement-foundry-cylinder' },
  { kind: 'pyramid', testId: 'solid-measurement-foundry-pyramid' },
  { kind: 'cone', testId: 'solid-measurement-foundry-cone' },
  { kind: 'sphere', testId: 'solid-measurement-foundry-sphere' },
];

const modeOptions: Array<{ mode: MeasurementMode; testId: string }> = [
  { mode: 'volume', testId: 'solid-measurement-foundry-volume' },
  { mode: 'surface', testId: 'solid-measurement-foundry-surface' },
];

export function SolidMeasurementControls({
  mission,
  missionIndex,
  missionCount,
  solid,
  mode,
  solved,
  onSolidChange,
  onModeChange,
  onCheck,
  onNext,
}: SolidMeasurementControlsProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5 overflow-hidden">
      <div className="rounded-[22px] border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/68">
              görev {missionIndex + 1}/{missionCount}
            </p>
            <h3 className="mt-1 text-base font-black leading-tight text-white">{mission.title}</h3>
          </div>
          <span className="shrink-0 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/10 px-2.5 py-1 font-mono text-[10px] font-black text-cyan-100">
            {mission.badge}
          </span>
        </div>
        <p className="text-sm font-semibold leading-snug text-white/72">{mission.prompt}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-2 grid grid-cols-2 gap-2">
          {modeOptions.map(({ mode: optionMode, testId }) => {
            const selected = mode === optionMode;
            return (
              <motion.button
                key={optionMode}
                type="button"
                data-testid={testId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onModeChange(optionMode)}
                className={`min-h-[58px] rounded-[20px] border px-3 py-2 text-left transition ${
                  selected
                    ? 'border-[#00E5FF]/45 bg-[#00E5FF]/14 text-white shadow-[0_0_28px_rgba(0,229,255,0.16)]'
                    : 'border-white/10 bg-white/[0.045] text-white/66 hover:border-white/24 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {optionMode === 'volume' ? <Droplets className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                  <span className="text-sm font-black">{modeCopy[optionMode].label}</span>
                </div>
                <p className="mt-1 text-xs font-semibold opacity-70">{modeCopy[optionMode].short}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
          {solidOptions.map(({ kind, testId }) => {
            const selected = solid === kind;
            return (
              <motion.button
                key={kind}
                type="button"
                data-testid={testId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSolidChange(kind)}
                className={`min-h-[64px] rounded-[20px] border p-2.5 text-left transition ${
                  selected
                    ? 'border-[#A3E635]/45 bg-[#A3E635]/12 text-white shadow-[0_0_26px_rgba(163,230,53,0.14)]'
                    : 'border-white/10 bg-white/[0.045] text-white/68 hover:border-white/24 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {kind === 'sphere' ? <Circle className="h-4 w-4" /> : kind === 'prism' ? <Cuboid className="h-4 w-4" /> : <Layers3 className="h-4 w-4" />}
                  <span className="text-sm font-black">{solidCopy[kind].label}</span>
                </div>
                <p className="mt-1 text-[11px] font-bold leading-tight text-white/50">{solidCopy[kind].short}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-2">
        {!solved ? (
          <motion.button
            type="button"
            data-testid="solid-measurement-foundry-check"
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCheck}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-[20px] border border-[#00E5FF]/35 bg-[#00E5FF]/14 px-4 py-3 text-sm font-black text-cyan-50 shadow-[0_0_30px_rgba(0,229,255,0.14)] transition hover:bg-[#00E5FF]/18"
          >
            <CheckCircle2 className="h-4 w-4" />
            Dökümhaneyi Test Et
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-[20px] border border-[#00FF88]/35 bg-[#00FF88]/14 px-4 py-3 text-sm font-black text-emerald-50 shadow-[0_0_30px_rgba(0,255,136,0.14)] transition hover:bg-[#00FF88]/18"
          >
            {missionIndex === missionCount - 1 ? 'Final Mührünü Aç' : 'Sıradaki İstasyon'}
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
