import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import type { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import {
  getHighlightedPowers,
  getTermForPower,
  lensCopy,
  MODULE_ID,
  PolynomialMission,
  slotLabels,
  slotOrder,
  VaultLens,
} from './polynomialVaultModel';

interface PolynomialVaultSceneProps {
  mission: PolynomialMission;
  lens: VaultLens | null;
  status: Grade12StageStatus;
  solved: boolean;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function PolynomialVaultScene({ mission, lens, status, solved, onHome }: PolynomialVaultSceneProps) {
  const selected = lens ? lensCopy[lens] : null;
  const isCorrectLens = lens !== null && lens === mission.expectedLens;
  const hasError = status === 'error';
  const accent = selected?.accent ?? neutralAccent;
  const highlightedPowers = getHighlightedPowers(mission, lens);
  const primaryPower = highlightedPowers[0];
  const scannerLeftByPower: Record<number, string> = { 3: '5.5%', 2: '29.5%', 1: '53.5%', 0: '77.5%' };
  const statusLabel = solved
    ? 'Kasa kilitlendi'
    : lens === null
      ? 'Mercek seç'
      : hasError
        ? 'Yanlış mercek alarmı'
        : 'Tarama önizlemesi';
  const resultLabel = solved ? 'kilit sonucu' : hasError ? 'alarm' : 'tarama önizlemesi';
  const resultText = solved
    ? `${mission.targetValue} kilidi açıldı`
    : hasError
      ? 'Bu mercek kasanın istediği kilit değil'
      : `${selected?.label ?? 'Mercek'} rafları yokluyor`;
  const resultProof = solved
    ? mission.proof
    : hasError && lens !== null
      ? mission.failure[lens]
      : 'Kasayı kilitlemeden önce yalnız önizleme yapıyoruz; karar testte verilecek.';
  const resultBadge = solved ? mission.resultBadge : hasError ? '!' : selected?.short;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div data-testid={`${MODULE_ID}-scene-visual`} className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.028)_0_1px,transparent_1px_104px)] opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_43%_44%,rgba(0,229,255,0.11),transparent_42%),radial-gradient(circle_at_72%_58%,rgba(251,191,36,0.10),transparent_34%)]" />

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
          <div className="pointer-events-none absolute left-1/2 top-[3%] z-30 flex w-[min(86%,880px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/32 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/40">aktif kasa</p>
              <p className="truncate text-sm font-black text-white/84">{mission.title}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: hasError ? '#FF4FA355' : `${accent}44`,
                color: lens === null || !hasError ? accent : '#FF8ABB',
                backgroundColor: lens === null || !hasError ? `${accent}14` : 'rgba(255,79,163,0.12)',
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div className="absolute inset-x-[1%] top-[10%] h-[78%] rounded-[68px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(20,56,76,0.96),rgba(6,13,23,0.74)_54%,rgba(1,5,11,0.90))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />
          <div className="absolute inset-x-[5%] top-[71%] h-[15%] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.52))] shadow-[0_24px_64px_rgba(0,0,0,0.42),inset_0_10px_20px_rgba(255,255,255,0.04)]" />
          <div className="absolute left-[4%] top-[29%] h-[37%] w-[1.8%] rounded-full bg-[linear-gradient(180deg,rgba(0,229,255,0.38),rgba(0,229,255,0.04))] blur-[1px]" />
          <div className="absolute right-[4%] top-[29%] h-[37%] w-[1.8%] rounded-full bg-[linear-gradient(180deg,rgba(251,191,36,0.28),rgba(251,191,36,0.04))] blur-[1px]" />
          <div
            className="absolute inset-x-[4%] top-[31%] h-[27%] rounded-[42px] border border-white/8 bg-[linear-gradient(180deg,rgba(0,0,0,0.58),rgba(0,0,0,0.30))] shadow-[inset_0_16px_34px_rgba(0,0,0,0.72),inset_0_-8px_18px_rgba(255,255,255,0.035)]"
            style={{ transform: 'rotateX(5deg)', transformOrigin: '50% 0%' }}
          />
          <div className="absolute inset-x-[5%] top-[58%] h-[15%] rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.32))]" />

          {lens !== null && primaryPower !== undefined && (
            <motion.div
              className="pointer-events-none absolute top-[29%] z-20 h-[34%] w-[17%] rounded-[38px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] shadow-[0_0_60px_rgba(0,229,255,0.20)] backdrop-blur-[2px]"
              style={{
                left: scannerLeftByPower[primaryPower],
                borderColor: hasError ? '#FF4FA366' : `${accent}77`,
                boxShadow: `0 0 60px ${hasError ? '#FF4FA3' : accent}30, inset 0 0 24px ${hasError ? '#FF4FA3' : accent}14`,
              }}
              initial={false}
              animate={{ opacity: 1, y: solved ? [0, -4, 0] : 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="absolute left-1/2 top-[-34px] h-[46px] w-[46px] -translate-x-1/2 rounded-[20px] border bg-black/60 shadow-[0_0_32px_rgba(0,0,0,0.35)]"
                style={{ borderColor: `${accent}77` }}
              />
              <div
                className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full"
                style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }}
              />
              <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-white/34" />
            </motion.div>
          )}

          <div className="absolute left-1/2 top-[15%] z-20 max-w-[min(86%,700px)] -translate-x-1/2 rounded-[26px] border border-[#00E5FF]/24 bg-[#03111b]/94 px-6 py-3.5 text-center shadow-[0_20px_54px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">polinom etiketi</p>
            <p className="mt-1 whitespace-nowrap text-[clamp(1.35rem,2.15vw,1.9rem)] font-black tracking-tight text-white">{mission.expression}</p>
          </div>

          <div className="absolute inset-x-[3.5%] top-[34%] z-30 grid grid-cols-4 gap-4">
            {slotOrder.map((power, index) => {
              const term = getTermForPower(mission, power);
              const highlighted = highlightedPowers.includes(power);
              const isCorrectHighlight = highlighted && solved && isCorrectLens;
              const isWrongHighlight = highlighted && hasError;
              const glow = isCorrectHighlight ? accent : isWrongHighlight ? '#FF4FA3' : 'rgba(255,255,255,0.2)';

              return (
                <motion.div
                  key={power}
                  className="relative min-h-[235px] rounded-[32px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.045)_62%,rgba(0,0,0,0.26))] p-4 shadow-[0_26px_62px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
                  style={{
                    borderColor: highlighted ? `${glow}88` : 'rgba(255,255,255,0.10)',
                    boxShadow: highlighted
                      ? `0 28px 62px rgba(0,0,0,0.34), 0 0 44px ${glow}42, inset 0 1px 0 rgba(255,255,255,0.12)`
                      : '0 26px 62px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, scale: solved && highlighted ? [1, 1.04, 1] : 1 }}
                  transition={{ delay: index * 0.05, scale: { duration: 0.7 } }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-white/45">raf</span>
                    <span
                      className="rounded-full border px-3 py-1 font-mono text-lg font-black text-white"
                      style={{ borderColor: highlighted ? `${glow}88` : 'rgba(255,255,255,0.12)' }}
                    >
                      {slotLabels[power]}
                    </span>
                  </div>

                  <div className="mt-5 grid min-h-[135px] place-items-center rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(0,0,0,0.50),rgba(0,0,0,0.26))] shadow-[inset_0_10px_24px_rgba(0,0,0,0.54)]">
                    {term ? (
                      <motion.div
                        className="grid h-[112px] w-[112px] place-items-center rounded-[32px] border bg-[linear-gradient(180deg,#10374a,#061521)] text-center shadow-[0_18px_42px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-10px_18px_rgba(0,0,0,0.32)]"
                        style={{
                          borderColor: highlighted ? `${glow}88` : 'rgba(0,229,255,0.34)',
                          boxShadow: highlighted ? `0 18px 42px rgba(0,0,0,0.32), 0 0 34px ${glow}44` : '0 18px 42px rgba(0,0,0,0.32), 0 0 24px rgba(0,229,255,0.12)',
                        }}
                        animate={{ y: highlighted ? [-4, 2, -4] : 0, rotateX: highlighted ? [0, 2, 0] : 0 }}
                        transition={{ duration: 2.2, repeat: highlighted ? Infinity : 0 }}
                      >
                        <span className="text-3xl font-black text-white lg:text-4xl">{term.label}</span>
                      </motion.div>
                    ) : (
                      <div className="grid h-[92px] w-[92px] place-items-center rounded-[28px] border border-dashed border-white/14 bg-white/[0.035] font-mono text-[11px] font-black uppercase tracking-[0.16em] text-white/30">
                        boş
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {lens !== null && (
            <motion.div
              className="absolute left-1/2 top-[78%] z-30 flex w-[min(68%,700px)] -translate-x-1/2 items-center justify-between gap-5 rounded-[30px] border bg-[#03111b]/94 px-5 py-4 shadow-[0_24px_62px_rgba(0,0,0,0.40)] backdrop-blur-2xl"
              style={{ borderColor: hasError ? '#FF4FA355' : `${accent}66` }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: hasError ? '#FF8ABB' : accent }}>
                  {resultLabel}
                </p>
                <p className="mt-1 truncate text-base font-black text-white">
                  {resultText}
                </p>
                <p className="mt-1 hidden text-xs font-bold text-white/44 lg:block">{resultProof}</p>
              </div>
              <div
                className="grid h-[78px] w-[78px] shrink-0 place-items-center rounded-[26px] border bg-black/42 font-mono text-2xl font-black text-white"
                style={{ borderColor: hasError ? '#FF4FA366' : `${accent}77`, boxShadow: `0 0 32px ${hasError ? '#FF4FA3' : accent}33` }}
              >
                {resultBadge}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
