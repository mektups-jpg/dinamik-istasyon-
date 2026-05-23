import { RotateCcw, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface LimitAsymptoteCompletionProps {
  onRestart: () => void;
}

const proofs = [
  { label: 'Grafik limit', value: '4', note: 'Sol ve sağ yaklaşım aynı çizgide birleşti' },
  { label: 'Asimptot', value: 'y=2', note: 'Sonsuz rota yatay tünele oturdu' },
  { label: 'Yerine yaz', value: '7', note: 'x=3 güvenli giriş olarak işlendi' },
  { label: '0/0 sadeleştir', value: '4', note: 'Ortak çarpan kaldırıldı' },
];

export function LimitAsymptoteCompletion({ onRestart }: LimitAsymptoteCompletionProps) {
  return (
    <motion.div
      className="w-full max-w-4xl rounded-[28px] border border-[#00E5FF]/14 bg-black/46 p-5 shadow-[0_0_72px_rgba(0,229,255,0.16)] backdrop-blur-2xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/70">limit mastery</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Limit okumaları kilitlendi</h2>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-white/62">
            Grafik yaklaşımı, sonsuzdaki asimptot, yerine yazma ve 0/0 sadeleştirme aynı pistte tamamlandı.
          </p>
        </div>
        <div className="rounded-[24px] border border-[#00FF88]/18 bg-[#00FF88]/10 px-5 py-4 text-right">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/62">XP</p>
          <p className="text-3xl font-black text-emerald-100">+160</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {proofs.map((proof) => (
          <div key={proof.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">{proof.label}</p>
            <p className="mt-2 text-2xl font-black text-white">{proof.value}</p>
            <p className="mt-2 text-xs font-bold leading-snug text-white/52">{proof.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/8 bg-black/28 p-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-bold text-white/52">Vitrin hazır: Kaptan canlı görsel onayıyla limit okuma zinciri vitrin paketine alındı.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white/74 transition hover:border-[#00E5FF]/36 hover:text-cyan-100"
          >
            <RotateCcw className="h-4 w-4" />
            Tekrar Oyna
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/12 px-4 py-2 text-sm font-black text-cyan-100 transition hover:border-[#00E5FF]/42"
          >
            <Home className="h-4 w-4" />
            Ana Merkez
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
