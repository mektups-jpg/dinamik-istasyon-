import { Box, Route, Sparkles, Star } from 'lucide-react';
import type { HologramDesignTask } from './hologramDesignBase2Tasks';

interface ModelPartData {
  label: string;
  missing: boolean;
}

const BLOCK_MISSING_INDEX: Record<string, number> = {
  'Küp baş': 0,
  'Silindir gövde': 1,
  'Küre teker': 2,
};

const ROUTE_TARGETS = [
  { label: 'Ay kapısı', short: 'Ay', row: 1, col: 1 },
  { label: 'Yıldız kapısı', short: 'Yıldız', row: 2, col: 2 },
  { label: 'Güneş kapısı', short: 'Güneş', row: 2, col: 3 },
];

export function getHologramDisplayCode(task: HologramDesignTask) {
  if (task.kind !== 'block-build' && task.kind !== 'shape-build') return task.code;
  return getModelParts(task).map((part) => (part.missing ? '?' : part.label)).join(' + ');
}

export function DesignVisual({ task }: { task: HologramDesignTask }) {
  if (task.kind === 'route-map') return <RouteMap task={task} />;
  if (task.kind === 'mirror-axis') return <MirrorPanel color={task.color} asymmetric={false} />;
  if (task.kind === 'asymmetric') return <MirrorPanel color={task.color} asymmetric />;
  if (task.kind === 'number-pattern') return <NumberPattern prompt={task.prompt} color={task.color} />;
  if (task.kind === 'shape-pattern') return <ShapePattern color={task.color} />;
  if (task.kind === 'shape-build') return <ShapeBuild task={task} />;
  return <BlockBuild task={task} />;
}

function BlockBuild({ task }: { task: HologramDesignTask }) {
  const parts = getModelParts(task);

  return (
    <div className="grid min-h-72 place-items-center">
      <div className="flex flex-wrap items-end justify-center gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        {parts.map((part, index) => (
          <ModelPart key={`${part.label}-${index}`} part={part} color={task.color} />
        ))}
      </div>
    </div>
  );
}

function ShapeBuild({ task }: { task: HologramDesignTask }) {
  const parts = getModelParts(task);

  return (
    <div className="grid min-h-72 place-items-center">
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        {parts.map((part, index) => (
          <ModelPart key={`${part.label}-${index}`} part={part} color={task.color} flat />
        ))}
      </div>
    </div>
  );
}

function MirrorPanel({ color, asymmetric }: { color: string; asymmetric: boolean }) {
  return (
    <div className="grid min-h-72 place-items-center">
      <div className="relative grid h-72 w-full max-w-lg grid-cols-2 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="absolute left-1/2 top-5 h-[calc(100%-2.5rem)] w-1 -translate-x-1/2 rounded-full" style={{ background: color, boxShadow: `0 0 28px ${color}` }} />
        <Wing side="left" color={color} missing={false} />
        <Wing side="right" color={color} missing={asymmetric} />
      </div>
    </div>
  );
}

function NumberPattern({ prompt, color }: { prompt: string; color: string }) {
  const numbers = prompt.match(/\d+/g)?.slice(0, 3) ?? ['4', '7', '10'];

  return (
    <div className="flex min-h-72 flex-wrap items-center justify-center gap-4">
      {[...numbers, '?'].map((value, index) => (
        <div key={`${value}-${index}`} className="grid h-24 w-24 place-items-center rounded-3xl border border-white/10 bg-white/[0.06] text-4xl font-black" style={{ color: value === '?' ? color : '#FFFFFF' }}>
          {value}
        </div>
      ))}
    </div>
  );
}

function ShapePattern({ color }: { color: string }) {
  return (
    <div className="flex min-h-72 flex-wrap items-center justify-center gap-4">
      {[1, 2, 3].map((count) => (
        <StarCard key={count} count={count} color={color} />
      ))}
      <div className="grid h-28 w-28 place-items-center rounded-3xl border border-dashed border-white/28 bg-white/[0.04] text-5xl font-black" style={{ color }}>?</div>
    </div>
  );
}

