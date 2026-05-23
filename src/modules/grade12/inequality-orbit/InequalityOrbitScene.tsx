import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import {
  getActiveIntervals,
  getActivePoints,
  MODULE_ID,
  OrbitMission,
  OrbitScanner,
  scannerCopy,
} from './inequalityOrbitModel';
import type { Grade12StageStatus } from '../shared/Grade12FullStageLab';

interface InequalityOrbitSceneProps {
  mission: OrbitMission;
  scanner: OrbitScanner | null;
  status: Grade12StageStatus;
  solved: boolean;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function InequalityOrbitScene({ mission, scanner, status, solved, onHome }: InequalityOrbitSceneProps) {
  const selected = scanner ? scannerCopy[scanner] : null;
  const selectedMatchesExpected = scanner !== null && scanner === mission.expectedScanner;
  const hasScannerError = status === 'error' && scanner !== null && !selectedMatchesExpected;
  const hasMissingScannerError = status === 'error' && scanner === null;
  const accent = selected?.accent ?? neutralAccent;
  const activePoints = getActivePoints(mission, scanner);
  const activeIntervals = getActiveIntervals(mission, scanner);
  const scannerTarget = getScannerTarget(activePoints, activeIntervals);
  const statusLabel = solved
    ? 'Yörünge kilitlendi'
    : scanner === null
      ? hasMissingScannerError
        ? 'Tarayıcı eksik'
        : 'Tarayıcı seç'
      : hasScannerError
        ? 'Yanlış tarayıcı alarmı'
        : 'Tarama önizlemesi';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div data-testid={`${MODULE_ID}-scene`} className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.04)_0_1px,transparent_1px_96px)] opacity-45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_40%,rgba(0,229,255,0.12),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(179,136,255,0.10),transparent_34%)]" />

      <div className="relative flex h-full w-full items-center justify-center px-7 py-6">
        <motion.div
          data-testid={`${MODULE_ID}-manipulator`}
          role="group"
          aria-label={`${mission.title}: ${mission.prompt}`}
          aria-keyshortcuts="Home"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative h-[min(88dvh,700px)] w-[98%] outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/70"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ perspective: 1200 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[3%] z-30 flex w-[min(86%,900px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/36 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif görev</p>
              <p className="truncate text-sm font-black text-white/86">{mission.title}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: hasScannerError ? '#FF4FA355' : `${accent}44`,
                color: hasScannerError ? '#FF8ABB' : accent,
                backgroundColor: hasScannerError ? 'rgba(255,79,163,0.12)' : `${accent}14`,
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div className="absolute inset-x-[1%] top-[10%] h-[78%] rounded-[68px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(14,43,62,0.96),rgba(5,10,20,0.76)_54%,rgba(1,4,10,0.92))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />
          <div className="absolute inset-x-[7%] top-[68%] h-[16%] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.52))] shadow-[0_26px_64px_rgba(0,0,0,0.42),inset_0_10px_20px_rgba(255,255,255,0.04)]" />
          <div className="absolute inset-x-[6%] top-[32%] h-[34%] rounded-[52px] border border-white/8 bg-[linear-gradient(180deg,rgba(0,0,0,0.58),rgba(0,0,0,0.28))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72)]" />

          <div className="absolute left-1/2 top-[15%] z-20 w-max max-w-[min(88vw,720px)] -translate-x-1/2 rounded-[26px] border border-[#00E5FF]/24 bg-[#03111b]/94 px-7 py-3.5 text-center shadow-[0_20px_54px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">işaret komutu</p>
            <ExpressionDisplay expression={mission.expression} relation={mission.relation} />
          </div>

          <div className="absolute inset-x-[8%] top-[43%] z-10 h-6 rounded-full bg-black/72 shadow-[inset_0_5px_14px_rgba(0,0,0,0.78)]" />
          <div className="absolute inset-x-[8%] top-[42.5%] z-10 h-8 rounded-full bg-[linear-gradient(90deg,rgba(0,229,255,0.20),rgba(255,255,255,0.14),rgba(0,229,255,0.20))]" />

          {mission.intervals.map((interval) => {
            const active = activeIntervals.some((item) => item.id === interval.id);
            const signTone = getSignTone(interval.sign);
            const glow = active ? (hasScannerError ? '#FF4FA3' : accent) : signTone.accent;
            const width = Math.max(interval.to - interval.from, 6);

            return (
              <motion.div
                key={interval.id}
                className="absolute top-[35%] z-20 flex h-[124px] flex-col items-center justify-center gap-3 rounded-[32px] border px-3 py-3 text-center shadow-[0_20px_48px_rgba(0,0,0,0.34)] backdrop-blur-xl"
                style={{
                  left: `${interval.from}%`,
                  width: `${width}%`,
                  background: active ? signTone.activeSurface : signTone.surface,
                  borderColor: active ? `${glow}88` : `${signTone.accent}34`,
                  boxShadow: active ? `0 18px 42px rgba(0,0,0,0.34), 0 0 42px ${glow}3d` : '0 18px 42px rgba(0,0,0,0.32)',
                }}
                animate={{ y: active ? [-2, 2, -2] : 0 }}
                transition={{ duration: 2.2, repeat: active ? Infinity : 0 }}
              >
                <div
                  className="flex min-w-[112px] max-w-full items-center justify-center rounded-[20px] border bg-black/64 px-4 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
                  style={{ borderColor: active ? `${glow}77` : 'rgba(255,255,255,0.16)' }}
                >
                  <span className="whitespace-nowrap font-mono text-[clamp(1rem,1.35vw,1.18rem)] font-black leading-none tracking-normal text-white/92">
                    {interval.range}
                  </span>
                </div>
                <div
                  className="flex min-w-[112px] max-w-full items-center justify-center gap-2 rounded-[18px] border px-3 py-2 shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
                  style={{
                    borderColor: `${signTone.accent}88`,
                    background: signTone.badgeSurface,
                    boxShadow: `0 12px 24px rgba(0,0,0,0.25), 0 0 24px ${signTone.accent}24`,
                  }}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-[12px] font-mono text-3xl font-black leading-none"
                    style={{ backgroundColor: signTone.accent, color: signTone.ink }}
                  >
                    {signTone.symbol}
                  </span>
                  <span className="hidden font-mono text-[10px] font-black uppercase tracking-[0.16em] sm:inline" style={{ color: signTone.accent }}>
                    {signTone.label}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {scanner !== null && scannerTarget !== null && (
            <motion.div
              className="pointer-events-none absolute top-[29%] z-30 h-[40%] w-[18%] rounded-[42px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))] shadow-[0_0_60px_rgba(0,229,255,0.20)] backdrop-blur-[1px]"
              style={{
                left: `${scannerTarget}%`,
                borderColor: hasScannerError ? '#FF4FA366' : `${accent}77`,
                boxShadow: `0 0 54px ${hasScannerError ? '#FF4FA3' : accent}28, inset 0 0 18px ${hasScannerError ? '#FF4FA3' : accent}10`,
              }}
              initial={false}
              animate={{ opacity: 1, y: solved ? [0, -4, 0] : 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="absolute left-1/2 top-[-34px] h-[46px] w-[46px] -translate-x-1/2 rounded-[20px] border bg-black/60 shadow-[0_0_32px_rgba(0,0,0,0.35)]"
                style={{ borderColor: `${accent}77` }}
              />
              <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full" style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }} />
              <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-white/34" />
            </motion.div>
          )}

          {mission.points.map((point) => {
            const active = activePoints.some((item) => item.value === point.value && item.kind === point.kind);
            const pointAccent = point.kind === 'forbidden' ? '#FF8ABB' : '#00E5FF';
            const pointFill = point.kind === 'forbidden'
              ? 'linear-gradient(180deg,#4a1230,#170716)'
              : 'linear-gradient(180deg,#10374a,#061521)';
            const glow = active ? (hasScannerError ? '#FF4FA3' : accent) : pointAccent;

            return (
              <motion.div
                key={`${point.kind}-${point.value}`}
                className="absolute top-[51%] z-40 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${point.position}%` }}
                animate={{ y: active ? [-3, 2, -3] : 0 }}
                transition={{ duration: 2.1, repeat: active ? Infinity : 0 }}
              >
                <div
                  className="relative grid h-[124px] w-[124px] place-items-center rounded-[40px] border shadow-[0_24px_56px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.16)]"
                  style={{
                    background: pointFill,
                    borderColor: active ? `${glow}aa` : point.kind === 'forbidden' ? '#FF4FA388' : `${pointAccent}44`,
                    boxShadow: active
                      ? `0 22px 50px rgba(0,0,0,0.36), 0 0 46px ${glow}48`
                      : point.kind === 'forbidden'
                        ? '0 22px 50px rgba(0,0,0,0.36), 0 0 26px rgba(255,79,163,0.20)'
                        : '0 22px 50px rgba(0,0,0,0.36)',
                  }}
                >
                  {point.kind === 'forbidden' && (
                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-[#FF8ABB]/75 bg-[#FF4FA3]/22 font-mono text-lg font-black text-[#FFB8D6] shadow-[0_0_22px_rgba(255,79,163,0.35)]">
                      !
                    </span>
                  )}
                  <span className="text-4xl font-black text-white lg:text-5xl">{point.value}</span>
                </div>
                <div
                  className="mt-3 rounded-full border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em]"
                  style={{ borderColor: `${glow}66`, color: glow, backgroundColor: `${glow}12` }}
                >
                  {getPointStateLabel(mission, point)}
                </div>
              </motion.div>
            );
          })}

          {scanner !== null && (
            <motion.div
              className="absolute left-1/2 top-[78%] z-50 flex w-[min(70%,720px)] -translate-x-1/2 items-center justify-between gap-5 rounded-[30px] border bg-[#03111b]/94 px-5 py-4 shadow-[0_24px_62px_rgba(0,0,0,0.40)] backdrop-blur-2xl"
              style={{ borderColor: hasScannerError ? '#FF4FA355' : `${accent}66` }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: hasScannerError ? '#FF8ABB' : accent }}>
                  {solved ? 'kilit sonucu' : hasScannerError ? 'alarm' : 'tarama önizlemesi'}
                </p>
                <p className="mt-1 truncate text-base font-black text-white">
                  {solved
                    ? `${mission.targetValue} kilidi açıldı`
                    : hasScannerError
                      ? 'Bu tarayıcı görevin istediği kilit değil'
                      : `${selected?.label ?? 'Tarayıcı'} yörüngede iz bırakıyor`}
                </p>
                <p className="mt-1 hidden text-xs font-bold text-white/44 lg:block">
                  {solved ? mission.proof : hasScannerError && scanner !== null ? mission.failure[scanner] : selected?.hint}
                </p>
              </div>
              <div
                className="grid h-[78px] w-[88px] shrink-0 place-items-center rounded-[26px] border bg-black/42 font-mono text-2xl font-black text-white"
                style={{ borderColor: hasScannerError ? '#FF4FA366' : `${accent}77`, boxShadow: `0 0 32px ${hasScannerError ? '#FF4FA3' : accent}33` }}
              >
                {solved ? mission.resultBadge : hasScannerError ? '!' : selected?.short}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ExpressionDisplay({ expression, relation }: { expression: string; relation: string }) {
  const fraction = parseFractionExpression(expression);
  const inlineRelation = shouldInlineRelation(relation);

  if (fraction === null) {
    if (inlineRelation) {
      return (
        <p className="mt-1 whitespace-nowrap text-[clamp(1.35rem,2.15vw,2rem)] font-black tracking-tight text-white">
          {expression} <span className="font-mono text-[0.82em] text-white/86">{relation}</span>
        </p>
      );
    }

    return (
      <>
        <p className="mt-1 text-2xl font-black tracking-tight text-white lg:text-3xl">{expression}</p>
        <p className="mt-1 font-mono text-sm font-black text-white/58">{relation}</p>
      </>
    );
  }

  return (
    <>
      <div className="mt-1 flex items-center justify-center gap-3 text-white">
        {fraction.prefix && <span className="text-2xl font-black tracking-tight lg:text-3xl">{fraction.prefix}</span>}
        <span className="inline-grid min-w-[150px] grid-rows-[auto_2px_auto] items-center justify-items-center rounded-2xl bg-white/[0.035] px-4 py-2 shadow-[inset_0_0_18px_rgba(0,229,255,0.08)]">
          <span className="font-mono text-xl font-black leading-tight lg:text-2xl">{fraction.numerator}</span>
          <span className="my-1 h-0.5 w-full rounded-full bg-white/82 shadow-[0_0_14px_rgba(0,229,255,0.20)]" />
          <span className="font-mono text-xl font-black leading-tight lg:text-2xl">{fraction.denominator}</span>
        </span>
        {inlineRelation && <span className="whitespace-nowrap font-mono text-2xl font-black text-white/86 lg:text-3xl">{relation}</span>}
      </div>
      {!inlineRelation && <p className="mt-1 font-mono text-sm font-black text-white/58">{relation}</p>}
    </>
  );
}

function shouldInlineRelation(relation: string) {
  return relation.includes('<') || relation.includes('>') || relation.includes('≤') || relation.includes('≥');
}

function getSignTone(sign: 'positive' | 'negative') {
  if (sign === 'positive') {
    return {
      symbol: '+',
      label: 'Pozitif',
      accent: '#00FF88',
      ink: '#00180E',
      surface: 'linear-gradient(180deg,rgba(0,255,136,0.12),rgba(0,0,0,0.40) 68%)',
      activeSurface: 'linear-gradient(180deg,rgba(0,255,136,0.20),rgba(0,0,0,0.34) 68%)',
      badgeSurface: 'linear-gradient(180deg,rgba(0,255,136,0.18),rgba(0,255,136,0.055))',
    };
  }

  return {
    symbol: '-',
    label: 'Negatif',
    accent: '#FBBF24',
    ink: '#1E1200',
    surface: 'linear-gradient(180deg,rgba(251,191,36,0.13),rgba(0,0,0,0.42) 68%)',
    activeSurface: 'linear-gradient(180deg,rgba(251,191,36,0.22),rgba(0,0,0,0.36) 68%)',
    badgeSurface: 'linear-gradient(180deg,rgba(251,191,36,0.20),rgba(251,191,36,0.06))',
  };
}

function parseFractionExpression(expression: string) {
  const [left, denominatorRaw] = expression.split(' / ');
  if (denominatorRaw === undefined) return null;

  const equalsIndex = left.lastIndexOf('=');
  const prefix = equalsIndex >= 0 ? left.slice(0, equalsIndex + 1).trim() : '';
  const numeratorRaw = equalsIndex >= 0 ? left.slice(equalsIndex + 1).trim() : left.trim();

  return {
    prefix,
    numerator: stripOuterParens(numeratorRaw),
    denominator: stripOuterParens(denominatorRaw.trim()),
  };
}

function stripOuterParens(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function getPointStateLabel(mission: OrbitMission, point: OrbitMission['points'][number]) {
  const isInequality = mission.relation.includes('<') || mission.relation.includes('>') || mission.relation.includes('≤') || mission.relation.includes('≥');

  if (!isInequality) {
    return point.kind === 'forbidden' ? 'payda yasak' : 'kök istasyonu';
  }

  if (point.kind === 'forbidden') return 'yasak açık';
  return point.included ? 'kök kapalı' : 'kök açık';
}

function getScannerTarget(points: ReturnType<typeof getActivePoints>, intervals: ReturnType<typeof getActiveIntervals>) {
  if (intervals.length > 0) {
    const first = intervals[0];
    const last = intervals[intervals.length - 1];
    return Math.max(Math.min((first.from + last.to) / 2 - 9, 78), 5);
  }

  if (points.length > 0) {
    const average = points.reduce((sum, point) => sum + point.position, 0) / points.length;
    return Math.max(Math.min(average - 9, 78), 5);
  }

  return null;
}
