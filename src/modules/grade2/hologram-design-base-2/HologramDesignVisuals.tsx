import { Sparkles } from 'lucide-react';
import type { HologramDesignTask } from './hologramDesignBase2Tasks';

interface ModelPartData {
  label: string;
  missing: boolean;
}

const BLOCK_MISSING_INDEX: Record<string, number> = {
  Küp: 0,
  Silindir: 1,
  Küre: 2,
};

export function DesignVisual({ task }: { task: HologramDesignTask }) {
  if (task.kind === 'shape-build') return <ShapeBuild task={task} />;
  return <BlockBuild task={task} />;
}

function BlockBuild({ task }: { task: HologramDesignTask }) {
  const parts = getModelParts(task);
  const [head, body, base] = parts;

  return (
    <div className="grid min-h-72 place-items-center">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="absolute inset-x-10 bottom-12 h-10 rounded-full bg-[#38BDF8]/10 blur-xl" />
        <div className="relative mx-auto flex max-w-sm flex-col items-center">
          <div className="mb-1 flex flex-col items-center">
            <div className="h-5 w-1 rounded-full bg-white/24" />
            <div className="h-3 w-3 rounded-full" style={{ background: task.color, boxShadow: `0 0 16px ${task.color}88` }} />
          </div>
          <RobotSlot part={head} color={task.color} className="h-28 w-36" />
          <div className="relative my-2 flex w-full items-center justify-center">
            <div className="mr-3 h-5 flex-1 rounded-full border border-white/12 bg-white/[0.05] shadow-[0_0_18px_rgba(255,255,255,0.08)]" />
            <RobotSlot part={body} color={task.color} className="h-36 w-44" />
            <div className="ml-3 h-5 flex-1 rounded-full border border-white/12 bg-white/[0.05] shadow-[0_0_18px_rgba(255,255,255,0.08)]" />
          </div>
          <RobotSlot part={base} color={task.color} className="h-28 w-36" />
          <div className="mt-2 flex w-36 items-center justify-between px-4">
            <div className="h-3 w-10 rounded-full border border-white/12 bg-white/[0.06]" />
            <div className="h-3 w-10 rounded-full border border-white/12 bg-white/[0.06]" />
          </div>
        </div>
        <p className="relative mt-4 text-center text-sm font-black text-white/76">Gölgedeki cismin adını seç.</p>
      </div>
    </div>
  );
}

function ShapeBuild({ task }: { task: HologramDesignTask }) {
  const parts = getModelParts(task);

  return (
    <div className="grid min-h-72 place-items-center">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="absolute bottom-12 left-14 right-14 h-8 rounded-full bg-white/[0.06]" />
        <div className="absolute left-1/2 top-10 h-24 w-40 -translate-x-1/2 rounded-t-[3rem] border border-white/12 bg-white/[0.04]" />
        <div className="relative mx-auto flex max-w-md flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-[2rem] border border-white/10 bg-[#06131F]/78 p-4">
            {parts.map((part, index) => (
              <ModelPart key={`${part.label}-${index}`} part={part} color={task.color} flat />
            ))}
          </div>
          <div className="mt-4 flex w-72 items-center justify-between px-8">
            <div className="h-11 w-11 rounded-full border-4 border-white/16 bg-black/28 shadow-[0_0_18px_rgba(255,255,255,0.10)]" />
            <div className="h-11 w-11 rounded-full border-4 border-white/16 bg-black/28 shadow-[0_0_18px_rgba(255,255,255,0.10)]" />
          </div>
        </div>
        <p className="relative mt-4 text-center text-sm font-black text-white/76">Gölgedeki düz şeklin adını seç.</p>
      </div>
    </div>
  );
}

function getModelParts(task: HologramDesignTask): ModelPartData[] {
  const labels = task.code.split(' + ');
  const missingIndex = getMissingIndex(task, labels);

  return labels.map((label, index) => ({ label, missing: index === missingIndex }));
}

function getMissingIndex(task: HologramDesignTask, labels: string[]) {
  if (task.kind === 'block-build') return BLOCK_MISSING_INDEX[task.answer] ?? labels.length - 1;

  const answerShape = task.answer.split(' ')[0]?.toLocaleLowerCase('tr-TR');
  const directMatch = labels.findIndex((label) => label.toLocaleLowerCase('tr-TR') === answerShape);
  if (directMatch >= 0) return directMatch;

  return labels.length - 1;
}

function RobotSlot({ part, color, className }: { part?: ModelPartData; color: string; className: string }) {
  if (!part) return null;
  return <ModelPart part={part} color={color} className={className} />;
}

