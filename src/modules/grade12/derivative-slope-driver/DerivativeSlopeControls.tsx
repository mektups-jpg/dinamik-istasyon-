import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { MODULE_ID, SlopeMission, SlopeTool, toolCopy } from './derivativeSlopeModel';
import { SlopeExpressionText } from './DerivativeSlopeNotation';

interface DerivativeSlopeControlsProps {
  mission: SlopeMission;
  missionIndex: number;
  missionCount: number;
  tool: SlopeTool | null;
  solved: boolean;
  onToolChange: (tool: SlopeTool) => void;
  onCheck: () => void;
  onNext: () => void;
}

const toolOrder: SlopeTool[] = ['secant', 'tangent'];

export function DerivativeSlopeControls({
  mission,
  missionIndex,
  missionCount,
  tool,
  solved,
  onToolChange,
  onCheck,
  onNext,
}: DerivativeSlopeControlsProps) {
  const checkLabel = tool === null ? 'Önce Parça Seç' : 'Pisti Test Et';
  const checkClass = tool === null
    ? 'border-white/12 bg-white/[0.055] text-white/58 hover:border-[#00E5FF]/34 hover:text-cyan-100'
    : 'border-[#00FF88]/24 bg-[#00FF88]/12 text-emerald-100 hover:border-[#00FF88]/42';

  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5 overflow-hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/66">görev {missionIndex + 1}/{missionCount}</p>
          <div className="flex gap-1">
            {Array.from({ length: missionCount }, (_, index) => (
              <span
                key={index}
                className={`h-2 w-4 rounded-full ${index <= missionIndex ? 'bg-[#00E5FF]' : 'bg-white/12'}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm font-black text-white">{mission.title}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/62">{mission.prompt}</p>
        <div className="mt-3 rounded-xl border border-[#00E5FF]/12 bg-black/22 px-3 py-2">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/36">aktif kanıt</p>
          <p className="mt-1 text-sm font-black leading-snug text-white/80">
            <SlopeExpressionText expression={mission.expression} />
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42 lg:block">Hangi pist parçası?</p>
        <div className="grid grid-cols-1 gap-2">
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

function ToolButton({ tool, active, onClick, children }: { tool: SlopeTool; active: boolean; onClick: () => void; children: ReactNode }) {
  const accent = toolCopy[tool].accent;

  return (
    <motion.button
      type="button"
      data-testid={`${MODULE_ID}-${tool}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={active ? {
        borderColor: `${accent}b8`,
        background: `linear-gradient(180deg, ${hexToRgba(accent, 0.24)}, ${hexToRgba(accent, 0.10)})`,
        boxShadow: `0 0 30px ${hexToRgba(accent, 0.22)}`,
      } : undefined}
      className={`min-h-14 rounded-2xl border px-3 py-2 text-left transition ${
        active
          ? 'text-white'
          : 'border-white/10 bg-white/[0.055] text-white/66 hover:border-white/24 hover:text-white'
      }`}
    >
      <span className="block text-sm font-black">{children}</span>
      <span className="mt-1 block text-xs font-bold leading-snug text-white/58">{toolCopy[tool].description}</span>
    </motion.button>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
