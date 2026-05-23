import type { ReactNode } from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, Database, Filter, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import {
  DataVerdictMission,
  FilterTool,
  filterCopy,
  MODULE_ID,
  SourceTool,
  sourceCopy,
  VerdictTool,
  verdictCopy,
} from './dataVerdictModel';

interface DataVerdictControlsProps {
  mission: DataVerdictMission;
  missionIndex: number;
  missionCount: number;
  source: SourceTool | null;
  filter: FilterTool | null;
  verdict: VerdictTool | null;
  solved: boolean;
  onSourceChange: (source: SourceTool) => void;
  onFilterChange: (filter: FilterTool) => void;
  onVerdictChange: (verdict: VerdictTool) => void;
  onCheck: () => void;
  onNext: () => void;
}

const sourceOrder: SourceTool[] = ['official', 'social', 'classroom'];
const filterOrder: FilterTool[] = ['sameUnit', 'median', 'iqr', 'trend'];
const verdictOrder: VerdictTool[] = ['evidence', 'causal', 'rawHeadline', 'uncertain'];

export function DataVerdictControls({
  mission,
  missionIndex,
  missionCount,
  source,
  filter,
  verdict,
  solved,
  onSourceChange,
  onFilterChange,
  onVerdictChange,
  onCheck,
  onNext,
}: DataVerdictControlsProps) {
  const ready = source !== null && filter !== null && verdict !== null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
      <div className="rounded-[18px] border border-white/10 bg-white/[0.055] px-3 py-2">
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/68">
              görev {missionIndex + 1}/{missionCount}
            </p>
            <h3 className="mt-1 text-base font-black leading-tight text-white">{mission.title}</h3>
          </div>
          <span className="shrink-0 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/10 px-2.5 py-1 font-mono text-[10px] font-black text-cyan-100">
            {solved ? mission.badge : `Kilit ${missionIndex + 1}`}
          </span>
        </div>
        <p className="line-clamp-1 text-xs font-semibold leading-snug text-white/66">{mission.prompt}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden pr-0.5">
        <ControlGroup
          icon={<Database className="h-4 w-4" />}
          label="Kaynak kilidi"
          testId={`${MODULE_ID}-source`}
          columns="three"
        >
          {sourceOrder.map((item) => (
            <OptionButton
              key={item}
              active={source === item}
              accent={sourceCopy[item].accent}
              testId={`${MODULE_ID}-source-${item}`}
              onClick={() => onSourceChange(item)}
              title={sourceCopy[item].label}
              subtitle={sourceCopy[item].short}
            />
          ))}
        </ControlGroup>

        <ControlGroup
          icon={<Filter className="h-4 w-4" />}
          label="Filtre kilidi"
          testId={`${MODULE_ID}-filter`}
          columns="two"
        >
          {filterOrder.map((item) => (
            <OptionButton
              key={item}
              active={filter === item}
              accent={filterCopy[item].accent}
              testId={`${MODULE_ID}-filter-${item}`}
              onClick={() => onFilterChange(item)}
              title={filterCopy[item].label}
              subtitle={filterCopy[item].short}
            />
          ))}
        </ControlGroup>

        <ControlGroup
          icon={<FileText className="h-4 w-4" />}
          label="Yargı kilidi"
          testId={`${MODULE_ID}-verdict`}
          columns="two"
        >
          {verdictOrder.map((item) => (
            <OptionButton
              key={item}
              active={verdict === item}
              accent={verdictCopy[item].accent}
              testId={`${MODULE_ID}-verdict-${item}`}
              onClick={() => onVerdictChange(item)}
              title={verdictCopy[item].label}
              subtitle={verdictCopy[item].short}
            />
          ))}
        </ControlGroup>
      </div>

      <div className="shrink-0">
        {solved ? (
          <motion.button
            type="button"
            data-testid={`${MODULE_ID}-check`}
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[20px] border border-[#00FF88]/35 bg-[#00FF88]/14 px-4 py-3 text-sm font-black text-emerald-50 shadow-[0_0_30px_rgba(0,255,136,0.14)] transition hover:bg-[#00FF88]/18"
          >
            {missionIndex === missionCount - 1 ? 'Final Yargıyı Aç' : 'Sıradaki Veri Seti'}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            data-testid={`${MODULE_ID}-check`}
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCheck}
            className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[20px] border px-4 py-3 text-sm font-black shadow-[0_0_30px_rgba(0,229,255,0.12)] transition ${
              ready
                ? 'border-[#00E5FF]/35 bg-[#00E5FF]/14 text-cyan-50 hover:bg-[#00E5FF]/18'
                : 'border-white/12 bg-white/[0.055] text-white/58 hover:border-[#00E5FF]/30 hover:text-cyan-100'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Yargıyı Test Et
          </motion.button>
        )}
      </div>
    </div>
  );
}

function ControlGroup({
  icon,
  label,
  testId,
  columns,
  children,
}: {
  icon: ReactNode;
  label: string;
  testId: string;
  columns: 'two' | 'three';
  children: ReactNode;
}) {
  return (
    <div className="mb-1" data-testid={testId}>
      <div className="mb-0.5 flex items-center gap-1.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/44">
        {icon}
        {label}
      </div>
      <div className={`grid gap-1 ${columns === 'three' ? 'grid-cols-3' : 'grid-cols-2'}`}>{children}</div>
    </div>
  );
}

function OptionButton({
  active,
  accent,
  testId,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  accent: string;
  testId: string;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.button
      type="button"
      data-testid={testId}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-[34px] rounded-[14px] border px-2 py-1 text-left transition ${
        active
          ? 'bg-white/[0.10] text-white shadow-[0_0_26px_rgba(0,229,255,0.12)]'
          : 'border-white/10 bg-white/[0.045] text-white/66 hover:border-white/24 hover:text-white'
      }`}
      style={{ borderColor: active ? `${accent}88` : undefined }}
    >
      <div className="flex items-center gap-2">
        {active && <BadgeCheck className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />}
        <span className="text-[12px] font-black leading-tight">{title}</span>
      </div>
      <p className="hidden text-[10px] font-bold leading-tight text-white/48 2xl:mt-0.5 2xl:block">{subtitle}</p>
    </motion.button>
  );
}
