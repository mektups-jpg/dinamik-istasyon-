import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, ChevronLeft, RotateCcw, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';
import { ChoiceButton, CompletionPanel, DimensionToy, RuleChip } from './AlgebraicDimensionsParts';
import { ATOMS, MISSIONS, MODULE_ID, powerLabels } from './algebraicDimensionsData';
import type { DimensionPower } from './algebraicDimensionsData';

const makeMessage = (text: string, type: BotMessageType, id: number): BotMessage => ({ text, type, id });

export default function AlgebraicDimensionsApp() {
  const navigate = useNavigate();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const [missionIndex, setMissionIndex] = useState(0);
  const [xValue, setXValue] = useState(3);
  const [selectedPower, setSelectedPower] = useState<DimensionPower | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: BotMessageType } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [botMessage, setBotMessage] = useState<BotMessage>(
    makeMessage('Boyut makinesi hazır. İfadeye bak, oluşacak boyutu sahneden seç.', 'info', 0),
  );

  const mission = MISSIONS[missionIndex];
  const displayPower = selectedPower ?? mission.leftPower;
  const scoreProgress = completed ? 100 : Math.round((missionIndex / MISSIONS.length) * 100);

  const resultValue = useMemo(() => Math.pow(xValue, displayPower), [xValue, displayPower]);

  const speak = (text: string, type: BotMessageType = 'info') => {
    setMessageId((id) => {
      const nextId = id + 1;
      setBotMessage(makeMessage(text, type, nextId));
      return nextId;
    });
  };

  const reset = () => {
    setMissionIndex(0);
    setXValue(3);
    setSelectedPower(null);
    setFeedback(null);
    setCompleted(false);
    setIsAdvancing(false);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    speak('Yeni görev hazır. Aynı tabanlı üsleri işle ve doğru boyutu seç.', 'info');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home') reset();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleChoice = (power: DimensionPower) => {
    if (isAdvancing || completed) return;

    setSelectedPower(power);

    if (power !== mission.answer) {
      const text = `${powerLabels[power]} seçildi ama hedef ${powerLabels[mission.answer]}. ${mission.wrongReason}`;
      setFeedback({ text, type: 'error' });
      speak(text, 'error');
      return;
    }

    mission.atoms.forEach((atomId) => unlockAtom(atomId));
    const isLast = missionIndex === MISSIONS.length - 1;
    const text = `Doğru hedef: ${powerLabels[power]}. ${mission.correctReason}`;
    setFeedback({ text, type: 'success' });
    setIsAdvancing(true);
    speak(text, 'success');

    window.setTimeout(() => {
      if (isLast) {
        ATOMS.forEach((atomId) => unlockAtom(atomId));
        unlockModule(MODULE_ID);
        addScore(150);
        setCompleted(true);
        setIsAdvancing(false);
        speak('Boyut odası tamam. Çarpmada üsleri topladın, bölmede üsleri çıkardın.', 'success');
      } else {
        setMissionIndex((index) => index + 1);
        setSelectedPower(null);
        setFeedback(null);
        setIsAdvancing(false);
        speak('Sıradaki boyut kapısı açıldı. Yeni ifadeyi çöz.', 'info');
      }
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#050510] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <button
            aria-label="Ana merkeze dön"
            onClick={() => navigate('/')}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-200">MAT.8.1.1.2 · MAT.8.1.1.3</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Cebirsel Boyut Odası</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">İlerleme</p>
            <p data-testid="dimension-progress" className="text-xl font-black text-cyan-100">%{scoreProgress}</p>
          </div>
          <button
            data-testid="dimension-reset"
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
          data-testid="algebraic-dimensions-stage"
          className="rounded-[32px] border border-cyan-300/20 bg-slate-950/72 p-5 shadow-[0_30px_90px_rgba(0,229,255,0.12)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-cyan-100">Ana oyuncak: üs boyut makinesi</p>
              <h2 className="mt-1 text-2xl font-black">{mission.title}</h2>
              <p className="mt-1 text-sm text-slate-300">{mission.prompt}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
              <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white/50">İfade</p>
              <p className="mt-1 text-3xl font-black text-cyan-100">{mission.expression}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[28px] border border-white/10 bg-[#07111f] p-4">
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="dimension-size-slider" className="font-mono text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
                  x uzunluğu
                </label>
                <span className="rounded-2xl border border-cyan-200/25 bg-cyan-300/10 px-4 py-2 text-2xl font-black text-white">x = {xValue}</span>
              </div>
              <div className="grid grid-cols-[56px_minmax(0,1fr)_56px] items-center gap-3">
                <button
                  type="button"
                  data-testid="dimension-size-decrease"
                  onClick={() => setXValue((value) => Math.max(2, value - 1))}
                  className="h-14 rounded-2xl border border-white/15 bg-white/10 text-2xl font-black text-white transition hover:bg-white/15"
                  aria-label="x uzunluğunu azalt"
                >
                  -
                </button>
                <input
                  id="dimension-size-slider"
                  data-testid="dimension-size-slider"
                  type="range"
                  min="2"
                  max="6"
                  value={xValue}
                  onChange={(event) => setXValue(Number(event.currentTarget.value))}
                  onInput={(event) => setXValue(Number(event.currentTarget.value))}
                  className="h-5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-300"
                />
                <button
                  type="button"
                  data-testid="dimension-size-increase"
                  onClick={() => setXValue((value) => Math.min(6, value + 1))}
                  className="h-14 rounded-2xl border border-cyan-200/30 bg-cyan-300/15 text-2xl font-black text-cyan-50 transition hover:bg-cyan-300/25"
                  aria-label="x uzunluğunu artır"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 grid items-center gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-white/45">Kural aynası</p>
                <div className="mt-4 space-y-3">
                  <RuleChip active={mission.kind === 'multiply'} text="Çarpma: üsleri topla" />
                  <RuleChip active={mission.kind === 'divide'} text="Bölme: üsleri çıkar" />
                </div>
              </div>

              <div className="relative min-h-[270px] overflow-hidden rounded-[28px] border border-cyan-200/15 bg-slate-950/80 p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_55%)]" />
                <div className="relative z-10 flex h-full min-h-[240px] flex-col items-center justify-center gap-4">
                  <DimensionToy power={displayPower} xValue={xValue} />
                  <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-3 text-center">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-100">{powerLabels[displayPower]}</p>
                    <p className="mt-1 text-2xl font-black text-white">x = {xValue} için değer: {resultValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-center text-sm font-black uppercase tracking-[0.18em] text-cyan-100">Oluşan boyutu seç</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <ChoiceButton testId="dimension-choice-x1" power={1} selected={selectedPower === 1} disabled={isAdvancing} onClick={() => handleChoice(1)} />
              <ChoiceButton testId="dimension-choice-x2" power={2} selected={selectedPower === 2} disabled={isAdvancing} onClick={() => handleChoice(2)} />
              <ChoiceButton testId="dimension-choice-x3" power={3} selected={selectedPower === 3} disabled={isAdvancing} onClick={() => handleChoice(3)} />
            </div>
            {feedback && !completed && (
              <div
                data-testid="dimension-feedback"
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
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[28px] border border-cyan-300/30 bg-cyan-950/40 p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Canlı durum</p>
            <h2 className="mt-3 text-2xl font-black">{completed ? 'Boyutlar kilitlendi' : 'AstroBot hazır'}</h2>
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
                    {index < missionIndex || completed ? <CheckCircle className="h-5 w-5" /> : <Waves className="h-5 w-5" />}
                    {item.title}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">{item.expression}</p>
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
