import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { LimitMission, LimitTool, MODULE_ID, toolCopy } from './limitAsymptoteModel';

interface LimitAsymptoteControlsProps {
  mission: LimitMission;
  missionIndex: number;
  missionCount: number;
  tool: LimitTool | null;
  solved: boolean;
  onToolChange: (tool: LimitTool) => void;
  onCheck: () => void;
  onNext: () => void;
}

const toolOrder: LimitTool[] = ['two-sided', 'local', 'infinity', 'factor'];

export function LimitAsymptoteControls({
  mission,
  missionIndex,
  missionCount,
  tool,
  solved,
  onToolChange,
  onCheck,
  onNext,
}: LimitAsymptoteControlsProps) {
  const checkLabel = tool === null ? 'Önce Okuma Seç' : 'Limiti Kilitle';
  const checkClass = tool === null
    ? 'border-white/12 bg-white/[0.055] text-white/58 hover:border-[#00E5FF]/34 hover:text-cyan-100'
    : 'border-[#00FF88]/24 bg-[#00FF88]/12 text-emerald-100 hover:border-[#00FF88]/42';

  return (
    <div className="flex h-full min-w-0 flex-col gap-2 overflow-hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2.5">
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
        <p className="mt-1.5 text-sm font-black text-white">{mission.title}</p>
        <p className="mt-0.5 max-h-8 overflow-hidden text-[11px] font-bold leading-tight text-white/62 xl:max-h-none xl:text-xs xl:leading-snug">{mission.prompt}</p>
      </div>

      <div className="space-y-1.5">
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42 lg:block">Hangi limit okuması?</p>
        <div className="grid grid-cols-4 gap-1 xl:grid-cols-2 xl:gap-1.5">
          {toolOrder.map((key) => (
            <ToolButton
              key={key}
              active={tool === key}
              mission={mission}
              tool={key}
              onClick={() => onToolChange(key)}
            />
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
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#00FF88]/24 bg-[#00FF88]/14 px-4 text-sm font-black text-emerald-100 transition hover:border-[#00FF88]/42"
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
            className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${checkClass}`}
          >
            <Check className="h-4 w-4" />
            {checkLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function ToolButton({
  tool,
  active,
  mission,
  onClick,
}: {
  tool: LimitTool;
  active: boolean;
  mission: LimitMission;
  onClick: () => void;
}) {
  const copy = toolCopy[tool];
  const panelHint = getToolPanelHint(tool, mission);

  return (
    <motion.button
      type="button"
      data-testid={`${MODULE_ID}-${tool}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex min-h-[44px] flex-col items-center justify-center rounded-2xl border px-1.5 py-1 text-center transition xl:min-h-[52px] xl:px-2 xl:py-1.5 ${
        active
          ? 'border-[#00E5FF]/72 bg-[linear-gradient(180deg,rgba(0,229,255,0.24),rgba(0,229,255,0.10))] text-white shadow-[0_0_30px_rgba(0,229,255,0.22)]'
          : 'border-white/10 bg-white/[0.055] text-white/66 hover:border-white/24 hover:text-white'
      }`}
    >
      <span className="text-[10.5px] font-black leading-tight xl:text-[13px]">{copy.label}</span>
      <span className={`mt-0.5 font-mono text-[8px] font-black leading-tight tracking-normal xl:text-[9px] ${active ? 'text-cyan-100/82' : 'text-white/40'}`}>
        {panelHint}
      </span>
    </motion.button>
  );
}

function getToolPanelHint(tool: LimitTool, mission: LimitMission) {
  if (tool !== 'local') {
    return toolCopy[tool].panelHint;
  }

  if (mission.gateLabel === '∞') {
    return 'tek x değeri değil';
  }

  return `${mission.gateLabel} koy`;
}
