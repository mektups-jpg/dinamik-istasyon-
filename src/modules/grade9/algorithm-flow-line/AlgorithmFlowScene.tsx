import type { CSSProperties, KeyboardEvent } from 'react';
import { ArrowRight, TestTube2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  buildMatches,
  completedSlotCount,
  getFlowBlock,
  hasBlock,
} from './algorithmFlowModel';
import type { FlowBlockId, FlowBuild, FlowMission } from './types';

interface AlgorithmFlowSceneProps {
  mission: FlowMission;
  build: FlowBuild;
  locked: boolean;
  orderWarning: boolean;
  onPlaceBlock: (blockId: FlowBlockId) => void;
  onRemoveSlot: (index: number) => void;
  onAutoAlign: () => void;
  onCheck: () => void;
}

const slotTestIds = [
  'algorithm-flow-line-slot-0',
  'algorithm-flow-line-slot-1',
  'algorithm-flow-line-slot-2',
  'algorithm-flow-line-slot-3',
] as const;

const blockToneClass: Record<string, string> = {
  cyan: 'border-cyan-300/30 bg-cyan-300/[0.08] text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.10)]',
  green: 'border-emerald-300/30 bg-emerald-300/[0.08] text-emerald-100 shadow-[0_0_26px_rgba(16,185,129,0.10)]',
  purple: 'border-violet-300/30 bg-violet-300/[0.08] text-violet-100 shadow-[0_0_26px_rgba(139,92,246,0.10)]',
  amber: 'border-amber-300/35 bg-amber-300/[0.08] text-amber-100 shadow-[0_0_26px_rgba(251,191,36,0.10)]',
  pink: 'border-rose-300/28 bg-rose-300/[0.07] text-rose-100',
};

