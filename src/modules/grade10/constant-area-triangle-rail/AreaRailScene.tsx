import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { apexX, areaFrame, areaTargets } from './areaRailModel';
import { AreaDragTarget, AreaMeasure, AreaRailState } from './types';

interface AreaRailSceneProps {
  state: AreaRailState;
  activeIndex: number;
  measure: AreaMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: AreaDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: AreaDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function AreaRailScene({
  state,
  activeIndex,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: AreaRailSceneProps) {
  const target = areaTargets[activeIndex];
  const cX = apexX(state.apexProgress);
  const targetX = apexX(target.targetProgress);

  return (
    <section
      data-testid="constant-area-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(34,211,238,0.17),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(251,191,36,0.13),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.4.3</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Sabit Alan Üçgen Rayı</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${areaFrame.width} ${areaFrame.height}`}
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="area-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="area-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={areaFrame.width} height={areaFrame.height} fill="url(#area-grid)" />
        <rect x="62" y="52" width="776" height="560" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <ParallelRail targetX={targetX} activeIndex={activeIndex} />
        <TriangleField cX={cX} missionOk={missionOk} />
        <ApexHandle
          x={cX}
          progress={state.apexProgress}
          color={target.accent}
          onPointerDown={(event) => onPointerDown('apex', event)}
          onKeyDown={(event) => onKeyDown('apex', event)}
        />
        <AreaReadout measure={measure} missionOk={missionOk} />
      </svg>
    </section>
  );
}

function ParallelRail({ targetX, activeIndex }: { targetX: number; activeIndex: number }) {
  return (
    <g>
      <line x1={areaFrame.railLeft} y1={areaFrame.railY} x2={areaFrame.railRight} y2={areaFrame.railY} stroke="rgba(34,211,238,0.28)" strokeWidth="16" strokeLinecap="round" />
      <line x1={areaFrame.baseLeft} y1={areaFrame.baseY} x2={areaFrame.baseRight} y2={areaFrame.baseY} stroke="rgba(255,255,255,0.24)" strokeWidth="16" strokeLinecap="round" />
      <text x="450" y="130" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="15" fontWeight="900">tepe noktası bu paralel rayda kayar</text>
      <TargetRing testId="constant-area-left-target" x={apexX(areaTargets[0].targetProgress)} active={activeIndex === 0} color="#22D3EE" label="sol" />
      <TargetRing testId="constant-area-right-target" x={apexX(areaTargets[1].targetProgress)} active={activeIndex === 1} color="#A78BFA" label="sağ" />
      <TargetRing testId="constant-area-mid-target" x={apexX(areaTargets[2].targetProgress)} active={activeIndex === 2} color="#FBBF24" label="mühür" />
      <line x1={targetX} y1={areaFrame.railY - 68} x2={targetX} y2={areaFrame.baseY + 40} stroke="rgba(255,255,255,0.22)" strokeDasharray="8 10" strokeWidth="2" />
    </g>
  );
}

function TargetRing({ testId, x, active, color, label }: { testId: string; x: number; active: boolean; color: string; label: string }) {
  return (
    <g data-testid={testId} className="pointer-events-none">
      <circle cx={x} cy={areaFrame.railY} r={active ? 33 : 23} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth={active ? 4 : 2} opacity={active ? 0.95 : 0.42} filter={active ? 'url(#area-glow)' : undefined} />
      <text x={x} y={areaFrame.railY + 58} textAnchor="middle" fill={color} fontSize="14" fontWeight="950" opacity={active ? 1 : 0.72}>{label}</text>
    </g>
  );
}

function TriangleField({ cX, missionOk }: { cX: number; missionOk: boolean }) {
  const baseMid = (areaFrame.baseLeft + areaFrame.baseRight) / 2;
  return (
    <g>
      <polygon
        points={`${areaFrame.baseLeft},${areaFrame.baseY} ${areaFrame.baseRight},${areaFrame.baseY} ${cX},${areaFrame.railY}`}
        fill={missionOk ? 'rgba(110,231,183,0.2)' : 'rgba(34,211,238,0.14)'}
        stroke={missionOk ? '#6EE7B7' : '#E0F2FE'}
        strokeWidth="5"
        strokeLinejoin="round"
        filter="url(#area-glow)"
      />
      <line x1={cX} y1={areaFrame.railY} x2={cX} y2={areaFrame.baseY} stroke="#FBBF24" strokeWidth="5" strokeDasharray="12 10" filter="url(#area-glow)" />
      <rect x={areaFrame.baseLeft} y={areaFrame.baseY + 24} width={areaFrame.baseRight - areaFrame.baseLeft} height="34" rx="17" fill="rgba(34,211,238,0.1)" stroke="#22D3EE" />
      <text x={baseMid} y={areaFrame.baseY + 48} textAnchor="middle" fill="#BAE6FD" fontSize="14" fontWeight="950">sabit taban AB</text>
      <rect x={cX + 12} y={(areaFrame.railY + areaFrame.baseY) / 2 - 18} width="118" height="28" rx="14" fill="rgba(3,7,13,0.72)" stroke="rgba(251,191,36,0.28)" />
      <text x={cX + 70} y={(areaFrame.railY + areaFrame.baseY) / 2 + 2} textAnchor="middle" fill="#FEF3C7" fontSize="15" fontWeight="950">yükseklik aynı</text>
    </g>
  );
}

function ApexHandle({ x, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="constant-area-apex"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Tepe noktası C"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      transform={`translate(${x} ${areaFrame.railY})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
    >
      <circle r="34" fill="transparent" />
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#area-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="950">C</text>
    </g>
  );
}

function AreaReadout({ measure, missionOk }: { measure: AreaMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="166" y="542" width="568" height="62" rx="24" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="568" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="900">Alan = taban · yükseklik / 2</text>
      <motion.text
        x="450"
        y="592"
        textAnchor="middle"
        fill={missionOk ? '#D1FAE5' : '#E0F2FE'}
        fontSize="18"
        fontWeight="950"
        animate={{ opacity: missionOk ? [0.62, 1, 0.62] : 1 }}
        transition={{ duration: 1.2, repeat: missionOk ? Infinity : 0 }}
      >
        {measure.base} · {measure.height} / 2 = {measure.area} br²
      </motion.text>
    </g>
  );
}
