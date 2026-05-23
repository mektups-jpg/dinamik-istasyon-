import { Home, RotateCcw, Radar, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MODULE_ID } from './circleRadarModel';

interface CircleRadarCompletionProps {
  onRestart: () => void;
}

const proofCards = [
  {
    title: 'Doğru Elemanları',
    symbol: '2 / ip / 90°',
    note: 'Kesen, kiriş ve teğet birbirinden temas sayısı ve merkez kanıtıyla ayrıldı.',
    accent: '#00E5FF',
  },
  {
    title: 'Yay ve Açı',
    symbol: 'yay / 2',
    note: 'Çevre açı yayı yarıya indirdi, merkez açı aynı yayı bire bir okudu.',
    accent: '#FF4FA3',
  },
  {
    title: 'Alan Sinyali',
    symbol: 'πr²',
    note: 'Tüm disk, yarıçap karesinin yüzeye yayılmasıyla doldu.',
    accent: '#A3E635',
  },
];

export function CircleRadarCompletion({ onRestart }: CircleRadarCompletionProps) {
  return (
    <motion.div
      data-testid={`${MODULE_ID}-completion`}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative w-[min(92vw,1120px)] overflow-hidden rounded-[30px] border border-white/10 bg-[#030711]/86 p-5 shadow-[0_0_80px_rgba(0,229,255,0.16)] backdrop-blur-2xl sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_12%,rgba(0,229,255,0.18),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(163,230,53,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.055),transparent_44%)]" />
      <div className="relative grid gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-[24px] border border-[#00E5FF]/28 bg-[#00E5FF]/12 shadow-[0_0_34px_rgba(0,229,255,0.18)]">
              <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-[#A3E635]" />
              <Radar className="h-8 w-8 text-cyan-100" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/70">
                çember radar istasyonu
              </p>
              <h2 className="mt-1 text-2xl font-black leading-tight text-white sm:text-4xl">
                Çember radar istasyonu kilitlendi
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-snug text-white/62 sm:text-base">
                Öğrenci çember elemanlarını, yay-açı ilişkilerini ve daire alanını aynı radar gövdesi üzerinde ayrıştırdı.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-[24px] border border-[#00FF88]/22 bg-[#00FF88]/10 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#00FF88]/16 font-mono text-sm font-black text-emerald-100">
              <Trophy className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-2xl font-black leading-none text-emerald-100">+210</p>
              <p className="mt-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-emerald-100/48">radar mühendisi</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {proofCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.08 }}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.055] p-4"
              style={{ boxShadow: `0 0 34px ${card.accent}16` }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
              />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{card.title}</p>
                  <p className="mt-1 text-[15px] font-bold leading-snug text-white/66">{card.note}</p>
                </div>
                <span
                  className="grid h-[52px] w-[76px] shrink-0 place-items-center rounded-[20px] border bg-black/28 px-2 text-center font-mono text-sm font-black text-white"
                  style={{ borderColor: `${card.accent}66`, boxShadow: `0 0 26px ${card.accent}24` }}
                >
                  {card.symbol}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/24 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold leading-snug text-white/60">
            Radar kanıtı hazır: iki temas, iç kiriş, tek teğet, yay, çevre/merkez açı ve πr² aynı çemberde okunuyor.
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
