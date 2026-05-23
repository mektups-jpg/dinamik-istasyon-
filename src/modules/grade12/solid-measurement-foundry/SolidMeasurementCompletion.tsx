import { Box, RotateCcw, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface SolidMeasurementCompletionProps {
  onRestart: () => void;
}

const proofCards = [
  {
    title: 'Hacim',
    value: 'iç dolum',
    note: 'Prizma ve silindir taban alanını yükseklik boyunca taşır; piramit ve koni tepeye daralır.',
  },
  {
    title: 'Yüzey Alanı',
    value: 'dış kaplama',
    note: 'Kaplama iç boşluğu değil, cismin dış kabuğundaki tüm panelleri sayar.',
  },
  {
    title: 'Küre',
    value: 'r³ / r²',
    note: 'İç hacim üç boyuta yayılır; dış kabuk iki boyutlu yüzey olarak kalır.',
  },
];

export function SolidMeasurementCompletion({ onRestart }: SolidMeasurementCompletionProps) {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#00E5FF]/18 bg-black/44 p-6 shadow-[0_0_80px_rgba(0,229,255,0.16)] backdrop-blur-2xl">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.055] p-5">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl border border-[#00FF88]/28 bg-[#00FF88]/12 text-emerald-100">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#00E5FF]/68">
              katı cisim ölçüm dökümhanesi
            </p>
            <h2 className="mt-3 text-4xl font-black leading-none text-white">Ölçüm tesisi kilitlendi.</h2>
            <p className="mt-4 text-base font-semibold leading-relaxed text-white/66">
              İç hacim dolumu ile dış yüzey kaplamasını ayırdın; prizma, silindir, piramit, koni ve küre aynı 3D sahnede doğrulandı.
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRestart}
            className="mt-6 flex min-h-[52px] items-center justify-center gap-2 rounded-[22px] border border-white/12 bg-white/[0.07] px-5 py-3 text-sm font-black text-white transition hover:border-[#00E5FF]/38 hover:text-cyan-100"
          >
            <RotateCcw className="h-4 w-4" />
            Yeniden Kalibre Et
          </motion.button>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[28px] border border-[#00E5FF]/14 bg-[#00E5FF]/8 p-5">
            <div className="mb-3 flex items-center gap-2 text-cyan-100">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-black uppercase tracking-[0.16em]">+300 atom puanı</span>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-white/68">
              Bu tur `Review Needed` olarak kaydedilir. Kaptan canlı göz kontrolü vermeden `Showcase Ready` etiketi açılmaz.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {proofCards.map((card) => (
              <div key={card.title} className="rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-black/24 text-white/82">
                  {card.title === 'Hacim' ? <Box className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                </div>
                <p className="text-sm font-black text-white">{card.title}</p>
                <p className="mt-1 font-mono text-xs font-black text-[#00E5FF]">{card.value}</p>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-white/54">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
