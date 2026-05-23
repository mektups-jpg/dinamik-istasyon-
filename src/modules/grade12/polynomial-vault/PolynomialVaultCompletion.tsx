import { Home, RotateCcw, ScanSearch, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MODULE_ID } from './polynomialVaultModel';

interface PolynomialVaultCompletionProps {
  onRestart: () => void;
}

const mastery = [
  { title: 'Doğrusal', value: '1°', detail: '5x + 2 -> en yüksek raf x' },
  { title: 'Karesel', value: '2°', detail: '2x² - 3x + 1 -> x² rafı' },
  { title: 'Derece', value: '3°', detail: '-4x³ + 3x - 2 -> x³' },
  { title: 'Başkatsayı', value: '-4', detail: 'Baş terim -4x³' },
  { title: 'Sabit', value: '-5', detail: 'x⁰ rafı değişkensiz terim' },
];

export function PolynomialVaultCompletion({ onRestart }: PolynomialVaultCompletionProps) {
  return (
    <motion.div
      data-testid={`${MODULE_ID}-completion`}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative min-h-[330px] w-[92vw] max-w-[1180px] overflow-hidden rounded-[30px] border border-white/10 bg-[#030711]/88 p-5 shadow-[0_0_82px_rgba(0,229,255,0.17)] backdrop-blur-2xl sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_14%,rgba(0,229,255,0.18),transparent_32%),radial-gradient(circle_at_80%_22%,rgba(251,191,36,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.055),transparent_45%)]" />
      <div className="relative grid gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-[24px] border border-[#00E5FF]/28 bg-[#00E5FF]/12 shadow-[0_0_34px_rgba(0,229,255,0.18)]">
              <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-amber-200" />
              <ScanSearch className="h-8 w-8 text-cyan-100" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/70">polynomial mastery</p>
              <h2 className="mt-1 text-2xl font-black leading-tight text-white sm:text-4xl">Polinom kasası açıldı</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-snug text-white/62 sm:text-base">
                Beş raf okuması tamamlandı: doğrusal/karesel kimlik, derece, başkatsayı ve sabit terim.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-[24px] border border-[#00FF88]/22 bg-[#00FF88]/10 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#00FF88]/16 font-mono text-sm font-black text-emerald-100">XP</span>
            <div>
              <p className="font-mono text-2xl font-black leading-none text-emerald-100">+140</p>
              <p className="mt-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-emerald-100/48">atom kanıtı</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {mastery.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06 }}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.055] p-4"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent" />
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{item.title}</p>
              <p className="mt-3 font-mono text-3xl font-black leading-none text-white">{item.value}</p>
              <p className="mt-3 text-xs font-bold leading-snug text-white/58">{item.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/24 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold leading-snug text-white/60">
            Showcase Ready: Kaptan canlı görsel onayıyla vitrin paketi için hazır.
          </p>
          <div className="flex shrink-0 gap-2">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRestart}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-4 text-sm font-black text-white/76 transition hover:border-[#00E5FF]/44 hover:text-cyan-100"
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
