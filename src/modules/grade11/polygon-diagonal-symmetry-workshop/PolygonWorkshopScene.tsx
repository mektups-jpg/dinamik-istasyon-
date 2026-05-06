import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import {
  answerOptions,
  polygonPath,
  polygonTargets,
  progressToRailX,
  sidesToProgress,
  workshopFrame,
} from './polygonWorkshopModel';
import { Point, PolygonDragTarget, PolygonWorkshopMeasure, PolygonWorkshopState } from './types';

interface PolygonWorkshopSceneProps {
  state: PolygonWorkshopState;
  activeIndex: number;
  measure: PolygonWorkshopMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: PolygonDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: PolygonDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
  onSelectAnswer: (answer: number) => void;
}

export function PolygonWorkshopScene({
  state,
  activeIndex,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onSelectAnswer,
}: PolygonWorkshopSceneProps) {
  const target = polygonTargets[activeIndex];
  const revealedDiagonalCount = Math.round(measure.diagonals.length * measure.activeProgress);
  const exteriorSweep = Math.round(360 * state.exteriorWalk);
  const symmetrySweep = Math.round(state.symmetryScan * state.sides);

  return (
    <section
      data-testid="polygon-workshop-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.15),transparent_33%),radial-gradient(circle_at_78%_20%,rgba(251,191,36,0.13),transparent_30%),radial-gradient(circle_at_58%_76%,rgba(167,139,250,0.12),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.2.4</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Çokgen Kalibrasyon Masası</h2>
        </div>
        <div className={`w-full max-w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-left sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${workshopFrame.width} ${workshopFrame.height}`}
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="polygon-workshop-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="polygon-workshop-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="polygon-table-surface" x1="0%" x2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.12)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.045)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.12)" />
          </linearGradient>
        </defs>

        <rect width={workshopFrame.width} height={workshopFrame.height} fill="url(#polygon-workshop-grid)" />
        <rect x="72" y="56" width="756" height="664" rx="38" fill="url(#polygon-table-surface)" stroke="rgba(255,255,255,0.13)" />
        <circle cx="448" cy="250" r="178" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <circle cx="448" cy="250" r="126" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

        <g opacity={activeIndex === 0 ? 1 : 0.28}>
          <DiagonalLayer diagonals={measure.diagonals} scan={state.diagonalScan} accent="#22D3EE" />
        </g>
        <g opacity={activeIndex === 1 ? 1 : 0.22}>
          <ExteriorWalkLayer points={measure.points} scan={state.exteriorWalk} sides={state.sides} />
        </g>
        <g opacity={activeIndex === 2 ? 1 : 0.2}>
          <SymmetryLayer sides={state.sides} scan={state.symmetryScan} accent="#A78BFA" />
        </g>

        <motion.polygon
          points={polygonPath(measure.points)}
          fill="rgba(255,255,255,0.055)"
          stroke={target.accent}
          strokeWidth="4"
          filter="url(#polygon-workshop-glow)"
          animate={{ opacity: [0.82, 1, 0.82] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {measure.points.map((point, index) => (
          <g key={`polygon-vertex-${index}`}>
            <circle cx={point.x} cy={point.y} r="18" fill={`${target.accent}25`} stroke={target.accent} strokeWidth="2.5" />
            <circle cx={point.x} cy={point.y} r="6" fill="#fff" />
            <text x={point.x} y={point.y - 27} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{index + 1}</text>
          </g>
        ))}

        <g transform="translate(92 78)">
          <rect width="190" height="128" rx="24" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.12)" />
          <text x="20" y="31" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="900">ÇOKGEN</text>
          <text x="20" y="69" fill="#fff" fontSize="31" fontWeight="900">n={state.sides}</text>
          <text x="20" y="99" fill={target.accent} fontSize="13" fontWeight="900">HEDEF: {target.shortLabel}</text>
        </g>

        <g transform="translate(618 76)">
          <rect width="190" height="174" rx="24" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.12)" />
          <text x="20" y="31" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="900">CANLI OKUMA</text>
          <Reading y={63} label="köşegen" value={`${revealedDiagonalCount}/${measure.diagonalCount}`} color="#22D3EE" />
          <Reading y={99} label="dış açı" value={`${exteriorSweep}°`} color="#FBBF24" />
          <Reading y={135} label="simetri" value={`${symmetrySweep}/${state.sides}`} color="#A78BFA" />
        </g>

        <g transform="translate(262 400)">
          {answerOptions[activeIndex].map((answer, index) => (
            <AnswerPad
              key={answer}
              answer={answer}
              unit={target.answerUnit}
              x={index * 126}
              selected={state.selectedAnswer === answer}
              correct={missionOk && answer === target.correctAnswer}
              accent={target.accent}
              onSelectAnswer={onSelectAnswer}
            />
          ))}
        </g>

        <ControlRail
          testId="polygon-vertex-dial"
          label="kenar sayısı"
          valueLabel={`${state.sides}`}
          y={workshopFrame.railY - 96}
          progress={sidesToProgress(state.sides)}
          color="#67E8F9"
          onPointerDown={(event) => onPointerDown('vertex-dial', event)}
          onKeyDown={(event) => onKeyDown('vertex-dial', event)}
        />
        <ControlRail
          testId="polygon-diagonal-burst"
          label="köşegen lazeri"
          valueLabel={`%${Math.round(state.diagonalScan * 100)}`}
          y={workshopFrame.railY - 32}
          progress={state.diagonalScan}
          color="#22D3EE"
          inactive={activeIndex !== 0}
          onPointerDown={(event) => onPointerDown('diagonal-burst', event)}
          onKeyDown={(event) => onKeyDown('diagonal-burst', event)}
        />
        <ControlRail
          testId="polygon-exterior-walker"
          label="dış açı yürüyüşü"
          valueLabel={`%${Math.round(state.exteriorWalk * 100)}`}
          y={workshopFrame.railY + 32}
          progress={state.exteriorWalk}
          color="#FBBF24"
          inactive={activeIndex !== 1}
          onPointerDown={(event) => onPointerDown('exterior-walker', event)}
          onKeyDown={(event) => onKeyDown('exterior-walker', event)}
        />
        <ControlRail
          testId="polygon-symmetry-mirror"
          label="simetri aynası"
          valueLabel={`%${Math.round(state.symmetryScan * 100)}`}
          y={workshopFrame.railY + 96}
          progress={state.symmetryScan}
          color="#A78BFA"
          inactive={activeIndex !== 2}
          onPointerDown={(event) => onPointerDown('symmetry-mirror', event)}
          onKeyDown={(event) => onKeyDown('symmetry-mirror', event)}
        />
      </svg>
    </section>
  );
}

