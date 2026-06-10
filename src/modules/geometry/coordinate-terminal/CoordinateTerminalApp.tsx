import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, ChevronLeft, Home, LocateFixed, Minus, Plus, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

type Point = { x: number; y: number };
type Mission = {
  title: string;
  prompt: string;
  target: Point;
  reason: string;
};

const MODULE_ID = 'coordinate-terminal';
const ATOMS = ['MAT.8.2.1.1'];
const GRID_VALUES = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
const MISSIONS: Mission[] = [
  {
    title: 'Birinci bölgeye kilitlen',
    prompt: 'Önce x kadar yatay, sonra y kadar dikey ilerle: hedef (3, 2).',
    target: { x: 3, y: 2 },
    reason: 'Apsis x = 3 sağa, ordinat y = 2 yukarı gider.',
  },
  {
    title: 'Sol üst bölgeyi bul',
    prompt: 'Hedef (-4, 1). Negatif x sola, pozitif y yukarı demektir.',
    target: { x: -4, y: 1 },
    reason: 'x negatif olduğu için sola, y pozitif olduğu için yukarı yerleşir.',
  },
  {
    title: 'Sol üstte derinleş',
    prompt: 'Hedef (-3, 4). Negatif x sola, pozitif y yukarı demektir.',
    target: { x: -3, y: 4 },
    reason: 'x negatif olduğu için sola, y pozitif olduğu için nokta sol-üst bölgede kalır.',
  },
];

const makeMessage = (text: string, type: BotMessageType, id: number): BotMessage => ({ text, type, id });
const displayPoint = (point: Point) => `(${point.x}, ${point.y})`;
const pct = (value: number) => ((value + 5) / 10) * 100;
const clamp = (value: number) => Math.max(-5, Math.min(5, value));

