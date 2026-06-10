import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import {
  blocks,
  getSlotTestId,
  initialFeedback,
  slots,
  type BlockId,
  type Feedback,
  type FeedbackTone,
  type SlotId,
  type TargetSlot,
} from './identityBlocksData';

export default function IdentityBlocksSimulation() {
  const slotRefs = useRef<Record<SlotId, HTMLButtonElement | null>>({
    'top-left': null,
    'top-right': null,
    'bottom-left': null,
    'bottom-right': null,
  });
  const [placed, setPlaced] = useState<Partial<Record<SlotId, BlockId>>>({});
  const [selectedBlock, setSelectedBlock] = useState<BlockId | null>('a2');
  const [feedback, setFeedback] = useState<Feedback>(initialFeedback);
  const [lastPulse, setLastPulse] = useState<SlotId | null>(null);

  const placedBlockIds = useMemo(() => new Set(Object.values(placed)), [placed]);
  const placedCount = Object.values(placed).length;
  const isCompleted = placedCount === blocks.length;
  const completionPercent = Math.round((placedCount / blocks.length) * 100);

  const blockById = (blockId: BlockId) => blocks.find((block) => block.id === blockId);

  const selectNextOpenBlock = (nextPlaced: Partial<Record<SlotId, BlockId>>, currentBlockId: BlockId) => {
    const nextPlacedIds = new Set(Object.values(nextPlaced));
    const nextBlock = blocks.find((block) => block.id !== currentBlockId && !nextPlacedIds.has(block.id));
    setSelectedBlock(nextBlock?.id ?? null);
  };

  const placeBlock = (slot: TargetSlot, blockId: BlockId) => {
    const block = blockById(blockId);
    if (!block) {
      return;
    }

    if (placed[slot.id]) {
      setFeedback({
        tone: 'info',
        title: 'Bu yuva tamam',
        body: `${slot.hint} zaten dolu. Açık kalan ölçü çiftine bakıp başka bir yuva seç.`,
      });
      return;
    }

    if (slot.accepts !== blockId) {
      setLastPulse(slot.id);
      setFeedback({
        tone: 'error',
        title: 'Neden uymadı?',
        body: slot.wrongReason,
      });
      return;
    }

    const nextPlaced = { ...placed, [slot.id]: blockId };
    const nextCount = Object.values(nextPlaced).length;
    setPlaced(nextPlaced);
    setLastPulse(slot.id);
    selectNextOpenBlock(nextPlaced, blockId);

    if (nextCount === blocks.length) {
      setFeedback({
        tone: 'success',
        title: 'Alan tamamlandı',
        body: 'Dağılım zinciri kapandı: a(a + b) + b(a + b) alanları birleşince a² + ab + ab + b² elde edilir.',
      });
      return;
    }

    setFeedback({
      tone: 'success',
      title: `${block.label} yerine oturdu`,
      body: `${slot.title} alanı tamamlandı. Şimdi kalan ölçü çiftini karşılayan parçayı seç.`,
    });
  };

  const handleSlotClick = (slot: TargetSlot) => {
    if (!selectedBlock) {
      setFeedback({
        tone: 'info',
        title: 'Önce parça seç',
        body: 'Parça bankasından açıkta kalan bir blok seç, sonra ölçüsüne uyan yuvaya dokun.',
      });
      return;
    }

    placeBlock(slot, selectedBlock);
  };

  const findSlotAtPoint = (x: number, y: number) => {
    return slots.find((slot) => {
      const element = slotRefs.current[slot.id];
      if (!element) {
        return false;
      }

      const rect = element.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
  };

  const handleDragEnd = (blockId: BlockId, info: PanInfo) => {
    if (placedBlockIds.has(blockId)) {
      return;
    }

    const slot = findSlotAtPoint(info.point.x, info.point.y);
    if (!slot) {
      const block = blockById(blockId);
      setSelectedBlock(blockId);
      setFeedback({
        tone: 'info',
        title: 'Hedefe biraz daha yaklaştır',
        body: `${block?.label ?? 'Bu parça'} açık bir yuvanın içine bırakılınca alan kontrolü yapılır.`,
      });
      return;
    }

    placeBlock(slot, blockId);
  };

  const resetSimulation = () => {
    setPlaced({});
    setSelectedBlock('a2');
    setFeedback(initialFeedback);
    setLastPulse(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Home') {
      resetSimulation();
    }
  };

  const feedbackClasses = {
    info: 'border-cyan-300/35 bg-cyan-300/10 text-cyan-50',
    success: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-50',
    error: 'border-rose-300/45 bg-rose-400/15 text-rose-50',
  } satisfies Record<FeedbackTone, string>;

  return (
    <main
      data-testid="identity-scene"
      tabIndex={0}
      aria-keyshortcuts="Home"
      onKeyDown={handleKeyDown}
      className="h-screen min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_28%),linear-gradient(135deg,#08111f_0%,#111827_48%,#24122f_100%)] p-4 text-white sm:p-5 lg:p-6"
    >
      <section className="mx-auto flex h-full max-w-7xl flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">MAT.7.2.1.1 · Dağılma özelliği</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Dağılım Alan Fabrikası</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="min-w-24 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-2 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tamamlanma</p>
              <p className="text-2xl font-black text-cyan-200">%{completionPercent}</p>
            </div>
            <button
              type="button"
              data-testid="identity-reset"
              onClick={resetSimulation}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:border-cyan-200/50 hover:bg-cyan-200/15 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              Sıfırla
            </button>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-150px)] gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)]">
          <section className="relative min-h-[640px] overflow-hidden rounded-[30px] border border-cyan-200/15 bg-slate-950/55 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-5">
            <div className="absolute inset-x-8 top-5 h-28 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="relative flex min-h-[600px] flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cyan-100">Ana oyuncak: (a + b) kenarlı büyük alan</p>
                  <p className="text-xs text-slate-300">Ölçüler eşleşirse parça yuvaya kilitlenir.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white">
                  a(a + b) + b(a + b)
                </div>
              </div>

              <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
                <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-white/10 bg-slate-900/45 p-4">
                  <div className="relative w-full max-w-[620px]">
                    <div className="absolute -left-2 top-0 hidden h-full -translate-x-full flex-col justify-between py-[12%] text-sm font-black text-cyan-100 sm:flex">
                      <span>a</span>
                      <span>b</span>
                    </div>
                    <div className="absolute -top-8 left-0 hidden w-full grid-cols-[3fr_2fr] text-center text-sm font-black text-cyan-100 sm:grid">
                      <span>a</span>
                      <span>b</span>
                    </div>

                    <div
                      className="grid aspect-square w-full gap-2 rounded-[28px] border border-cyan-200/25 bg-cyan-100/5 p-2 shadow-inner shadow-cyan-950/80"
                      style={{ gridTemplateColumns: '3fr 2fr', gridTemplateRows: '3fr 2fr' }}
                    >
                      {slots.map((slot) => {
                        const blockId = placed[slot.id];
                        const block = blockId ? blockById(blockId) : undefined;
                        const isTargeted = selectedBlock === slot.accepts && !blockId;
                        const isPulsing = lastPulse === slot.id;

                        return (
                          <motion.button
                            key={slot.id}
                            ref={(node) => {
                              slotRefs.current[slot.id] = node;
                            }}
                            type="button"
                            data-testid={getSlotTestId(slot.id)}
                            onClick={() => handleSlotClick(slot)}
                            animate={isPulsing ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className={`${slot.className} relative flex min-h-28 flex-col items-center justify-center overflow-hidden rounded-[22px] border text-center transition focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
                              block
                                ? 'border-white/20 bg-white/10'
                                : isTargeted
                                  ? 'border-cyan-200/70 bg-cyan-300/15 shadow-lg shadow-cyan-400/20'
                                  : 'border-dashed border-white/20 bg-slate-950/40 hover:border-white/45 hover:bg-white/10'
                            }`}
                            aria-label={`${slot.hint}: ${slot.title}`}
                          >
                            {block ? (
                              <motion.div
                                initial={{ scale: 0.72, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${block.colorClass}`}
                              >
                                <span className="text-4xl font-black sm:text-5xl">{block.label}</span>
                                <span className="mt-1 rounded-full bg-slate-950/20 px-3 py-1 text-xs font-black">{block.sizeLabel}</span>
                              </motion.div>
                            ) : (
                              <>
                                <span className="text-3xl font-black text-white/35 sm:text-5xl">{slot.area}</span>
                                <span className="mt-2 px-2 text-xs font-semibold text-slate-300">{slot.title}</span>
                              </>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <aside className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-slate-950/55 p-3">
                  <p className="px-2 text-sm font-bold text-cyan-100">Parça bankası</p>
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
                    {blocks.map((block) => {
                      const isPlaced = placedBlockIds.has(block.id);
                      const isSelected = selectedBlock === block.id;

                      return (
                        <motion.button
                          key={block.id}
                          type="button"
                          data-testid={`identity-block-${block.id}`}
                          drag={!isPlaced}
                          dragMomentum={false}
                          animate={{ x: 0, y: 0, scale: isPlaced ? 0.96 : 1 }}
                          onDragEnd={(_, info) => handleDragEnd(block.id, info)}
                          whileHover={isPlaced ? undefined : { y: -3 }}
                          whileTap={isPlaced ? undefined : { scale: 0.97 }}
                          onClick={() => {
                            if (isPlaced) {
                              return;
                            }

                            setSelectedBlock(block.id);
                            setFeedback({
                              tone: 'info',
                              title: `${block.label} seçildi`,
                              body: `${block.sizeLabel} ölçüsünü taşıyan yuvayı bul. Uygun yuva parlayacak.`,
                            });
                          }}
                          disabled={isPlaced}
                          className={`relative rounded-[22px] border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
                            isSelected
                              ? 'border-cyan-200 bg-cyan-200/15 shadow-lg shadow-cyan-400/20'
                              : 'border-white/10 bg-white/[0.06] hover:border-white/25'
                          } ${isPlaced ? 'cursor-default opacity-45' : 'cursor-grab active:cursor-grabbing'}`}
                          aria-pressed={isSelected}
                        >
                          <div
                            className={`mx-auto flex w-full max-w-[150px] flex-col items-center justify-center rounded-[18px] bg-gradient-to-br ${block.colorClass} ${block.previewClass} shadow-xl ${block.glowClass}`}
                          >
                            <span className="text-3xl font-black">{block.label}</span>
                            <span className="mt-1 rounded-full bg-slate-950/20 px-2 py-1 text-[11px] font-black">{block.sizeLabel}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <aside className="flex min-h-[520px] flex-col gap-4">
            <section
              data-testid="identity-feedback"
              className={`rounded-[28px] border p-4 shadow-2xl backdrop-blur-xl ${feedbackClasses[feedback.tone]}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-black">
                  A
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">AstroBot</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${feedback.tone}-${feedback.title}-${feedback.body}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="mt-1 text-xl font-black leading-tight">{feedback.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed opacity-90">{feedback.body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Dağılım zinciri</p>
              <div className="mt-4 space-y-3 text-sm font-bold text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">(a + b)(a + b)</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">a(a + b) + b(a + b)</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">a² + ab + ab + b²</div>
                <motion.div
                  animate={isCompleted ? { opacity: 1, scale: 1 } : { opacity: 0.45, scale: 0.98 }}
                  className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-emerald-100"
                >
                  a² + 2ab + b²
                </motion.div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Kazanım odağı</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Rasyonel sayılarla cebirsel ifadelerin çarpımında genişletme kuralını alan modeliyle doğrula.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
