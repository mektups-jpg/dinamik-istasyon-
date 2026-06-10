import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import {
  DataVerdictMission,
  explainDataVerdictMismatch,
  FilterTool,
  filterCopy,
  isDataVerdictCorrect,
  MODULE_ID,
  SourceTool,
  sourceCopy,
  VerdictTool,
  verdictCopy,
} from './dataVerdictModel';

interface DataVerdictSceneProps {
  mission: DataVerdictMission;
  source: SourceTool | null;
  filter: FilterTool | null;
  verdict: VerdictTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function DataVerdictScene({
  mission,
  source,
  filter,
  verdict,
  solved,
  status,
  onHome,
}: DataVerdictSceneProps) {
  const sourceOk = source === mission.expectedSource;
  const filterOk = filter === mission.expectedFilter;
  const verdictOk = verdict === mission.expectedVerdict;
  const checked = status === 'success' || status === 'error';
  const correct = isDataVerdictCorrect(mission, source, filter, verdict);
  const accent = filter ? filterCopy[filter].accent : mission.accent ?? neutralAccent;
  const alarm = checked && !correct;
  const alarmMessage = alarm ? explainDataVerdictMismatch(mission, source, filter, verdict) : '';
  const stageLabel = solved
    ? 'Yargı mühürlendi'
    : source === null && filter === null && verdict === null
      ? 'Veri hattı bekliyor'
      : alarm
        ? 'Kanıt zinciri alarmı'
        : 'Kanıt zinciri kuruluyor';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.045)_0_1px,transparent_1px_92px),linear-gradient(180deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_92px)] opacity-45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_31%,rgba(0,229,255,0.13),transparent_42%),radial-gradient(circle_at_72%_72%,rgba(0,255,136,0.10),transparent_34%)]" />

      <div className="relative flex h-full w-full items-center justify-center px-5 py-4">
        <motion.div
          data-testid={`${MODULE_ID}-manipulator`}
          role="group"
          aria-label={`${mission.title}: ${mission.prompt}`}
          aria-keyshortcuts="Home"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative h-full min-h-[640px] w-[98.5%] outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/70"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[2%] z-40 flex w-[min(92%,1020px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/42 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif veri seti</p>
              <p className="truncate text-sm font-black text-white/88">{mission.dataset}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: alarm ? '#FF4FA355' : `${accent}55`,
                color: alarm ? '#FF8ABB' : accent,
                backgroundColor: alarm ? 'rgba(255,79,163,0.12)' : `${accent}14`,
              }}
            >
              {stageLabel}
            </div>
          </div>

          <div className="absolute inset-x-[1%] top-[8%] h-[86%] rounded-[58px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(5,24,39,0.96),rgba(1,9,18,0.80)_56%,rgba(1,4,10,0.94))] shadow-[0_54px_130px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.13)]" />

          <DataPipeline
            mission={mission}
            source={source}
            filter={filter}
            verdict={verdict}
            solved={solved}
            status={status}
            sourceOk={sourceOk}
            filterOk={filterOk}
            verdictOk={verdictOk}
            accent={accent}
            alarm={alarm}
          />

          <div
            data-testid={`${MODULE_ID}-chart`}
            className="absolute bottom-[8%] left-1/2 z-40 flex w-[min(80%,840px)] -translate-x-1/2 items-center justify-between gap-5 rounded-[30px] border bg-[#03111b]/96 px-5 py-4 shadow-[0_24px_62px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
            style={{ borderColor: alarm ? '#FF4FA355' : solved ? '#00FF8877' : `${accent}55` }}
          >
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: alarm ? '#FF8ABB' : accent }}>
                {alarm ? 'kanıt zinciri kırıldı' : solved ? 'sonuç cümlesi' : 'seçili okuma'}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white/95 lg:text-base">
                {alarm
                  ? alarmMessage
                  : solved
                    ? mission.conclusion
                    : verdict
                      ? verdictCopy[verdict].hint
                      : 'Kaynak, filtre ve yargı seçilince sonuç cümlesi burada açılacak.'}
              </p>
              <p className="mt-1 hidden text-xs font-bold text-white/46 lg:block">{solved ? mission.proof : mission.metric}</p>
            </div>
            <div
              data-testid={`${MODULE_ID}-verdict-visual`}
              className="grid h-[78px] w-[108px] shrink-0 place-items-center rounded-[26px] border bg-black/44 px-2 text-center font-mono text-lg font-black text-white"
              style={{ borderColor: alarm ? '#FF4FA366' : solved ? '#00FF8877' : `${accent}77`, boxShadow: `0 0 34px ${alarm ? '#FF4FA3' : solved ? '#00FF88' : accent}33` }}
            >
              {alarm ? '!' : solved ? mission.badge : verdict ? 'TASLAK' : 'YARGI'}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DataPipeline({
  mission,
  source,
  filter,
  verdict,
  solved,
  status,
  sourceOk,
  filterOk,
  verdictOk,
  accent,
  alarm,
}: {
  mission: DataVerdictMission;
  source: SourceTool | null;
  filter: FilterTool | null;
  verdict: VerdictTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  sourceOk: boolean;
  filterOk: boolean;
  verdictOk: boolean;
  accent: string;
  alarm: boolean;
}) {
  const max = Math.max(...mission.rows.map((row) => row.value));
  const activeSource = source ? sourceCopy[source] : null;
  const activeFilter = filter ? filterCopy[filter] : null;
  const activeVerdict = verdict ? verdictCopy[verdict] : null;
  const checked = status === 'success' || status === 'error';
  const verdictGlow = alarm ? '#FF4FA3' : verdictOk && checked ? '#00FF88' : activeVerdict?.accent ?? '#00E5FF';

  return (
    <div className="absolute inset-x-[4%] top-[18%] z-20 h-[58%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,16,28,0.98),rgba(0,0,0,0.62))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 430" role="img" aria-label={`${mission.dataset} veri yargı hattı`}>
        <defs>
          <linearGradient id={`data-flow-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.92" />
            <stop offset="50%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={verdictGlow} stopOpacity="0.94" />
          </linearGradient>
          <filter id={`data-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <line x1="88" x2="904" y1="206" y2="206" stroke="rgba(255,255,255,0.12)" strokeWidth="34" strokeLinecap="round" />
        <motion.line
          x1="88"
          x2={verdict ? 904 : filter ? 704 : source ? 448 : 270}
          y1="206"
          y2="206"
          stroke={`url(#data-flow-${mission.id})`}
          strokeWidth="18"
          strokeLinecap="round"
          filter={`url(#data-glow-${mission.id})`}
          animate={{ strokeDashoffset: [0, -32] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          strokeDasharray="18 16"
        />

        <SourcePort source={source} ok={sourceOk} checked={checked} />
        <FilterGate filter={filter} ok={filterOk} checked={checked} accent={accent} />
        <ChartCore mission={mission} filter={filter} solved={solved} alarm={alarm} max={max} accent={accent} />
        <VerdictSeal verdict={verdict} ok={verdictOk} checked={checked} color={verdictGlow} solved={solved} />
      </svg>

      <div className="absolute left-[4%] top-[9%] z-30 w-[190px] rounded-[24px] border border-[#00E5FF]/18 bg-black/42 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/62">kaynak izi</p>
        <p className="mt-1 text-sm font-black text-white">{activeSource?.label ?? 'Kaynak seç'}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/48">{activeSource?.short ?? mission.sourceStamp}</p>
      </div>

      <div className="absolute left-[38%] top-[7%] z-30 w-[230px] -translate-x-1/2 rounded-[24px] border border-white/10 bg-black/38 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/46">filtre okuması</p>
        <p className="mt-1 text-sm font-black text-white">{activeFilter?.label ?? 'Filtre bekliyor'}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/48">{activeFilter?.hint ?? mission.metric}</p>
      </div>

      <div className="absolute right-[5%] top-[8%] z-30 w-[220px] rounded-[24px] border border-white/10 bg-black/38 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/46">yargı kapsülü</p>
        <p className="mt-1 text-sm font-black text-white">{activeVerdict?.label ?? 'Sonuç seç'}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/48">{activeVerdict?.hint ?? 'Kaynak + filtre + grafik birleşince mühür açılır.'}</p>
      </div>
    </div>
  );
}

function SourcePort({ source, ok, checked }: { source: SourceTool | null; ok: boolean; checked: boolean }) {
  const color = source ? sourceCopy[source].accent : '#00E5FF';
  const alarm = checked && !ok;
  return (
    <g data-testid={`${MODULE_ID}-source-visual`}>
      <circle cx="120" cy="206" r="56" fill="rgba(0,0,0,0.46)" stroke={alarm ? '#FF4FA3' : color} strokeWidth="5" />
      <circle cx="120" cy="206" r="34" fill={source ? `${color}26` : 'rgba(255,255,255,0.06)'} stroke="rgba(255,255,255,0.18)" />
      <text x="120" y="212" textAnchor="middle" fill="white" fontSize="18" fontWeight="900">{alarm ? '!' : source ? 'K' : '?'}</text>
      <text x="120" y="284" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="14" fontWeight="800">kaynak</text>
    </g>
  );
}

function FilterGate({ filter, ok, checked, accent }: { filter: FilterTool | null; ok: boolean; checked: boolean; accent: string }) {
  const alarm = checked && !ok;
  const label = filter ? filterCopy[filter].short : 'filtre';
  return (
    <g data-testid={`${MODULE_ID}-filter-visual`}>
      <motion.rect
        x="332"
        y="140"
        width="190"
        height="132"
        rx="34"
        fill="rgba(0,0,0,0.48)"
        stroke={alarm ? '#FF4FA3' : accent}
        strokeWidth="5"
        animate={{ y: filter ? [140, 134, 140] : 140 }}
        transition={{ duration: 2.4, repeat: filter ? Infinity : 0 }}
      />
      <path d="M376 174 H478 L438 214 V244 H416 V214 Z" fill={filter ? `${accent}55` : 'rgba(255,255,255,0.12)'} stroke="rgba(255,255,255,0.28)" />
      <text x="427" y="300" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="16" fontWeight="900">{alarm ? 'yanlış filtre' : label}</text>
    </g>
  );
}

function ChartCore({
  mission,
  filter,
  solved,
  alarm,
  max,
  accent,
}: {
  mission: DataVerdictMission;
  filter: FilterTool | null;
  solved: boolean;
  alarm: boolean;
  max: number;
  accent: string;
}) {
  const baseline = 286;
  return (
    <g>
      <rect x="585" y="126" width="214" height="190" rx="32" fill="rgba(3,17,27,0.88)" stroke={alarm ? '#FF4FA355' : `${accent}77`} strokeWidth="4" />
      {mission.rows.map((row, index) => {
        const barHeight = 46 + (row.value / max) * 78;
        const x = 618 + index * 40;
        const y = baseline - barHeight;
        const color = solved ? mission.accent : filter ? accent : '#00E5FF';
        return (
          <g key={row.label}>
            <rect
              x={x}
              y={y}
              width="28"
              height={barHeight}
              rx="10"
              fill={`${color}66`}
              stroke={`${color}DD`}
            />
            <text x={x + 14} y="306" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="10" fontWeight="800">{compactChartLabel(row.label)}</text>
            {filter !== null && (
              <text x={x + 14} y={y + barHeight / 2 + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="900">{row.value}</text>
            )}
          </g>
        );
      })}
      {(filter === 'median' || filter === 'iqr') && (
        <motion.line
          x1="612"
          x2="782"
          y1={filter === 'median' ? 222 : 238}
          y2={filter === 'median' ? 222 : 238}
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
      {filter === 'trend' && (
        <polyline points="632,174 672,166 712,158 752,132" fill="none" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </g>
  );
}

function compactChartLabel(label: string) {
  return label.startsWith('Bölge ') ? label.replace('Bölge ', '') : label;
}

function VerdictSeal({
  verdict,
  ok,
  checked,
  color,
  solved,
}: {
  verdict: VerdictTool | null;
  ok: boolean;
  checked: boolean;
  color: string;
  solved: boolean;
}) {
  const alarm = checked && !ok;
  return (
    <g>
      <motion.circle
        cx="902"
        cy="206"
        r="66"
        fill={solved ? 'rgba(0,255,136,0.16)' : 'rgba(0,0,0,0.50)'}
        stroke={alarm ? '#FF4FA3' : color}
        strokeWidth="6"
        animate={{ scale: solved ? [1, 1.04, 1] : 1 }}
        transition={{ duration: 1.3, repeat: solved ? Infinity : 0 }}
        style={{ transformOrigin: '902px 206px' }}
      />
      <text x="902" y="201" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{alarm ? 'RED' : solved ? 'ONAY' : verdict ? 'TASLAK' : '?'}</text>
      <text x="902" y="226" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="13" fontWeight="800">{solved && verdict ? verdictCopy[verdict].short : verdict ? 'test bekler' : 'yargı'}</text>
    </g>
  );
}
