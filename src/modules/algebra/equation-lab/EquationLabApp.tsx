import { useEffect, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import Bot from '../../../components/characters/Bot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { MiddleSchoolLabShell } from '../../middle-school/shared/MiddleSchoolLabShell';
import { EquationScale } from './EquationScale';
import {
  getMissionSet,
  getNextMissionSetIndex,
  initialFeedback,
  type ChoiceKind,
  type EquationChoice,
  type EquationMission,
  type Feedback,
} from './equationLabModel';

type Stage = 'focus' | 'operate' | 'answer' | 'complete';
const missionSetStorageKey = 'equation-lab-mission-set-index';

const feedbackClasses: Record<Feedback['tone'], string> = {
  info: 'border-cyan-200/35 bg-[radial-gradient(circle_at_22%_18%,rgba(125,211,252,0.22),transparent_36%),linear-gradient(135deg,rgba(8,47,73,0.78),rgba(30,41,59,0.72))] text-cyan-50 shadow-cyan-950/28',
  success: 'border-emerald-200/40 bg-[radial-gradient(circle_at_22%_18%,rgba(110,231,183,0.22),transparent_36%),linear-gradient(135deg,rgba(6,78,59,0.76),rgba(15,23,42,0.72))] text-emerald-50 shadow-emerald-950/28',
  error: 'border-rose-200/45 bg-[radial-gradient(circle_at_22%_18%,rgba(251,113,133,0.22),transparent_36%),linear-gradient(135deg,rgba(127,29,29,0.74),rgba(30,41,59,0.7))] text-rose-50 shadow-rose-950/28',
};

export default function EquationLabApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const [missionSetIndex, setMissionSetIndex] = useState(getInitialMissionSetIndex);
  const [missionIndex, setMissionIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('focus');
  const [feedback, setFeedback] = useState<Feedback>(initialFeedback);
  const [solvedMissions, setSolvedMissions] = useState<string[]>([]);
  const [appliedOperation, setAppliedOperation] = useState(false);
  const [scaleTilt, setScaleTilt] = useState(0);
  const activeMissions = getMissionSet(missionSetIndex);
  const mission = activeMissions[missionIndex];
  const isFinished = solvedMissions.length === activeMissions.length;

  useEffect(() => {
    if (!isFinished) return;
    activeMissions.flatMap((item) => item.atomIds).forEach(unlockAtom);
    unlockModule('equation-lab');
  }, [activeMissions, isFinished, unlockAtom, unlockModule]);

  useEffect(() => {
    const type = feedback.tone === 'error' ? 'error' : feedback.tone === 'success' ? 'success' : 'info';
    showMessage(`${feedback.title}: ${feedback.body}`, type);
  }, [feedback, showMessage]);

  const resetLab = () => {
    const nextMissionSetIndex = getNextMissionSetIndex(missionSetIndex);
    rememberMissionSetIndex(nextMissionSetIndex);
    setMissionSetIndex(nextMissionSetIndex);
    setMissionIndex(0);
    setStage('focus');
    setFeedback(initialFeedback);
    setSolvedMissions([]);
    setAppliedOperation(false);
    setScaleTilt(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Home') {
      resetLab();
    }
  };

  const completeMission = () => {
    const nextSolved = [...solvedMissions, mission.id];
    setSolvedMissions(nextSolved);
    setFeedback({ tone: 'success', title: mission.success, body: mission.proof });
    setScaleTilt(0);

    if (nextSolved.length === activeMissions.length) {
      setStage('complete');
      return;
    }

    setAppliedOperation(false);
    window.setTimeout(() => {
      setMissionIndex((current) => current + 1);
      setStage('focus');
      setScaleTilt(0);
      setFeedback({
        tone: 'info',
        title: 'Yeni terazi görevi',
        body: activeMissions[nextSolved.length].prompt,
      });
    }, 850);
  };

  const handleChoice = (choice: EquationChoice, kind: ChoiceKind) => {
    if (!choice.correct) {
      setScaleTilt(getWrongChoiceTilt(choice, mission.kind));
      setFeedback({ tone: 'error', title: 'Neden yanlış?', body: choice.wrongReason });
      return;
    }

    if (kind === 'focus') {
      setStage('operate');
      setScaleTilt(0);
      setFeedback({
        tone: 'success',
        title: 'Doğru hedef',
        body: 'İşlem önceliği olan ifade seçildi. Şimdi bu parçanın sonucunu enerji kodu olarak gir.',
      });
      return;
    }

    if (kind === 'operation') {
      setAppliedOperation(true);
      setStage('answer');
      setScaleTilt(0);
      setFeedback({
        tone: 'success',
        title: 'Denge bozulmadı',
        body: mission.kind === 'balance'
          ? 'Aynı işlem iki kefeye de uygulandı. Şimdi x değerini seç.'
          : 'Kalkan sonucu bulundu. Şimdi kalan toplamı tamamla.',
      });
      return;
    }

    completeMission();
  };

  const currentProgress = Math.round((solvedMissions.length / activeMissions.length) * 100);

  return (
    <MiddleSchoolLabShell
      title="Denklem Terazisi"
      subtitle="MAT.5.2.1.1 · MAT.5.2.2.1"
      badges={[{ label: 'İlerleme', value: `%${currentProgress}`, tone: currentProgress === 100 ? 'green' : 'cyan' }]}
      rightContent={
        <button
          type="button"
          data-testid="equation-reset"
          onClick={resetLab}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white transition hover:border-cyan-200/50 hover:bg-cyan-200/15 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        >
          <RotateCcw className="h-4 w-4" />
          Sıfırla
        </button>
      }
      contentClassName="max-w-7xl px-4 py-5 pb-36 sm:px-6 lg:px-8"
    >
      <section
        data-testid="equation-lab-scene"
        tabIndex={0}
        aria-keyshortcuts="Home"
        onKeyDown={handleKeyDown}
        className="outline-none"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(330px,0.75fr)]">
          <section className="relative min-h-[620px] overflow-hidden rounded-[30px] border border-cyan-200/15 bg-slate-950/55 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-5">
            <div className="absolute inset-x-8 top-5 h-28 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="relative flex min-h-[580px] flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cyan-100">Ana oyuncak: kural sensörlü denklem terazisi</p>
                  <p className="text-xs text-slate-300">{mission.prompt}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold">
                  {mission.title}
                </span>
              </div>

              <div className="grid flex-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_250px]">
                <div className="flex min-h-[500px] items-center justify-center rounded-[28px] border border-white/10 bg-slate-900/45 p-3 sm:p-4">
                  <div className="w-full max-w-[900px]">
                    <EquationScale
                      leftLabel={leftDisplay(mission, appliedOperation)}
                      rightLabel={rightDisplay(mission, appliedOperation)}
                      tilt={scaleTilt}
                    />

                    <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/55 p-4">
                      <AnimatePresence mode="wait">
                        {stage === 'focus' && (
                          <ChoicePanel
                            key="focus"
                            title={
                              mission.kind === 'priority'
                                ? 'Önce hangi işlem yapılır?'
                                : 'Değişkeni yalnız bırakmak için iki tarafa hangi işlem uygulanmalı?'
                            }
                            choices={mission.kind === 'priority' ? mission.focusChoices : mission.operationChoices}
                            kind={mission.kind === 'priority' ? 'focus' : 'operation'}
                            onChoice={handleChoice}
                          />
                        )}
                        {stage === 'operate' && (
                          <ChoicePanel
                            key="operate"
                            title={mission.kind === 'priority' ? 'Seçtiğin işlemin sonucu kaç?' : 'İki kefeye hangi işlem uygulanır?'}
                            choices={mission.operationChoices}
                            kind="operation"
                            onChoice={handleChoice}
                          />
                        )}
                        {stage === 'answer' && (
                          <ChoicePanel
                            key="answer"
                            title={mission.kind === 'priority' ? 'Sonuç çekirdeğini kilitle' : 'x değerini kilitle'}
                            choices={mission.answerChoices}
                            kind="answer"
                            onChoice={handleChoice}
                          />
                        )}
                        {stage === 'complete' && <CompletionPanel key="complete" onReset={resetLab} />}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <aside className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4">
                  <p className="text-sm font-bold text-cyan-100">Görev zinciri</p>
                  <div className="mt-4 space-y-3">
                    {activeMissions.map((item, index) => {
                      const isSolved = solvedMissions.includes(item.id);
                      const isActive = index === missionIndex && !isFinished;
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-3 text-sm transition ${
                            isSolved
                              ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
                              : isActive
                                ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100'
                                : 'border-white/10 bg-white/[0.04] text-white/46'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSolved ? <CheckCircle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                            <span className="font-black">{item.title}</span>
                          </div>
                          <p className="mt-2 text-xs opacity-75">{item.atomIds.join(' · ')}</p>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <motion.section
              layout
              data-testid="equation-feedback"
              className={`relative overflow-hidden rounded-[30px] border p-4 shadow-2xl backdrop-blur-xl sm:p-5 ${feedbackClasses[feedback.tone]}`}
            >
              <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-6 h-32 w-32 rounded-full bg-cyan-300/12 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <motion.div
                  className="relative flex h-28 w-24 shrink-0 items-center justify-center"
                  animate={{ y: feedback.tone === 'success' ? [0, -3, 0] : 0 }}
                  transition={{ duration: 1.6, repeat: feedback.tone === 'success' ? Infinity : 0, ease: 'easeInOut' }}
                >
                  <motion.div
                    className="absolute h-24 w-24 rounded-[2rem] border border-cyan-100/20 bg-cyan-100/10"
                    animate={{ scale: [0.95, 1.06, 0.95], opacity: [0.34, 0.64, 0.34] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute bottom-2 h-14 w-16 rounded-full bg-cyan-300/20 blur-xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/15 bg-slate-950/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_34px_rgba(34,211,238,0.22)]">
                    <div className="scale-125">
                      <Bot state={feedback.tone === 'success' ? 'jumping' : 'idle'} direction={1} />
                    </div>
                  </div>
                  <span className="absolute bottom-1 h-1.5 w-10 rounded-full bg-cyan-200/55 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
                </motion.div>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-[0.22em] opacity-85">AstroBot</p>
                    <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] opacity-80">
                      Canlı
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-black leading-tight">{feedback.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed opacity-[0.92]">{feedback.body}</p>
                </div>
              </div>
            </motion.section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Kural kanıtı</p>
              <div className="mt-4 space-y-3 text-sm font-bold text-slate-200">
                <div className="rounded-2xl border border-amber-200/35 bg-amber-300/10 p-3 text-amber-50 shadow-[0_0_24px_rgba(251,191,36,0.12)]">
                  <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">İşlem önceliği</span>
                  <span className="mt-1 block text-slate-100">Parantez -&gt; çarpma-bölme -&gt; toplama-çıkarma</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">Eşitlikte aynı işlem iki kefeye</div>
                <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-3 text-emerald-100">
                  Sonuç, kural bozulmadan kilitlenir
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </MiddleSchoolLabShell>
  );
}

function ChoicePanel({
  title,
  choices,
  kind,
  onChoice,
}: {
  title: string;
  choices: EquationChoice[];
  kind: ChoiceKind;
  onChoice: (choice: EquationChoice, kind: ChoiceKind) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <p className="mx-auto max-w-2xl text-center text-sm font-black uppercase leading-snug tracking-[0.12em] text-cyan-100">
        {title}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            data-testid={choice.testId}
            onClick={() => onChoice(choice, kind)}
            className="min-h-20 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-2xl font-black transition hover:border-cyan-200/50 hover:bg-cyan-200/12 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          >
            {choice.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function CompletionPanel({ onReset }: { onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
      <Sparkles className="mx-auto h-10 w-10 text-emerald-200" />
      <h2 className="mt-3 text-2xl font-black text-emerald-100">Laboratuvar tamamlandı</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/66">
        İşlem önceliği ve eşitliğin korunumu aynı denklem terazisinde kilitlendi.
      </p>
      <button
        type="button"
        data-testid="equation-check"
        onClick={onReset}
        className="mt-5 rounded-2xl border border-emerald-300/30 bg-emerald-300/12 px-5 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/18"
      >
        Yeniden başlat
      </button>
    </motion.div>
  );
}

function leftDisplay(mission: EquationMission, appliedOperation: boolean) {
  return appliedOperation ? mission.afterOperationLeftLabel : mission.leftLabel;
}

function rightDisplay(mission: EquationMission, appliedOperation: boolean) {
  return appliedOperation ? mission.afterOperationRightLabel : mission.rightLabel;
}

function getWrongChoiceTilt(choice: EquationChoice, missionKind: string) {
  if (choice.wrongTilt !== undefined) return choice.wrongTilt;

  if (missionKind === 'balance') {
    return choice.label.startsWith('+') ? -10 : 10;
  }

  return choice.label === '+' ? 10 : -10;
}

function getInitialMissionSetIndex() {
  if (typeof window === 'undefined') return 0;

  const storedIndex = Number(window.sessionStorage.getItem(missionSetStorageKey));
  const nextIndex = getNextMissionSetIndex(Number.isFinite(storedIndex) ? storedIndex : -1);
  rememberMissionSetIndex(nextIndex);
  return nextIndex;
}

function rememberMissionSetIndex(index: number) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(missionSetStorageKey, String(index));
}
