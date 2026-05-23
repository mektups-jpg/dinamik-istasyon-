import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { ContinuityExpressionDisplay } from './ContinuityExpressionDisplay';
import { BridgeMission, BridgeTool, MODULE_ID, toolCopy } from './continuityBridgeModel';

interface ContinuityBridgeControlsProps {
  mission: BridgeMission;
  missionIndex: number;
  missionCount: number;
  tool: BridgeTool | null;
  solved: boolean;
  onToolChange: (tool: BridgeTool) => void;
  onCheck: () => void;
  onNext: () => void;
}

const toolOrder: BridgeTool[] = ['rails', 'pin', 'gap', 'seal'];

export function ContinuityBridgeControls({
  mission,
  missionIndex,
  missionCount,
  tool,
  solved,
  onToolChange,
  onCheck,
  onNext,
}: ContinuityBridgeControlsProps) {
  const checkLabel = tool === null ? 'Önce Durum Seç' : 'Kararı Kontrol Et';
  const functionLabel = getFunctionLabel(mission.gateLabel);
  const checkClass = tool === null
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
                className={`h-2 w-4 rounded-full ${index <= missionIndex ? 'bg-[#00E5FF]' : 'bg-white/12'}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm font-black text-white">{mission.title}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/62">{mission.prompt}</p>
      </div>

      <div className="space-y-2">
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42 lg:block">Süreklilik için neyi kontrol edelim?</p>
        <div className="grid grid-cols-2 gap-2">
          {toolOrder.map((key) => (
            <ToolButton
              key={key}
              active={tool === key}
              tool={key}
              onClick={() => onToolChange(key)}
            >
              {key === 'pin' ? `${functionLabel} Değeri` : toolCopy[key].label}
            </ToolButton>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-black/24 px-4 py-3">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/40">süreklilik kontrolü</p>
        <ContinuityExpressionDisplay
          expression={mission.expression}
          className="mt-2 flex flex-wrap items-start gap-x-1 gap-y-1 text-sm font-black leading-none text-white/82"
          targetClassName="mt-0.5 whitespace-nowrap rounded-full border border-[#00E5FF]/18 bg-[#00E5FF]/10 px-1.5 py-0.5 font-mono text-[9px] font-black leading-none text-[#9AF5FF]"
        />
        <div className="mt-3 grid gap-1.5">
          <ProofRow label="Soldan limit" value={formatValue(mission.leftApproach)} tone={mission.leftApproach === mission.rightApproach ? 'ok' : 'warn'} />
          <ProofRow label="Sağdan limit" value={formatValue(mission.rightApproach)} tone={mission.leftApproach === mission.rightApproach ? 'ok' : 'warn'} />
          <ProofRow label={functionLabel} value={mission.functionValue === null ? 'tanımsız' : formatValue(mission.functionValue)} tone={getFunctionTone(mission)} />
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

function formatValue(value: number) {
  return `${value}`;
}

function getFunctionTone(mission: BridgeMission): 'ok' | 'warn' {
  if (mission.functionValue === null) return 'warn';
  return mission.functionValue === mission.limitValue ? 'ok' : 'warn';
}

function getFunctionLabel(gateLabel: string) {
  const point = gateLabel.match(/x\s*=\s*(.+)$/)?.[1]?.trim();
  return point ? `f(${point})` : 'f(a)';
}

function ProofRow({ label, value, tone }: { label: string; value: string; tone: 'ok' | 'warn' }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs font-black ${
        tone === 'ok'
          ? 'border-[#00FF88]/18 bg-[#00FF88]/8 text-emerald-100'
          : 'border-[#FBBF24]/22 bg-[#FBBF24]/9 text-amber-100'
      }`}
    >
      <span className="text-white/54">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ToolButton({ tool, active, onClick, children }: { tool: BridgeTool; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      data-testid={`${MODULE_ID}-${tool}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-11 rounded-2xl border px-3 text-sm font-black transition ${
        active
          ? 'border-[#00E5FF]/72 bg-[linear-gradient(180deg,rgba(0,229,255,0.24),rgba(0,229,255,0.10))] text-white shadow-[0_0_30px_rgba(0,229,255,0.22)]'
          : 'border-white/10 bg-white/[0.055] text-white/66 hover:border-white/24 hover:text-white'
      }`}
    >
      {children}
    </motion.button>
  );
}
