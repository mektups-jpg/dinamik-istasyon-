import { ReactNode } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';
import { AstroBotPanel } from '../../../components/ui/AstroBot';

export type Grade12StageStatus = 'idle' | 'info' | 'success' | 'error';

interface Grade12FullStageLabProps {
  title: string;
  subtitle: string;
  statusLabel?: string;
  eyebrow?: string;
  panelTitle?: string;
  astroBotMessage?: string;
  moduleId: string;
  atomIds: string[];
  stage: ReactNode;
  dock: ReactNode;
  feedback: string;
  status?: Grade12StageStatus;
  successFeedbackLabel?: string;
  completed: boolean;
  completedTitle?: string;
  completedMessage?: string;
  scoreEarned?: number;
  completion?: ReactNode;
  onReset: () => void;
  onRestart: () => void;
}

const statusClass: Record<Grade12StageStatus, string> = {
  idle: 'border-white/12 bg-white/[0.055] text-white/74',
  info: 'border-[#00E5FF]/24 bg-[#00E5FF]/10 text-cyan-100',
  success: 'border-[#00FF88]/28 bg-[#00FF88]/10 text-emerald-100',
  error: 'border-[#FF4FA3]/30 bg-[#FF4FA3]/10 text-pink-100',
};

export function Grade12FullStageLab({
  title,
  subtitle,
  statusLabel = 'Skeleton',
  eyebrow = '12. sınıf draft',
  panelTitle = 'Dizi sürüşü',
  astroBotMessage = 'Seç, sahnede anında gör.',
  moduleId,
  atomIds,
  stage,
  dock,
  feedback,
  status = 'idle',
  successFeedbackLabel = 'Kanıt kilitlendi; ayrıntı sahne kartında.',
  completed,
  completedTitle = '12. SINIF TASLAK TAMAMLANDI',
  completedMessage = 'Bu ekran yalnız şablon doğrulaması içindir; gerçek atom tamamlama sonraki turda açılacak.',
  scoreEarned = 0,
  completion,
  onReset,
  onRestart,
}: Grade12FullStageLabProps) {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex h-screen min-h-screen w-screen flex-col overflow-hidden bg-[#030711] text-white selection:bg-[#00E5FF] selection:text-[#030711]"
      style={{ height: '100dvh', minHeight: '100dvh' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(0,229,255,0.13),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(179,136,255,0.11),transparent_34%),linear-gradient(180deg,#071527_0%,#030711_62%,#02040a_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent" />

      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/8 bg-black/18 px-3 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <motion.button
            type="button"
            aria-label="Ana merkeze dön"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('/')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/76 transition hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
          <div className="min-w-0">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.26em] text-[#00E5FF]/64">{eyebrow}</p>
            <h1 className="truncate text-base font-black tracking-tight text-white sm:text-lg">{title}</h1>
          </div>
        </div>

        <div className="hidden min-w-0 items-center gap-2 md:flex">
          <span className="rounded-full border border-[#00E5FF]/18 bg-[#00E5FF]/8 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#9ff5ff]">
            {subtitle}
          </span>
          <span className="rounded-full border border-amber-300/22 bg-amber-300/10 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-amber-100">
            {statusLabel}
          </span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {completed ? (
          <section className="grid min-h-0 flex-1 place-items-center overflow-y-auto px-3 py-4 sm:px-4">
            {completion ?? (
            <div className="w-full max-w-4xl rounded-[28px] border border-white/10 bg-black/42 p-6 shadow-[0_0_70px_rgba(0,0,0,0.44)] backdrop-blur-2xl">
              <ModuleCompletedScreen
                title={completedTitle}
                message={completedMessage}
                scoreEarned={scoreEarned}
                onRestart={onRestart}
              />
            </div>
            )}
          </section>
        ) : (
          <>
            <section className="relative min-h-0 flex-1 overflow-hidden">
              <div
                data-testid={`${moduleId}-scene`}
                className="relative h-full w-full overflow-hidden bg-black/12"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_24%,rgba(0,229,255,0.13),transparent_40%),radial-gradient(circle_at_18%_82%,rgba(0,255,136,0.08),transparent_32%)]" />
                <div className="relative h-full w-full">{stage}</div>
              </div>
            </section>

            <aside className="relative z-20 flex h-[360px] shrink-0 flex-col overflow-hidden border-t border-[#00E5FF]/18 bg-[#030711]/92 p-3 shadow-[0_-18px_60px_rgba(0,229,255,0.1)] backdrop-blur-2xl lg:h-auto lg:w-[380px] lg:border-l lg:border-t-0 lg:p-4 lg:shadow-[-18px_0_60px_rgba(0,229,255,0.12)] xl:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.13),transparent_38%)]" />
              <div className="relative flex min-h-0 flex-1 flex-col gap-2.5 lg:gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/68">kontrol paneli</p>
                    <h2 className="mt-1 text-xl font-black text-white">{panelTitle}</h2>
                  </div>
                  <motion.button
                    type="button"
                    data-testid={`${moduleId}-reset`}
                    aria-label="Şablonu sıfırla"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/74 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </motion.button>
                </div>

                <AstroBotPanel message={astroBotMessage} className="hidden shrink-0 lg:block" />

                <div className="min-h-0 flex-1 overflow-hidden">{dock}</div>

                <div className={`shrink-0 rounded-[22px] border px-5 py-3.5 text-sm font-bold leading-snug lg:text-[15px] ${statusClass[status]}`}>
                  <span data-testid={`${moduleId}-feedback`} className="sr-only">{feedback}</span>
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">canlı geri bildirim</p>
                  <p aria-hidden="true" className="mt-1">
                    {status === 'error'
                      ? 'Uyarı AstroBot’ta; sahnedeki alarmı izle.'
                      : status === 'success'
                        ? successFeedbackLabel
                        : 'Oyuncağı oynat, not AstroBot’ta güncellensin.'}
                  </p>
                </div>

                <div className="hidden shrink-0 gap-2 rounded-[22px] border border-white/8 bg-white/[0.045] p-3">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/38">atom rezervi</p>
                  <div className="flex flex-wrap gap-1.5">
                    {atomIds.map((atomId) => (
                      <span key={atomId} className="rounded-full border border-white/10 bg-black/24 px-2 py-1 font-mono text-[9px] font-black text-white/48">
                        {atomId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

          </>
        )}
      </main>
    </div>
  );
}
