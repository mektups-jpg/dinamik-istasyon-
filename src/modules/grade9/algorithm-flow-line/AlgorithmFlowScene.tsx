import type { CSSProperties, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import {
  buildMatches,
  completedSlotCount,
  flowBlocks,
  hasBlock,
} from './algorithmFlowModel';
import type { FlowBlockId, FlowBuild, FlowMission } from './types';

interface AlgorithmFlowSceneProps {
  mission: FlowMission;
  build: FlowBuild;
  locked: boolean;
  onPlaceBlock: (blockId: FlowBlockId) => void;
  onRemoveSlot: (index: number) => void;
  onAutoAlign: () => void;
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
  onPlaceBlock,
  onRemoveSlot,
  onAutoAlign,
}: AlgorithmFlowSceneProps) {
  const matched = buildMatches(build, mission);
  const slotCount = completedSlotCount(build);

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
      className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-cyan-300/18 bg-[#030812]/88 p-4 shadow-[0_34px_90px_rgba(0,0,0,0.48)] outline-none focus:ring-2 focus:ring-cyan-300/60 sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-10 top-20 h-48 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35" />
      </div>

      <div className="relative z-10 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-white/10 bg-black/28 p-4 backdrop-blur">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/75">problem kartı</p>
          <h2 className="mt-2 text-2xl font-black text-white">{mission.title}</h2>
          <p className="mt-3 text-sm font-bold leading-relaxed text-white/72">{mission.story}</p>
          <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200/70">soru</p>
            <p className="mt-1 text-lg font-black text-white">{mission.question}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/75">akış hattı</p>
              <h3 className="mt-1 text-xl font-black text-white">Blokları sıraya diz</h3>
            </div>
            <div className={`rounded-2xl border px-3 py-2 text-right ${locked ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : matched ? 'border-amber-300/35 bg-amber-300/10 text-amber-100' : 'border-cyan-300/24 bg-cyan-300/8 text-cyan-100'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-70">durum</p>
              <p className="text-sm font-black">{locked ? 'mühür açık' : matched ? 'test hazır' : `${slotCount}/${build.slots.length} blok`}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-[repeat(var(--slot-count),minmax(0,1fr))] gap-3" style={{ '--slot-count': build.slots.length } as CSSProperties}>
            {build.slots.map((slot, index) => {
              const block = slot ? flowBlocks[slot] : null;
              const filled = Boolean(block);
              return (
                <div key={`slot-${index}`} className="relative">
                  {index > 0 && (
                    <div className={`absolute right-[calc(100%+0.25rem)] top-1/2 h-1 w-4 -translate-y-1/2 rounded-full ${filled || build.slots[index - 1] ? 'bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.65)]' : 'bg-white/12'}`} />
                  )}
                  <motion.button
                    type="button"
                    data-testid={slotTestIds[index]}
                    whileTap={filled && !locked ? { scale: 0.97 } : undefined}
                    onClick={() => !locked && filled && onRemoveSlot(index)}
                    className={`flex min-h-[142px] w-full flex-col items-center justify-center rounded-3xl border p-3 text-center transition ${
                      block
                        ? blockToneClass[block.tone]
                        : 'border-dashed border-white/16 bg-black/28 text-white/38'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] opacity-65">adım {index + 1}</span>
                    <span className="mt-2 text-lg font-black">{block?.shortLabel ?? 'blok bekler'}</span>
                    <span className="mt-2 text-xs font-bold leading-snug text-white/58">{block?.label ?? 'Akış buraya uğrayacak.'}</span>
                  </motion.button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 min-h-[104px] rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/42">sonuç mührü</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-sm font-bold leading-relaxed text-white/62">
                {locked ? 'Akış test edildi; sonuç cümlesi artık güvenle okunabilir.' : 'Sonuç testten önce gizli kalır; önce süreci kur.'}
              </p>
              <div className={`min-w-[140px] rounded-2xl border px-4 py-3 text-center ${locked ? 'border-emerald-300/40 bg-emerald-300/12 text-emerald-100' : 'border-white/12 bg-white/[0.035] text-white/38'}`}>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">{locked ? 'sonuç' : 'kilitli'}</p>
                <p className="mt-1 text-lg font-black">{locked ? mission.resultLabel : '???'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-3xl border border-cyan-300/16 bg-black/34 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/75">blok havuzu</p>
            <p className="mt-1 text-sm font-bold text-white/54">Her dokunuş bloğu ilk boş yuvaya taşır.</p>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black text-white/58 sm:block">
            Bloklar soldan sağa akar
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {mission.available.map((blockId) => {
            const block = flowBlocks[blockId];
            const selected = hasBlock(build, blockId);
            return (
              <motion.button
                key={block.id}
                type="button"
                data-testid={`algorithm-flow-line-block-${block.id}`}
                whileHover={selected || locked ? undefined : { y: -2 }}
                whileTap={selected || locked ? undefined : { scale: 0.97 }}
                disabled={selected || locked}
                onClick={() => onPlaceBlock(block.id)}
                className={`min-h-[92px] rounded-2xl border p-3 text-left transition ${
                  selected
                    ? 'border-white/10 bg-white/[0.035] text-white/32'
                    : blockToneClass[block.tone]
                }`}
              >
                <span className="block text-sm font-black">{block.label}</span>
                <span className="mt-1 block text-xs font-bold leading-snug text-white/55">{selected ? 'Akışa yerleşti.' : block.detail}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
