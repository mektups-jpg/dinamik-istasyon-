import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import {
  MODULE_ID,
  formatFunctionStep,
  formatFunctionRule,
  modeCopy,
  modeTheme,
  nextTermProjection,
  relationLabels,
  SequenceMission,
  WheelMode,
} from './sequenceWheelModel';

const neutralTheme = {
  accent: '#00E5FF',
  second: '#8EA8B8',
  shadow: 'rgba(0,229,255,0.16)',
  rail: 'from-[#243748] via-[#5E7A8C] to-[#243748]',
  meter: 'Mercek bekliyor',
};

interface SequenceWheelSceneProps {
  mission: SequenceMission;
  mode: WheelMode | null;
  offset: number;
  solved: boolean;
  onNudge: (direction: -1 | 1) => void;
  onHome: () => void;
}

export function SequenceWheelScene({ mission, mode, offset, solved, onNudge, onHome }: SequenceWheelSceneProps) {
  const theme = mode ? modeTheme[mode] : neutralTheme;
  const isCorrectLens = mode !== null && mode === mission.expectedMode;
  const nodes = mission.values.map((value, index) => ({
    value,
    index,
    x: 12 + index * 19,
  }));
  const relations = mode ? relationLabels(mission.values, mode, mission.functionPower) : mission.values.slice(0, -1).map(() => '?');
  const relationMetrics = mode ? relationMetricValues(mission.values, mode) : mission.values.slice(0, -1).map(() => 1);
  const relationBars = relationMetrics.map((value) => metricBarHeight(value, relationMetrics));
  const lensStatus = solved ? 'Kural kilitlendi' : mode === null ? 'Mercek seç' : isCorrectLens ? 'Mercek sahnede deneniyor' : 'Mercek bu rayla uyuşmuyor';
  const engineLabel = mode ? modeCopy[mode].engine : 'Mercek seçilmedi';
  const engineShort = mode === 'function'
    ? formatFunctionRule(mission.functionPower)
    : mode && isCorrectLens
      ? relations[0]
      : mode
        ? modeCopy[mode].short
        : '?';
  const meterLabel = mode ? modeTheme[mode].meter : 'Mercek bekliyor';
  const motorCaption = mode === null ? 'Önce merceği seç' : solved ? 'Kural kilitlendi' : 'İlişki motoru çalışıyor';
  const stabilityLabel = mode === null ? 'Seçimden sonra açılır' : isCorrectLens ? 'Aynı okuma korunuyor' : 'Okuma dengesi bozuldu';
  const statusColor = mode === null ? theme.accent : isCorrectLens ? theme.accent : '#FF8ABB';
  const statusBorder = mode === null ? `${theme.accent}36` : isCorrectLens ? `${theme.accent}44` : '#FF4FA344';
  const statusBackground = mode === null ? 'rgba(0,229,255,0.07)' : isCorrectLens ? 'rgba(0,229,255,0.08)' : 'rgba(255,79,163,0.10)';
  const relationBorder = mode === null ? `${theme.accent}30` : isCorrectLens ? `${theme.second}66` : 'rgba(255,79,163,0.55)';
  const relationGlow = mode === null ? theme.shadow : isCorrectLens ? theme.shadow : 'rgba(255,79,163,0.18)';
  const projection = mode ? nextTermProjection(mission.values, mode, mission.functionPower) : null;
  const projectionLabel = mode === 'function' ? `n=${mission.values.length + 1}` : `a${mission.values.length + 1}`;
  const pulseColor = isCorrectLens ? theme.accent : '#FF4FA3';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onNudge(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNudge(1);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.026)_0_1px,transparent_1px_112px)] opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_46%_48%,rgba(255,255,255,0.045),transparent_48%)]" />

      <div className="relative flex h-full w-full items-center justify-center px-5 py-6 sm:px-9">
        <motion.div
          data-testid={`${MODULE_ID}-manipulator`}
          role="group"
          aria-label={`${mission.title}: ${mission.prompt}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative h-[min(42dvh,360px)] w-[min(94vw,620px)] outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/70 sm:w-[min(88vw,720px)] lg:h-[min(76dvh,560px)] lg:w-[92%] xl:w-[88%]"
          animate={{ x: offset * 26 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[4%] z-30 hidden w-[min(84%,760px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/28 px-4 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl md:flex">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/40">aktif deney</p>
              <p className="truncate text-sm font-black text-white/82">{mission.title}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: statusBorder,
                color: statusColor,
                backgroundColor: statusBackground,
              }}
            >
              {lensStatus}
            </div>
          </div>

          <div
            className="absolute inset-x-[4%] top-[24%] h-[54%] rounded-[52px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,34,47,0.72),rgba(2,7,13,0.20))]"
            style={{ boxShadow: `0 34px 100px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 70px ${theme.shadow}` }}
          />
          <div className="absolute inset-x-[10%] top-[47%] h-[32px] -translate-y-1/2 rounded-full bg-black/54 shadow-[inset_0_5px_12px_rgba(0,0,0,0.78)]" />
          <div className={`absolute inset-x-[11%] top-[47%] h-[13px] -translate-y-1/2 rounded-full bg-gradient-to-r ${theme.rail}`} style={{ boxShadow: `0 0 38px ${theme.shadow}` }} />
          {mode !== null && (
            <>
              {nodes.slice(0, -1).map((node, index) => {
                const next = nodes[index + 1];

                return (
                  <motion.span
                    key={`${mission.id}-${mode}-pulse-${index}`}
                    aria-hidden
                    className="pointer-events-none absolute top-[47%] z-[16] h-4 w-4 -translate-y-1/2 rounded-full border border-white/40"
                    style={{
                      backgroundColor: pulseColor,
                      boxShadow: `0 0 26px ${isCorrectLens ? theme.shadow : 'rgba(255,79,163,0.22)'}`,
                    }}
                    animate={{
                      left: [`${node.x + 1.8}%`, `${next.x - 1.8}%`],
                      opacity: isCorrectLens ? [0, 0.95, 0] : [0, 0.55, 0],
                      scale: isCorrectLens ? [0.7, 1.16, 0.72] : [0.66, 0.9, 0.66],
                    }}
                    transition={{
                      duration: isCorrectLens ? 1.65 : 2.1,
                      repeat: Infinity,
                      delay: index * 0.18,
                      ease: 'easeInOut',
                    }}
                  />
                );
              })}
            </>
          )}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[24%] z-10 h-[54%] w-[3px] rounded-full"
            style={{
              background: `linear-gradient(180deg, transparent, ${theme.accent}, ${theme.second}, transparent)`,
              boxShadow: `0 0 34px ${theme.shadow}`,
            }}
            animate={{ left: ['11%', '88%', '11%'], opacity: [0.18, 0.78, 0.18] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-x-[13%] top-[calc(47%+52px)] h-[96px] rounded-[100%] bg-black/30 blur-lg" />

          {mode === 'function' ? (
            nodes.map((node) => (
              <motion.div
                key={`${mission.id}-${mode}-${node.index}-power-label`}
                className="absolute top-[28%] z-30 flex h-10 min-w-[54px] -translate-x-1/2 items-center justify-center rounded-full border bg-[#030a12]/94 px-3 font-mono text-[16px] font-black text-white shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:top-[36%] lg:h-11 lg:min-w-[62px] lg:text-xl"
                style={{
                  left: `${node.x + 5.6}%`,
                  borderColor: relationBorder,
                  boxShadow: `0 14px 34px rgba(0,0,0,0.34), 0 0 24px ${relationGlow}`,
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: node.index * 0.04 }}
              >
                {formatFunctionStep(node.index + 1, mission.functionPower)}
              </motion.div>
            ))
          ) : nodes.slice(0, -1).map((node, index) => {
            const next = nodes[index + 1];
            const midX = (node.x + next.x) / 2;
            return (
              <motion.div
                key={`${mission.id}-${mode}-${index}-bridge`}
                className="absolute top-[18%] z-10 flex h-10 min-w-[58px] -translate-x-1/2 items-center justify-center rounded-full border bg-[#030a12]/94 px-3 font-mono text-[15px] font-black text-white shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:top-[28%] lg:h-[52px] lg:min-w-[82px] lg:px-4 lg:text-xl"
                style={{
                  left: `${midX}%`,
                  borderColor: relationBorder,
                  boxShadow: `0 14px 34px rgba(0,0,0,0.34), 0 0 24px ${relationGlow}`,
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                {relations[index]}
              </motion.div>
            );
          })}

          {nodes.map((node) => (
            <motion.div
              key={`${mission.id}-${node.index}-${node.value}`}
              className="absolute top-[47%] z-20 flex h-[80px] w-[70px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[22px] border bg-[linear-gradient(160deg,rgba(38,69,82,0.96),rgba(7,16,26,0.94))] text-center shadow-[0_18px_0_rgba(0,0,0,0.16),0_22px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:h-[104px] sm:w-[104px] lg:h-[128px] lg:w-[144px] lg:rounded-[32px] lg:shadow-[0_26px_0_rgba(0,0,0,0.16),0_30px_68px_rgba(0,0,0,0.40)]"
              style={{
                left: `${node.x}%`,
                borderColor: `${theme.accent}55`,
                boxShadow: `0 26px 0 rgba(0,0,0,0.16), 0 30px 68px rgba(0,0,0,0.40), 0 0 34px ${theme.shadow}`,
              }}
              initial={{ scale: 0.88, opacity: 0, y: 10 }}
              animate={{ scale: solved ? [1, 1.07, 1] : 1, opacity: 1, y: 0 }}
              transition={{ delay: node.index * 0.055, duration: solved ? 0.55 : 0.24 }}
            >
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-white/52 lg:text-[11px] lg:tracking-[0.16em]">
                {mode === 'function' ? `n=${node.index + 1}` : `a${node.index + 1}`}
              </span>
              <span className="mt-1 text-[32px] font-black leading-none text-white sm:text-[42px] lg:text-[52px]">{node.value}</span>
              <span className="mt-2 h-1.5 w-9 rounded-full lg:w-14" style={{ backgroundColor: solved ? '#00FF88' : node.index === 0 ? theme.accent : theme.second }} />
            </motion.div>
          ))}

          {projection && (
            <motion.div
              className={`absolute top-[47%] z-[19] hidden h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[28px] border border-dashed text-center backdrop-blur-xl lg:flex ${
                isCorrectLens ? 'bg-[#041b17]/78' : 'bg-[#1b0714]/74'
              }`}
              style={{
                left: '97%',
                borderColor: isCorrectLens ? `${theme.accent}66` : 'rgba(255,79,163,0.52)',
                boxShadow: isCorrectLens ? `0 0 38px ${theme.shadow}` : '0 0 30px rgba(255,79,163,0.18)',
              }}
              initial={{ opacity: 0, scale: 0.84, x: -8 }}
              animate={{ opacity: 1, scale: isCorrectLens ? [1, 1.04, 1] : 1, x: 0 }}
              transition={{ duration: 0.45, scale: { duration: 1.4, repeat: isCorrectLens ? Infinity : 0 } }}
            >
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/50">{projectionLabel}</span>
              <span className="mt-1 text-[34px] font-black leading-none text-white">{isCorrectLens ? projection.value : '!'}</span>
              <span className={`mt-2 h-1.5 w-12 rounded-full ${isCorrectLens ? 'bg-[#00FF88]' : 'bg-[#FF4FA3]'}`} />
            </motion.div>
          )}

          <motion.div
            className="absolute left-1/2 top-[72%] z-30 hidden w-[min(64%,500px)] -translate-x-1/2 items-center justify-between gap-5 rounded-[30px] border border-white/10 bg-[#03111b]/88 px-5 py-4 shadow-[0_24px_54px_rgba(0,0,0,0.38)] backdrop-blur-2xl md:flex"
            style={{ borderColor: statusBorder }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: statusColor }}>
                {meterLabel}
              </p>
              <p className="mt-1 truncate text-base font-black text-white">{engineLabel}</p>
              <p className="mt-1 hidden font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/42 lg:block">{motorCaption}</p>
            </div>
            <div className="relative grid h-[78px] w-[78px] shrink-0 place-items-center rounded-full lg:h-[88px] lg:w-[88px]">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${theme.accent} 0deg 10deg, transparent 10deg 22deg)`,
                  filter: `drop-shadow(0 0 20px ${theme.shadow})`,
                }}
                animate={{
                  rotate: mode === null ? 0 : 360,
                  scale: solved ? [1, 1.08, 1] : 1,
                }}
                transition={{
                  rotate: {
                    duration: isCorrectLens ? 7 : 12,
                    repeat: mode === null ? 0 : Infinity,
                    ease: 'linear',
                  },
                  scale: { duration: 0.68, repeat: solved ? 1 : 0 },
                }}
              />
              <span
                className="absolute inset-[8px] rounded-full border bg-[#03111b]/94 shadow-[inset_0_0_28px_rgba(0,0,0,0.72)]"
                style={{ borderColor: `${theme.second}55` }}
              />
              <span
                className="relative grid h-[48px] w-[48px] place-items-center rounded-full border bg-black/58 font-mono text-2xl font-black text-white lg:h-[56px] lg:w-[56px]"
                style={{ borderColor: statusBorder, boxShadow: `0 0 28px ${theme.shadow}` }}
              >
                {engineShort}
              </span>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute left-1/2 top-[88%] z-20 hidden w-[min(68%,560px)] -translate-x-1/2 items-end justify-between gap-3 rounded-[24px] border border-white/8 bg-black/22 px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.26)] backdrop-blur-xl lg:flex">
            <div className="mr-1 min-w-[118px]">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/36">sabitlik izi</p>
              <p className="mt-1 text-xs font-black text-white/72">{stabilityLabel}</p>
            </div>
            {relations.map((relation, index) => (
              <div key={`${mission.id}-${mode}-meter-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div className="flex h-10 items-end">
                  <motion.span
                    className="block w-7 rounded-t-xl"
                    style={{
                      height: relationBars[index],
                      background: mode === null
                        ? 'linear-gradient(180deg, #8EA8B8, #385366)'
                        : isCorrectLens
                        ? `linear-gradient(180deg, ${theme.second}, ${theme.accent})`
                        : 'linear-gradient(180deg, #FF8ABB, #FF4FA3)',
                      boxShadow: mode === null
                        ? '0 0 14px rgba(142,168,184,0.14)'
                        : isCorrectLens
                          ? `0 0 18px ${theme.shadow}`
                          : '0 0 18px rgba(255,79,163,0.20)',
                    }}
                    initial={{ height: 8 }}
                    animate={{ height: relationBars[index] }}
                  />
                </div>
                <span className="font-mono text-[10px] font-black text-white/58">{relation}</span>
              </div>
            ))}
          </div>

          {projection && (
            <div
              className="pointer-events-none absolute right-[3%] top-[14%] z-30 hidden max-w-[240px] rounded-[24px] border bg-black/34 px-4 py-3 text-right shadow-[0_16px_38px_rgba(0,0,0,0.26)] backdrop-blur-xl lg:block"
              style={{
                borderColor: isCorrectLens ? `${theme.accent}34` : 'rgba(255,79,163,0.34)',
              }}
            >
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">
                {isCorrectLens ? 'canlı projeksiyon' : 'projeksiyon kararsız'}
              </p>
              <p className="mt-1 text-sm font-black text-white/82">
                {isCorrectLens ? `${projection.formula} → ${projectionLabel} = ${projection.value}` : 'Seçilen mercek bu rayı düzgün uzatamıyor.'}
              </p>
            </div>
          )}

          {solved && (
            <div className="pointer-events-none absolute left-1/2 top-[14%] hidden -translate-x-1/2 rounded-full border border-[#00FF88]/22 bg-black/36 px-5 py-2.5 text-center text-sm font-black text-emerald-100/82 shadow-[0_12px_34px_rgba(0,255,136,0.12)] backdrop-blur-xl lg:block">
              {mission.proof}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function relationMetricValues(values: number[], mode: WheelMode) {
  if (mode === 'arithmetic') {
    return values.slice(0, -1).map((value, index) => values[index + 1] - value);
  }

  if (mode === 'geometric') {
    return values.slice(0, -1).map((value, index) => values[index + 1] / value);
  }

  return values.slice(0, -1).map(() => 1);
}

function metricBarHeight(value: number, values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) return 30;

  return 14 + ((value - min) / (max - min)) * 26;
}