export default function CoordinateTerminalApp() {
  const navigate = useNavigate();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState<{ text: string; type: BotMessageType } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [botMessage, setBotMessage] = useState<BotMessage>(
    makeMessage('Hedef koordinatı oku. X yatay, Y dikey hareket ettirir.', 'info', 0),
  );

  const mission = MISSIONS[missionIndex];
  const progress = completed ? 100 : Math.round((missionIndex / MISSIONS.length) * 100);
  const isTarget = point.x === mission.target.x && point.y === mission.target.y;

  const hints = useMemo(() => {
    const dx = mission.target.x - point.x;
    const dy = mission.target.y - point.y;
    return {
      x: dx === 0 ? 'X doğru hizada' : dx > 0 ? 'X sağa gitmeli' : 'X sola gitmeli',
      y: dy === 0 ? 'Y doğru hizada' : dy > 0 ? 'Y yukarı gitmeli' : 'Y aşağı gitmeli',
    };
  }, [mission.target.x, mission.target.y, point.x, point.y]);

  const speak = (text: string, type: BotMessageType = 'info') => {
    setMessageId((id) => {
      const nextId = id + 1;
      setBotMessage(makeMessage(text, type, nextId));
      return nextId;
    });
  };

  const reset = () => {
    setMissionIndex(0);
    setPoint({ x: 0, y: 0 });
    setFeedback(null);
    setCompleted(false);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    speak('Yeni radar turu hazır. Hedef koordinata nokta yerleştir.', 'info');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home') reset();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const move = (axis: keyof Point, delta: number) => {
    if (completed) return;
    setPoint((current) => ({ ...current, [axis]: clamp(current[axis] + delta) }));
    setFeedback(null);
    speak(`${axis.toUpperCase()} ekseni hareket etti. Nokta şimdi ${displayPoint({ ...point, [axis]: clamp(point[axis] + delta) })}.`, 'info');
  };

  const chooseCell = (nextPoint: Point) => {
    if (completed) return;
    setPoint(nextPoint);
    setFeedback(null);
    speak(`${displayPoint(nextPoint)} seçildi. Kilitle düğmesiyle kontrol et.`, 'info');
  };

  const lock = () => {
    if (completed) return;

    if (!isTarget) {
      const text = `Bu nokta ${displayPoint(point)}. Hedef ${displayPoint(mission.target)}. ${hints.x}; ${hints.y}.`;
      setFeedback({ text, type: 'error' });
      speak(text, 'error');
      return;
    }

    unlockAtom('MAT.8.2.1.1');
    const isLast = missionIndex === MISSIONS.length - 1;
    const text = `Doğru hedef: ${displayPoint(point)}. ${mission.reason}`;
    setFeedback({ text, type: 'success' });
    speak(text, 'success');

    window.setTimeout(() => {
      if (isLast) {
        unlockModule(MODULE_ID);
        addScore(140);
        setCompleted(true);
        speak('Koordinat radarı tamam. Noktaları apsis ve ordinatla doğru yerleştirdin.', 'success');
      } else {
        setMissionIndex((index) => index + 1);
        setPoint({ x: 0, y: 0 });
        setFeedback(null);
        speak('Yeni hedef açıldı. Önce x, sonra y yönünü düşün.', 'info');
      }
    }, 850);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#050510] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.045)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] bg-violet-500/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-4">
          <button aria-label="Ana merkeze dön" onClick={() => navigate('/')} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-200">MAT.8.2.1.1</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Koordinat Radar Ağı</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">İlerleme</p>
            <p data-testid="coordinate-progress" className="text-xl font-black text-cyan-100">%{progress}</p>
          </div>
          <button data-testid="coordinate-reset" aria-keyshortcuts="Home" onClick={reset} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/15">
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section data-testid="coordinate-terminal-stage" className="rounded-[32px] border border-cyan-300/20 bg-slate-950/72 p-5 shadow-[0_30px_90px_rgba(0,229,255,0.12)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-cyan-100">Ana oyuncak: dokunulabilir koordinat düzlemi</p>
              <h2 className="mt-1 text-2xl font-black">{mission.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-300">{mission.prompt}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
              <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white/50">Hedef</p>
              <p className="mt-1 text-4xl font-black text-cyan-100">{displayPoint(mission.target)}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px]">
            <div className="relative aspect-square min-h-[340px] overflow-hidden rounded-[28px] border border-cyan-200/15 bg-slate-950/85 p-5">
              <div className="absolute inset-5 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:10%_10%]" />
              <div className="absolute left-1/2 top-5 bottom-5 w-1 -translate-x-1/2 rounded-full bg-cyan-200/30" />
              <div className="absolute left-5 right-5 top-1/2 h-1 -translate-y-1/2 rounded-full bg-violet-200/30" />

              {GRID_VALUES.map((value) => (
                <React.Fragment key={value}>
                  <span className="absolute top-[50%] -translate-x-1/2 translate-y-4 font-mono text-xs text-white/55" style={{ left: `${pct(value)}%` }}>{value}</span>
                  <span className="absolute left-[50%] -translate-y-1/2 translate-x-4 font-mono text-xs text-white/55" style={{ bottom: `${pct(value)}%` }}>{value}</span>
                </React.Fragment>
              ))}

              {GRID_VALUES.map((y) => (
                <div key={y} className="absolute inset-x-5 h-[calc((100%-40px)/11)]" style={{ bottom: `${pct(y)}%` }}>
                  {GRID_VALUES.map((x) => (
                    <button
                      key={`${x},${y}`}
                      aria-label={`${displayPoint({ x, y })} noktasını seç`}
                      onClick={() => chooseCell({ x, y })}
                      className="absolute h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full border border-white/0 transition hover:border-cyan-200 hover:bg-cyan-300/30"
                      style={{ left: `${pct(x)}%` }}
                    />
                  ))}
                </div>
              ))}

              <motion.div className="absolute h-1 rounded-full bg-cyan-300/80 shadow-[0_0_24px_rgba(103,232,249,0.55)]" style={{ left: '50%', width: `${Math.abs(pct(point.x) - 50)}%`, top: '50%', transformOrigin: point.x >= 0 ? 'left' : 'right', x: point.x >= 0 ? 0 : '-100%' }} />
              <motion.div className="absolute w-1 rounded-full bg-violet-300/80 shadow-[0_0_24px_rgba(196,181,253,0.55)]" style={{ left: `${pct(point.x)}%`, bottom: '50%', height: `${Math.abs(pct(point.y) - 50)}%`, transformOrigin: point.y >= 0 ? 'bottom' : 'top', y: point.y >= 0 ? 0 : '100%' }} />

              <motion.div className="absolute -translate-x-1/2 translate-y-1/2 rounded-full border-4 border-slate-950 bg-white p-2 shadow-[0_0_34px_rgba(255,255,255,0.55)]" style={{ left: `${pct(point.x)}%`, bottom: `${pct(point.y)}%` }}>
                <LocateFixed className="h-6 w-6 text-slate-950" />
              </motion.div>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -translate-x-1/2 translate-y-1/2 rounded-3xl border border-cyan-200/45 bg-cyan-300/15 px-4 py-3 text-center shadow-[0_0_30px_rgba(34,211,238,0.28)]" style={{ left: `${pct(mission.target.x)}%`, bottom: `${pct(mission.target.y)}%` }}>
                <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-100">Hedef</p>
              </motion.div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-100">Nokta kontrolü</p>
              <div className="mt-3 rounded-3xl border border-white/10 bg-slate-950/75 p-3 text-center">
                <p className="text-sm font-bold text-white/60">Seçili nokta</p>
                <p data-testid="coordinate-current" className="mt-1 text-4xl font-black text-white">{displayPoint(point)}</p>
              </div>
              <button data-testid="coordinate-lock" onClick={lock} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 transition hover:bg-white">
                <LocateFixed className="h-5 w-5" />
                Hedefe kilitle
              </button>
              <AxisControl label="X yatay" value={point.x} minusId="coordinate-x-minus" plusId="coordinate-x-plus" onMinus={() => move('x', -1)} onPlus={() => move('x', 1)} />
              <AxisControl label="Y dikey" value={point.y} minusId="coordinate-y-minus" plusId="coordinate-y-plus" onMinus={() => move('y', -1)} onPlus={() => move('y', 1)} />
            </div>
          </div>

          {feedback && !completed && (
            <div data-testid="coordinate-feedback" className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold ${feedback.type === 'error' ? 'border-rose-400/40 bg-rose-500/10 text-rose-100' : 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'}`}>
              {feedback.text}
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[28px] border border-cyan-300/30 bg-cyan-950/40 p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Canlı durum</p>
            <h2 className="mt-3 text-2xl font-black">{completed ? 'Radar tamam' : 'AstroBot hazır'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">{botMessage.text}</p>
          </section>
          <section className="rounded-[28px] border border-white/15 bg-white/[0.07] p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Görev zinciri</p>
            <div className="mt-4 space-y-3">
              {MISSIONS.map((item, index) => (
                <div key={item.title} className={`rounded-2xl border px-4 py-3 text-sm font-bold ${index < missionIndex || completed ? 'border-emerald-300/35 bg-emerald-400/10 text-emerald-100' : index === missionIndex ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-50' : 'border-white/10 bg-slate-950/45 text-white/55'}`}>
                  <div className="flex items-center gap-2">
                    {index < missionIndex || completed ? <CheckCircle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    {item.title}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">Hedef {displayPoint(item.target)}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>

      {completed && <CompletionPanel onReplay={reset} />}
      {!completed && <AstroBot message={botMessage} />}
    </div>
  );
}

function AxisControl({ label, value, minusId, plusId, onMinus, onPlus }: { label: string; value: number; minusId: string; plusId: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-black text-white/70">{label}</span>
        <span className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-lg font-black">{value}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button data-testid={minusId} onClick={onMinus} className="flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 transition hover:bg-white/15">
          <Minus className="h-6 w-6" />
        </button>
        <button data-testid={plusId} onClick={onPlus} className="flex min-h-12 items-center justify-center rounded-2xl border border-cyan-200/30 bg-cyan-300/15 transition hover:bg-cyan-300/25">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

function CompletionPanel({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl rounded-[36px] border border-cyan-200/30 bg-slate-950 p-8 text-center shadow-[0_30px_100px_rgba(0,229,255,0.22)]">
        <ShieldCheck className="mx-auto h-20 w-20 text-cyan-300" />
        <h2 className="mt-5 text-4xl font-black">Koordinat radarı tamam</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
          Gerçek konumları x ve y eksenlerinde okuyup koordinat düzlemine yerleştirdin.
        </p>
        <div className="mt-6 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-4 text-left">
          <p className="font-mono text-sm font-black text-cyan-100">MAT.8.2.1.1</p>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button data-testid="coordinate-replay" onClick={onReplay} className="rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white">
            Tekrar oyna
          </button>
          <Link data-testid="coordinate-home" to="/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/15">
            Ana merkeze dön <Home className="h-5 w-5" /> <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