function ModelPart({ part, color, flat = false, roleLabel, className }: { part: ModelPartData; color: string; flat?: boolean; roleLabel?: string; className?: string }) {
  const sizeClass = className ?? 'h-28 w-28';

  if (part.missing) {
    return (
      <div
        className={`grid ${sizeClass} place-items-center rounded-3xl border border-dashed bg-[#102338] text-center`}
        style={{ borderColor: `${color}99`, color, boxShadow: `inset 0 0 28px ${color}28, 0 0 24px ${color}22` }}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {roleLabel && <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/60">{roleLabel}</p>}
          <div className="rounded-2xl bg-black/24 p-2 opacity-60 saturate-50">
            <PartGlyph label={part.label} color={color} flat={flat} ghost />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/78">Adını seç</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${sizeClass} flex-col items-center justify-center gap-2 rounded-3xl border border-white/20 bg-white/[0.11] p-3 text-center`} style={{ boxShadow: `0 0 26px ${color}30` }}>
      {roleLabel && <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/58">{roleLabel}</span>}
      <PartGlyph label={part.label} color={color} flat={flat} />
      <span className="text-xs font-black uppercase tracking-[0.08em] text-white/82">{part.label}</span>
    </div>
  );
}

function PartGlyph({ label, color, flat, ghost = false }: { label: string; color: string; flat: boolean; ghost?: boolean }) {
  const normalized = label.toLocaleLowerCase('tr-TR');
  if (normalized.includes('silindir')) return <CylinderGlyph color={color} />;
  if (normalized.includes('küp')) return <CubeGlyph color={color} />;
  if (normalized.includes('küre')) return <SphereGlyph color={color} ghost={ghost} />;
  if (normalized.includes('teker') || normalized.includes('daire')) return <CircleGlyph color={color} />;
  if (normalized.includes('üçgen') || normalized.includes('prizma')) return <div className="text-6xl font-black leading-none" style={{ color }}>▲</div>;
  if (normalized.includes('dikdörtgen')) return <div className="h-14 w-20 rounded-2xl border border-white/28" style={{ background: color, boxShadow: `0 0 24px ${color}55` }} />;
  if (normalized.includes('kare')) return <div className="h-16 w-16 rounded-2xl border border-white/28" style={{ background: color, boxShadow: `0 0 24px ${color}55` }} />;
  return flat ? <Sparkles className="h-12 w-12" style={{ color }} /> : <CubeGlyph color={color} />;
}

function CubeGlyph({ color }: { color: string }) {
  return (
    <svg className="h-16 w-16" viewBox="0 0 72 72" aria-hidden="true" style={{ filter: `drop-shadow(0 0 18px ${color}66)` }}>
      <path d="M36 8 58 20.5v25L36 58 14 45.5v-25L36 8Z" fill={color} opacity="0.72" />
      <path d="M36 8 58 20.5v25L36 58 14 45.5v-25L36 8Z" fill="none" stroke="white" strokeLinejoin="round" strokeWidth="3" opacity="0.82" />
      <path d="M14 20.5 36 33l22-12.5M36 33v25" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" opacity="0.62" />
      <path d="M25 17 47 29.5" stroke="white" strokeLinecap="round" strokeWidth="2.2" opacity="0.32" />
    </svg>
  );
}

function SphereGlyph({ color, ghost }: { color: string; ghost: boolean }) {
  return (
    <div
      className="relative h-16 w-16 rounded-full border border-white/32"
      style={{
        background: `radial-gradient(circle at 30% 24%, rgba(255,255,255,${ghost ? 0.78 : 0.92}) 0 10%, ${color} 32%, rgba(6,16,28,0.72) 100%)`,
        boxShadow: `inset -10px -12px 18px rgba(0,0,0,0.34), inset 8px 8px 16px rgba(255,255,255,0.18), 0 0 24px ${color}55`,
      }}
    >
      <div className="absolute left-3 top-3 h-3 w-4 rounded-full bg-white/62 blur-[1px]" />
      <div className="absolute inset-x-2 bottom-1 h-2 rounded-full bg-black/24 blur-sm" />
    </div>
  );
}

function CircleGlyph({ color }: { color: string }) {
  return (
    <div
      className="h-16 w-16 rounded-full border border-white/30"
      style={{
        background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.46))`,
        boxShadow: `0 0 24px ${color}55`,
      }}
    />
  );
}

function CylinderGlyph({ color }: { color: string }) {
  return (
    <svg className="h-16 w-16" viewBox="0 0 72 72" aria-hidden="true" style={{ filter: `drop-shadow(0 0 18px ${color}66)` }}>
      <path d="M18 20v30c0 8 36 8 36 0V20" fill={color} opacity="0.72" />
      <path d="M18 20v30c0 8 36 8 36 0V20" fill="none" stroke="white" strokeLinejoin="round" strokeWidth="3.2" opacity="0.72" />
      <ellipse cx="36" cy="20" rx="18" ry="8" fill={color} stroke="white" strokeWidth="3.2" />
      <ellipse cx="36" cy="20" rx="9" ry="3.6" fill="white" opacity="0.36" />
      <path d="M18 50c0 8 36 8 36 0" fill="none" stroke="white" strokeLinecap="round" strokeWidth="3.2" />
      <path d="M25 25v22" stroke="white" strokeLinecap="round" strokeWidth="2.4" opacity="0.44" />
    </svg>
  );
}