function RouteMap({ task }: { task: HologramDesignTask }) {
  const route = getRoutePlan(task);

  return (
    <div className="grid min-h-72 place-items-center">
      <div className="grid grid-cols-4 gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        {Array.from({ length: 16 }).map((_, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const key = `${row}-${col}`;
          const target = ROUTE_TARGETS.find((item) => item.row === row && item.col === col);
          const isStart = row === route.start.row && col === route.start.col;
          const isPath = route.pathKeys.has(key);
          const isActiveTarget = target?.label === task.answer;

          return (
            <div
              key={index}
              data-route-target={target?.label}
              className={`grid h-16 w-16 place-items-center rounded-2xl border px-1 text-center text-[10px] font-black leading-tight ${
                isPath ? 'bg-[#38BDF8]/18' : 'bg-black/20'
              }`}
              style={{ borderColor: isPath ? `${task.color}88` : 'rgba(255,255,255,0.10)', boxShadow: isActiveTarget ? `0 0 24px ${task.color}55` : undefined }}
            >
              {isStart ? (
                <span className="flex flex-col items-center gap-1">
                  <Route className="h-5 w-5" style={{ color: task.color }} />
                  Başla
                </span>
              ) : target ? (
                <span className={isActiveTarget ? 'text-white' : 'text-white/62'}>
                  {isActiveTarget && <Star className="mx-auto mb-1 h-4 w-4 fill-yellow-300 text-yellow-300" />}
                  {target.short}
                </span>
              ) : isPath ? (
                <span style={{ color: task.color }}>yol</span>
              ) : ''}
            </div>
          );
        })}
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

function getRoutePlan(task: HologramDesignTask) {
  const match = task.code.match(/(\d+) sağa, (\d+) yukarı/);
  const right = match ? Number(match[1]) : 2;
  const up = match ? Number(match[2]) : 1;
  const start = { row: 3, col: 0 };
  const path = [start];

  for (let step = 1; step <= right; step += 1) path.push({ row: start.row, col: start.col + step });
  for (let step = 1; step <= up; step += 1) path.push({ row: start.row - step, col: start.col + right });

  return {
    start,
    pathKeys: new Set(path.map((point) => `${point.row}-${point.col}`)),
  };
}

function ModelPart({ part, color, flat = false }: { part: ModelPartData; color: string; flat?: boolean }) {
  if (part.missing) {
    return (
      <div className="grid h-28 w-28 place-items-center rounded-3xl border border-dashed border-white/28 bg-white/[0.04] text-5xl font-black" style={{ color }}>
        ?
      </div>
    );
  }

  return (
    <div className="flex min-h-28 w-28 flex-col items-center justify-center gap-2 rounded-3xl border border-white/16 bg-white/[0.08] p-3 text-center" style={{ boxShadow: `0 0 22px ${color}22` }}>
      <PartGlyph label={part.label} color={color} flat={flat} />
      <span className="text-xs font-black uppercase tracking-[0.08em] text-white/62">{part.label}</span>
    </div>
  );
}

function PartGlyph({ label, color, flat }: { label: string; color: string; flat: boolean }) {
  const normalized = label.toLocaleLowerCase('tr-TR');
  if (normalized.includes('silindir')) return <div className="h-16 w-11 rounded-full border border-white/20 bg-white/[0.08]" style={{ boxShadow: `0 0 24px ${color}44` }} />;
  if (normalized.includes('küre') || normalized.includes('teker') || normalized.includes('daire')) return <div className="h-16 w-16 rounded-full border border-white/20 bg-white/[0.08]" style={{ boxShadow: `0 0 24px ${color}44` }} />;
  if (normalized.includes('üçgen') || normalized.includes('prizma')) return <div className="text-6xl font-black leading-none" style={{ color }}>▲</div>;
  if (normalized.includes('dikdörtgen')) return <div className="h-14 w-20 rounded-2xl border border-white/20 bg-white/[0.08]" style={{ boxShadow: `0 0 24px ${color}44` }} />;
  if (normalized.includes('kare')) return <div className="h-16 w-16 rounded-2xl border border-white/20 bg-white/[0.08]" style={{ boxShadow: `0 0 24px ${color}44` }} />;
  return flat ? <Sparkles className="h-12 w-12" style={{ color }} /> : <Box className="h-12 w-12" style={{ color }} />;
}

function Wing({ side, color, missing }: { side: 'left' | 'right'; color: string; missing: boolean }) {
  return (
    <div className={`flex items-center ${side === 'left' ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
      <div className={`h-32 w-24 rounded-[3rem] border border-white/16 ${missing ? 'opacity-25' : ''}`} style={{ background: `${color}22`, boxShadow: `0 0 28px ${color}33` }} />
    </div>
  );
}

function StarCard({ count, color }: { count: number; color: string }) {
  return (
    <div className="grid h-28 w-28 grid-cols-2 place-items-center rounded-3xl border border-white/10 bg-white/[0.06] p-3">
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} className="h-6 w-6 fill-yellow-300 text-yellow-300" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      ))}
    </div>
  );
}
