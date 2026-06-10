import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Home, RotateCcw, Star } from 'lucide-react';
import { AstroBot, type BotMessage } from '../../../components/ui/AstroBot';

interface Grade1MissionFrameProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  progress: number;
  total: number;
  botMessage: BotMessage;
  children: React.ReactNode;
}

interface Grade1CompletionProps {
  title: string;
  message: string;
  atoms: Array<{ id: string; label: string }>;
  accent: string;
  onRestart: () => void;
}

interface Grade1ChoiceButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  accent: string;
}

export function Grade1MissionFrame({
  title,
  subtitle,
  icon,
  accent,
  progress,
  total,
  botMessage,
  children,
}: Grade1MissionFrameProps) {
  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto bg-[#070B12] pb-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      <div className="pointer-events-none fixed left-[8%] top-[8%] h-72 w-72 rounded-full bg-[#00E5FF]/10 blur-[110px]" />
      <div className="pointer-events-none fixed bottom-[4%] right-[12%] h-80 w-80 rounded-full bg-[#B388FF]/10 blur-[120px]" />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-keyshortcuts="Home"
            className="grid min-h-11 min-w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/72 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]" style={{ color: accent }}>
            {icon}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight md:text-2xl" style={{ color: accent }}>
              {title}
            </h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-right">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">Görev</p>
          <p className="text-xl font-black" style={{ color: accent }}>
            {progress}/{total}
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] w-full max-w-7xl grid-cols-1 gap-5 px-4 py-3 md:px-7 lg:grid-cols-[minmax(0,1fr)_380px]">
        {children}
      </main>

      <AstroBot message={botMessage} />
    </div>
  );
}

export function Grade1Panel({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5">
      {children}
    </aside>
  );
}

export function Grade1ChoiceButton({ children, onClick, disabled, selected, accent }: Grade1ChoiceButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.03, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-16 rounded-3xl border px-4 py-3 text-lg font-black transition ${
        selected
          ? 'border-white/40 bg-white/16 text-white'
          : 'border-white/10 bg-white/[0.06] text-white/86 hover:bg-white/[0.10]'
      } disabled:cursor-not-allowed disabled:opacity-60`}
      style={selected ? { boxShadow: `0 0 26px ${accent}44` } : undefined}
    >
      {children}
    </motion.button>
  );
}

export function Grade1Completion({ title, message, atoms, accent, onRestart }: Grade1CompletionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7"
    >
      <motion.div
        initial={{ rotate: -90, scale: 0.4 }}
        animate={{ rotate: 0, scale: 1 }}
        className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16"
        style={{ boxShadow: `0 0 38px ${accent}55` }}
      >
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </motion.div>
      <h2 className="mt-4 text-3xl font-black text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">{message}</p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: accent }}>
          Kazanılan atomlar
        </p>
        <div className="mt-3 space-y-2">
          {atoms.map((atom) => (
            <div key={atom.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3">
              <Star className="h-5 w-5 shrink-0 fill-yellow-300 text-yellow-300" />
              <div>
                <p className="text-sm font-black text-white">{atom.id}</p>
                <p className="text-xs font-bold text-white/48">{atom.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80"
        >
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link
          to="/"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-[#07101d]"
          style={{ background: `linear-gradient(90deg, ${accent}, #B388FF)` }}
        >
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}