function DiagonalLayer({ diagonals, scan, accent }: { diagonals: [Point, Point][]; scan: number; accent: string }) {
  const visibleCount = Math.round(diagonals.length * scan);
  return (
    <g>
      {diagonals.slice(0, visibleCount).map(([from, to], index) => (
        <motion.line
          key={`diagonal-${index}-${from.x}-${to.x}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={accent}
          strokeWidth={index % 3 === 0 ? 3.5 : 2.5}
          strokeOpacity={0.48 + (index % 3) * 0.14}
          filter="url(#polygon-workshop-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.18 }}
        />
      ))}
    </g>
  );
}

function ExteriorWalkLayer({ points, scan, sides }: { points: Point[]; scan: number; sides: number }) {
  const center = { x: 448, y: 250 };
  const radius = 170;
  const sweep = Math.max(1, scan * 359.9);
  const walkerIndex = Math.min(points.length - 1, Math.floor(scan * points.length));
  const walker = points[walkerIndex] ?? points[0];

  return (
    <g>
      <path d={arcPath(center, radius, -90, -90 + sweep)} fill="none" stroke="#FBBF24" strokeWidth="13" strokeLinecap="round" opacity="0.82" filter="url(#polygon-workshop-glow)" />
      {Array.from({ length: sides }, (_, index) => {
        const angle = -90 + (index * 360) / sides;
        const point = polarPoint(center, radius, angle);
        return <circle key={`exterior-dot-${index}`} cx={point.x} cy={point.y} r="5" fill={scan > index / sides ? '#FDE68A' : 'rgba(255,255,255,0.22)'} />;
      })}
      <g transform={`translate(${walker.x - 18} ${walker.y - 28})`}>
        <rect width="36" height="30" rx="12" fill="rgba(251,191,36,0.22)" stroke="#FBBF24" strokeWidth="2" />
        <circle cx="18" cy="15" r="5" fill="#fff" />
      </g>
      <text x="448" y="256" textAnchor="middle" fill="#FDE68A" fontSize="28" fontWeight="900">{Math.round(360 * scan)}°</text>
    </g>
  );
}

function SymmetryLayer({ sides, scan, accent }: { sides: number; scan: number; accent: string }) {
  const center = { x: 448, y: 250 };
  const visibleAxes = Math.round(sides * scan);

  return (
    <g>
      {Array.from({ length: visibleAxes }, (_, index) => {
        const angle = -90 + (index * 180) / sides;
        const from = polarPoint(center, 184, angle);
        const to = polarPoint(center, 184, angle + 180);
        return (
          <line
            key={`axis-${index}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={accent}
            strokeWidth="3"
            strokeDasharray={index % 2 === 0 ? '12 9' : '4 8'}
            strokeOpacity="0.82"
            filter="url(#polygon-workshop-glow)"
          />
        );
      })}
      <circle cx="448" cy="250" r="28" fill="rgba(167,139,250,0.16)" stroke={accent} strokeWidth="2" />
      <text x="448" y="256" textAnchor="middle" fill="#EDE9FE" fontSize="18" fontWeight="900">{visibleAxes}</text>
    </g>
  );
}

