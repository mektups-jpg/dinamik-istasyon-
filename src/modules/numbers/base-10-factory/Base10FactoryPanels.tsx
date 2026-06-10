import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Cpu, Minus, Plus, Sparkles, Zap } from 'lucide-react';
import { AstroBotPanel } from '../../../components/ui/AstroBot';

interface HeaderBadgeProps {
  label: string;
  value: string;
  tone: 'cyan' | 'purple' | 'green' | 'pink';
}

export function HeaderBadge({ label, value, tone }: HeaderBadgeProps) {
  const toneClass = {
    cyan: 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]',
    purple: 'border-[#B388FF]/30 bg-[#B388FF]/10 text-[#B388FF]',
    green: 'border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]',
    pink: 'border-[#FF4FA3]/30 bg-[#FF4FA3]/10 text-[#FF8FC8]',
  }[tone];

  return (
    <div className={`rounded-xl border px-3 py-2 text-right ${toneClass}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

interface FactoryStageProps {
  targetNumber: number;
  targetTens: number;
  targetOnes: number;
  tensCount: number;
  onesCount: number;
  currentTotal: number;
  phase: 1 | 2 | 3 | 4;
  completedTasks: number;
  totalTasks: number;
}

export function FactoryStage({
  targetNumber,
  targetTens,
  targetOnes,
  tensCount,
  onesCount,
  currentTotal,
  phase,
  completedTasks,
  totalTasks,
}: FactoryStageProps) {
  return (
    <motion.section
      key="base10-stage"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative min-h-[392px] overflow-hidden rounded-[2rem] border border-[#00E5FF]/18 bg-[#071323]/88 p-4 shadow-[0_26px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:min-h-[560px] lg:p-5"
      data-testid="base10-stage"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_26%,rgba(0,229,255,0.20),transparent_36%),radial-gradient(circle_at_52%_86%,rgba(179,136,255,0.20),transparent_34%)]" />
      <div className="relative z-10 flex h-full min-h-[360px] flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#00E5FF]">Gelen Ham Enerji</p>
            <div className="mt-2 flex items-end gap-3">
              <motion.div
                key={targetNumber}
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[4.5rem] font-black leading-none text-white drop-shadow-[0_0_28px_rgba(0,229,255,0.35)] sm:text-[5.5rem] lg:text-[7rem]"
              >
                {phase === 1 ? '??' : targetNumber}
              </motion.div>
              <div className="mb-2 grid gap-2">
                <TargetTile label="Onluk" value={phase === 1 ? '-' : targetTens} tone="purple" />
                <TargetTile label="Birlik" value={phase === 1 ? '-' : targetOnes} tone="cyan" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/24 px-3 py-2 text-right">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/45">Tamamlanan</p>
            <p className="mt-1 text-2xl font-black text-[#00FF88]">{completedTasks}/{totalTasks}</p>
          </div>
        </div>

        <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
          <BuildBay label="Mor Onluk Tüpleri" count={tensCount} type="ten" />
          <BuildBay label="Mavi Birlik Küpleri" count={onesCount} type="one" />
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-black/28 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Kurulan Sayı</p>
              <p className="mt-1 text-3xl font-black text-white">{currentTotal}</p>
            </div>
            <div className="h-3 flex-1 rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#B388FF]"
                animate={{ width: `${Math.min(100, Math.max(0, (currentTotal / Math.max(1, targetNumber)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              className="absolute inset-4 z-20 grid place-items-center rounded-[1.7rem] border border-[#00FF88]/40 bg-black/62 backdrop-blur-md"
            >
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-[#00FF88] drop-shadow-[0_0_18px_rgba(0,255,136,0.45)]" />
                <p className="mt-3 text-3xl font-black">Enerji İşlendi!</p>
                <p className="mt-1 text-sm font-bold text-[#A9FFD6]">Yeni hedef bataryası yükleniyor.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function TargetTile({ label, value, tone }: { label: string; value: number | string; tone: 'cyan' | 'purple' }) {
  return (
    <div className="min-w-[76px] rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
      <p className="text-[10px] font-bold text-white/45">{label}</p>
      <p className={`text-2xl font-black ${tone === 'purple' ? 'text-[#B388FF]' : 'text-[#00E5FF]'}`}>{value}</p>
    </div>
  );
}

function BuildBay({ label, count, type }: { label: string; count: number; type: 'ten' | 'one' }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-3">
      <p className="mb-2 text-center font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/45">{label}</p>
      <div className="flex h-[190px] flex-wrap content-end justify-center gap-2 overflow-hidden rounded-2xl bg-[#050B13]/72 p-3 lg:h-[280px]">
        <AnimatePresence>
          {Array.from({ length: count }).map((_, index) => (
            <motion.div
              key={`${type}-${index}`}
              initial={{ scale: 0, y: -16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={type === 'ten'
                ? 'relative h-24 w-7 overflow-hidden rounded-lg bg-gradient-to-t from-[#7C3AED] to-[#C4A1FF] shadow-[0_0_16px_rgba(179,136,255,0.42)] lg:h-32 lg:w-8'
                : 'h-7 w-7 rounded-lg border border-[#00E5FF]/55 bg-gradient-to-tr from-[#00A9C2] to-[#66FCF1] shadow-[0_0_12px_rgba(0,229,255,0.38)] lg:h-8 lg:w-8'
              }
            >
              {type === 'ten' && (
                <div className="absolute inset-0 flex flex-col justify-evenly">
                  {Array.from({ length: 9 }).map((__, lineIndex) => (
                    <div key={lineIndex} className="h-px w-full bg-black/28" />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ControlPanelProps {
  phase: 1 | 2 | 3 | 4;
  statusClass: string;
  statusText: string;
  currentTotal: number;
  isCorrect: boolean;
  targetNumber: number;
  targetTens: number;
  targetOnes: number;
  tensCount: number;
  onesCount: number;
  panelMessage: string;
  onStart: () => void;
  onCheck: () => void;
  onTensMinus: () => void;
  onTensPlus: () => void;
  onOnesMinus: () => void;
  onOnesPlus: () => void;
}

export function ControlPanel({
  phase,
  statusClass,
  statusText,
  currentTotal,
  isCorrect,
  targetNumber,
  targetTens,
  targetOnes,
  tensCount,
  onesCount,
  panelMessage,
  onStart,
  onCheck,
  onTensMinus,
  onTensPlus,
  onOnesMinus,
  onOnesPlus,
}: ControlPanelProps) {
  return (
    <motion.aside
      key="base10-controls"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative min-h-[392px] rounded-[2rem] border border-white/10 bg-[#0B1220]/92 p-4 shadow-[0_26px_70px_rgba(0,0,0,0.36)] backdrop-blur-xl lg:min-h-[560px] lg:p-5"
      data-testid="base10-control-panel"
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/70">Kontrol Paneli</p>
          <h2 className="mt-1 text-xl font-black">Ayrıştırıcı Bölmesi</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45">Yük</p>
          <p className="text-2xl font-black text-white" data-testid="base10-current-total">{currentTotal}</p>
        </div>
      </div>

      <div className={`mt-3 rounded-2xl border px-3 py-2 text-sm font-black ${statusClass}`} data-testid="base10-status-chip">
        {statusText}
      </div>

      <AstroBotPanel message={panelMessage} className="mt-3 hidden lg:block" />

      {phase === 1 ? (
        <IntroPanel onStart={onStart} />
      ) : (
        <>
          <button
            type="button"
            onClick={onCheck}
            data-testid="base10-check"
            className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-black transition ${
              isCorrect
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#33EAFF] text-[#06111d] shadow-[0_0_28px_rgba(0,229,255,0.28)] hover:scale-[1.01]'
                : 'border border-white/10 bg-white/[0.05] text-white/78 hover:border-[#00E5FF]/42 hover:text-white'
            }`}
          >
            <Cpu className="h-5 w-5" /> Doğrula ve Sisteme Gönder
          </button>

          <div className="mt-3 grid gap-3">
            <CounterControl
              label="Onluk"
              hint={`Hedef: ${targetTens}`}
              count={tensCount}
              tone="purple"
              onMinus={onTensMinus}
              onPlus={onTensPlus}
              minusTestId="base10-tens-minus"
              plusTestId="base10-tens-plus"
            />
            <CounterControl
              label="Birlik"
              hint={`Hedef: ${targetOnes}`}
              count={onesCount}
              tone="cyan"
              onMinus={onOnesMinus}
              onPlus={onOnesPlus}
              minusTestId="base10-ones-minus"
              plusTestId="base10-ones-plus"
            />
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-black/24 p-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Matematik Kanıtı</p>
            <p className="mt-2 text-lg font-black">
              {tensCount} onluk + {onesCount} birlik = {currentTotal}
            </p>
            <p className="mt-1 text-xs font-bold text-white/50">Hedef sayı: {targetNumber}</p>
          </div>
        </>
      )}
    </motion.aside>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="mt-3 rounded-3xl border border-[#00E5FF]/18 bg-[#00E5FF]/8 p-3 sm:p-4">
      <button
        type="button"
        onClick={onStart}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#B388FF] px-4 py-3 text-base font-black text-[#06111d] shadow-[0_0_28px_rgba(0,229,255,0.28)] transition hover:scale-[1.01]"
      >
        <Sparkles className="h-5 w-5" /> Makineyi Çalıştır
      </button>
      <div className="mt-3 grid place-items-center rounded-3xl bg-black/26 p-3 sm:mt-4 sm:p-6">
        <div className="grid h-14 w-14 place-items-center rounded-[1.25rem] bg-gradient-to-br from-[#00E5FF] to-[#B388FF] shadow-[0_0_32px_rgba(0,229,255,0.28)] sm:h-20 sm:w-20 sm:rounded-[1.8rem]">
          <Zap className="h-8 w-8 text-[#06111d] sm:h-10 sm:w-10" />
        </div>
      </div>
      <h2 className="mt-3 text-xl font-black leading-tight sm:mt-4 sm:text-2xl">Enerji Ayrıştırıcıya Hoş Geldin!</h2>
      <p className="mt-1 text-xs font-bold leading-relaxed text-white/58 sm:mt-2 sm:text-sm">
        Sayıyı gör, onluk çubukları ve birlik küplerini ekle, sonra sistemi gönder.
      </p>
    </div>
  );
}

interface CounterControlProps {
  label: string;
  hint: string;
  count: number;
  tone: 'cyan' | 'purple';
  onMinus: () => void;
  onPlus: () => void;
  minusTestId: string;
  plusTestId: string;
}

function CounterControl({
  label,
  hint,
  count,
  tone,
  onMinus,
  onPlus,
  minusTestId,
  plusTestId,
}: CounterControlProps) {
  const colorClass = tone === 'purple' ? 'text-[#B388FF]' : 'text-[#00E5FF]';
  const hoverClass = tone === 'purple' ? 'hover:text-[#B388FF] hover:border-[#B388FF]/36' : 'hover:text-[#00E5FF] hover:border-[#00E5FF]/36';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black">{label}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">{hint}</p>
        </div>
        <p className={`text-3xl font-black ${colorClass}`}>{count}</p>
      </div>

      <div className="grid grid-cols-[52px_minmax(0,1fr)_52px] items-center gap-2">
        <button
          type="button"
          onClick={onMinus}
          aria-label={`${label} azalt`}
          data-testid={minusTestId}
          className={`grid min-h-12 place-items-center rounded-2xl border border-white/10 bg-black/24 text-white transition ${hoverClass}`}
        >
          <Minus className="h-5 w-5" />
        </button>
        <div className="h-3 rounded-full bg-white/8">
          <motion.div
            className={`h-full rounded-full ${tone === 'purple' ? 'bg-[#B388FF]' : 'bg-[#00E5FF]'}`}
            animate={{ width: `${Math.min(100, count * 12)}%` }}
          />
        </div>
        <button
          type="button"
          onClick={onPlus}
          aria-label={`${label} artır`}
          data-testid={plusTestId}
          className={`grid min-h-12 place-items-center rounded-2xl border border-white/10 bg-black/24 text-white transition ${hoverClass}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
