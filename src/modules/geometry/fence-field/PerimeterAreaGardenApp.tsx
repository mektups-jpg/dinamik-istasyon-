import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Fence, Home, LockKeyhole, RotateCcw, XCircle } from 'lucide-react';
import { GameHeader } from '../../../components/ui/GameHeader';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { areaOf, createGardenMissions, GARDEN_ATOMS, perimeterOf } from './perimeterAreaGardenModel';

const MODULE_ID = 'fence-field';

type Feedback = {
  kind: 'info' | 'success' | 'error';
  text: string;
};

export default function PerimeterAreaGardenApp() {
  const { showMessage } = useAstroBotStore();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();

  const [missions, setMissions] = useState(() => createGardenMissions());
  const [missionIndex, setMissionIndex] = useState(0);
  const mission = missions[missionIndex];
  const [selectedId, setSelectedId] = useState(mission.options[0].id);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    kind: 'info',
    text: 'Bir bahçe planına dokun. Alan ve çevre değerleri canlı değişir.',
  });

  const selectedOption = useMemo(
    () => mission.options.find((option) => option.id === selectedId) ?? mission.options[0],
    [mission.options, selectedId]
  );
  const selectedArea = areaOf(selectedOption);
  const selectedPerimeter = perimeterOf(selectedOption);
  const cellSize = Math.min(54, Math.max(26, Math.floor(340 / Math.max(selectedOption.width, selectedOption.height))));

  useEffect(() => {
    showMessage('Bahçe planını seç. Aynı çitle alanın, aynı alanla çevrenin nasıl değiştiğini göreceğiz.', 'info');
  }, [showMessage]);

  const chooseOption = (optionId: string) => {
    const option = mission.options.find((item) => item.id === optionId);
    if (!option) return;

    setSelectedId(option.id);
    setFeedback({
      kind: 'info',
      text: `${option.width} x ${option.height} seçildi. Alan ${areaOf(option)}, çevre ${perimeterOf(option)}.`,
    });
  };

  const lockSelection = () => {
    if (selectedId !== mission.correctId) {
      setFeedback({ kind: 'error', text: mission.error });
      showMessage(mission.error, 'error');
      return;
    }

    setFeedback({ kind: 'success', text: mission.success });
    setCompletedMissionIds((current) => (current.includes(mission.id) ? current : [...current, mission.id]));
    unlockAtom(mission.atomId);
    showMessage(mission.success, 'success');

    if (missionIndex === missions.length - 1) {
      GARDEN_ATOMS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(1300);
      window.setTimeout(() => setShowCompletion(true), 700);
      return;
    }

    window.setTimeout(() => {
      const nextMission = missions[missionIndex + 1];
      setMissionIndex((current) => current + 1);
      setSelectedId(nextMission.options[0].id);
      setFeedback({
        kind: 'info',
        text: 'Yeni bahçe görevi açıldı. Önce planları karşılaştır.',
      });
      showMessage('Yeni görev geldi. Alan ve çevre değerlerini karşılaştır.', 'info');
    }, 850);
  };

  const restart = () => {
    const nextMissions = createGardenMissions();
    setMissions(nextMissions);
    setMissionIndex(0);
    setSelectedId(nextMissions[0].options[0].id);
    setCompletedMissionIds([]);
    setShowCompletion(false);
    setFeedback({
      kind: 'info',
      text: 'Bir bahçe planına dokun. Alan ve çevre değerleri canlı değişir.',
    });
    showMessage('Çevre-Alan Bahçesi yeniden başladı.', 'info');
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-[#05050A] p-5 text-white">
        <ModuleCompletedScreen
          title="Çevre-Alan Bahçesi Tamam"
          message="Aynı çevrenin farklı alanlar, aynı alanın farklı çevreler oluşturabildiğini kanıtladın."
          scoreEarned={1300}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,229,255,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(0,255,136,0.10),transparent_32%),linear-gradient(135deg,#05050A,#06131E_50%,#100816)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
      </div>

      <GameHeader
        title="Çevre-Alan Bahçesi"
        subtitle="MAT.5.4.3.1 · MAT.5.4.3.2"
        rightContent={
          <div className="rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/10 px-4 py-2 text-right">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">Görev</p>
            <p className="text-lg font-black text-white">
              {missionIndex + 1}/{missions.length}
            </p>
          </div>
        }
      />

      <main className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-5 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-[32px] border border-[#00E5FF]/16 bg-[#06101D]/88 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
          <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-3xl border border-[#00E5FF]/18 bg-black/24 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]">
                  Günlük hedef
                </p>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white/62">
                  {mission.targetLabel}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-black">{mission.title}</h2>
              <p className="mt-2 text-base font-black leading-snug text-white">{mission.prompt}</p>
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

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">
                Ana oyuncak
              </p>
              <h3 className="mt-1 text-xl font-black">Dikdörtgen bahçe planı</h3>
            </div>
            <div className="rounded-2xl border border-[#00FF88]/20 bg-[#00FF88]/8 px-4 py-2 text-sm font-black text-[#B8FFD8]">
              {selectedOption.width} x {selectedOption.height}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/36 p-4">
            <div className="relative mx-auto flex min-h-[420px] max-w-[720px] items-center justify-center overflow-hidden rounded-3xl border border-[#00E5FF]/16 bg-[#071827] p-5 shadow-[inset_0_0_48px_rgba(0,229,255,0.08)]">
              <motion.div
                key={selectedOption.id}
                data-testid="garden-rectangle"
                initial={{ opacity: 0.55, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid gap-1 rounded-3xl border-4 border-[#B8FFD8]/80 bg-[#00E5FF]/10 p-2 shadow-[0_0_40px_rgba(0,229,255,0.20)]"
                style={{
                  gridTemplateColumns: `repeat(${selectedOption.width}, ${cellSize}px)`,
                  gridAutoRows: `${cellSize}px`,
                }}
              >
                {Array.from({ length: selectedArea }, (_, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-white/10 bg-[#00E5FF]/16"
                  />
                ))}
              </motion.div>
              <div className="absolute left-5 top-5 rounded-2xl border border-[#00E5FF]/20 bg-black/42 px-4 py-3 backdrop-blur-xl">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">
                  Alan
                </p>
                <p className="text-2xl font-black">{selectedArea}</p>
              </div>
              <div className="absolute bottom-5 right-5 rounded-2xl border border-[#00FF88]/20 bg-black/42 px-4 py-3 text-right backdrop-blur-xl">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B8FFD8]">
                  Çevre
                </p>
                <p className="text-2xl font-black">{selectedPerimeter}</p>
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
                <Fence className="mt-0.5 h-5 w-5 text-[#8DF4FF]" />
              )}
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/52">
                  Canlı durum
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-white">{feedback.text}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-black/34 p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B388FF]">
              Planı seç
            </p>
            <div className="mt-4 grid gap-3">
              {mission.options.map((option) => {
                const selected = option.id === selectedId;
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    data-testid={`garden-option-${missionIndex}-${option.id}`}
                    onClick={() => chooseOption(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selected
                        ? 'border-[#00E5FF]/55 bg-[#00E5FF]/14 shadow-[0_0_24px_rgba(0,229,255,0.18)]'
                        : 'border-white/12 bg-white/[0.05] hover:border-[#00E5FF]/36 hover:bg-[#00E5FF]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">{option.label}</p>
                      <p className="font-mono text-sm font-black text-[#8DF4FF]">
                        {option.width} x {option.height}
                      </p>
                    </div>
                    <p className="mt-2 text-xs font-bold text-white/56">
                      Alan {areaOf(option)} · Çevre {perimeterOf(option)}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <motion.button
            type="button"
            data-testid="garden-lock"
            onClick={lockSelection}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[#00FF88]/26 bg-[#00FF88]/14 px-4 py-3 text-sm font-black text-[#B8FFD8] shadow-[0_0_24px_rgba(0,255,136,0.12)] transition hover:bg-[#00FF88]/20"
          >
            <LockKeyhole className="h-4 w-4" />
            Bahçeyi kilitle
          </motion.button>

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
