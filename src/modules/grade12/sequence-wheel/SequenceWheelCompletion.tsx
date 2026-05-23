import { Home, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MODULE_ID } from './sequenceWheelModel';

interface SequenceWheelCompletionProps {
  onRestart: () => void;
}

const masteryCards = [
  {
    title: 'Sabit Fark',
    symbols: ['+3', '+5'],
    note: 'Aritmetik dizide komşu terimler arasındaki artış sabit kalır.',
    chains: [
      '4 -> 7 -> 10 -> 13 -> 16 -> 19',
      '3 -> 8 -> 13 -> 18 -> 23 -> 28',
    ],
    accent: '#00E5FF',
  },
  {
    title: 'Sabit Oran',
    symbols: ['x2', 'x3'],
    note: 'Geometrik dizide her terim aynı çarpanla büyür.',
    chains: [
      '2 -> 4 -> 8 -> 16 -> 32 -> 64',
      '1 -> 3 -> 9 -> 27 -> 81 -> 243',
    ],
    accent: '#B388FF',
  },
  {
    title: 'Bir Fonksiyondur',
    symbols: ['n²', 'n³'],
    note: 'Kural fonksiyon gibi görünür; dizi yalnız doğal sayı adımlarında okunur.',
    chains: [
      'n=1..6 | 1, 4, 9, 16, 25, 36',
      'n=1..6 | 1, 8, 27, 64, 125, 216',
    ],
    accent: '#FBBF24',
  },
];

export function SequenceWheelCompletion({ onRestart }: SequenceWheelCompletionProps) {
  return (
    <motion.div
      data-testid={`${MODULE_ID}-completion`}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative w-[min(92vw,1120px)] overflow-hidden rounded-[30px] border border-white/10 bg-[#030711]/86 p-5 shadow-[0_0_80px_rgba(0,229,255,0.16)] backdrop-blur-2xl sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_16%,rgba(0,229,255,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(179,136,255,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.055),transparent_44%)]" />
      <div className="relative grid gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-[24px] border border-amber-300/28 bg-amber-300/12 shadow-[0_0_34px_rgba(251,191,36,0.18)]">
              <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-[#00E5FF]" />
              <Trophy className="h-8 w-8 text-amber-200" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/70">
                sequence mastery
              </p>
              <h2 className="mt-1 text-2xl font-black leading-tight text-white sm:text-4xl">
                6 görev, 3 bakış kilitlendi
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-snug text-white/62 sm:text-base">
                Fark, oran ve fonksiyon/dizi okuması ikişer örnekle aynı ray üzerinde tamamlandı.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-[24px] border border-[#00FF88]/22 bg-[#00FF88]/10 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#00FF88]/16 font-mono text-sm font-black text-emerald-100">XP</span>
            <div>
              <p className="font-mono text-2xl font-black leading-none text-emerald-100">+120</p>
              <p className="mt-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-emerald-100/48">atom kanıtı</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {masteryCards.map((card, index) => (
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
                <div className="flex shrink-0 gap-1.5">
                  {card.symbols.map((symbol) => (
                    <span
                      key={symbol}
                      className="grid h-[46px] w-[46px] place-items-center rounded-[18px] border bg-black/28 font-mono text-lg font-black text-white"
                      style={{ borderColor: `${card.accent}66`, boxShadow: `0 0 24px ${card.accent}24` }}
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {card.chains.map((chain) => (
                  <div
                    key={chain}
                    className="rounded-2xl border border-white/8 bg-black/22 px-3 py-2.5 font-mono text-xs font-black leading-relaxed text-white/72"
                  >
                    {chain}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/24 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold leading-snug text-white/60">
            Vitrin hazır: fark, oran ve fonksiyon/dizi okuması iki örnekle kanıtlandı.
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
