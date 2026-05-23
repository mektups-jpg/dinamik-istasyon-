import { BarChart3, Database, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DataVerdictCompletionProps {
  onRestart: () => void;
}

const wins = [
  { icon: Database, title: 'Kaynak izi', text: '3. parti kurum verisi yerel söylentiden ayrıldı.' },
  { icon: BarChart3, title: 'Filtre kanıtı', text: 'Aynı birim, medyan, çeyrek bant ve zaman yönü sahnede test edildi.' },
  { icon: ShieldCheck, title: 'Güvenli yargı', text: 'Veriden sonuç çıkarıldı; aşırı sebep-sonuç iddiası yapılmadı.' },
];

export function DataVerdictCompletion({ onRestart }: DataVerdictCompletionProps) {
  return (
    <div className="relative w-full max-w-5xl overflow-hidden rounded-[42px] border border-[#00E5FF]/18 bg-[linear-gradient(180deg,rgba(5,24,39,0.96),rgba(2,8,16,0.96))] p-7 text-white shadow-[0_40px_120px_rgba(0,0,0,0.52)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,229,255,0.16),transparent_42%),radial-gradient(circle_at_74%_72%,rgba(0,255,136,0.10),transparent_34%)]" />
      <div className="relative grid gap-7 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00FF88]/24 bg-[#00FF88]/10 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
            <Sparkles className="h-4 w-4" />
            Review Needed
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white lg:text-5xl">Büyük veri yargısı kilitlendi</h2>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-white/68">
            Hazır kurumsal veri seti temizlendi, doğru istatistik filtresinden geçirildi ve güvenli sonuç cümlesine dönüştü.
            Kaptan canlı göz onayı vermeden bu modül Showcase Ready sayılmayacak.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {wins.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="rounded-[26px] border border-white/10 bg-white/[0.055] p-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Icon className="h-6 w-6 text-[#00E5FF]" />
                  <h3 className="mt-3 text-base font-black text-white">{item.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-snug text-white/56">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-[34px] border border-[#00E5FF]/16 bg-black/32 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
          <div className="rounded-[28px] border border-[#00FF88]/22 bg-[#00FF88]/10 p-5 text-center">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100">kazanım</p>
            <p className="mt-3 text-5xl font-black text-white">+180</p>
            <p className="mt-2 text-sm font-bold text-white/56">XP ve MAT.12.5.1.1 kanıtı</p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[22px] border border-[#00E5FF]/28 bg-[#00E5FF]/12 px-4 text-sm font-black text-cyan-100 transition hover:bg-[#00E5FF]/16"
          >
            <RotateCcw className="h-4 w-4" />
            Yeniden denetle
          </motion.button>
        </div>
      </div>
    </div>
  );
}
