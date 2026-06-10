import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, BarChart3, CheckCircle2, Home, Network, RotateCcw, Ruler, Sparkles, Star, Tags } from 'lucide-react';
import { AstroBot, type BotMessage } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { type ChartBar, type NetworkTask } from '../network-optimization-terminal-4/networkOptimization4Tasks';

type Feedback = 'idle' | 'success' | 'error';
type IconKind = 'network' | 'ruler' | 'probability' | 'chart';

export interface StationAtom {
  id: string;
  label: string;
}

export interface StationTestIds {
  stage: string;
  controlPanel: string;
  choice: string;
  feedback: string;
  complete: string;
  restart: string;
}

export interface StationModuleConfig {
  moduleId: string;
  title: string;
  eyebrow: string;
  stageLabel: string;
  completeTitle: string;
  completeText: string;
  botCompleteText: string;
  panelCompleteText: string;
  score: number;
  iconKind: IconKind;
  atoms: readonly StationAtom[];
  testIds: StationTestIds;
  createTasks: () => NetworkTask[];
}

export function Grade4DecisionStationApp({ config }: { config: StationModuleConfig }) {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [tasks, setTasks] = useState<NetworkTask[]>(() => config.createTasks());
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const task = tasks[taskIndex];
  const Icon = iconByKind[config.iconKind];

  useEffect(() => {
    if (!isComplete) return;
    config.atoms.forEach((atom) => unlockAtom(atom.id));
    unlockModule(config.moduleId);
    addScore(config.score);
  }, [addScore, config, isComplete, unlockAtom, unlockModule]);

  const choose = (choice: string) => {
    if (feedback !== 'idle') return;
    setSelected(choice);

    if (choice !== task.answer) {
      setFeedback('error');
      window.setTimeout(() => {
        setSelected(null);
        setFeedback('idle');
      }, 850);
      return;
    }

    setFeedback('success');
    window.setTimeout(() => {
      if (taskIndex === tasks.length - 1) {
        setIsComplete(true);
      } else {
        setTaskIndex((current) => current + 1);
        setSelected(null);
        setFeedback('idle');
      }
    }, 850);
  };

  const restart = () => {
    setTasks(config.createTasks());
    setTaskIndex(0);
    setSelected(null);
    setFeedback('idle');
    setIsComplete(false);
  };

  const botMessage: BotMessage = useMemo(() => {
    if (isComplete) return { id: 900, text: config.botCompleteText, type: 'success' };
    if (feedback === 'success') return { id: taskIndex * 10 + 2, text: task.successText, type: 'success' };
    if (feedback === 'error') return { id: taskIndex * 10 + 3, text: `Bir daha bak. ${task.hint}`, type: 'error' };
    return { id: taskIndex * 10 + 1, text: task.prompt, type: 'info' };
  }, [config.botCompleteText, feedback, isComplete, task, taskIndex]);

  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto bg-[#070B12] pb-32 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.25rem_3.25rem]" />
      <div className="pointer-events-none fixed left-[8%] top-[8%] h-72 w-72 rounded-full bg-[#2EE7FF]/10 blur-[110px]" />
      <div className="pointer-events-none fixed right-[10%] top-[18%] h-64 w-64 rounded-full bg-[#B388FF]/10 blur-[110px]" />
      <div className="pointer-events-none fixed bottom-[4%] left-[38%] h-80 w-80 rounded-full bg-[#34D399]/10 blur-[125px]" />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-label="Ana merkeze dön"
            aria-keyshortcuts="Home"
            className="grid min-h-11 min-w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/72 transition hover:border-[#2EE7FF]/40 hover:text-[#2EE7FF]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#2EE7FF]">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-[#2EE7FF] md:text-2xl">{config.title}</h1>
            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48 md:text-xs">
              {config.eyebrow}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-right">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/42">Görev</p>
          <p className="text-xl font-black text-[#2EE7FF]">{isComplete ? tasks.length : taskIndex + 1}/{tasks.length}</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] w-full max-w-7xl grid-cols-1 gap-5 px-4 py-3 md:px-7 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section
          data-testid={config.testIds.stage}
          className="flex min-h-[570px] items-center justify-center overflow-hidden rounded-[2rem] border border-[#2EE7FF]/18 bg-[radial-gradient(circle_at_50%_16%,rgba(46,231,255,0.12),transparent_34%),linear-gradient(180deg,rgba(8,21,34,0.95),rgba(5,13,24,0.96))] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.30)] md:p-5"
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <CompletionCard key="complete" config={config} onRestart={restart} />
            ) : (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="w-full max-w-5xl"
              >
                <div className="mb-5 text-center">
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: task.accent }}>
                    {config.stageLabel}
                  </p>
                  <h2 className="mt-2 text-3xl font-black md:text-5xl">{task.title}</h2>
                  <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-relaxed text-white/58 md:text-base">{task.prompt}</p>
                </div>
                <StationStage task={task} feedback={feedback} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside
          data-testid={config.testIds.controlPanel}
          className="rounded-3xl border border-white/10 bg-[#0C1524]/88 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.26)] md:p-5"
        >
          {isComplete ? (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-300/30 bg-emerald-300/14 shadow-[0_0_36px_rgba(52,211,153,0.22)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              </div>
              <h2 className="mt-5 text-2xl font-black">{config.completeTitle}</h2>
              <p className="mt-2 max-w-xs text-sm font-bold leading-relaxed text-white/58">{config.panelCompleteText}</p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: task.accent }}>
                Cevap kartları
              </p>
              <h2 className="mt-2 text-2xl font-black">Doğru karta dokun.</h2>
              <div
                data-testid={config.testIds.feedback}
                className={`mt-5 rounded-3xl border p-4 ${
                  feedback === 'success'
                    ? 'border-emerald-300/34 bg-emerald-300/10'
                    : feedback === 'error'
                      ? 'border-rose-300/34 bg-rose-400/10'
                      : 'border-white/10 bg-black/24'
                }`}
              >
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hedef</p>
                <p className="mt-2 text-lg font-black leading-snug text-white">{task.prompt}</p>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3">
                {task.choices.map((choice) => (
                  <ChoiceButton key={choice} testId={config.testIds.choice} choice={choice} accent={task.accent} selected={selected === choice} feedback={feedback} onClick={() => choose(choice)} />
                ))}
              </div>
            </>
          )}
        </aside>
      </main>

      <AstroBot message={botMessage} />
    </div>
  );
}

