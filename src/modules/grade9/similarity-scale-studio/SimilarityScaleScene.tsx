import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { buildMatches, evidenceLabel, isTargetPair } from './similarityScaleModel';
import type { PairOption, SimilarityBuild, SimilarityMission, SimilarityPairId, TriangleModel, TrianglePoint } from './types';

interface SimilarityScaleSceneProps {
  mission: SimilarityMission;
  build: SimilarityBuild;
  locked: boolean;
  onTogglePair: (pairId: SimilarityPairId) => void;
  onSetScale: (scale: number) => void;
  onAutoAlign: () => void;
}

const angleIndex: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 0,
  E: 1,
  F: 2,
};

const sideIndex: Record<string, number> = {
  AB: 0,
  DE: 0,
  AC: 1,
  DF: 1,
  BC: 2,
  EF: 2,
};

const scaleTestIds: Record<string, string> = {
  '1.25': 'similarity-scale-studio-scale-1-25',
  '1.5': 'similarity-scale-studio-scale-1-5',
  '2': 'similarity-scale-studio-scale-2',
  '3': 'similarity-scale-studio-scale-3',
};

export function SimilarityScaleScene({
  mission,
  build,
  locked,
  onTogglePair,
  onSetScale,
  onAutoAlign,
}: SimilarityScaleSceneProps) {
  const matched = buildMatches(build, mission);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Home') return;
    event.preventDefault();
    onAutoAlign();
  };

  return (
    <section
      data-testid="similarity-scale-studio-scene"
      tabIndex={0}
      aria-keyshortcuts="Home"
      onKeyDown={handleKeyDown}
      className="relative min-h-[650px] overflow-hidden rounded-[2rem] border border-teal-200/18 bg-[#03110f]/88 p-4 shadow-[0_34px_90px_rgba(0,0,0,0.5)] outline-none focus:ring-2 focus:ring-teal-200/60 sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-16 h-56 w-56 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="absolute bottom-8 right-10 h-60 w-60 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:46px_46px] opacity-30" />
      </div>

      <div className="relative z-10 grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-teal-100/70">benzerlik hedefi</p>
          <h2 className="mt-2 text-xl font-black leading-tight text-white">{mission.title}</h2>
          <div className="mt-4 grid gap-3">
            <InfoCard label="şart" value={mission.mode === 'angles' ? 'karşılıklı açılar eş' : 'karşılıklı kenarlar orantılı'} />
            <InfoCard label="kanıt" value={evidenceLabel(build, mission)} />
          </div>
          {mission.mode === 'ratio' ? (
            <div className="mt-4 rounded-2xl border border-amber-300/18 bg-amber-300/[0.055] p-3">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/70">ölçek seç</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {mission.scaleOptions?.map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    data-testid={scaleTestIds[String(scale)]}
                    disabled={locked}
                    onClick={() => onSetScale(scale)}
                    className={`min-h-12 rounded-2xl border text-sm font-black transition ${
                      build.scale === scale
                        ? 'border-amber-200/55 bg-amber-300/[0.16] text-amber-50 shadow-[0_0_24px_rgba(251,191,36,0.15)]'
                        : 'border-white/10 bg-black/22 text-white/62 hover:border-amber-200/35'
                    }`}
                  >
                    k={scale}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/38 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/65">eşleştirme sahası</p>
              <h3 className="mt-1 text-xl font-black text-white">İki üçgeni kanıtla</h3>
            </div>
            <div className={`rounded-2xl border px-3 py-2 text-right ${locked ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : matched ? 'border-amber-300/35 bg-amber-300/10 text-amber-100' : 'border-teal-300/22 bg-teal-300/[0.07] text-teal-100'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">durum</p>
              <p className="text-sm font-black">{locked ? 'mühürlü' : matched ? 'test hazır' : evidenceLabel(build, mission)}</p>
            </div>
          </div>

          <svg viewBox="50 70 660 330" className="h-[430px] w-full rounded-[1.75rem] border border-white/10 bg-[#010807]/82">
            <defs>
              <filter id="similarity-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <TriangleDrawing model={mission.source} title="küçük üçgen" tone="#2DD4BF" />
            <TriangleDrawing model={mission.target} title="büyüyen üçgen" tone="#FBBF24" />
            {build.selectedPairs.map((pairId) => (
              <PairBeam key={pairId} pairId={pairId} mission={mission} valid={isTargetPair(mission, pairId)} />
            ))}
          </svg>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-3xl border border-white/10 bg-black/34 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">kanıt parçaları</p>
            <p className="mt-1 text-sm font-bold text-white/55">Parçalar sahnede çizgiye dönüşür; sonuç testten önce kilitli kalır.</p>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black text-white/58 sm:block">
            {mission.mode === 'angles' ? 'açı eşliği' : 'kenar oranı'}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {mission.availablePairs.map((pair) => (
            <PairButton
              key={pair.id}
              pair={pair}
              selected={build.selectedPairs.includes(pair.id)}
              valid={isTargetPair(mission, pair.id)}
              locked={locked}
              onTogglePair={onTogglePair}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-black/32 p-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">kanıt hattı</p>
          <div className="mt-3 flex min-h-[58px] flex-wrap gap-2">
            {build.selectedPairs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/14 px-4 py-3 text-sm font-bold text-white/42">Eşleşme seçilince kanıt hattına düşer.</div>
            ) : (
              build.selectedPairs.map((pairId) => {
                const option = mission.availablePairs.find((pair) => pair.id === pairId);
                const valid = isTargetPair(mission, pairId);
                return (
                  <div
                    key={`proof-${pairId}`}
                    className={`rounded-2xl border px-4 py-3 text-sm font-black ${valid ? 'border-emerald-300/30 bg-emerald-300/[0.09] text-emerald-100' : 'border-rose-300/30 bg-rose-300/[0.09] text-rose-100'}`}
                  >
                    {option?.label} · {option?.detail}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={`rounded-3xl border p-4 ${locked ? 'border-emerald-300/32 bg-emerald-300/[0.08]' : 'border-white/10 bg-white/[0.035]'}`}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">sonuç mührü</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm font-bold leading-relaxed text-white/62">
              {locked ? 'Stüdyo test edildi; benzerlik kanıtı artık okunabilir.' : 'Benzerlik kararı testten önce kilitli kalır.'}
            </p>
            <div className={`min-w-[145px] rounded-2xl border px-4 py-3 text-center ${locked ? 'border-emerald-300/38 bg-black/24 text-emerald-100' : 'border-white/12 bg-black/22 text-white/36'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">{locked ? 'kanıt' : 'kilitli'}</p>
              <p className="mt-1 text-sm font-black">{locked ? mission.resultLabel : '???'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TriangleDrawing({ model, title, tone }: { model: TriangleModel; title: string; tone: string }) {
  const polygon = model.points.map((point) => `${point.x},${point.y}`).join(' ');
  return (
    <g>
      <text x={centroid(model.points).x} y="88" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="15" fontWeight="900">{title}</text>
      <polygon points={polygon} fill={`${tone}22`} stroke={tone} strokeWidth="5" strokeLinejoin="round" filter="url(#similarity-glow)" />
      {model.points.map((point, index) => (
        <g key={model.labels[index]}>
          <circle cx={point.x} cy={point.y} r="18" fill="#020617" stroke={tone} strokeWidth="4" />
          <text x={point.x} y={point.y + 6} textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">{model.labels[index]}</text>
          <text x={point.x} y={point.y - 28} textAnchor="middle" fill={tone} fontSize="13" fontWeight="900">{model.angles[index]}°</text>
        </g>
      ))}
      <SideValue first={model.points[0]} second={model.points[1]} value={model.sides[0]} tone={tone} dy={26} />
      <SideValue first={model.points[0]} second={model.points[2]} value={model.sides[1]} tone={tone} dy={-12} />
      <SideValue first={model.points[1]} second={model.points[2]} value={model.sides[2]} tone={tone} dy={-12} />
    </g>
  );
}

function PairBeam({ pairId, mission, valid }: { pairId: SimilarityPairId; mission: SimilarityMission; valid: boolean }) {
  const [first, second] = pairId.split('-');
  const firstPoint = pointForToken(mission.source, first.toUpperCase());
  const secondPoint = pointForToken(mission.target, second.toUpperCase());
  if (!firstPoint || !secondPoint) return null;

  return (
    <motion.line
      x1={firstPoint.x}
      y1={firstPoint.y}
      x2={secondPoint.x}
      y2={secondPoint.y}
      stroke={valid ? '#00FF88' : '#FF6B9A'}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="10 10"
      filter="url(#similarity-glow)"
      animate={{ strokeDashoffset: [0, -40] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function PairButton({
  pair,
  selected,
  valid,
  locked,
  onTogglePair,
}: {
  pair: PairOption;
  selected: boolean;
  valid: boolean;
  locked: boolean;
  onTogglePair: (pairId: SimilarityPairId) => void;
}) {
  return (
    <motion.button
      type="button"
      data-testid={`similarity-scale-studio-pair-${pair.id}`}
      disabled={locked}
      whileHover={locked ? undefined : { y: -2 }}
      whileTap={locked ? undefined : { scale: 0.97 }}
      onClick={() => onTogglePair(pair.id)}
      className={`min-h-[88px] rounded-2xl border p-3 text-left transition ${
        selected
          ? valid
            ? 'border-emerald-300/38 bg-emerald-300/[0.10] text-emerald-100 shadow-[0_0_22px_rgba(0,255,136,0.12)]'
            : 'border-rose-300/35 bg-rose-300/[0.10] text-rose-100'
          : 'border-cyan-300/18 bg-cyan-300/[0.055] text-cyan-50 hover:border-cyan-200/36'
      }`}
    >
      <span className="block text-sm font-black">{pair.label}</span>
      <span className="mt-1 block text-xs font-bold leading-snug text-white/55">{pair.detail}</span>
    </motion.button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-1 text-base font-black text-white">{value}</p>
    </div>
  );
}

function SideValue({ first, second, value, tone, dy }: { first: TrianglePoint; second: TrianglePoint; value: number; tone: string; dy: number }) {
  const middle = midpoint(first, second);
  return <text x={middle.x} y={middle.y + dy} textAnchor="middle" fill={tone} fontSize="14" fontWeight="900">{value}</text>;
}

function pointForToken(model: TriangleModel, token: string): TrianglePoint | null {
  const angle = angleIndex[token];
  if (angle !== undefined) return model.points[angle];

  const side = sideIndex[token];
  if (side === 0) return midpoint(model.points[0], model.points[1]);
  if (side === 1) return midpoint(model.points[0], model.points[2]);
  if (side === 2) return midpoint(model.points[1], model.points[2]);
  return null;
}

function midpoint(first: TrianglePoint, second: TrianglePoint): TrianglePoint {
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}

function centroid(points: TriangleModel['points']): TrianglePoint {
  return {
    x: (points[0].x + points[1].x + points[2].x) / 3,
    y: (points[0].y + points[1].y + points[2].y) / 3,
  };
}