export function AlgorithmFlowScene({
  mission,
  build,
  locked,
  orderWarning,
  onPlaceBlock,
  onRemoveSlot,
  onAutoAlign,
  onCheck,
}: AlgorithmFlowSceneProps) {
  const matched = buildMatches(build, mission);
  const slotCount = completedSlotCount(build);
  const isFull = slotCount === build.slots.length;
  const showStageAction = !orderWarning && (matched || isFull || locked);
  const stageActionLabel = locked ? 'Sıradaki Akışa Geç' : matched ? 'Sonucu Kontrol Et' : 'Sırayı Kontrol Et';
  const firstWrongIndex = orderWarning
    ? build.slots.findIndex((slot, index) => Boolean(slot) && slot !== mission.target[index])
    : -1;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Home') return;
    event.preventDefault();
    onAutoAlign();
  };

  return (
    <section
      data-testid="algorithm-flow-line-scene"
      tabIndex={0}
      aria-keyshortcuts="Home"
      onKeyDown={handleKeyDown}
      className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-cyan-300/18 bg-[#030812]/88 p-3 shadow-[0_34px_90px_rgba(0,0,0,0.48)] outline-none focus:ring-2 focus:ring-cyan-300/60 sm:p-4"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-10 top-20 h-48 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35" />
      </div>

      <div className="relative z-10 space-y-3">
        <div className="rounded-3xl border border-amber-300/24 bg-[linear-gradient(145deg,rgba(251,191,36,0.13),rgba(34,211,238,0.045)_48%,rgba(0,0,0,0.28))] px-4 py-3 shadow-[0_0_24px_rgba(251,191,36,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-[260px] flex-1">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-100/72">{mission.title}</p>
              <p className="mt-1 text-sm font-black leading-relaxed text-white/82">{mission.story}</p>
            </div>
            <div className="rounded-2xl border border-amber-200/30 bg-amber-300/[0.11] px-4 py-3 text-right shadow-[inset_0_0_18px_rgba(251,191,36,0.06)]">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-amber-100/75">soru</p>
              <p className="mt-1 text-lg font-black leading-snug text-white">{mission.question}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border p-3 transition sm:p-4 ${orderWarning ? 'border-rose-300/30 bg-rose-300/[0.05]' : 'border-white/10 bg-white/[0.03]'}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-white">Akışı kur</h3>
              <p className={`mt-1 text-xs font-black leading-snug ${orderWarning ? 'text-rose-100' : 'text-white/48'}`}>
                {orderWarning ? 'İlk hatalı kutuya dokun, oradan devam et.' : 'Alttaki blokları soldan sağa seç.'}
              </p>
            </div>
            <div className={`rounded-2xl border px-3 py-2 text-right ${locked ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : orderWarning ? 'border-rose-300/35 bg-rose-300/10 text-rose-100' : matched ? 'border-amber-300/35 bg-amber-300/10 text-amber-100' : 'border-cyan-300/24 bg-cyan-300/8 text-cyan-100'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-70">durum</p>
              <p className="text-sm font-black">{locked ? 'sonuç açık' : orderWarning ? 'sıra karıştı' : matched ? 'kontrol hazır' : `${slotCount}/${build.slots.length} blok`}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[repeat(var(--slot-count),minmax(0,1fr))] gap-3" style={{ '--slot-count': build.slots.length } as CSSProperties}>
            {build.slots.map((slot, index) => {
              const block = slot ? getFlowBlock(slot, mission) : null;
              const filled = Boolean(block);
              const wrongSlot = orderWarning && filled && slot !== mission.target[index];
              return (
                <div key={`slot-${index}`} className="relative">
                  {index > 0 && (
                    <div className={`absolute right-[calc(100%+0.25rem)] top-1/2 h-1 w-4 -translate-y-1/2 rounded-full ${filled || build.slots[index - 1] ? 'bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.65)]' : 'bg-white/12'}`} />
                  )}
                  <motion.button
                    type="button"
                    data-testid={slotTestIds[index]}
                    whileTap={filled && !locked ? { scale: 0.97 } : undefined}
                    onClick={() => {
                      if (locked || !filled) return;
                      onRemoveSlot(firstWrongIndex >= 0 ? firstWrongIndex : index);
                    }}
                    className={`relative flex min-h-[104px] w-full flex-col items-center justify-center rounded-3xl border p-3 text-center transition ${
                      wrongSlot
                        ? 'border-rose-300/55 bg-rose-300/[0.10] text-rose-50 shadow-[0_0_28px_rgba(244,63,94,0.18)]'
                        : block
                          ? blockToneClass[block.tone]
                          : 'border-dashed border-white/16 bg-black/28 text-white/38'
                    }`}
                  >
                    {wrongSlot && (
                      <span className="absolute right-2 top-2 rounded-full border border-rose-200/35 bg-rose-300/18 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-rose-50">
                        düzelt
                      </span>
                    )}
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] opacity-65">{index + 1}. adım</span>
                    <span className="mt-2 text-lg font-black">{block?.shortLabel ?? 'blok seç'}</span>
                    <span className="mt-1 text-xs font-bold leading-snug text-white/52">{block?.label ?? 'Alttan seç.'}</span>
                  </motion.button>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 rounded-2xl border p-3 ${orderWarning ? 'border-rose-300/24 bg-rose-300/[0.06]' : showStageAction ? 'border-emerald-300/24 bg-emerald-300/[0.055]' : 'border-white/10 bg-black/22'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold leading-relaxed text-white/62">
                {locked
                  ? 'Doğru akıştan çıkan cevap.'
                  : orderWarning
                    ? 'İlk hatalı adımı temizle.'
                  : matched
                    ? 'Akış hazır; sonucu kontrol et.'
                    : slotCount === build.slots.length
                      ? 'Sırayı kontrol et.'
                      : 'Blokları sıraya koy; sonuç burada açılır.'}
              </p>
              <div className="flex min-w-[150px] flex-col gap-2">
                <div className={`rounded-2xl border px-4 py-3 text-center ${locked ? 'border-emerald-300/40 bg-emerald-300/12 text-emerald-100' : 'border-white/12 bg-white/[0.035] text-white/38'}`}>
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">{locked ? 'sonuç' : orderWarning ? 'düzelt' : matched ? 'kontrol et' : 'sonuç yeri'}</p>
                  <p className="mt-1 text-lg font-black">{locked ? mission.resultLabel : '???'}</p>
                </div>
                {showStageAction && (
                  <motion.button
                    type="button"
                    data-testid="algorithm-flow-line-stage-check"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCheck}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-300/34 bg-emerald-300/16 px-3 text-sm font-black text-emerald-50 shadow-[0_0_24px_rgba(16,185,129,0.14)] transition hover:border-emerald-200/70"
                  >
                    {locked ? <ArrowRight className="h-4 w-4" /> : <TestTube2 className="h-4 w-4" />}
                    {stageActionLabel}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-3 rounded-3xl border border-cyan-300/16 bg-black/30 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/75">bloklar</p>
            <p className="mt-1 text-xs font-bold text-white/50">
              {isFull && !locked ? 'Düzeltmek için yukarıdaki ilk hatalı kutuya dokun.' : 'Seçtiğin blok ilk boş yuvaya gider.'}
            </p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {mission.available.map((blockId) => {
            const block = getFlowBlock(blockId, mission);
            const selected = hasBlock(build, blockId);
            return (
              <motion.button
                key={block.id}
                type="button"
                data-testid={`algorithm-flow-line-block-${block.id}`}
                whileHover={selected || locked || (isFull && !selected) ? undefined : { y: -2 }}
                whileTap={selected || locked || (isFull && !selected) ? undefined : { scale: 0.97 }}
                disabled={selected || locked || (isFull && !selected)}
                onClick={() => onPlaceBlock(block.id)}
                className={`min-h-[76px] rounded-2xl border p-3 text-left transition ${
                  selected || (isFull && !selected)
                    ? 'border-white/10 bg-white/[0.035] text-white/32'
                    : blockToneClass[block.tone]
                }`}
              >
                <span className="block text-sm font-black">{block.label}</span>
                <span className="mt-1 block text-xs font-bold leading-snug text-white/55">
                  {selected ? 'Akışa yerleşti.' : isFull ? 'Önce üstte bir kutuyu boşalt.' : block.detail}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
