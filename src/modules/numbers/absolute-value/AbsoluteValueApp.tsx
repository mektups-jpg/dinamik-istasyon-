import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, ChevronLeft, Home, Minus, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

type Mission = {
  title: string;
  prompt: string;
  target: number;
  answer: number;
  atomIds: string[];
  reason: string;
};

const MODULE_ID = 'absolute-value';
const ATOMS = ['MAT.7.1.1.1', 'MAT.7.1.3.1'];
const PADS = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
const PAD_TEST_IDS: Record<number, string> = {
  [-8]: 'absolute-pad-neg8',
  [-6]: 'absolute-pad-neg6',
  [-4]: 'absolute-pad-neg4',
  [-2]: 'absolute-pad-neg2',
  0: 'absolute-pad-pos0',
  2: 'absolute-pad-pos2',
  4: 'absolute-pad-pos4',
  6: 'absolute-pad-pos6',
  8: 'absolute-pad-pos8',
};

const MISSIONS: Mission[] = [
  {
    title: 'Pozitif hedefi aynala',
    prompt: '+6 hedefini vurmak için ışığı aynanın hangi tarafından başlatmalısın?',
    target: 6,
    answer: -6,
    atomIds: ['MAT.7.1.1.1'],
    reason: '+6 sağ tarafta. Aynadan aynı uzaklıktaki karşı nokta -6 olur.',
  },
  {
    title: 'Negatif hedefi aynala',
    prompt: '-4 hedefi için karşı yöndeki aynı uzaklığı seç.',
    target: -4,
    answer: 4,
    atomIds: ['MAT.7.1.1.1'],
    reason: '-4 sol tarafta. Aynı uzaklık sağ tarafta +4 ile eşleşir.',
  },
  {
    title: 'Sıfıra yakın olanı yakala',
    prompt: '-2 hedefi, -8 noktasına göre sıfıra daha yakındır. Aynadaki eş uzaklığı seç.',
    target: -2,
    answer: 2,
    atomIds: ['MAT.7.1.3.1'],
    reason: '-2 sıfıra 2 birim uzakta olduğu için aynadaki eş uzaklık +2 olur.',
  },
];

const makeMessage = (text: string, type: BotMessageType, id: number): BotMessage => ({ text, type, id });
const toTestId = (value: number) => PAD_TEST_IDS[value];
const pct = (value: number) => ((value + 8) / 16) * 100;
const display = (value: number) => (value > 0 ? `+${value}` : `${value}`);

