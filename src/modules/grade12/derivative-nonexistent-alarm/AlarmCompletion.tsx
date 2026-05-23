import { AlertTriangle, Home, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MODULE_ID } from './derivativeNonexistentModel';

interface AlarmCompletionProps {
  onRestart: () => void;
}

export function AlarmCompletion({ onRestart }: AlarmCompletionProps) {
  return (
    <motion.div
      data-testid={`${MODULE_ID}-completion`}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative w-[min(88vw,920px)] overflow-hidden rounded-[30px] border border-[#00E5FF]/24 bg-[#04111f] p-5 text-white shadow-[0_0_96px_rgba(0,229,255,0.22),0_34px_80px_rgba(0,0,0,0.54)] ring-1 ring-white/8 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(251,191,36,0.22),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(255,79,163,0.20),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.10),transparent_44%)]" />
      <div className="relative grid gap-5">
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-[24px] border border-[#00E5FF]/44 bg-[#00E5FF]/16 shadow-[0_0_42px_rgba(0,229,255,0.28)]">
            <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-[#00FF88]" />
            <AlertTriangle className="h-8 w-8 text-cyan-100" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#9FF5FF]">türev alarm ustalığı</p>
            <h2 className="mt-1 text-3xl font-black leading-tight text-white">Türev yok alarmı tamamlandı</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-snug text-white/82">
              Öğrenci sivri uç ile kopuk grafiği aynı kalabalık pistte değil, iki ayrı alarm davranışı olarak ayırdı.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ProofCard title="Sivri Uç" symbol="V" note="Soldan ve sağdan eğim tek teğette birleşmedi." accent="#FBBF24" />
          <ProofCard title="Kopuk Grafik" symbol="!" note="Fonksiyon aynı noktada kesintisiz davranmadı." accent="#FF4FA3" />
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-white/14 bg-black/34 p-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-bold leading-snug text-white/82">
            Kesen-teğet modülü temiz kaldı; türev-yok durumları artık kendi alarm istasyonunda.
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRestart}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/16 bg-white/[0.08] px-4 text-sm font-black text-white/88 transition hover:border-[#00E5FF]/44 hover:text-cyan-100"
            >
              <RotateCcw className="h-4 w-4" />
              Tekrar Oyna
            </motion.button>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#00E5FF]/28 bg-[#00E5FF]/14 px-4 text-sm font-black text-cyan-100 transition hover:border-[#00E5FF]/54"
            >
              <Home className="h-4 w-4" />
              Ana Merkez
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProofCard({ title, symbol, note, accent }: { title: string; symbol: string; note: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/14 bg-white/[0.08] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/68">{title}</p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-white/86">{note}</p>
        </div>
        <span
          className="grid h-[52px] w-[68px] shrink-0 place-items-center rounded-[20px] border bg-black/28 font-mono text-xl font-black text-white"
          style={{ borderColor: `${accent}66`, boxShadow: `0 0 26px ${accent}24` }}
        >
          {symbol}
        </span>
      </div>
    </div>
  );
}
