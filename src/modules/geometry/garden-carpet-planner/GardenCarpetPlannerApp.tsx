import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Fence, Home, Layers3, RotateCcw, Ruler, XCircle } from 'lucide-react';
import { GameHeader } from '../../../components/ui/GameHeader';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { areaOf, createPlannerMissions, PLANNER_ATOMS } from './gardenCarpetPlannerModel';

const MODULE_ID = 'garden-carpet-planner';

type Feedback = {
  kind: 'info' | 'success' | 'error';
  text: string;
};

type ViewMode = 'fence' | 'area';

export default function GardenCarpetPlannerApp() {
  const { showMessage } = useAstroBotStore();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();

  const [missions, setMissions] = useState(() => createPlannerMissions());
  const [missionIndex, setMissionIndex] = useState(0);
  const mission = missions[missionIndex];
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(mission.mode);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    kind: 'info',
    text: 'Çit dış kenar, alan iç kaplama.',
  });

  const cellSize = Math.min(64, Math.max(30, Math.floor(430 / Math.max(mission.width, mission.height))));
  const area = areaOf(mission);

  useEffect(() => {
    showMessage('Günlük problemi oku. Çit dış çizgidir, halı ve toprak iç alanı kaplar.', 'info');
  }, [showMessage]);

  const chooseAnswer = (answer: number) => {
    if (isResolving) return;

    setSelectedAnswer(answer);
    if (answer !== mission.correctAnswer) {
      setFeedback({ kind: 'error', text: mission.error });
      showMessage(mission.error, 'error');
      return;
    }

    setIsResolving(true);
    setFeedback({ kind: 'success', text: mission.success });
    setCompletedMissionIds((current) => (current.includes(mission.id) ? current : [...current, mission.id]));
    unlockAtom(mission.atomId);
    showMessage(mission.success, 'success');

    if (missionIndex === missions.length - 1) {
      PLANNER_ATOMS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(1400);
      window.setTimeout(() => setShowCompletion(true), 700);
      return;
    }

    window.setTimeout(() => {
      const nextMission = missions[missionIndex + 1];
      setMissionIndex((current) => current + 1);
      setSelectedAnswer(null);
      setViewMode(nextMission.mode);
      setIsResolving(false);
      setFeedback({
        kind: 'info',
        text: 'Yeni problem: çit mi, alan mı?',
      });
      showMessage('Yeni problem geldi. İstenen büyüklüğü sahnede vurgula.', 'info');
    }, 850);
  };

  const chooseView = (mode: ViewMode) => {
    setViewMode(mode);
    setFeedback({
      kind: 'info',
      text: mode === 'fence' ? 'Dış kenarlar vurgulandı.' : 'İç kareler vurgulandı.',
    });
  };

  const restart = () => {
    const nextMissions = createPlannerMissions();
    setMissions(nextMissions);
    setMissionIndex(0);
    setSelectedAnswer(null);
    setViewMode(nextMissions[0].mode);
    setCompletedMissionIds([]);
    setShowCompletion(false);
    setIsResolving(false);
    setFeedback({
      kind: 'info',
      text: 'Çit dış kenar, alan iç kaplama.',
    });
    showMessage('Bahçe ve Halı Atölyesi yeniden başladı.', 'info');
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-[#05050A] p-5 text-white">
        <ModuleCompletedScreen
          title="Bahçe ve Halı Atölyesi Tamam"
          message="Günlük problemlerde çevreyi dış çit, alanı iç kaplama olarak ayırdın."
          scoreEarned={1400}
          onRestart={restart}
        />
      </div>
    );
  }

  return (
    <div
      data-testid={MODULE_ID}
      className="min-h-screen overflow-x-hidden bg-[#05050A] text-white selection:bg-[#00E5FF]/30"
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,229,255,0.13),transparent_30%),radial-gradient(circle_at_76%_18%,rgba(0,255,136,0.10),transparent_32%),linear-gradient(135deg,#05050A,#06131E_50%,#100816)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
      </div>

      <GameHeader
        title="Bahçe ve Halı Atölyesi"
        subtitle="MAT.5.4.4.1 · MAT.5.4.4.2"
        rightContent={
          <div className="rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/10 px-4 py-2 text-right">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">Görev</p>
            <p className="text-lg font-black text-white">
              {missionIndex + 1}/{missions.length}
            </p>
          </div>
        }
      />

      <main className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-5 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="rounded-[32px] border border-[#00E5FF]/16 bg-[#06101D]/88 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
          <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-3xl border border-[#00E5FF]/18 bg-black/24 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]">
                  Günlük problem
                </p>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white/62">
                  {mission.targetLabel}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-black">{mission.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-white/62">{mission.scenario}</p>
              <p className="mt-3 text-lg font-black leading-snug text-white">{mission.prompt}</p>
            </div>

            <div className="rounded-3xl border border-[#00FF88]/14 bg-[#00FF88]/8 p-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B8FFD8]">
                Akış
              </p>
              <div className="mt-4 flex items-center gap-2">
                {missions.map((item, index) => {
                  const done = completedMissionIds.includes(item.id);
                  const active = index === missionIndex;
                  return (
                    <span
                      key={item.id}
                      title={item.title}
                      className={`h-3 flex-1 rounded-full transition ${
                        done
                          ? 'bg-[#00FF88]'
                          : active
                            ? 'bg-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.55)]'
                            : 'bg-white/12'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="mt-4 text-sm font-black text-white">
                {missionIndex + 1}. görev
              </p>
            </div>
          </div>

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">
                Ana oyuncak
              </p>
              <h3 className="mt-1 text-xl font-black">Ölçü planı</h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-testid="planner-view-fence"
                onClick={() => chooseView('fence')}
                className={`inline-flex min-h-10 items-center gap-2 rounded-2xl border px-3 text-xs font-black transition ${
                  viewMode === 'fence'
                    ? 'border-[#00E5FF]/55 bg-[#00E5FF]/16 text-[#8DF4FF]'
                    : 'border-white/10 bg-white/[0.05] text-white/60 hover:text-white'
                }`}
              >
                <Fence className="h-4 w-4" />
                Çit
              </button>
              <button
                type="button"
                data-testid="planner-view-area"
                onClick={() => chooseView('area')}
                className={`inline-flex min-h-10 items-center gap-2 rounded-2xl border px-3 text-xs font-black transition ${
                  viewMode === 'area'
                    ? 'border-[#00FF88]/55 bg-[#00FF88]/14 text-[#B8FFD8]'
                    : 'border-white/10 bg-white/[0.05] text-white/60 hover:text-white'
                }`}
              >
                <Layers3 className="h-4 w-4" />
                Alan
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/36 p-4">
            <div className="relative mx-auto flex min-h-[500px] max-w-[820px] items-center justify-center overflow-hidden rounded-3xl border border-[#00E5FF]/16 bg-[#071827] p-5 shadow-[inset_0_0_48px_rgba(0,229,255,0.08)]">
              <motion.div
                key={`${mission.id}-${viewMode}`}
                data-testid="planner-board"
                initial={{ opacity: 0.55, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`grid gap-1 rounded-3xl border-4 p-2 transition ${
                  viewMode === 'fence'
                    ? 'border-[#00E5FF] bg-[#00E5FF]/8 shadow-[0_0_42px_rgba(0,229,255,0.22)]'
                    : 'border-[#B8FFD8]/80 bg-[#00FF88]/10 shadow-[0_0_42px_rgba(0,255,136,0.18)]'
                }`}
                style={{
                  gridTemplateColumns: `repeat(${mission.width}, ${cellSize}px)`,
                  gridAutoRows: `${cellSize}px`,
                }}
              >
                {Array.from({ length: area }, (_, index) => {
                  const row = Math.floor(index / mission.width);
                  const column = index % mission.width;
                  const borderCell = row === 0 || row === mission.height - 1 || column === 0 || column === mission.width - 1;
                  return (
                    <div
                      key={index}
                      className={`rounded-md border transition ${
                        viewMode === 'area'
                          ? 'border-[#B8FFD8]/16 bg-[#00FF88]/22'
                          : borderCell
                            ? 'border-[#8DF4FF]/45 bg-[#00E5FF]/24'
                            : 'border-white/8 bg-white/[0.035]'
                      }`}
                    />
                  );
                })}
              </motion.div>

              <div className="absolute left-5 top-5 rounded-2xl border border-[#00E5FF]/20 bg-black/42 px-4 py-3 backdrop-blur-xl">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">
                  Boyut
                </p>
                <p className="text-2xl font-black">
                  {mission.width} x {mission.height} m
                </p>
              </div>
              <div className="absolute bottom-5 right-5 max-w-[210px] rounded-2xl border border-[#00FF88]/20 bg-black/42 px-4 py-3 text-right backdrop-blur-xl">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B8FFD8]">
                  Aranan
                </p>
                <p className="text-lg font-black leading-tight text-white">{mission.targetLabel}</p>
              </div>
              <div className="absolute bottom-5 left-5 max-w-[260px] rounded-2xl border border-white/10 bg-black/42 px-4 py-3 backdrop-blur-xl">
                <p className="text-sm font-black leading-snug text-white/78">
                  {viewMode === 'fence'
                    ? 'Çevre: dış kenarların tamamı.'
                    : 'Alan: içteki kaplanan kareler.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className={`rounded-3xl border p-4 shadow-[0_18px_60px_rgba(0,0,0,0.32)] ${
            feedback.kind === 'success'
              ? 'border-[#00FF88]/28 bg-[#062317]/82'
              : feedback.kind === 'error'
                ? 'border-[#FF3366]/30 bg-[#2A0D18]/82'
                : 'border-[#00E5FF]/18 bg-[#07101D]/82'
          }`}>
            <div className="flex items-start gap-3">
              {feedback.kind === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#00FF88]" />
              ) : feedback.kind === 'error' ? (
                <XCircle className="mt-0.5 h-5 w-5 text-[#FF6688]" />
              ) : (
                <Ruler className="mt-0.5 h-5 w-5 text-[#8DF4FF]" />
              )}
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/52">
                  Durum
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-white">{feedback.text}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-black/34 p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B388FF]">
              Cevaba dokun
            </p>
            <div className="mt-4 grid gap-3">
              {mission.options.map((answer) => {
                const selected = answer === selectedAnswer;
                return (
                  <motion.button
                    key={answer}
                    type="button"
                    data-testid={`planner-answer-${missionIndex}-${answer}`}
                    disabled={isResolving}
                    onClick={() => chooseAnswer(answer)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selected
                        ? 'border-[#00E5FF]/55 bg-[#00E5FF]/14 shadow-[0_0_24px_rgba(0,229,255,0.18)]'
                        : 'border-white/12 bg-white/[0.05] hover:border-[#00E5FF]/36 hover:bg-[#00E5FF]/10'
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    <span className="text-2xl font-black text-white">{answer}</span>
                    <span className="ml-2 text-sm font-black text-[#8DF4FF]">{mission.unit}</span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 text-xs font-black text-white/72 transition hover:border-white/24 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Sıfırla
            </button>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 text-xs font-black text-white/72 transition hover:border-white/24 hover:text-white"
            >
              <Home className="h-4 w-4" />
              Merkez
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
