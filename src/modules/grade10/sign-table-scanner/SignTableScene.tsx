import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import {
  areRootsMatched,
  progressToRailX,
  rootLeftX,
  rootRightX,
  signFrame,
  signTargets,
} from './signTableModel';
import { SignDragTarget, SignMeasure, SignScannerState } from './types';

interface SignTableSceneProps {
  state: SignScannerState;
  activeIndex: number;
  measure: SignMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: SignDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: SignDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function SignTableScene({
  state,
  activeIndex,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: SignTableSceneProps) {
  const target = signTargets[activeIndex];
  const leftX = rootLeftX(state.rootLeft);
  const rightX = rootRightX(state.rootRight);
  const leftTargetX = rootLeftX(1);
  const rightTargetX = rootRightX(1);
  const rootsOk = areRootsMatched(state);

  return (
    <section
      data-testid="sign-table-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(34,211,238,0.17),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(110,231,183,0.13),transparent_32%),radial-gradient(circle_at_52%_78%,rgba(251,191,36,0.12),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.2.6</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">İşaret Bandı Tarayıcısı</h2>
          <p className="mt-1 text-xs font-black text-sky-100/62">Akış: kökleri bul -&gt; &gt;0 dış bant -&gt; &lt;0 iç bant</p>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${signFrame.width} ${signFrame.height}`}
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="sign-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="sign-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={signFrame.width} height={signFrame.height} fill="url(#sign-grid)" />
        <rect x="62" y="52" width="776" height="560" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <ParabolaSensor leftX={leftX} rightX={rightX} rootsOk={rootsOk} activeIndex={activeIndex} />
        <NumberLine
          leftX={leftX}
          rightX={rightX}
          leftTargetX={leftTargetX}
          rightTargetX={rightTargetX}
          positiveProgress={state.positiveBand}
          negativeProgress={state.negativeBand}
          activeIndex={activeIndex}
        />

        <RootStop
          testId="sign-root-left"
          x={leftX}
          label="sol"
          progress={state.rootLeft}
          color="#22D3EE"
          onPointerDown={(event) => onPointerDown('root-left', event)}
          onKeyDown={(event) => onKeyDown('root-left', event)}
        />
        <RootStop
          testId="sign-root-right"
          x={rightX}
          label="sağ"
          progress={state.rootRight}
          color="#A78BFA"
          onPointerDown={(event) => onPointerDown('root-right', event)}
          onKeyDown={(event) => onKeyDown('root-right', event)}
        />
        <BandControl
          testId="sign-positive-band"
          target="positive-band"
          label=">0 dış bölgeler"
          y={530}
          progress={state.positiveBand}
          color="#6EE7B7"
          active={activeIndex === 1}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        />
        <BandControl
          testId="sign-negative-band"
          target="negative-band"
          label="<0 iç bölge"
          y={584}
          progress={state.negativeBand}
          color="#FBBF24"
          active={activeIndex === 2}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        />
        <text x="450" y="624" textAnchor="middle" fill="rgba(255,255,255,0.64)" fontSize="14" fontWeight="900">{measure.expression}</text>
      </svg>
    </section>
  );
}

function ParabolaSensor({ leftX, rightX, rootsOk, activeIndex }: { leftX: number; rightX: number; rootsOk: boolean; activeIndex: number }) {
  const graphTop = 104;
  const graphLeft = 126;
  return (
    <g transform={`translate(${graphLeft} ${graphTop})`}>
      <rect width="648" height="234" rx="28" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.11)" />
      <line x1="54" y1="164" x2="594" y2="164" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <path d="M 82 74 C 204 226, 420 226, 548 74" fill="none" stroke={rootsOk ? '#E0F2FE' : 'rgba(224,242,254,0.34)'} strokeWidth="6" strokeLinecap="round" filter="url(#sign-glow)" />
      <line x1={leftX - graphLeft} y1="54" x2={leftX - graphLeft} y2="202" stroke="#22D3EE" strokeWidth="3" strokeDasharray="8 8" />
      <line x1={rightX - graphLeft} y1="54" x2={rightX - graphLeft} y2="202" stroke="#A78BFA" strokeWidth="3" strokeDasharray="8 8" />
      <rect x="198" y="14" width="252" height="30" rx="15" fill="rgba(3,7,13,0.72)" stroke="rgba(255,255,255,0.14)" />
      <text x="324" y="34" textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize="14" fontWeight="950">parabol sensörü yukarı bakıyor</text>
      {activeIndex > 0 && (
        <g opacity="0.9">
          <rect x="52" y="174" width="136" height="30" rx="12" fill="rgba(110,231,183,0.16)" stroke="#6EE7B7" />
          <rect x="230" y="174" width="188" height="30" rx="12" fill="rgba(251,191,36,0.16)" stroke="#FBBF24" />
          <rect x="462" y="174" width="136" height="30" rx="12" fill="rgba(110,231,183,0.16)" stroke="#6EE7B7" />
          <text x="120" y="194" textAnchor="middle" fill="#D1FAE5" fontSize="13" fontWeight="900">+</text>
          <text x="324" y="194" textAnchor="middle" fill="#FEF3C7" fontSize="13" fontWeight="900">-</text>
          <text x="530" y="194" textAnchor="middle" fill="#D1FAE5" fontSize="13" fontWeight="900">+</text>
        </g>
      )}
    </g>
  );
}

function NumberLine({
  leftX,
  rightX,
  leftTargetX,
  rightTargetX,
  positiveProgress,
  negativeProgress,
  activeIndex,
}: {
  leftX: number;
  rightX: number;
  leftTargetX: number;
  rightTargetX: number;
  positiveProgress: number;
  negativeProgress: number;
  activeIndex: number;
}) {
  const y = signFrame.numberLineY;
  const positiveOpacity = activeIndex === 1 ? 0.18 + positiveProgress * 0.82 : 0.3;
  const negativeOpacity = activeIndex === 2 ? 0.18 + negativeProgress * 0.82 : 0.3;
  return (
    <g>
      <line x1="132" y1={y} x2="768" y2={y} stroke="rgba(255,255,255,0.25)" strokeWidth="8" strokeLinecap="round" />
      <line x1="210" y1={y - 96} x2="360" y2={y - 96} stroke="#22D3EE" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      <line x1="540" y1={y - 96} x2="690" y2={y - 96} stroke="#A78BFA" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      <rect x="392" y={y - 112} width="116" height="30" rx="15" fill="rgba(3,7,13,0.7)" stroke="rgba(255,255,255,0.14)" />
      <text x="450" y={y - 92} textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="950">çakışmaz boşluk</text>
      <text x="285" y={y - 108} textAnchor="middle" fill="#BAF6FF" fontSize="12" fontWeight="950">sol kök rayı</text>
      <text x="615" y={y - 108} textAnchor="middle" fill="#DDD6FE" fontSize="12" fontWeight="950">sağ kök rayı</text>
      <TargetLaser x={leftTargetX} y={y} label="x=2" color="#22D3EE" />
      <TargetLaser x={rightTargetX} y={y} label="x=3" color="#A78BFA" />
      <line x1="132" y1={y - 30} x2={leftX - 20} y2={y - 30} stroke="#6EE7B7" strokeWidth="18" strokeLinecap="round" opacity={positiveOpacity} />
      <line x1={rightX + 20} y1={y - 30} x2="768" y2={y - 30} stroke="#6EE7B7" strokeWidth="18" strokeLinecap="round" opacity={positiveOpacity} />
      <line x1={leftX + 20} y1={y + 30} x2={rightX - 20} y2={y + 30} stroke="#FBBF24" strokeWidth="18" strokeLinecap="round" opacity={negativeOpacity} />
      <text x="450" y={y + 76} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize="16" fontWeight="950">kökler sayı doğrusunu + / - / + bölgelerine ayırır</text>
    </g>
  );
}

function TargetLaser({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g className="pointer-events-none">
      <line x1={x} y1={y - 132} x2={x} y2={y + 74} stroke={color} strokeWidth="3" strokeDasharray="5 10" opacity="0.68" />
      <motion.line
        x1={x}
        y1={y - 132}
        x2={x}
        y2={y + 74}
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.16"
        animate={{ opacity: [0.08, 0.24, 0.08] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <rect x={x - 36} y={y + 84} width="72" height="30" rx="15" fill="rgba(3,7,13,0.78)" stroke={color} strokeWidth="2" />
      <text x={x} y={y + 105} textAnchor="middle" fill={color} fontSize="14" fontWeight="950">{label}</text>
    </g>
  );
}

function RootStop({ testId, x, label, progress, color, onPointerDown, onKeyDown }: {
  testId: string;
  x: number;
  label: string;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid={testId}
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label={`Kök durağı ${label}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      transform={`translate(${x} ${signFrame.numberLineY})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
    >
      <line y1="-92" y2="52" stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#sign-glow)" />
      <circle r="24" fill="#07111c" stroke={color} strokeWidth="4" filter="url(#sign-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">{label}</text>
    </g>
  );
}

function BandControl({ testId, target, label, y, progress, color, active, onPointerDown, onKeyDown }: {
  testId: string;
  target: SignDragTarget;
  label: string;
  y: number;
  progress: number;
  color: string;
  active: boolean;
  onPointerDown: (target: SignDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (target: SignDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const x = progressToRailX(progress);
  return (
    <g opacity={active || progress >= 0.9 ? 1 : 0.42}>
      <text x={signFrame.railX - 18} y={y + 5} textAnchor="end" fill="rgba(255,255,255,0.64)" fontSize="12" fontWeight="900">{label}</text>
      <line x1={signFrame.railX} y1={y} x2={signFrame.railX + signFrame.railWidth} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth="14" strokeLinecap="round" />
      <line x1={signFrame.railX} y1={y} x2={x} y2={y} stroke={color} strokeWidth="7" strokeLinecap="round" />
      <g
        data-testid={testId}
        role="slider"
        tabIndex={0}
        focusable="true"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        transform={`translate(${x} ${y})`}
        onPointerDown={(event) => onPointerDown(target, event)}
        onKeyDown={(event) => onKeyDown(target, event)}
        style={{ cursor: 'grab' }}
      >
        <circle r="28" fill="transparent" />
        <circle r="20" fill="#07111c" stroke={color} strokeWidth="4" filter="url(#sign-glow)" />
        <circle r="6" fill="#fff" />
      </g>
      {progress >= 0.9 && (
        <motion.text
          x={signFrame.railX + signFrame.railWidth + 20}
          y={y + 5}
          fill={color}
          fontSize="13"
          fontWeight="900"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          kilit
        </motion.text>
      )}
    </g>
  );
}