function StationStage({ task, feedback }: { task: NetworkTask; feedback: Feedback }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/24 p-5">
      <div className="rounded-[2rem] border border-white/10 bg-[#081522]/92 p-5">
        <div className="mb-4 flex items-center justify-center gap-2 text-center">
          <Sparkles className="h-5 w-5" style={{ color: task.accent }} />
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/48">Canlı model</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
          <ModelView task={task} />
          <div className="grid content-center gap-3">
            {task.chips.map((chip) => (
              <div key={chip} className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4 text-center text-base font-black text-white/86">
                {chip}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FeedbackGlow feedback={feedback} accent={task.accent} />
    </div>
  );
}

function ModelView({ task }: { task: NetworkTask }) {
  if (task.kind === 'probability') return <ProbabilityModel capsules={task.capsules ?? []} accent={task.accent} />;
  if (task.kind === 'chart') return <ChartModel bars={task.bars ?? []} accent={task.accent} />;
  return <ConvertModel input={task.input ?? ''} outputUnit={task.outputUnit ?? ''} accent={task.accent} />;
}

function ConvertModel({ input, outputUnit, accent }: { input: string; outputUnit: string; accent: string }) {
  return (
    <div className="grid min-h-[300px] place-items-center rounded-[1.75rem] border border-white/10 bg-black/24 p-5">
      <div className="grid w-full max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-3">
        <ValueCard label="Giriş" value={input} accent={accent} />
        <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} className="h-2 w-16 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 24px ${accent}` }} />
        <ValueCard label="Çıkış" value={`? ${outputUnit}`} accent={accent} muted />
      </div>
    </div>
  );
}

function ValueCard({ label, value, accent, muted = false }: { label: string; value: string; accent: string; muted?: boolean }) {
  return (
    <div className="rounded-[1.5rem] border p-5 text-center" style={{ borderColor: `${accent}55`, background: muted ? 'rgba(255,255,255,0.04)' : `${accent}16` }}>
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-black" style={{ color: muted ? 'rgba(255,255,255,0.72)' : accent }}>{value}</p>
    </div>
  );
}

function ProbabilityModel({ capsules, accent }: { capsules: string[]; accent: string }) {
  return (
    <div className="grid min-h-[300px] place-items-center rounded-[1.75rem] border border-white/10 bg-black/24 p-5">
      <div className="grid w-full max-w-md grid-cols-3 gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        {capsules.map((capsule, index) => (
          <motion.div key={`${capsule}-${index}`} initial={{ scale: 0.82 }} animate={{ scale: 1 }} className="grid aspect-square place-items-center rounded-full border text-sm font-black" style={{ borderColor: `${accent}55`, background: capsule === 'Sarı' ? '#FACC15' : capsule === 'Mavi' ? '#2EE7FF' : `${accent}22`, color: '#07101d' }}>
            {capsule}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChartModel({ bars, accent }: { bars: ChartBar[]; accent: string }) {
  const max = Math.max(...bars.map((bar) => bar.value), 1);
  return (
    <div className="flex min-h-[300px] items-end justify-center gap-8 rounded-[1.75rem] border border-white/10 bg-black/24 p-6">
      {bars.map((bar) => (
        <div key={bar.label} className="flex w-28 flex-col items-center gap-3">
          <motion.div initial={{ height: 20 }} animate={{ height: 42 + (bar.value / max) * 170 }} className="w-full rounded-t-3xl border" style={{ background: `linear-gradient(180deg, ${bar.color}, rgba(255,255,255,0.14))`, borderColor: `${accent}44`, boxShadow: `0 0 24px ${bar.color}44` }} />
          <p className="text-3xl font-black" style={{ color: bar.color }}>{bar.value}</p>
          <p className="rounded-full bg-white/[0.06] px-4 py-2 text-sm font-black text-white/78">{bar.label}</p>
        </div>
      ))}
    </div>
  );
}

function ChoiceButton({
  choice,
  accent,
  selected,
  feedback,
  testId,
  onClick,
}: {
  choice: string;
  accent: string;
  selected: boolean;
  feedback: Feedback;
  testId: string;
  onClick: () => void;
}) {
  const stateClass = selected && feedback === 'success'
    ? 'border-emerald-300/70 bg-emerald-300/18 text-white'
    : selected && feedback === 'error'
      ? 'border-rose-300/70 bg-rose-400/18 text-white'
      : selected
        ? 'border-white/40 bg-white/16 text-white'
        : 'border-white/10 bg-white/[0.06] text-white/86 hover:bg-white/[0.10]';

  return (
    <motion.button type="button" data-testid={testId} whileHover={feedback === 'idle' ? { scale: 1.03, y: -2 } : undefined} whileTap={feedback === 'idle' ? { scale: 0.96 } : undefined} disabled={feedback !== 'idle'} onClick={onClick} className={`min-h-16 rounded-3xl border px-4 py-3 text-center text-lg font-black leading-snug break-words transition ${stateClass} disabled:cursor-not-allowed disabled:opacity-80`} style={selected ? { boxShadow: `0 0 26px ${feedback === 'error' ? '#FB718566' : accent + '55'}` } : undefined}>
      {choice}
    </motion.button>
  );
}

function FeedbackGlow({ feedback, accent }: { feedback: Feedback; accent: string }) {
  if (feedback === 'idle') return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mt-4 w-fit rounded-full border px-5 py-2 text-sm font-black" style={{ borderColor: feedback === 'success' ? '#34D39977' : '#FB718577', color: feedback === 'success' ? '#34D399' : '#FB7185', boxShadow: `0 0 28px ${feedback === 'success' ? '#34D39944' : '#FB718544'}`, background: `${feedback === 'success' ? '#34D399' : accent}18` }}>
      {feedback === 'success' ? 'Doğru!' : 'Tekrar dene'}
    </motion.div>
  );
}

function CompletionCard({ config, onRestart }: { config: StationModuleConfig; onRestart: () => void }) {
  return (
    <motion.section data-testid={config.testIds.complete} initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-emerald-300/24 bg-[#081622]/94 p-5 text-center shadow-[0_24px_90px_rgba(0,0,0,0.38)] md:p-7">
      <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-300/16 shadow-[0_0_38px_rgba(52,211,153,0.28)]">
        <CheckCircle2 className="h-11 w-11 text-emerald-300" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-white">{config.completeTitle}</h2>
      <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62 md:text-base">{config.completeText}</p>
      <div className="mt-5 w-full rounded-3xl border border-white/10 bg-black/24 p-4 text-left">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#2EE7FF]">Kazanılan atomlar</p>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          {config.atoms.map((atom) => (
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
        <motion.button type="button" data-testid={config.testIds.restart} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onRestart} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white/80">
          <RotateCcw className="h-4 w-4" />
          Tekrar Oyna
        </motion.button>
        <Link to="/" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#2EE7FF,#B388FF)] px-4 py-3 text-sm font-black text-[#07101d]">
          <Home className="h-4 w-4" />
          Ana Merkez
        </Link>
      </div>
    </motion.section>
  );
}

const iconByKind = {
  network: Network,
  ruler: Ruler,
  probability: Tags,
  chart: BarChart3,
} satisfies Record<IconKind, React.ComponentType<{ className?: string }>>;
