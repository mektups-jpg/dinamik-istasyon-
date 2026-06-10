import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, ChevronLeft, Home, Minus, Plus, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

type Mission = {
  title: string;
  prompt: string;
  reference: { left: number; right: number; label: string };
  moving: { left: number; startRight: number; targetRight: number; label: string };
  atomIds: string[];
  reason: string;
};

const MODULE_ID = 'gear-ratio';
const ATOMS = ['MAT.7.1.5.1', 'MAT.7.1.5.2', 'MAT.7.1.5.3', 'MAT.7.1.6.1', 'MAT.7.1.7.1'];
const MISSIONS: Mission[] = [
  {
    title: 'Oranı aynı çizgiye getir',
    prompt: 'Referans 2:3. Sağ motor 12 parça üretiyorsa mor çark kaç parça olmalı?',
    reference: { left: 2, right: 3, label: 'referans oran' },
    moving: { left: 12, startRight: 14, targetRight: 18, label: 'senin oran motorun' },
    atomIds: ['MAT.7.1.5.1', 'MAT.7.1.5.2', 'MAT.7.1.5.3'],
    reason: '2:3 oranı 12:18 ile aynı ilişkiyi kurar. Oran kesir, iki nokta ve bölüm diliyle okunabilir.',
  },
  {
    title: 'Orantı kilidini kapat',
    prompt: '3:5 oranı ile 9:? oranı eşit olmalı. Çapraz ışınları eşitle.',
    reference: { left: 3, right: 5, label: 'sol oran' },
    moving: { left: 9, startRight: 13, targetRight: 15, label: 'sağ oran' },
    atomIds: ['MAT.7.1.6.1'],
    reason: '3 x 15 = 5 x 9 olduğu için iki oran eşitlenir ve orantı kurulur.',
  },
  {
    title: 'Doğru orantı üretimini ayarla',
    prompt: '2 tur 8 enerji üretiyor. Aynı hızla 5 tur kaç enerji üretmeli?',
    reference: { left: 2, right: 8, label: 'tur : enerji' },
    moving: { left: 5, startRight: 16, targetRight: 20, label: 'yeni üretim' },
    atomIds: ['MAT.7.1.7.1'],
    reason: 'Tur sayısı 2,5 katına çıkınca enerji de 2,5 katına çıkar: 5 tur 20 enerji üretir.',
  },
];

const makeMessage = (text: string, type: BotMessageType, id: number): BotMessage => ({ text, type, id });
const ratioText = (left: number, right: number) => `${left}:${right}`;
const clampRight = (value: number) => Math.max(1, Math.min(36, value));

