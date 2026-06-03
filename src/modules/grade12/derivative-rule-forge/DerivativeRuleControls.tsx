import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { ForgeMission, MODULE_ID, RuleTool, toolCopy } from './derivativeRuleModel';

interface DerivativeRuleControlsProps {
  mission: ForgeMission;
  missionIndex: number;
  missionCount: number;
  completedMissionIndexes: Set<number>;
  tool: RuleTool | null;
  lockedCount: number;
  buildCount: number;
  solved: boolean;
  onToolChange: (tool: RuleTool) => void;
  onCheck: () => void;
}

const toolOrder: RuleTool[] = ['sum', 'difference', 'product', 'quotient', 'chain'];

export function DerivativeRuleControls({
  mission,
  missionIndex,
  missionCount,
  completedMissionIndexes,
  tool,
  lockedCount,
  buildCount,
  solved,
  onToolChange,
  onCheck,
}: DerivativeRuleControlsProps) {
  const readyForTest = tool !== null && lockedCount === buildCount;
  const selectedToolCopy = tool ? toolCopy[tool] : null;
  const activeRuleTitle = selectedToolCopy?.panelTitle ?? mission.title;
  const activeRulePrompt = selectedToolCopy?.panelPrompt ?? mission.prompt;
  const activeRuleFormula = solved ? mission.expression : tool ? toolCopy[tool].formula : mission.structure;
  const checkLabel = tool === null ? 'Önce Kural Seç' : readyForTest ? 'Sonucu Kontrol Et' : 'Adımları Tamamla';
  const checkClass = tool === null
    ? 'border-white/12 bg-white/[0.055] text-white/58 hover:border-[#00E5FF]/34 hover:text-cyan-100'
    : readyForTest
      ? 'border-[#00FF88]/24 bg-[#00FF88]/12 text-emerald-100 hover:border-[#00FF88]/42'
      : 'border-[#00E5FF]/24 bg-[#00E5FF]/12 text-cyan-100 hover:border-[#00E5FF]/42';

  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5 overflow-hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/66">görev {missionIndex + 1}/{missionCount}</p>
          <div className="flex gap-1">
            {Array.from({ length: missionCount }, (_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === missionIndex
                    ? 'w-5 bg-[#00E5FF]'
                    : completedMissionIndexes.has(index)
                      ? 'w-4 bg-[#00FF88]'
                      : 'w-4 bg-white/12'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm font-black text-white">{activeRuleTitle}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/62">{activeRulePrompt}</p>
        <div className="mt-3 rounded-xl border border-[#00E5FF]/12 bg-black/22 px-3 py-2">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/36">aktif kural · tamamlanan adım {lockedCount}/{buildCount}</p>
          <p className="mt-1 text-sm font-black leading-snug text-white/80">{activeRuleFormula}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42 lg:block">Hangi türev kuralı?</p>
        <div className="grid grid-cols-2 gap-2">
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
          <div className="rounded-2xl border border-[#00FF88]/20 bg-[#00FF88]/10 px-4 py-3 text-center">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#00FF88]/70">
              {completedMissionIndexes.size}/{missionCount} kural tamam
            </p>
            <p className="mt-1 text-sm font-black leading-tight text-emerald-100">Başka bir kural seçebilirsin.</p>
          </div>
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

function ToolButton({ tool, active, onClick, children }: { tool: RuleTool; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      data-testid={`${MODULE_ID}-${tool}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-10 rounded-2xl border px-3 text-sm font-black transition ${
        active
          ? 'border-[#00E5FF]/72 bg-[linear-gradient(180deg,rgba(0,229,255,0.24),rgba(0,229,255,0.10))] text-white shadow-[0_0_30px_rgba(0,229,255,0.22)]'
          : 'border-white/10 bg-white/[0.055] text-white/66 hover:border-white/24 hover:text-white'
      }`}
    >
      {children}
    </motion.button>
  );
}
