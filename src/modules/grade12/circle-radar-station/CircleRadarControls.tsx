import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { CircleRadarMission, MODULE_ID, RadarTool, toolCopy } from './circleRadarModel';

interface CircleRadarControlsProps {
  mission: CircleRadarMission;
  missionIndex: number;
  missionCount: number;
  tool: RadarTool | null;
  solved: boolean;
  onToolChange: (tool: RadarTool) => void;
  onCheck: () => void;
  onNext: () => void;
}

const toolOrder: RadarTool[] = [
  'secant',
  'chord',
  'tangent',
  'arc',
  'inscribed-angle',
  'central-angle',
  'area',
];

export function CircleRadarControls({
  mission,
  missionIndex,
  missionCount,
  tool,
  solved,
  onToolChange,
  onCheck,
  onNext,
}: CircleRadarControlsProps) {
  const checkLabel = tool === null ? 'Önce Mod Seç' : 'Radarı Test Et';
  const checkClass = tool === null
    ? 'border-white/12 bg-white/[0.055] text-white/58 hover:border-[#00E5FF]/34 hover:text-cyan-100'
    : 'border-[#00FF88]/24 bg-[#00FF88]/12 text-emerald-100 hover:border-[#00FF88]/42';

  return (
    <div className="flex h-full min-w-0 flex-col gap-2 overflow-hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/66">görev {missionIndex + 1}/{missionCount}</p>
          <div className="flex gap-1">
            {Array.from({ length: missionCount }, (_, index) => (
              <span
                key={index}
                className={`h-2 w-3 rounded-full ${index <= missionIndex ? 'bg-[#00E5FF]' : 'bg-white/12'}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-1.5 text-sm font-black text-white">{mission.title}</p>
        <p className="mt-1 text-xs font-bold leading-tight text-white/62">{mission.prompt}</p>
        <div className="mt-2 rounded-xl border border-[#00E5FF]/12 bg-black/22 px-3 py-1.5">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/36">aktif sensör</p>
          <p className="mt-1 text-sm font-black leading-snug text-white/80">{solved ? mission.formula : mission.sensor}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42">Hangi radar modu?</p>
        <div className="grid grid-cols-3 gap-2">
          {toolOrder.map((key) => (
            <ToolButton
              key={key}
              active={tool === key}
              tool={key}
              onClick={() => onToolChange(key)}
            >
              {toolCopy[key].label}
            </ToolButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1">
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
            className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${checkClass}`}
          >
            <Check className="h-4 w-4" />
            {checkLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function ToolButton({ tool, active, onClick, children }: { tool: RadarTool; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      data-testid={`${MODULE_ID}-${tool}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-9 rounded-2xl border px-2 text-[12px] font-black leading-tight transition ${
        active
          ? 'border-[#00E5FF]/72 bg-[linear-gradient(180deg,rgba(0,229,255,0.24),rgba(0,229,255,0.10))] text-white shadow-[0_0_30px_rgba(0,229,255,0.22)]'
          : 'border-white/10 bg-white/[0.055] text-white/66 hover:border-white/24 hover:text-white'
      }`}
    >
      {children}
    </motion.button>
  );
}
