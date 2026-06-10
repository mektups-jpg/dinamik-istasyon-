import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Grid3X3, Home, RotateCcw, Sparkles, Square, XCircle } from 'lucide-react';
import { GameHeader } from '../../../components/ui/GameHeader';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { ModuleCompletedScreen } from '../../../components/ui/ModuleCompletedScreen';
import { createStageSequence, makeCellId } from './unitSquareAreaModel';

const MODULE_ID = 'unit-square-area-factory';
const ATOM_ID = 'MAT.5.4.2.1';

export default function UnitSquareAreaFactoryApp() {
  const { showMessage } = useAstroBotStore();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();

  const [stages, setStages] = useState(() => createStageSequence());
  const [stageIndex, setStageIndex] = useState(0);
  const [filledCells, setFilledCells] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ kind: 'info' | 'success' | 'error'; text: string }>({
    kind: 'info',
    text: 'Her küçük kare 1 birim karedir. Zemini kaplayınca alanı seç.',
  });
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const stage = stages[stageIndex];
  const expectedArea = stage.width * stage.height;
  const totalCells = expectedArea;
  const isCovered = filledCells.length === totalCells;
  const rows = useMemo(() => Array.from({ length: stage.height }, (_, row) => row), [stage.height]);
  const columns = useMemo(() => Array.from({ length: stage.width }, (_, column) => column), [stage.width]);
  const progressPercent = Math.round((filledCells.length / totalCells) * 100);

  useEffect(() => {
    showMessage('Birim kareleri yerleştir. Tüm zemin kaplanınca alanın neden uzun x kısa olduğunu göreceğiz.', 'info');
  }, [showMessage]);

  const resetStage = () => {
    setFilledCells([]);
    setFeedback({
      kind: 'info',
      text: `${stage.width} sütun ve ${stage.height} satırı birim karelerle kapla.`,
    });
    showMessage('Zemin temizlendi. Birim kareleri tekrar yerleştirelim.', 'info');
  };

  const toggleCell = (cellId: string) => {
    setFilledCells((current) => {
      const next = current.includes(cellId) ? current.filter((id) => id !== cellId) : [...current, cellId];
      const nextCount = next.length;
      if (nextCount === totalCells) {
        setFeedback({
          kind: 'success',
          text: `Tüm zemin kaplandı. Şimdi alanı seç: ${stage.width} x ${stage.height} kaç eder?`,
        });
        showMessage('Harika, tüm birim kareler yerleşti. Şimdi toplam kare sayısını seç.', 'success');
      } else {
        setFeedback({
          kind: 'info',
          text: `${nextCount}/${totalCells} birim kare yerleşti. Alanı görmek için tüm zemini kapla.`,
        });
      }
      return next;
    });
  };

  const completeCurrentStage = () => {
    setCompletedStages((current) => (current.includes(stage.id) ? current : [...current, stage.id]));
    if (stageIndex === stages.length - 1) {
      showMessage('Alan fabrikası tamamlandı. Dikdörtgen alanı uzun x kısa ile bulunur.', 'success');
      unlockAtom(ATOM_ID);
      unlockModule(MODULE_ID);
      addScore(1200);
      window.setTimeout(() => setShowCompletion(true), 700);
      return;
    }

    window.setTimeout(() => {
      const nextStage = stages[stageIndex + 1];
      setStageIndex((current) => current + 1);
      setFilledCells([]);
      setFeedback({
        kind: 'info',
        text: `${nextStage.width} sütun ve ${nextStage.height} satırı kapla.`,
      });
      showMessage('Sıradaki zemin açıldı. Yine önce birim karelerle kaplıyoruz.', 'info');
    }, 850);
  };

  const chooseArea = (choice: number) => {
    if (!isCovered) {
      setFeedback({
        kind: 'error',
        text: 'Önce bütün zemini birim karelerle kapla. Alan, kaplanan karelerin toplamıdır.',
      });
      showMessage('Önce tüm zemini kaplayalım. Boş kare kalırsa alanı eksik sayarız.', 'error');
      return;
    }

    if (choice !== expectedArea) {
      setFeedback({
        kind: 'error',
        text: `${choice} olmadı. ${stage.width} satır/sütun yapısını düşün: ${stage.width} x ${stage.height} = ${expectedArea}.`,
      });
      showMessage(`Yaklaştın ama bu zeminde ${stage.width} x ${stage.height} = ${expectedArea} birim kare var.`, 'error');
      return;
    }

    setFeedback({
      kind: 'success',
      text: `Doğru: ${stage.width} x ${stage.height} = ${expectedArea} birim kare.`,
    });
    showMessage('Doğru alan seçildi. Her satırdaki kare sayısı satır sayısıyla birleşti.', 'success');
    completeCurrentStage();
  };

  const restart = () => {
    setStages(createStageSequence());
    setStageIndex(0);
    setFilledCells([]);
    setCompletedStages([]);
    setShowCompletion(false);
    setFeedback({
      kind: 'info',
      text: 'Her küçük kare 1 birim karedir. Zemini kaplayınca alanı seç.',
    });
    showMessage('Alan fabrikası yeniden başladı. İlk zemini kaplayalım.', 'info');
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-[#05050A] p-5 text-white">
        <ModuleCompletedScreen
          title="Alan Fabrikası Tamam"
          message="Dikdörtgenin alanını birim karelerden sayarak ve uzun x kısa kuralıyla doğruladın."
          scoreEarned={1200}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,229,255,0.14),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(179,136,255,0.12),transparent_30%),linear-gradient(135deg,#05050A,#06131E_48%,#130A1E)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />
      </div>

      <GameHeader
        title="Birim Kare Alan Fabrikası"
        subtitle="MAT.5.4.2.1"
        rightContent={
          <div className="rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/10 px-4 py-2 text-right">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">Aşama</p>
            <p className="text-lg font-black text-white">
              {stageIndex + 1}/{stages.length}
            </p>
          </div>
        }
      />

      <main className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
          <section className="rounded-3xl border border-[#00E5FF]/18 bg-[#07101D]/82 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]">
              Görev
            </p>
            <h2 className="mt-2 text-2xl font-black">{stage.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/68">{stage.prompt}</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/24 p-3">
              <p className="text-xs font-bold text-white/52">Kural cümlesi</p>
              <p className="mt-1 text-sm font-black text-white">
                Alan = satırdaki kare sayısı x satır sayısı
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-black/34 p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/48">
                Doluluk
              </p>
              <p className="font-mono text-sm font-black text-[#00E5FF]">
                {filledCells.length}/{totalCells}
              </p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#B388FF]"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
            <button
              type="button"
              onClick={resetStage}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm font-black text-white transition hover:border-white/28 hover:bg-white/[0.10]"
            >
              <RotateCcw className="h-4 w-4" />
              Zemini temizle
            </button>
          </section>
        </aside>

        <section className="rounded-[32px] border border-[#00E5FF]/16 bg-[#06101D]/88 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8DF4FF]">
                Ana oyuncak
              </p>
              <h3 className="mt-1 text-xl font-black">1x1 birim kare zemini</h3>
            </div>
            <div className="rounded-2xl border border-[#00FF88]/20 bg-[#00FF88]/8 px-4 py-2 text-sm font-black text-[#B8FFD8]">
              {stage.width} sütun x {stage.height} satır
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/36 p-4">
            <div className="mx-auto max-w-[720px]">
              <div
                className="grid gap-2 rounded-3xl border border-[#00E5FF]/20 bg-[#071827] p-3 shadow-[inset_0_0_42px_rgba(0,229,255,0.08)]"
                style={{ gridTemplateColumns: `repeat(${stage.width}, minmax(0, 1fr))` }}
              >
                {rows.map((row) =>
                  columns.map((column) => {
                    const cellId = makeCellId(row, column);
                    const filled = filledCells.includes(cellId);
                    return (
                      <motion.button
                        key={cellId}
                        type="button"
                        data-testid={`unit-square-cell-${stageIndex}-${row}-${column}`}
                        aria-label={`${row + 1}. satır ${column + 1}. sütun birim kare`}
                        onClick={() => toggleCell(cellId)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        className={`aspect-square min-h-[54px] rounded-xl border text-sm font-black transition ${
                          filled
                            ? 'border-[#00E5FF]/60 bg-[#00E5FF]/24 text-white shadow-[0_0_22px_rgba(0,229,255,0.26)]'
                            : 'border-white/12 bg-white/[0.035] text-white/28 hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {filled ? (
                            <motion.span
                              key="filled"
                              initial={{ opacity: 0, scale: 0.4 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.4 }}
                              className="inline-flex h-full w-full items-center justify-center"
                            >
                              <Square className="h-5 w-5 fill-[#00E5FF]/55 text-[#8DF4FF]" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              +
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })
                )}
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
                <Grid3X3 className="mt-0.5 h-5 w-5 text-[#8DF4FF]" />
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
              Alanı seç
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/62">
              Tüm kareler dolunca toplam birim kare sayısını seç.
            </p>
            <div className="mt-4 grid gap-3">
              {stage.choices.map((choice) => (
                <motion.button
                  key={choice}
                  type="button"
                  data-testid={`area-choice-${choice}`}
                  onClick={() => chooseArea(choice)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="min-h-14 rounded-2xl border border-white/12 bg-white/[0.05] px-4 text-xl font-black text-white transition hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10"
                >
                  {choice} birim kare
                </motion.button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#00FF88]/16 bg-[#00FF88]/8 p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#B8FFD8]">
              Kanıt zinciri
            </p>
            <div className="mt-3 space-y-2">
              {stages.map((item, index) => {
                const done = completedStages.includes(item.id);
                const active = index === stageIndex;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs font-bold ${
                      done
                        ? 'border-[#00FF88]/26 bg-[#00FF88]/12 text-[#B8FFD8]'
                        : active
                          ? 'border-[#00E5FF]/26 bg-[#00E5FF]/10 text-[#8DF4FF]'
                          : 'border-white/10 bg-white/[0.03] text-white/38'
                    }`}
                  >
                    <span>{item.width} x {item.height}</span>
                    <span>{done ? 'Kilitledin' : active ? 'Şimdi' : 'Bekliyor'}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <Link
            to="/"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black text-white/72 transition hover:border-white/24 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Ana merkeze dön
          </Link>
        </aside>
      </main>

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-20 hidden -translate-x-1/2 rounded-full border border-[#00E5FF]/22 bg-black/60 px-5 py-3 text-sm font-black text-white/78 shadow-[0_0_32px_rgba(0,229,255,0.16)] backdrop-blur-xl md:flex md:items-center md:gap-2">
        <Sparkles className="h-4 w-4 text-[#00E5FF]" />
        Birim kare sayısı alanı verir.
      </div>
    </div>
  );
}