function gearPath(teeth: number, radius: number) {
  const toothCount = Math.max(8, Math.min(28, teeth));
  const inner = radius * 0.84;
  const outer = radius;
  const points: string[] = [];

  for (let index = 0; index < toothCount * 2; index += 1) {
    const angle = (index / (toothCount * 2)) * Math.PI * 2 - Math.PI / 2;
    const pointRadius = index % 2 === 0 ? outer : inner;
    const x = Math.cos(angle) * pointRadius;
    const y = Math.sin(angle) * pointRadius;
    points.push(`${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return `${points.join(' ')} Z`;
}

export default function GearRatioApp() {
  const navigate = useNavigate();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [currentRight, setCurrentRight] = useState(MISSIONS[0].moving.startRight);
  const [feedback, setFeedback] = useState<{ text: string; type: BotMessageType } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [botMessage, setBotMessage] = useState<BotMessage>(
    makeMessage('Mor çarkı büyütüp küçült. İki oran aynı çizgiye gelince kilitle.', 'info', 0),
  );

  const mission = MISSIONS[missionIndex];
  const crossLeft = mission.reference.left * currentRight;
  const crossRight = mission.reference.right * mission.moving.left;
  const isTarget = currentRight === mission.moving.targetRight;
  const progress = completed ? 100 : Math.round((missionIndex / MISSIONS.length) * 100);

  const comparison = useMemo(() => {
    if (crossLeft === crossRight) return 'Çapraz ışınlar eşit.';
    return crossLeft < crossRight ? 'Mor çark biraz büyümeli.' : 'Mor çark biraz küçülmeli.';
  }, [crossLeft, crossRight]);

  const speak = (text: string, type: BotMessageType = 'info') => {
    setMessageId((id) => {
      const nextId = id + 1;
      setBotMessage(makeMessage(text, type, nextId));
      return nextId;
    });
  };

  const reset = () => {
    setMissionIndex(0);
    setCurrentRight(MISSIONS[0].moving.startRight);
    setFeedback(null);
    setCompleted(false);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    speak('Yeni oran motoru hazır. Mor çarkı hedef orana göre ayarla.', 'info');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home') reset();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const adjust = (delta: number) => {
    if (completed) return;
    setCurrentRight((value) => clampRight(value + delta));
    setFeedback(null);
  };

  const lock = () => {
    if (completed) return;

    if (!isTarget) {
      const text = `${ratioText(mission.moving.left, currentRight)} henüz ${ratioText(mission.reference.left, mission.reference.right)} ile eşit değil. ${mission.reference.left} x ${currentRight} = ${crossLeft}, ${mission.reference.right} x ${mission.moving.left} = ${crossRight}. ${comparison}`;
      setFeedback({ text, type: 'error' });
      speak(text, 'error');
      return;
    }

    mission.atomIds.forEach((atomId) => unlockAtom(atomId));
    const isLast = missionIndex === MISSIONS.length - 1;
    const text = `Doğru: ${ratioText(mission.moving.left, currentRight)} oranı hedefle eşleşti. ${mission.reason}`;
    setFeedback({ text, type: 'success' });
    speak(text, 'success');

    window.setTimeout(() => {
      if (isLast) {
        ATOMS.forEach((atomId) => unlockAtom(atomId));
        unlockModule(MODULE_ID);
        addScore(140);
        setCompleted(true);
        speak('Oran dişli hattı tamamlandı. Oran, orantı ve doğru orantıyı aynı makinede kurdun.', 'success');
      } else {
        const nextMission = MISSIONS[missionIndex + 1];
        setMissionIndex((index) => index + 1);
        setCurrentRight(nextMission.moving.startRight);
        setFeedback(null);
        speak('Yeni oran görevi açıldı. Çapraz ışınların eşitlenmesini izle.', 'info');
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
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-200">MAT.7.1.5 · MAT.7.1.6 · MAT.7.1.7</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Oran Dişli Atölyesi</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">İlerleme</p>
            <p data-testid="gear-ratio-progress" className="text-xl font-black text-cyan-100">%{progress}</p>
          </div>
          <button data-testid="gear-ratio-reset" aria-keyshortcuts="Home" onClick={reset} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/15">
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section data-testid="gear-ratio-stage" className="rounded-[32px] border border-cyan-300/20 bg-slate-950/72 p-5 shadow-[0_30px_90px_rgba(0,229,255,0.12)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-cyan-100">Ana oyuncak: çapraz ışınlı oran dişlisi</p>
              <h2 className="mt-1 text-2xl font-black">{mission.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-300">{mission.prompt}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
              <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white/50">Hedef oran</p>
              <p className="mt-1 text-4xl font-black text-cyan-100">{ratioText(mission.moving.left, mission.moving.targetRight)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[30px] border border-white/10 bg-[#07111f] p-5">
            <div data-testid="gear-ratio-scene" className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-cyan-200/15 bg-slate-950/85 p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(167,139,250,0.16),transparent_34%)]" />
              <div className="absolute left-[12%] right-[12%] top-[56%] h-2 rounded-full bg-gradient-to-r from-cyan-300/70 via-white/35 to-violet-300/70 shadow-[0_0_28px_rgba(103,232,249,0.35)]" />
              <div className="absolute left-[19%] right-[19%] top-[39%] h-px rotate-[12deg] bg-cyan-200/45" />
              <div className="absolute left-[19%] right-[19%] top-[73%] h-px -rotate-[12deg] bg-violet-200/45" />

              <RatioPair
                title={mission.reference.label}
                left={mission.reference.left}
                right={mission.reference.right}
                fixed
              />
              <RatioPair
                title={mission.moving.label}
                left={mission.moving.left}
                right={currentRight}
                rightActive
              />

              <div data-testid="gear-ratio-proof" className={`absolute left-1/2 top-5 z-20 w-[min(92%,520px)] -translate-x-1/2 rounded-3xl border px-5 py-4 text-center backdrop-blur-xl ${isTarget ? 'border-emerald-300/40 bg-emerald-400/12' : 'border-cyan-200/18 bg-slate-950/82'}`}>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.26em] text-cyan-100">Çapraz çarpım kanıtı</p>
                <p className="mt-2 text-xl font-black text-white">
                  {mission.reference.left} x {currentRight} = {crossLeft}
                  <span className="mx-3 text-cyan-200">|</span>
                  {mission.reference.right} x {mission.moving.left} = {crossRight}
                </p>
                <p className={`mt-1 text-sm font-bold ${isTarget ? 'text-emerald-100' : 'text-white/62'}`}>{isTarget ? 'Işınlar eşitlendi. Kilitlemeye hazır.' : comparison}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-100">Canlı oran okuma</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <RatioBadge label="iki nokta" value={ratioText(mission.moving.left, currentRight)} />
                  <RatioBadge label="kesir" value={`${mission.moving.left}/${currentRight}`} />
                  <RatioBadge label="bölüm" value={`${mission.moving.left} ÷ ${currentRight}`} />
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-100">Mor çark ayarı</p>
                <p data-testid="gear-ratio-current" className="mt-2 text-center text-5xl font-black text-white">{currentRight}</p>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <ControlButton testId="gear-ratio-minus5" label="-5" onClick={() => adjust(-5)} />
                  <ControlButton testId="gear-ratio-minus" label="-1" onClick={() => adjust(-1)} icon={<Minus className="h-4 w-4" />} />
                  <ControlButton testId="gear-ratio-plus" label="+1" onClick={() => adjust(1)} icon={<Plus className="h-4 w-4" />} />
                  <ControlButton testId="gear-ratio-plus5" label="+5" onClick={() => adjust(5)} />
                </div>
                <button data-testid="gear-ratio-lock" onClick={lock} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 transition hover:bg-white">
                  <Zap className="h-5 w-5" />
                  Oranı kilitle
                </button>
              </div>
            </div>
          </div>

          {feedback && !completed && (
            <div data-testid="gear-ratio-feedback" className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold ${feedback.type === 'error' ? 'border-rose-400/40 bg-rose-500/10 text-rose-100' : 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'}`}>
              {feedback.text}
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[28px] border border-cyan-300/30 bg-cyan-950/40 p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Canlı durum</p>
            <h2 className="mt-3 text-2xl font-black">{completed ? 'Atölye tamam' : 'AstroBot hazır'}</h2>
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
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">Hedef {ratioText(item.moving.left, item.moving.targetRight)}</p>
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

function RatioPair({ title, left, right, fixed = false, rightActive = false }: { title: string; left: number; right: number; fixed?: boolean; rightActive?: boolean }) {
  return (
    <div data-testid={fixed ? 'gear-ratio-reference-pair' : 'gear-ratio-moving-pair'} className={`absolute top-[27%] z-10 flex w-[39%] flex-col items-center ${fixed ? 'left-[7%]' : 'right-[7%]'}`}>
      <p className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/62">{title}</p>
      <div className="mt-6 flex w-full items-center justify-center gap-4">
        <Gear value={left} tone="cyan" />
        <ArrowRight className="h-6 w-6 shrink-0 text-white/45" />
        <Gear value={right} tone={rightActive ? 'violet-active' : 'violet'} />
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/72 px-5 py-3 text-center shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
        <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-white/45">oran</p>
        <p className="mt-1 text-3xl font-black text-white">{ratioText(left, right)}</p>
      </div>
    </div>
  );
}

function Gear({ value, tone }: { value: number; tone: 'cyan' | 'violet' | 'violet-active' }) {
  const radius = Math.max(42, Math.min(78, 34 + value * 2.1));
  const size = radius * 2 + 28;
  const stroke = tone === 'cyan' ? '#67e8f9' : tone === 'violet-active' ? '#f0abfc' : '#c4b5fd';
  const fill = tone === 'cyan' ? '#073044' : '#26114f';

  return (
    <div
      aria-label={`${value} parçalı dişli`}
      className="relative grid shrink-0 place-items-center drop-shadow-[0_0_24px_rgba(103,232,249,0.22)]"
      role="img"
      style={{ width: size, height: size }}
    >
      <motion.svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
        animate={{ rotate: tone === 'cyan' ? 360 : -360 }}
        transition={{ duration: Math.max(6, 18 - value / 2), repeat: Infinity, ease: 'linear' }}
      >
        <path d={gearPath(value, radius)} fill={fill} stroke={stroke} strokeWidth="3" />
        <circle r={radius * 0.52} fill="#050510" stroke={stroke} strokeWidth="2" strokeDasharray="6 7" />
        <circle r={radius * 0.16} fill={stroke} />
      </motion.svg>
      <span className="relative z-10 rounded-xl bg-slate-950/72 px-2 py-1 text-2xl font-black leading-none text-white ring-1 ring-white/10">
        {value}
      </span>
    </div>
  );
}

function RatioBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-4">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-1 text-xl font-black text-cyan-100">{value}</p>
    </div>
  );
}

function ControlButton({ testId, label, icon, onClick }: { testId: string; label: string; icon?: React.ReactNode; onClick: () => void }) {
  return (
    <button data-testid={testId} onClick={onClick} className="flex min-h-12 items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/10 text-sm font-black transition hover:bg-white/15">
      {icon}
      {label}
    </button>
  );
}

function CompletionPanel({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/86 p-6 backdrop-blur-xl">
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl rounded-[34px] border border-cyan-200/30 bg-slate-950 p-8 text-center shadow-[0_34px_90px_rgba(0,229,255,0.22)]">
        <Sparkles className="mx-auto h-14 w-14 text-cyan-200" />
        <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Oran hattı tamamlandı</p>
        <h2 className="mt-3 text-4xl font-black">Atölye kilitlendi</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70">
          Oranı üç gösterimle okudun, çapraz çarpımla orantıyı doğruladın ve doğru orantılı üretimi tamamladın.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button data-testid="gear-ratio-replay" onClick={onReplay} className="rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white">
            Tekrar oyna
          </button>
          <Link data-testid="gear-ratio-home" to="/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/15">
            <Home className="h-5 w-5" />
            Ana merkeze dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
