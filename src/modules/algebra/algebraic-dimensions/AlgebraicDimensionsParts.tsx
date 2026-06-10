import { motion } from 'motion/react';
import { ArrowRight, Box, Home, ShieldCheck, Square, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ATOMS, powerLabels } from './algebraicDimensionsData';
import type { DimensionPower } from './algebraicDimensionsData';

export function DimensionToy({ power, xValue }: { power: DimensionPower; xValue: number }) {
  const size = 52 + xValue * 18;

  if (power === 1) {
    return (
      <motion.div
        key="line"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="h-8 rounded-full bg-cyan-300 shadow-[0_0_36px_rgba(103,232,249,0.55)]"
        style={{ width: size * 2 }}
      />
    );
  }

  if (power === 2) {
    return (
      <motion.div
        key="square"
        initial={{ opacity: 0, rotateX: 35, scale: 0.78 }}
        animate={{ opacity: 1, rotateX: 18, rotateY: -18, scale: 1 }}
        className="grid rounded-[28px] border-2 border-violet-200 bg-violet-400/25 p-3 shadow-[0_0_46px_rgba(167,139,250,0.35)]"
        style={{ width: size, height: size, gridTemplateColumns: `repeat(${xValue}, minmax(0,1fr))` }}
      >
        {Array.from({ length: xValue * xValue }).map((_, index) => (
          <div key={index} className="m-1 rounded-lg bg-violet-300/75" />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      key="cube"
      initial={{ opacity: 0, rotateX: 28, rotateY: -35, scale: 0.8 }}
      animate={{ opacity: 1, rotateX: 22, rotateY: -32, scale: 1 }}
      className="relative rounded-[30px] border-2 border-emerald-200 bg-emerald-400/25 p-4 shadow-[0_0_54px_rgba(110,231,183,0.34)]"
      style={{ width: size, height: size }}
    >
      <div className="absolute -right-7 -top-7 h-full w-full rounded-[30px] border-2 border-emerald-200/60 bg-emerald-400/10" />
      <div className="relative z-10 grid h-full w-full" style={{ gridTemplateColumns: `repeat(${xValue}, minmax(0,1fr))` }}>
        {Array.from({ length: xValue * xValue }).map((_, index) => (
          <div key={index} className="m-1 rounded-lg bg-emerald-300/80" />
        ))}
      </div>
    </motion.div>
  );
}

export function ChoiceButton({
  power,
  selected,
  disabled,
  onClick,
  testId,
}: {
  power: DimensionPower;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  testId: string;
}) {
  const icons = {
    1: <Waves className="h-7 w-7" />,
    2: <Square className="h-7 w-7" />,
    3: <Box className="h-7 w-7" />,
  };

  return (
    <button
      data-testid={testId}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-20 rounded-2xl border px-4 py-4 text-left transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 ${
        selected ? 'border-cyan-200 bg-cyan-300 text-slate-950' : 'border-white/15 bg-white/10 text-white hover:bg-white/15'
      }`}
    >
      <div className="flex items-center gap-3">
        {icons[power]}
        <div>
          <p className="text-lg font-black">{powerLabels[power]}</p>
          <p className="text-xs font-bold opacity-75">{power === 1 ? 'uzunluk' : power === 2 ? 'alan' : 'hacim'}</p>
        </div>
      </div>
    </button>
  );
}

export function RuleChip({ active, text }: { active: boolean; text: string }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-black ${
        active ? 'border-cyan-200/45 bg-cyan-300/15 text-cyan-50' : 'border-white/10 bg-slate-950/55 text-white/45'
      }`}
    >
      {text}
    </div>
  );
}

export function CompletionPanel({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl rounded-[36px] border border-cyan-200/30 bg-slate-950 p-8 text-center shadow-[0_30px_100px_rgba(0,229,255,0.22)]"
      >
        <ShieldCheck className="mx-auto h-20 w-20 text-cyan-300" />
        <h2 className="mt-5 text-4xl font-black">Boyut odası tamam</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
          Aynı tabanlı üslerde çarpmada üsleri topladın, bölmede üsleri çıkardın.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ATOMS.map((atomId) => (
            <div key={atomId} className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-4 text-left">
              <p className="font-mono text-sm font-black text-cyan-100">{atomId}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button data-testid="dimension-replay" onClick={onReplay} className="rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white">
            Tekrar oyna
          </button>
          <Link
            data-testid="dimension-home"
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/15"
          >
            Ana merkeze dön <Home className="h-5 w-5" /> <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