export default function AbsoluteValueApp() {
  const navigate = useNavigate();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [fired, setFired] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: BotMessageType } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [botMessage, setBotMessage] = useState<BotMessage>(
    makeMessage('Hedefe bak, sıfır aynasının karşı tarafındaki eş uzaklığı seç.', 'info', 0),
  );

  const mission = MISSIONS[missionIndex];
  const reflected = selected === null ? null : -selected;
  const progress = completed ? 100 : Math.round((missionIndex / MISSIONS.length) * 100);
  const distance = selected === null ? null : Math.abs(selected);

  const beamStyle = useMemo(() => {
    if (selected === null || reflected === null) {
      return null;
    }

    const start = pct(selected);
    const zero = pct(0);
    const end = pct(reflected);
    return {
      first: { left: `${Math.min(start, zero)}%`, width: `${Math.abs(start - zero)}%` },
      second: { left: `${Math.min(zero, end)}%`, width: `${Math.abs(end - zero)}%` },
    };
  }, [reflected, selected]);

  const speak = (text: string, type: BotMessageType = 'info') => {
    setMessageId((id) => {
      const nextId = id + 1;
      setBotMessage(makeMessage(text, type, nextId));
      return nextId;
    });
  };

  const reset = () => {
    setMissionIndex(0);
    setSelected(null);
    setFired(false);
    setFeedback(null);
    setCompleted(false);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    speak('Yeni tur hazır. Hedefin aynadaki eş uzaklığını seç.', 'info');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home') reset();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const choosePad = (value: number) => {
    if (completed) return;
    setSelected(value);
    setFired(false);
    setFeedback(null);
    speak(`${display(value)} seçildi. Şimdi ışığı sıfır aynasından yansıt.`, 'info');
  };

  const fire = () => {
    if (completed) return;
    if (selected === null || reflected === null) {
      const text = 'Önce sayı doğrusundan bir başlangıç noktası seçmelisin.';
      setFeedback({ text, type: 'error' });
      speak(text, 'error');
      return;
    }

    setFired(true);

    if (selected !== mission.answer) {
      const text = `${display(selected)} seçilince ışık ${display(reflected)} noktasına gider. Hedef ${display(mission.target)} olduğu için ${display(mission.answer)} seçilmeliydi.`;
      setFeedback({ text, type: 'error' });
      speak(text, 'error');
      return;
    }

    mission.atomIds.forEach((atomId) => unlockAtom(atomId));
    const isLast = missionIndex === MISSIONS.length - 1;
    const text = `Doğru: ${display(selected)} ile ${display(mission.target)} sıfıra ${Math.abs(mission.target)} birim uzakta. ${mission.reason}`;
    setFeedback({ text, type: 'success' });
    speak(text, 'success');

    window.setTimeout(() => {
      if (isLast) {
        ATOMS.forEach((atomId) => unlockAtom(atomId));
        unlockModule(MODULE_ID);
        addScore(140);
        setCompleted(true);
        speak('Sıfır aynası tamamlandı. Yönlü sayıları ve sıfıra uzaklığı doğru yorumladın.', 'success');
      } else {
        setMissionIndex((index) => index + 1);
        setSelected(null);
        setFired(false);
        setFeedback(null);
        speak('Yeni hedef açıldı. Karşı yöndeki aynı uzaklığı seç.', 'info');
      }
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#050510] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.045)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] bg-violet-500/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-4">
          <button
            aria-label="Ana merkeze dön"
            onClick={() => navigate('/')}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-200">MAT.7.1.1.1 · MAT.7.1.3.1</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Sıfır Aynası</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">İlerleme</p>
            <p data-testid="absolute-progress" className="text-xl font-black text-cyan-100">%{progress}</p>
          </div>
          <button
            data-testid="absolute-reset"
            aria-keyshortcuts="Home"
            onClick={reset}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/15"
          >
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section
          data-testid="absolute-value-stage"
          className="rounded-[32px] border border-cyan-300/20 bg-slate-950/72 p-5 shadow-[0_30px_90px_rgba(0,229,255,0.12)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-cyan-100">Ana oyuncak: sıfır aynalı sayı doğrusu</p>
              <h2 className="mt-1 text-2xl font-black">{mission.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-300">{mission.prompt}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
              <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white/50">Hedef</p>
              <p className="mt-1 text-4xl font-black text-cyan-100">{display(mission.target)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[30px] border border-white/10 bg-[#07111f] p-5">
            <div className="relative min-h-[330px] rounded-[28px] border border-cyan-200/15 bg-slate-950/85 p-6">
              <div className="absolute inset-x-8 top-1/2 h-1 rounded-full bg-white/15" />
              <div className="absolute left-1/2 top-[28%] h-[48%] w-1 -translate-x-1/2 rounded-full bg-cyan-200/35 shadow-[0_0_24px_rgba(103,232,249,0.4)]" />

              {PADS.map((value) => (
                <div key={value} className="absolute top-[52%] -translate-x-1/2 text-center" style={{ left: `${pct(value)}%` }}>
                  <div className={`mx-auto h-5 w-1 rounded-full ${value === 0 ? 'bg-cyan-200' : 'bg-white/25'}`} />
                  <p className={`mt-2 font-mono text-xs font-black ${value === 0 ? 'text-cyan-100' : 'text-white/55'}`}>{display(value)}</p>
                </div>
              ))}

              <div className="absolute top-[18%] -translate-x-1/2" style={{ left: `${pct(mission.target)}%` }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-3xl border border-cyan-200/45 bg-cyan-300/15 px-5 py-4 text-center shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                >
                  <Sparkles className="mx-auto h-7 w-7 text-cyan-100" />
                  <p className="mt-1 font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-100">Hedef</p>
                </motion.div>
              </div>

              {selected === null ? (
                <div className="absolute left-1/2 top-[66%] -translate-x-1/2 rounded-3xl border border-dashed border-white/20 bg-white/5 px-5 py-4 text-center text-white/65">
                  <p className="font-mono text-xs font-black uppercase tracking-[0.2em]">Başlangıç</p>
                  <p className="mt-1 text-sm font-bold">Bir nokta seç</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="absolute top-[66%] -translate-x-1/2"
                  style={{ left: `${pct(selected)}%` }}
                >
                  <div className={`rounded-3xl border px-5 py-4 text-center shadow-2xl ${fired ? 'border-fuchsia-200 bg-fuchsia-400/20' : 'border-violet-200/50 bg-violet-400/15'}`}>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-white/65">Başlangıç</p>
                    <p className="text-3xl font-black">{display(selected)}</p>
                  </div>
                </motion.div>
              )}

              {fired && beamStyle && (
                <>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute top-1/2 h-3 origin-left rounded-full bg-fuchsia-300 shadow-[0_0_28px_rgba(240,171,252,0.7)]"
                    style={beamStyle.first}
                  />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.18 }}
                    className="absolute top-1/2 h-3 origin-left rounded-full bg-cyan-300 shadow-[0_0_28px_rgba(103,232,249,0.7)]"
                    style={beamStyle.second}
                  />
                </>
              )}

              <div className="absolute left-1/2 top-[10%] -translate-x-1/2 rounded-2xl border border-cyan-200/25 bg-slate-950/90 px-5 py-3 text-center">
                <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-100">Sıfır aynası</p>
                <p className="text-sm font-bold text-slate-300">{selected === null ? 'Uzaklık için nokta seç' : `Uzaklık: |${selected}| = ${distance}`}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-center text-sm font-black uppercase tracking-[0.18em] text-cyan-100">Başlangıç noktasını seç</p>
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
                {PADS.map((value) => (
                  <button
                    key={value}
                    data-testid={toTestId(value)}
                    onClick={() => choosePad(value)}
                    className={`min-h-16 rounded-2xl border text-xl font-black transition hover:scale-[1.03] ${
                      selected === value
                        ? 'border-cyan-100 bg-cyan-300 text-slate-950'
                        : 'border-white/12 bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    {display(value)}
                  </button>
                ))}
              </div>

              <button
                data-testid="absolute-fire"
                onClick={fire}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-lg font-black text-slate-950 transition hover:bg-white"
              >
                <Minus className="h-5 w-5" />
                Işığı aynadan yansıt
              </button>

              {feedback && !completed && (
                <div
                  data-testid="absolute-feedback"
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
                    feedback.type === 'error'
                      ? 'border-rose-400/40 bg-rose-500/10 text-rose-100'
                      : 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'
                  }`}
                >
                  {feedback.text}
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[28px] border border-cyan-300/30 bg-cyan-950/40 p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Canlı durum</p>
            <h2 className="mt-3 text-2xl font-black">{completed ? 'Ayna tamam' : 'AstroBot hazır'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">{botMessage.text}</p>
          </section>

          <section className="rounded-[28px] border border-white/15 bg-white/[0.07] p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Görev zinciri</p>
            <div className="mt-4 space-y-3">
              {MISSIONS.map((item, index) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                    index < missionIndex || completed
                      ? 'border-emerald-300/35 bg-emerald-400/10 text-emerald-100'
                      : index === missionIndex
                        ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-50'
                        : 'border-white/10 bg-slate-950/45 text-white/55'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {index < missionIndex || completed ? <CheckCircle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    {item.title}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">Hedef {display(item.target)}</p>
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

function CompletionPanel({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl rounded-[36px] border border-cyan-200/30 bg-slate-950 p-8 text-center shadow-[0_30px_100px_rgba(0,229,255,0.22)]"
      >
        <ShieldCheck className="mx-auto h-20 w-20 text-cyan-300" />
        <h2 className="mt-5 text-4xl font-black">Sıfır aynası tamam</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
          Negatif ve pozitif yönleri sayı doğrusunda yorumladın; sıfıra olan uzaklığı aynada eşleştirdin.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ATOMS.map((atomId) => (
            <div key={atomId} className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-4 text-left">
              <p className="font-mono text-sm font-black text-cyan-100">{atomId}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button data-testid="absolute-replay" onClick={onReplay} className="rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white">
            Tekrar oyna
          </button>
          <Link data-testid="absolute-home" to="/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/15">
            Ana merkeze dön <Home className="h-5 w-5" /> <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
