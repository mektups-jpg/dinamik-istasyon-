import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { buildMatches, evidenceLabel, matchingElementIds, quantifierLabels, quantifierText } from './quantifierRadarModel';
import type { QuantifierMission, RadarBuild, RadarElement, RadarElementId } from './types';

interface QuantifierRadarSceneProps {
  mission: QuantifierMission;
  build: RadarBuild;
  locked: boolean;
  onToggleElement: (elementId: RadarElementId) => void;
  onAutoAlign: () => void;
}

const nodeClass = {
  idle: 'border-cyan-200/30 bg-cyan-300/[0.08] text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)]',
  selected: 'border-emerald-200/55 bg-emerald-300/[0.16] text-emerald-50 shadow-[0_0_34px_rgba(0,255,136,0.28)]',
  wrong: 'border-rose-200/50 bg-rose-400/[0.14] text-rose-50 shadow-[0_0_30px_rgba(255,0,85,0.22)]',
};

export function QuantifierRadarScene({ mission, build, locked, onToggleElement, onAutoAlign }: QuantifierRadarSceneProps) {
  const matched = buildMatches(build, mission);
  const selectedElements = mission.elements.filter((element) => build.selectedIds.includes(element.id));
  const targetIds = matchingElementIds(mission);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Home') return;
    event.preventDefault();
    onAutoAlign();
  };

  return (
    <section
      data-testid="quantifier-radar-hunt-scene"
      tabIndex={0}
      aria-keyshortcuts="Home"
      onKeyDown={handleKeyDown}
      className="relative min-h-[640px] overflow-hidden rounded-[2rem] border border-lime-200/18 bg-[#030914]/88 p-4 shadow-[0_34px_90px_rgba(0,0,0,0.5)] outline-none focus:ring-2 focus:ring-lime-200/60 sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-14 h-52 w-52 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="absolute bottom-8 right-10 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:46px_46px] opacity-30" />
      </div>

      <div className="relative z-10 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-lime-100/70">küme cümlesi</p>
          <h2 className="mt-2 text-2xl font-black text-white">{mission.title}</h2>
          <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/65">küme</p>
            <p className="mt-1 text-lg font-black text-white">{mission.setLabel}</p>
          </div>
          <div className="mt-3 rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] p-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-lime-100/65">koşul</p>
            <p className="mt-1 text-lg font-black text-white">{mission.condition}</p>
          </div>
          <p className="mt-4 text-sm font-bold leading-relaxed text-white/68">{mission.prompt}</p>
        </div>

        <div className="relative min-h-[430px] rounded-[2rem] border border-white/10 bg-black/38 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/65">radar sahası</p>
              <h3 className="mt-1 text-xl font-black text-white">Elemanları tara</h3>
            </div>
            <div className={`rounded-2xl border px-3 py-2 text-right ${locked ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : matched ? 'border-amber-300/35 bg-amber-300/10 text-amber-100' : 'border-cyan-300/22 bg-cyan-300/[0.07] text-cyan-100'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">tarama</p>
              <p className="text-sm font-black">{locked ? 'mühürlü' : evidenceLabel(build, mission)}</p>
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-4 top-20 overflow-hidden rounded-[2rem] border border-cyan-300/12 bg-[#01050d]/80">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/12" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-300/12" />
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[1px] w-[44%] origin-left rounded-full bg-lime-200/45 shadow-[0_0_18px_rgba(190,242,100,0.75)]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: locked ? 3.4 : 5.2, repeat: Infinity, ease: 'linear' }}
            />
            {selectedElements.map((element) => (
              <div
                key={`beam-${element.id}`}
                className={`pointer-events-none absolute left-1/2 top-1/2 h-1 origin-left rounded-full ${element.matches ? 'bg-emerald-300/50 shadow-[0_0_18px_rgba(0,255,136,0.45)]' : 'bg-rose-300/45 shadow-[0_0_18px_rgba(255,0,85,0.35)]'}`}
                style={{
                  width: `${Math.hypot(element.x - 50, element.y - 50)}%`,
                  transform: `rotate(${Math.atan2(element.y - 50, element.x - 50)}rad)`,
                }}
              />
            ))}

            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-lime-200/35 bg-black/75 shadow-[0_0_40px_rgba(190,242,100,0.16)]">
              <div className="text-center">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/45">niceleyici</p>
                <p className="text-2xl font-black text-white">{quantifierText(build.quantifier)}</p>
              </div>
            </div>

            {mission.elements.map((element) => (
              <RadarNode
                key={element.id}
                element={element}
                selected={build.selectedIds.includes(element.id)}
                locked={locked}
                target={targetIds.includes(element.id)}
                onToggleElement={onToggleElement}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-black/32 p-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">kanıt hattı</p>
          <div className="mt-3 flex min-h-[58px] flex-wrap gap-2">
            {selectedElements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/14 px-4 py-3 text-sm font-bold text-white/42">Eleman seçilince kanıt hattına düşer.</div>
            ) : (
              selectedElements.map((element) => (
                <div
                  key={`evidence-${element.id}`}
                  className={`rounded-2xl border px-4 py-3 text-sm font-black ${element.matches ? 'border-emerald-300/30 bg-emerald-300/[0.09] text-emerald-100' : 'border-rose-300/30 bg-rose-300/[0.09] text-rose-100'}`}
                >
                  {element.label} · {element.detail}
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`rounded-3xl border p-4 ${locked ? 'border-emerald-300/32 bg-emerald-300/[0.08]' : 'border-white/10 bg-white/[0.035]'}`}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">sonuç mührü</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm font-bold leading-relaxed text-white/62">
              {locked ? 'Radar test edildi; niceleyici cümlesi artık okunabilir.' : 'Cümle testten önce kilitli kalır.'}
            </p>
            <div className={`min-w-[136px] rounded-2xl border px-4 py-3 text-center ${locked ? 'border-emerald-300/38 bg-black/24 text-emerald-100' : 'border-white/12 bg-black/22 text-white/36'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">{locked ? quantifierLabels[mission.quantifier].label : 'kilitli'}</p>
              <p className="mt-1 text-sm font-black">{locked ? mission.resultLabel : '???'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RadarNode({
  element,
  selected,
  locked,
  target,
  onToggleElement,
}: {
  element: RadarElement;
  selected: boolean;
  locked: boolean;
  target: boolean;
  onToggleElement: (elementId: RadarElementId) => void;
}) {
  const stateClass = selected ? (target ? nodeClass.selected : nodeClass.wrong) : nodeClass.idle;

  return (
    <motion.button
      type="button"
      data-testid={`quantifier-radar-hunt-element-${element.id}`}
      disabled={locked}
      whileHover={locked ? undefined : { y: -3 }}
      whileTap={locked ? undefined : { scale: 0.96 }}
      onClick={() => onToggleElement(element.id)}
      className={`absolute grid h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border text-center transition ${stateClass}`}
      style={{ left: `${element.x}%`, top: `${element.y}%` }}
    >
      <span className="text-3xl font-black leading-none">{element.label}</span>
      <span className="text-[10px] font-black text-white/62">{selected ? element.detail : 'tara'}</span>
    </motion.button>
  );
}