function Reading({ y, label, value, color }: { y: number; label: string; value: string; color: string }) {
  return (
    <g>
      <circle cx="24" cy={y - 5} r="5" fill={color} />
      <text x="40" y={y} fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="900">{label}</text>
      <text x="162" y={y} textAnchor="end" fill="#fff" fontSize="15" fontWeight="900">{value}</text>
    </g>
  );
}

function AnswerPad({ answer, unit, x, selected, correct, accent, onSelectAnswer }: {
  answer: number;
  unit: string;
  x: number;
  selected: boolean;
  correct: boolean;
  accent: string;
  onSelectAnswer: (answer: number) => void;
}) {
  const stroke = correct ? '#6EE7B7' : selected ? accent : 'rgba(255,255,255,0.28)';
  return (
    <g
      data-testid={`polygon-answer-${answer}`}
      role="button"
      tabIndex={0}
      focusable="true"
      transform={`translate(${x} 0)`}
      onClick={() => onSelectAnswer(answer)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectAnswer(answer);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <rect width="108" height="58" rx="18" fill={selected ? `${accent}24` : 'rgba(255,255,255,0.055)'} stroke={stroke} strokeWidth={selected || correct ? 3 : 1.5} />
      <text x="54" y="37" textAnchor="middle" fill={selected || correct ? '#fff' : 'rgba(255,255,255,0.68)'} fontSize="18" fontWeight="900">{answer}{unit}</text>
    </g>
  );
}

function ControlRail({ testId, label, valueLabel, y, progress, color, inactive = false, onPointerDown, onKeyDown }: {
  testId: string;
  label: string;
  valueLabel: string;
  y: number;
  progress: number;
  color: string;
  inactive?: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const x = progressToRailX(progress);
  return (
    <g opacity={inactive ? 0.46 : 1}>
      <text x={workshopFrame.railX - 18} y={y + 5} textAnchor="end" fill="rgba(255,255,255,0.64)" fontSize="12" fontWeight="900">{label}</text>
      <text x={workshopFrame.railX + workshopFrame.railWidth + 18} y={y + 5} fill={color} fontSize="12" fontWeight="900">{valueLabel}</text>
      <line x1={workshopFrame.railX} y1={y} x2={workshopFrame.railX + workshopFrame.railWidth} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
      <line x1={workshopFrame.railX} y1={y} x2={x} y2={y} stroke={color} strokeWidth="6" strokeLinecap="round" />
      <g
        data-testid={testId}
        role="slider"
        tabIndex={0}
        focusable="true"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label={label}
        transform={`translate(${x} ${y})`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        style={{ cursor: 'grab' }}
      >
        <circle r="18" fill="#07111c" stroke={color} strokeWidth="4" filter="url(#polygon-workshop-glow)" />
        <circle r="6" fill="#fff" />
      </g>
    </g>
  );
}

function polarPoint(center: Point, radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: center.x + Math.cos(radians) * radius,
    y: center.y + Math.sin(radians) * radius,
  };
}

function arcPath(center: Point, radius: number, startAngle: number, endAngle: number) {
  const start = polarPoint(center, radius, startAngle);
  const end = polarPoint(center, radius, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
